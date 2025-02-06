---
title: Reproducing Tasks
---

Reproduce tasks on local or remote machines in one of the following ways:
* Cloning any task - Make an exact copy, while maintaining the original task
* Resetting a task whose status is not *Published* - Delete the previous run's logs and output

After cloning or resetting, enqueue the reset or newly cloned task for execution by a worker.

Tasks can also be modified and then executed remotely, see [Tuning Tasks](webapp_exp_tuning.md).

## Cloning
To clone a task:
1. In the task table, right-click the task to reproduce and click **Clone**.
1. In the `Clone Task` modal, set the following:
   * Project - The project where the task will be saved
   * Description (optional)
   * Set `<cloned_task>` as parent - Select to set this task as the new task's parent
1. Click **Clone**

:::note
By default, the new task's parent task is set to the original task's parent, unless the original task does not 
have a parent, in which case the original task is set as the parent. Select `Set <cloned_task> as parent` to force 
the original task to become the clone's parent. 
:::

![Clone modal](../img/webapp_clone.png#light-mode-only)
![Clone modal](../img/webapp_clone_dark.png#dark-mode-only)


## Resetting

To reset a task:
1. In the tasks table, right-click the relevant task and click **Reset**. 
1. In the `Reset Task` modal, if you want the task's artifacts and debug samples to be deleted from the 
   ClearML file server, click the checkbox
1. Click **Reset**

![Reset modal](../img/webapp_reset.png#light-mode-only)
![Reset modal](../img/webapp_reset_dark.png#dark-mode-only)

## Final Steps 

At the end of the process you are left with `Draft` task, meaning that it is editable.

Re-execute the new task:
1. If desired, modify the task's configuration (see [Tuning Tasks](webapp_exp_tuning.md)).
1. Enqueue the task for execution. Right-click the task > Enqueue > Select a queue > **ENQUEUE**.
	
   :::note
   Make sure that a [ClearML Agent](../clearml_agent.md) has been assigned to the selected queue 
   :::

A ClearML Agent will fetch the task from the queue and execute it. The task can now be tracked and its 
results visualized.
