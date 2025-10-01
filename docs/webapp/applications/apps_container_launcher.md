---
title: Containerized Application Launcher
---

:::important Enterprise Feature
The Containerized Application Launcher is available under the ClearML Enterprise plan.
:::

The Containerized Application Launcher enables remote execution of application containers, while managing network routing, 
data persistence, and resource monitoring.

The application features persistent workspaces, allowing you to restore previous session states when an app instance is 
relaunched, ensuring continuity for long-running tasks. The launcher also enables flexible network configurations, 
allowing secure access to applications over HTTPS or through raw TCP connections.

Once you have launched an app instance, you can view the following information in its dashboard:

* App status indicator  
  * <img src="/docs/latest/icons/ico-containerlaunch-loading.svg" alt="Loading app" className="icon size-lg space-sm" /> - Remote containerized app is setting up  
  * <img src="/docs/latest/icons/ico-containerlaunch-active.svg" alt="Active app" className="icon size-lg space-sm" /> - Remote containerized app is active  
  * <img src="/docs/latest/icons/ico-containerlaunch-idle.svg" alt="Idl app" className="icon size-lg space-sm" /> - Remote containerized app is idle  
  * <img src="/docs/latest/icons/ico-containerlaunch-stopped.svg" alt="Stopped app" className="icon size-lg space-sm" /> - Remote containerized app is stopped  
* Idle time  
* Restored workspace - If a previous session's workspace was restored, this will display its session ID  
* Current session ID  
* Network HTTPS - Links for secure access to the containerized applications over HTTPS  
* Endpoint - Direct URL to access the containerized application service  
* Browser Link - URL for accessing the application through a web browser.   
* Total Number of Requests - Number of requests over time
* Latency - Request response time (ms) over time
* Server resources monitoring (CPU / GPU / vMem utilization)  
* Console - The console log shows the instance's activity, including environment setup progress, status changes

:::info AI Application Gateway
The Containerized Application Launcher makes use of the App Gateway Router which implements a secure, authenticated 
network endpoint for the application container.

If the ClearML AI application Gateway is not available, the application container might not be accessible.
For more information, see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

![Containerized Application Launcher Dashboard](../../img/apps_container_launcher.png#light-mode-only)
![Containerized Application Launcher Dashboard](../../img/apps_container_launcher_dark.png#dark-mode-only)

## Containerized Application Launcher Instance Configuration

When configuring a new Containerized App Launcher instance, you can fill in the required parameters or reuse the 
configuration of a previously launched instance.

You can launch a new app instance using the configuration of a previously launched instance with the following options:

* Cloning a previously launched app instance will open the instance launch form with the original instance's configuration prefilled.  
* Importing an app configuration file. You can export the configuration of a previously launched instance as a JSON file when viewing its configuration.

The prefilled instance launch form can be edited before starting the new app instance.

To configure a new app instance, click `Launch New` Add new to open the app's instance launch form.

### Configuration Options

* **Import Configuration** - Import an app instance configuration file. This will fill the instance launch form with the values from the file, which can be modified before launching the app instance  
* **Application Session Name** - Name for the container launcher instance. This will appear in the instance list  
* **Application instance project** - ClearML Project where your app instance will be stored  
* **Container Image** - Containerized application image to use  
* **Application execution command line** - Command line to start the application inside the container, notice the container original entrypoint is ignored  
* **Application execution directory** (*optional*) - Starting working directory for command-line inside the container.  
* **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the containerized app launcher instance task will be enqueued (make sure an agent is assigned to that queue).  
* **Network routing to the container** - Select one of the following:  
  * None  
  * TCP (raw)  
  * HTTPS  
* **Idle Time Limit** (Hours) - Maximum idle time after which the app instance will shut down  
* **Created persistent internal snapshot of the application** - Specify your workspace root directory, it will be automatically stored when the session is closed and restored into a new instance when the launcher app instance is cloned (example: `~/workspace`)  
* **Environment Variables** - Additional environment variable to set inside the container before launching the application  
* **Configuration Files** - Configuration files to inject into the container before launching the application  
* **Advanced Options**  
  * Container Arguments  
  * Application Session Tags - Comma separated list of tags to add to your interactive session  
  * Restore application state from a previous session ID - Select the ID of a previous application session to restore  
  * Idle Network Threshold - Idle Network Threshold (MB/s) - Network throughput under which the session will be considered idle  
  * Idle CPU Threshold (%) - CPU utilization under which the session will be considered idle  
  * Idle GPU Threshold (%) - GPU utilization under which the session will be considered idle  
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create a new instance with the same configuration

<div class="max-w-65">

![Container launcher form](../../img/apps_container_launcher_form.png#light-mode-only)
![Container launcher form](../../img/apps_container_launcher_form_dark.png#dark-mode-only)

</div>
