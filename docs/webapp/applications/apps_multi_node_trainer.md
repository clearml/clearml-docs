---
title: Multi-Node Trainer
---

:::info[Enterprise Feature] 
The Multi-Node Trainer App is available under the ClearML Enterprise plan. 
:::

The Multi-Node Trainer application enables users to run distributed training jobs across multiple nodes. The application 
orchestrates a master node and one or more worker nodes through a ClearML queue and automatically configures the 
distributed training environment for all nodes. 

The execution script can use any distributed training framework, including PyTorch (`torchrun`) and Hugging Face 
Accelerate. Training code can be provided either through a Git repository or prepackaged inside the container image. To 
run across multiple nodes, the configured queue must  support executing multiple tasks simultaneously (e.g. serviced by 
an autoscaler or multiple agents). 

Once you start a Multi-Node Trainer instance, you can view the following information in its dashboard:

* Status indicator  
  * <img src="/docs/latest/icons/ico-multi-node-active.svg" alt="Active instance" className="icon size-lg space-sm" /> - App instance is running
  * <img src="/docs/latest/icons/ico-multi-node-loading.svg" alt="Loading instance" className="icon size-lg space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-multi-node-idle.svg" alt="Idle instance" className="icon size-lg space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-multi-node-stopped.svg" alt="Stopped instance" className="icon size-lg space-sm" /> - App instance is stopped
* Running time – Total elapsed time since the instance started  
* Master Node – Task ID of the master node and a link to its Console Log  
* Number of Workers – Number of worker nodes in cluster  
* Node Status – Count of worker nodes by current state: Pending, Running, and Failed  
* Node Summary – Per-node breakdown of rank, task ID, and current status  
* Resource utilization plots over time for all nodes:  
  * CPU Compute Utilization  
  * GPU Compute Utilization  
  * CPU Memory Utilization  
  * GPU Memory Utilization  
* Console Log – The console log shows the app instance's console output: setup progress, status changes, error messages, etc.

![Multi-node Dashboard](../../img/apps_multi_node.png#light-mode-only)
![Multi-node Dashboard](../../img/apps_multi_node_dark.png#dark-mode-only)

:::tip[Embedding ClearML Visualizations]
You can embed plots from the app instance dashboard into [ClearML Reports](../../webapp/webapp_reports.md) 
and other third-party platforms that support embedded content (e.g. Notion). These visualizations are updated live as 
the app instance updates. Hover over a plot and click the embed icon to copy the embed code. 
:::

## Multi-Node Trainer Instance Configuration

When configuring a new Multi-Node Trainer instance, you can fill in the required parameters or reuse the configuration 
of a previously launched instance.

Launch an app instance with the configuration of a previously launched instance using one of the following options:

* Cloning a previously launched app instance will open the instance launch form with the original instance's configuration 
prefilled.
* Importing an app configuration file. You can export the configuration of a previously launched instance as a JSON file 
when viewing its configuration.

The prefilled instance launch form can be edited before starting the new app instance.

To configure a new app instance, click <img src="/docs/latest/icons/ico-add.svg" alt="Add new" className="icon size-md space-sm" /> to open the app's instance launch form.


### Configuration Options

:::note
Administrators can [customize](../../deploying_clearml/enterprise_deploy/app_launch_form_custom.md) 
the launch form and modify field names and/or available options and defaults.

This section describes the default configuration provided by ClearML.
:::

* **Import Configuration** – Import an app instance configuration file. This will fill the instance launch form with the 
  values from the file, which can be modified before launching the app instance.  
* **Compute Resource (Queue)** – The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) serviced by the ClearML Agent that will run the training nodes. The queue must support executing multiple tasks simultaneously (e.g. serviced by an autoscaler or multiple agents).  
* **Number of Nodes (World Size)** – Total number of nodes participating in the distributed training job.  
* **Execution Script** – The script to execute on each node to launch the distributed training job.  
  The application makes the following environment variables available in each node’s script execution environment to facilitate invoking the distributed training:  
  * `MASTER_ADDR` - The IP address of the master node.  
  * `MASTER_PORT` - Network port of the master node.  
  * `WORLD_SIZE` - Total number of nodes in the cluster  
  * `RANK` - The current node’s rank  
* **Base ClearML Task ID** (optional) – An existing ClearML Task ID to use as a base configuration. If set, the task is cloned, using its Git and container settings.
* **Git**
  * Repository – URL of the Git repository containing the training code.  
  * Branch – Git branch to use. Defaults to the repository's default branch if not set.  
  * Commit – Specific Git commit hash to use. If not set, use the latest commit on the branch.  
  
  Specifying these settings will override any cloned task settings.

* **Container**
  * Image – Docker image to use for the training environment (e.g. `python:3.9`, `nvcr.io/nvidia/pytorch:23.10-py3`).  
  * Docker Arguments – Additional arguments passed to the Docker run command (e.g. `--ipc=host --privileged`).  
  * Init Script – Script executed inside each container before the training script runs.

  Specifying these settings will override any cloned task settings.

* **Additional Python Packages** – Python packages to install on each node before the training script runs 
  (e.g. `torch==2.0.0 transformers`).
* **Advanced Configurations**
  * Instance Name – Name for the app instance. This will appear in the instance list.   
  * Service Project (Access Control) – The ClearML project where the app instance is created. App instance network 
    access is determined by project-level permissions (i.e. users with read access can access app endpoints).  
  * Working Directory – Working directory for the execution script, relative to the repository root.  
  * Inject ClearML File – Path to the Python file into which a call to `clearml.Task.init` will be added, relative to 
    the working directory or as an absolute path. Use this when the training script is not yet instrumented with ClearML.  
  * Export Configuration – Export the current configuration as a JSON file for later reuse or cloning.

