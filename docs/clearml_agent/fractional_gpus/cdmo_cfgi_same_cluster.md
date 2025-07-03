---
title: Install CDMO and CFGI on the Same Cluster
---

:::important Enterprise Feature
CDMO and CFGI require the agent to use a ClearML Enterprise Server
:::

You can install both CDMO (ClearML Dynamic MIG Orchestrator) and CFGI (ClearML Fractional GPU Injector) on a shared Kubernetes cluster. 
In clusters with multiple nodes and varying GPU types, the `gpu-operator` can be used to manage different device configurations
and fractioning modes.

## Configuring the NVIDIA GPU Operator

The NVIDIA `gpu-operator` supports defining multiple configurations for the Device Plugin.

The following example YAML defines two configurations: "mig" and "ts" (time-slicing).

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
devicePlugin:
  enabled: true
  env:
    - name: PASS_DEVICE_SPECS
      value: "true"
    - name: FAIL_ON_INIT_ERROR
      value: "true"
    - name: DEVICE_LIST_STRATEGY
      value: volume-mounts
    - name: DEVICE_ID_STRATEGY
      value: uuid
    - name: NVIDIA_VISIBLE_DEVICES
      value: all
    - name: NVIDIA_DRIVER_CAPABILITIES
      value: all
  config:
    name: device-plugin-config
    create: true
    default: "all-disabled"
    data:
      all-disabled: |-
        version: v1
        flags:
          migStrategy: none
      ts: |-
        version: v1
        flags:
          migStrategy: none
        sharing:
          timeSlicing:
            renameByDefault: false
            failRequestsGreaterThanOne: false
            # Edit the following configuration as needed, adding as many GPU indices as many cards are installed on the Host.
            resources:
            - name: nvidia.com/gpu
              rename: nvidia.com/gpu-0
              devices:
              - "0"
              replicas: 8
      mig: |-
        version: v1
        flags:
          migStrategy: mixed
```

## Applying Configuration to Nodes

Label each Kubernetes node accordingly to activate a specific GPU mode:

|Mode| Label command|
|----|-----|
| `mig` | `kubectl label node <NODE_NAME> nvidia.com/device-plugin.config=mig` |
| `ts` (time slicing) | `kubectl label node <NODE_NAME> nvidia.com/device-plugin.config=ts` |
| Standard full-GPU access | `kubectl label node <NODE_NAME> nvidia.com/device-plugin.config=all-disabled` |

After a node is labeled, the NVIDIA `device-plugin` will automatically reload the new configuration.

## Installing CDMO and CFGI

After configuring the NVIDIA `gpu-operator` and labeling nodes, proceed with the standard installations of [CDMO](cdmo.md) 
and [CFGI](cfgi.md).

## Disabling Configurations 

### Time Slicing

To disable time-slicing and use full GPU access, update the node label using the `--overwrite` flag:

```bash
kubectl label node <NODE_NAME> nvidia.com/device-plugin.config=all-disabled --overwrite
```

### MIG

To disable MIG mode:

1. Ensure there are no more running workflows requesting any form of GPU on the node(s).
2. Remove the CDMO label from the target node(s).

    ```bash
    kubectl label nodes <NODE_NAME> "cdmo.clear.ml/gpu-partitioning-"
    ```

3. Execute a shell in the `device-plugin-daemonset` pod instance running on the target node(s) and execute the following commands:

    ```bash
    nvidia-smi mig -dci

    nvidia-smi mig -dgi

    nvidia-smi -mig 0
    ```

4. Label the node to use standard (non-MIG) GPU mode:

    ```bash
    kubectl label node <NODE_NAME> nvidia.com/device-plugin.config=all-disabled --overwrite
    ```