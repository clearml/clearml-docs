---
title: Kubernetes
---

Agents can be deployed bare-metal or as Docker containers in a Kubernetes cluster. ClearML Agent adds missing scheduling capabilities to Kubernetes, enabling more flexible automation from code while leveraging all of ClearML Agent's features.

ClearML Agent is deployed onto a Kubernetes cluster using **Kubernetes-Glue**, which maps ClearML jobs directly to Kubernetes jobs. This allows seamless task execution and resource allocation across your cluster.

## Deployment Options
You can deploy ClearML Agent onto Kubernetes using one of the following methods:

1. **ClearML Agent Helm Chart (Recommended)**:
   Use the [ClearML Agent Helm Chart](https://github.com/clearml/clearml-helm-charts/tree/main/charts/clearml-agent) to spin up an agent pod acting as a controller. This is the recommended and scalable approach.
   
2. **K8s Glue Script**:
   Run a [K8s Glue script](https://github.com/clearml/clearml-agent/blob/master/examples/k8s_glue_example.py) on a Kubernetes CPU node. This approach is less scalable and typically suited for simpler use cases.

## How It Works
The ClearML Kubernetes-Glue performs the following:
- Pulls jobs from the ClearML execution queue.
- Prepares a Kubernetes job based on a provided YAML template.
- Inside each job pod, the `clearml-agent`:
  - Installs the required environment for the task.
  - Executes and monitors the task process.

:::important Enterprise Features
ClearML Enterprise adds advanced Kubernetes features:
- **Multi-Queue Support**: Service multiple ClearML queues within the same Kubernetes cluster.
- **Pod-Specific Templates**: Define resource configurations per queue using pod templates.

For example, you can configure resources for different queues as shown below:

```yaml
agentk8sglue:
  queues:
    example_queue_1:
      templateOverrides:
        nodeSelector:
          nvidia.com/gpu.product: A100-SXM4-40GB-MIG-1g.5gb
        resources:
          limits:
            nvidia.com/gpu: 1
    example_queue_2:
      templateOverrides:
        nodeSelector:
          nvidia.com/gpu.product: A100-SXM4-40GB
        resources:
          limits:
            nvidia.com/gpu: 2
```
:::
