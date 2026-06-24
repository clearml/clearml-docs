---
title: Deploy Slurm Cluster
---

:::info[Enterprise Feature]   
The Deploy Slurm Cluster app is available under the ClearML Enterprise plan.   
::: 

The Deploy Slurm Cluster application enables users to deploy and manage a Slurm cluster on their compute infrastructure. 
The cluster consists of a single login node and one or more worker nodes, provisioned and orchestrated through ClearML 
queues. The nodes’ execution environment can be customized via the injection of environment variables, custom 
configuration files, dependency installation (Python packages), and node-specific initialization scripts. 

Once an app instance is running, users can SSH directly into the login node and interact with the Slurm cluster using 
standard Slurm interfaces. Jobs are submitted to worker nodes using `sbatch`, just as in a standard Slurm environment. 
ClearML manages the infrastructure; users manage their workloads. 

Once you start a Deploy Slurm Cluster instance, you can view the following information in its dashboard:

* Status indicator  
  * <img src="/docs/latest/icons/ico-slurm-active.svg" alt="Active instance" className="icon size-lg space-sm" /> - App instance is running and is actively in use
  * <img src="/docs/latest/icons/ico-slurm-loading.svg" alt="Loading instance" className="icon size-lg space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-slurm-idle.svg" alt="Idle instance" className="icon size-lg space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-slurm-stopped.svg" alt="Stopped instance" className="icon size-lg space-sm" /> - App instance is stopped
* Running time – Total elapsed time since the instance started  
* Login Node – Task ID of the login node, with a link to its Console Log  
* Number of Workers – Total number of worker nodes currently provisioned  
* SSH connection details  
  * SSH Host:Port  
  * SSH Login user name  
  * SSH Login password  
  * SSH Connect Command – The full command line to initiate an SSH connection to the login node  
* Node Status - Number of worker nodes in each status category   
* Node Summary - Per-node details including rank, task ID, and current status  
* Resource utilization plots over time for all nodes:  
  * CPU Compute Utilization  
  * GPU Compute Utilization  
  * CPU Memory Utilization  
  * GPU Memory Utilization  
* Console Log - App instance's console output: setup progress, status changes, error messages, etc.

![Slurm Deploy Dashboard](../../img/apps_slurm.png#light-mode-only)
![Slurm Deploy Dashboard](../../img/apps_slurm_dark.png#dark-mode-only)

:::tip[Embedding ClearML Visualizations] 
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md) and other third-party 
platforms that support embedded content (e.g. Notion). These visualizations are updated live as the app instance 
updates. Hover over a plot and click the embed icon to copy the embed code. 
:::

## Deploy Slurm Cluster Instance Configuration

When configuring a new Deploy Slurm Cluster instance, you can fill in the required parameters or reuse the 
configuration of a previously launched instance. 

Launch an app instance with the configuration of a previously launched instance using one of the following options:
* Cloning a previously launched app instance will open the instance launch form with the original instance's 
configuration prefilled.
* Importing an app configuration file. You can export the configuration of a previously launched instance as a JSON file 
when viewing its configuration.

The prefilled configuration form can be edited before launching the new app instance.

To configure a new app instance, click `Launch New` <img src="/docs/latest/icons/ico-add.svg" alt="Add new" className="icon size-md space-sm" /> 
to open the app's configuration form.

### Configuration Options 

:::note
Administrators can [customize](../../deploying_clearml/enterprise_deploy/app_launch_form_custom) the launch form and 
modify field names and/or available options and defaults.

This section describes the default configuration provided by ClearML.  
:::

* **Import Configuration** – Import an app instance configuration file. This will fill the instance launch form with the 
  values from the file, which can be modified before launching the app instance.   
* **Instance Name** - Name for the app instance. This will appear in the instance list.   
* **Service Project - Access Control** - The ClearML project where the app instance is created. App instance network 
  access is determined by project-level permissions (i.e. users with read access can access app endpoints).   
* **Login Node Compute Resource** - The [ClearML Queue](../../fundamentals/agents_and_queues#what-is-a-queue) through 
  which the login node task will be deployed. Make sure an agent is assigned to that queue.   
* **Worker Node Compute Resource** - The [ClearML Queue](../../fundamentals/agents_and_queues#what-is-a-queue) through 
  which worker nodes will be deployed. The queue must support executing multiple tasks simultaneously (e.g. serviced by 
  an autoscaler or multiple agents).   
* **Number of Workers** - Number of worker nodes to provision for the cluster.  
* **Environment Variables** - Additional environment variable to set inside the container before launching workloads  
* **Configuration Files** - Configuration files to inject into the container before launching workloads. For each entry, 
  specify the target path (absolute path) and the file contents.  
* **Additional Python Packages** - Python packages to install on all nodes at startup. This automatically installs your 
  dependencies on every node .   
* **Working Directory** - The working directory from which the login node and worker node setup scripts are executed.  
* **Login Node Execution Script** - Bash script used to launch and configure the login node environment.   
* **Worker Nodes Execution Script** - Bash script used to launch and configure worker node workloads.   
* **Restore Slurm Task ID** – Specify the Task ID of a previously run Deploy Slurm Cluster instance to restore its 
  cluster state and settings.  
* **Export Configuration** – Export the current configuration as a JSON file for later reuse 

