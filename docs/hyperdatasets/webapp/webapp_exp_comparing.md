--- 
title: Comparing Dataviews
---

In addition to [ClearML's comparison features](../../webapp/webapp_exp_comparing.md), the ClearML Enterprise WebApp 
supports comparing input data selection criteria of task [Dataviews](../dataviews.md), enabling to easily locate, visualize, and analyze differences.

## Selecting Experiments 

To select experiments to compare:
1. Go to a task table that includes the experiments to be compared.
1. Select the experiments to compare. Once multiple experiments are selected, the batch action bar appears.
1. In the batch action bar, click **COMPARE**. 

The comparison page opens in the **DETAILS** tab, showing a column for each task. 

## Dataviews

In the **Details** tab, you can view differences in the experiments' nominal values. Each task's information is 
displayed in a column, so each field is lined up side-by-side. Expand the **DATAVIEWS** 
section to view all the Dataview fields side-by-side (filters, iterations, label enumeration, etc.). The differences between the 
experiments are highlighted. Obscure identical fields by switching on the `Hide Identical Fields` toggle. 

The task on the left is used as the base task, to which the other experiments are compared. You can set a 
new base task 
in one of the following ways:
* Hover and click <img src="/docs/latest/icons/ico-switch-base.svg" alt="Switch base task" className="icon size-md space-sm" /> 
on the task that will be the new base.
* Hover and click <img src="/docs/latest/icons/ico-pan.svg" alt="Pan icon" className="icon size-md space-sm" /> on the new base task and drag it all the way to the left


![Dataview comparison](../../img/hyperdatasets/web-app/compare_dataviews.png)