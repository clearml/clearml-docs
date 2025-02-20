---
title: Keras with TensorBoard
---

The example below demonstrates the integration of ClearML into code which uses Keras and TensorBoard.
View it in [script](https://github.com/clearml/clearml/blob/master/examples/frameworks/keras/keras_tensorboard.py)
or in [Jupyter Notebook](https://github.com/clearml/clearml/blob/master/examples/frameworks/keras/jupyter_keras_TB_example.ipynb).

:::note
The example in [Jupyter Notebook](https://github.com/clearml/clearml/blob/master/examples/frameworks/keras/jupyter_keras_TB_example.ipynb) 
includes a clickable icon to open the notebook in Google Colab.
:::

The example script does the following:
1. Trains a simple deep neural network on the Keras built-in [MNIST](https://keras.io/api/datasets/mnist/#load_data-function) 
   dataset.
1. Builds a sequential model using a categorical cross entropy loss objective function.
1. Specifies accuracy as the metric, and uses two callbacks: a TensorBoard callback and a model checkpoint callback.
1. During script execution, creates a task named `Keras with TensorBoard example` in the 
   `examples` project (in script) or the `Colab notebooks` project (in Jupyter Notebook).


## Scalars

The loss and accuracy metric scalar plots appear in **SCALARS**, along with the resource utilization plots, 
which are titled **:monitor: machine**.

![image](../../../img/examples_keras_01.png)

## Histograms

Histograms for layer density appear in **PLOTS**.

![image](../../../img/examples_keras_02.png)

## Hyperparameters

ClearML automatically logs command line options generated with `argparse`, and TensorFlow Definitions.

Command line options appear in **CONFIGURATION** **>** **HYPERPARAMETERS** **>** **Args**.

![image](../../../img/examples_keras_00.png)

TensorFlow Definitions appear in **TF_DEFINE**.

![image](../../../img/examples_keras_00a.png)

## Console

Text printed to the console for training progress, as well as all other console output, appear in **CONSOLE**.

![image](../../../img/keras_colab_01.png)

## Configuration Objects

A configuration dictionary is connected to the Task by calling [`Task.connect()`](../../../references/sdk/task.md#connect). 

```python
task.connect_configuration(
   name="MyConfig", 
   configuration={'test': 1337, 'nested': {'key': 'value', 'number': 1}}
)
```

It appears in **CONFIGURATION** **>** **CONFIGURATION OBJECTS** **>** **MyConfig**. 

![image](../../../img/keras_colab_02.png)