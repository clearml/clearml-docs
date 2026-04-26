---
title: WebApp
---

The **ClearML Web UI** is the graphical user interface for the ClearML platform, which includes:
* ML workload automation
* Resource utilization monitoring and management 
* Live model endpoint monitoring
* ML experiment management and visualization 
* Model and Dataset viewing and management
* Pipeline creation and monitoring
* User and administrator settings

![WebApp screenshots gif](../img/gif/webapp_screenshots.gif#light-mode-only)
![WebApp screenshots gif](../img/gif/webapp_screenshots_dark.gif#dark-mode-only)

## UI Modules 
The WebApp's sidebar provides access to the following modules:

* <img src="/docs/latest/icons/ico-applications.svg" alt="ClearML Apps" className="icon size-md space-md" />[Applications](applications/apps_overview.md) - ClearML's GUI applications for no-code workflow execution (available in the ClearML Pro and Enterprise plans).

* <img src="/docs/latest/icons/ico-workers.svg" alt="Workers and Queues" className="icon size-md space-md" />[Orchestration](webapp_workers_queues.md) - Autoscaling, resource usage monitoring and allocation management.

* <img src="/docs/latest/icons/ico-model-endpoints.svg" alt="Model endpoints" className="icon size-md space-md" />[Model Endpoints](webapp_model_endpoints.md) - Monitor your live model endpoints. 

* <img src="/docs/latest/icons/ico-side-bar-datasets.svg" alt="Datasets" className="icon size-md space-md" />[Datasets](datasets/webapp_dataset_page.md) - View and manage your datasets.

* <img src="/docs/latest/icons/ico-projects.svg" alt="Projects" className="icon size-md space-md" />[Projects](webapp_projects_page.md) - The main experimentation page. Access your tasks and models as they are organized into projects. The tasks and models are displayed in tables which let you:

  * Track ongoing tasks and visualize their results
  * Reproduce previous task runs 
  * Tune task parameter values with no code change
  * Compare tasks and models
  * Share tasks and models with other ClearML hosted service users
  * Create and share rich content [Reports](webapp_reports.md)

* <img src="/docs/latest/icons/ico-pipelines.svg" alt="Pipelines" className="icon size-md space-md" />[Pipelines](pipelines/webapp_pipeline_page.md) - View and manage your pipelines.

## UI Top Bar 
### Settings Menu

Click the profile menu button <img src="/docs/latest/icons/ico-me.svg" alt="Profile button" className="icon size-lg space-sm" />
to access the following:
* **Settings** - Navigate to ClearML's [Settings](settings/webapp_settings_profile.md) page:
  * Set personal [WebApp preferences](settings/webapp_settings_profile.md)
  * Manage [workspace API credentials](settings/webapp_settings_profile.md#clearml-api-credentials) 
  * Manage [personal configuration vault](settings/webapp_settings_profile.md#configuration-vault) (Enterprise offering)
  * Configure [cloud storage access credentials](settings/webapp_settings_profile.md#browser-cloud-storage-access) for the ClearML Web UI
  * Administrator settings
    * Manage [users and workspaces](settings/webapp_settings_users.md)
    * View [usage and billing](settings/webapp_settings_usage_billing.md) information (Free Hosted Service)
    * Manage [access rules](settings/webapp_settings_access_rules.md) (available in the ClearML Enterprise plan)
    * Define [configuration vaults](settings/webapp_settings_admin_vaults.md) to apply to designated user groups (available in the ClearML Enterprise plan)
    * Manage [server identity providers](settings/webapp_settings_id_providers.md) (available in the ClearML Enterprise plan)
    * Define the [resource access policies](settings/webapp_settings_resource_configs.md) (available in the ClearML Enterprise plan)
* Workspace Control (Free Hosted Service)
  * **Invite a User** to your workspace (supported in hosted service). Click **Invite a User** > input user's 
  email > click **ADD** > page redirects to the [Users & Groups](settings/webapp_settings_users.md#user-groups) section of 
  the **Settings** page 
  * **Switch to Workspace** - Hosted service users can be members of multiple workspaces. These workspaces are listed here. 
  Click a workspace to switch to.
* Appearance - Select the UI color scheme:
  * Light: ClearML will be in a light theme.
  * Dark: ClearML will be in a dark theme.
  * System: ClearML will follow your device’s theme.
* **Logout** of ClearML 

### Finding What You're Looking for

The ClearML UI provides two search options on most pages:
* **In-page search**: Each object (e.g. projects, tasks etc.) page includes its own search bar <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-sm" /> 
  for filtering the objects shown on that page. This search focuses on attributes relevant to that object type:
  * Projects: show projects whose name or ID match the searched text 
  * Tasks: show tasks whose name, ID, description, or input/output models match the searched text
  * Models:  show models whose name, ID, or description match the searched text.
  * Dataviews:  show dataviews whose name, ID, description, hyper-datasets, or hyper-dataset versions match the searched text.
  * Reports: show reports whose name, ID, tags, project, description, or content match the searched text.
  * Datasets: show datasets whose name, ID, or description match the searched text 
  * Pipeline Runs:  show reports whose name, ID, or description match the searched text 
  <br/>

  :::tip[Additional filtering]
  ClearML's object tables (e.g. [tasks](webapp_exp_table.md), [models](webapp_model_table.md), [pipelines](pipelines/webapp_pipeline_table.md), 
  and [datasets](datasets/webapp_dataset_page.md)) provide column filters to easily focus your search by object properties
  (e.g. status, creation/update time, metric values, etc.).
  :::

* **Global search**: The search bar <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-sm" /> 
  in the top banner ClearML for any objects that match the queries as specified above and 
  returns results grouped by object type (projects, tasks, models, etc.).

  Use the Advanced Search (<img src="/docs/latest/icons/ico-code.svg" alt="advanced search" className="icon size-md space-sm" />) 
  to apply more elaborate and specific filters. Specify explicit API filters (e.g. `task_filter` in [`Task.query_tasks()`](../references/sdk/task.md#taskquery_tasks)) 
  in JSON format. For example:

  ```
  {"status": ["stopped"], "order_by": ["-last_update"], "_all_": {"fields": ["script.repository"], "pattern": "github.com/user"}})
  ```

To use regular expressions, click the `.*` icon in the search bar.

![WebApp Search options](../img/webapp_search_options.png#light-mode-only)
![WebApp Search options](../img/webapp_search_options_dark.png#dark-mode-only)


### Helpful Resources 
Click the help menu button <img src="/docs/latest/icons/ico-help-outlined.svg" alt="Help menu" className="icon size-md space-sm" /> 
in the top right corner of the web UI screen to access the self-help resources including:
* ClearML Python Package setup - Instruction to get started with the `clearml` Python package
* [ClearML on YouTube](https://www.youtube.com/c/ClearML/featured) <img src="/docs/latest/icons/ico-youtube.svg" alt="YouTube" className="icon size-md space-sm" />  - Instructional videos on integrating ClearML into your workflow
* Online Documentation
* Pro Tips - Tips for working with ClearML efficiently
* [Contact Us](https://clear.ml/contact-us) - Quick access to ClearML contact form
