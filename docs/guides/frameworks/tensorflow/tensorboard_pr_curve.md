---
title: TensorBoard PR Curve
---

The [tensorboard_pr_curve.py](https://github.com/clearml/clearml/blob/master/examples/frameworks/tensorflow/tensorboard_pr_curve.py) 
example demonstrates the integration of ClearML into code that uses TensorFlow and TensorBoard. 

The example script does the following:
* Creates a task named `tensorboard pr_curve` in the `examples` project.
* Creates three classes, R, G, and B, and generates colors within the RGB space from normal distributions. The true 
  label of each random color is associated with the normal distribution that generated it.
* Computes the probability that each color belongs to the class, using three other normal distributions.
* Generate PR curves using those probabilities. 
* Creates a summary per class using [`tensorboard.plugins.pr_curve.summary`](https://github.com/tensorflow/tensorboard/blob/master/tensorboard/plugins/pr_curve/summary.py).
* ClearML automatically captures TensorBoard output, TensorFlow Definitions, and output to the console.

## Plots

In the **ClearML Web UI**, the PR Curve summaries appear in the task's page under **PLOTS**.

* Blue PR curves

  ![Blue PR curves](../../../img/examples_tensorboard_pr_curve_01.png#light-mode-only)
  ![Blue PR curves](../../../img/examples_tensorboard_pr_curve_01_dark.png#dark-mode-only)

* Green PR curves

  ![Green PR curves](../../../img/examples_tensorboard_pr_curve_02.png#light-mode-only)
  ![Green PR curves](../../../img/examples_tensorboard_pr_curve_02_dark.png#dark-mode-only)

* Red PR curves

  ![Red PR curves](../../../img/examples_tensorboard_pr_curve_03.png#light-mode-only)
  ![Red PR curves](../../../img/examples_tensorboard_pr_curve_03_dark.png#dark-mode-only)

## Hyperparameters

ClearML automatically logs TensorFlow Definitions. They appear in **CONFIGURATION** **>** **HYPERPARAMETERS** **>** **TF_DEFINE**.

![Hyperparameters](../../../img/examples_tensorboard_pr_curve_04.png#light-mode-only)
![Hyperparameters](../../../img/examples_tensorboard_pr_curve_04_dark.png#dark-mode-only)

## Console

All console output appears in **CONSOLE** tab.

![Console log](../../../img/examples_tensorboard_pr_curve_05.png#light-mode-only)
![Console log](../../../img/examples_tensorboard_pr_curve_05_dark.png#dark-mode-only)
