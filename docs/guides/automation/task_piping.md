---
title: Programmatic Orchestration
---

The [programmatic_orchestration.py](https://github.com/clearml/clearml/blob/master/examples/automation/programmatic_orchestration.py) 
example demonstrates: 
1. Creating an instance of a Task from a template Task.
1. Customizing that instance by changing the value of a parameter
1. Enqueuing the customized instance for execution. 

This example accomplishes a task pipe by doing the following:

1. Creating the template Task which is named `Toy Base Task`. It must be stored in ClearML Server before instances of 
   it can be created. To create it, run another ClearML example script, [toy_base_task.py](https://github.com/clearml/clearml/blob/master/examples/automation/toy_base_task.py).
   The template Task has a parameter dictionary, which is connected to the Task: `{'Example_Param': 1}`. 
1. Back in `programmatic_orchestration.py`, creating a parameter dictionary, which is connected to the Task by calling [`Task.connect`](../../references/sdk/task.md#connect) 
   so that the parameters are logged by ClearML. The dictionary contains the name of the parameter from the template 
   Task that is going to be customized (`Example_Param`), as well as its new value.
1. Creating a Task object referencing the template Task. See [`Task.get_task`](../../references/sdk/task.md#taskget_task).
1. Creating an instance of the template Task by cloning it.
1. Getting the newly cloned Task's parameters. See [`Task.get_parameters`](../../references/sdk/task.md#get_parameters).
1. Setting the newly cloned Task's parameters to the search values in the parameter dictionary (Step 2). See [`Task.set_parameters`](../../references/sdk/task.md#set_parameters).
1. Enqueuing the newly cloned Task to execute. See [`Task.enqueue`](../../references/sdk/task.md#taskenqueue).

When the example script runs, it creates an instance of the template task, named `Auto generated cloned task` in the `examples` project. In the instance, the value of the customized parameter, `Example_Param` changed to `3`. You can see it in **CONFIGURATION** **>** **HYPERPARAMETERS**.