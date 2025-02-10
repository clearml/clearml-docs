---
title: PyTorch TensorBoard Toy
---

The [tensorboard_toy_pytorch.py](https://github.com/allegroai/clearml/blob/master/examples/frameworks/pytorch/tensorboard_toy_pytorch.py) 
example demonstrates the integration of ClearML into code, which creates a TensorBoard `SummaryWriter` object to log 
debug sample images. When the script runs, it creates a task named `pytorch tensorboard toy example`, which is 
associated with the `examples` project.

## Debug Samples

The debug sample images appear according to metric, in the task's **DEBUG SAMPLES** tab.

![image](../../../img/examples_tensorboard_toy_pytorch_02.png)

## Hyperparameters

ClearML automatically logs TensorFlow Definitions. They appear in **CONFIGURATION** **>** **HYPERPARAMETERS** **>** **TF_DEFINE**.

![image](../../../img/examples_tensorboard_toy_pytorch_00.png)