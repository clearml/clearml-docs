---
title: Gradio Launcher
---

:::info Enterprise Feature
The Gradio Launcher App is available under the ClearML Enterprise plan.
:::

[Gradio](https://gradio.app/) is a framework for creating visual web interfaces for your models. The ClearML Gradio 
launcher application spins up a Gradio execution environment and serves your Gradio app on a machine of your choice. 
Once you start a Gradio launcher instance, you will be provided with an [externally accessible link](#traffic_router) to 
your Gradio app, where you can make use of your models.

The Gradio launcher monitors the Gradio app activity and shuts down if it is inactive for a specified maximum idle time.

<a id="traffic_router"/>

:::important AI Application Gateway
The Gradio Launcher relies on the ClearML Traffic Router which implements user authentication, and redirects requests 
to the IP/port served by the Gradio app. 

If the ClearML AI application Gateway is not available, the Gradio app might not be accessible.
For more information, see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

Once you start a Gradio launcher instance, you can view the following information in its dashboard:

* Gradio App status indicator
  * <img src="/docs/latest/icons/ico-gradio-active.svg" alt="Active server" className="icon size-md space-sm" /> - App is running and is actively in use
  * <img src="/docs/latest/icons/ico-gradio-loading.svg" alt="Loading server" className="icon size-md space-sm" /> - App is setting up 
  * <img src="/docs/latest/icons/ico-gradio-idle.svg" alt="Idle server" className="icon size-md space-sm" /> - App is idle
  * <img src="/docs/latest/icons/ico-gradio-stopped.svg" alt="Stopped server" className="icon size-md space-sm" /> - App is stopped 
* Idle time 
* Gradio App - Externally accessible link to your Gradio app. You can send this link to your colleagues, so they can 
  access the app. Click <img src="/docs/latest/icons/ico-copy-to-clipboard.svg" alt="Copy" className="icon size-md space-sm" />
  to copy link
* Gradio Git repo - Repository that holds the Gradio app script
* Live preview of the Gradio app
* Console Log - The console log shows the launcher instance's activity, including server setup progress, server status 
  changes

![Gradio Dashboard](../../img/apps_gradio.png#light-mode-only)
![Gradio Dashboard](../../img/apps_gradio_dark.png#dark-mode-only) 

## Gradio Launcher Instance Configuration
When configuring a new Gradio launcher instance, you can fill in the required parameters or reuse the configuration of 
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
* **Gradio Instance Name** - Name for the Gradio launcher instance. This will appear in the instance list
* **Project name** - Project where your Gradio launcher app instance task will be stored
* **Task name** - Name of task for your Gradio launcher app instance
* **Git Repository** - Git repository containing the Gradio script 
* **Git Branch** - Git branch containing the Gradio script
* **Gradio Script Name** - Name of Gradio script to be executed
* **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the Gradio launcher 
  app instance task will be enqueued (make sure an agent is assigned to that queue)
* **Docker Image** - Docker image the ClearML Agent will use for running the Gradio app
* **Arguments** - Arguments to be passed to the script
* **Idle Time Limit** (Hours) - Maximum idle time (Period in which no requests are received by the Gradio app) after 
  which the Gradio app and the launcher instance will shut down.
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create 
  a new instance with the same configuration 