---
title: Reproducing Experiments
---

Reproduce experiments on local or remote machines in one of the following ways:
* Cloning any experiment - Make an exact copy, while maintaining the original experiment
* Resetting an experiment whose status is not *Published* - Delete the previous run's logs and output

After cloning or resetting, enqueue the reset or newly cloned experiment for execution by a worker.

Experiments can also be modified and then executed remotely, see [Tuning Experiments](webapp_exp_tuning.md).

## Cloning
To clone an experiment:
1. In the experiments table, right-click the experiment to reproduce and click **Clone**.
1. In the `Clone Experiment` modal, set the following:
   * Project - The project where the experiment will be saved
   * Description (optional)
   * Set `<cloned_experiment>` as parent - Select to set this experiment as the new experiments' parent task
1. Click **Clone**

:::note
By default, the new experiment's parent task is set to the original task's parent, unless the original task does not 
have a parent, in which case the original task is set as the parent. Select `Set <cloned_experiment> as parent` to force 
the original experiment to become the clone's parent. 
:::

![Clone modal](../img/webapp_clone.png#light-mode-only)
![Clone modal](../img/webapp_clone_dark.png#dark-mode-only)


## Resetting

To reset an experiment:
1. In the experiments table, right-click the relevant experiment and click **Reset**. 
1. In the `Reset Experiment` modal, if you want the experiment's artifacts and debug samples to be deleted from the 
   ClearML file server, click the checkbox
1. Click **Reset**

![Reset modal](../img/webapp_reset.png#light-mode-only)
![Reset modal](../img/webapp_reset_dark.png#dark-mode-only)

## Final Steps 

At the end of the process you are left with an experiment with draft status, meaning that it is editable.

Re-execute the new experiment:
1. If desired, modify the experiment's configuration (see [Tuning Experiments](webapp_exp_tuning.md)).
1. Enqueue the experiment for execution. Right-click the experiment > Enqueue > Select a queue > **ENQUEUE**.
	
   :::note
   Make sure that a [ClearML Agent](../clearml_agent.md) has been assigned to the selected queue 
   :::

A ClearML Agent will fetch the experiment from the queue and execute it. The experiment can now be tracked and its 
results visualized.
