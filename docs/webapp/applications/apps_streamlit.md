---
title: Streamlit Launcher
---

:::info Enterprise Feature
The Streamlit Launcher App is available under the ClearML Enterprise plan.
:::

[Streamlit](https://streamlit.io/) is a framework for creating visual web interfaces for your models. The ClearML Streamlit 
launcher application spins up a Streamlit execution environment and serves your Streamlit app on a machine of your choice. 
Once you start a Streamlit launcher instance, you will be provided with an [externally accessible link](#traffic_router) to your Streamlit app, 
where you can make use of your models.

The Streamlit launcher monitors the Streamlit app activity and shuts down if it is inactive for a specified maximum idle 
time.

<a id="traffic_router"/>

:::important AI Application Gateway
The Streamlit Launcher relies on the ClearML Traffic Router which implements user authentication, and redirects requests 
to the IP/port served by the Streamlit app. 

If the ClearML AI application Gateway is not available, the Streamlit app might not be accessible.
For more information, see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

Once you start a Streamlit launcher instance, you can view the following information in its dashboard:

* Streamlit App status indicator
  * <img src="/docs/latest/icons/ico-streamlit-active.svg" alt="Active server" className="icon size-md space-sm" /> - App is running and is actively in use
  * <img src="/docs/latest/icons/ico-streamlit-loading.svg" alt="Loading server" className="icon size-md space-sm" /> - App is setting up 
  * <img src="/docs/latest/icons/ico-streamlit-idle.svg" alt="Idle server" className="icon size-md space-sm" /> - App is idle
  * <img src="/docs/latest/icons/ico-streamlit-stopped.svg" alt="Stopped server" className="icon size-md space-sm" /> - App is stopped 
* Idle time 
* Streamlit App - Externally accessible link to your Streamlit app. You can send this link to your colleagues, so they can 
  access the app. Click <img src="/docs/latest/icons/ico-copy-to-clipboard.svg" alt="Copy" className="icon size-md space-sm" />
  to copy link
* Streamlit Git repo - Repository that holds the Streamlit app script
* Live preview of the Streamlit app
* Console Log - The console log shows the launcher instance's activity, including server setup progress, server status 
  changes

## Streamlit Launcher Instance Configuration
When configuring a new Streamlit launcher instance, you can fill in the required parameters or reuse the configuration of 
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
* **Streamlit Instance Name** - Name for the Streamlit launcher instance. This will appear in the instance list
* **Project name** - Project where your Streamlit launcher app instance task will be stored
* **Task name** - Name of task for your Streamlit launcher app instance
* **Git Repository** - Git repository containing the Streamlit script 
* **Git Branch** - Git branch containing the Streamlit script
* **Streamlit Script Name** - Name of Streamlit script to be executed
* **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the Streamlit launcher 
  app instance task will be enqueued (make sure an agent is assigned to that queue)
* **Docker Image** - Docker image the ClearML Agent will use for running the Streamlit app
* **Arguments** - Arguments to be passed to the script
* **Idle Time Limit** (Hours) - Maximum idle time (Period in which no requests are received by the Streamlit app) after 
  which the Streamlit app and the launcher instance will shut down.
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create 
  a new instance with the same configuration 