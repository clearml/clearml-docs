---
title: VS Code
---

:::important Enterprise Feature
The VS Code application is available under the ClearML Enterprise plan.
:::

The VS Code UI application allows you to launch a remote VS Code session on a machine that better meets resource needs. 
This feature provides a local link to access VS Code on a remote machine over a secure and encrypted SSH connection,
letting you use the IDE as if you're running on the target machine itself.

The VS Code app offers workspace management features, allowing you to store, sync, and restore interactive workspaces 
across sessions. This ensures that all your work is preserved and can be easily accessed in future sessions.

The VS Code session is set up using a [ClearML Agent](../../clearml_agent.md). When configuring an app instance, 
select a queue, and the agent servicing that queue will download and launch the IDE on its machine. When the server 
setup is complete, the dashboard displays a link to access the VS Code session.  

Once you have launched an app instance, you can view the following information in its dashboard: 
* App status indicator
    * <img src="/docs/latest/icons/ico-vscode-loading.svg" alt="VS Code loading" className="icon size-md" /> - Remote IDE is setting up 
    * <img src="/docs/latest/icons/ico-vscode-active.svg" alt="VS Code active" className="icon size-md" /> - Remote IDE is active
    * <img src="/docs/latest/icons/ico-vscode-idle.svg" alt="VS Code idle" className="icon size-md" /> - Remote IDE is idle  
    * <img src="/docs/latest/icons/ico-vscode-stopped.svg" alt="VS Code stopped" className="icon size-md" /> - Remote IDE is stopped
* Idle time
* Restored workspace - If a previous session’s workspace was restored, this will display that session's ID 
* Current session ID
* Open IDE - Link to the IDE session
* Server's resources monitoring (CPU / GPU / vMem utilization)
* Console - The console log shows the instance's activity, including server setup progress, server status changes

![VS Code Dashboard](../../img/apps_vs_code.png#light-mode-only)
![VS Code Dashboard](../../img/apps_vs_code_dark.png#dark-mode-only)

:::tip EMBEDDING CLEARML VISUALIZATION
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md) and other third-party platforms that support embedded content
(e.g. Notion). These visualizations are updated live as the app instance(s) updates. Hover over the plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
to copy the embed code, and navigate to a report to paste the embed code.
:::

## VS Code App Instance Configuration
When configuring a new VS Code instance, you can fill in the required parameters or reuse the configuration of 
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

:::note
Administrators can [customize](../../deploying_clearml/enterprise_deploy/app_launch_form_custom.md) the launch form and 
modify field names and/or available options and defaults. 

This section describes the default configuration provided by ClearML.
:::


* **Import Configuration** - Import an app instance configuration file. This will fill the instance launch form with the 
  values from the file, which can be modified before launching the app instance
* **Git** - To access a git repository remotely, add git information. 
  * Repository
  * Branch
  * Commit
  * Store git repository as part of the snapshot - If you select to `Store git repo`, a copy of the repo will be stored 
    in the workspace under `./git_repo`. Otherwise, the workspace will include a  `./git_repo_not_synced` soft link to the 
    expected repo path
* **Container**
  * Image - container image used to run the IDE in
  * Docker arguments - `docker run` arguments, as a single string
  * Init script - Bash script that is executed upon container boot (comments are supported only at the beginning of the 
    line)
* **Extra Packages** - Extra Python packages to be installed
* **Persistent Workspace Path** - Specify your workspace root directory. It will be automatically stored when the session 
  is closed and available for restoring into new sessions (example: `~/workspace`)
* **Queue** - The queue serviced by the ClearML Agent that will execute the VS Code session
* **Maximum idle time** (hours) - Maximum time of inactivity, after which the session will shut down. Configure idleness 
  definitions under `Advanced Options`.  
* **Interactive Session Name** - Name for your current interactive session
* **Advanced Options**
  * Interactive Session Project - The ClearML project in which the interactive session is created. If left empty, the 
  default project `Interactive Session` is used 
  * Interactive Session Tags - Comma separated list of tags to add to your interactive session task. 
  * Restore Interactive Workspace ID - Input a previously run interactive session ID to restore its workspace (when 
    cloning a previously run app instance, this field is automatically filled with its ID)
  * VSCode Version - VSCode code-server version to download
  * VSCode additional extensions - Comma separated list of additional VSCode extensions to install (for example `ms-toolsai.jupyter,ms-python.python`)
  * Idle Network Threshold (MB/s) - Throughput under which the session will be considered idle
  * Idle CPU Threshold (%) - CPU utilization under which the session will be considered idle
  * Idle GPU Threshold (%) - GPU utilization under which the session will be considered idle
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create 
  a new instance with the same configuration


