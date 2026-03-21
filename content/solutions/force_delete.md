---
title: CRD Stuck in `Terminating` Due to Missing Webhook
draft: false
tags:
  - Solutions
  - Kubernetes
  - Openshift
---

## Issue

Deleting a CRD hangs indefinitely in `Terminating` and never completes.

## Explanation

Kubernetes won't fully remove an object that has finalizers — instead, it sets a `deletionTimestamp` and waits. The CRD gets unstuck only once its finalizers are cleared.

The `customresourcecleanup.apiextensions.k8s.io` finalizer tries to clean up all CR instances before the CRD goes away, and does so by calling the operator's admission webhook. If the webhook is gone (e.g. after a partial uninstall), those calls fail, the finalizer never completes, and the CRD is stuck. To make things worse, once the CRD enters `InstanceDeletionInProgress`, the API server blocks writes to its CRs — so you can't remove the finalizer from the CRs either.

## Resolution

Forcibly remove the finalizer from the CRD:
```bash
kubectl patch crd <your-crd-name> \
  --type=json \
  -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
```

This unblocks the pending deletion and the CRD will disappear shortly after.

> [!warning] This skips the normal CR cleanup. Any existing CR instances may linger in etcd, which can cause unexpected behavior if the CRD is reinstalled later. Check for strays with `kubectl get <custom-resource> -A` after the CRD is gone.