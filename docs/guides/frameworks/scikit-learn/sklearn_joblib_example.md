---
title: scikit-learn with Joblib 
---

The [sklearn_joblib_example.py](https://github.com/allegroai/clearml/blob/master/examples/frameworks/scikit-learn/sklearn_joblib_example.py) 
demonstrates the integration of ClearML into code that uses `scikit-learn` and `joblib` to store a model and model snapshots, 
and `matplotlib` to create a scatter diagram. When the script runs, it creates a task named 
`scikit-learn joblib example` in the `examples` project.

## Plots

ClearML automatically logs the scatter plot, which appears in the [task's page](../../../webapp/webapp_exp_track_visual.md) 
in the ClearML web UI, under **PLOTS**.

![image](../../../img/examples_sklearn_joblib_example_06.png)

## Artifacts

Models created by the task appear in the task's **ARTIFACTS** tab. 

![image](../../../img/examples_sklearn_joblib_example_01.png)

Clicking on the model name takes you to the [model's page](../../../webapp/webapp_model_viewing.md), where you can 
view the model's details and access the model.


![image](../../../img/examples_sklearn_joblib_example_02.png)