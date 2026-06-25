---
title: MCP Server Deployment
---

:::info[Enterprise Feature]
The MCP Server Deployment App is available under the ClearML Enterprise plan. 
:::

The MCP Server Deployment application enables users to deploy and manage remote Model Context Protocol (MCP) servers as 
containerized services. The application handles container execution, network exposure and access control through the 
ClearML AI Application Gateway, and runtime monitoring, allowing MCP servers to be integrated into LLM workflows without 
managing the underlying infrastructure. 

The application supports a variety of server types, including filesystem access, database integrations, web search, and 
more, as well as custom container images and startup scripts. The application supports flexible network routing 
configurations, allowing MCP servers to be exposed over HTTP/SSE or raw TCP connections. 

:::info[AI Application Gateway]
The MCP Server Deployment app uses the App Gateway Router which implements a secure, authenticated network endpoint for 
the model.

If the ClearML AI Application Gateway is not available, the model endpoint might not be accessible. For more information, 
see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

After starting an MCP Server Deployment instance, you can view the following information in its dashboard:

* **Status indicator**
  * <img src="/docs/latest/icons/ico-mcpdeploy-active.svg" alt="Active instance" className="icon size-lg space-sm" /> - App instance is running and the MCP server is available 
  * <img src="/docs/latest/icons/ico-mcpdeploy-loading.svg" alt="Loading instance" className="icon size-lg space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-mcpdeploy-idle.svg" alt="Idle instance" className="icon size-lg space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-mcpdeploy-stopped.svg" alt="Stopped instance" className="icon size-lg space-sm" /> - App instance is stopped
* **Idle time** – Time elapsed since last activity  
* **MCP Server Type** – The server type selected at launch (e.g. Filesystem, PostgreSQL)  
* **Restored Workspace** – The session ID from which the workspace was restored, if applicable  
* **Host port**  
* **MCP endpoint** - The publicly accessible URL of the MCP Server
* **Browser link** - Opens the containerized service directly in your web browser. This link performs user authentication automatically through the browser   
* **Session** – Task ID of the running session, with a link to its Console Log  
* **Total Number of Requests** – Plot of total requests served over time  
* **Latency** – Plot of request latency over time  
* **Monitoring CPU** – CPU utilization over time  
* **Monitoring GPU** – GPU utilization over time  
* **Console Log** – The console log shows the app instance's console output: setup progress, status changes, error messages, etc.

:::tip[Embedding ClearML Visualizations] 
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md) and other third-party 
platforms that support embedded content (e.g. Notion). These visualizations are updated live as the app instance 
updates. Hover over a plot and click the embed icon to copy the embed code. 
:::

## MCP Server Deployment Instance Configuration

When configuring a new MCP Server Deployment instance, you can fill in the required parameters or reuse the 
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
Administrators can [customize](../../deploying_clearml/enterprise_deploy/app_launch_form_custom.md) the launch form and 
modify field names and/or available options and defaults.

This section describes the default configuration provided by ClearML.
:::

* **Import Configuration** – Import an app instance configuration file. This will fill the instance launch form with 
  the values from the file, which can be modified before launching the app instance.  
* **MCP Server Session Name** – Name for the app instance. This will appear in the instance list. If not set, defaults 
  to `MCP Server Deployment_<timestamp>`.  
* **Service Project - Access Control** - The ClearML project where the app instance is created. App instance network 
  access is determined by project-level permissions (i.e. users with read access can access app endpoints).   
* **MCP Server Type** – Select a preconfigured MCP server preset. Each preset provides a default container image and 
  startup script for exposing the server over HTTP/SSE using `supergateway`. Available presets:  
  * **Filesystem** – File system access via `@modelcontextprotocol/server-filesystem`  
  * **PostgreSQL** – PostgreSQL database access. Set the `POSTGRES_CONNECTION_STRING` environment variable.  
  * **GitHub** – GitHub API access. Set the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable.  
  * **Brave Search** – Web search via the Brave Search API. Set the `BRAVE_API_KEY` environment variable.  
  * **Memory** – Persistent knowledge graph memory.  
  * **Fetch** – HTTP fetching and content extraction.  
  * **SQLite** – SQLite database access at `/data/database.db`.  
  * **Slack** – Slack workspace integration. Set the `SLACK_BOT_TOKEN` and `SLACK_TEAM_ID` environment variables.  
  * **Everything** – Demo/test server with all MCP capabilities.  
  * **Custom** – Provide your own container image and startup script.  
* **Container Image Override** – Override the default container image (`node:22-slim`). Leave empty to use the preset default.  
* **Startup Script** – Startup command for the MCP server. Modify to customize launch behavior.  
* **Queue** – The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) serviced by the ClearML Agent 
  that will execute the MCP server. Make sure an agent is assigned to that queue.  
* **Network Routing** – Network routing mode for the MCP server. MCP servers typically use HTTP/SSE transport. Select
  `http` for authenticated routing or `tcp` for raw TCP. Select `None` to disable routing.  
* **Container Internal Port** – The container port to expose via the selected network routing mode.  
* **AI Gateway Route** – Choose a persistent route from the routes defined by your administrator. If none is selected, 
  a dynamic route will be used.  
* **Idle Time Limit (Hours)** – Maximum idle time before the app instance shuts down. Set to `None` to disable automatic 
  shutdown.  
* **Persistent Storage Directory** – Directory inside the container to persist across sessions.  
* **Environment Variables** – Environment variables to set inside the container before launching the MCP server (e.g. 
  API keys, connection strings).  
* **Configuration Files** – Configuration files to inject into the container before launching the MCP server. For each 
  entry, specify the target path and the file contents.  
* **Restore MCP Server State** – Specify a previous session ID to restore the MCP server workspace from that session.
* **Advanced**
  * **Run as Root** – Run the container as the root user.  
  * **Disable ClearML VENV** – Disable the ClearML virtual environment inside the container.  
  * **Continuous Console Logging** – Enable continuous console log streaming.  
  * **Monitor Endpoint** – Endpoint to monitor for activity, used to determine idle state.  
  * **Setup Shell Script** – Shell script to run inside the container before the startup script.  
  * **Container Arguments** – Additional arguments passed to the Docker run command.  
  * **Session Tags** – Tags to attach to the session task.  
  * **Idle Network Threshold** – Network activity level below which the session is considered idle.  
  * **Idle CPU Threshold** – CPU utilization level below which the session is considered idle.  
  * **Idle GPU Threshold** – GPU utilization level below which the session is considered idle.  
* **Export Configuration** – Export the current configuration as a JSON file for later reuse or cloning.

