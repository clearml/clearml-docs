---
title: K8S GPU Operator
---

This guide provides recommended configuration values for deploying the NVIDIA GPU Operator alongside ClearML Enterprise. 

## Add the Helm Repo Locally

Add the NVIDIA GPU Operator Helm repository:

```bash
helm repo add nvidia https://nvidia.github.io/gpu-operator
```

Update the local repository:
```bash
helm repo update
```

## Installation

To prevent unprivileged containers from bypassing the Kubernetes Device Plugin API, configure the GPU operator 
using the following `gpu-operator.override.yaml` file:

```yaml
toolkit:
  env:
    - name: ACCEPT_NVIDIA_VISIBLE_DEVICES_ENVVAR_WHEN_UNPRIVILEGED
      value: "false"
    - name: ACCEPT_NVIDIA_VISIBLE_DEVICES_AS_VOLUME_MOUNTS
      value: "true"
    - name: NVIDIA_CONTAINER_TOOLKIT_OPT_IN_FEATURES
      value: "disable-cuda-compat-lib-hook"    
devicePlugin:
  env:
    - name: PASS_DEVICE_SPECS
      value: "true"
    - name: FAIL_ON_INIT_ERROR
      value: "true"
    - name: DEVICE_LIST_STRATEGY # Use volume-mounts
      value: volume-mounts
    - name: DEVICE_ID_STRATEGY
      value: uuid
    - name: NVIDIA_VISIBLE_DEVICES
      value: all
    - name: NVIDIA_DRIVER_CAPABILITIES
      value: all
```

:::note k3s
If using **k3s**, you must set the `containerd` socket path. Add the following entry to your `gpu-operator.override.yaml`:

```yaml
toolkit:
  env:
    - name: CONTAINERD_SOCKET
      value: "/run/k3s/containerd/containerd.sock"
```
:::


:::note MicroK8s
If using MicroK8s, you must configure the `containerd` paths used by MicroK8s. Add the following entries to your 
`gpu-operator.override.yaml`:

```yaml
toolkit:
 env:
   - name: CONTAINERD_CONFIG
     value: "/var/snap/microk8s/current/args/containerd-template.toml"
   - name: CONTAINERD_SOCKET
     value: "/var/snap/microk8s/common/run/containerd.sock"
   - name: CONTAINERD_RUNTIME_CLASS
     value: "nvidia"
   - name: CONTAINERD_SET_AS_DEFAULT
     value: "true"
```
:::

Install the `gpu-operator`:

```bash
helm install -n gpu-operator gpu-operator nvidia/gpu-operator --create-namespace -f gpu-operator.override.yaml
```

## Fractional GPU Support

To enable fractional GPU allocation or manage mixed GPU configurations, refer to the following guides:
* [ClearML Dynamic MIG Operator](cdmo.md) (CDMO) – Dynamically configures MIG GPUs on supported devices.
* [ClearML Enterprise Fractional GPU Injector](cfgi.md) (CFGI) – Enables fractional (non-MIG) GPU 
  allocation for better hardware utilization and workload distribution in Kubernetes.
* [CDMO and CFGI on the same Cluster](cdmo_cfgi_same_cluster.md) - In clusters with multiple nodes and 
  varying GPU types, the `gpu-operator` can be used to manage different device configurations and fractioning modes.