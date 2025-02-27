---
title: Tracking Tasks
---

Every ClearML [task](../fundamentals/task.md) you create can be found in the **All Tasks** table and in its project's 
task table.

The task table is a powerful tool for creating dashboards and views of your own projects, your team's projects, or the 
entire development.

![Task table](../img/webapp_experiment_table.png#light-mode-only)
![Task table](../img/webapp_experiment_table_dark.png#dark-mode-only)

Customize the [task table](../webapp/webapp_exp_table.md) to fit your own needs by adding views of parameters, metrics, and tags.
Filter and sort based on various criteria, such as parameters and metrics, making it simple to create custom 
views. This allows you to:

* Create a dashboard for a project, presenting the latest model accuracy scores, for immediate insights.
* Create a live leaderboard displaying the best-performing tasks, updated in real time 
* Monitor a projects' progress and share it across the organization.

## Creating Leaderboards

To create a leaderboard: 

1. Select a project in the ClearML WebApp and go to its task table
1. Customize the column selection. Click "Settings" <img src="/docs/latest/icons/ico-settings.svg" alt="Setting Gear" className="icon size-md" /> 
   to view and select columns to display.
1. Filter tasks by name using the search bar to find tasks containing any search term
1. Filter by other categories by clicking "Filter" <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" />
   on the relevant column. There are a few types of filters:
   * Value set - Choose which values to include from a list of all values in the column
   * Numerical ranges - Insert minimum and/or maximum value
   * Date ranges - Insert starting and/or ending date and time
   * Tags - Choose which tags to filter by from a list of all tags used in the column. 
     * Filter by multiple tag values using the **ANY** or **ALL** options, which correspond to the logical "AND" and "OR" respectively. These 
       options appear on the top of the tag list.
     * Filter by the absence of a tag (logical "NOT") by clicking its checkbox twice. An `X` will appear in the tag's checkbox.
1. Enable auto-refresh for real-time monitoring

For more detailed instructions, see the [Tracking Leaderboards Tutorial](../guides/ui/building_leader_board.md). 

## Sharing Leaderboards

Bookmark the URL of your customized leaderboard to save and share your view. The URL contains all parameters and values
for your specific leaderboard view.