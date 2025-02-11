---
title: Execution Environments
---
ClearML Agent has two primary execution modes: [Virtual Environment Mode](#virtual-environment-mode) and [Docker Mode](#docker-mode). 

## Virtual Environment Mode 

In Virtual Environment Mode, the agent creates a virtual environment for the task, installs the required Python 
packages based on the task specification, clones the code repository, applies the uncommitted changes and finally 
executes the code while monitoring it. This mode uses smart caching so packages and environments can be reused over 
multiple tasks (see [Virtual Environment Reuse](clearml_agent_env_caching.md#virtual-environment-reuse)). 

ClearML Agent supports working with one of the following package managers: 
* [`pip`](https://en.wikipedia.org/wiki/Pip_(package_manager)) (default)
* [`conda`](https://docs.conda.io/en/latest/)
* [`poetry`](https://python-poetry.org/)

To change the package manager used by the agent, edit the [`package_manager.type`](../configs/clearml_conf.md#agentpackage_manager) 
field in the of the `clearml.conf`. If extra channels are needed for `conda`, add the missing channels in the 
`package_manager.conda_channels` field in the `clearml.conf`. 

:::note Using Poetry with Pyenv
Some versions of poetry (using `install-poetry.py`) do not respect `pyenv global`.  
If you are using pyenv to control the environment where you use ClearML Agent, you can:
  * Use poetry v1.2 and above (which fixes [this issue](https://github.com/python-poetry/poetry/issues/5077))
  * Install poetry with the deprecated `get-poetry.py` installer
:::

## Docker Mode
:::note notes
* Docker Mode is only supported in Linux.
* Docker Mode requires docker service v19.03 or higher installed.
* If your machine requires root permissions to run Docker, the ClearML Agent in Docker Mode must also run with root permissions. 
:::

When executing the ClearML Agent in Docker mode, it will: 
1. Run the provided Docker container 
1. Install ClearML Agent in the container 
1. Execute the Task in the container, and monitor the process. 
   
ClearML Agent uses the provided default Docker container, which can be overridden from the UI. 

:::tip Setting Docker Container via UI
You can set the docker container via the UI: 
1. Clone the task
2. Set the Docker in the cloned task's **Execution** tab **> Container** section

   ![Container section](../img/webapp_exp_container.png#light-mode-only)
   ![Container section](../img/webapp_exp_container_dark.png#dark-mode-only)

3. Enqueue the cloned task

The task will be executed in the container specified in the UI.
:::

All ClearML Agent flags (such as `--gpus` and `--foreground`) are applicable to Docker mode as well. 

* To execute ClearML Agent in Docker mode, run: 
   ```bash
   clearml-agent daemon --queue <execution_queue_to_pull_from> --docker [optional default docker image to use]
   ```

* To use the current `clearml-agent` version in the Docker container, instead of the latest `clearml-agent` version that is 
automatically installed, pass the `--force-current-version` flag:
   ```bash
   clearml-agent daemon --queue default --docker --force-current-version
   ```

* For Kubernetes, specify a host mount on the daemon host. Do not use the host mount inside the Docker container.
   Set the environment variable `CLEARML_AGENT_K8S_HOST_MOUNT`.
   For example:
   ```
   CLEARML_AGENT_K8S_HOST_MOUNT=/mnt/host/data:/root/.clearml
   ``` 