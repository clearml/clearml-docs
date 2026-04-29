---
title: Projects Page
---

Use the Projects Page for project navigation and management. 

Your projects are displayed like folders: click a folder to access its contents. The Projects Page shows the top-level 
projects in your workspace. Projects that contain nested subprojects are identified by an extra nested project tab. 
An exception is the **All Tasks** folder, which shows all projects' and subprojects' contents in a single, flat
list.

![Projects page](../img/webapp_project_page.png#light-mode-only)
![Projects page](../img/webapp_project_page_dark.png#dark-mode-only)

If a project has any subprojects, clicking its folder will open its own project page. Access the projects' top-level 
contents (i.e. tasks, models etc.) via the folder with the bracketed (`[ ]`) project name.

If a project does not contain any subprojects, clicking on its folder will open its task table (or [Project Overview](webapp_project_overview.md)
page when relevant).

Filter page contents by specific fields <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" />
or through free form search <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-sm" />:
* My Work - Show only projects that you created
* Tags - Choose which tags to filter by from a list of tags used in the projects.
  * Filter by multiple tag values using the **ANY** or **ALL** options, which correspond to the logical "AND" and "OR" 
  respectively. These options appear on the top of the tag list.
  * Filter by the absence of a tag (logical "NOT") by clicking its checkbox twice. An X will appear in the tag's checkbox.
* User - Filter projects by the user who created them.

Free form search queries project name and ID. To search using regex, click the `.*` 
icon on the search bar.

## Project Folders

Project folders display summarized project information:  

<div class="max-w-50">

![Project card](../img/webapp_project_card.png#light-mode-only)
![Project card](../img/webapp_project_card_dark.png#dark-mode-only)

</div>

* When the project contains subprojects, the folder shows the number of subprojects within the project as an additional 
  tab. Click the tab to view a list of subprojects, and click on a subproject's name to navigate to it.

  <div class="max-w-50">
  
  ![Subproject tab](../img/webapp_sub_project_card.png#light-mode-only)
  ![Subproject tab](../img/webapp_sub_project_card_dark.png#dark-mode-only)

  </div>
  
* When a project's `default_output_destination` is set, the folder displays the <img src="/docs/latest/icons/ico-info.svg" alt="Info" className="icon size-md space-sm" /> 
  indicator. Hover over the indicator to view the default output destination.

<Details class="panel configuration">
<summary class="panel-title">Hidden Projects</summary>

By default, ClearML infrastructure projects (i.e. dataset, pipeline, reports, application projects) are not shown in the 
projects page. You can enable viewing them in **Settings > Configuration > User Preferences**. When enabled, all infrastructure projects 
are labeled with <img src="/docs/latest/icons/ico-ghost.svg" alt="Hidden project" className="icon size-md space-sm" />

<br/>

![Hidden project configuration](../img/settings_hidden_projects.png#light-mode-only)
![Hidden project configuration](../img/settings_hidden_projects_dark.png#dark-mode-only)

</Details>

### Project Actions

Click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> on the top right
of a project folder to open its context menu and access the following project actions:  

<div class="max-w-50">

![Project context menu](../img/webapp_projects_context_menu.png#light-mode-only)
![Project context menu](../img/webapp_projects_context_menu_dark.png#dark-mode-only)

</div>

* **Project Settings** 
  * **General** - Set the project’s name, project path and default output destination
  * **Scalar View Defaults** - Configure the default scalar view configuration for tasks and models
    * **Scalar view setting** - Grouping, X-axis units and plot smoothing (see [Scalar Plot Tools](webapp_exp_track_visual.md#scalar-plot-tools))
    * **Default scalars** - Choose which metrics are visible by default when viewing task/model scalars.
  * **Storage Mounts (Enterprise Only)** - Specify storage configuration the ClearML Agent will apply when running tasks 
    in this project. To add a mountpoint:
    1. Click **Add Mountpoint**
    2. Input the following information:
       * Volume -  Select storage volume. Available volumes are predefined by administrators. 
       * Volume Configuration - Additional configuration can be specified based on the volume template specified by the 
         admin, such as the container mount point. 
         
         Click **Available System Variables** in the Project Settings window for built-in variables that can be used in volume configuration. 

         ![Mountpoint settings](../img/webapp_project_setting_mounts.png#light-mode-only)
         ![Mountpoint settings](../img/webapp_project_setting_mounts_dark.png#dark-mode-only)
       
* **New Project** - Create a new project (by default a subproject). 
* **Move to** - Move the project into another project. If the target project does not exist, it is created on-the-fly.
* **Delete** - Delete the project. To delete a project, all of its contents (i.e. any pipelines/reports/datasets) must
first be archived or removed. 

:::important[Enterprise Feature]
The ClearML Enterprise Server provides a mechanism to define your own custom actions, which will 
appear in the context menu. Create a custom action by defining an HTTP request to issue when clicking on the context menu
action. For more information see [Custom UI Context Menu Actions](../deploying_clearml/clearml_server_config.md#custom-ui-context-menu-actions).
:::

## Create Projects

To create a project, click the **+ NEW PROJECT** button in the top right of the page or in a project's context menu, 
which will open a **New Project** modal. 

<div class="max-w-75">

![New project modal](../img/webapp_projects_new_project.png#light-mode-only)
![New project modal](../img/webapp_projects_new_project_dark.png#dark-mode-only)

</div>

* Project name
* Create in - Where the project should be created, either as a top-level project (create in `Projects root`) or as a 
  subproject of another project
* Description
* Default output destination - The storage location where model checkpoints (snapshots) and artifacts will be uploaded 
  when tasks in this project that do not have an explicit output destination specified are executed
