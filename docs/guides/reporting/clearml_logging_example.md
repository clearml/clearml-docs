---
title: Using Logger - Jupyter Notebook
---

The [jupyter_logging_example.ipynb](https://github.com/clearml/clearml/blob/master/examples/reporting/jupyter_logging_example.ipynb) 
script demonstrates the integration of ClearML's explicit reporting module, `Logger`, in a Jupyter Notebook. All ClearML 
explicit reporting works with Jupyter Notebook. 

This example includes several types of explicit reporting, including: 
* Scalars
* Some plots 
* Media.

:::note
In the ``clearml`` GitHub repository, this example includes a clickable icon to open the notebook in Google Colab.
:::

## Scalars

To reports scalars, call [`Logger.report_scalar()`](../../references/sdk/logger.md#report_scalar). 
The scalar plots appear in the **web UI** in **SCALARS**.

```python
# report two scalar series on two different graphs
for i in range(10):
    logger.report_scalar(title="graph A", series="series A", iteration=i, value=1./(i+1))
    logger.report_scalar(title="graph B", series="series B", iteration=i, value=10./(i+1))
```

![Separate scalar plots](../../img/colab_explicit_reporting_01.png)

```python
# report two scalar series on the same graph
for i in range(10):
    logger.report_scalar(title="unified graph", series="series A", iteration=i, value=1./(i+1))
    logger.report_scalar(title="unified graph", series="series B", iteration=i, value=10./(i+1))
```    

![Unified scalar plots](../../img/colab_explicit_reporting_02.png)

## Plots

Plots appear in **PLOTS**.

### 2D Plots

Report 2D scatter plots by calling [`Logger.report_scatter2d()`](../../references/sdk/logger.md#report_scatter2d). 
Use the `mode` parameter to plot data points as markers, or both lines and markers.

```python
scatter2d = np.hstack(
    (np.atleast_2d(np.arange(0, 10)).T, np.random.randint(10, size=(10, 1)))
)
# report 2d scatter plot with markers
logger.report_scatter2d(
    title="example_scatter",
    series="series_lines+markers",
    iteration=iteration,
    scatter=scatter2d,
    xaxis="title x",
    yaxis="title y",
    mode='lines+markers'
)
```

![2d scatter plot](../../img/colab_explicit_reporting_04.png)

### 3D Plots

To plot a series as a 3D scatter plot, use [`Logger.report_scatter3d()`](../../references/sdk/logger.md#report_scatter3d).

```python
# report 3d scatter plot
scatter3d = np.random.randint(10, size=(10, 3))
logger.report_scatter3d(
    title="example_scatter_3d",
    series="series_xyz",
    iteration=iteration,
    scatter=scatter3d,
    xaxis="title x",
    yaxis="title y",
    zaxis="title z",
)
```

![3d scatter plot](../../img/colab_explicit_reporting_05.png)

To plot a series as a surface plot, use [`Logger.report_surface()`](../../references/sdk/logger.md#report_surface).

```python
# report 3d surface
surface = np.random.randint(10, size=(10, 10))
logger.report_surface(
    title="example_surface",
    series="series1",
    iteration=iteration,
    matrix=surface,
    xaxis="title X",
    yaxis="title Y",
    zaxis="title Z",
)
```

![3d surface plot](../../img/colab_explicit_reporting_06.png)

### Confusion Matrices

Report confusion matrices by calling [`Logger.report_confusion_matrix()`](../../references/sdk/logger.md#report_confusion_matrix).

```python
# report confusion matrix
confusion = np.random.randint(10, size=(10, 10))
logger.report_confusion_matrix(
    title="example_confusion",
    series="ignored",
    iteration=iteration,
    matrix=confusion,
    xaxis="title X",
    yaxis="title Y",
)
```   

![Confusion matrix](../../img/colab_explicit_reporting_03.png)

### Histograms

Report histograms by calling [`Logger.report_histogram()`](../../references/sdk/logger.md#report_histogram). 
To report more than one series on the same plot, use the same `title` argument.

```python
# report a single histogram
histogram = np.random.randint(10, size=10)
logger.report_histogram(
    title="single_histogram",
    series="random histogram",
    iteration=iteration,
    values=histogram,
    xaxis="title x",
    yaxis="title y",
)
```
    
![Histogram](../../img/colab_explicit_reporting_12.png)
    
```python
# report a two histograms on the same plot
histogram1 = np.random.randint(13, size=10)
histogram2 = histogram * 0.75
logger.report_histogram(
    title="two_histogram",
    series="series 1",
    iteration=iteration,
    values=histogram1,
    xaxis="title x",
    yaxis="title y",
)
logger.report_histogram(
    title="two_histogram",
    series="series 2",
    iteration=iteration,
    values=histogram2,
    xaxis="title x",
    yaxis="title y",
)
```

![Two histograms in one plot](../../img/colab_explicit_reporting_07.png)

## Media

Report audio, HTML, image, and video by calling [`Logger.report_media()`](../../references/sdk/logger.md#report_media) 
using the `local_path` parameter. They appear in **DEBUG SAMPLES**.

The media for these examples is downloaded using [`StorageManager.get_local_copy()`](../../references/sdk/storage.md#storagemanagerget_local_copy).

For example, to download an image:

```python
image_local_copy = StorageManager.get_local_copy(
    remote_url="https://pytorch.org/tutorials/_static/img/neural-style/picasso.jpg",
    name="picasso.jpg"
)
```

### Audio

```python
logger.report_media(title='audio', series='pink panther', iteration=1, local_path=audio_local_copy)
``` 

![Audio sample](../../img/colab_explicit_reporting_08.png)

### HTML

```python
logger.report_media(
    title="html", 
    series="url_html", 
    iteration=1, 
    url="https://clear.ml/docs/latest/docs/index.html"
)
```

![HTML sample](../../img/colab_explicit_reporting_09.png)

### Images

```python
logger.report_image(
    title="image", 
    series="image from url", 
    iteration=100, 
    local_path=image_local_copy
)
```

![Image sample](../../img/colab_explicit_reporting_10.png)

### Video

```python
logger.report_media(
    title='video', 
    series='big bunny', 
    iteration=1, 
    local_path=video_local_copy
)
```

![Video sample](../../img/colab_explicit_reporting_11.png)

## Text

Report text messages by calling [`Logger.report_text()`](../../references/sdk/logger.md#report_text). 

```python
logger.report_text("hello, this is plain text")
```    

![Text report to console](../../img/colab_explicit_reporting_13.png)