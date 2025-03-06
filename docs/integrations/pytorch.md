---
title: PyTorch
---

:::tip
If you are not already using ClearML, see [ClearML Setup instructions](../clearml_sdk/clearml_sdk_setup).
:::


ClearML integrates seamlessly with [PyTorch](https://pytorch.org/), automatically logging its models. 

All you have to do is simply add two lines of code to your PyTorch script:

```python
from clearml import Task

task = Task.init(task_name="<task_name>", project_name="<project_name>")
```

And that's it! This creates a [ClearML Task](../fundamentals/task.md) which captures: 
* Source code and uncommitted changes
* Installed packages
* PyTorch models 
* [TensorBoard](https://www.tensorflow.org/tensorboard) outputs
* Console output
* General details such as machine details, runtime, creation date etc.
* And more

You can view all the task details in the [WebApp](../webapp/webapp_overview.md). 

![Pytorch webapp](../img/examples_pytorch_distributed_example_08.png)

## Automatic Logging Control 
By default, when ClearML is integrated into your PyTorch script, it captures PyTorch models. But, you may want to have 
more control over what your task logs.

To control a task's framework logging, use the `auto_connect_frameworks` parameter of [`Task.init()`](../references/sdk/task.md#taskinit). 
Completely disable all automatic logging by setting the parameter to `False`. For finer grained control of logged 
frameworks, input a dictionary, with framework-boolean pairs.

For example:

```python
auto_connect_frameworks={
   'pytorch': False, 'matplotlib': True, 'tensorboard': False, 'tensorflow': False, 
   'xgboost': False, 'scikit': True, 'fastai': True, 'lightgbm': False,
   'hydra': True, 'detect_repository': True, 'tfdefines': True, 'joblib': True,
   'megengine': True, 'catboost': True
}
```

You can also input wildcards as dictionary values, so ClearML will log a model created by a framework only if its local 
path matches at least one wildcard. 

For example, in the code below, ClearML will log PyTorch models only if their paths have the `.pt` extension. The 
unspecified frameworks' values default to true so all their models are automatically logged.

```python
auto_connect_frameworks={'pytorch' : '*.pt'}
```

## Manual Logging
To augment its automatic logging, ClearML also provides an explicit logging interface.

See more information about explicitly logging information to a ClearML Task:
* [Models](../clearml_sdk/model_sdk.md#manually-logging-models)
* [Configuration](../clearml_sdk/task_sdk.md#configuration) (e.g. parameters, configuration files)
* [Artifacts](../clearml_sdk/task_sdk.md#artifacts) (e.g. output files or Python objects created by a task)
* [Scalars](../clearml_sdk/task_sdk.md#scalars) 
* [Text/Plots/Debug Samples](../fundamentals/logger.md#manual-reporting)

See [Explicit Reporting Tutorial](../guides/reporting/explicit_reporting.md).

## Distributed Training
You can integrate ClearML into your distributed training script. With ClearML, you can easily log information from each 
subprocess to a centralized location and visualize it.

The [PyTorch Distributed](../guides/frameworks/pytorch/pytorch_distributed_example.md) script demonstrates using ClearML 
with the [PyTorch Distributed Communications Package (`torch.distributed`)](https://pytorch.org/tutorials/beginner/dist_overview.html): a 
ClearML task is initialized before the subprocesses are spawned, and then each subprocess manually reports its artifacts, 
scalars, and hyperparameters to the task. 


## Examples

Take a look at ClearML's PyTorch examples. The examples use PyTorch and ClearML in different configurations with 
additional tools, like argparse, TensorBoard, and matplotlib:  

* [PyTorch MNIST](../guides/frameworks/pytorch/pytorch_mnist.md) - Demonstrates ClearML automatically logging models created with PyTorch, and `argparse` command line parameters
* [PyTorch with Matplotlib](../guides/frameworks/pytorch/pytorch_matplotlib.md) - Demonstrates ClearML's automatic logging PyTorch models and matplotlib images. The images are presented in the resulting ClearML task's **Debug Samples**
* [PyTorch with TensorBoard](../guides/frameworks/pytorch/pytorch_tensorboard.md) - Demonstrates ClearML automatically logging PyTorch models, and scalars, debug samples, and text logged using TensorBoard's `SummaryWriter`
* [PyTorch TensorBoard Toy](../guides/frameworks/pytorch/tensorboard_toy_pytorch.md) - Demonstrates ClearML automatically logging debug samples logged using TensorBoard's `SummaryWriter`
* [PyTorch TensorBoardX](../guides/frameworks/pytorch/pytorch_tensorboardx.md) - Demonstrates ClearML automatically logging PyTorch models, and scalars, debug samples, and text logged using TensorBoardX's `SummaryWriter`
* [PyTorch Abseil](../guides/frameworks/pytorch/pytorch_abseil.md) - Demonstrates ClearML automatically logging PyTorch models and `absl.flags` parameters
* [PyTorch Model Updating](../guides/frameworks/pytorch/model_updating.md) - Demonstrates training, logging, and updating a PyTorch model using ClearML's [OutputModel](../references/sdk/model_outputmodel.md) class
* [PyTorch Distributed](../guides/frameworks/pytorch/pytorch_distributed_example.md) - Demonstrates using ClearML with the [PyTorch Distributed Communications Package (`torch.distributed`)](https://pytorch.org/tutorials/beginner/dist_overview.html)

## Remote Execution
ClearML logs all the information required to reproduce a task on a different machine (installed packages, 
uncommitted changes etc.). The [ClearML Agent](../clearml_agent.md) listens to designated queues and when a task is enqueued, 
the agent pulls it, recreates its execution environment, and runs it, reporting its scalars, plots, etc. to the 
task manager.

Deploy a ClearML Agent onto any machine (e.g. a cloud VM, a local GPU machine, your own laptop) by simply running the 
following command on it:

```commandline
clearml-agent daemon --queue <queues_to_listen_to> [--docker]
```

Use the ClearML [Autoscalers](../cloud_autoscaling/autoscaling_overview.md) to help you manage cloud workloads in the 
cloud of your choice (AWS, GCP, Azure) and automatically deploy ClearML agents: the autoscaler automatically spins up 
and shuts down instances as needed, according to a resource budget that you set.

### Reproducing Tasks

![Cloning, editing, enqueuing gif](../img/gif/integrations_yolov5.gif#light-mode-only)
![Cloning, editing, enqueuing gif](../img/gif/integrations_yolov5_dark.gif#dark-mode-only)

Use ClearML's web interface to edit task details, like configuration parameters or input models, then execute the task 
with the new configuration on a remote machine:

* Clone the task
* Edit the hyperparameters and/or other details
* Enqueue the task

The ClearML Agent executing the task will use the new values to [override any hard coded values](../clearml_agent.md).

### Executing a Task Remotely

You can set a task to be executed remotely programmatically by adding [`Task.execute_remotely()`](../references/sdk/task.md#execute_remotely) 
to your script. This method stops the current local execution of the task, and then enqueues it to a specified queue to 
re-run it on a remote machine.

```python
# If executed locally, process will terminate, and a copy will be executed by an agent instead
task.execute_remotely(queue_name='default', exit_process=True)
```
