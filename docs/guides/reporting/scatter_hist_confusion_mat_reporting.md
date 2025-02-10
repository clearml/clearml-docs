---
title: 2D Plots Reporting
---

The [scatter_hist_confusion_mat_reporting.py](https://github.com/allegroai/clearml/blob/master/examples/reporting/scatter_hist_confusion_mat_reporting.py) 
example demonstrates reporting series data in the following 2D formats: 
* [Histograms](#histograms)
* [Confusion matrices](#confusion-matrices)
* [Scatter plots](#2d-scatter-plots) 

ClearML reports these tables in the **ClearML Web UI** **>** task's **PLOTS** tab. 

When the script runs, it creates a task named `2D plots reporting` in the `examples` project.

## Histograms

Report histograms by calling [`Logger.report_histogram()`](../../references/sdk/logger.md#report_histogram). 
To report more than one series on the same plot, use same the `title` argument. For different plots, use different 
`title` arguments. Specify the type of histogram with the `mode` parameter. The `mode` values are `group` (default), 
`stack`, and `relative`.

```python
# report a single histogram
histogram = np.random.randint(10, size=10)
Logger.current_logger().report_histogram(
    title="single_histogram",
    series="random histogram",
    iteration=iteration,
    values=histogram,
    xaxis="title x",
    yaxis="title y",
)
    
# report two histograms on the same graph (plot)
histogram1 = np.random.randint(13, size=10)
histogram2 = histogram * 0.75
Logger.current_logger().report_histogram(
    title="two_histogram",
    series="series 1",
    iteration=iteration,
    values=histogram1,
    xaxis="title x",
    yaxis="title y",
)
    
Logger.current_logger().report_histogram(
    "two_histogram",
    "series 2",
    iteration=iteration,
    values=histogram2,
    xaxis="title x",
    yaxis="title y",
)
```

![image](../../img/examples_reporting_15.png)

![image](../../img/examples_reporting_15a.png)

## Confusion Matrices

Report confusion matrices by calling [`Logger.report_confusion_matrix()`](../../references/sdk/logger.md#report_confusion_matrix).

```python
# report confusion matrix
confusion = np.random.randint(10, size=(10, 10))
Logger.current_logger().report_confusion_matrix(
    title="example_confusion",
    series="ignored",
    iteration=iteration,
    matrix=confusion,
    xaxis="title X",
    yaxis="title Y",
)
```

![image](../../img/examples_reporting_16.png)

```python
# report confusion matrix with 0,0 is at the top left
Logger.current_logger().report_confusion_matrix(
    title="example_confusion_0_0_at_top",
    series="ignored",
    iteration=iteration,
    matrix=confusion,
    xaxis="title X",
    yaxis="title Y",
    yaxis_reversed=True,
)
```

## 2D Scatter Plots

Report 2D scatter plots by calling [`Logger.report_scatter2d()`](../../references/sdk/logger.md#report_scatter2d). 
Use the `mode` parameter to plot data points with lines (by default), markers, or both lines and markers.

```python
scatter2d = np.hstack(
    (np.atleast_2d(np.arange(0, 10)).T, np.random.randint(10, size=(10, 1)))
)
    
# report 2d scatter plot with lines
Logger.current_logger().report_scatter2d(
    title="example_scatter",
    series="series_xy",
    iteration=iteration,
    scatter=scatter2d,
    xaxis="title x",
    yaxis="title y",
)
    
# report 2d scatter plot with markers
Logger.current_logger().report_scatter2d(
    title="example_scatter",
    series="series_markers",
    iteration=iteration,
    scatter=scatter2d,
    xaxis="title x",
    yaxis="title y",
    mode='markers'
)
    
# report 2d scatter plot with lines and markers
Logger.current_logger().report_scatter2d(
    title="example_scatter",
    series="series_lines+markers",
    iteration=iteration,
    scatter=scatter2d,
    xaxis="title x",
    yaxis="title y",
    mode='lines+markers'
)
```    

![image](../../img/examples_reporting_17.png)