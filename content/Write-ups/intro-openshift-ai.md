
# An Introduction to Distributed Compute with Ray on Openshift AI

*I've been recently tasked to build a PoC to showcase how we could onboard a team of data scientists on Openshift, and how we could improve their work process; I've decided that I might as well dig a bit more and document it online.*

💡 **All manifests used for this blog post are available at [GitHub - NoOverflow/openshift-ai-blog-post](https://github.com/NoOverflow/openshift-ai-blog-post).**

---

## Introduction

![Openshift AI Dashboard](https://nefast.me/content/images/2025/06/image-3.png)

If you're not familiar with any of the terms in the title, here's a quick breakdown:

### Openshift AI

Openshift AI is Red Hat's packaged version of Open Data Hub, an AI platform. It's available as both SaaS and on-premise. It provides a user-friendly interface for data scientists and AI/ML developers to interact with Openshift resources without needing to understand Kubernetes concepts like `SecurityContextConstraints`.

- A **namespace** becomes a "data science project".
- **Pods** are referred to as "workbenches".
- Requesting a new workbench is simplified through pre-configured forms.

Openshift AI also includes operators for popular AI/ML tools:
- **Distributed workloads** via IBM [CodeFlare](https://codeflare.dev/) operator.
- **Model serving** with [kServe](https://github.com/kserve/kserve) and Red Hat Openshift Serverless.
- **Job scheduling** with [Kueue](https://kueue.sigs.k8s.io/).

### Ray & CodeFlare

**Ray** is an open-source framework for parallelizing and scaling Python workloads, especially useful for AI/ML tasks. It consists of five main libraries:
- [Data](https://docs.ray.io/en/latest/data/data.html): Scalable data loading and transformation.
- [Train](https://docs.ray.io/en/latest/train/train.html): Distributed model training.
- [Tune](https://docs.ray.io/en/latest/tune/index.html): Hyperparameter tuning.
- [Serve](https://docs.ray.io/en/latest/serve/index.html): Model serving for online inference.
- [RLlib](https://docs.ray.io/en/latest/rllib/index.html): Distributed reinforcement learning.

**IBM CodeFlare** is an open-source tool for running Ray at scale on Openshift. It provides features like InstaScale for on-demand training instances.

---

## Today's Program

### Goals
- Install Openshift AI.
- Create a demonstration project using XGBoost, parallelized across multiple nodes.
- Set up a Jupyter-based work environment with a Python virtual environment.
- Configure a Ray cluster to distribute XGBoost's compute.
- Enable data scientists to access the Ray cluster from their Jupyter IDE.
- Set up Grafana for monitoring.
- Run the first distributed compute job.

---

## Installing Openshift AI

1. **Install the Operator**: Use the OperatorHub in the Openshift console.
2. **Access the Dashboard**: Retrieve the route for the RHODS dashboard.
   ```bash
   oc get route -n redhat-ods-applications rhods-dashboard -o json | jq -r .spec.host
   ```
3. **Configure Storage**: Enable and set a default storage class for workbench persistence.

⚠️ **Note**: By default, `kubeadmin` is not an Openshift AI admin. Configure a custom provider to add your user as an admin.

---

## Creating a Custom Workbench Image

Openshift AI provides default workbench images. For this demo, we'll use the "Minimal Python (Jupyter IDE)" image and extend it with additional libraries.

### Steps:
1. **Get the Base Image**:
   ```bash
   oc get imagestream -n redhat-ods-applications s2i-minimal-notebook -o json | jq -r .spec.tags[-1].from.name
   ```
2. **Build a Custom Image**: Use a Dockerfile to add dependencies.
   ```dockerfile
   FROM quay.io/modh/odh-minimal-notebook-container@sha256:addd6f8573858510cfa94d1972feb868eb9db04aa38b632616de88b0dcd3d989
   USER 1001
   COPY requirements.txt ./requirements.txt
   COPY compute.requirements.txt ./compute.requirements.txt
   RUN pip install -r requirements.txt --default-timeout=1000 --no-cache-dir
   RUN pip install -r compute.requirements.txt --default-timeout=1000 --no-cache-dir
   ```
3. **Configure the Image**: Deploy the custom image as an ImageStream in Openshift AI.

---

## Installing Grafana

Use the Grafana operator to deploy monitoring dashboards for Ray. Key configurations:
- Enable embedding and anonymous access in `grafana.yml`.
- Generate a token for accessing cluster monitoring.

---

## Instantiating a New Workbench

1. **Disable mTLS for Ray Ports**: To allow communication between the Ray cluster and workbenches.
   ```yaml
   apiVersion: security.istio.io/v1beta1
   kind: PeerAuthentication
   metadata:
     name: default
     namespace: istio-system
   spec:
     mtls:
       mode: UNSET
     portLevelMtls:
       '8265':
         mode: DISABLE
       '10001':
         mode: DISABLE
     selector:
       matchLabels:
         ray.io/node-type: head
   ```
2. **Create a Workbench**: Select the custom image and configure resources.

---

## Running the First Distributed Compute

1. **Clone the Demo Repository**:
   ```bash
   git clone https://github.com/NoOverflow/openshift-ai-blog-post.git
   ```
2. **Set Up Secrets**: Add `CLUSTER_ACCESS_TOKEN` and `PROMETHEUS_AUTHORIZATION` to `.env`.
3. **Run the Compute**: Execute the demo notebook to create a Ray cluster and run a quantile regression example.

---

## Conclusion

This post demonstrates the basics of using Ray and Openshift AI for distributed compute. Future posts will explore more advanced topics like GPU integration, automated image building, and gang scheduling.

### Ideas for Tomorrow
- Set up GPU operators for accelerators.
- Automate image building with pipelines.
- Improve build times using UV and virtual environments.
- Integrate gang scheduling with Kueue and Ray.
- Manage secrets more intelligently with a policy engine.

---
