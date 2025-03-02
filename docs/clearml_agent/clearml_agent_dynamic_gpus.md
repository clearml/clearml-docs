---
title: Dynamic GPU Allocation
---

:::important Enterprise Feature
Dynamic GPU allocation is available under the ClearML Enterprise plan.
:::

The ClearML Enterprise server supports dynamic allocation of GPUs based on queue properties.
Agents can spin multiple Tasks from different queues based on the number of GPUs the queue
needs.

`dynamic-gpus` enables dynamic allocation of GPUs based on queue properties.
To configure the number of GPUs for a queue, use the `--gpus` flag to specify the active GPUs, and use the `--queue` 
flag to specify the queue name and number of GPUs:

```console
clearml-agent daemon --dynamic-gpus --gpus 0-2 --queue dual_gpus=2 single_gpu=1 --docker 
```

:::note Docker mode
Make sure to include the `--docker` flag, as dynamic GPU allocation is only supported in [Docker Mode](clearml_agent_execution_env.md#docker-mode).
:::

#### Example

Let's say a server has three queues:
* `dual_gpu`
* `quad_gpu`
* `opportunistic`

An agent can be spun on multiple GPUs (for example: 8 GPUs, `--gpus 0-7`), and then attached to multiple
queues that are configured to run with a certain amount of resources:

```console
clearml-agent daemon --dynamic-gpus --gpus 0-7 --queue quad_gpu=4 dual_gpu=2 --docker 
``` 

The agent can now spin multiple Tasks from the different queues based on the number of GPUs configured to the queue.
The agent will pick a Task from the `quad_gpu` queue, use GPUs 0-3 and spin it. Then it will pick a Task from the `dual_gpu`
queue, look for available GPUs again and spin on GPUs 4-5.

Another option for allocating GPUs:

```console
clearml-agent daemon --dynamic-gpus --gpus 0-7 --queue dual=2 opportunistic=1-4 --docker 
``` 

Notice that a minimum and maximum value of GPUs is specified for the `opportunistic` queue. This means the agent
will pull a Task from the `opportunistic` queue and allocate up to 4 GPUs based on availability (i.e. GPUs not currently
being used by other agents).