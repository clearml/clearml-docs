---
title: Remote Execution
---

:::note
This guide assumes that you've already set up [ClearML](../clearml_sdk/clearml_sdk_setup.md) and [ClearML Agent](../clearml_agent/clearml_agent_setup.md).
:::

ClearML Agent enables seamless remote execution by offloading computations from a local development environment to a more 
powerful remote machine. This is useful for:

* Running initial process (a task or function) locally before scaling up.
* Offloading resource-intensive tasks to dedicated compute nodes.
* Managing execution through ClearML's queue system.

This guide focuses on transitioning a locally executed process to a remote machine for scalable execution. To learn how 
to reproduce a previously executed process on a remote machine, see [Reproducing Tasks](reproduce_tasks.md).

## Running a Task Remotely 

A compelling workflow is:

1. Run code on a development machine for a few iterations, or just set up the environment.
1. Move the execution to a beefier remote machine for the actual training.

Use [`Task.execute_remotely()`](../references/sdk/task.md#execute_remotely) to implement this workflow. This method stops the current manual execution, and then 
re-runs it on a remote machine.

1. Deploy a `clearml-agent` from your beefier remote machine and assign it to the `default` queue:

   ```commandline
   clearml-agent daemon --queue default 
   ```  

1. Run the local code to send to the remote machine for execution:
    
   ```python
   from clearml import Task
    
   task = Task.init(project_name="myProject", task_name="myTask")
   
   # training code 
   
   task.execute_remotely(
       queue_name='default', 
       clone=False,  
       exit_process=True  
   )
   ```

Once `execute_remotely()` is called on the machine, it stops the local process and enqueues the current task into the `default`
queue. From there, an agent assigned to the queue can pull and launch it.

## Running a Function Remotely 

You can execute a specific function remotely using [`Task.create_function_task()`](../references/sdk/task.md#create_function_task). 
This method creates a ClearML Task from a Python function and runs it on a remote machine.

For example:

```python
from clearml import Task
    
task = Task.init(project_name="myProject", task_name="Remote function")

def run_me_remotely(some_argument):
    print(some_argument)

a_func_task = task.create_function_task(
    func=run_me_remotely,  
    func_name='func_id_run_me_remotely',  
    task_name='a func task', 
    # everything below will be passed directly to our function as arguments
    some_argument=123
)
```

:::important Function Task Creation
Function tasks must be created from within a regular task, created by calling `Task.init`
:::

Arguments passed to the function will be automatically logged in the task's **CONFIGURATION** tab under the **HYPERPARAMETERS > Function section**. 
Like any other arguments, they can be changed from the UI or programmatically.

