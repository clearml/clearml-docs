---
title: LightGBM
---

The [lightgbm_example](https://github.com/clearml/clearml/blob/master/examples/frameworks/lightgbm/lightgbm_example.py) 
script demonstrates the integration of ClearML into code that uses LightGBM. 

The example script does the following: 
* Creates a dataset for LightGBM to train a model
* Specifies configuration which are automatically captured by ClearML
* Saves model which ClearML automatically captures
* Creates a task named `LightGBM` in the `examples` project.

## Scalars

The scalars logged in the task can be visualized in a plot, which appears in the ClearML web UI, in the task's **SCALARS** tab.

![LightGBM scalars](../../../img/examples_lightgbm_scalars.png)

## Hyperparameters

ClearML automatically logs the configurations applied to LightGBM. They appear in **CONFIGURATIONS > HYPERPARAMETERS > GENERAL**.

![LightGBM hyperparameters](../../../img/examples_lightgbm_config.png)

## Artifacts

Models created by the task appear in the task's **ARTIFACTS** tab. ClearML automatically logs and tracks 
models and any snapshots created using LightGBM. 

![LightGBM model](../../../img/examples_lightgbm_model.png)

## Console

All other console output appears in **CONSOLE**.

![LightGBM console](../../../img/examples_lightgbm_console.png)


