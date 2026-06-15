---
title: Anthropic challenge - Part 1
draft: false
tags:
  - Projects
  - Side-projects
  - Optimization
---

If you've ever wondered what the technical challenge to join a company like Anthropic looks like, follow along.

5 months ago, Anthropic officially released, for everyone to try, the take-home challenge they used to give applicants (the repo is here: [anthropics/original_performance_takehome](https://github.com/anthropics/original_performance_takehome)).
Bored out of my mind on a week-end, I decided to take a shot at it over roughly 4h across two two-hour sessions (and somewhat failed).

Using AI is obviously a no-go as I was trying to see if I had what it took to join Anthropic.

## The challenge

### The program

You're given a simple tree-traversal-with-hashing program to optimize, written in the instruction set of a toy architecture. The rules are quite simple, get this program down to the minimum number of machine cycles. The baseline is 147734 cycles.

As a reference here's what various models could achieve:
- **2164 cycles**: Claude Opus 4 after many hours in the test-time compute harness
- **1790 cycles**: Claude Opus 4.5 in a casual Claude Code session, approximately matching the best human performance in 2 hours
- **1579 cycles**: Claude Opus 4.5 after 2 hours in Anthropic's test-time compute harness
- **1548 cycles**: Claude Sonnet 4.5 after many more than 2 hours of test-time compute
- **1487 cycles**: Claude Opus 4.5 after 11.5 hours in the harness
- **1363 cycles**: Claude Opus 4.5 in an improved test time compute harness

### The VM

This architecture has two main features that are not used (yet) by the program: VLIW and SIMD.

SIMD is pretty straightforward: a single instruction operates on multiple data elements in parallel (e.g., add eight 32-bit integers at once using one add instruction) that are stored contiguously in memory.

![SIMD](assets/anthropic-challenge/simd.png)

VLIW or Very Long Instruction Word basically means you get multiple independent operations per cycle; for example where a traditional CPU would run one instruction per clock (or several at once on the [superscalar](https://en.wikipedia.org/wiki/Superscalar_processor) cores that dominate modern CPUs), a VLIW CPU packs several independent instructions into a single wide instruction word and executes them all in parallel across dedicated functional units. If you've ever heard about Intel Itanium series processors (IA-64), they implement a form of VLIW through a paradigm called [EPIC](https://en.wikipedia.org/wiki/Explicitly_parallel_instruction_computing).

The emulated CPU has a limited amount of slots per unit, in a single "cycle" you can run:

- 12 ALU instructions (+, -, /, *, &, |, ^, <<, >>, %, ==, <)
- 6 VALU instructions (the same operations, but on a vector of 8 elements)
- 2 load instructions (load from memory, const, vload for vectors)
- 2 store instructions (store to memory, vstore for vectors)
- 1 flow instruction (jumps, branches, halt, select, trace writes)

## My attempt

I started by just looking, it took me the better part of an hour to:
- understand the CPU architecture.
- understand what the program was doing.
- understand the validation test format.
- understand where the program was inefficient.

Based on the acquired knowledge, my first goal was to start picking off the low-hanging fruit. While it wouldn't improve the cycle count that much, at least I would start to get more familiar with the kernel.

### Baseline

To help with your profiling, the emulator can generate traces that you can then observe using [Perfetto](https://ui.perfetto.dev/). These traces are emitted by the emulator and contain, for each cycle:
- the number of instructions per slot.
- a map of the memory.

Looking at the baseline trace reveals a lot:

![Baseline trace](assets/anthropic-challenge/trace1.png)

As you can see, the kernel is currently only using 1 instruction slot for all ALU operations, same for memory store etc. Lots of room for improvement.

### Low-hanging fruit

The first low-hanging fruit (see commit [`25726ea`](https://github.com/NoOverflow/original_performance_takehome/commit/25726ea12663da98cb5da7a1677d0a6717628b45)) is the redundant address math in the kernel's inner loop.

For every walker `i`, the same `base + i` offset gets computed four separate times: once to load the index, once to load the value, then again to store each of them back. But since `inp_indices_p` and `inp_values_p` sit right next to each other in memory, you really only need that offset once.

A single `vbroadcast` of `i` plus one vector `+` against the base pointer gives you both addresses at once, the index at `vlen_space` and the value at `vlen_space + 1`, and the loads and stores just point straight at those. That takes four scalar ALU ops down to two vector ops per iteration, and with the loop running 16 × 256 times, even a small saving like that piles up.

![First optimization](assets/anthropic-challenge/opt1.png)

Easy 5%.

### SIMD

The next step up (see commit [`c68c208`](https://github.com/NoOverflow/original_performance_takehome/commit/c68c208f2a9b8be29a7561e77d8517ccf781776d)) is going full SIMD: instead of grinding through the batch one walker at a time, the kernel now processes VLEN walkers per pass.

Everything in the inner loop gets rewritten in vector form. The per-walker offsets get built into vectors `tmp_idx`/`tmp_val`, then `inp_indices_p` and `inp_values_p` are broadcast across a vector and added in one shot, so all VLEN addresses come out together.

The reads and writes become `vload`/`vstore`, the hash runs on a whole vector of values at once with the stage constants pre-broadcast into `hash_const_space`, and the even-or-odd branch that picks left vs right child turns into a `vselect`.

![SIMD optimization](assets/anthropic-challenge/opt2.png)

Now we start to see real optimizations, with another quick x4.5 over baseline at 32335 cycles.

Another quick pass on the code made me realize the kernel was redoing work it didn't have to.
The three base pointers (`forest_values_p`, `inp_indices_p`, and `inp_values_p`) never change while the kernel runs, but every single time through the inner loop it was broadcasting them into vectors all over again. That's pure waste.

So I moved those broadcasts out of the loop and did them just once at the start, into their own vector registers, and let the inner loop reuse them.

With the loop running thousands of times, cutting a few repeated broadcasts on each pass is where most of the gain comes from, and it brought the count down to 30802 cycles.

### VLIW

The big one here is finally using the machine the way it's meant to be used and applying maximum pressure to our CPU pipelines.

Up to this point the kernel was packing one operation per instruction bundle, so even though the hardware can run several engines at once, it was firing them one at a time and wasting most of each cycle.

This last commit ([`dc6b2c4`](https://github.com/NoOverflow/original_performance_takehome/commit/dc6b2c4dbfca9087822eea03fb6e1a5094060044)) rewrites the `build` function so a bundle can hold a whole list of operations, and then goes through the loop grouping things that don't depend on each other so they ride in the same bundle and run together.

So all the startup broadcasts get fired in one go, the two address adds happen side by side, the copy-to-indices and the two vector loads share a bundle, and the node-value loads get paired up two at a time to fit what the load engine allows per cycle.

Inside the hash, the first two operations of each stage are independent, so those go together too, and the same trick is used on the select plus multiply and on the final stores.

Nothing about the actual math changed, it's just stuffing independent work into the same cycle instead of stretching it out. That alone took it from 30802 down to 14920 cycles, basically halving it.

This is however a very naive way of doing business with a VLIW architecture, as I'll reflect on in the following chapter. But as you can see, we're now getting much more slot pressure than baseline.

![VLIW trace](assets/anthropic-challenge/trace3.png)

## Where I failed

At this point, I quickly realised that even though I managed a good speed increase, there were two glaring issues:

- I had not fully internalized the code, and therefore not worked on the actual logic (which could have been improved). Every optimization so far was mechanical, packing the same operations more tightly, never questioning whether those operations needed to happen at all.
- You cannot apply good slot + memory pressure by hand-packing bundles "linearly" without your code turning into unmaintainable spaghetti. Every time I wanted to move one operation, I had to mentally re-track which engine had a free slot, which values were already live, and which dependencies I'd break. That doesn't scale past a few dozen instructions.

The second point is the important one, and it's a solved problem (that I didn't know about at the time): what I was doing by hand is exactly the job of an **instruction scheduler**. You hand it the straight-line, unpacked code plus a model of the machine (slot counts per engine, latencies, dependencies) and it figures out the packing for you, typically with [list scheduling](https://en.wikipedia.org/wiki/Instruction_scheduling) for straight-line code. That's how real VLIW compilers turn naive code into dense bundles, and it's where I should have gone next instead of packing bundles by hand like a monkey.

At this point, I was already getting quite bored with the problem and wanted to work on other things anyway. In part 2 (if it ever comes out) I'll try to do a better job of it, maybe using [Tinygrad](https://github.com/tinygrad/tinygrad)

Guess I won't join Anthropic anytime soon. Still had quite a bit of fun and learned a few things, lmao.
