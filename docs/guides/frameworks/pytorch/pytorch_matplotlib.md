---
title: PyTorch with Matplotlib
---

The [pytorch_matplotlib.py](https://github.com/clearml/clearml/blob/master/examples/frameworks/pytorch/pytorch_matplotlib.py) 
example demonstrates the integration of ClearML into code that uses PyTorch and Matplotlib. 

The example does the following: 
* Creates a task named `pytorch with matplotlib example`, in the `examples` project.
* The script calls Matplotlib methods to show images, each with a different title.
* ClearML automatically logs the images as debug samples. 

## Debug Samples

The images shown in the example script's `imshow` function appear according to metric in **DEBUG SAMPLES**.

![Debug samples](../../../img/examples_pytorch_matplotlib_02.png#light-mode-only)
![Debug samples](../../../img/examples_pytorch_matplotlib_02_dark.png#dark-mode-only)

Select a debug sample by metric.

![Debug sample selection](../../../img/examples_pytorch_matplotlib_02a.png#light-mode-only)
![Debug sample selection](../../../img/examples_pytorch_matplotlib_02a_dark.png#dark-mode-only)

Click a debug sample to view it in the image viewer.

![Debug sample image viewer](../../../img/examples_pytorch_matplotlib_02b.png#light-mode-only)
![Debug sample image viewer](../../../img/examples_pytorch_matplotlib_02b_dark.png#dark-mode-only)














