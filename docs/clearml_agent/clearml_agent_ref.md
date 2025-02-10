---
title: ClearML Agent CLI
---

The following page provides a reference to `clearml-agent`'s CLI commands:
* [build](#build) - Create a worker environment without executing a task.
* [config](#config) - List your ClearML Agent configuration data.
* [daemon](#daemon) - Run a worker daemon listening to a queue for tasks to execute.
* [execute](#execute) - Execute a task, locally without a queue.
* [list](#list) - List the current workers.


## build

Use the `build` command to create worker environments without executing tasks. 

You can build Docker containers according to the execution environments of specific tasks, which an agent can later
use to execute other tasks. See [tutorial](../guides/clearml_agent/exp_environment_containers.md).

You can also create a Docker container that executes a specific task when launched. See [tutorial](../guides/clearml_agent/executable_exp_containers.md). 

```bash
clearml-agent build [-h] --id TASK_ID [--target TARGET]
                    [--install-globally]
                    [--docker [DOCKER [DOCKER ...]]] [--force-docker] 
                    [--python-version PYTHON_VERSION]
                    [--entry-point {reuse_task,clone_task}] [-O]
                    [--git-user GIT_USER] [--git-pass GIT_PASS]
                    [--log-level {DEBUG,INFO,WARN,WARNING,ERROR,CRITICAL}]
                    [--gpus GPUS] [--cpu-only]
```
                          
### Parameters

|Name | Description| Mandatory |
|---|----|---|
|`--id`| Build a worker environment for this Task ID.|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--cpu-only`| Disable GPU access for the Docker container.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--docker`| Run agent in Docker mode. Specify a Docker container that a worker will execute at launch. To specify the image name and optional arguments, use one of the following: <ul><li>`--docker <image_name> <args>` on the command line</li><li>`--docker` on the command line, and specify the default image name and arguments in the configuration file.</li></ul> Environment variable settings for Docker containers: <ul><li>`CLEARML_DOCKER_SKIP_GPUS_FLAG` - Ignore the `--gpus` flag inside the Docker container. This also lets you execute ClearML Agent using Docker versions earlier than 19.03.</li><li>`NVIDIA_VISIBLE_DEVICES` - Limit GPU visibility for the Docker container.</li><li> `CLEARML_AGENT_GIT_USER` and `CLEARML_AGENT_GIT_PASS` - Pass these credentials to the Docker container at execution.</li></ul> To limit GPU visibility for Docker, set the `NVIDIA_VISIBLE_DEVICES` environment variable.| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|      
|`--entry-point`| Used in conjunction with `--docker`, indicates how to run the Task specified by `--task-id` on Docker startup. The `--entry-point` options are: <ul><li>`reuse` - Overwrite the existing Task data.</li><li>`clone_task` - Clone the Task, and execute the cloned Task.</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--force-docker`| Force using the agent-specified docker image (either explicitly in the `--docker` argument or using the agent's default docker image). If provided, the agent will not use any docker container information stored in the task itself (default `False`)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--git-pass`| Git password for repository access.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--git-user`| Git username for repository access.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--gpus`| Specify the active GPUs for the Docker containers to use. These are the same GPUs set in the `NVIDIA_VISIBLE_DEVICES` environment variable. For example: <ul><li>`--gpus 0`</li><li>`--gpu 0,1,2`</li><li>`--gpus all`</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`-h`, `--help`| Get help for this command.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--install-globally`| Install the required Python packages before creating the virtual environment. Use `agent.package_manager.system_site_packages` to control the installation of the system packages. When `--docker` is used, `--install-globally` is always true.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--log-level`| SDK log level. The values are:<ul><li>`DEBUG`</li><li>`INFO`</li><li>`WARN`</li><li>`WARNING`</li><li>`ERROR`</li><li>`CRITICAL`</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--python-version`| Virtual environment Python version to use.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`-O`| Compile optimized pyc code (see [python documentation](https://docs.python.org/3/using/cmdline.html#cmdoption-O)). Repeat for more optimization.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--target`| The target folder for the virtual environment and source code that will be used at launch.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

## config
List your ClearML Agent configuration.

```
clearml-agent config [-h]
```

## daemon 

Use the `daemon` command to spin up an agent on any machine: on-prem and/or cloud instance. When spinning up an agent, 
assign it a queue(s) to service, and when tasks are added to its queues, the agent will pull and execute them. 

With the `daemon` command you can configure your agent's behavior: allocate resources, prioritize queues, set it to run 
in a Docker, and more. 

```bash
clearml-agent daemon [-h] [--foreground] [--queue QUEUES [QUEUES ...]] [--order-fairness] 
                     [--standalone-mode] [--services-mode [SERVICES_MODE]] 
                     [--child-report-tags CHILD_REPORT_TAGS [CHILD_REPORT_TAGS ...]]
                     [--create-queue] [--detached] [--stop] [--dynamic-gpus] 
                     [--uptime [UPTIME [UPTIME ...]]] [--downtime [DOWNTIME [DOWNTIME ...]]] 
                     [--status] [--use-owner-token] [-O] 
                     [--git-user GIT_USER] [--git-pass GIT_PASS] 
                     [--log-level {DEBUG,INFO,WARN,WARNING,ERROR,CRITICAL}] 
                     [--gpus GPUS] [--cpu-only] 
                     [--docker [DOCKER [DOCKER ...]]] [--force-current-version]
```

                           
### Parameters

|Name | Description| Mandatory |
|---|----|---|
|`--child-report-tags`| List of tags to send with the status reports from the worker that executes a task.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--cpu-only`| If running in Docker mode (see the `--docker` option), disable GPU access for the Docker container or virtual environment.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--create-queue`| If the queue name provided with `--queue` does not exist in the server, create it on-the-fly and use it.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--detached`| Run agent in the background. The `clearml-agent` command returns immediately.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|  
|`--docker`| Run in Docker mode. Execute the Task inside a Docker container. To specify the image name and optional arguments, either: <ul><li> Use `--docker <image_name> <args>` on the command line, or </li><li>Use `--docker` on the command line, and specify the default image name and arguments in the configuration file.</li></ul> Environment variable settings for Docker containers: <ul><li>`CLEARML_DOCKER_SKIP_GPUS_FLAG` - Ignore the `--gpus` flag inside the Docker container. This also lets you execute ClearML Agent using Docker versions earlier than 19.03.</li><li>`NVIDIA_VISIBLE_DEVICES` - Limit GPU visibility for the Docker container.</li><li> `CLEARML_AGENT_GIT_USER` and `CLEARML_AGENT_GIT_PASS` - Pass these credentials to the Docker container at execution.</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|        
|`--downtime`| Specify downtime for clearml-agent in `<hours> <days>` format. For example, use `09-13 TUE` to set Tuesday's downtime to 09-13. <br/><br/>NOTES: <ul><li>This feature is available under the ClearML Enterprise plan</li><li>Make sure to configure only `--uptime` or `--downtime`, but not both.</li></ul> |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--dynamic-gpus`| Allow to dynamically allocate GPUs based on queue properties, configure with `--queue <queue_name>=<num_gpus>`. For example: `--dynamic-gpus --queue dual_gpus=2 single_gpu=1` <br/><br/>NOTE: This feature is available under the ClearML Enterprise plan|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--force-current-version`| To use your current version of ClearML Agent when running in Docker mode (the `--docker` argument is specified), instead of the latest ClearML Agent version which is automatically installed, specify `force-current-version`. <br/><br/> For example, if your current ClearML Agent version is `0.13.1`, but the latest version of ClearML Agent is `0.13.3`, use `--force-current-version` and your Task will execute in the Docker container with ClearML Agent version `0.13.1`.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--foreground`| Pipe full log to stdout/stderr. Do not use this option if running in background.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--git-pass`| Git password for repository access.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--git-user`| Git username for repository access|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--gpus`| If running in Docker mode (see the `--docker` option), specify the active GPUs for the Docker containers to use. These are the same GPUs set in the `NVIDIA_VISIBLE_DEVICES` environment variable. For example: <ul><li>`--gpus 0`</li><li>`--gpu 0,1,2`</li><li>`--gpus all`</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`-h`, `--help`| Get help for this command.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--log-level`| SDK log level. The values are:<ul><li>`DEBUG`</li><li>`INFO`</li><li>`WARN`</li><li>`WARNING`</li><li>`ERROR`</li><li>`CRITICAL`</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`-O`| Compile optimized pyc code (see [python documentation](https://docs.python.org/3/using/cmdline.html#cmdoption-O)). Repeat for more optimization.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--order-fairness`| Pull from each queue in a round-robin order, instead of priority order.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--queue`| Specify the queues which the worker is listening to. The values can be any combination of:<ul><li>One or more queue IDs</li><li>One or more queue names</li><li>`default` indicating the default queue</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--services-mode`| Launch multiple long-term docker services. Spin multiple, simultaneous Tasks, each in its own Docker container, on the same machine. Each Task will be registered as a new node in the system, providing tracking and transparency capabilities. Start up and shutdown of each Docker is verified. Use in CPU mode (`--cpu-only`) only. <br/> To limit the number of simultaneous tasks run in services mode, pass the maximum number immediately after the `--services-mode` option (e.g. `--services-mode 5`)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--standalone-mode`| Do not use any network connects. This assumes all requirements are pre-installed.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|            
|`--status`| Print the worker's schedule (uptime properties, server's runtime properties and listening queues)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--stop`| Terminate a running ClearML Agent, if other arguments are the same. If no additional arguments are provided, agents are terminated in lexicographical order.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|  
|`--uptime`| Specify uptime for clearml-agent in `<hours> <days>` format. For example, use `17-20 TUE` to set Tuesday's uptime to 17-20. <br/><br/>NOTES:<ul><li>This feature is available under the ClearML Enterprise plan </li><li>Make sure to configure only `--uptime` or `--downtime`, but not both.</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--use-owner-token`| Generate and use the task owner's token for the execution of the task.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

## execute

Use the `execute` command to set an agent to build and execute specific tasks directly without listening to a queue.


```bash
clearml-agent execute [-h] --id TASK_ID [--log-file LOG_FILE] [--disable-monitoring] 
                      [--full-monitoring] [--require-queue]
                      [--standalone-mode] [--docker [DOCKER [DOCKER ...]]] [--clone] 
                      [-O] [--git-user GIT_USER] [--git-pass GIT_PASS] 
                      [--log-level {DEBUG,INFO,WARN,WARNING,ERROR,CRITICAL}] 
                      [--gpus GPUS] [--cpu-only]
```

                            
### Parameters                            

|Name | Description| Mandatory |
|---|----|---|
|`--id`| The ID of the Task to build|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--clone`| Clone the Task specified by `--id`, and then execute that cloned Task.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--cpu-only`| Disable GPU access for the daemon, only use CPU in either docker or virtual environment.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--docker`| Run in Docker mode. Execute the Task inside a Docker container. To specify the image name and optional arguments, use one of the following: <ul><li>`--docker <image_name> <args>` on the command line</li><li>`--docker` on the command line, and specify the default image name and arguments in the configuration file.</li></ul> Environment variable settings for Dockers containers: <ul><li>`CLEARML_DOCKER_SKIP_GPUS_FLAG` - Ignore the `--gpus` flag inside the Docker container. This also lets you execute ClearML Agent using Docker versions earlier than 19.03.</li><li>`NVIDIA_VISIBLE_DEVICES` - Limit GPU visibility for the Docker container.</li><li> `CLEARML_AGENT_GIT_USER` and `CLEARML_AGENT_GIT_PASS` - Pass these credentials to the Docker container at execution.</li></ul>| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|       
|`--disable-monitoring`| Disable logging and monitoring, except for stdout.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--full-monitoring`| Create a full log, including the environment setup log, Task log, and monitoring, as well as stdout.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--git-pass`| Git password for repository access.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--git-user`| Git username for repository access.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--gpus`| Specify active GPUs for the daemon to use (docker / virtual environment). Equivalent to setting `NVIDIA_VISIBLE_DEVICES`. For example: <ul><li>`--gpus 0`</li><li>`--gpu 0,1,2`</li><li>`--gpus all`</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`-h`, `--help`| Get help for this command.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--log-file`| The log file for Task execution output (stdout / stderr) to a text file.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--log-level`| SDK log level. The values are:<ul><li>`DEBUG`</li><li>`INFO`</li><li>`WARN`</li><li>`WARNING`</li><li>`ERROR`</li><li>`CRITICAL`</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`-O`| Compile optimized pyc code (see [python documentation](https://docs.python.org/3/using/cmdline.html#cmdoption-O)). Repeat for more optimization.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--require-queue`| If the specified task is not queued, the execution will fail (used for 3rd party scheduler integration, e.g. K8s, SLURM, etc.)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--standalone-mode`| Do not use any network connects, assume everything is pre-installed|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

## list

List information about all active workers.

```bash
clearml-agent list [-h]
```

