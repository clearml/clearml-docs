---
title: 3D Plots Reporting
---

The [3d_plots_reporting.py](https://github.com/allegroai/clearml/blob/master/examples/reporting/3d_plots_reporting.py) 
example demonstrates reporting a series as a surface plot and as a 3D scatter plot. 

When the script runs, it creates a task named `3D plot reporting` in the `examples` project.

ClearML reports these plots in the task's **PLOTS** tab. 

## Surface Plot

To plot a series as a surface plot, use [`Logger.report_surface()`](../../references/sdk/logger.md#report_surface):

```python
# report 3d surface
surface = np.random.randint(10, size=(10, 10))
Logger.current_logger().report_surface(
    title="example_surface",
    series="series1",
    iteration=iteration,
    matrix=surface,
    xaxis="title X",
    yaxis="title Y",
    zaxis="title Z",
)
```
View the reported surface plot in **PLOTS**.

![Surface plot](../../img/examples_reporting_02.png)

## 3D Scatter Plot

To plot a series as a 3D scatter plot, use [`Logger.report_scatter3d()`](../../references/sdk/logger.md#report_scatter3d):

```python
# report 3d scatter plot
scatter3d = np.random.randint(10, size=(10, 3))
Logger.current_logger().report_scatter3d(
    title="example_scatter_3d",
    series="series_xyz",
    iteration=iteration,
    scatter=scatter3d,
    xaxis="title x",
    yaxis="title y",
    zaxis="title z",
)
```

View the reported 3D scatter plot in **PLOTS**.
![3d scatter plot](../../img/examples_reporting_01.png)
