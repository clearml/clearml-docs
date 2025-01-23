---
title: Pipelines Page
---

Use the **Pipelines** Page to navigate between and manage pipelines. The page shows execution summaries for all 
[ClearML Pipelines](../../pipelines/pipelines.md).

You can view the Pipelines page in Project view <img src="/docs/latest/icons/ico-project-view.svg" alt="Project view" className="icon size-md" /> 
or in List view <img src="/docs/latest/icons/ico-flat-view.svg" alt="List view" className="icon size-md" />. In List 
view, all pipelines are shown side-by-side. In Project view, pipelines are organized according to their projects, and 
top-level projects are displayed. Click on a project card to view the project's pipelines.

Click on a pipeline card to navigate to its [Pipeline Runs Table](webapp_pipeline_table.md), where you can view the 
pipeline structure, configuration, and outputs of all the pipeline's runs, as well as create new runs.

Filter the pipelines to find the one you're looking for more easily. These filters can be applied by clicking <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" />:
* My Work - Show only pipelines that you created
* Tags - Choose which tags to filter by from a list of tags used in the pipelines.
  * Filter by multiple tag values using the **ANY** or **ALL** options, which correspond to the logical "AND" and "OR" 
  respectively. These options appear on the top of the tag list.
  * Filter by the absence of a tag (logical "NOT") by clicking its checkbox twice. An X will appear in the tag's checkbox.


![Pipelines page](../../img/webapp_pipeline_table.png#light-mode-only)
![Pipelines page](../../img/webapp_pipeline_table_dark.png#dark-mode-only)

## Project Cards
In Project view, project cards display a project's summarized pipeline information:

<div class="max-w-50">

![Pipeline project card](../../img/webapp_pipeline_project_card.png#light-mode-only)
![Pipeline project card](../../img/webapp_pipeline_project_card_dark.png#dark-mode-only)

</div>

Click on a project card to view its pipelines.


## Pipeline Cards

In List view, the pipeline cards display summarized pipeline information:  

<div class="max-w-50">

![Pipeline card](../../img/webapp_pipeline_card.png#light-mode-only)
![Pipeline card](../../img/webapp_pipeline_card_dark.png#dark-mode-only)

</div>

* Pipeline name
* Time since the pipeline's most recent run
* Run summary - Number of *Running*/*Pending*/*Completed*/*Failed* runs
* Tags 


### Pipeline Actions

Click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> on the top right
of a pipeline card to open its context menu and access pipeline actions.  

<div class="max-w-50">

![Project context menu](../../img/webapp_pipeline_context_menu.png#light-mode-only)
![Project context menu](../../img/webapp_pipeline_context_menu_dark.png#dark-mode-only)

</div>

* **Rename** - Change the pipeline's name
* **Add Tag** - Add label to the pipeline to help easily classify groups of pipelines.
* **Delete** - Delete the pipeline: delete all its runs and any models/artifacts produced (a list of remaining artifacts 
  is returned). To delete a pipeline, all its runs must first be archived. 