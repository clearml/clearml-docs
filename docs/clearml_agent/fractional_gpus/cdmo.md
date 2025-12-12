---
title: Managing GPU Fractions with ClearML Dynamic MIG Operator (CDMO)
---

:::important Enterprise Feature
GPU fraction management is only supported by a ClearML Enterprise Server.
:::

This guide covers using GPU fractions in Kubernetes clusters using NVIDIA MIGs and
ClearML's Dynamic MIG Operator (CDMO). CDMO enables dynamic MIG (Multi-Instance GPU) configurations. 

This guide covers:
* Installing CDMO
* Enabling MIG mode on your cluster
* Managing GPU partitioning dynamically 

## Installation

### Requirements

* Add and update the Nvidia Helm repo:

  ```bash
  helm repo add nvidia https://nvidia.github.io/gpu-operator
  helm repo update
  ```

* Create a `gpu-operator.override.yaml` file with the following content:

  ```yaml
  migManager:
    enabled: false
  mig:
    strategy: mixed
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

* Install the NVIDIA `gpu-operator` using Helm with the previous configuration:

  ```bash
  helm install -n gpu-operator gpu-operator nvidia/gpu-operator --create-namespace -f gpu-operator.override.yaml
  ```

### Installing CDMO 

1. Login to the ClearML OCI Registry:

   ```bash
   helm registry login docker.io --username allegroaienterprise --password <CLEARML_DOCKERHUB_TOKEN>
   ```

1. Create a `cdmo-values.override.yaml` file with the following content: 
 
   ```yaml
   imageCredentials:
     password: "<CLEARML_DOCKERHUB_TOKEN>"
   ```

1. Install the CDMO Helm Chart using the previous override file:

   ```bash
   helm upgrade -i -n cdmo cdmo oci://docker.io/clearml/clearml-dynamic-mig-operator --create-namespace -f cdmo-values.override.yaml
   ```

1. Enable the NVIDIA MIG support on your cluster by running the following command on all nodes with a MIG-supported GPU 
  (run it for each GPU `<GPU_ID>` on the host):

   ```bash
   nvidia-smi -mig 1
   ```

   :::note notes
   * A node reboot may be required if the command output indicates so.
   
   * For convenience, this command can be run from within the `nvidia-device-plugin-daemonset` pod running on the related node.
   :::

1. Label all MIG-enabled GPU nodes `<NODE_NAME>` from the previous step:

   ```bash
   kubectl label nodes <NODE_NAME> "cdmo.clear.ml/gpu-partitioning=mig"
   ```

## Assigning MIG Profiles to Workloads

ClearML Agents deployed on Kubernetes support per-queue [customization](../clearml_agent_custom_workload.md) of workload 
pod definitions.

The example below demonstrates how to configure the ClearML Agent helm chart to use specific MIG profiles depending on 
the queue a workload is submitted on:
* Workloads assigned to the `slice-1` queue will be allocated a single 1 GPU instance, 10GB MIG slice.
* Workloads assigned to the `slice-2` queue will be allocated a single 2 GPU instance, 20GB MIG slice.
* Workloads assigned to the `slice-4` queue will be allocated a single 4 GPU instance, 40GB MIG slice.
* Workloads assigned to the `slice-7` queue will be allocated a single 7 GPU instance, 80GB MIG slice. 

```yaml
agentk8sglue:
  queues:
    slice-1:
      templateOverrides:
        resources:
          limits:
            nvidia.com/mig-1g.10gb: "1"

    slice-2:
      templateOverrides:
        resources:
          limits:
            nvidia.com/mig-2g.20gb: "1"

    slice-4:
      templateOverrides:
        resources:
          limits:
            nvidia.com/mig-4g.40gb: "1"

    slice-7:
      templateOverrides:
        resources:
          limits:
            nvidia.com/mig-7g.80gb: "1"
```

## Disabling MIGs

To disable MIG mode and restore standard full-GPU access:

1. Ensure no running workflows are using GPUs on the target node(s).

2. Remove the CDMO label from the target node(s) to disable the dynamic MIG reconfiguration.

    ```bash
    kubectl label nodes <NODE_NAME> "cdmo.clear.ml/gpu-partitioning-"
    ```

3. Execute a shell into the `device-plugin-daemonset` pod instance running on the target node(s) and execute the following commands:

    ```bash
    nvidia-smi mig -dci

    nvidia-smi mig -dgi

    nvidia-smi -mig 0
    ```

4. Edit the `gpu-operator.override.yaml` file to restore full-GPU access: 

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
   
5. Upgrade the `gpu-operator`:

   ```bash
   helm upgrade -n gpu-operator gpu-operator nvidia/gpu-operator -f gpu-operator.override.yaml
   ```