---
title: Gitlab runner pod failing to start "runner-config" not found
draft: false
tags:
  - Solutions
  - Kubernetes
  - ArgoCD
  - Gitlab
---

## Diagnostic

If you're trying to deploy an apps.gitlab.com/v1beta2 Runner on Kubernetes / Openshift through ArgoCD, you might encounter the following issue preventing the runner pod from starting.

"MountVolume.SetUp failed for volume "scripts" : configmap "{YOUR\_RUNNER\_NAME}-runner-config" not found"

![Screenshot of the bug on an Openshift cluster with app.kubernetes.io/instance: gitlab-standard-runner](https://nefast.me/content/images/2025/03/image.png)

## Explanation

This bug is caused by the fact that the Gitlab runner operator tries to use the `app.kubernetes.io/instance` label as an alternative name to retrieve the associated configmaps / secrets to the runner (in my screenshot you can see that the pod looks for a configmap called "{LABEL\_VALUE}-runner-config"

This isn't an issue if you deploy the operator manually, but this becomes one as the default behaviour of ArgoCD is to also override the `app.kubernetes.io/instance` label value to the name of the application deploying the ressource (in this case the runner)

## Resolution

Since you can't modify the value of the `app.kubernetes.io/instance` label without ArgoCD always complaining about an OutOfSync ressource, you'll have to change the tracking method of ArgoCD to instead use annotations, or another label.

Here's how to do-so: [Resource Tracking - Argo CD - Declarative GitOps CD for Kubernetes](https://argo-cd.readthedocs.io/en/latest/user-guide/resource_tracking/)
Either use the "annotation" mode of tracking, or change the `application.instanceLabelKey` value to use another label.
