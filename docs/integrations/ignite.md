---
title: PyTorch Ignite
---

:::tip
If you are not already using ClearML, see [Getting Started](../getting_started/ds/ds_first_steps.md) for setup 
instructions.
:::

[PyTorch Ignite](https://pytorch.org/ignite/index.html) is a library for training and evaluating neural networks in 
PyTorch. You can integrate ClearML into your code using Ignite's built-in loggers: [TensorboardLogger](#tensorboardlogger) 
and [ClearMLLogger](#clearmllogger). 

## TensorboardLogger

ClearML integrates seamlessly with TensorboardLogger, and automatically captures all information logged through the 
handler: metrics, parameters, images, and gradients.

All you have to do is add two lines of code to your script:

```python
from clearml import Task

task = Task.init(task_name="<task_name>", project_name="<project_name>")
```

This will create a [ClearML Task](../fundamentals/task.md) that captures your script's information, including Git details, 
uncommitted code, python environment, all information logged through `TensorboardLogger`, and more. 

Visualize all the captured information in the task's page in ClearML's [WebApp](#webapp).

See a code example [here](https://github.com/allegroai/clearml/blob/master/examples/frameworks/ignite/cifar_ignite.py).

## ClearMLLogger
PyTorch Ignite supports a ClearML Logger to log metrics, text, model/optimizer parameters, plots, and model checkpoints 
during training and validation. 

Integrate ClearML with the following steps:
1. Create a `ClearMLLogger` object:

   ```python
   from ignite.contrib.handlers.clearml_logger import *

   clearml_logger = ClearMLLogger(task_name="ignite", project_name="examples")
   ```
   
   This creates a [ClearML Task](../fundamentals/task.md) called `ignite` in the `examples` project, which captures your 
   script's information, including Git details, uncommitted code, python environment. 
  
   You can also pass the following parameters to the `ClearMLLogger` object:
   * `task_type` – The type of task (see [task types](../fundamentals/task.md#task-types)).
   * `report_freq` – The histogram processing frequency (handles histogram values every X calls to the handler). Affects 
     `GradsHistHandler` and `WeightsHistHandler` (default: 100).
   * `histogram_update_freq_multiplier` – The histogram report frequency (report first X histograms and once every X 
     reports afterwards) (default: 10).
   * `histogram_granularity` - Histogram sampling granularity (default: 50).

1. Attach the `ClearMLLogger` to output handlers to log metrics: 

   ```python 
   # Attach the logger to the trainer to log training loss 
   clearml_logger.attach_output_handler(
       trainer,
       event_name=Events.ITERATION_COMPLETED(every=100),
       tag="training",
       output_transform=lambda loss: {"batchloss": loss},
   )
  
   # Attach the logger to log loss and accuracy for both training and validation
   for tag, evaluator in [("training metrics", train_evaluator), ("validation metrics", validation_evaluator)]:
       clearml_logger.attach_output_handler(
           evaluator,
           event_name=Events.EPOCH_COMPLETED,
           tag=tag,
           metric_names=["loss", "accuracy"],
           global_step_transform=global_step_from_engine(trainer),
       )
   ```

1. Attach the `ClearMLLogger` object to helper handlers to log task outputs. Ignite supports the following helper handlers for ClearML:
   * **ClearMLSaver** - Saves input snapshots as ClearML artifacts.
   * **GradsHistHandler** and **WeightsHistHandler** - Logs the model's gradients and weights respectively as histograms.
   * **GradsScalarHandler** and **WeightsScalarHandler** - Logs gradients and weights respectively as scalars.
   * **OptimizerParamsHandler** - Logs optimizer parameters

   ```python
   # Attach the logger to the trainer to log model's weights norm
   clearml_logger.attach(
       trainer, log_handler=WeightsScalarHandler(model), event_name=Events.ITERATION_COMPLETED(every=100)
   )

   # Attach the logger to the trainer to log model's weights as a histogram 
   clearml_logger.attach(trainer, log_handler=WeightsHistHandler(model), event_name=Events.EPOCH_COMPLETED(every=100))

   # Attach the logger to the trainer to log model's gradients as scalars
   clearml_logger.attach(
       trainer, log_handler=GradsScalarHandler(model), event_name=Events.ITERATION_COMPLETED(every=100)
   )

   #Attach the logger to the trainer to log model's gradients as a histogram    
   clearml_logger.attach(trainer, log_handler=GradsHistHandler(model), event_name=Events.EPOCH_COMPLETED(every=100))

   handler = Checkpoint(
       {"model": model},
       ClearMLSaver(),
       n_saved=1,
       score_function=lambda e: e.state.metrics["accuracy"],
       score_name="val_acc",
       filename_prefix="best",
       global_step_transform=global_step_from_engine(trainer),
   )
   validation_evaluator.add_event_handler(Events.EPOCH_COMPLETED, handler)
   
   # Attach the logger to the trainer to log optimizer's parameters, e.g. learning rate at each iteration
   clearml_logger.attach(
      trainer,
      log_handler=OptimizerParamsHandler(optimizer),
      event_name=Events.ITERATION_STARTED
   )
   ```
   
Visualize all the captured information in the task's page in ClearML's [WebApp](#webapp).

For more information, see the [ignite documentation](https://pytorch.org/ignite/v0.5.0.post2/generated/ignite.handlers.clearml_logger.html). 

See code example [here](https://github.com/pytorch/ignite/blob/master/examples/mnist/mnist_with_clearml_logger.py).

## WebApp

All the task information that ClearML captures can be viewed in the [WebApp](../webapp/webapp_overview.md): 

### Models

View saved model snapshots in the **ARTIFACTS** tab.

![Model snapshots](../img/ignite_artifact.png)

### Scalars 

View the scalars in the task's **SCALARS** tab.

![Scalars](../img/examples_cifar_scalars.png)


### Debug Samples

ClearML automatically tracks images logged to `TensorboardLogger`. They appear in the task's **DEBUG SAMPLES**.


![Debug Samples](../img/examples_integration_pytorch_ignite_debug.png)

