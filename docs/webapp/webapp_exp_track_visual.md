---
title: Tracking Tasks and Visualizing Results
---

While a task is running, and any time after it finishes, track it and visualize the results in the ClearML Web UI,
including:

* [Execution details](#execution) - Code, the container image used for [ClearML Agent](../clearml_agent.md), output destination for artifacts, and the logging level.
* [Configuration](#configuration) - Hyperparameters, user properties, and configuration objects.
* [Artifacts](#artifacts) - Input model, output model, model snapshot locations, other artifacts.
* [Info](#info) - Extended task information, such as the start, create, and last update times and dates, user creating the task, and its description.
* [Console](#console) - stdout, stderr, output to the console from libraries, and ClearML explicit reporting.
* [Scalars](#scalars) - Metric plots.
* [Plots](#plots) - Other plots and data, for example: Matplotlib, Plotly, and ClearML explicit reporting.
* [Debug samples](#debug-samples) - Images, audio, video, and HTML.

## Viewing Modes

The ClearML Web UI provides two viewing modes for task details:

* [Info panel](#info-panel)
* [Full screen details mode](#full-screen-details-view)

Both modes contain all task details. When either view is open, switch to the other mode by clicking <img src="/docs/latest/icons/ico-info-min.svg" alt="Table/Full screen view" className="icon size-md space-sm" />
(**View in task table / full screen**), or clicking <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Bars menu" className="icon size-md space-sm" /> (**menu**) > **View in tasks
table / full screen**.


### Info Panel

The info panel keeps the task table in view so that [task actions](webapp_exp_table.md#task-actions)
can be performed from the table (as well as the menu in the info panel).

![Info panel](../img/webapp_tracking_40.png#light-mode-only) 
![Info panel](../img/webapp_tracking_40_dark.png#dark-mode-only)

Click <img src="/docs/latest/icons/ico-compact-view.svg" alt="Compressed view" className="icon size-md space-sm" /> to 
hide details in the task table, so only the task names and statuses are displayed

![Compressed info panel](../img/webapp_tracking_41.png#light-mode-only) 
![Compressed info panel](../img/webapp_tracking_41_dark.png#dark-mode-only)

### Full Screen Details View

The full screen details view allows for easier viewing and working with task tracking and results. The task
table is not visible when the full screen details view is open. Perform task actions from the menu.

![Full screen view](../img/webapp_tracking_33.png#light-mode-only) 
![Full screen view](../img/webapp_tracking_33_dark.png#dark-mode-only)

## Execution 
A task's **EXECUTION** tab of lists the following:
* Source code
* Uncommitted changes
* Installed Python packages
* Container details
* Output details

In full-screen mode, the source code and output details are grouped in the **DETAILS** section.

### Source Code

The Source Code section of a task's **EXECUTION** tab includes:
* The task's repository
* Commit ID
* Script path
* Working directory
* Binary (Python executable)

![Source code section](../img/webapp_exp_source_code.png#light-mode-only) 
![Source code section](../img/webapp_exp_source_code_dark.png#dark-mode-only)

### Uncommitted Changes

ClearML displays the git diff of the task in the Uncommitted Changes section. 

![Uncommitted changes section](../img/webapp_exp_uncommitted_changes.png#light-mode-only) 
![Uncommitted changes section](../img/webapp_exp_uncommitted_changes_dark.png#dark-mode-only)

### Python Packages

The Python Packages section lists the task's installed Python packages and their versions.

![Python packages section](../img/webapp_exp_installed_packages.png#light-mode-only) 
![Python packages section](../img/webapp_exp_installed_packages_dark.png#dark-mode-only)

When a ClearML agent executing a task ends up using a different set of Python packages than was originally 
specified, both the original specification (`original pip` or `original conda`), and the packages the agent ended up 
using to set up an environment (`pip` or `conda`) are available. Select which requirements to view in the dropdown menu.  

![Packages used by agent](../img/webapp_exp_installed_packages_2.png#light-mode-only)
![Packages used by agent](../img/webapp_exp_installed_packages_2_dark.png#dark-mode-only)

### Container
The Container section list the following information:
* Image - a pre-configured container that ClearML Agent will use to remotely execute this task (see [Building Task Execution Environments in a Container](../getting_started/clearml_agent_base_docker.md))
* Arguments - add container arguments
* Setup shell script - a bash script to be executed inside the container before setting up the task's environment

:::important 
To [rerun](webapp_exp_tuning.md) a task through the UI in the listed container, the ClearML Agent executing the task must be running in 
Docker mode:

```bash
clearml-agent daemon --queue <execution_queue_to_pull_from> --docker [optional default docker image to use]
```

For more information, see [Docker Mode](../clearml_agent/clearml_agent_execution_env.md#docker-mode).
:::

![Container section](../img/webapp_exp_container.png#light-mode-only)
![Container section](../img/webapp_exp_container_dark.png#dark-mode-only)

### Output
The Output details include:
* The output destination used for storing model checkpoints (snapshots) and artifacts (see also, [default_output_uri](../configs/clearml_conf.md#config_default_output_uri)
  in the configuration file, and `output_uri` in [`Task.init`](../references/sdk/task.md#taskinit) parameters).

![Execution details section](../img/webapp_exp_output.png#light-mode-only)
![Execution details section](../img/webapp_exp_output_dark.png#dark-mode-only)

## Configuration

All parameters and configuration objects appear in the **CONFIGURATION** tab.


### Hyperparameters

Hyperparameters are grouped by their type and appear in **CONFIGURATION** **>** **HYPERPARAMETERS**. Once a task 
is run and stored in ClearML Server, any of these hyperparameters can be [modified](webapp_exp_tuning.md#modifying-tasks).

#### Command Line Arguments

The **Args** group shows automatically logged argument parser parameters (e.g. `argparse`, `click`, `hydra`). 
Hover over <img src="/docs/latest/icons/ico-description.svg" alt="Description" className="icon size-md space-sm" /> (menu) on a 
parameter's line, and the type, description, and default value appear, if they were provided.

![Command line arguments configuration group](../img/webapp_tracking_22.png#light-mode-only)
![Command line arguments configuration group](../img/webapp_tracking_22_dark.png#dark-mode-only)

#### Environment Variables

If environment variables were listed in the `CLEARML_LOG_ENVIRONMENT` environment variable or the [`sdk.development.log_os_environments`](../configs/clearml_conf.md#log_env_var) 
field of the `clearml.conf` file, the **Environment** group displays the listed environment variables (see [this FAQ](../faq.md#track-env-vars)).

:::note
The `CLEARML_LOG_ENVIRONMENT` variable always overrides the `clearml.conf` file. 
:::

![Environment variables configuration group](../img/webapp_tracking_23.png#light-mode-only)
![Environment variables configuration group](../img/webapp_tracking_23_dark.png#dark-mode-only)

#### Custom Parameter Groups

Custom parameter groups show parameter dictionaries if the parameters were connected to the Task, using 
[`Task.connect()`](../references/sdk/task.md#connect) with a `name` argument provided. `General` is the default section
if a name is not provided.

![Custom parameters group](../img/webapp_tracking_25.png#light-mode-only)
![Custom parameters group](../img/webapp_tracking_25_dark.png#dark-mode-only)

#### TensorFlow Definitions

The **TF_DEFINE** parameter group shows automatic TensorFlow logging.

![TF_DEFINE parameter group](../img/webapp_tracking_26.png#light-mode-only)
![TF_DEFINE parameter group](../img/webapp_tracking_26_dark.png#dark-mode-only)

### User Properties

User properties allow to store any descriptive information in a key-value pair format. They are editable in any task,
except *Published* ones (read-only).

![User properties section](../img/webapp_tracking_21.png#light-mode-only)
![User properties section](../img/webapp_tracking_21_dark.png#dark-mode-only)

### Configuration Objects

ClearML tracks a task's model configuration objects, which appear in **Configuration Objects** **>** **General**.
These objects include those that are automatically tracked, and those connected to a Task in code (see [`Task.connect_configuration`](../references/sdk/task.md#connect_configuration)).

![Configuration objects](../img/webapp_tracking_24.png#light-mode-only)
![Configuration objects](../img/webapp_tracking_24_dark.png#dark-mode-only)

ClearML supports providing a name for a Task model configuration object (see the `name`
parameter in [`Task.connect_configuration`](../references/sdk/task.md#connect_configuration)).

![Custom configuration objects](../img/webapp_tracking_28.png#light-mode-only)
![Custom configuration objects](../img/webapp_tracking_28_dark.png#dark-mode-only)

## Artifacts

Task artifacts, including models, appear in the **ARTIFACTS** tab. 

Each non-model artifact entry displays: 
* File path
* File size
* Hash
* Metadata (if set)

Artifact location is displayed in the `FILE PATH` field. To access model and other artifact files:
* **Local Files**: Use the 'copy to clipboard' action (<img src="/docs/latest/icons/ico-copy-to-clipboard.svg" alt="Clipboard" className="icon size-md space-sm" />)
to obtain the file path to facilitate local storage access since web applications are prohibited from accessing the local disk for security reasons.
* **Remote Files**  (e.g. network-hosted artifacts with `https://`, `s3://`, etc. URIs): Use the download action (<img src="/docs/latest/icons/ico-download-json.svg" alt="Download" className="icon size-md space-sm" />) 
to retrieve the file.

![Other artifacts section](../img/webapp_tracking_30.png#light-mode-only)
![Other artifacts section](../img/webapp_tracking_30_dark.png#dark-mode-only)

### Models

The task's input and output models appear in the **ARTIFACTS** tab. Each model entry shows:
* Model name
* ID
* Configuration. 

Input models also display their creating task, which on-click navigates you to the task's page. 

![Models in Artifacts tab](../img/webapp_exp_artifacts_01.png#light-mode-only)
![Models in Artifacts tab](../img/webapp_exp_artifacts_01_dark.png#dark-mode-only)

To view more model details, including design, label enumeration, and general information, click the model name
to navigate to its page in the **MODELS** tab (see [Model Details](webapp_model_viewing.md)). 


## Info

The **INFO** tab shows extended task information:
* [Latest task events log](#latest-events-log)
* [Task description](#description)
* [Task details](#task-details)

### Latest Events Log 

:::important Enterprise Feature
The latest events log is available under the ClearML Enterprise plan.
:::

The Enterprise Server also displays a detailed history of task activity: 
* Task action (e.g. status changes, project move, etc.)
* Action time
* Acting user
* Action source (i.e. ClearML Agent, SDK, or UI)
* Action source version 

To download the task history as a CSV file, hover over the log and click <img src="/docs/latest/icons/ico-download.svg" alt="Download" className="icon size-md space-sm" />.   

![Task audit log](../img/webapp_info_audit_log.png#light-mode-only)
![Task audit log](../img/webapp_info_audit_log_dark.png#dark-mode-only)

:::note Limited persistency
ClearML maintains a system-wide, large but strict limit for task history items. Once the limit is reached, the oldest entries are purged to make room for fresh entries.
:::

### Description 
Add descriptive text to the task in the **Description** section. To modify the description, hover over the 
description box and click **Edit**.

### Task Details
The **Task Details** section lists information describing the task:

* The parent task
* Project name
* Creation, start, and last update dates and times
* User who created the task
* Task state (status)
* Whether the task is archived
* Runtime properties - Information about the machine running the task:
  * Operating system
  * CUDA driver version
  * Number of CPU cores
  * Number of GPUs
  * CPU / GPU type
  * Memory size
  * Host name 
  * Processor
  * Python version
* Task Progress    
    
![Info tab](../img/webapp_tracking_31.png#light-mode-only)
![Info tab](../img/webapp_tracking_31_dark.png#dark-mode-only)

## Task Results

:::tip Embedding ClearML Visualization
You can embed task plots and debug samples into ClearML [Reports](webapp_reports.md). These visualizations are 
updated live as the task(s) updates. The Enterprise Plan and Hosted Service support embedding resources in external 
tools (e.g. Notion). See [Plot Controls](#plot-controls).  
:::

### Console

The complete task log containing everything printed to stdout and stderr appears in the **CONSOLE** tab. The full log
is downloadable. To view the end of the log, click **Jump to end**.

![Console tab](../img/webapp_tracking_32.png#light-mode-only)
![Console tab](../img/webapp_tracking_32_dark.png#dark-mode-only)


### Scalars

All scalars that ClearML automatically logs, as well as those explicitly reported in code, appear in
**SCALARS**. 

Scalar series can be displayed in [graph view](#graph-view) (default) or in [metric values view](#metric-values-view):

#### Graph View 
Scalar graph view (<img src="/docs/latest/icons/ico-charts-view.svg" alt="Graph view" className="icon size-md space-sm" />) 
shows scalar series plotted as a time series line chart. By default, a single plot is shown for each scalar metric, 
with all variants overlaid within.

The series are sub-sampled for 
display efficiency. For high resolution, view a series in full screen mode by hovering over the graph and clicking <img src="/docs/latest/icons/ico-maximize.svg" alt="Maximize plot icon" className="icon size-md space-sm" />.

:::info Full Screen Refresh
Scalar graphs in full screen mode do not auto-refresh. Click <img src="/docs/latest/icons/ico-reset.svg" alt="Refresh" className="icon size-md space-sm medium-zoom-image" /> 
to update the graph. 
:::

Single value scalars (see [`Logger.report_single_value`](../references/sdk/logger.md#report_single_value)) are shown in 
a `Summary` table.

![Single value scalar plot](../img/webapp_single_scalar_plot.png#light-mode-only)
![Single value scalar plot](../img/webapp_single_scalar_plot_dark.png#dark-mode-only)

#### Scalar Plot Tools

Use the scalar tools to improve analysis of scalar metrics. In the info panel, click <img src="/docs/latest/icons/ico-settings.svg" alt="Settings gear" className="icon size-md space-sm" /> to use the tools. In the full screen details view, the tools
are on the left side of the window. The tools include:

<a id="group_by"/>

* **Group by** - Select one of the following:
  * **Metric** - Displays all variants for a metric on the same plot. For example, if you have a "Test" metric with 
    "loss" and "accuracy" variants, both variants will appear on the same plot that is titled "Test".

    ![Plots grouped by metric](../img/webapp_tracking_33.png#light-mode-only)
    ![Plots grouped by metric](../img/webapp_tracking_33_dark.png#dark-mode-only)
  
  * **None** -  Displays individual plots for each metric-variant combination, grouped into sections by metric. For 
    example, a "Test" metric with "loss" and "accuracy" variants will have a separate plot for each variant under the 
    "Test" group.

    ![Plots groups my metric and variant](../img/webapp_tracking_34.png#light-mode-only)
    ![Plots groups my metric and variant](../img/webapp_tracking_34_dark.png#dark-mode-only)

* Horizontal axis - Select the x-axis units:
  * Iterations
  * Time from start - Time since task began
  * Wall time - Local clock time
* Curve smoothing - Choose which smoothing algorithm to use from the dropdown menu: Exponential moving average, Gaussian, 
  or Running Average. Use the slider to configure the smoothing factor or specify a value manually. 
* Show / hide plots - Click <img src="/docs/latest/icons/ico-show.svg" alt="Eye Show" className="icon size-md space-sm" /> to control which 
  plots to display. For example, to display specific plots, click **HIDE ALL**, and then click <img src="/docs/latest/icons/ico-show.svg" alt="Eye Show" className="icon size-md space-sm" /> 
  on each plot you want to view.

To embed scalar plots in your [Reports](webapp_reports.md), hover over a plot and click Embed <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" />, 
which will copy to clipboard the embed code to put in your Reports. To quickly get the embed codes for all plots of a 
specific metric, click Embed <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
on the group section header (available when plots are [grouped by](#group_by) `None`).

![Embed metric group](../img/webapp_tracking_34b.png#light-mode-only)
![Embed metric group](../img/webapp_tracking_34b_dark.png#dark-mode-only)

In contrast to static screenshots, embedded resources 
are retrieved when the report is displayed allowing your reports to show the latest up-to-date data.

See additional [plot controls](#plot-controls) below.

#### Metric Values View

The metric values view (<img src="/docs/latest/icons/ico-table-view.svg" alt="Table view" className="icon size-md space-sm" />)
shows a table summary of your metrics with a row per metric/variant:

* First - The metric/variant series' initial value
* Last - The metric/variant series' last value
* Min -  The metric/variant series' minimum value
* Max - The metric/variant series' maximum value
* Mean - The metric/variant series' mean value

If all the values of a specific metric/variant are the same, the row will display a <img src="/docs/latest/icons/ico-equal-outline.svg" alt="Same values" className="icon size-md space-sm" /> sign.

![Plots tab](../img/webapp_tracking_34a.png#light-mode-only)
![Plots tab](../img/webapp_tracking_34a_dark.png#dark-mode-only)

Choose which metrics to view using one of the following out the options:
* Use the quick filter bar (<img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-sm" />) 
to only show metrics/variants whose name fit a partial-string match 
* Use the filter menu (<img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" />) to 
select which metrics to view by clicking their show/hide button (<img src="/docs/latest/icons/ico-show.svg" alt="Eye Show" className="icon size-md space-sm" />). 
Click **Hide/Show all**, to quickly hide/show all metrics.


### Plots
Non-time-series plots appear in **PLOTS**. These include data generated by libraries, visualization tools, and 
explicitly reported using the ClearML Logger. These may include 2D and 3D plots, tables (Pandas and CSV files), and 
Plotly plots. Individual plots can be shown / hidden or filtered by title.

![Plots tab](../img/webapp_tracking_35.png#light-mode-only)
![Plots tab](../img/webapp_tracking_35_dark.png#dark-mode-only)

Plots are grouped into sections by metric. To quickly get the embed codes for all plots of a specific metric, click Embed <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
on the group section header.

For each metric/variant combination, the latest reported plot is displayed.

When viewing a plot in full screen (<img src="/docs/latest/icons/ico-maximize.svg" alt="Maximize plot icon" className="icon size-md space-sm" />), 
older iterations are available through the iteration slider (or using the up/down arrow keyboard shortcut). Go to the 
previous/next plot in the current iteration using the <img src="/docs/latest/icons/ico-previous.svg" alt="Previous" className="icon size-md space-sm" /> / <img src="/docs/latest/icons/ico-next.svg" alt="Next" className="icon size-md space-sm" /> 
buttons (or using the left/right arrow keyboard shortcut).


![Plots maximize tab](../img/webapp_tracking_35a.png#light-mode-only)
![Plots maximize tab](../img/webapp_tracking_35a_dark.png#dark-mode-only)

#### Plot Controls

The table below lists the plot controls which may be available for any plot (in the **SCALARS** and **PLOTS** tabs). 
These controls allow you to better analyze the results. Hover over a plot, and the controls appear.

|Icon|Description|
|---|---|
| <img src="/docs/latest/icons/ico-download-pic.svg" alt="Download PNG icon" className="icon size-sm space-sm" /> | Download plots as PNG files. |
| <img src="/docs/latest/icons/ico-pan.svg" alt="Pan icon" className="icon size-sm space-sm" /> | Pan around plot. Click <img src="/docs/latest/icons/ico-pan.svg" alt="Pan icon" className="icon size-sm space-sm" />, click the plot, and then drag. |
| <img src="/docs/latest/icons/ico-dotted-box.svg" alt="Dotted box icon" className="icon size-sm space-sm" /> | To examine an area, draw a dotted box around it. Click <img src="/docs/latest/icons/ico-dotted-box.svg" alt="Dotted box icon" className="icon size-sm space-sm" /> and then drag. |
| <img src="/docs/latest/icons/ico-dotted-lasso.svg" alt="Dotted lasso icon" className="icon size-sm space-sm" /> | To examine an area, draw a dotted lasso around it. Click <img src="/docs/latest/icons/ico-dotted-lasso.svg" alt="Dotted lasso icon" className="icon size-sm space-sm" /> and then drag. |
| <img src="/docs/latest/icons/ico-zoom.svg" alt="Zoom icon" className="icon size-sm space-sm" /> | Zoom into a section of a plot. Zoom in - Click <img src="/docs/latest/icons/ico-zoom.svg" alt="Zoom icon" className="icon size-sm space-sm" /> and drag over a section of the plot. Reset to original scale - Click <img src="/docs/latest/icons/ico-reset-autoscale.svg" alt="Reset autoscale icon" className="icon size-sm space-sm" />. |
| <img src="/docs/latest/icons/ico-zoom-in-square.svg" alt="Zoom-in icon" className="icon size-sm space-sm" /> | Zoom in. |
| <img src="/docs/latest/icons/ico-zoom-out-square.svg" alt="Zoom-out icon" className="icon size-sm space-sm" /> | Zoom out. |
| <img src="/docs/latest/icons/ico-reset-autoscale.svg" alt="Reset autoscale icon" className="icon size-sm space-sm" /> | Reset to autoscale after zooming (<img src="/docs/latest/icons/ico-zoom.svg" alt="Zoom icon" className="icon size-sm space-sm" />, <img src="/docs/latest/icons/ico-zoom-in-square.svg" alt="Zoom-in icon" className="icon size-sm space-sm" />, or <img src="/docs/latest/icons/ico-zoom-out-square.svg" alt="Zoom-out icon" className="icon size-sm space-sm" />). |
| <img src="/docs/latest/icons/ico-reset-axes.svg" alt="Reset axes icon" className="icon size-sm space-sm" /> | Reset axes after a zoom. |
| <img src="/docs/latest/icons/ico-spike-lines.svg" alt="Spike lines icon" className="icon size-sm space-sm" /> | Show / hide spike lines. |
| <img src="/docs/latest/icons/ico-show-closest.svg" alt="Show closest icon" className="icon size-sm space-sm" /> <br/> <img src="/docs/latest/icons/ico-compare-data.svg" alt="Compare data icon" className="icon size-sm space-sm" /> <br/> <img src="/docs/latest/icons/ico-x-unified.svg" alt="X-united mode" className="icon size-sm space-sm" />| Set data hover mode:<ul><li><img src="/docs/latest/icons/ico-show-closest.svg" alt="Show closest icon" className="icon size-sm space-sm" /> Closest - Show the (X, Y) data point closest to the cursor, including horizontal and vertical axes values</li><li> <img src="/docs/latest/icons/ico-compare-data.svg" alt="Compare data icon" className="icon size-sm space-sm" /> X - Show labels for points with the same x value as the cursor  </li><li> <img src="/docs/latest/icons/ico-x-unified.svg" alt="X-united mode" className="icon size-sm space-sm"/> X unified - Show a single label for the points with the same x value as the cursor</li></ul> |
| <img src="/docs/latest/icons/ico-logarithmic-view.svg" alt="Logarithmic view icon" className="icon size-sm space-sm" /> | Switch to logarithmic view. |
| <img src="/docs/latest/icons/ico-graph-legend.svg" alt="Graph legend icon" className="icon size-sm space-sm" /> | Hide / show the legend. |
| <img src="/docs/latest/icons/ico-reset_1.svg" alt="Plot layout setting" className="icon size-sm space-sm" />| Switch between original and auto-fitted plot dimensions. The original layout is the plot's user-defined dimensions. |
| <img src="/docs/latest/icons/ico-download-json-plot.svg" alt="Download JSON icon" className="icon size-sm space-sm" /> | Download plot data as a JSON file. |
| <img src="/docs/latest/icons/ico-download-csv.svg" alt="Download CSV icon" className="icon size-sm space-sm" /> | Download **table** plot data as a CSV file. |
| <img src="/docs/latest/icons/ico-maximize.svg" alt="Maximize plot icon" className="icon size-sm space-sm" /> | Expand plot to entire window. When used with scalar graphs, full screen mode displays plots with all data points, as opposed to an averaged plot |
| <img src="/docs/latest/icons/ico-reset.svg" alt="Refresh" className="icon size-sm space-sm" /> | Refresh scalar graphs in full screen mode to update it.  | 
| <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-sm space-sm" /> | Copy to clipboard the resource embed code. This opens the following options: <ul><li>**Embed in External tool** (available in the ClearML Enterprise plan and Hosted Service) - Copy code to add to external tools (e.g. Notion). </li><li>**Embed in ClearML report** - Copy code to add to a [report](webapp_reports.md)</li></ul> In contrast to static screenshots, embedded resources are retrieved when the tool/report is displayed allowing your tools/reports to show the latest up-to-date data. |

 

#### 3D Plot Controls 
|Icon|Description|
|---|---|
| <img src="/docs/latest/icons/ico-orbital-rotation.svg" alt="Orbital rotation mode icon" className="icon size-sm space-sm" />| Switch to orbital rotation mode - rotate the plot around its middle point. |
| <img src="/docs/latest/icons/ico-turntable-rotation.svg" alt="Turntable rotation mode icon" className="icon size-sm space-sm" />| Switch to turntable rotation mode - rotate the plot around its middle point while constraining one axis |
| <img src="/docs/latest/icons/ico-reset-axes.svg" alt="reset axes icon" className="icon size-sm space-sm" />| Reset axes to default position. |


### Debug Samples

Task outputs such as images, audio, and videos appear in **DEBUG SAMPLES**. These include data generated by 
libraries and visualization tools, and explicitly reported using the [ClearML Logger](../fundamentals/logger.md). 

You can view debug samples by metric in the reported iterations. Filter the samples by metric by selecting a metric from the 
dropdown menu above the samples. The most recent iteration appears first.

![Debug Samples tab](../img/webapp_tracking_43.png#light-mode-only)
![Debug Samples tab](../img/webapp_tracking_43_dark.png#dark-mode-only)

For each metric, the latest reported debug sample is displayed.

Click a sample to view it in full screen. If the sample is video or audio, the full screen mode includes a player. 

When viewing a sample in full screen, older iterations are available through the iteration slider (or using the up/down 
arrow keyboard shortcut). Go to the previous/next sample in the current iteration using the <img src="/docs/latest/icons/ico-previous.svg" alt="Previous" className="icon size-md space-sm" /> / <img src="/docs/latest/icons/ico-next.svg" alt="Next" className="icon size-md space-sm" /> 
buttons (or using the left/right arrow keyboard shortcut).


![Debug Samples image viewer](../img/webapp_tracking_44.png#light-mode-only)
![Debug Samples image viewer](../img/webapp_tracking_44_dark.png#dark-mode-only)

## Tagging Tasks

<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/uqik38jlBsQ?si=joU-KOPpUNLbn6Ws" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

Tags are user-defined, color-coded labels that can be added to tasks (and pipelines, datasets, and models), 
allowing to easily identify and group tasks. Tags can help in organizing, querying, and automating tasks.
For example, tag tasks by the machine type used to execute them, label versions, team names, or any other
category.

You can use tags to filter the tasks in your task table (see [Filtering Columns](webapp_exp_table.md#filtering-columns))
or when querying tasks in your code (see [Tag Filters](../clearml_sdk/task_sdk.md#tag-filters)). You can trigger 
task execution according to their tags (see [TriggerScheduler](../references/sdk/trigger.md)) or automatically
deploy models according to their tags (see [ClearML Serving](../clearml_serving/clearml_serving_tutorial.md#automatic-model-deployment)).

**To add tags:**
1. Click the task **>** Hover over the tag area **>** **+ADD TAG** or <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Bars menu" className="icon size-md space-sm" /> (menu)
1. Do one of the following:
    * Add a new tag - Type the new tag name **>** **(Create New)**.
    * Add an existing tag - Click a tag.
    * Customize a tag's colors - Click **Tag Colors** **>** Click the tag icon **>** **Background** or **Foreground** **>** Pick a color **>** **OK** **>** **CLOSE**.

**To remove a tag** - Hover over the tag and click **X**.




## Locating the Task ID

The task ID appears in the task page's header. 
