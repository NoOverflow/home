---
title: Modifying a MachineSet's template spec doesn't cause a rollout
draft: false
tags:
  - Solutions
  - Openshift
  - Machine API Operator
---

## Diagnostic

Modifying a MachineSet's template spec doesn't recreate a machine.

## Explanation

The Machine operator is only meant for creation and deletion (See https://bugzilla.redhat.com/show_bug.cgi?id=1962066)
This is unfortunate as they had a good opportunity of providing an API for automatic rollout of machines.

## Resolution

Your best option is to recreate a new MachineSet, cordon + drain the old nodes and delete the old MachineSet when all pods are moved cleanly.