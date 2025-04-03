---
title: MegEngine
---

The [megengine_mnist.py](https://github.com/clearml/clearml/blob/master/examples/frameworks/megengine/megengine_mnist.py) 
example demonstrates the integration of ClearML into code that uses [MegEngine](https://github.com/MegEngine/MegEngine) 
and [TensorBoardX](https://github.com/lanpa/tensorboardX). ClearML automatically captures models saved with `megengine`.

The example script does the following:
* Trains a simple deep neural network on MegEngine's built-in [MNIST](https://www.megengine.org.cn/doc/master/en/reference/api/megengine.data.dataset.MNIST.html)
  dataset.
* Creates a TensorBoardX `SummaryWriter` object to log scalars during training.  
* Creates a ClearML task named `megengine mnist train` in the `examples` project.

## Hyperparameters

ClearML automatically logs command line options defined with `argparse`. They appear in the task's **CONFIGURATION** 
tab under **HYPERPARAMETERS** **>** **Args**.

![Configuration tab](../../../img/examples_megengine_mnist_config.png#light-mode-only)
![Configuration tab](../../../img/examples_megengine_mnist_config_dark.png#dark-mode-only)

## Scalars

The example script's `train` function calls TensorBoardX's `SummaryWriter.add_scalar` method to report `loss`. 
ClearML automatically captures the data that is added to the `SummaryWriter` object.  

These scalars can be visualized in plots, which appear in the ClearML [WebApp](../../../webapp/webapp_home.md), in the 
task's **SCALARS** tab.


![Scalars tab](../../../img/examples_megengine_mnist_scalars.png#light-mode-only)
![Scalars tab](../../../img/examples_megengine_mnist_scalars_dark.png#dark-mode-only)

## Models

ClearML automatically captures the model logged using the `megengine.save` method, and saves it as an artifact.

View saved snapshots in the task's **ARTIFACTS** tab.

![Artifacts tab](../../../img/examples_megengine_models_1.png#light-mode-only)
![Artifacts tab](../../../img/examples_megengine_models_1_dark.png#dark-mode-only) 

To view the model details, click the model name in the **ARTIFACTS** page, which will open the model's info tab. Alternatively, download the model.

The model info panel contains the model details, including: 
* Model URL
* Framework
* Snapshot locations.

![Model info panel](../../../img/examples_megengine_models_2.png#light-mode-only)
![Model info panel](../../../img/examples_megengine_models_2_dark.png#dark-mode-only)

## Console

All console output during the script's execution appears in the task's **CONSOLE** page.

![Console tab](../../../img/examples_megengine_console.png#light-mode-only)
![Console tab](../../../img/examples_megengine_console_dark.png#dark-mode-only)

