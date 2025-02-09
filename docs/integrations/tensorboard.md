---
title: TensorBoard
---

:::tip
If you are not already using ClearML, see [Getting Started](../getting_started/ds/ds_first_steps.md).
:::

[TensorBoard](https://www.tensorflow.org/tensorboard) is TensorFlow's data visualization toolkit. 
ClearML automatically captures all data logged to TensorBoard. All you have to do is add two
lines of code to your script:

```python
from clearml import Task

task = Task.init(task_name="<task_name>", project_name="<project_name>")
```

This will create a [ClearML Task](../fundamentals/task.md) that captures your script's information, including Git details,
uncommitted code, python environment, your TensorBoard metrics, plots, images, and text. 

View the TensorBoard outputs in the [WebApp](../webapp/webapp_overview.md), in the task's page.

![TensorBoard WebApp scalars](../img/examples_pytorch_tensorboard_07.png)

![Tensorboard WebApp debug samples](../img/examples_tensorboard_toy_pytorch_02.png)

## Automatic Logging Control 
By default, when ClearML is integrated into your script, it captures all of your TensorBoard plots, images, and metrics. 
But, you may want to have more control over what your task logs.

To control a task's framework logging, use the `auto_connect_frameworks` parameter of [`Task.init()`](../references/sdk/task.md#taskinit). 
Completely disable all automatic logging by setting the parameter to `False`. For finer grained control of logged 
frameworks, input a dictionary, with framework-boolean pairs.

For example:

```python
auto_connect_frameworks={
   'tensorboard': False,'matplotlib': False, 'tensorflow': False,  'pytorch': True,
   'xgboost': False, 'scikit': True, 'fastai': True, 'lightgbm': False,
   'hydra': True, 'detect_repository': True, 'tfdefines': True, 'joblib': True,
   'megengine': True, 'catboost': True
}
```

Note that the `tensorboard` key enables/disables automatic logging for both `TensorBoard` and `TensorboardX`. 

## Manual Logging
To augment its automatic logging, ClearML also provides an explicit logging interface.

See more information about explicitly logging information to a ClearML Task:
* [Models](../clearml_sdk/model_sdk.md#manually-logging-models)
* [Configuration](../clearml_sdk/task_sdk.md#configuration) (e.g. parameters, configuration files)
* [Artifacts](../clearml_sdk/task_sdk.md#artifacts) (e.g. output files or python objects created by a task)
* [Scalars](../clearml_sdk/task_sdk.md#scalars) 
* [Text/Plots/Debug Samples](../fundamentals/logger.md#manual-reporting)

### Examples
Take a look at ClearML's TensorBoard examples: 
* [TensorBoard PR Curve](../guides/frameworks/tensorflow/tensorboard_pr_curve.md) - Demonstrates logging TensorBoard outputs and TensorFlow flags
* [TensorBoard Toy](../guides/frameworks/tensorflow/tensorboard_toy.md) - Demonstrates logging TensorBoard histograms, scalars, images, text, and TensorFlow flags
* [Tensorboard with PyTorch](../guides/frameworks/pytorch/pytorch_tensorboard.md) - Demonstrates logging TensorBoard scalars, debug samples, and text integrated in code that uses PyTorch