---
title: Monitoring Project Progress
---

ClearML provides a comprehensive set of monitoring tools to help effectively track and manage machine learning projects. 
These tools offer both high-level overviews and detailed insights into task execution, resource 
utilization, and project performance.


## Project Overview

A project's **OVERVIEW** tab in the UI presents a general picture of a project: 
* Metric Snapshot – A graphical representation of selected metric values across project tasks, offering a quick assessment of progress.
* Task Status Tracking – When a single metric variant is selected for the snapshot, task status is color-coded (e.g., 
Completed, Aborted, Published, Failed) for better visibility.

Use the Metric Snapshot to track project progress and identify trends in task performance.

For more information, see [Project Overview](../webapp/webapp_project_overview.md).

![Project Overview](../img/webapp_project_overview.png#light-mode-only)
![Project Overview](../img/webapp_project_overview_dark.png#dark-mode-only)

## Project Dashboard 

:::note Pro Plan Offering
The Project Dashboard app is available under the ClearML Pro plan.
:::

The [**Project Dashboard**](../webapp/applications/apps_dashboard.md) UI application provides a centralized 
view of project progress, task statuses, resource usage, and key performance metrics. It offers:
* Comprehensive insights:
  * Track task statuses and trends over time. 
  * Monitor GPU utilization and worker activity. 
  * Analyze performance metrics. 
* Proactive alerts - By integrating with Slack, the Dashboard can notify teams of task failures 
  and completions.

For more information, see [Project Dashboard](../webapp/applications/apps_dashboard.md).

![Project Dashboard](../img/apps_dashboard.png#light-mode-only)
![Project Dashboard](../img/apps_dashboard_dark.png#dark-mode-only)

## Task Monitoring

ClearML provides task monitoring capabilities through the [`clearml.automation.Monitor`](https://github.com/clearml/clearml/blob/master/clearml/automation/monitor.py) 
class. With this class you can implement monitoring workflows such as:

* Send notifications via Slack or other channels
* Trigger automated responses based on specific task conditions

For a practical example, see the [Slack Alerts Example](../guides/services/slack_alerts.md), which demonstrates how to:

* Track task status (completion, failure, etc.)
* Send notifications to a specified Slack channel
* Retrieve task details such as status, console logs, and links to the ClearML Web UI

You can also configure filters for task types and projects to reduce unnecessary notifications.

![Slack Alerts](../img/examples_slack_alerts.png#light-mode-only)
![Slack Alerts](../img/examples_slack_alerts_dark.png#dark-mode-only)

