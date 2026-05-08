---
title: MIG Slices Not Advertised as Allocatable by NVIDIA GPU Operator
draft: false
tags:
  - Solutions
  - Kubernetes
  - Openshift
  - NVIDIA
  - GPU
  - MIG
---

## Issue

After configuring MIG on a node, the NVIDIA GPU Operator does not advertise MIG slices
as individual allocatable resources. Instead, the full GPU is exposed as a single raw
resource, making per-slice scheduling impossible.

## Explanation

The GPU Operator supports two MIG strategies: `single` and `mixed`. With `single`, the
NVIDIA device plugin bundles all MIG instances together and advertises them as a generic
`nvidia.com/gpu` resource rather than individual slice resources. This is the default
Helm chart strategy.

## Resolution

Set the MIG strategy to `mixed`. This makes the device plugin advertise each MIG
instance as its own allocatable resource (e.g. `nvidia.com/mig-1g.10gb`).

Pass `--set mig.strategy=mixed` at install time:

```sh
helm install --wait --generate-name \
  -n gpu-operator --create-namespace \
  nvidia/gpu-operator \
  --set mig.strategy=mixed
```

Or patch an already-running `ClusterPolicy`:

```sh
kubectl patch clusterpolicy/gpu-cluster-policy --type='json' \
  -p='[{"op": "replace", "path": "/spec/mig/strategy", "value": "mixed"}]'
```

> **Note:** On Google Cloud, also set `WITH_REBOOT=true` on the MIG Manager to allow
> the node to reboot and apply the configuration.

Refer to the [official NVIDIA GPU Operator MIG documentation](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-mig.html).