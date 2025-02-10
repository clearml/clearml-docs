---
title: Jupyter Lab
---

:::important Enterprise Feature
The Jupyter Lab application is available under the ClearML Enterprise plan.
:::

The Jupyter Lab UI application allows you to launch a remote Jupyter Lab session on a machine that better meets resource needs. 
This feature provides a local link to access Jupyter Lab on a remote machine over a secure and encrypted SSH connection,
letting you use the IDE as if you're running on the target machine itself.

The Jupyter Lab session is set up using a [ClearML Agent](../../clearml_agent.md). When configuring an app instance, 
select a queue, and the agent servicing that queue will download and launch the IDE on its machine. When the server 
setup is complete, the dashboard displays a link to access the Jupyter Lab session.  

Once you have launched an app instance, you can view the following information in its dashboard: 
* App status indicator
    * <img src="/docs/latest/icons/ico-jupyter-lab-loading.svg" alt="Jupyter loading" className="icon size-md" /> - Remote IDE is setting up 
    * <img src="/docs/latest/icons/ico-jupyter-lab-active.svg" alt="Jupyter active" className="icon size-md" /> - Remote IDE is active
    * <img src="/docs/latest/icons/ico-jupyter-lab-idle.svg" alt="Jupyter idle" className="icon size-md" /> - Remote IDE is idle  
    * <img src="/docs/latest/icons/ico-jupyter-lab-stopped.svg" alt="Jupyter stopped" className="icon size-md" /> - Remote IDE is stopped
* Open IDE - link to the IDE session
* Idle time
* Server's resources monitoring (CPU / GPU / vMem utilization)
* Console - The console log shows the instance's activity, including server setup progress, server status changes

![Jupyter Lab Dashboard](../../img/apps_jupyter_lab.png#light-mode-only)
![Jupyter Lab Dashboard](../../img/apps_jupyter_lab_dark.png#dark-mode-only)

## Jupyter Lab Instance Configuration
When configuring a new Jupyter Lab instance, you can fill in the required parameters or reuse the configuration of 
a previously launched instance.  

Launch an app instance with the configuration of a previously launched instance using one of the following options:
* Cloning a previously launched app instance will open the instance launch form with the original instance's 
configuration prefilled.
* Importing an app configuration file. You can export the configuration of a previously launched instance as a JSON file 
when viewing its configuration.

The prefilled instance launch form can be edited before starting the new app instance. 

To configure a new app instance, click `Launch New` <img src="/docs/latest/icons/ico-add.svg" alt="Add new" className="icon size-md space-sm" /> 
to open the app's instance launch form.

### Configuration Options

* **Import Configuration** - Import an app instance configuration file. This will fill the instance launch form with the 
  values from the file, which can be modified before launching the app instance
* **Git** - To access a git repository remotely, add git information. 
  * Repository
  * Branch
  * Commit
* **Docker**
  * Image - Docker image used to run the IDE in
  * Docker arguments - `docker run` arguments, as a single string
* **Extra Packages** - Extra Python packages to be installed
* **Queue** - The queue serviced by the ClearML Agent that will execute the Jupyter Lab session
* **Maximum idle time** (hours) - Maximum time of inactivity, after which the session will shut down. Configure idleness 
  definitions under `Advanced Options`.  
* **Advanced Options**
  * Idle Network Threshold (MB/s) - Throughput under which the session will be considered idle
  * Idle CPU Threshold (%) - CPU utilization under which the session will be considered idle
  * Idle GPU Threshold (%) - GPU utilization under which the session will be considered idle
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create 
  a new instance with the same configuration

