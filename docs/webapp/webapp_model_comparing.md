---
title: Comparing Models
---

The ClearML Web UI provides features for comparing models, allowing to locate, visualize, and analyze model differences. 
You can view the differences in model details, configuration, scalar values, and more.

## Selecting Models to Compare
To select models to compare:
1. Go to a model table that includes the models to be compared.
1. Select the models to compare. Once multiple models are selected, the batch action bar appears.
1. In the batch action bar, click **COMPARE**. 

The comparison page opens in the **DETAILS** tab, with the models compared [side by side](#side-by-side-textual-comparison).

### Modifying Model Selection
Click the `MODELS` button to view your currently compared models. Click `X` on a listed model to remove
it from the comparison.

![Models list](../img/webapp_compare_model_select_1.png#light-mode-only)
![Models list](../img/webapp_compare_model_select_1_dark.png#dark-mode-only)

You can add/remove models to your comparison:
1. Click the `+` button in any of the comparison tabs. This opens up a window with a model table with the currently 
compared models at the top.

   ![Adding models](../img/webapp_compare_model_select_2.png#light-mode-only)
   ![Adding models](../img/webapp_compare_model_select_2_dark.png#dark-mode-only)

1. Find the models to add by sorting and [filtering](webapp_model_table.md#filtering-columns) the models with the 
appropriate column header controls. Alternatively, use the search bar to find models by name.
1. Select models to include in the comparison (and/or clear the selection of any models you wish to remove).
1. Click **APPLY**.

## Sharing Comparison Page
To share a comparison page, copy the full URL from the address bar and send it to a teammate to collaborate. They will 
get the exact same page (including selected tabs etc.).

## Embedding Comparison Visualization
To embed plots and debug samples from the comparison pages in your [Reports](webapp_reports.md), hover over the
resource and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" />, 
which will copy to clipboard the embed code to put in your Reports. These visualizations are updated live as the 
models update. The Enterprise Plan and Hosted Service support embedding resources in external tools (e.g. Notion).

## Comparison Modes
The comparison tabs provides the following views:
* [Side-by-side textual comparison](#side-by-side-textual-comparison)
* [Tabular scalar comparison](#tabular-scalar-comparison)
* [Plot comparison](#plot-comparison) 


### Side-by-side Textual Comparison

In the **Details** and **Network** tabs, you can view differences in the models' nominal 
values. **Details** displays the models' general information, labels, metadata, and lineage. **Network** displays the models' 
configuration. Each model's 
information is displayed in a column, so each field is lined up side-by-side. 

The model on the left is used as the base model, to which the other models are compared. You can set a new base model 
in one of the following ways:
* Hover and click <img src="/docs/latest/icons/ico-arrow-from-right.svg" alt="Switch base model" className="icon size-md space-sm" /> 
on the model that will be the new base.
* Hover and click <img src="/docs/latest/icons/ico-drag.svg" alt="Pan icon" className="icon size-md space-sm" /> on the new base model and drag it all the way to the left

The differences between the models are highlighted. You can obscure identical fields by switching on the
**Hide Identical Fields** toggle.

![Text comparison](../img/webapp_compare_models_text.png#light-mode-only)
![Text comparison](../img/webapp_compare_models_text_dark.png#dark-mode-only)

### Tabular Scalar Comparison 
The **Scalars** tab (**Values** view) lays out the models' reported metric values in a table: a row per metric/variant and a 
column for each model. Select from the dropdown menu which metric values to display:
* Last Values: The last reported values for each model
* Min Values: The minimal value reported 
* Max Values: The maximal value reported 

You can download the scalar comparison table as a CSV file by clicking <img src="/docs/latest/icons/ico-download.svg" alt="Download" className="icon size-md space-sm" />. 

Switch on the **Show row extremes** toggle to highlight each variant's maximum and minimum values.  

![side-by-side scalar comparison](../img/webapp_compare_models_scalar_table.png#light-mode-only)
![side-by-side scalar comparison](../img/webapp_compare_models_scalar_table_dark.png#dark-mode-only)


### Plot Comparison
The **Scalars** (Graph view) and **Plots** tabs display plots attached to the models. 

The **Scalars** tab compares scalar values as time series line charts. The **Plots** tab compares the last reported 
iteration sample of each metric/variant combination per compared model.

Line, scatter, box, and bar graphs are compared by overlaying each metric/variant from all compared models' into a single 
comparative plot.

For overlaid plots, use **Group by** to select how to group plots:
* **Metric** - All variants for a metric appear on the same plot.

   ![Scalar plot grouped by metric](../img/webapp_compare_models_merge_plots.png#light-mode-only)
   ![Scalar plot grouped by metric](../img/webapp_compare_models_merge_plots_dark.png#dark-mode-only)

* **Metric+Variant** (default) - Every variant appears on its own plot.

   ![Scalar plot grouped by metric and variant](../img/webapp_compare_models_variant_plots.png#light-mode-only)
   ![Scalar plot grouped by metric and variant](../img/webapp_compare_models_variant_plots_dark.png#dark-mode-only)

Other plot types are displayed separately for each model.

![Side-by-side plots](../img/webapp_compare_models_side_plots.png#light-mode-only)
![Side-by-side plots](../img/webapp_compare_models_side_plots_dark.png#dark-mode-only)

All single value scalars are plotted into a single clustered bar chart under the "Summary" title, where each cluster 
represents a reported metric, and each bar in the cluster represents a model.

![Single scalar comparison](../img/webapp_compare_model_single_scalars.png#light-mode-only)
![Single scalar comparison](../img/webapp_compare_model_single_scalars_dark.png#dark-mode-only)

For better plot analysis, see [Plot Controls](webapp_exp_track_visual.md#plot-controls).
