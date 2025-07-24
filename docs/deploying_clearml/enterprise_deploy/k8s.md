---
title: Kubernetes
---

This guide provides step-by-step instructions for installing the ClearML Enterprise Server (control-plane) in a Kubernetes cluster.

The ClearML Enterprise Server includes the ClearML `apiserver`, `fileserver`, and `webserver` components. 
The package also includes MongoDB, ElasticSearch, and Redis as Helm dependencies.


## Prerequisites

To deploy a ClearML Server, ensure the following components and configurations are in place:

- Kubernetes Cluster: A standard Kubernetes cluster is recommended for optimal GPU support.
- CLI Tools: `kubectl` and `helm` must be installed and configured.
- Ingress Controller: An Ingress controller (e.g., `nginx-ingress`) is required. If exposing services externally, configure 
  LoadBalancer-capable solution (e.g. `MetalLB`).
- Server and workers that communicate on HTTP/S (ports 80 and 443). Additionally, the TCP session feature requires a 
  range of ports for TCP traffic based on your configuration (see [Application Gateway installation](appgw_install_k8s.md)).
- DNS Configuration: A domain with subdomain support is required, ideally with trusted TLS certificates. All entries must 
  be resolvable by the Ingress controller. Example subdomains:
  - Server:
    - `api.<BASE_DOMAIN>`
    - `app.<BASE_DOMAIN>`
    - `files.<BASE_DOMAIN>`
  - Worker:
    - `router.<BASE_DOMAIN>`
    - `tcp-router.<BASE_DOMAIN>` (optional, for TCP sessions)
- Storage: A configured StorageClass and an accessible storage backend.
- ClearML Enterprise Access:
  - Helm repository credentials (`<HELM_REPO_TOKEN>`)
  - DockerHub registry credentials (`<CLEARML_DOCKERHUB_TOKEN>`)

### Recommended Cluster Specifications

For optimal performance, a Kubernetes cluster with at least 3 nodes is recommended, each provisioned with:

- 8 vCPUs
- 32 GB RAM
- 500 GB storage

## Installation

### Add the Helm Repo Locally

Add the ClearML Helm repository:

```bash
helm repo add clearml-enterprise https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages --username <HELM_REPO_TOKEN> --password <HELM_REPO_TOKEN>
```

Update the local repository:
```bash
helm repo update
```

### Prepare Values

Create a `clearml-values.override.yaml` file with the following content:

:::note
In the following configuration, replace the `<BASE_DOMAIN>` placeholders with a valid domain that will have records 
pointing to the cluster's Ingress Controller. This will be the base domain for reaching your ClearML installation.
:::

```yaml
imageCredentials:
  password: "<CLEARML_DOCKERHUB_TOKEN>"
clearml:
  cookieDomain: "<BASE_DOMAIN>"
apiserver:
  ingress:
    enabled: true
    hostName: "api.<BASE_DOMAIN>"
  service:
    type: ClusterIP
fileserver:
  ingress:
    enabled: true
    hostName: "files.<BASE_DOMAIN>"
  service:
    type: ClusterIP
webserver:
  ingress:
    enabled: true
    hostName: "app.<BASE_DOMAIN>"
  service:
    type: ClusterIP
clearmlApplications:
  enabled: true
```

### Install the Chart

Install the ClearML Enterprise Helm chart using the previous values override file.

```bash
helm upgrade -i -n clearml clearml clearml-enterprise/clearml-enterprise --create-namespace -f clearml-values.override.yaml 
```

## Additional Configuration Options

:::note
You can view the full set of available and documented values of the chart by running the following command:

```bash
helm show readme clearml-enterprise/clearml-enterprise
# or
helm show values clearml-enterprise/clearml-enterprise
```
:::

### Default Secret Values

For improved security, all the internal credentials are auto-generated randomly and stored in a Secret in 
Kubernetes.

If you need to define your own credentials to be used instead, replace the default key and secret values in `clearml-values.override.yaml`.

