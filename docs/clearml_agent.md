---
title: ClearML Agent
---


<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/MX3BrXnaULs" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

**ClearML Agent** is a virtual environment and execution manager for DL / ML solutions on GPU machines. It integrates with the **ClearML Python Package** and ClearML Server to provide a full AI cluster solution. <br/>
Its main focus is around:
- Reproducing tasks, including their complete environments. 
- Scaling workflows on multiple target machines. 

ClearML Agent executes a task or other workflow by reproducing the state of the code from the original machine 
to a remote machine.

![ClearML Agent flow diagram](img/clearml_agent_flow_diagram.png)

The preceding diagram demonstrates a typical flow where an agent executes a task:  

1. Enqueue a task for execution on the queue.
1. The agent pulls the task from the queue.
1. The agent launches a docker container in which to run the task's code.
1. The task's execution environment is set up:
   1.  Execute any custom setup script configured.
   1.  Install any required system packages.
   1.  Clone the code from a git repository.
   1.  Apply any uncommitted changes recorded.
   1.  Set up the python environment and required packages.
1. The task's script/code is executed.  

:::note Python Version
ClearML Agent uses the Python version available in the environment or docker in which it executes the code. It does not 
install Python, so make sure to use a docker or environment with the version you need.
::: 

While the agent is running, it continuously reports system metrics to the ClearML Server (these can be monitored in the 
[**Orchestration**](webapp/webapp_workers_queues.md) page).  

Continue using ClearML Agent once it is running on a target machine. Reproduce tasks and execute 
automated workflows in one (or both) of the following ways: 
* Programmatically (using [`Task.enqueue()`](references/sdk/task.md#taskenqueue) or [`Task.execute_remotely()`](references/sdk/task.md#execute_remotely))
* Through the ClearML Web UI (without working directly with code), by cloning tasks and enqueuing them to the 
  queue that a ClearML Agent is servicing.

The agent facilitates [overriding task execution detail](webapp/webapp_exp_tuning.md) values through the UI without 
code modification. Modifying a task clone’s configuration will have the ClearML agent executing it override the 
original values:
* Modified package requirements will have the task script run with updated packages
* Modified recorded command line arguments will have the ClearML agent inject the new values in their stead
* Code-level configuration instrumented with [`Task.connect()`](references/sdk/task.md#connect) will be overridden by modified hyperparameters

ClearML Agent can be deployed in various setups to suit different workflows and infrastructure needs:
* [Bare Metal](clearml_agent/clearml_agent_deployment.md#spinning-up-an-agent)
* [Kubernetes](clearml_agent/clearml_agent_deployment.md#kubernetes)
* [Slurm](clearml_agent/clearml_agent_deployment.md#slurm)
* [Google Colab](guides/ide/google_colab.md)

## References

For more information, see the following:
* [ClearML Agent CLI](clearml_agent/clearml_agent_ref.md) for a reference for `clearml-agent`'s CLI commands. 
* [ClearML Agent Environment Variables](clearml_agent/clearml_agent_env_var.md) for a list of environment variables
to configure ClearML Agent
* [Agent Section](configs/clearml_conf.md#agent-section) for a list of options to configure the ClearML Agent in the 
`clearml.conf`