---
title: Reproducing Tasks 
---

:::note
This tutorial assumes that you've already set up [ClearML](../clearml_sdk/clearml_sdk_setup.md) and [ClearML Agent](../clearml_agent/clearml_agent_setup.md).
:::

Tasks can be reproduced--or **Cloned**--for validation or as a baseline for further experimentation. When you initialize a task in your
code, ClearML logs everything needed to reproduce your task and its environment:
* Uncommitted changes
* Used packages and their versions 
* Parameters 
* and more

Cloning a task duplicates the task's configuration, but not its outputs.

ClearML offers two ways to clone your task:
* [Via the WebApp](#via-the-webapp)--no further code required
* [Via programmatic interface](#via-programmatic-interface) using the `clearml` Python package

Once you have cloned your task, you can modify its setup, and then execute it remotely on a machine of your choice using a ClearML Agent. 

## Via the WebApp

**To clone a task in the ClearML WebApp:** 
1. Click on any project card to open its [task table](../webapp/webapp_exp_table.md).
1. Right-click the task you want to reproduce.
1. Click **Clone** in the context menu, which will open a **CLONE TASK** window.
1. Click **CLONE** in the window. 

The newly cloned task's details page will open up. The cloned task is in *draft* mode, which means 
it can be modified. You can edit any of the Task's setup details, including:
* Git and/or code references
* Python packages to be installed
* Container image to be used

You can adjust the values of the task's hyperparameters and configuration files. See [Modifying Tasks](../webapp/webapp_exp_tuning.md#modifying-tasks) for more 
information about editing tasks in the UI. 

### Enqueue a Task
Once you have set up a task, it is now time to execute it. 

**To execute a task through the ClearML WebApp:**
1. In the task's details page, click "Menu" <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> 
1. Click **ENQUEUE** to open the **ENQUEUE TASK** window
1. In the window, select `default` in the `Queue` menu
1. Click **ENQUEUE** 

This action pushes the task into the `default` queue. The task's status becomes *Pending* until an agent 
assigned to the queue fetches it, at which time the task's status becomes *Running*. The agent executes the 
task, and the task can be [tracked and its results visualized](../webapp/webapp_exp_track_visual.md).


## Via Programmatic Interface

The cloning, modifying, and enqueuing actions described above can also be performed programmatically using `clearml`.


### Clone the Task

To duplicate the task, use [`Task.clone()`](../references/sdk/task.md#taskclone), and input either a 
Task object or the Task's ID as the `source_task` argument.   

```python
cloned_task = Task.clone(source_task='qw03485je3hap903ere54')
```

The cloned task is in *draft* mode, which means it can be modified. For modification options, such as setting new parameter 
values, see [Task SDK](../clearml_sdk/task_sdk.md).

### Enqueue the Task  
To enqueue the task, use [`Task.enqueue()`](../references/sdk/task.md#taskenqueue), and input the Task object 
with the `task` argument, and the queue to push the task into with `queue_name`.  

```python
Task.enqueue(task=cloned_task, queue_name='default')
```

This action pushes the task into the `default` queue. The task's status becomes *Pending* until an agent 
assigned to the queue fetches it, at which time the task's status becomes *Running*. The agent executes the 
task, and the task can be [tracked and its results visualized](../webapp/webapp_exp_track_visual.md).