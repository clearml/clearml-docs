---
title: Environment Variables
---

This page lists the available environment variables for configuring ClearML. 

:::note
ClearML's environment variables override the clearml.conf file, SDK, and [configuration vault](../webapp/settings/webapp_settings_profile.md#configuration-vault), 
but can be overridden by command-line arguments. 
:::

## ClearML SDK Variables

### General
|Name| Description                                                                    |
|---|--------------------------------------------------------------------------------|
|**CLEARML_CACHE_DIR** | Set the path for the ClearML cache directory, where ClearML stores all downloaded content.   |
|**CLEARML_DEFERRED_TASK_INIT** | When set to `1`, sets `Task.init(deferred_init)`:  `Task.init()` returns immediately, and server communication runs in a background thread. For more information, see [`deferred_init`](../references/sdk/task.md#taskinit). |
|**CLEARML_DEFAULT_OUTPUT_URI** | The default output destination for model checkpoints (snapshots) and artifacts. |
|**CLEARML_DISABLE_VAULT_SUPPORT** | When set to `0`, disable vault support. The SDK will not attempt to load [configuration vaults](../webapp/settings/webapp_settings_profile.md#configuration-vault). Configuration vaults are available under the ClearML Enterprise plan.|
|**CLEARML_DOCKER_IMAGE** | Sets the default docker image to use when running an agent in [Docker mode](../clearml_agent/clearml_agent_execution_env.md#docker-mode).  |
|**CLEARML_ENABLE_ENV_CONFIG_SECTION** | When set to `1`, applies the [`environment`](clearml_conf.md#environment-section) section from the `clearml.conf`, which defines key-value pairs that will be set as environment variables at runtime. |
|**CLEARML_ENABLE_FILES_CONFIG_SECTION** | When set to `1`, applies the [`files`](clearml_conf.md#files-section) section from the `clearml.conf`, which defines files that will be auto-generated with specified content and target paths. |
|**CLEARML_IGNORE_MISSING_CONFIG** | When set to `1`, suppresses errors if a configuration file is not found|
|**CLEARML_LOG_ENVIRONMENT** | List of Environment variable names. These environment variables will be logged in the ClearML task's configuration hyperparameters `Environment` section. When executed by a ClearML agent, these values will be set in the task's execution environment. The list should be specified in the following format: `CLEARML_LOG_ENVIRONMENT=VAR_1,VAR_2`.  |
|**CLEARML_LOG_LEVEL** | Sets the ClearML package's log verbosity. Log levels adhere to [Python log levels](https://docs.python.org/3/library/logging.config.html#configuration-file-format): CRITICAL, ERROR, WARNING, INFO, DEBUG, NOTSET |
|**CLEARML_SET_ITERATION_OFFSET** | Set initial iteration value for the executed task. The task will report its iterations starting with the specified value +1. Specify `0` to force resetting the iteration count.|
|**CLEARML_SUPPRESS_UPDATE_MESSAGE** | Boolean. <br/> When set to `1`, suppresses new ClearML package version availability message. |
|**CLEARML_TASK_NO_REUSE** | Boolean. <br/> When set to `1`, a new task is created for every execution (see Task [reuse](../clearml_sdk/task_sdk.md#task-reuse)).  |

### VCS
Overrides Repository Auto-logging

|Name| Description                    |
|---|--------------------------------|
|**CLEARML_VCS_REPO_URL** | Repository's URL               |
|**CLEARML_VCS_COMMIT_ID** | Repository's Commit ID         |
|**CLEARML_VCS_BRANCH** | Repository's Branch            |
|**CLEARML_VCS_ROOT** | Repository's Root directory    |
|**CLEARML_VCS_WORK_DIR** | Repository's working directory |
|**CLEARML_VCS_STATUS** | Repository status              |
|**CLEARML_VCS_DIFF** |  Base64 encoded string. Holds repo diff logged to a task. If set to an empty string, uncommitted changes are not logged. Note: Overriding CLEARML_VCS_DIFF may change the results of a task when executed remotely |
|**CLEARML_VCS_ENTRY_POINT** | Entry point script             |

### Server Connection
|Name|Description|
|---|---|
|**CLEARML_API_HOST** | Sets the API Server URL|
|**CLEARML_CONFIG_FILE** | Sets the ClearML configuration file. Overrides the default configuration file location|
|**CLEARML_WEB_HOST** | Sets the Web UI Server URL|
|**CLEARML_FILES_HOST** | Sets the File Server URL|
|**CLEARML_API_ACCESS_KEY** | Sets the Server's Public Access Key|
|**CLEARML_API_SECRET_KEY** | Sets the Server's Private Access Key|
|**CLEARML_API_HOST_VERIFY_CERT** | Enables / Disables server certificate verification (if behind a firewall)|
|**CLEARML_API_DEFAULT_REQ_METHOD**| *Experimental - this option has not been vigorously tested.* Set the request method for all API requests and auth login. This can be useful when GET requests with payloads are blocked by a server, so POST/PUT requests can be used instead. |
|**CLEARML_OFFLINE_MODE** | Sets Offline mode|
|**CLEARML_NO_DEFAULT_SERVER** | Disables sending information to demo server when no HOST server is set|

## Agent Specific Variables

See [here](../clearml_agent/clearml_agent_env_var.md) for environment variables to configure how the ClearML Agent works
with the SDK. 
