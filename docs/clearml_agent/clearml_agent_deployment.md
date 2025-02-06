---
title: Deployment
---

## Spinning Up an Agent
You can spin up an agent on any machine: on-prem and/or cloud instance. When spinning up an agent, you assign it to 
service a queue(s). Utilize the machine by enqueuing tasks to the queue that the agent is servicing, and the agent will 
pull and execute the tasks. 

:::tip cross-platform execution
ClearML Agent is platform agnostic. When using the ClearML Agent to execute experiments cross-platform, set platform 
specific environment variables before launching the agent.

For example, to run an agent on an ARM device, set the core type environment variable before spinning up the agent:

```bash
export OPENBLAS_CORETYPE=ARMV8
clearml-agent daemon --queue <queue_name>
```
:::

### Executing an Agent
To execute an agent, listening to a queue, run:

```bash
clearml-agent daemon --queue <queue_name>
```

### Executing in Background
To execute an agent in the background, run:
```bash
clearml-agent daemon --queue <execution_queue_to_pull_from> --detached
```
### Stopping Agents
To stop an agent running in the background, run:
```bash
clearml-agent daemon <arguments> --stop
```

### Allocating Resources
To specify GPUs associated with the agent, add the `--gpus` flag.

:::info Docker Mode
Make sure to include the `--docker` flag, as GPU management through the agent is only supported in [Docker Mode](clearml_agent_execution_env.md#docker-mode).
:::

To execute multiple agents on the same machine (usually assigning GPU for the different agents), run:
```bash
clearml-agent daemon --gpus 0 --queue default --docker
clearml-agent daemon --gpus 1 --queue default --docker
```
To allocate more than one GPU, provide a list of allocated GPUs
```bash
clearml-agent daemon --gpus 0,1 --queue dual_gpu --docker
```

### Queue Prioritization
A single agent can listen to multiple queues. The priority is set by their order.

```bash
clearml-agent daemon --queue high_q low_q
```
This ensures the agent first tries to pull a Task from the `high_q` queue, and only if it is empty, the agent will try to pull 
from the `low_q` queue.

To make sure an agent pulls from all queues equally, add the `--order-fairness` flag.
```bash
clearml-agent daemon --queue group_a group_b --order-fairness
```
It will make sure the agent will pull from the `group_a` queue, then from `group_b`, then back to `group_a`, etc. This ensures 
that `group_a` or `group_b` will not be able to starve one another of resources.

### SSH Access
By default, ClearML Agent maps the host's `~/.ssh` into the container's `/root/.ssh` directory (configurable, 
see [clearml.conf](../configs/clearml_conf.md#docker_internal_mounts)).

If you want to use existing auth sockets with ssh-agent, you can verify your host ssh-agent is working correctly with:

```commandline
echo $SSH_AUTH_SOCK
```

You should see a path to a temporary file, something like this:

```console
/tmp/ssh-<random>/agent.<random>
```

Then run your `clearml-agent` in Docker mode, which will automatically detect the `SSH_AUTH_SOCK` environment variable, 
and mount the socket into any container it spins. 

You can also explicitly set the `SSH_AUTH_SOCK` environment variable when executing an agent. The command below will 
execute an agent in Docker mode and assign it to service a queue. The agent will have access to 
the SSH socket provided in the environment variable.

```
SSH_AUTH_SOCK=<file_socket> clearml-agent daemon --gpus <your config> --queue <your queue name>  --docker
```

## Kubernetes

Agents can be deployed bare-metal or as Docker containers in a Kubernetes cluster. ClearML Agent adds missing scheduling capabilities to Kubernetes, enabling more flexible automation from code while leveraging all of ClearML Agent's features.

ClearML Agent is deployed onto a Kubernetes cluster using **Kubernetes-Glue**, which maps ClearML jobs directly to Kubernetes jobs. This allows seamless task execution and resource allocation across your cluster.

### Deployment Options
You can deploy ClearML Agent onto Kubernetes using one of the following methods:

1. **ClearML Agent Helm Chart (Recommended)**:
   Use the [ClearML Agent Helm Chart](https://github.com/allegroai/clearml-helm-charts/tree/main/charts/clearml-agent) to spin up an agent pod acting as a controller. This is the recommended and scalable approach.
   
2. **K8s Glue Script**:
   Run a [K8s Glue script](https://github.com/allegroai/clearml-agent/blob/master/examples/k8s_glue_example.py) on a Kubernetes CPU node. This approach is less scalable and typically suited for simpler use cases.

### How It Works
The ClearML Kubernetes-Glue performs the following:
- Pulls jobs from the ClearML execution queue.
- Prepares a Kubernetes job based on a provided YAML template.
- Inside each job pod, the `clearml-agent`:
  - Installs the required environment for the task.
  - Executes and monitors the experiment process.

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

## Slurm

:::important Enterprise Feature
Slurm Glue is available under the ClearML Enterprise plan.
:::

Agents can be deployed bare-metal or inside [`Singularity`](https://docs.sylabs.io/guides/3.5/user-guide/introduction.html) 
containers in Linux clusters managed with Slurm. 

ClearML Agent Slurm Glue maps jobs to Slurm batch scripts: associate a ClearML queue to a batch script template, then 
when a Task is pushed into the queue, it will be converted and executed as an `sbatch` job according to the sbatch 
template specification attached to the queue. 

1. Install the Slurm Glue on a machine where you can run `sbatch` / `squeue` etc. 
   
   ```
   pip3 install -U --extra-index-url https://*****@*****.allegro.ai/repository/clearml_agent_slurm/simple clearml-agent-slurm
   ```

1. Create a batch template. Make sure to set the `SBATCH` variables to the resources you want to attach to the queue. 
   The script below sets up an agent to run bare-metal, creating a virtual environment per job. For example:

   ```
   #!/bin/bash
   # available template variables (default value separator ":")
   # ${CLEARML_QUEUE_NAME}
   # ${CLEARML_QUEUE_ID}
   # ${CLEARML_WORKER_ID}.
   # complex template variables  (default value separator ":")
   # ${CLEARML_TASK.id}
   # ${CLEARML_TASK.name}
   # ${CLEARML_TASK.project.id}
   # ${CLEARML_TASK.hyperparams.properties.user_key.value}
   
   
   # example
   #SBATCH --job-name=clearml_task_${CLEARML_TASK.id}       # Job name DO NOT CHANGE
   #SBATCH --ntasks=1                    # Run on a single CPU
   # #SBATCH --mem=1mb                   # Job memory request
   # #SBATCH --time=00:05:00             # Time limit hrs:min:sec
   #SBATCH --output=task-${CLEARML_TASK.id}-%j.log
   #SBATCH --partition debug
   #SBATCH --cpus-per-task=1
   #SBATCH --priority=5
   #SBATCH --nodes=${CLEARML_TASK.hyperparams.properties.num_nodes.value:1}
   
   
   ${CLEARML_PRE_SETUP}
   
   echo whoami $(whoami)
   
   ${CLEARML_AGENT_EXECUTE}
   
   ${CLEARML_POST_SETUP}
   ```

   Notice: If you are using Slurm with Singularity container support replace `${CLEARML_AGENT_EXECUTE}` in the batch 
   template with `singularity exec ${CLEARML_AGENT_EXECUTE}`. For additional required settings, see [Slurm with Singularity](#slurm-with-singularity).

   :::tip 
   You can override the default values of a Slurm job template via the ClearML Web UI. The following command in the 
   template sets the `nodes` value to be the ClearML Task’s `num_nodes` user property:  
   ```
   #SBATCH --nodes=${CLEARML_TASK.hyperparams.properties.num_nodes.value:1}
   ```
   This user property can be modified in the UI, in the task's **CONFIGURATION > User Properties** section, and when the 
   task is executed the new modified value will be used. 
   ::: 

3. Launch the ClearML Agent Slurm Glue and assign the Slurm configuration to a ClearML queue. For example, the following 
   associates the `default` queue to the `slurm.example.template` script, so any jobs pushed to this queue will use the 
   resources set by that script.  
   ```
   clearml-agent-slurm --template-files slurm.example.template --queue default
   ```
   
   You can also pass multiple templates and queues. For example:
   ```
   clearml-agent-slurm --template-files slurm.template1 slurm.template2 --queue queue1 queue2
   ```

### Slurm with Singularity
If you are running Slurm with Singularity containers support, set the following:

1. Make sure your `sbatch` template contains:
   ```
   singularity exec ${CLEARML_AGENT_EXECUTE}
   ```
   Additional singularity arguments can be added, for example: 
   ```
   singularity exec --uts ${CLEARML_AGENT_EXECUTE}`
   ``` 
1. Set the default Singularity container to use in your [clearml.conf](../configs/clearml_conf.md) file:
   ```
   agent.default_docker.image="shub://repo/hello-world"
   ```
   Or
   ```
   agent.default_docker.image="docker://ubuntu"
   ```

1. Add `--singularity-mode` to the command line, for example:
   ```
   clearml-agent-slurm --singularity-mode --template-files slurm.example_singularity.template --queue default
   ```

## Google Colab

ClearML Agent can run on a [Google Colab](https://colab.research.google.com/) instance. This helps users to leverage 
compute resources provided by Google Colab and send experiments for execution on it. 

Check out [this tutorial](../guides/ide/google_colab.md) on how to run a ClearML Agent on Google Colab!

## Explicit Task Execution

ClearML Agent can also execute specific tasks directly, without listening to a queue.

### Execute a Task without Queue

Execute a Task with a `clearml-agent` worker without a queue.
```bash
clearml-agent execute --id <task-id>
```
### Clone a Task and Execute the Cloned Task

Clone the specified Task and execute the cloned Task with a `clearml-agent` worker without a queue.
```bash
clearml-agent execute --id <task-id> --clone
```

### Execute Task inside a Docker

Execute a Task with a `clearml-agent` worker using a Docker container without a queue.
```bash
clearml-agent execute --id <task-id> --docker
```

## Debugging

Run a `clearml-agent` daemon in foreground mode, sending all output to the console.
```bash
clearml-agent daemon --queue default --foreground
```
