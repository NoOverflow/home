---
title: AgentGateway Cannot Find InferencePool as Backend (`BackendNotFound`)
draft: false
tags:
  - Solutions
  - Kubernetes
  - AgentGateway
  - IGW
---

## Issue

When routing traffic through AgentGateway to an `InferencePool` backend, the translator fails to resolve the backend reference and logs the following error:
```json
{"time":"2026-03-20T12:24:39.701030772Z","level":"error","msg":"erroring building agent gateway destination","component":"agentgateway/translator","error":{"Type":"ResolvedRefs","Status":"False","Reason":"BackendNotFound","Message":"backendRef default/inferencepool not found"}}
```

Despite the pool being apparently located (`"found pull pool for service"`), the destination cannot be built and the route condition is set to `ResolvedRefs: False`.

## Explanation

AgentGateway's translator successfully looks up the `InferencePool` object by namespace and name, but then fails to build a valid destination from it. This happens because support for `InferencePool` backends relies on the **Inference Extension** feature, which is disabled by default in the Helm chart.

Without this feature flag enabled, AgentGateway does not register the necessary reconcilers and endpoint resolution logic for `InferencePool` resources. As a result, even though the object exists in the cluster, the translator cannot construct a valid backend destination and raises `BackendNotFound`.

## Resolution

Enable the `inferenceExtension` feature in your AgentGateway Helm values:
```yaml
inferenceExtension:
  enabled: true
```

Refer to the [official `values.yaml`](https://github.com/agentgateway/agentgateway/blob/main/controller/install/helm/agentgateway/values.yaml) for the full list of available options under `inferenceExtension`.

After updating the chart, redeploy AgentGateway. The translator will then correctly resolve `InferencePool` backends and the `BackendNotFound` error should be gone.