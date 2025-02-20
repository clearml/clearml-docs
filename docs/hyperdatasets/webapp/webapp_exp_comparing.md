--- 
title: Comparing Dataviews
---

:::important ENTERPRISE FEATURE
Dataviews are available under the ClearML Enterprise plan.
:::

In addition to [ClearML's comparison features](../../webapp/webapp_exp_comparing.md), the ClearML Enterprise WebApp 
supports comparing input data selection criteria of task [Dataviews](../dataviews.md), enabling to easily locate, visualize, and analyze differences.

## Selecting Tasks 

To select tasks to compare:
1. Go to a task table that includes the tasks to be compared.
1. Select the tasks to compare. Once multiple tasks are selected, the batch action bar appears.
1. In the batch action bar, click **COMPARE**. 

The comparison page opens in the **DETAILS** tab, showing a column for each task. 

## Dataviews

In the **Details** tab, you can view differences in the tasks' nominal values. Each task's information is 
displayed in a column, so each field is lined up side-by-side. Expand the **DATAVIEWS** 
section to view all the Dataview fields side-by-side (filters, iterations, label enumeration, etc.). The differences between the 
tasks are highlighted. Obscure identical fields by switching on the `Hide Identical Fields` toggle. 

The task on the left is used as the base task, to which the other tasks are compared. You can set a 
new base task 
in one of the following ways:
* Hover and click <img src="/docs/latest/icons/ico-arrow-from-right.svg" alt="Switch base task" className="icon size-md space-sm" /> 
on the task that will be the new base.
* Hover and click <img src="/docs/latest/icons/ico-drag.svg" alt="Pan icon" className="icon size-md space-sm" /> on the new base task and drag it all the way to the left


![Dataview comparison](../../img/hyperdatasets/compare_dataviews.png#light-mode-only)
![Dataview comparison](../../img/hyperdatasets/compare_dataviews_dark.png#dark-mode-only)