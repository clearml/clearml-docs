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

Filter page contents by specific fields <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" />
or through free form search <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-sm" />:
* My Work - Show only pipelines that you created
* Tags - Choose which tags to filter by from a list of tags used in the pipelines.
  * Filter by multiple tag values using the **ANY** or **ALL** options, which correspond to the logical "AND" and "OR" 
  respectively. These options appear on the top of the tag list.
  * Filter by the absence of a tag (logical "NOT") by clicking its checkbox twice. An X will appear in the tag's checkbox.
* User - Filter pipelines by the user who created them.

Free form search queries pipeline name and ID. To search using regex, click the `.*` 
icon on the search bar.

![Pipelines page](../../img/webapp_pipeline_page.png#light-mode-only)
![Pipelines page](../../img/webapp_pipeline_page_dark.png#dark-mode-only)

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
* **Clone** -  Create a new pipeline based on the pipeline's last run. Add the following details:  
  * New Pipeline Details
    * Pipeline name - Name for the new pipeline (required).
    * Initial version - The version number of the first run in the new pipeline 
    * Project - ClearML project where the new pipeline will be stored. By default, this is the same project as the original pipeline.
  * Parameters - If the pipeline includes custom parameters, specify their values. The cloned run’s values are pre-filled.
  * Configuration 
    * Pipeline controller queue - Queue to which the new pipeline run will be enqueued (make sure an agent is assigned to that queue).
