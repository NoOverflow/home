---
title: Permission denied when listing files on a mounted NFS volume
draft: false
tags:
  - Solutions
  - Openshift
  - NFS
  - Kubernetes
  - SELinux
  - Podman
---

## Issue

Trying to access a mounted NFS volume, either through a podman volume bind or a Kubernetes PVC mount, results in a permission denied even though:
- NFS RPC calls succeed (`NFS3_OK`, `NFS4_OK`)
- Linux UID / GID permissions are correct and the pod should have access to the volume.

SELinux is enabled, check with:
```bash
getenforce
```

SELinux flag `virt_use_nfs` is set to false, check with:
```bash
getsebool virt_use_nfs
```

## Explanation

On default Openshift installations, or custom Podmans', SELinux is enforced by default; this may cause issues with NFS volume mounts.
When SELinux is running with the `virt_use_nfs` set to off, the containerized processes are explicitly denied permission to interact with NFS shares.
This occurs because SELinux's type enforcement rules block the necessary interactions between the container's security context (e.g., container_t) and the NFS-related types (e.g., nfs_t).

## Resolution

Ideally this could be managed by the [Security Profiles Operator (SPO)](), but it isn't supported, last conversation about it staled out (https://github.com/kubernetes-sigs/security-profiles-operator/issues/1997).

The only current fix is to login manually into the node, either through `oc debug` or using SSH and issue the following command:

```bash
setsebool -P virt_use_nfs on
```

> [!info] Note: you can also run it without -P as a temporary troubleshoot measure, the flag will reset to the old value after a reset.

## Read more

- https://linux.die.net/man/8/virt_selinux