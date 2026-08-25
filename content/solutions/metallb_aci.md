---
title: Intermittent SSL_ERROR_SYSCALL and timeouts to a MetalLB L2 VIP on Cisco ACI
draft: false
tags:
  - Solutions
  - Openshift
  - MetalLB
  - Cisco ACI
  - Kubernetes
  - Networking
---

## Symptom

A MetalLB VIP fronting a kube-apiserver endpoint (`192.0.2.10:6443`) was intermittently unreachable. The failure had a very specific shape:

- Clients on the **same subnet** as the VIP: 100% success.
- Clients on a **different subnet** (inter-VLAN, routed): a mix of `SSL_ERROR_SYSCALL`, mid-connection resets, and outright timeouts.

`curl -vk` from a routed client showed the TCP handshake and often the full TLS handshake completing, then the connection dying on the first HTTP/2 application data with `errno 104` (ECONNRESET). Other attempts never got a SYN-ACK back at all and timed out. The same request from a same-subnet host always returned 200.

## What it looked like but wasn't

Several plausible causes were ruled out by evidence before the real one surfaced:

- **PMTU blackhole.** Dismissed: the TLS handshake completed with full-size certificate segments on the reset cases, and the timeout cases failed on a bare 60-byte SYN. Lowering MSS changed nothing.
- **MetalLB speaker flap.** Dismissed: `ServiceL2Status` was constant on the same node (worker-01), and `arping` for the VIP consistently returned the same MAC (worker-01). MetalLB was not moving the VIP.
- **Bad backend.** Dismissed: same-subnet clients used the same Service and backends and never failed. The only variable that flipped the outcome was whether the traffic was routed.
- **apiserver / etcd degradation.** Dismissed: same-subnet clients got 100% 200 OK against the same endpoint, so the server was healthy.

The failing cases pointed consistently at the routed path and at connection state being torn down, not at the endpoint.

## Root cause

The fabric was a Cisco ACI. Querying the APIC endpoint table for the VIP showed it learned on **two** different MACs, on **two** different VPCs, at the same time:

```
aa:bb:cc:00:00:01  192.0.2.10  ... vpc WORKER01_VPC
aa:bb:cc:00:00:02  192.0.2.10  ... vpc WORKER03_VPC
```

MetalLB was announcing the VIP from worker-01 only (confirmed by ARP), so why was ACI learning it on worker-03 as well?

ACI learns endpoint IPs from the data plane: any frame sourced from an IP causes the fabric to learn that IP behind the port it arrived on. In an OpenShift cluster, kube-proxy programs a DNAT rule for a LoadBalancer VIP on **every** node, not just the MetalLB announcer. Inspecting worker-03 confirmed it:

```
ip daddr 192.0.2.10 tcp dport 6443 counter ... dnat to 172.30.0.10:6443
```

So more than one node was a valid processing and sourcing point for the VIP's IP. Same-subnet clients never exposed this: they ARP the VIP, get worker-01's MAC, and send directly at L2, with no fabric routing decision. Routed clients force the fabric to pick a location for the endpoint, and because ACI kept relearning the VIP IP on whichever node last sourced a frame for it, the endpoint location oscillated between the two VPCs. The fabric forwards routed traffic to whichever location it learned last, so the destination flips per learn, and ACI's endpoint move machinery (bounce entries, endpoint move dampening, rogue endpoint control) can compound the disruption. The result is hairpinning and reset traffic for the routed flows. Traceroute from a routed client showed the VLAN gateway (`192.0.2.254`) appearing twice in the path, which is the hairpin made visible.

In short: **it is an incompatibility between the Cisco ACI IP dataplane learning mechanism and MetalLB L2 advertisement.** ACI learns the VIP IP from the data plane on whichever node last sourced a frame for it. Because the same VIP is processed and sourced on more than one node (per-node kube-proxy DNAT, plus the L2 owner), the fabric keeps relearning the VIP on two VPCs and treats it as an endpoint flap.

## Resolution

Disable IP dataplane learning for the bridge domain / subnet carrying the MetalLB VIPs. This stops ACI from chasing the VIP IP around the fabric based on data-plane frames, so the endpoint settles on the ARP-authoritative location (worker-01) and the flap disappears. Inter-VLAN reachability became stable immediately after the change.

Cisco documents disabling IP dataplane learning as the mitigation for exactly this class of problem: shared or floating virtual IPs that can be sourced from multiple locations, where data-plane traffic would cause the fabric to learn the VIP from multiple places. Red Hat also publishes a knowledgebase solution for MetalLB on ACI (see references).

The Cisco white paper documents specific constraints to apply alongside this change:

- The bridge domain must use L2 Unknown Unicast set to Flood, not Hardware Proxy.
- With IP dataplane learning disabled, GARP no longer triggers endpoint learning. Enable GARP-based EP Move Detection on the bridge domain (requires ARP Flooding and Unicast Routing) so that a MetalLB failover, which announces the VIP's new location via GARP, still updates the fabric. Without it, a speaker failover can leave the endpoint stuck on the old node.
- Keep the IP Aging policy enabled so unused local IP endpoints age out correctly via control-plane tracking.
- The option is not supported on bridge domains or EPGs stretched via Nexus Dashboard Orchestrator (Multi-Site).

## Alternative: MetalLB BGP mode

Disabling IP dataplane learning is a valid end state, but the design that avoids the conflict entirely is MetalLB in **BGP mode**. Instead of the VIP floating as an L2 endpoint that the fabric learns on multiple ports, the speaker nodes peer BGP with the fabric (via an L3Out) and advertise the VIP as a route. The fabric reaches it by routing to a node next-hop, failover is a routing convergence rather than a MAC move, and there is no data-plane IP learning of the VIP on multiple nodes to go wrong. On a routed fabric like ACI, BGP mode speaks the fabric's native language; L2 mode fights it.

## Takeaways

- On ACI, a VIP learned on two VPCs in the APIC endpoint table is the fingerprint to look for. It is not necessarily a MetalLB flap. `ServiceL2Status` and `arping` tell you whether the announcer is actually moving.
- The "same-subnet works, inter-VLAN fails" split is the strongest early signal that the problem is in how the routed fabric locates the endpoint, not in the endpoint itself.
- kube-proxy programs the LoadBalancer DNAT on every node, so more than one node can legitimately source a VIP's IP. That is enough to trigger data-plane relearning on a fabric that learns IPs from the data plane.
- Disable IP dataplane learning to stabilize L2 mode on ACI; move to BGP mode to remove the incompatibility at the design level.

## References

- Cisco, *ACI Fabric Endpoint Learning White Paper* — Disabling IP Dataplane Learning, forwarding behavior and design considerations: https://www.cisco.com/c/en/us/products/collateral/networking/cloud-networking/application-centric-infrastructure/fabric-endpoint-learning-wp.html#DisablingIPDataplaneLearningforwardingbehavioranddesignconsiderations
- Red Hat, *Solution 7119856*: https://access.redhat.com/solutions/7119856
