---
title: Slurm with Singularity
---

:::important[Enterprise Feature]
Slurm Glue is available under the ClearML Enterprise plan.
:::

Agents can deploy [`Singularity`](https://docs.sylabs.io/guides/3.5/user-guide/introduction.html) containers in Linux clusters managed by Slurm.

This integration works similarly to the [Native Slurm](clearml_agent_deployment_slurm.md) workflow, with the following differences:
* The batch script must prefix ClearML’s agent execution with the `srun singularity exec` command 
* The ClearML Agent Slurm Glue must be launched with `--singularity-mode`.


## 1. Install the Slurm Glue

Install the Slurm Glue on a machine where you can run `sbatch` / `squeue` etc. 
   
```
pip3 install -U --extra-index-url https://*****@*****.allegro.ai/repository/clearml_agent_slurm/simple clearml-agent-slurm
```
   
:::tip[Python repository credentials]
Your credentials for `--extra-index-url` are available in the WebApp under the **Help** menu  <img src="/docs/latest/icons/ico-help-outlined.svg" alt="Help menu" className="icon size-md space-sm" /> **>** 
**ClearML Python Package setup** **>** **Install** step.
:::


## 2. Create a Batch Template

Create a batch template. Make sure to set the `SBATCH` variables to the resources you want to attach to the queue. 

Additionally, make sure your `sbatch` agent execution command is in the following form:

```commandline
srun singularity exec ${CLEARML_AGENT_EXECUTE}
```

You can also add additional Singularity arguments as needed. For example:

```commandline
srun singularity exec --uts ${CLEARML_AGENT_EXECUTE}
```

Here is a complete example template:

```
#!/bin/bash

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

srun singularity exec ${CLEARML_AGENT_EXECUTE}

${CLEARML_POST_SETUP}
```

:::note[Template variables]
For details on available template variables, see [Slurm (Native)](clearml_agent_deployment_slurm.md#dynamic-template-variables).
:::

## 3. Set the Default Container 

Set the default container to use in the [clearml.conf](../configs/clearml_conf.md) file where the agent glue will be run:
```
agent.default_docker.image="shub://repo/hello-world"
```

Or

```
agent.default_docker.image="docker://ubuntu"
```

## 4. Launch the ClearML Agent Slurm Glue
Launch the ClearML Agent Slurm Glue and assign the Slurm configuration to a ClearML queue. Make sure to add `--singularity-mode` 
to the command line. 

For example, the following associates the `default` queue to the `slurm.example_singularity.template` 
script, so any jobs pushed to this queue will be executed according to the definitions in that script.

```commandline
clearml-agent-slurm --singularity-mode --template-files slurm.example_singularity.template --queue default
```

## User Impersonation

By default, Slurm jobs are submitted as the Linux user running the glue process.

You can configure the agent to submit jobs as different Linux users based on the ClearML user who enqueued the task. 
See [Slurm User Impersonation](clearml_agent_slurm_impersonation.md).