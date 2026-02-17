# Quartz Helm Chart

A Helm chart for deploying the Quartz application using the [bjw-s common library](https://github.com/bjw-s-labs/helm-charts).

## Features

- **Common Library**: Uses `bjw-s-labs/common` chart library for standardized Kubernetes deployments
- **Multi-Platform Support**: Single chart that supports both Kubernetes (Ingress) and OpenShift (Routes)
- **Intelligent Routing**: Automatically selects between Kubernetes Ingress or OpenShift Route based on the `openshift` flag
- **Configurable Deployment**: Supports custom image, replicas, resources, and probes

## Prerequisites

- Kubernetes 1.19+ or OpenShift 4.6+
- Helm 3.0+
- The chart automatically handles dependency resolution via the common library

## Installation

### Update Helm Dependencies

Before installing, update the Helm chart dependencies:

```bash
helm dependency update ./helm/quartz
```

### For Kubernetes (with Ingress)

```bash
helm install quartz ./helm/quartz \
  --set openshift=false \
  --set ingress.main.enabled=true \
  --set ingress.main.hosts[0].host=quartz.example.com \
  --set ingress.main.className=nginx
```

Or use the provided example values:

```bash
helm install quartz ./helm/quartz -f ./helm/quartz/values-k8s.yaml
```

### For OpenShift (with Routes)

```bash
helm install quartz ./helm/quartz \
  --set openshift=true \
  --set route.host=quartz.example.com
```

Or use the provided example values:

```bash
helm install quartz ./helm/quartz -f ./helm/quartz/values-openshift.yaml
```

## Configuration

### Main Values

| Parameter | Description | Default |
|-----------|-------------|---------|
| `openshift` | Enable OpenShift Route instead of Ingress | `false` |
| `controllers.main.replicas` | Number of replicas | `1` |
| `controllers.main.containers.main.image.repository` | Image repository | `nooverflow/quartz` |
| `controllers.main.containers.main.image.tag` | Image tag | `latest` |
| `controllers.main.containers.main.resources` | Container resource limits/requests | See values.yaml |
| `service.main.ports.http.port` | Service port | `80` |
| `ingress.main.hosts` | Ingress hosts configuration | See values.yaml |
| `route.host` | OpenShift route hostname | `quartz.example.com` |
| `route.tls` | OpenShift route TLS configuration | `null` |

### Using the `openshift` Flag

The chart uses a single `openshift` boolean flag to control whether to create an Ingress (Kubernetes) or a Route (OpenShift):

- **`openshift: false`** (default):
  - Creates a standard Kubernetes Ingress resource
  - Use with `ingress.main.*` configuration
  - Suitable for Kubernetes, EKS, GKE, AKS, etc.

- **`openshift: true`**:
  - Creates an OpenShift Route resource
  - Uses `route.*` configuration instead of ingress
  - Automatically disables Ingress creation
  - Suitable for OpenShift clusters

## Common Chart Features

This chart leverages the powerful `bjw-s-labs/common` library, which provides:

- **Standardized Controllers**: Supports Deployments, StatefulSets, DaemonSets, CronJobs, and Jobs
- **Container Configuration**: Flexible container image, args, environment variables, and probes
- **Service Management**: Automatic service creation with port configuration
- **Persistence**: Easy volume and persistent volume claim management
- **Security**: Pod and container security context configuration
- **Advanced Pod Options**: Node selectors, tolerations, affinity, and more

For detailed documentation on all available options, see the [bjw-s common library documentation](https://github.com/bjw-s-labs/helm-charts/tree/main/charts/library/common).

## Examples

### Scale to 3 replicas on OpenShift with TLS

```bash
helm install quartz ./helm/quartz \
  --set openshift=true \
  --set controllers.main.replicas=3 \
  --set route.host=quartz.prod.example.com \
  --set route.tls.termination=edge
```

### Custom image with resource limits

```bash
helm install quartz ./helm/quartz \
  --set openshift=false \
  --set controllers.main.containers.main.image.repository=myregistry.azurecr.io/quartz \
  --set controllers.main.containers.main.image.tag=v1.0.0 \
  --set controllers.main.containers.main.resources.limits.cpu=1000m \
  --set controllers.main.containers.main.resources.limits.memory=1Gi
```

### Override via values file

Create a custom `values.yaml`:

```yaml
openshift: false

controllers:
  main:
    replicas: 3
    containers:
      main:
        image:
          repository: my-registry/quartz
          tag: v1.2.3

ingress:
  main:
    enabled: true
    className: "nginx"
    hosts:
      - host: quartz.mycompany.com
        paths:
          - path: /
            pathType: Prefix
            service:
              identifier: main
              port: http
    tls:
      - secretName: quartz-tls
        hosts:
          - quartz.mycompany.com
```

Then install:

```bash
helm install quartz ./helm/quartz -f my-values.yaml
```

## Uninstallation

```bash
helm uninstall quartz
```

## License

See the root LICENSE.txt file.
