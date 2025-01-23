---
title: Datasets Page
---

:::tip SDK version compatibility
The datasets page shows datasets created with `clearml` v1.6 or newer.  
Datasets created with earlier versions of `clearml` are available in their original project.  
:::

Use the **Datasets** Page to navigate between and manage datasets. The page shows summaries 
for all datasets created using [ClearML Data](../../clearml_data/clearml_data.md).

You can view the datasets page in Project view <img src="/docs/latest/icons/ico-project-view.svg" alt="Project view" className="icon size-md" /> 
or in List view <img src="/docs/latest/icons/ico-flat-view.svg" alt="List view" className="icon size-md" />. In List 
view, all datasets are shown side-by-side. In Project view, datasets are organized according to their projects, and 
top-level projects are displayed. Click on a project card to view the project's datasets.

Click on a dataset card to navigate to its [Version List](webapp_dataset_viewing.md), where you can view the 
dataset versions' lineage and contents. 

Filter the datasets to find the one you're looking for more easily. These filters can be applied by clicking <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" />:
* My Work - Show only datasets that you created
* Tags - Choose which tags to filter by from a list of tags used in the datasets.
  * Filter by multiple tag values using the **ANY** or **ALL** options, which correspond to the logical "AND" and "OR" 
  respectively. These options appear on the top of the tag list.
  * Filter by the absence of a tag (logical "NOT") by clicking its checkbox twice. An X will appear in the tag's checkbox.

![Dataset page](../../img/webapp_dataset_page.png#light-mode-only)
![Dataset page](../../img/webapp_dataset_page_dark.png#dark-mode-only)

## Project Cards

In Project view, project cards display a project's summarized dataset information:

<div class="max-w-50">

![Project card](../../img/webapp_dataset_project_card.png#light-mode-only)
![Project card](../../img/webapp_dataset_project_card_dark.png#dark-mode-only)

</div>

* Project name
* Number of datasets in project
* Tags used by datasets in project

Click on a project card to view its datasets.



## Dataset Cards

In List view, the dataset cards display summarized dataset information:

<div class="max-w-50">

![Dataset card](../../img/webapp_dataset_card.png#light-mode-only)
![Dataset card](../../img/webapp_dataset_card_dark.png#dark-mode-only)

</div>

* Dataset name
* Time since last update
* Number of versions
* Details about latest version
  * Number of files
  * Size
* Tags 

### Dataset Actions

Click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> on the top right
of a dataset card to open its context menu and access dataset actions.  

<div class="max-w-50">

![Dataset context menu](../../img/webapp_dataset_card_context_menu.png#light-mode-only)
![Dataset context menu](../../img/webapp_dataset_card_context_menu_dark.png#dark-mode-only)

</div>

* **Rename** - Change the dataset's name
* **Add Tag** - Add label to the dataset to help easily classify groups of dataset.
* **Delete** - Delete the dataset and all of its versions. To delete a dataset, all its versions must first be 
  archived. 