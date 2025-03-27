---
title: Matplotlib
---

The example below demonstrates integrating ClearML into code that uses `matplotlib` to plot scatter diagrams, and 
show images. ClearML automatically logs the diagrams and images. 

View the example in [script](https://github.com/clearml/clearml/blob/master/examples/frameworks/matplotlib/matplotlib_example.py) 
or in [Jupyter Notebook](https://github.com/clearml/clearml/blob/master/examples/frameworks/matplotlib/jupyter_matplotlib_example.ipynb).

:::note 
The example in [Jupyter Notebook](https://github.com/clearml/clearml/blob/master/examples/frameworks/matplotlib/jupyter_matplotlib_example.ipynb) 
includes a clickable icon to open the notebook in Google Colab.
:::

When the example runs, it creates a task named `Matplotlib example`
in the `examples` project (in script) or the `Colab notebooks` project (in Jupyter Notebook).



## Plots

The scatter plots appear in the **ClearML Web UI**, in **PLOTS**.

![Matplotlib plot 1](../../../img/examples_matplotlib_example_01.png#light-mode-only)
![Matplotlib plot 1](../../../img/examples_matplotlib_example_01_dark.png#dark-mode-only)

![Matplotlib plot 2](../../../img/examples_matplotlib_example_02.png#light-mode-only)
![Matplotlib plot 2](../../../img/examples_matplotlib_example_02_dark.png#dark-mode-only)

![Matplotlib plot 3](../../../img/examples_matplotlib_example_03.png#light-mode-only)
![Matplotlib plot 3](../../../img/examples_matplotlib_example_03_dark.png#dark-mode-only)

## Debug Samples

The images appear in **DEBUG SAMPLES**. Each debug sample image is associated with a metric.

![Matplotlib image plot](../../../img/examples_matplotlib_example_04.png#light-mode-only)
![Matplotlib image plot](../../../img/examples_matplotlib_example_04_dark.png#dark-mode-only)

View the debug sample in the image viewer.

![Image viewer](../../../img/examples_matplotlib_example_05.png#light-mode-only)
![Image viewer](../../../img/examples_matplotlib_example_05_dark.png#dark-mode-only)