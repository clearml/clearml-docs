---
title: Logger
---

The ClearML Logger class is used to report experiments' results such as metrics, graphs, and debug samples. It is provided 
through the ClearML [Task](task.md) object. 

A Logger object is used to do the following:
* [Manual reporting](#manual-reporting), complementing ClearML's [automatic reporting](#automatic-reporting)
* [Logging configuration](#logger-configuration)
    * Set upload destination for debug sample storage
    * Control ClearML's automatic logging
    * Set default NaN and Inf values
    
## Types of Logged Results
ClearML supports four types of reports:
- Text - Mostly captured automatically from stdout and stderr but can be logged manually.
- Scalars - Time series data. X-axis is always a sequential number, usually iterations but can be epochs or others.
- Plots - General graphs and diagrams, such as histograms, confusion matrices, line plots, and custom plotly charts.
- Debug Samples - Images, audio, and videos. Can be reported per iteration.

![Logged plots](../img/report_plotly.png#light-mode-only)
![Logged plots](../img/report_plotly_dark.png#dark-mode-only)

## Automatic Reporting

ClearML automatically captures metrics reported to leading visualization libraries, such as TensorBoard and Matplotlib, 
with no additional code necessary.

In addition, ClearML captures and logs everything written to standard output, from debug messages to errors to 
library warning messages.

GPU, CPU, Memory, and Network information is also automatically captured.

![CPU monitoring](../img/fundamentals_logger_cpu_monitoring.png#light-mode-only)
![CPU monitoring](../img/fundamentals_logger_cpu_monitoring_dark.png#dark-mode-only)

### Supported Packages
- [TensorBoard](https://www.tensorflow.org/tensorboard)
- [TensorBoardX](https://github.com/lanpa/tensorboardX)
- [Matplotlib](https://matplotlib.org/)

### Automatic Reporting Examples
Check out some of ClearML's automatic reporting examples for supported packages:
* TensorBoard
  * [TensorBoard PR Curve](../guides/frameworks/tensorflow/tensorboard_pr_curve.md) - logging TensorBoard outputs and
    TensorFlow flags
  * [TensorBoard Toy](../guides/frameworks/tensorflow/tensorboard_toy.md) - logging TensorBoard histograms, scalars, images, text, and 
    TensorFlow flags
  * [Tensorboard with PyTorch](../guides/frameworks/pytorch/pytorch_tensorboard.md) - logging TensorBoard scalars, debug samples, and text integrated into 
    code that uses PyTorch
* TensorBoardX
  * [TensorBoardX with PyTorch](../guides/frameworks/tensorboardx/tensorboardx.md) - logging TensorBoardX scalars, debug 
  samples, and text in code using PyTorch
  * [MegEngine MNIST](../guides/frameworks/megengine/megengine_mnist.md) - logging scalars using TensorBoardX's `SummaryWriter`  
* Matplotlib 
  * [Matplotlib](../guides/frameworks/matplotlib/matplotlib_example.md) - logging scatter diagrams plotted with Matplotlib
  * [Matplotlib with PyTorch](../guides/frameworks/pytorch/pytorch_matplotlib.md) - logging debug images shown 
    by Matplotlib
    
## Manual Reporting

ClearML also supports manually reporting multiple types of metrics and plots, such as line plots, histograms, and even plotly 
charts.


The object used for reporting metrics is called **logger** and is obtained by calling [`Task.get_logger()`](../references/sdk/task.md#get_logger).


### Media Reporting

ClearML also supports reporting media (such as audio, video and images) for every iteration.
This section is mostly used for debugging. It's recommended to use [artifacts](task.md#artifacts) for storing script 
outputs that would be used later on.

Only the last X results of each title / series are saved to prevent overloading the server.
See details in [`Logger.report_media`](../references/sdk/logger.md#report_media). 

![Logger reported images](../img/webapp_tracking_43.png#light-mode-only)
![Logger reported images](../img/webapp_tracking_43_dark.png#dark-mode-only)

### Explicit Reporting Examples

Check out ClearML's explicit reporting examples for various types of results:
- [Text](../guides/reporting/text_reporting.md) 
- [Scalars](../guides/reporting/scalar_reporting.md)
- Plots 
    - [2d plots](../guides/reporting/scatter_hist_confusion_mat_reporting.md)
      - Histograms
      - Confusion matrices
      - Scatter plots
    - [3d plots](../guides/reporting/3d_plots_reporting.md)
      - Surface plots
      - Scatter plots
    - [Tables](../guides/reporting/pandas_reporting.md)
        - Pandas DataFrames 
        - CSV file
    - [Matplotlib figures](../guides/reporting/manual_matplotlib_reporting.md)
    - [Plotly figures](../guides/reporting/plotly_reporting.md)
- Debug Samples
    - [Images](../guides/reporting/image_reporting.md)
    - [HTML](../guides/reporting/html_reporting.md)
    - [Media - images, audio, video](../guides/reporting/media_reporting.md)
- Explicit reporting in Jupyter Notebook [example](../guides/reporting/clearml_logging_example.md)

## Logger Configuration
The Logger class provides methods to control aspects of ClearML's logging.

### Upload Destination
Set the default storage URI for uploading debug samples using the [`Logger.set_default_upload_destination`](../references/sdk/logger.md#set_default_upload_destination) method.
The debug samples are uploaded separately. A link to each sample is reported.

:::note DESTINATION STORAGE CREDENTIALS
Credentials for the destination storage are specified in the [ClearML configuration file](../configs/clearml_conf.md#sdk-section). 
:::

### Automatic Logging Settings
The Logger class provides methods for fine-tuning ClearML's automatic logging behavior with Matplotlib and Tensorboard. 
For example, use the [`Logger.matplotlib_force_report_non_interactive`](../references/sdk/logger.md#loggermatplotlib_force_report_non_interactive) 
class method to control how matplotlib objects are logged. See the [`Logger.tensorboard_auto_group_scalars`](../references/sdk/logger.md#loggertensorboard_auto_group_scalars) 
class method.  


### Set Default NaN and Inf Values
When you report metrics that include NaN or Inf values, ClearML logs them as `0` by default. You can specify
different default values for NaN and Inf using the [`Logger.set_reporting_nan_value`](../references/sdk/logger.md#loggerset_reporting_nan_value) 
and the [`Logger.set_reporting_inf_value`](../references/sdk/logger.md#loggerset_reporting_inf_value) class methods respectively. 