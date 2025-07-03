---
title: ClearML Enterprise K8s Installation and Configuration
---

This guides walks you through the complete installation and configuration of ClearML Enterprise Server on Kubernetes
from initial setup to advanced configuration options.

Follow the steps in the order presented for a smooth setup process.

## Prerequisites

Before you begin, ensure the following requirements are met:

- Kubernetes Cluster: A standard Kubernetes (vanilla) cluster is recommended, especially for optimal GPU support.
- CLI Tools: `kubectl` and `helm` must be installed and configured.
- Ingress Controller:  Required to expose services via HTTP/S (e.g., `nginx-ingress`). For external access,
  configure a LoadBalancer (e.g., `MetalLB`).
- Network Ports:
  - HTTP/S communication (ports 80 and 443) must be available between the server and agents.
   - TCP session support (for interactive apps) requires an additional port range (see the [AI App Gateway installation](appgw_install_k8s.md)).
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
  - Helm repository token (`<HELM_REPO_TOKEN>`)
  - DockerHub registry token (`<CLEARML_DOCKERHUB_TOKEN>`)

### Recommended Cluster Specifications

A 3-node cluster is recommended for production setups, with each node provisioned with:

- 8 vCPUs
- 32 GB RAM
- 500 GB storage

## Installation

### ClearML Enterprise Server

The ClearML Enterprise Server (control plane) includes the ClearML `apiserver`, `fileserver`, and `webserver` components. 
The package also includes MongoDB, ElasticSearch, and Redis as Helm dependencies.

See the [ClearML Server on Kubernetes installation guide](k8s.md).

### ClearML Applications

ClearML Applications are plugin services that automate ML workloads 
without any coding. Applications are installed on top of the ClearML Server and are provided by the ClearML team.

See the [Application Installation guide](apps_k8s.md).

### ClearML Enterprise Agent

The ClearML Enterprise Agent enables scheduling and execution of distributed workloads (Tasks) on your Kubernetes cluster.

See the [ClearML Agent installation guide](agent_k8s.md).

### AI Application Gateway

The AI App Gateway enables secure, authenticated access to interactive ClearML applications (e.g., JupyterLab, Streamlit) 
based on ClearML user permissions. It routes HTTPS traffic from users to running pods on the cluster.

See the [AI Application Gateway installation guide](appgw_install_k8s.md).

## Additional Configuration Options

### GPU Operator

Deploy the NVIDIA GPU Operator in order to use Nvidia GPUs in ClearML.

See the [GPU Operator Basic Deployment guide](../../clearml_agent/fractional_gpus/gpu_operator.md).

### Fractional GPU Support

To optimize GPU utilization:

* ClearML Dynamic MIG Orchestrator (CDMO): Manage GPU fractions using NVIDIA MIGs. See the [CDMO guide](../../clearml_agent/fractional_gpus/cdmo.md)
* ClearML Fractional GPU Injector (CFGI): Use fractional (non-MIG) GPU slices for efficient resource sharing. See the [CFGI guide](../../clearml_agent/fractional_gpus/cfgi.md)
* Mixed Deployments: Deploy both CDMO and CFGI in clusters with diverse GPU types. Use the NVIDIA GPU Operator to handle 
  mixed hardware setups. See the [CDMO and CFGI guide](../../clearml_agent/fractional_gpus/cdmo_cfgi_same_cluster.md).

### Multi-Tenant Setup

Run multiple isolated tenants on a single ClearML Server instance, each with its own configuration and user namespaces.

See the [Multi-Tenant Service guide](multi_tenant_k8s.md).

### SSO (Identity Provider) Setup

Integrate identity providers to enable SSO login for ClearML Enterprise users.

See the [SSO Setup guide](extra_configs/sso_login.md).

### ClearML Custom Events

ClearML Enterprise supports sending custom events to selected Kafka topics. 

See the [Custom Event guide](extra_configs/custom_billing.md).

### ClearML Presign Service

The ClearML Presign Service securely generates pre-signed storage URLs for authenticated users.

See the [ClearML Presign Service guide](extra_configs/presign_service.md).

## Install with a Non-Root User

In some Helm charts, you will find a values file called `values-enterprise-non-root-privileged.yaml` to be used for a 
non-root installation.

These values are for Enterprise versions only, and they need to be adapted to specific infrastructure needs. The 
`containerSecurityContext` is related to the Kubernetes distribution used/configuration and will need to be customized accordingly.