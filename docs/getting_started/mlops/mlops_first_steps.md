---
title: First Steps
---

:::note
This tutorial assumes that you've already [signed up](https://app.clear.ml) to ClearML
:::

ClearML provides tools for **automation**, **orchestration**, and **tracking**, all key in performing effective MLOps and LLMOps. 

Effective MLOps and LLMOps rely on the ability to scale work beyond one's own computer. Moving from your own machine can be time-consuming. 
Even assuming that you have all the drivers and applications installed, you still need to manage multiple Python environments
for different packages / package versions, or worse - manage different Dockers for different package versions.

Not to mention, when working on remote machines, executing experiments, tracking what's running where, and making sure machines 
are fully utilized at all times become daunting tasks.

This can create overhead that derails you from your core work!

ClearML Agent was designed to deal with such issues and more! It is a tool responsible for executing experiments on remote machines: on-premises or in the cloud! ClearML Agent provides the means to reproduce and track experiments in your 
machine of choice through the ClearML WebApp with no need for additional code.

The agent will set up the environment for a specific Task's execution (inside a Docker, or bare-metal), install the 
required Python packages, and execute and monitor the process.


## Set up an Agent

1. Install the agent:

    ```bash
    pip install clearml-agent
    ```

1. Connect the agent to the server by [creating credentials](https://app.clear.ml/settings/workspace-configuration), then run this:

    ```bash
    clearml-agent init
    ```

    :::note
    If you've already created credentials, you can copy-paste the default agent section from [here](https://github.com/allegroai/clearml-agent/blob/master/docs/clearml.conf#L15) (this is optional. If the section is not provided the default values will be used)
    :::

1. Start the agent's daemon and assign it to a [queue](../../fundamentals/agents_and_queues.md#what-is-a-queue):

    ```bash
    clearml-agent daemon --queue default
    ```

    A queue is an ordered list of Tasks that are scheduled for execution. The agent will pull Tasks from its assigned 
   queue (`default` in this case), and execute them one after the other. Multiple agents can listen to the same queue 
   (or even multiple queues), but only a single agent will pull a Task to be executed.

:::tip Agent Deployment Modes
ClearML Agents can be deployed in:
* [Virtual environment mode](../../clearml_agent/clearml_agent_execution_env.md): Agent creates a new venv to execute an experiment. 
* [Docker mode](../../clearml_agent/clearml_agent_execution_env.md#docker-mode): Agent executes an experiment inside a 
Docker container. 

For more information, see [Running Modes](../../fundamentals/agents_and_queues.md#running-modes).  
:::

## Clone an Experiment
Experiments can be reproduced (cloned) for validation or as a baseline for further experimentation. 
Cloning a task duplicates the task's configuration, but not its outputs.

**To clone an experiment in the ClearML WebApp:** 
1. Click on any project card to open its [experiments table](../../webapp/webapp_exp_table.md).
1. Right-click one of the experiments on the table.
1. Click **Clone** in the context menu, which will open a **CLONE EXPERIMENT** window.
1. Click **CLONE** in the window. 

The newly cloned experiment will appear and its info panel will slide open. The cloned experiment is in draft mode, so 
it can be modified. You can edit the Git / code references, control the Python packages to be installed, specify the 
Docker container image to be used, or change the hyperparameters and configuration files. See [Modifying Tasks](../../webapp/webapp_exp_tuning.md#modifying-tasks) for more information about editing experiments in the UI. 

## Enqueue an Experiment
Once you have set up an experiment, it is now time to execute it. 

**To execute an experiment through the ClearML WebApp:**
1. Right-click your draft experiment (the context menu is also available through the <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> 
   button on the top right of the experiment's info panel)
1. Click **ENQUEUE,** which will open the **ENQUEUE EXPERIMENT** window
1. In the window, select `default` in the queue menu
1. Click **ENQUEUE** 

This action pushes the experiment into the `default` queue. The experiment's status becomes *Pending* until an agent 
assigned to the queue fetches it, at which time the experiment's status becomes *Running*. The agent executes the 
experiment, and the experiment can be [tracked and its results visualized](../../webapp/webapp_exp_track_visual.md).


## Programmatic Interface

The cloning, modifying, and enqueuing actions described above can also be performed programmatically.

### First Steps
#### Access Previously Executed Experiments
All Tasks in the system can be accessed through their unique Task ID, or based on their properties using the [`Task.get_task`](../../references/sdk/task.md#taskget_task) 
method. For example:
```python
from clearml import Task

executed_task = Task.get_task(task_id='aabbcc')
```

Once a specific Task object has been obtained, it can be cloned, modified, and more. See [Advanced Usage](#advanced-usage).

#### Clone an Experiment

To duplicate an experiment, use the [`Task.clone`](../../references/sdk/task.md#taskclone) method, and input either a 
Task object or the Task's ID as the `source_task` argument.   
```python
cloned_task = Task.clone(source_task=executed_task)
```

#### Enqueue an Experiment  
To enqueue the task, use the [`Task.enqueue`](../../references/sdk/task.md#taskenqueue) method, and input the Task object 
with the `task` argument, and the queue to push the task into with `queue_name`.  

```python
Task.enqueue(task=cloned_task, queue_name='default')
```

### Advanced Usage
Before execution, use a variety of programmatic methods to manipulate a task object. 

#### Modify Hyperparameters
[Hyperparameters](../../fundamentals/hyperparameters.md) are an integral part of Machine Learning code as they let you 
control the code without directly modifying it. Hyperparameters can be added from anywhere in your code, and ClearML supports multiple ways to obtain them!

Users can programmatically change cloned experiments' parameters.

For example:
```python
from clearml import Task

cloned_task = Task.clone(task_id='aabbcc')
cloned_task.set_parameter(name='internal/magic', value=42)
```

#### Report Artifacts
Artifacts are files created by your task. Users can upload [multiple types of data](../../clearml_sdk/task_sdk.md#logging-artifacts), 
objects and files to a task anywhere from code. 

```python
import numpy as np
from clearml import Task

Task.current_task().upload_artifact(name='a_file', artifact_object='local_file.bin')
Task.current_task().upload_artifact(name='numpy', artifact_object=np.ones(4,4))
```

Artifacts serve as a great way to pass and reuse data between tasks. Artifacts can be [retrieved](../../clearml_sdk/task_sdk.md#using-artifacts) 
by accessing the Task that created them. These artifacts can be modified and uploaded to other tasks.

```python
from clearml import Task

executed_task = Task.get_task(task_id='aabbcc')
# artifact as a file
local_file = executed_task.artifacts['file'].get_local_copy()
# artifact as object
a_numpy = executed_task.artifacts['numpy'].get()
```

By facilitating the communication of complex objects between tasks, artifacts serve as the foundation of ClearML's [Data Management](../../clearml_data/clearml_data.md) 
and [pipeline](../../pipelines/pipelines.md) solutions.

#### Log Models
Logging models into the model repository is the easiest way to integrate the development process directly with production. 
Any model stored by a supported framework (Keras / TensorFlow / PyTorch / Joblib etc.) will be automatically logged into ClearML.

ClearML also supports methods to explicitly log models. Models can be automatically stored on a preferred storage medium 
(S3 bucket, Google storage, etc.). 

#### Log Metrics
Log as many metrics as you want from your processes using the [Logger](../../fundamentals/logger.md) module. This 
improves the visibility of your processes' progress.

```python
from clearml import Logger

Logger.current_logger().report_scalar(
   graph='metric',
   series='variant',
   value=13.37,
   iteration=counter
)
```

You can also retrieve reported scalars for programmatic analysis:
```python
from clearml import Task

executed_task = Task.get_task(task_id='aabbcc')
# get a summary of the min/max/last value of all reported scalars
min_max_values = executed_task.get_last_scalar_metrics()
# get detailed graphs of all scalars
full_scalars = executed_task.get_reported_scalars()
```

#### Query Experiments
You can also search and query Tasks in the system. Use the [`Task.get_tasks`](../../references/sdk/task.md#taskget_tasks) 
class method to retrieve Task objects and filter based on the specific values of the Task - status, parameters, metrics and more!

```python
from clearml import Task

tasks = Task.get_tasks(
   project_name='examples',
   task_name='partial_name_match',
   task_filter={'status': 'in_progress'}
)
```

#### Manage Your Data
Data is probably one of the biggest factors that determines the success of a project. Associating a model's data with 
the model's configuration, code, and results (such as accuracy) is key to deducing meaningful insights into model behavior.

[ClearML Data](../../clearml_data/clearml_data.md) lets you version your data, so it's never lost, fetch it from every 
machine with minimal code changes, and associate data to experiment results.

Logging data can be done via command line, or programmatically. If any preprocessing code is involved, ClearML logs it 
as well! Once data is logged, it can be used by other experiments.
