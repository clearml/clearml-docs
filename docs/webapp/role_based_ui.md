---
title: Role-Based UI
---

:::important[Enterprise Feature]
The role-based UI is available under the ClearML Enterprise plan.
:::

The ClearML Enterprise WebApp presents its features through three role-filtered views,
each tailored to a different persona:

* [**AI Admin**](#ai-admin) - Platform operators managing the tenant: users, access,
  infrastructure, and tenant-wide activity.
* [**AI Builder**](#ai-builder) - Users running and managing ML workloads: tasks, datasets,
  pipelines, and applications.
* [**AI Consumer**](#ai-consumer) - End users of published applications.

A single tenant sign-in covers every view the user is entitled to. An admin has
access to all three views; a builder has access to the Builder and Consumer views;
an consumer has access only to the Consumer view.

## Switching Views

Users can switch to any view they are entitled to. To switch views, click the profile menu button
<img src="/docs/latest/icons/ico-me.svg" alt="Profile button" className="icon size-lg space-sm" />
in the top right corner and select the desired view. 

Switching views changes the sidebar and default landing page; it does not change the user's permissions.
An on-screen indicator always shows which view is currently in effect.

## AI Admin

The AI Admin view exposes tenant administration functionality:
* Managing users and access
* Operating cluster infrastructure
* Monitoring tenant-wide activity
 
The sidebar organizes it into:

* **[Dashboard](webapp_admin_dashboard.md)** - Tenant-wide activity, including running tasks, application instances, and 
  analytics.
* **[Orchestration](webapp_workers_queues.md)** - Cluster-wide queues, workers, autoscalers,
  and [resource policies](resource_policies.md).
* **[Settings](admin_settings.md)** - Tenant administration settings, including:
  * Users and groups
  * Access rules
  * Identity providers
  * Administrator vaults
  * Storage volumes and cleanup
  * Application gateway
  * Resource configuration
  * UI customization.

The default landing page is the [Dashboard](webapp_admin_dashboard.md).

## AI Builder

The AI Builder view exposes functionality for building and running ML workloads: 
* Experiments
* Datasets
* Pipelines
* Applications
* Model endpoints

The sidebar organizes it into:

* **[Projects](webapp_projects_page.md)** - Tasks, models, dataviews, and [reports](webapp_reports.md), with the [Project Dashboard](webapp_home.md) as the entry point.
* **[Datasets](datasets/webapp_dataset_page.md)** - Dataset management
* **[Pipelines](pipelines/webapp_pipeline_page.md)** - Pipeline runs and management
* **[Applications](applications/apps_overview.md)** - ClearML UI applications
* **[Model Endpoints](webapp_model_endpoints.md)** - Live model endpoints the user can access
* **[Orchestration](webapp_workers_queues.md)** - Queues, workers, and resource policies the user can access

The default landing page is the [Project Dashboard](webapp_home.md).

## AI Consumer

The AI Consumer view provides access only to published [applications](applications/apps_overview.md), allowing users to 
run them without the surrounding development and administration functionality.
