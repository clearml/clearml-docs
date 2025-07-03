---
title: Kubernetes
---

This guide provides step-by-step instructions for installing the ClearML Enterprise Server (control-plane) in a Kubernetes cluster.

The ClearML Enterprise Server includes the ClearML `apiserver`, `fileserver`, and `webserver` components. 
The package also includes MongoDB, ElasticSearch, and Redis as Helm dependencies.


## Prerequisites

To deploy a ClearML Server, ensure the following components and configurations are in place:

- Kubernetes Cluster: A standard Kubernetes cluster is preferred for optimal GPU support.
- CLI Tools: `kubectl` and `helm` must be installed and configured.
- Ingress Controller: An Ingress controller (e.g., `nginx-ingress`) is required. If exposing services externally, a 
  LoadBalancer-capable solution (e.g. `MetalLB`) should also be configured.
- Server and workers that communicate on HTTP/S (ports 80 and 443). Additionally, the TCP session feature requires a 
  range of ports for TCP traffic based on your configuration (see [AI App Gateway installation](appgw_install_k8s.md)).
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

For optimal performance, a Kubernetes cluster with at least 3 nodes is recommended, each having:

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

### Applications Installation
ClearML Applications are plugins that extend the functionality of the ClearML Enterprise Server. They enable users 
to manage ML workloads and automate recurring workflows--no code required

Applications are installed on top of the ClearML Server and are provided by the ClearML team.

For more information, see [ClearML Applications](apps_k8s.md).

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

Once the ClearML Enterprise Server is up and running, proceed with installing the ClearML Enterprise Agent and 
[AI App Gateway](appgw_install_k8s.md).
