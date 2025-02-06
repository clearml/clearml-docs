---
title: WebApp
---

The **ClearML Web UI** is the graphical user interface for the ClearML platform, which includes:
* Experiment management
* Browsing
* Resource utilization monitoring
* Profile management
* Direct access to the ClearML community (Slack channel, YouTube, and GitHub).

![WebApp screenshots gif](../img/gif/webapp_screenshots.gif#light-mode-only)
![WebApp screenshots gif](../img/gif/webapp_screenshots_dark.gif#dark-mode-only)

## UI Modules 
The WebApp's sidebar provides access to the following modules:

* <img src="/docs/latest/icons/ico-homepage.svg" alt="Homepage" className="icon size-md space-md" />[Dashboard](webapp_home.md) - The dashboard for recent activity and quick access to experiments and projects. 

* <img src="/docs/latest/icons/ico-projects.svg" alt="Projects" className="icon size-md space-md" />[Projects](webapp_projects_page.md) - The main experimentation page. Access your experiments and models as they are organized into projects. The experiments and models are displayed in tables which let you:
  * Track ongoing experiments and visualize their results 
  * Reproduce previously run experiments 
  * Tune experiments with no code change 
  * Compare experiments 
  * Share experiments and their models with other ClearML hosted service users
*  <img src="/docs/latest/icons/ico-side-bar-datasets.svg" alt="Datasets" className="icon size-md space-md" />[Datasets](datasets/webapp_dataset_page.md) - View and manage your datasets. 
* <img src="/docs/latest/icons/ico-pipelines.svg" alt="Pipelines" className="icon size-md space-md" />[Pipelines](pipelines/webapp_pipeline_page.md) - View and manage your pipelines. 
* <img src="/docs/latest/icons/ico-model-endpoints.svg" alt="Model endpoints" className="icon size-md space-md" />[Model Endpoints](webapp_model_endpoints.md) - Monitor your live model endpoints (available in the ClearML Enterprise plan). 
* <img src="/docs/latest/icons/ico-reports.svg" alt="Reports" className="icon size-md space-md" />[Reports](webapp_reports.md) - View and manage your reports. 
* <img src="/docs/latest/icons/ico-workers.svg" alt="Workers and Queues" className="icon size-md space-md" />[Orchestration](webapp_workers_queues.md) - Autoscale, monitor, and manage your resource usage and workers queues. 
* <img src="/docs/latest/icons/ico-applications.svg" alt="ClearML Apps" className="icon size-md space-md" />[Applications](applications/apps_overview.md) - ClearML's GUI applications for no-code workflow execution (available in the ClearML Pro and Enterprise plans).

## UI Top Bar 
### Settings Menu

Click the profile menu button <img src="/docs/latest/icons/ico-me.svg" alt="Profile button" className="icon size-lg space-sm" />
in the top right corner of the web UI screen to access the following:
* **Settings** - Navigate to ClearML's user [Settings](settings/webapp_settings_profile.md) page:
  * Set [WebApp preferences](settings/webapp_settings_profile.md)
  * Manage [workspace API credentials](settings/webapp_settings_profile.md#clearml-credentials)
  * Configure [cloud storage access credentials](settings/webapp_settings_profile.md#browser-cloud-storage-access) for the ClearML Web UI
  * ClearML Hosted service specific options
    * Manage [users and workspaces](settings/webapp_settings_users.md)
    * Manage [resource access permissions](settings/webapp_settings_access_rules.md) (available in the ClearML Enterprise plan)
    * Define [configuration vaults](settings/webapp_settings_admin_vaults.md) to apply to designated user groups (available in the ClearML Enterprise plan)
    * Manage [server identity providers](settings/webapp_settings_id_providers.md) (available in the ClearML Enterprise plan)
    * Define the [available resources](settings/webapp_settings_resource_configs.md) and the way in which they will be 
    allocated to different workloads (available in the ClearML Enterprise plan)
    * View [billing and usage](settings/webapp_settings_usage_billing.md) information
* **Invite a User** to your workspace (supported in hosted service). Click **Invite a User** > input user's 
email > click **ADD** > page redirects to the [Users & Groups](settings/webapp_settings_users.md#user-groups) section of 
  the **Settings** page 
* **Switch to Workspace** - Hosted service users can be members of multiple workspaces. These workspaces are listed here. 
  Click a workspace to switch to.
* **Logout** of ClearML 

### Finding What You're Looking for
Use the search bar <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-sm" />
to find your ClearML resources.

To search using regex, click the `.*` icon on the search bar. 

Search results are returned for the different ClearML objects:
* Experiments - Searching an experiment table looks for matches in the experiments' name, ID, description and input and 
output models. The enterprise version also includes experiment Dataviews' hyper-datasets and versions. 
* Models - Searching a Model table looks for matches in the models' name, ID and description.
* Dataviews (Enterprise only) - Searching a Dataviews table looks for matches in the Dataviews' name, ID, description, 
hyper-datasets, and versions.
* Datasets - Searching the datasets page looks for matches in the datasets' name, ID, and description. In a dataset's
version table, a search looks for matches in the versions' name, ID, and description. 
* Pipelines - Searching the pipelines page looks for matches in the datasets' name, ID, and description. In a pipeline
run's table, a search looks for matches in the runs' name and ID. 
* Reports - Searching the reports page looks for matches in the reports' name, ID, tags, project, description, and 
report content.

The search bar in the [Dashboard](webapp_home.md) page searches the whole WebApp for objects that match queries as 
specified above and returns results divided by object type (projects, experiments, models, etc.). 

:::tip Additional filtering
ClearML's object tables (e.g. [experiments](webapp_exp_table.md), [models](webapp_model_table.md), [pipelines](pipelines/webapp_pipeline_table.md), 
and [datasets](datasets/webapp_dataset_page.md)) provide column filters to easily focus your search by object properties
(e.g status, creation/update time, metric values, etc.).
:::

### Helpful Resources 
Click the help menu button <img src="/docs/latest/icons/ico-help-outlined.svg" alt="Help menu" className="icon size-md space-sm" /> 
in the top right corner of the web UI screen to access the self-help resources including:
* ClearML Python Package setup - Instruction to get started with the `clearml` Python package
* [ClearML on YouTube](https://www.youtube.com/c/ClearML/featured) <img src="/docs/latest/icons/ico-youtube.svg" alt="Youtube" className="icon size-md space-sm" />  - Instructional videos on integrating ClearML into your workflow
* Online Documentation
* Pro Tips - Tips for working with ClearML efficiently
* [Contact Us](https://clear.ml/contact-us) - Quick access to ClearML contact form
