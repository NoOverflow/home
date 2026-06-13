---
title: An introduction to distributed compute with Ray on Openshift AI
draft: false
tags:
  - Write-Ups
  - Kubernetes
  - Machine-Learning
---

_I've been recently tasked to build a PoC to showcase how we could onboard a team of data scientists on Openshift, and how we could improve their work process; I've decided that I might as well dig a bit more and document it online._

All manifests used for this blog post are available at [https://github.com/NoOverflow/openshift-ai-blog-post](https://github.com/NoOverflow/openshift-ai-blog-post), I'd recommend cloning it if you want to follow along. However if you do decide to, make sure you have an active, valid, Openshift subscription.

## Introduction

If you're not familiar with any of the fancy words in the title, I don't blame you, it's a big word-salad, let's see what we're getting into:

### Openshift AI

Openshift AI is the Red Hat packaged version of Open Data Hub, an AI "platform". It's available as both a SaaS, and an on-premise solution.

When talking to someone over at Red Hat about it, he described it as a "_different portal / view for Openshift made for data scientists and AI/ML devs_.". When you think about it like that, it all makes sense; Openshift AI is a platform made to address Openshift resources in a way that can be understood by a data scientist (try talking about " _SecurityContextConstraints"_ to one of them).

For example, through the Openshift AI dashboard:

- A namespace isn't a namespace, it's a "_datascience project_"
- There aren't "_pods_", only workbenches
- To request a new workbench, you don't have to torture those poor data scientists with boring concept like "_StatefulSet_" or "_PersistentVolumeClaims_", a simple pre-configured form will do.

... you get the point.

Openshift administrators weren't forgotten either, Openshift AI also comes packaged with various operators for popular DS/AI/ML tools from conception of the models, training, fine-tuning and serving:

- Distributed workloads through IBM [CodeFlare](https://codeflare.dev) operator (we'll go into more details after since it's one of our main talking points for today)
- Serving models with [kServe](https://github.com/kserve/kserve) and [Red Hat Openshift Serverless](https://www.redhat.com/en/technologies/cloud-computing/openshift/serverless)
- Job scheduling with [Kueue](https://kueue.sigs.k8s.io)

### Ray - CodeFlare

Ray is an open-source project aiming to help with the parallelization and scaling of python. Since there's only so much compute available on a single thread of a single processor, Ray makes it easy to spread your code across multiple threads, processes or even entire machines, this is especially useful for AI / ML workloads for which Ray provides various tools to help with training, tuning and serving.

![Ray Architecture](assets/intro-openshift-ai/image-2.png)

Ray is made up of 5 main libraries based on a common library called "core":

- [Data](https://docs.ray.io/en/latest/data/data.html): Scalable, framework-agnostic data loading and transformation across training, tuning, and prediction.
- [Train](https://docs.ray.io/en/latest/train/train.html): Distributed multi-node and multi-core model training with fault tolerance that integrates with popular training libraries.
- [Tune](https://docs.ray.io/en/latest/tune/index.html): Scalable hyperparameter tuning to optimize model performance.
- [Serve](https://docs.ray.io/en/latest/serve/index.html): Scalable and programmable serving to deploy models for online inference, with optional microbatching to improve performance.
- [RLlib](https://docs.ray.io/en/latest/rllib/index.html): Scalable distributed reinforcement learning workloads.

Today we'll just be using the **Tune** library, through another python library made by the Ray team called [xgboost\_ray](https://github.com/ray-project/xgboost_ray) which will allow us to use **Ray** as a backend for our xgboost compute without having to modify the code too much.

On a more personal note, I fell in love with the almost "_magical_" promise of Ray, and also its complexity. The last time I've felt this overwhelmed by new concepts was when I was scrolling around [the OSDev wiki](https://wiki.osdev.org/Expanded_Main_Page), and I just adore this feeling, there's so much to learn and so much **I want to** learn.

_IBM_ CodeFlare is another open-sourced tool that's meant to help run Ray at-scale on Openshift by providing an operator to create tenant-aware Ray clusters, integrating neatly with the cloud-hybrid approach of running.

![CodeFlare Architecture](assets/intro-openshift-ai/image-1.png)

For example, CodeFlare provides a tool called [InstaScale](https://github.com/project-codeflare/instascale) that would allow you to create training instances on demand from an hyperscaler (read AWS, Azure...) and delete them once you no longer needs them by using the [CCPMSO](https://github.com/openshift/cluster-control-plane-machine-set-operator). That's definitely something I'll write a post about when I can secure some funds.

## On today's program

Now, obviously Openshift AI gives you a platform, but it's up to you to build it and make it actually usable for your data scientists. For today the goal will be simple:

- Install Openshift AI (_duh_)
- Make up a demonstration project around XGBoost, so that it can be easily parallelized across multiple nodes.
- Create a work environment based around Jupyter IDE, with a Python virtual environment containing all libraries needed to run the project.
- Setup a Ray cluster to distribute xgboost's matrix compute to multiple nodes at once, instead of relying only on the compute available to the pod running the aforementioned Jupyter IDE.
- Make sure our data scientists can access our new ray cluster directly from their Jupyter IDE.
- Configure a Grafana instance to monitor our tuning.
- Run our first compute !

We won't dig much more than that, pipelines, LLMs, visualizations, GPUs, batch scheduling etc.. will be the subject of other posts coming (_hopefully_) soon. This post is really just meant to be an introduction that builds the base for the upcoming ones.

![CodeFlare SDK](assets/intro-openshift-ai/codeflare-sdk)](https://github.com/redhat-na-ssa/codeflare-sdk/blob/main/demo-notebooks/additional-demos/ray_job_client.ipynb)

## Installing Openshift AI

Let's start with the easy (but expensive) step, installing the operator.

Ideally you would do that through a GitOps solution like _ArgoCD_ but for the sake of simplicity for the demo, let's do it through the console interface.

- Head to the OperatorHub and look for the "_Openshift AI_" operator.

![OperatorHub](assets/intro-openshift-ai/image-4.png)

- Follow through with the install keeping everything default.
- Once the operator is installed, get the route for the _RHODS_ dashboard and access it.

```bash
oc get route -n redhat-ods-applications rhods-dashboard -o json | jq -r .spec.host
```

![RHODS Dashboard](assets/intro-openshift-ai/image-5.png)

- This is the main dashboard that will be used by your scientists, **almost all resources you see on there can be configured through regular Kubernetes objects.**

> [!warn] By default, kubeadmin is not considered an Openshift AI admin, you will have to configure a custom provider and add your user as an admin, see: https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/2.20/html/managing_openshift_ai/managing-users-and-groups

Now that our platform is up, we'll configure the storage classes that will be available in self-service to our teams:

- Head over to "Settings > Storage classes", this is the tab used to configure the self-service of the persistent volumes that will be used for persistence of the workbenches (the virtual development environments)

![Storage Classes](assets/intro-openshift-ai/image-7.png)

- Now enable and set to default at least one of the storage classes.

Openshift AI isn't really opiniated on the type of storage available but keep in mind that, while this may be used only for the project source storage, it may also be used to install virtual environments and packages. I'd avoid NFS volumes for example.

## Creating our workbench image

We're now going to create the image that will be used to instantiate our workbenches; you're free to create as many of these images as you want.

Openshift AI provide the following default workbenches images based on the most popular IDEs and libraries used for AI / ML development:

| **Image name** | **IDE** | **Preinstalled packages** |
| --- | --- | --- |
| CUDA | JupyterLab | CUDA 12.6, Python 3.11, JupyterLab: 4.2 |
| Minimal Python | JupyterLab | Python 3.11, JupyterLab: 4.2 |
| PyTorch | JupyterLab | CUDA 12.6, Python 3.11, JupyterLab: 4.2, PyTorch: 2.6, Tensorboard: 2.19, Boto3: 1.37, Kafka-Python-ng: 2.2, Kfp: 2.12, Matplotlib: 3.10, Numpy: 2.2, Pandas: 2.2, Scikit-learn: 1.6, Scipy: 1.15, Odh-Elyra: 4.2, PyMongo: 4.11, Pyodbc: 5.2, Codeflare-SDK: 0.27, Sklearn-onnx: 1.18, Psycopg: 3.2, MySQL Connector/Python: 9.2, Kubeflow-Training: 1.9 |
| ROCm | JupyterLab | ROCm 6.2, Python 3.11, JupyterLab: 4.2 |
| ROCm-PyTorch | JupyterLab | Python 3.11, JupyterLab: 4.2, ROCm-PyTorch: 2.6, Tensorboard: 2.18, Kafka-Python-ng: 2.2, Matplotlib: 3.10, Numpy: 2.2, Pandas: 2.2, Scikit-learn: 1.6, Scipy: 1.15, Odh-Elyra: 4.2, PyMongo: 4.11, Pyodbc: 5.2, Codeflare-SDK: 0.27, Sklearn-onnx: 1.18, Psycopg: 3.2, MySQL Connector/Python: 9.2, Kubeflow-Training: 1.9 |
| ROCm-TensorFlow | JupyterLab | Python 3.11, JupyterLab: 4.2, ROCm-TensorFlow: 2.14, Tensorboard: 2.14, Kafka-Python-ng: 2.2, Matplotlib: 3.10, Numpy: 1.26, Pandas: 2.2, Scikit-learn: 1.6, Scipy: 1.15, Odh-Elyra: 4.2, PyMongo: 4.11, Pyodbc: 5.2, Codeflare-SDK: 0.27, Sklearn-onnx: 1.17, Psycopg: 3.2, MySQL Connector/Python: 9.2 |
| Standard Data Science | JupyterLab | Python 3.11, JupyterLab: 4.2, Boto3: 1.37, Kafka-Python-ng: 2.2, Kfp: 2.12, Matplotlib: 3.10, Numpy: 2.2, Pandas: 2.2, Scikit-learn: 1.6, Scipy: 1.15, Odh-Elyra: 4.2, PyMongo: 4.11, Pyodbc: 5.2, Codeflare-SDK: 0.27, Sklearn-onnx: 1.18, Psycopg: 3.2, MySQL Connector/Python: 9.2, Kubeflow-Training: 1.9 |
| TensorFlow | JupyterLab | CUDA 12.6, Python 3.11, JupyterLab: 4.2, TensorFlow: 2.18, Tensorboard: 2.18, Nvidia-CUDA-CU12-Bundle: 12.5, Boto3: 1.37, Kafka-Python-ng: 2.2, Kfp: 2.12, Matplotlib: 3.10, Numpy: 1.26, Pandas: 2.2, Scikit-learn: 1.6, Scipy: 1.15, Odh-Elyra: 4.2, PyMongo: 4.11, Pyodbc: 5.2, Codeflare-SDK: 0.27, Sklearn-onnx: 1.18, Psycopg: 3.2, MySQL Connector/Python: 9.2 |
| TrustyAI | JupyterLab | Python 3.11, JupyterLab: 4.2, TrustyAI: 0.6, Transformers: 4.49, Datasets: 3.4, Accelerate: 1.5, Torch: 2.6, Boto3: 1.37, Kafka-Python-ng: 2.2, Kfp: 2.12, Matplotlib: 3.6, Numpy: 1.24, Pandas: 1.5, Scikit-learn: 1.2, Scipy: 1.15, Odh-Elyra: 4.2, PyMongo: 4.11, Pyodbc: 5.2, Codeflare-SDK: 0.27, Sklearn-onnx: 1.18, Psycopg: 3.2, MySQL Connector/Python: 9.2, Kubeflow-Training: 1.9 |
| code-server | Code Server | code-server 4.98, Python 3.11, Boto3: 1.37, Kafka-Python-ng: 2.2, Matplotlib: 3.10, Numpy: 2.2, Pandas: 2.2, Scikit-learn: 1.6, Scipy: 1.15, Sklearn-onnx: 1.18, ipykernel: 6.29, Kubeflow-Training: 1.9 |

These are the images we'll have to build upon, for today's use-case, we'll go with " _Minimal Python (Jupyter IDE)_" (even though I'm personally not a fan of this IDE, it's widely used as the main development platform for Jupyter notebook and thus by scientists).

💡

Ideally you would automate this process using a pipeline engine such as Tekton, that would build the image by pulling a definition file from a source.

This will allow us to keep the image size to a minimum by only adding the libraries we need, let's see how to build a custom image:

- First let's get the base image used for the " _Minimal Python_" image, you can get it based on the _ImageStream_ object created by OAI in the " _redhat-ods-applications_"

```bash
nefast@sapphire:~$ oc get imagestream -n redhat-ods-applications
NAME                                IMAGE REPOSITORY   TAGS                                     UPDATED
code-server-notebook                                   2024.1,2024.2,2025.1,2023.2              7 weeks ago
cuda-rhel9
cuda-rstudio-rhel9
habana-notebook                                        2023.2,2024.1                            3 months ago
jupyter-logreg-demo                                    latest                                   2 weeks ago
jupyter-rocm-minimal                                   2024.2,2025.1                            7 weeks ago
jupyter-rocm-pytorch                                   2024.2,2025.1                            7 weeks ago
jupyter-rocm-tensorflow                                2024.2,2025.1                            7 weeks ago
minimal-gpu                                            2024.1,2024.2,2025.1,1.2,2023.1,2023.2   7 weeks ago
odh-trustyai-notebook                                  2024.1,2024.2,2025.1,2023.1,2023.2       7 weeks ago
pytorch                                                2024.1,2024.2,2025.1,1.2,2023.1,2023.2   7 weeks ago
rstudio-rhel9
s2i-generic-data-science-notebook                      2024.1,2024.2,2025.1,1.2,2023.1,2023.2   7 weeks ago
s2i-minimal-notebook                                   2024.1,2024.2,2025.1,1.2,2023.1,2023.2   7 weeks ago
tensorflow                                             2024.1,2024.2,2025.1,1.2,2023.1,2023.2   7 weeks ago
```

- Now get the base image URL

```bash
nefast@sapphire:~$ oc get imagestream -n redhat-ods-applications s2i-minimal-notebook -o json | jq -r .spec.tags[-1].from.name
quay.io/modh/odh-minimal-notebook-container@sha256:addd6f8573858510cfa94d1972feb868eb9db04aa38b632616de88b0dcd3d989
```

> [!info] If you want to create your own image from scratch, make sure you read the following constraints: [https://docs.redhat.com/en/documentation/red\_hat\_openshift\_ai\_self-managed/2.20/html/managing\_openshift\_ai/creating-custom-workbench-images#basic\_guidelines\_for\_creating\_your\_own\_workbench\_image](https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/2.20/html/managing_openshift_ai/creating-custom-workbench-images#basic_guidelines_for_creating_your_own_workbench_image)

With that base image obtained, we can build on top of it with our own dependencies list using a simple Dockerfile ( [source](https://github.com/NoOverflow/openshift-ai-blog-post/blob/master/Dockerfile)):

```Dockerfile
FROM quay.io/modh/odh-minimal-notebook-container@sha256:addd6f8573858510cfa94d1972feb868eb9db04aa38b632616de88b0dcd3d989
USER 1001
COPY requirements.txt ./requirements.txt
COPY compute.requirements.txt ./compute.requirements.txt
RUN pip install -r requirements.txt --default-timeout=1000 --no-cache-dir
RUN pip install -r compute.requirements.txt --default-timeout=1000 --no-cache-dir
```

I would **HEAVILY** recommend using [UV](https://docs.astral.sh/uv/pip/) for package installation, so much so that I will make a dedicated post on how to use it as a replacement for the horrendously slow Python's PIP.

![UV Recommendation](assets/intro-openshift-ai/image-2.png)

Once your new image is built, we're going to configure it as an option in our Openshift AI instance, to do-so you can either use the UI or do it declaratively (workbench images are ImageStreams object with a special tag):

![Image Configuration](assets/intro-openshift-ai/image-3.png)

```YAML
nefast@sapphire $ oc get imagestream -n redhat-ods-applications jupyter-logreg-demo -o yaml
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  annotations:
    opendatahub.io/notebook-image-creator: mistral-admin
    opendatahub.io/notebook-image-desc: ""
    opendatahub.io/notebook-image-name: jupyter-logreg-demo
    opendatahub.io/notebook-image-url: docker.io/nooverflow/oai-logreg-demo:latest
    opendatahub.io/recommended-accelerators: '[]'
    openshift.io/image.dockerRepositoryCheck: "2025-05-21T21:19:42Z"
  creationTimestamp: "2025-05-21T21:18:54Z"
  generation: 4
  labels:
    app.kubernetes.io/created-by: byon
    opendatahub.io/dashboard: "true"
    opendatahub.io/notebook-image: "true"
  name: jupyter-logreg-demo
  namespace: redhat-ods-applications
spec:
  lookupPolicy:
    local: true
  tags:
  - annotations:
      opendatahub.io/notebook-python-dependencies: '[]'
      opendatahub.io/notebook-software: '[]'
      openshift.io/imported-from: docker.io/nooverflow/oai-logreg-demo:latest
    from:
      kind: DockerImage
      name: docker.io/nooverflow/oai-logreg-demo:latest
    generation: 4
    importPolicy:
      importMode: Legacy
    name: latest
    referencePolicy:
      type: Source
status:
  [...]
```

We're now ready to create workbenches, but first let's create a Grafana instance to monitor our Ray instance.

## Installing Grafana

For this step, we'll use the Grafana operator, I leave the job of installing it to you. We'll gloss over most of the details.

I prepared most of the manifests that will deploy objects such as the related Ray dashboards.

```
oc apply -f .ops/grafana/crb.yml
oc apply -f .ops/grafana/dashboards.yml
oc apply -f .ops/grafana/folder.yml
oc apply -f .ops/grafana/head-podmonitor.yml
oc apply -f .ops/grafana/worker-podmonitor.yml
oc apply -f .ops/grafana/grafana.yml
oc apply -f .ops/grafana/token.yml
```

There are two important things here to note:

In `grafana.yml` we specify these fields:

```YAML
apiVersion: grafana.integreatly.org/v1beta1
kind: Grafana
spec:
  config:
    auth:
      disable_login_form: "false"
    log:
      mode: console
    # This is to allow embedding Grafana in the Ray Dashboard
    security:
      allow_embedding: "true"
      cookie_secure: "true"
      cookie_samesite: "none"
    auth.anonymous:
      enabled: "true"
      org_role: Viewer
```

These will be used to embed Grafana as an iframe which is needed for Ray's dashboard.

In `token.yml` we generate a long token that will be used to get access to the cluster monitoring as view-only, as specified in `crb.yml`

Let's get the token as we will need it for later, ideally this token should be injected to our Ray clusters automatically

```bash
oc get secret -n openshift-monitoring demo-grafana-sa-secret -o json | jq -r .data.token | base64 -d
eyJhbG[...]
```

## Instantiating a new workbench

Since workbenches will be put on a common service mesh which, by default, encrypts communications between pods using mTLS, our Ray cluster (which is outside of this mesh) won't be accessible. To solve this issue, you have multiple options, but we'll just go for the quick and dirty one of removing this mutual encryption for all Ray ports.

```YAML
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

Alright, we're now ready to create a new workbench. We'll choose the image we created earlier and no accelerator since we haven't set up vGPUs (yet 😛).

![Workbench Creation](assets/intro-openshift-ai/image-4.png)

### Run our first distributed compute

Let's clone the playbook we're going to use for the demonstration:

```bash
(app-root) git clone https://github.com/NoOverflow/openshift-ai-blog-post.git
```

To run, this playbook requires two secrets, a service account able to create RayCluster resources, and one able to view cluster monitoring so we can forward it to the Ray dashboard (the service account you created earlier).

Ideally, these secrets would be injected automatically into the workbench or directly in the RayCluster request using a policy engine, for today we'll just add them to our `.env` file.

```
(app-root) cat openshift-ai-blog-post/.env
CLUSTER_ACCESS_TOKEN=sha256~[...]
PROMETHEUS_AUTHORIZATION=eyJhbG[...]
(app-root)

```

This playbook is fairly simple, it is made of 3 parts:

- The creation of our distributed Ray cluster

![Ray Cluster Creation](assets/intro-openshift-ai/image.png)

- Since each worker must have the packages needed by your workload script, we install them as part of our setup

![Worker Setup](assets/intro-openshift-ai/image-2.png)

- Run the compute, in our case it's a [quantile regression example](https://scikit-learn.org/stable/auto_examples/ensemble/plot_gradient_boosting_quantile.html) adapted from an SKLearn demonstration script to work with xgboost\_ray ( [source](https://github.com/NoOverflow/openshift-ai-blog-post/blob/master/demo.ipynb))

![Quantile Regression](assets/intro-openshift-ai/image-1.png)

We just found one of the most inefficient ways to compute `x.sin(x)` with subpar accuracy !

Let's see if we got meaningful metrics from this run on our dashboards. All of the data should've been collected automatically by Prometheus.

![Prometheus Dashboard](assets/intro-openshift-ai/image-3.png)

## **Conclusion**

This post is not much more than just a quick demonstration of what Ray and Openshift AI can do, but I'll reference it later on more technically complex posts.

### Ideas for tomorrow

- Setup GPU operator to provide GPU (whole or slices using MIG) as accelerators to workbenches or
- Automate image building with pipelines
- Improve developer experience and reduce build times by using UV and virtual environments
- Integrate gang scheduling with Kueue and Ray
- Manage secrets for workbenches more intelligently with a policy engine

We still have a lot of work to do, thanks for reading everything !
