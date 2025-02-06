---
title: The Task Table
---

The task table is a [customizable](#customizing-the-task-table) list of tasks associated with a project. From the tasks
table, view task details, and work with tasks (reset, clone, enqueue, create [tracking leaderboards](../guides/ui/building_leader_board.md)
to monitor experimentation, and more). The task table's auto-refresh lets users continually monitor task progress.

View the tasks in table view <img src="/docs/latest/icons/ico-table-view.svg" alt="Table view" className="icon size-md space-sm" />, 
details view <img src="/docs/latest/icons/ico-split-view.svg" alt="Details view" className="icon size-md space-sm" />, or
comparison view <img src="/docs/latest/icons/ico-charts-view.svg" alt="Comparison view" className="icon size-md space-sm" />
using the buttons on the top left of the page. Use the table view for a comparative view of your tasks according 
to columns of interest. Use the details view to access a selected task's details, while keeping the task list 
in view. Details view can also be accessed by double-clicking a specific task in the table view to open its details view.
Use the [comparison view](#comparing-tasks) to compare your tasks' scalar and plot results (for a more in 
depth comparison, see [Comparing Tasks](webapp_exp_comparing.md)). This view compares
the scalars/plots of currently selected tasks. If no tasks are selected, the first 100
visible tasks in the table are compared.

You can archive tasks so the table doesn't get too cluttered. Click **OPEN ARCHIVE** on the top of the
table to open the archive and view all archived tasks. From the archive, you can restore 
tasks to remove them from the archive. You can also permanently delete tasks.

You can download the task table as a CSV file by clicking <img src="/docs/latest/icons/ico-download.svg" alt="Download" className="icon size-md space-sm" /> 
and choosing one of these options:
* **Download onscreen items** - Download the values for tasks currently visible on screen  
* **Download all items** - Download the values for all tasks in this project that match the current active filters  

The downloaded data consists of the currently displayed table columns.

![Task table](../img/webapp_experiment_table.png#light-mode-only)
![Task table](../img/webapp_experiment_table_dark.png#dark-mode-only)

## Creating Tasks

You can create tasks by:
* Running code instrumented with ClearML (see [Task Creation](../clearml_sdk/task_sdk.md#task-creation))
* [Cloning an existing task](webapp_exp_reproducing.md)
* Via CLI using [`clearml-task`](../apps/clearml_task.md)
* Through the UI interface: Input the task's details, including its source code and python requirements, and then 
run it through a [ClearML Queue](../fundamentals/agents_and_queues.md#what-is-a-queue) or save it as a *draft*.

To create a task through the UI interface:
1. Click `+ New Task` 
1. In the `Create Task` modal, input the following information:
   * **Code** - What this task is going to run
     * Task name
     * Git - Optional fields for checking out the code from a git repository: 
       * Repository URL
       * Version specification - one of the following:
         * Tag 
         * Branch 
         * Commit ID
     * Entry Point - The code to run
       * Working Directory
       * Script type - Python/Shell 
       * Binary - The binary executing the script (e.g. python3, bash etc).
       * Type – How the code is provided
         * Script - The name of the file to run using the above specified binary
         * Module - The name of a python module to run (Python only, see [Python module specification](https://docs.python.org/3/using/cmdline.html#cmdoption-m))
         * Custom code - Directly provide the code to run. Write code, or upload a file:
           * File name - The script in which your code is stored. Click `Upload` to upload an existing file.
           * Content - The actual code. Click `Edit` to modify the script’s contents.
       * Add `Task.init` call (Python only) - If selected, a [`Task.init()`](../references/sdk/task.md#taskinit) call is automatically added to 
       your script (Use if if you script does not yet make use of ClearML)
   * **Arguments** (*optional*) - Add [hyperparameter](../fundamentals/hyperparameters.md) values.
   * **Environment** (*optional*) - Set up the task’s execution environment
     * Python - Python environment settings
       * Use Poetry - Force Poetry instead of pip package manager. Disables additional python settings.
       * Preinstalled venv - The name of a virtual environment available in the task’s execution environment to use when 
       running the task. Additionally, specify how to use the virtual environment:
         * Skip - Try to automatically detect an available virtual environment, and use it as is.
         * Use `requirements.txt` file - Install packages from a `requirements.txt` file into the specified virtual environment.
         * Specify Packages - Install the specified packages into the specified virtual environment
     * Environment Variables - Set these environment variables when running the task
   * **Container** (*optional*) - Specify container configuration for executing the task
     * Image - Image to use for running the task
     * Arguments - Add container arguments as a single string
     * Startup Script - Add a bash script to be executed inside the container before setting up the task's environment 
       
       :::important 
       For a task to run in the specified container, the ClearML Agent executing the task must be running in 
       Docker mode:

       ```bash
       clearml-agent daemon --queue <execution_queue_to_pull_from> --docker
       ```
       For more information, see [Docker Mode](../clearml_agent/clearml_agent_execution_env.md#docker-mode).
       :::
     
   * **Run**
     * Queue - [ClearML Queue](../fundamentals/agents_and_queues.md#what-is-a-queue) where the task should be 
     enqueued for execution
     * Output Destination - A URI where task outputs should be stored (ClearML file server by default). 
1. Once you have input all the information, click one of the following options
   * Save as Draft - Save the task as a new draft. 
   * Run - Enqueue the task for execution in the queue specified in the **Run** tab

Once you have completed the task creation wizard, the task will be saved in your current project (where 
you clicked `+ New Task`). See what you can do with your task in [Task Actions](#task-actions).

## Task Table Columns

The task table default and customizable columns are described in the following table.

| Column | Description | Type |
|---|---|---|
| **TYPE** | Type of task. ClearML supports multiple [task types](../fundamentals/task.md#task-types) for experimentation, and a variety of workflows and use cases. | Default |
| **NAME** | Task name.  |  Default |
| **TAGS** | Descriptive, user-defined, color-coded tags assigned to tasks. Use tags to classify tasks, and filter the list. See [tagging tasks](webapp_exp_track_visual.md#tagging-tasks). | Default |
| **STATUS** | Task state (status). See a list of the [task states and state transitions](../fundamentals/task.md#task-states). If you programmatically set task progress values, you will also see a progress indicator for Running, Failed, and Aborted tasks. See [here](../clearml_sdk/task_sdk.md#tracking-task-progress). |  Default |
| **PROJECT** | Name of task's project.  |  Default |
| **USER** | User who created or cloned the task.  |  Default (hidden) |
| **STARTED** | Elapsed time since the task started. To view the date and time of start, hover over the elapsed time.  |  Default |
| **UPDATED** | Elapsed time since the last update to the task. To view the date and time of update, hover over the elapsed time. |  Default |
| **ITERATION** | Last or most recent iteration of the task. |  Default |
| **DESCRIPTION** | A description of the task. For cloned tasks, the description indicates it was auto generated with a timestamp. |  Default (hidden) |
| **RUN TIME** | The current / total running time of the task. | Default (hidden) |
| **_Metrics_** | Add metrics column (last, minimum, and/or maximum values). The metrics depend upon the tasks in the table. See [adding metrics](#to-add-metrics). | Customizable |
| **_Hyperparameters_** | Add hyperparameters. The hyperparameters depend upon the tasks in the table. See [adding hyperparameters](#to-add-hyperparameters). | Customizable |



## Customizing the Task Table

Customize the table using any of the following:
* Dynamic column order - Drag a column title to a different position.
* Resize columns - Drag the column separator to change the width of that column. Double-click the column separator for 
  automatic fit.
* Changing table columns
    * Show / hide columns - Click <img src="/docs/latest/icons/ico-settings.svg" alt="Setting Gear" className="icon size-md" />
  **>** mark or clear the checkboxes of columns to show or hide.
    * Add custom columns - Click **+ METRICS** or **+ HYPERPARAMETERS** to add metric / hyperparameter columns to the 
      main column list. Added columns are by default displayed in the table. You can remove the custom columns from the 
      main column list or the column addition windows. 
* [Filter columns](#filtering-columns)
* Sort columns - According to metrics and hyperparameters, type of task, task name, start and last update elapsed time, and last iteration.

Use task table customization for various use cases, including:

* Creating a [leaderboard](#creating-a-task-leaderboard) that will update in real time with task
  performance, which can be shared and stored.
* Sorting models by metrics - Models are associated with the tasks that created them. For each metric, use the last
  value, the minimal value, and/or the maximal value.
* Tracking hyperparameters - Track hyperparameters by adding them as columns, and applying filters and sorting.

Changes are persistent (cached in the browser), and represented in the URL so customized settings can be saved in a browser
bookmark and shared with other ClearML users to collaborate.

:::note
The following task-table customizations are saved on a **per-project** basis: 
* Columns order
* Column width
* Active sort order
* Active filters
* Custom columns

If a project has subprojects, the tasks can be viewed by their subproject groupings or together with 
all the tasks in the project. The customizations of these two views are saved separately. 
:::



### Adding Metrics and/or Hyperparameters

![Task table customization gif](../img/gif/webapp_exp_table_cust.gif#light-mode-only)
![Task table customization gif](../img/gif/webapp_exp_table_cust_dark.gif#dark-mode-only)

Add metrics and/or hyperparameters columns to the task table. The metrics and hyperparameters depend upon the
tasks in the table.

#### To Add Metrics:

* Click <img src="/docs/latest/icons/ico-settings.svg" alt="Setting Gear" className="icon size-md" /> **>** **+ METRICS** **>** Expand a metric **>** Select the **LAST** (value),
  **MIN** (minimal value), and/or **MAX** (maximal value) checkboxes.

#### To Add Hyperparameters:

* Click <img src="/docs/latest/icons/ico-settings.svg" alt="Setting Gear" className="icon size-md" /> **>** **+ HYPERPARAMETERS** **>** Expand a section **>** Select the
  hyperparameter checkboxes.
  
:::note Float Values Display
By default, the task table displays rounded up float values. Hover over a float to view its precise value in the 
tooltip that appears. To view all precise values in a column, hover over a float and click <img src="/docs/latest/icons/ico-line-expand.svg" alt="Expand" className="icon size-md" />.  
:::

### Filtering Columns

![Filtering table gif](../img/gif/filter_screenshots.gif#light-mode-only)
![Filtering table gif](../img/gif/filter_screenshots_dark.gif#dark-mode-only)

Filters can be applied by clicking <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" /> 
on a column, and the relevant filter appears.

There are a few types of filters:
* Value set - Choose which values to include from a list of all values in the column
* Numerical ranges - Insert minimum and/or maximum value
* Date ranges - Insert starting and/or ending date and time
* Tags - Choose which tags to filter by from a list of all tags used in the column. 
  * Filter by multiple tag values using the **ANY** or **ALL** options, which correspond to the logical "AND" and "OR" respectively. These 
    options appear on the top of the tag list.
  * Filter by the absence of a tag (logical "NOT") by clicking its checkbox twice. An `X` will appear in the tag's checkbox.
  
Once a filter is applied to a column, its filter icon will appear with a highlighted dot on its top right (<img src="/docs/latest/icons/ico-filter-on.svg" alt="Filter on" className="icon size-md" />).  

To clear all active filters, click <img src="/docs/latest/icons/ico-filter-reset.svg" alt="Clear filters" className="icon size-md" /> 
in the top right corner of the table.



## Task Actions

The following table describes the actions that can be done from the task table, including the [states](../fundamentals/task.md#task-states)
that allow each operation.  

Access these actions in any of the following ways:
* In the task table, right-click a task or hover over a task and click <img src="/docs/latest/icons/ico-dots-v-menu.svg" alt="Dot menu" className="icon size-md space-sm" />
to open the context menu
* In a task info panel, click the menu button <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Bar menu" className="icon size-md space-sm" />
* Through the batch action bar: available at screen bottom when multiple tasks are selected

| Action | Description | States Valid for the Action | State Transition                                |
|---|---|---|-------------------------------------------------|
| Details | Open the task's [info panel](webapp_exp_track_visual.md#info-panel) (keeps the tasks list in view). Can also be accessed by double-clicking a task in the task table. | Any state | None                                            |
| View Full Screen | View task details in [full screen](webapp_exp_track_visual.md#full-screen-details-view). | Any state | None                                            |
| Manage Queue | If a task is *Pending* in a queue, view the utilization of that queue, manage that queue (remove tasks and change the order of tasks), and view information about the worker(s) listening to the queue. See the [Orchestration](webapp_workers_queues.md) page. | *Enqueued* | None                                            |
| View Worker | If a task is *Running*, view resource utilization, worker details, and queues to which a worker is listening. | *Running* | None                                            |
| Share | For **ClearML Hosted Service** users only, [share](webapp_exp_sharing.md) a task and its model with a **ClearML Hosted Service** user in another workspace. |  Any state | None                                            |
| Archive | Move task to the project's archive. If it is shared (ClearML Hosted Service only), the task becomes private. | Any state | *Pending* to *Draft*                            |
| Restore |Action available in the archive. Restore a task to the active task table.| Any State | None                                            |
| Delete |  Action available in the archive. Delete a task, which will also remove all their logs, results, artifacts and debug samples. | Any State | N/A                                             |
| Enqueue | Add a task to a queue for a worker or workers (listening to the queue) to execute. | *Draft*, *Aborted* | *Pending*                                       |
| Dequeue | Remove a task from a queue. | *Pending* | *Draft*                                         |
| Reset  | Delete the log and output from a previous run of a task (for example, before rerunning it). | *Completed*, *Aborted*, or *Failed* | *Draft*                                         |
| Abort | Manually terminate a *Running* task. | *Running* | *Aborted*                                       |
| Abort All Children | Manually terminate all *Running* tasks which have this task as a parent | *Running* or *Aborted* | None for parent task, *Aborted* for child tasks |
| Retry | Enqueue a failed task in order to rerun it. Make sure you have resolved the external problem which previously prevented the task’s completion. | *Failed* | *Pending*                                       |
| Publish | Publish a task to prevent changes to its tracking data, inputs, and outputs. Published tasks and their models are read-only. *Published* tasks cannot be enqueued, but they can be cloned, and their clones can be edited, tuned, and enqueued. | *Completed*, *Aborted*, or *Failed*.  | *Published*                                     |
| Add Tag | Tag tasks with color-coded labels to assist you in organizing your work. See [tagging tasks](webapp_exp_track_visual.md#tagging-tasks). | Any state | None                                            |
| Clone | Make an exact, editable copy of a task (for example, to reproduce a task, but keep the original). | *Draft* | Newly cloned task is *Draft*              |
| Move to Project | Move a task to another project. | Any state | None                                            |
| Compare | Compare selected tasks (see [Comparing Tasks](webapp_exp_comparing.md)) | Any state | None                                            |

:::important Enterprise Feature
The ClearML Enterprise Server provides a mechanism to define your own custom actions, which will 
appear in the context menu. Create a custom action by defining an HTTP request to issue when clicking on the context menu
action. For more information see [Custom UI Context Menu Actions](../deploying_clearml/clearml_server_config.md#custom-ui-context-menu-actions).
:::

Most of the actions mentioned in the chart above can be performed on multiple tasks at once.
[Select multiple tasks](#selecting-multiple-tasks), then use either the context menu, or the batch action bar 
that appears at the bottom of the page, to perform
operations on the selected tasks. Actions can be performed only on the tasks that match the action criteria 
(for example, only *Running* tasks can be aborted). The context menu shows the number 
of tasks that can be affected by each action. The same information can be found in the batch action bar, in a tooltip that
appears when hovering over an action icon. 

![Task table batch operations](../img/webapp_experiment_table_context_menu.png#light-mode-only)
![Task table batch operations](../img/webapp_experiment_table_context_menu_dark.png#dark-mode-only)

## Selecting Multiple Tasks

Select multiple tasks by clicking the checkbox on the left of each relevant task. Clear any existing selection 
by clicking the checkbox in the top left corner of the table.

Click the checkbox in the top left corner of the table to select all items currently visible.

An extended bulk selection tool is available through the down arrow next to the checkbox in the top left corner, enabling 
selecting items beyond the items currently on-screen:
* **All** - Select all tasks in the project
* **None** - Clear selection
* **Filtered** - Select **all tasks in the project** that match the current active filters in the project

## Comparing Tasks 

The comparison view compares task scalar and plot results (for a more in depth comparison, see [Comparing Tasks](webapp_exp_comparing.md)). 
When selected, the view presents a comparison of all [selected tasks](#selecting-multiple-tasks). If no 
tasks are selected, the first 100 visible tasks in the table are displayed in the comparison. 

In the dropdown menu, select to view **Scalars** or **Plots**. 

**Scalars** shows task scalar results as time series line graphs. 

![Merged comparison plots](../img/webapp_compare_view_1.png#light-mode-only)
![Merged comparison plots](../img/webapp_compare_view_1_dark.png#dark-mode-only)

All single value scalars are plotted into a single clustered bar chart under the "Summary" title, where each cluster 
represents a reported metric, and each bar in the cluster represents a task.

![Single scalar comparison](../img/webapp_compare_view_3.png#light-mode-only)
![Single scalar comparison](../img/webapp_compare_view_3_dark.png#dark-mode-only)

Click <img src="/docs/latest/icons/ico-settings.svg" alt="Setting Gear" className="icon size-md" /> to customize which 
metrics to view.

Click <img src="/docs/latest/icons/ico-tune.svg" alt="Tune" className="icon size-md" /> to access 
[scalar plot tools](webapp_exp_track_visual.md#scalar-plot-tools).

**Plots** shows the last reported iteration sample of each metric/variant combination per compared 
task. 

Line, scatter, box, and bar graphs are compared by overlaying each metric/variant from all compared tasks' into a 
single comparative plot. 

![Merged comparison plots](../img/webapp_compare_view_4.png#light-mode-only)
![Merged comparison plots](../img/webapp_compare_view_4_dark.png#dark-mode-only)

Other plot types are displayed separately for each task.

![Separate comparison plots](../img/webapp_compare_view_2.png#light-mode-only)
![Separate comparison plots](../img/webapp_compare_view_2_dark.png#dark-mode-only)

## Creating a Task Leaderboard

Filter and sort the tasks of any project to create a leaderboard that can be shared and stored. This leaderboard
updates in real time with task performance and outputs.

Modify the task table in the following ways to create a customized leaderboard:
* Add task configuration ([hyperparameters](#to-add-hyperparameters))
* Edit and add task [properties](webapp_exp_track_visual.md#user-properties)
* Add reported [metrics](#to-add-metrics), any time series reported metric can be selected, then select the last reported
  value, or the minimum / maximum reported value.
* Filter based on user (dropdown and select) or [task types](../fundamentals/task.md#task-types)
* Add specific [tags](webapp_exp_track_visual.md#tagging-tasks) and filter based on them. 

Now the table can be sorted based on any of the columns (probably one of the performance metrics). Select to filter tasks
based on their name by using the search bar.

The final dashboard can be shared by copying the URL from the address bar, this address will replicate the exact same dashboard on any browser.
The dashboard can also be bookmarked for later use.

![Task table sharing](../img/webapp_exp_table_sharing.png#light-mode-only)
![Task table sharing](../img/webapp_exp_table_sharing_dark.png#dark-mode-only)