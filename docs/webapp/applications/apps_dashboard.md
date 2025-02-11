---
title: Project Dashboard
---

:::info Pro Plan Offering
The ClearML Project Dashboard App is available under the ClearML Pro plan.
:::

The Project Dashboard Application provides an overview of a project's or workspace's progress. It presents an aggregated 
view of task status and a chosen metric over time, as well as project GPU and worker usage. It also supports alerts/warnings 
on completed/failed Tasks via Slack integration.

## Project Dashboard Instance Configuration
* **Import Configuration** - Import an app instance configuration file. This will fill the instance launch form with the 
  values from the file, which can be modified before launching the app instance
* **Dashboard Title** - Name of the project dashboard instance, which will appear in the instance list
* **Monitoring** - Select what the app instance should monitor. The options are:
    * Project - Monitor a specific project. You can select an option to also monitor the specified project's subprojects
    * Entire workspace - Monitor all projects in your workspace
            
  :::warning
  If your workspace or specified project contains a large number of tasks, the dashboard can take a while to update.
  :::

* **Monitored Metric** - Specify a metric for the app instance to monitor. The dashboard will present an aggregated view 
of the chosen metric over time.
  * Monitored Metric - Title - Metric title to track
  * Monitored Metric - Series - Metric series (variant) to track
  * Monitored Metric - Trend - Choose whether to track the monitored metric's highest or lowest values
* **Slack Notification** (optional) - Set up Slack integration for notifications of task failure. Select the 
`Alert on completed experiments` under `Additional options` to set up alerts for task completions.
  * API Token - Slack workspace access token 
  * Channel Name - Slack channel to which task failure alerts will be posted
  * Alert Iteration Threshold - Minimum number of task iterations to trigger Slack alerts (tasks that fail prior to the threshold will be ignored)
* **Additional options**
  * Track manual (non agent-run) experiments as well - Select to include in the dashboard tasks that were not executed by an agent
  * Alert on completed experiments - Select to include completed tasks in alerts: in the dashboard's Task Alerts section and in Slack Alerts.
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create 
  a new instance with the same configuration.
  
<div class="max-w-65">

![Dashboard app instance launch form](../../img/apps_dashboard_wizard.png#light-mode-only)
![Dashboard app instance launch form](../../img/apps_dashboard_wizard_dark.png#dark-mode-only)

</div>

## Dashboard

Once a project dashboard instance is launched, its dashboard displays the following information about a project:  
* Task Status Summary - Percentages of Tasks by status
* Task Type Summary - Percentages of local tasks vs. agent tasks
* Experiments Summary - Number of tasks by status over time
* Monitoring - GPU utilization and GPU memory usage
* Metric Monitoring - An aggregated view of the values of a metric over time
* Project's Active Workers - Number of workers currently executing tasks in the monitored project
* Workers Table - List of active workers
* Task Alerts
  * Failed tasks - Failed tasks and their time of failure summary
  * Completed tasks - Completed tasks and their time of completion summary 


:::tip EMBEDDING CLEARML VISUALIZATION
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md). These visualizations 
are updated live as the app instance(s) updates. The Enterprise Plan and Hosted Service support embedding resources in 
external tools (e.g. Notion). Hover over the plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
to copy the embed code, and navigate to a report to paste the embed code.
:::

![App dashboard](../../img/apps_dashboard.png#light-mode-only)
![App dashboard](../../img/apps_dashboard_dark.png#dark-mode-only)
