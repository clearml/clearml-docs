---
title: Auto-logging Experiments 
---

In ClearML, experiments are organized as [Tasks](../fundamentals/task.md).

When you integrate the ClearML SDK  with your code, the ClearML task manager automatically captures:
* Source code and uncommitted changes
* Installed packages
* General information such as machine details, runtime, creation date etc.
* Model files, parameters, scalars, and plots from popular ML frameworks such as TensorFlow and PyTorch (see list of [supported frameworks](../clearml_sdk/task_sdk.md#automatic-logging))
* Console output

:::tip Automatic logging control
To control what ClearML automatically logs, see this [FAQ](../faq.md#controlling_logging).
:::

## To Auto-log Your Experiments

1. Install `clearml` and connect it to the ClearML Server (see [instructions](../clearml_sdk/clearml_sdk.md))
1. At the beginning of your code, import the `clearml` package:

   ```python
   from clearml import Task
   ```

   :::tip Full Automatic Logging
   To ensure full automatic logging, it is recommended to import the `clearml` package at the top of your entry script.
   :::

1. Initialize the Task object in your `main()` function, or the beginning of the script.

   ```python
   task = Task.init(project_name='great project', task_name='best task')
   ```

   If the project does not already exist, a new one is created automatically.

   The console should display the following output:

   ```
   ClearML Task: created new task id=1ca59ef1f86d44bd81cb517d529d9e5a
   2021-07-25 13:59:09
   ClearML results page: https://app.clear.ml/projects/4043a1657f374e9298649c6ba72ad233/experiments/1ca59ef1f86d44bd81cb517d529d9e5a/output/log
   2025-01-25 13:59:16
   ```
   
1. Click the results page link to go to the [task's detail page in the ClearML WebApp](../webapp/webapp_exp_track_visual.md), 
   where you can monitor the task's status, view all its logged data, visualize its results, and more!

   ![Info panel](../img/webapp_tracking_40.png#light-mode-only) 
   ![Info panel](../img/webapp_tracking_40_dark.png#dark-mode-only)

**That's it!** You are done integrating ClearML with your code :)

Now, [command-line arguments](../fundamentals/hyperparameters.md#tracking-hyperparameters), [console output](../fundamentals/logger.md#types-of-logged-results), TensorBoard and Matplotlib, and much more will automatically be 
logged in the UI under the created Task.

Sit back, relax, and watch your models converge :)