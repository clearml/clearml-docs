---
title: SSH Session 
---

:::important Enterprise Feature
The SSH Session application is available under the ClearML Enterprise plan.
:::

The SSH Session UI application allows you to launch a full development environment on a remote machine complete with 
a detached interactive SSH session. 

The Session app offers workspace management features, allowing you to store, sync, and restore interactive workspaces 
across sessions. This ensures that all your work is preserved and can be easily accessed in future sessions.

The SSH Session is set up using a [ClearML Agent](../../clearml_agent.md). When configuring an app instance, select a 
queue, and the agent servicing that queue will set up the remote environment and SSH session. When the environment setup is 
complete, the app instance dashboard displays SSH connection parameters and the command line to connect to the session.

The application monitors the session's activity and shuts down if it is inactive for a specified maximum idle time.

Once you have launched an app instance, you can view the following information in its dashboard:

* App status indicator
  * <img src="/docs/latest/icons/ico-ssh-loading.svg" alt="Active instance" className="icon size-lg space-sm" /> - Remote SSH session is setting up
  * <img src="/docs/latest/icons/ico-ssh-active.svg" alt="Loading instance" className="icon size-lg space-sm" /> - Remote SSH session is active
  * <img src="/docs/latest/icons/ico-ssh-idle.svg" alt="Idle instance" className="icon size-lg space-sm" /> - Remote SSH session is idle
  * <img src="/docs/latest/icons/ico-ssh-stopped.svg" alt="Stopped instance" className="icon size-lg space-sm" /> - Remote SSH session is stopped
* Idle time
* Restored workspace - If a previous session’s workspace was restored, this will display its session ID
* Current session ID
* SSH:Host:Port - The hostname and port for the SSH connection
* User - SSH username for the interactive session
* Password -  SSH password for the interactive session
* Connect Command - The command line to initiate an SSH connection to the remote environment
* Remote environment's resource metrics over time:
  * CPU usage 
  * Network throughput 
  * Disk performance 
  * Memory performance 
  * GPU utilization 
  * GPU memory usage 
* Console - The console log shows the instance's activity, including session setup progress and SSH server status changes

![SSH Session Dashboard](../../img/apps_ssh_session_dashboard.png#light-mode-only)
![SSH Session Dashboard](../../img/apps_ssh_session_dashboard_dark.png#dark-mode-only)

## SSH Session Instance Configuration

When configuring a new SSH Session instance, you can fill in the required parameters or reuse the configuration of 
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
* **Git** - The details for a git repository to optionally clone into your remote environment:
  * Repository
  * Branch
  * Commit
* **Docker** - Input details to run the session in Docker container
  * Image - Docker image to launch
  * Docker Arguments - Additional arguments for the Docker image
  * Init Script - Bash script that is executed upon container boot (comments are supported only at the beginning of the 
  line)
* **Extra Packages** - Specify Python packages to install when setting up the remote environment
* **Persistent Workspace Path** - Specify your workspace root directory, it will be automatically stored when the session is 
closed and restored into a new instance when the session app instance is cloned (example: `~/workspace`)
* **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the SSH Session app 
  instance task will be enqueued (make sure an agent is assigned to that queue)
* **Maximum idle time** (in hours) - Maximum idle time after which the app instance will shut down
* **Interactive Session Name** - Name your current interactive session
* **Advanced Options**
  * Interactive Session Project - The project in which the interactive session is created.  If left empty, the default 
  project  `Interactive Session` is used
  * Interactive Session Tags - Comma separated list of tags to add to your interactive session
  * Restore Interactive Workspace ID - Input a previously run interactive session ID to restore its workspace
  * Use DropBear SSH server instead of OpenSSH server - Use DropBear SSH server instead of OpenSSH server. Required if 
  not running as root inside container
  * Idle Network Threshold (MB) - Network throughput under which the session will be considered idle
  * Idle CPU Threshold (%) - CPU utilization under which the session will be considered idle
  * Idle GPU Threshold (%) - GPU utilization under which the session will be considered idle
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create a 
new instance with the same configuration

![SSH Session form](../../img/apps_ssh_session_wizard.png#light-mode-only)
![SSH Session form](../../img/apps_ssh_session_wizard_dark.png#dark-mode-only)