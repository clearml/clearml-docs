---
title: TensorFlow
---

:::tip
If you are not already using ClearML, see [Getting Started](../getting_started/ds/ds_first_steps.md) for setup 
instructions.
:::

ClearML integrates with [TensorFlow](https://www.tensorflow.org/) out-of-the-box, automatically logging its models, 
definitions, scalars, as well as TensorBoard outputs. 

All you have to do is simply add two lines of code to your TensorFlow script:

```python
from clearml import Task

task = Task.init(task_name="<task_name>", project_name="<project_name>")
```

And that's it! This creates a [ClearML Task](../fundamentals/task.md) which captures: 
* Source code and uncommitted changes
* Installed packages
* TensorFlow definitions
* TensorFlow model files 
* [TensorBoard](https://www.tensorflow.org/tensorboard) outputs (see example [here](https://clear.ml/docs/latest/docs/guides/frameworks/tensorflow/tensorboard_toy/))
* Scalars (loss, learning rates)
* Console output
* General details such as machine details, runtime, creation date etc.
* And more

You can view all the task details in the [WebApp](../webapp/webapp_overview.md). 

![WebApp Gif](../img/gif/tensorflow.gif)

## Automatic Logging Control 
By default, when ClearML is integrated into your TensorFlow script, it captures TensorFlow definitions, models, and 
scalars. But, you may want to have more control over what your task logs.

To control a task's framework logging, use the `auto_connect_frameworks` parameter of [`Task.init()`](../references/sdk/task.md#taskinit). 
Completely disable all automatic logging by setting the parameter to `False`. For finer grained control of logged 
frameworks, input a dictionary, with framework-boolean pairs.

For example:

```python
auto_connect_frameworks={
   'tensorflow': False, 'matplotlib': True, 'tensorboard': False, 'pytorch': True,
   'xgboost': False, 'scikit': True, 'fastai': True, 'lightgbm': False,
   'hydra': True, 'detect_repository': True, 'tfdefines': True, 'joblib': True,
   'megengine': True, 'catboost': True
}
```

You can also input wildcards as dictionary values, so ClearML will log a model created by a framework only if its local 
path matches at least one wildcard. 

For example, in the code below, ClearML will log TensorFlow models only if their paths have the `.pt` extension. The 
unspecified frameworks' values default to true so all their models are automatically logged.

```python
auto_connect_frameworks={'tensorflow' : '*.pt'}
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

## Examples

Take a look at ClearML's TensorFlow examples. The examples use TensorFlow and ClearML in different configurations with 
additional tools, like Abseil and TensorBoard: 

* [TensorFlow MNIST](../guides/frameworks/tensorflow/tensorflow_mnist.md) - Demonstrates ClearML's automatic logging of 
model checkpoints, TensorFlow definitions, and scalars logged using TensorFlow methods
* [TensorBoard PR Curve](../guides/frameworks/tensorflow/tensorboard_pr_curve.md) - Demonstrates ClearML's automatic 
logging of TensorBoard output and TensorFlow definitions.
* [TensorBoard Toy](../guides/frameworks/tensorflow/tensorboard_toy.md) - Demonstrates ClearML's automatic logging of 
TensorBoard scalars, histograms, images, and text, as well as all console output and TensorFlow Definitions.
* [Absl flags](https://github.com/allegroai/clearml/blob/master/examples/frameworks/tensorflow/absl_flags.py) - Demonstrates 
ClearML's automatic logging of parameters defined using `absl.flags` 

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

### Cloning, Editing, and Enqueuing

![Cloning, editing, enqueuing gif](../img/gif/integrations_yolov5.gif)

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

## Hyperparameter Optimization
Use ClearML's [`HyperParameterOptimizer`](../references/sdk/hpo_optimization_hyperparameteroptimizer.md) class to find 
the hyperparameter values that yield the best performing models. See [Hyperparameter Optimization](../fundamentals/hpo.md) 
for more information.
