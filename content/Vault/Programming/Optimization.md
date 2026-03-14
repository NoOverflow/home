## Parallelism

- Good introduction to parallelism from Ryan Fleury: https://www.dgtlgrove.com/p/multi-core-by-default
- Rust iterator optimization by batching: https://turbopuffer.com/blog/zero-cost

## Speculation, branch prediction

- Beating the L1 cache with value speculation: https://mazzo.li/posts/value-speculation.html

## Virtualization

- The APIC TPR register is accessed very often by Windows XP/Server 2003 and the way to make that bearable for virtualization pre-FlexPriority is to... patch the guest at runtime...: https://gitlab.com/qemu-project/qemu/-/blob/master/hw/i386/vapic.c (From @never_released on Twitter)