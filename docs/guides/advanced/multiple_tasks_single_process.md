---
title: Multiple Tasks in Single Process
---

The [multiple_tasks_single_process](https://github.com/clearml/clearml/blob/master/examples/advanced/multiple_tasks_single_process.py)
script demonstrates the capability to log a single script in multiple ClearML tasks.  

In order to log a script in multiple tasks, each task needs to be initialized using [`Task.init()`](../../references/sdk/task.md#taskinit) 
with the `task_name` and `project_name` parameters input. Before initializing an additional task in the same script, the 
previous task must be manually shut down with [`Task.close()`](../../references/sdk/task.md#close). 

When the script is executed, the console should display the following output:

```text
ClearML Task: created new task id=5c4d2d3674a94e35b10f04d9d2180l62
ClearML results page: https://app.clear.ml/projects/6835eb7316554c2b933b69638470fe02/experiments/5c4d2d3674a94e35b10f04d9d2180l62/output/log
...
ClearML Task: created new task id=28a84c17a6204b438e1e7a094a234a7f
ClearML results page: https://app.clear.ml/projects/7894eb7316554c4b933a79638473fe02/experiments/28a84c17a6204b438e1e7a094a234a7f/output/log
...
ClearML Task: created new task id=6d1e253ba0234d32a38sg85013185g46
ClearML results page: https://app.clear.ml/projects/7895eb7316554c4b933a69638470fe02/experiments/6d1e253ba0234d32a38sg85013185g46/output/log
```

Notice that three separate tasks with distinct IDs are created, and a link is provided to view the results of each one.  