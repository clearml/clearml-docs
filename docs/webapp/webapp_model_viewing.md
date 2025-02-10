---
title: Model Details
---

In the model table, double-click on a model to view and/or modify the following: 
* General model information
* Model configuration
* Model label enumeration
* Model metadata 
* Model scalars and other plots


Models in *Draft* status are editable, so you can modify their configuration, label enumeration, and metadata. 
*Published* models are read-only, so only their metadata can be modified.

## General Model Information

The **GENERAL** tab lists the model's General information including: 
* Model URL
* ML Framework
* Creating task (ClearML task that generated the model)
* Description (click to edit)

If the model is stored in a network location, it can be downloaded by clicking the model URL. If the model was stored on 
the local machine you can copy its URL to manually access it.

![Model general information](../img/webapp_model_general.png#light-mode-only)
![Model general information](../img/webapp_model_general_dark.png#dark-mode-only)


## Model Configuration 

The **NETWORK** tab displays the model's configuration. 

![Model network](../img/webapp_model_network.png#light-mode-only)
![Model network](../img/webapp_model_network_dark.png#dark-mode-only)

Hover over the model configuration area to access the following actions:

![Model config actions](../img/webapp_model_config_actions.png#light-mode-only)
![Model config actions](../img/webapp_model_config_actions_dark.png#dark-mode-only)

* <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-sm" /> Search 
* <img src="/docs/latest/icons/ico-copy-to-clipboard.svg" alt="Copy" className="icon size-md space-sm" /> Copy configuration 
* <img src="/docs/latest/icons/ico-trash.svg" alt="Trash" className="icon size-md space-sm" />**CLEAR** (for *Draft* models) - Delete the configuration 
* **EDIT** (for *Draft* models) - Modify / Add model configuration

## Label Enumeration

The **LABELS** tab displays for each class label (`Label`) its name and enumerated value (`ID`).

![Model label enumeration](../img/webapp_model_labels.png#light-mode-only)
![Model label enumeration](../img/webapp_model_labels_dark.png#dark-mode-only)

To modify / add / delete class labels (for *Draft* models), hover over the label table and click **EDIT**. This opens the 
label editing window. 

![Model label editing](../img/webapp_model_labels_edit.png#light-mode-only)
![Model label editing](../img/webapp_model_labels_edit_dark.png#dark-mode-only)


## Metadata

The **METADATA** tab lists the model's metadata entries, which consist of a key, type, and value. 

![Model metadata](../img/webapp_model_metadata.png#light-mode-only)
![Model metadata](../img/webapp_model_metadata_dark.png#dark-mode-only)

To modify / add / delete model metadata items, hover over the metadata table and click **EDIT**. This opens the metadata editing 
window.

![Model metadata editing](../img/webapp_model_metadata_edit.png#light-mode-only)
![Model metadata editing](../img/webapp_model_metadata_edit_dark.png#dark-mode-only)

## Lineage

The **LINEAGE** tab displays the model's creating task (the ClearML task that generated the model) and lists 
all the tasks where the model is used as an input model. Click a task to navigate to its page.

You can filter the task list by tags and task status.

Use the search bar to look for tasks based on their name, ID, or description.


![Model lineage](../img/webapp_model_lineage.png#light-mode-only)
![Model lineage](../img/webapp_model_lineage_dark.png#dark-mode-only)

## Scalars

The **SCALARS** tab displays all scalar plots attached to a model. Scalar values are presented as time series line 
plots. To see the series for a metric in high resolution, view it in full screen mode by hovering over the graph and 
clicking <img src="/docs/latest/icons/ico-maximize.svg" alt="Maximize plot icon" className="icon size-md space-sm" />.
Reported single value scalars are aggregated into a table plot displaying scalar names and values. 

To embed scalar plots in your [Reports](webapp_reports.md), hover over a plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" />, 
which will copy to clipboard the embed code to put in your Reports. In contrast to static screenshots, embedded resources 
are retrieved when the report is displayed allowing your reports to show the latest up-to-date data.

For better plot analysis, see [Plot Controls](webapp_exp_track_visual.md#plot-controls).


![Model scalars](../img/webapp_model_scalars.png#light-mode-only)
![Model scalars](../img/webapp_model_scalars_dark.png#dark-mode-only)

## Plots 

The **PLOTS** tab displays plots attached to a model. 

To embed plots in your [Reports](webapp_reports.md), hover over a plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" />, 
which will copy to clipboard the embed code to put in your Reports. In contrast to static screenshots, embedded resources 
are retrieved when the report is displayed allowing your reports to show the latest up-to-date data.


For better plot analysis, see [Plot Controls](webapp_exp_track_visual.md#plot-controls).

![Model plots](../img/webapp_model_plots.png#light-mode-only)
![Model plots](../img/webapp_model_plots_dark.png#dark-mode-only)