```yaml
clearml:
  # Replace the following values to use custom internal credentials.
  apiserverKey: ""
  apiserverSecret: ""
  fileserverKey: ""
  fileserverSecret: ""
  secureAuthTokenSecret: ""
  testUserKey: ""
  testUserSecret: ""
```

In a shell, if `openssl` is installed, you can use this simple command to generate random strings suitable as keys and secrets:

```bash
openssl rand -hex 16
```

### Fixed Users

Enable and configure simple login with username and password in `clearml-values.override.yaml`. This is useful for simple PoC 
installations. This is an optional step in case the SSO (Identity provider) configuration is not performed.

Please note that this setup is not ideal for multi-tenant setups as fixed users will only be associated with the default tenant.

```yaml
apiserver:
  additionalConfigs:
    apiserver.conf: |
      auth {
        fixed_users {
          enabled: true
          pass_hashed: false
          users: [
            {
              username: "my_user"
              password: "my_password"
              name: "My User"
              admin: true
            },
          ]
        }
      }
```

## Next Steps

After installing the ClearML Enterprise Server, you can enhance your deployment by enabling optional services that 
extend ClearML’s capabilities for scheduling, interactivity, authentication, and more.

### Applications Installation
ClearML Applications are plugins that extend the functionality of the ClearML Enterprise Server. They enable users 
to manage ML workloads and automate recurring workflows--no code required

Applications are installed on top of the ClearML Server and are provided by the ClearML team.

For more information, see the [Application Installation guide](apps_k8s.md).

### ClearML Enterprise Agent

The ClearML Enterprise Agent enables scheduling and execution of distributed workloads (Tasks) on your Kubernetes cluster.

See the [ClearML Agent installation guide](../../clearml_agent/clearml_agent_deployment_k8s.md#agent-with-an-enterprise-server).

### Application Gateway

The Application Gateway enables secure, authenticated access to ClearML application endpoints such as model serving or IDE workloads
based on ClearML user permissions. It routes HTTPS traffic from users to running pods on the cluster.

See the [Application Gateway installation guide](appgw_install_k8s.md).

## Advanced Options
### GPU Operator

Deploy the NVIDIA GPU Operator in order to use Nvidia GPUs in ClearML.

See the [GPU Operator Basic Deployment guide](../../clearml_agent/fractional_gpus/gpu_operator.md).

### Fractional GPU Support

Available GPU fractioning methods:

* ClearML Dynamic MIG Orchestrator (CDMO): Manage GPU fractions using NVIDIA MIGs. See the [CDMO guide](../../clearml_agent/fractional_gpus/cdmo.md)
* ClearML Fractional GPU Injector (CFGI): Use fractional (non-MIG) GPU slices for efficient resource sharing. See the [CFGI guide](../../clearml_agent/fractional_gpus/cfgi.md)
* Mixed Deployments: Deploy both CDMO and CFGI in clusters with diverse GPU types. Use the NVIDIA GPU Operator to handle 
  mixed hardware setups. See the [CDMO and CFGI guide](../../clearml_agent/fractional_gpus/cdmo_cfgi_same_cluster.md).

### Multi-Tenant Setup

Run multiple isolated tenants on a single ClearML Server deployment, each with its own configuration and user namespaces.

See the [Multi-Tenant Service guide](multi_tenant_k8s.md).

### SSO (Identity Provider) Setup

Integrate identity providers to enable SSO login for ClearML Enterprise users.

See the [SSO Setup guide](extra_configs/sso_login.md).

### ClearML Custom Event Monitoring

ClearML Enterprise supports sending custom events to selected Kafka topics. 

See the [Custom Event guide](extra_configs/custom_billing.md).

### ClearML Presign Service

The ClearML Presign Service securely generates pre-signed storage URLs for authenticated users.

See the [ClearML Presign Service guide](extra_configs/presign_service.md).

### Install with a Non-Root User

In some Helm charts, you will find a values file called `values-enterprise-non-root-privileged.yaml` to be used for a 
non-root installation.

These values are for Enterprise versions only, and they need to be adapted to specific infrastructure needs. The 
`containerSecurityContext` is related to the Kubernetes distribution used/configuration and will need to be customized accordingly.

