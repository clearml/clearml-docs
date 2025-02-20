---
title: Subprocess
---

The [subprocess_example.py](https://github.com/clearml/clearml/blob/master/examples/distributed/subprocess_example.py) 
script demonstrates multiple subprocesses interacting and reporting to a main Task. The following happens in the script: 
* This script initializes a main Task and spawns subprocesses, each for an instances of that Task.
* Each Task in a subprocess references the main Task by calling [`Task.current_task()`](../../references/sdk/task.md#taskcurrent_task), 
which always returns the main Task.
* The Task in each subprocess reports the following to the main Task:
    * Hyperparameters - Additional, different hyperparameters.
    * Console - Text logged to the console as the Task in each subprocess executes.
* When the script runs, it creates a task named `Popen example` in the `examples` project.

## Hyperparameters

ClearML automatically logs the command line options defined with `argparse`. A parameter dictionary is logged by 
connecting it to the Task using [`Task.connect()`](../../references/sdk/task.md#connect).

```python
additional_parameters = {
  'stuff_' + str(randint(0, 100)): 'some stuff ' + str(randint(0, 100))
}
Task.current_task().connect(additional_parameters)
```

Command line options appear in **CONFIGURATION** **>** **HYPERPARAMETERS** **>** **Args**.

![image](../../img/examples_subprocess_example_01.png)

Parameter dictionaries appear in **General**.

![image](../../img/examples_subprocess_example_01a.png)

## Console

Output to the console, including the text messages from the Task in each subprocess, appear in **CONSOLE**.

![image](../../img/examples_subprocess_example_02.png)