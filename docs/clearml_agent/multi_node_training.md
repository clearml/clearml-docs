---
title: Multi-Node Training
--- 

:::important Enterprise Feature
Multi-note training requires the agent to use a ClearML Enterprise Server.
:::

The ClearML Enterprise Agent supports horizontal multi-node training, allowing a single ClearML Task to run across multiple pods 
on different nodes.

This is useful for distributed training where the training job needs to span multiple GPUs and potentially 
multiple nodes.

To enable multi-node scheduling, set both `agentk8sglue.serviceAccountClusterAccess` and `agentk8sglue.multiNode` to `true`. 

Multi-node behavior is controlled using the `multiNode` key in a queue configuration. This setting tells the 
agent how to divide a Task's GPU requirements across multiple pods, with each pod running a part of the training job.

Below is a configuration example using `clearml-agent-values.override.yaml` to enable multi-node training.

In this example:
* The `multiNode: [4, 2]` setting means splits the Task into two workloads:
  * One workload will need 4 GPUs
  * The other workload will need 2 GPUs
* The GPU limit per pod is set to `nvidia.com/gpu: 2`, meaning each pod will be limited to 2 GPUs

With this setup:
* The first workload (which needs 4 GPUs) will be scheduled as 2 pods, each with 2 GPUs
* The second workload (which needs 2 GPUs) will be scheduled as 1 pod with 2 GPUs

```yaml
agentk8sglue:
  # Cluster access is required to run multi-node Tasks
  serviceAccountClusterAccess: true
  multiNode:
    enabled: true
  createQueues: true
  queues:
    multi-node-example:
      queueSettings:
         # Defines GPU needs per worker (e.g., 4 GPUs and 2 GPUs). Multiple Pods will be spawned respectively based on the lowest-common-denominator defined.
        multiNode: [ 4, 2 ]
      templateOverrides:
        resources:
          limits:
            # Note you will need to use the lowest-common-denominator of the GPUs distribution defined in `queueSettings.multiNode`.
            nvidia.com/gpu: 2
```