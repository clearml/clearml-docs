---
title: Dynamic GPU Fractions on Bare Metal and VMs
---

:::important[Enterprise Feature]
Dynamic Fractional GPUs are available under the ClearML Enterprise plan.
:::

ClearML dynamic GPU fractions provide on-the-fly, per task GPU slicing, without having to set up containers or 
pre-configure tasks with memory limits. Specify a GPU fraction for a queue in the agent invocation, and every task the 
agent pulls from the queue will run on a container with the specified limit. This way you can safely run multiple tasks 
simultaneously without worrying that one task will use all of the GPU's memory. 

This guide covers how to dynamically slice GPUs on **bare metal**/**VMs** .

![Fractional GPU diagram](../../img/fractional_gpu_diagram.png)

## Deployment
1. Install the required packages:

   ```bash
   pip install -U --extra-index-url https://shared:******@packages.allegro.ai/repository/clearml_agent_fractional_gpu/simple clearml-agent-fractional-gpu
   ```
   
   :::tip[Python repository credentials]
   Your credentials for `--extra-index-url` are available in the WebApp under the **Help** menu  <img src="/docs/latest/icons/ico-help-outlined.svg" alt="Help menu" className="icon size-md space-sm" /> **>** 
   **ClearML Python Package setup** **>** **Install** step.
   :::

1. Start the ClearML agent with dynamic GPU allocation. Use `--gpus` to specify the active GPUs, and use the `--queue` 
   flag to specify the queue name(s) and number (or fraction) of GPUs to allocate to them. 

   ```commandline
   clearml-agent daemon --dynamic-gpus --gpus 0, 1 --queue half_gpu=0.5 --docker
   ```

The agent can utilize 2 GPUs (GPUs 0 and 1). Every task enqueued to the `half_gpu` queue will be run by the agent and 
only allocated 50% GPU memory (i.e. 4 tasks can run concurrently). 

:::note
You can allocate GPUs for a queue’s tasks by specifying either a fraction of a single GPU in increments as small as 0.125 
(e.g. 0.125, 0.25, 0.50, etc.) or whole GPUs (e.g. 1, 2, 4, etc.). However, you cannot specify fractions greater than 
one GPU (e.g. 1.25).
::: 

You can set up multiple queues, each allocated a different number of GPUs per task. Note that the order that the queues 
are listed is their order of priority, so the agent will service tasks from the first listed queue before servicing 
subsequent queues:

```commandline
clearml-agent daemon --dynamic-gpus --gpus 0-2 --queue dual_gpus=2 quarter_gpu=0.25 half_gpu=0.5 single_gpu=1 --docker
```

This agent will utilize 3 GPUs (GPUs 0, 1, and 2). The agent can spin multiple jobs from the different queues based on 
the number of GPUs configured to the queue. 

## Example Workflow
Let’s say that four tasks are enqueued, one task for each of the above queues (`dual_gpus`, `quarter_gpu`, `half_gpu`, 
`single_gpu`). The agent will first pull the task from the `dual_gpus` queue since it is listed first, and will run it 
using 2 GPUs. It will next run the tasks from `quarter_gpu` and `half_gpu`--both will run on the remaining available 
GPU. This leaves the task in the `single_gpu` queue. Currently, 2.75 GPUs out of the 3 are in use so the task will only 
be pulled and run when enough GPUs become available. 
