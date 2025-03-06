---
title: PyTorch TensorBoardX
---

The [pytorch_tensorboardX.py](https://github.com/clearml/clearml/blob/master/examples/frameworks/tensorboardx/pytorch_tensorboardX.py) 
example demonstrates the integration of ClearML into code that uses PyTorch and TensorBoardX. 

The example does the following:
* Trains a simple deep neural network on the PyTorch built-in [MNIST](https://pytorch.org/vision/stable/datasets.html#mnist) 
  dataset. 
* Creates a task named `pytorch with tensorboardX` in the `examples` project.
* ClearML automatically captures scalars and text logged using the TensorBoardX `SummaryWriter` object, and 
  the model created by PyTorch. 

## Scalars

The loss and accuracy metric scalar plots, along with the resource utilization plots, which are titled **:monitor: machine**, 
appear in the task's page in the [web UI](../../../webapp/webapp_overview.md), under **SCALARS**.


![Scalars](../../../img/examples_pytorch_tensorboardx_03.png#light-mode-only)
![Scalars](../../../img/examples_pytorch_tensorboardx_03_dark.png#dark-mode-only)

## Hyperparameters

ClearML automatically logs command line options defined with `argparse`. They appear in **CONFIGURATION** **>** 
**HYPERPARAMETERS** **>** **Args**.

![Hyperparameters](../../../img/examples_pytorch_tensorboardx_01.png#light-mode-only)
![Hyperparameters](../../../img/examples_pytorch_tensorboardx_01_dark.png#dark-mode-only)

## Log

Text printed to the console for training progress, as well as all other console output, appear in **CONSOLE**.

![Console log](../../../img/examples_pytorch_tensorboardx_02.png#light-mode-only)
![Console log](../../../img/examples_pytorch_tensorboardx_02_dark.png#dark-mode-only)

## Artifacts

Models created by the task appear in the task's **ARTIFACTS** tab. ClearML automatically logs and tracks 
models and any snapshots created using PyTorch. 

![Artifacts](../../../img/examples_pytorch_tensorboardx_04.png#light-mode-only)
![Artifacts](../../../img/examples_pytorch_tensorboardx_04_dark.png#dark-mode-only)

Clicking on the model name takes you to the [model's page](../../../webapp/webapp_model_viewing.md), where you can view 
the model's details and access the model.

![Model details](../../../img/examples_pytorch_tensorboardx_model.png#light-mode-only)
![Model details](../../../img/examples_pytorch_tensorboardx_model_dark.png#dark-mode-only)
