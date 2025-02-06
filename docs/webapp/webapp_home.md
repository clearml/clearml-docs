---
title: Dashboard
---


The **Dashboard** provides the following options:
* Quickly access the summarized monitoring of recently updated projects and their experiments
* Create new projects 
* Open the [**Orchestration**](webapp_workers_queues.md) tab to autoscale, monitor, and manage your resource usage and 
  worker queues.

![Dashboard](../img/webapp_dashboard.png#light-mode-only)
![Dashboard](../img/webapp_dashboard_dark.png#dark-mode-only)

**To select a project, experiment, or model:**

* A project or all projects - to view activity for all experiments in a project.
    * In **RECENT PROJECTS**, click a specific project's card or **VIEW ALL**
    
* An experiment - to view experiment results, edit an experiment, enqueue an experiment to execute, etc.
    * In **RECENT EXPERIMENTS**, click the experiment.
    * In **RECENT PROJECTS**, click a project or **VIEW ALL** **>** Click the experiment.

* A model - to view a model's configuration, label enumeration, or other details.
    * From an experiment, click **ARTIFACTS** **>** In **Input Model** or **Output Model**, click the model.
    * In **RECENT PROJECTS**, click a project or **VIEW ALL** **>** **MODELS** tab **>** Click the model.
    
**To create a new project:**

1. Click **+ NEW PROJECT**
1. Enter the project name, and, optionally, the description and default output destination
1. Click **CREATE PROJECT**

**To autoscale, monitor, and manage your resource usage and workers queues:**

* Click **MANAGE WORKERS AND QUEUES** to go to the [**Orchestration**](webapp_workers_queues.md) page.