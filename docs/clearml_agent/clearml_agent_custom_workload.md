---
title: Custom Workload Configuration (K8s)
---

The ClearML Agent monitors [ClearML queues](../fundamentals/agents_and_queues.md) and pulls tasks that are scheduled for execution.

A single agent can monitor multiple queues. By default, all queues share the same base pod template (`agentk8sglue.basePodTemplate`) 
used when launching tasks on Kubernetes after they have been pulled from the queue.

ClearML Agents deployed on Kubernetes support per-queue customization of workload pod definitions and execution environment.

This allows fine-grained control over how tasks are executed and monitored in your cluster.

The queues serviced by the ClearML Agent are defined in the ClearML Agent Helm configuration under the `agentk8sglue.queues` 
section.

Each queue entry can include two optional configuration blocks:
* [`templateOverrides`](#pod-template-overrides) – Overrides to the base pod template for the agent (pod resources, labels, volumes, etc.)
* [`queueSettings`](#queue-specific-clearml-agent-settings) – Additional ClearML task execution settings (max pods, worker ID format, default image, etc.)


## Pod Template Overrides

Each queue can override the base pod template defaults with custom configuration using `templateOverrides` to facilitate 
tailored pod specification for different workload requirements.

The following are a few examples of agent queue settings for common use cases:

### Example: GPU Queues

To support GPU queues, you must deploy the NVIDIA GPU Operator on your Kubernetes cluster. For more information, see [GPU Operator](fractional_gpus/gpu_operator.md).

```yaml
agentk8sglue:
  createQueues: true
  queues:
    1xGPU:
      templateOverrides:
        resources:
          limits:
            nvidia.com/gpu: 1
    2xGPU:
      templateOverrides:
        resources:
          limits:
            nvidia.com/gpu: 2
```

### Example: Custom Pod Template per Queue

This example demonstrates how to override the base pod template definitions on a per-queue basis.
In this example:

- The `red` queue inherits both the label `team=red` and the 1Gi memory limit from the `basePodTemplate` section.
- The `blue` queue overrides the label by setting it to `team=blue`, and inherits the 1Gi memory from the `basePodTemplate` section.
- The `green` queue overrides the label by setting it to `team=green`, and overrides the memory limit by setting it to 2Gi. 
  It also sets an annotation and an environment variable.

```yaml
agentk8sglue:
  # Defines common template
  basePodTemplate:
    labels:
      team: red
    resources:
      limits:
        memory: 1Gi
  createQueues: true
  queues:
    red:
      # Does not override
      templateOverrides: {}
    blue:
      # Overrides labels
      templateOverrides:
        labels:
          team: blue
    green:
      # Overrides labels and resources, plus set new fields
      templateOverrides:
        labels:
          team: green
        annotations:
          example: "example value"
        resources:
          limits:
            memory: 2Gi
        env:
          - name: MY_ENV
            value: "my_value"
```

### Example: GPU Queues with Shared Memory

This example demonstrates how to configure a queue that uses multiple GPUs and a shared memory volume for improved 
performance with GPU workloads. 

This example:
* Creates a 32Gi in-memory volume for the `GPUs_with_shared_memory` queue. Note that you should adjust the memory size based on the GPU's VRAM and the specific 
  model size.
* Mounts the volume at `/dev/shm` inside the container
* Assigns 2 GPUs to the container
* Sets the environment variable `VLLM_SKIP_P2P_CHECK="1"`. This disables 
  the peer-to-peer GPU memory check used by vLLM. This is often required when using shared memory volumes (`/dev/shm`) 
  to avoid initialization errors or performance issues in multi-GPU setups.

```yaml
agentk8sglue:
  queues:
    GPUs_with_shared_memory:
      templateOverrides:
        resources:
          limits:
            nvidia.com/gpu: "2"
        env:
          - name: VLLM_SKIP_P2P_CHECK
            value: "1"
        extraVolumeMounts:
          - name: dshm
            mountPath: /dev/shm
        extraVolumes:
          - name: dshm
            emptyDir:
              medium: Memory
              sizeLimit: 32Gi
```

## Queue Specific ClearML Agent Settings
In addition to pod template customization, each queue can define ClearML-specific behavior through the `queueSettings` 
field. These settings configure runtime limitations, naming conventions, and resource defaults.

```
agentk8sglue:
 createQueues: true
 queues:
   exampleQueue:
     templateOverrides: {}
     # -- Queue settings are a set of optional ClearML configurations applied per queue.
     queueSettings:
       maxPods: 10
       customWorkerIdTemplate: "k8s:myGroup:{task_id}"
       multiNode: [ 4, 2 ]
       defaultImage: "python:3.10"
       useImageEntrypoint: false
```

* `maxPods` - Maximum number of Pods that the agent can run concurrently for tasks scheduled through this queue. If the 
value is not specified, the agent can launch Pods without a fixed upper limit (based on cluster capacity).
* `customWorkerIdTemplate` - A custom template for naming ClearML workers that execute tasks from the queue. The template 
supports placeholders such as `{task_id}`, `{project}`, `{task_name}`, and `{queue}`, which are replaced dynamically at runtime. 
This is useful for grouping workers in the [Orchestration Dashboard](../webapp/webapp_orchestration_dash.md).
* `multiNode` - Configures GPU allocation for multi-node workloads. For more information, see [Multi-Node Training](multi_node_training.md).
* `defaultImage` - Default container image to use when launching tasks from the queue, if no other container was specified 
(i.e. task container configuration takes precedence).
* `useImageEntrypoint` - Whether to use the container's default entrypoint or override it. When `true`, the ClearML Agent 
will not override the image's entrypoint. This is typically used for containers that depend on their own startup scripts or entrypoints.
