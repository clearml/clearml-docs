---
title: Fast.ai
---
The [fastai_with_tensorboard_example.py](https://github.com/clearml/clearml/blob/master/examples/frameworks/fastai/legacy/fastai_with_tensorboard_example.py) 
example demonstrates the integration of ClearML into code that uses FastAI v1 and TensorBoard. 

:::note FastAI V2
The ClearML repository also includes [examples using FastAI v2](https://github.com/clearml/clearml/tree/master/examples/frameworks/fastai).
:::


The example code does the following:
1. Trains a simple deep neural network on the fastai built-in MNIST dataset (see the [fast.ai](https://fastai1.fast.ai) documentation).
1. Uses the fastai `LearnerTensorboardWriter` callback, and ClearML automatically logs TensorBoard through the callback. 
1. During script execution, creates a task named `fastai with tensorboard callback` in the `examples` project.

## Scalars

ClearML automatically logs the histogram output to TensorBoard. They appear in **PLOTS**.

![image](../../../img/examples_reporting_fastai_01.png)

## Plots

Histograms output to TensorBoard. They appear in **PLOTS**.

![image](../../../img/examples_reporting_fastai_02.png)

## Logs

Text printed to the console for training progress, as well as all other console output, appear in **CONSOLE**.

![image](../../../img/examples_reporting_fastai_03.png)
