---
title: Keras with Matplotlib - Jupyter Notebook
---

The [jupyter.ipynb](https://github.com/clearml/clearml/blob/master/examples/frameworks/keras/jupyter.ipynb) example 
demonstrates ClearML's automatic logging of code running in a Jupyter Notebook that uses Keras and Matplotlib. 

The example does the following: 
1. Trains a simple deep neural network on the Keras built-in [MNIST](https://keras.io/api/datasets/mnist/#load_data-function) 
   dataset.
1. Builds a sequential model using a categorical cross entropy loss objective function. 
   
1. Specifies accuracy as the metric, and uses two callbacks: a TensorBoard callback and a model checkpoint callback. 
   
1. During script execution, creates a task named `notebook example` in the `examples` project.

## Scalars

The loss and accuracy metric scalar plots appear in **SCALARS**, along with the resource utilization plots, which are titled **:monitor: machine**.

![image](../../../img/examples_keras_jupyter_08.png)

## Plots

The example calls Matplotlib methods to create several sample plots, and TensorBoard methods to plot histograms for layer density. 
They appear in **PLOTS**.

![image](../../../img/examples_keras_jupyter_03.png)

![image](../../../img/examples_keras_jupyter_03a.png)

## Debug Samples

The example calls Matplotlib methods to log debug sample images. They appear in **DEBUG SAMPLES**.

![image](../../../img/examples_keras_jupyter_04.png)

## Hyperparameters

ClearML automatically logs TensorFlow Definitions. A parameter dictionary is logged by connecting it to the Task, by 
calling [`Task.connect()`](../../../references/sdk/task.md#connect). 

```python
task_params = {'num_scatter_samples': 60, 'sin_max_value': 20, 'sin_steps': 30}
task_params = task.connect(task_params)
```
Later in the Jupyter Notebook, more parameters are added to the dictionary.

```python
task_params['batch_size'] = 128
task_params['nb_classes'] = 10
task_params['nb_epoch'] = 6
task_params['hidden_dim'] = 512
```

Parameter dictionaries appear in **CONFIGURATION** **>** **HYPERPARAMETERS** **>** **General**.

![image](../../../img/examples_keras_jupyter_20.png)

The TensorFlow Definitions appear in the **TF_DEFINE** subsection.

![image](../../../img/examples_keras_jupyter_21.png)

## Console

Text printed to the console for training appears in **CONSOLE**.

![image](../../../img/examples_keras_jupyter_07.png)

## Artifacts

Models created by the task appear in the task's **ARTIFACTS** tab. ClearML automatically logs and tracks models
created using Keras.

The task info panel shows model tracking, including the model name and design in **ARTIFACTS** **>** **Output Model**.

![image](../../../img/examples_keras_jupyter_23.png)

Clicking on the model name takes you to the [model's page](../../../webapp/webapp_model_viewing.md), where you can view 
the model's details and access the model.

![image](../../../img/examples_keras_jupyter_24.png)