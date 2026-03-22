---
title: Version 2.0
---


### ClearML Agent 2.0.7

**New Features and Bug Fixes**
* Resolve `uv run` missing environment variables ([#257](https://github.com/clearml/clearml-agent/pull/257))
* Add support for extra git repo credentials under the `agent.git.extra_credentials` configuration option, with support 
  for matching git host full URL with `agent.git_host_match_prefix`
* Add support for shlex parsing of script, to pass arguments directly to Python by setting execution script to 
  `sub/dir/script.py --arg1=a --arg2=b`
* Add info prints on locking cache folders for increased visibility
* Change behavior to not ask to skip setting execution queue on open source servers ([#223](https://github.com/clearml/clearml-agent/issues/223))
* Fix template string handling for YAML
* Fix bash tasks created via CLI
* Fix `setuptools` dependency since `pkg_resources` was removed in 82.0.0
* Ensure venv folder was actually created after venv returned success status code (sometime happens with Python wrappers)
* Fix `clearml` installation when forcing `Task.init` patch and using UV as package manager
* Fix `CLEARML_AGENT_FORCE_TASK_INIT` sometimes does not patch requirements correctly
* Fix UV to keep `UV_CACHE_DIR` env if exists
* Fix UV sync, if failing revert to `toml` file
* Fix environment variables not passed when using non `os.exec`
* Fix when using `CLEARML_AGENT_SKIP_PIP_VENV_INSTALL` and `CLEARML_AGENT_SKIP_PYTHON_ENV_INSTALL=1`, make sure `CLEARML_AGENT_SKIP_PIP_VENV_INSTALL` binary is used 
  and not the default Python
* Fix when no container image is provided, default image zeroes out all container arguments and bash script
* Fix obtaining task information when running where the task and the task session refer to a different tenant
* Fix GPU reporting when `NVIDIA_VISIBLE_DEVICES=void`


### ClearML Agent 2.0.5

**Bug Fixes**
* Don't pass `--locked` to `uv sync` if there's no lock file
* Fix agent in standalone mode crashes on Python `get` command

### ClearML Agent 2.0.4

**New Features and Bug Fixes**
* Fix Python 3.6 compatibility
* Update psutil requirement

### ClearML Agent 2.0.3

**New Feature**
* Add support for Azure DevOps Git repositories authentication with Azure PAT and MS Entra Token using the `agent.git_use_azure_pat` 
  and `agent.git_use_ms_entra_token` configuration options (and environment variables `CLEARML_AGENT_GIT_USE_AZURE_PAT` 
  and `CLEARML_AGENT_GIT_USE_MS_ENTRA_TOKEN`)

**Bug Fix**
* Fix null ptr ref when skip Python env enabled ([#239](https://github.com/clearml/clearml-agent/issues/239))

### ClearML Agent 2.0.2

**Bug Fix**
* Fix YAML dump failure causes agent to abort task execution (error log includes expected `SCALAR`, `SEQUENCE-START`, `MAPPING-START`, or `ALIAS`)

### ClearML Agent 2.0.1

**Bug Fix**
* Fix regression issue `AttributeError: 'NoneType' object has no attribute 'pending'` caused by accessing a non-existing report ([#241](https://github.com/clearml/clearml-agent/issues/241))

### ClearML Agent 2.0.0

**New Features**
* Add command line arguments for `k8s_glue_example.py` ([#196](https://github.com/clearml/clearml-agent/pull/196))
* Add initial support for `--break-system-packages` version detection, and make sure to use `rm /usr/lib/python3.*/EXTERNALLY-MANAGED`
* Integrate docker port mapping to control non `network=host` port mapping, including port reassigning for multiple agents running on the same machine
* Add support for container rulebook overrides (`force_container_rules: true`) and container rulebook task update 
  (`update_back_task: true`). This allows users to override container arguments forcefully based on task properties
  (repository, tags, project, user etc.), as well as offer additional defaults based on Python required packages or Python versions
* Add `CLEARML_AGENT_ABORT_CALLBACK_CMD` and `CLEARML_AGENT_ABORT_CALLBACK_TIMEOUT` (default 180 seconds) environment 
  variables to define callback command to be called on abort status change
* Add support for `${CLEARML_TASK.yyy}` as docker arguments parsed based on Task values
* Add `CLEARML_AGENT_QUEUE_POLL_FREQ_SEC` and `CLEARML_AGENT_STATUS_REPORT_FREQ_SEC` environment variables to customize agent behavior
* Add `agent.translate_ssl_replacement_scheme` configuration option and `CLEARML_AGENT_SSH_URL_REPLACEMENT_SCHEME` environment 
  variable to support translating SSH URLs to HTTP instead of HTTPS
* Set `urllib3` log level when connecting to server to `WARNING` by default to provide visibility on certificate issues 
  (use the `CLEARML_AGENT_URLLIB3_CONNECT_LEVEL` environment variable to customize this behavior)
* Optimize dynamic GPU to query only relevant workers (requires ClearML Server v2.0.0 or higher)
* Bump `urllib3` to `<3` to support `urllib3` v2
* Add `CLEARML_AGENT_CONFIG_VERBOSE` for verbose configuration file loading
* Add default support for dns i.e. rocky/centos/fedora containers
* Support `NVIDIA_VISIBLE_DEVICES` containing volume mounts
* Add better debug logging when task session creation fails
* Add `is_daemon` indication in status report
* Reduce required packages
* Add SECURITY.md

**Bug Fixes**
* Fix UV integration
  * Fix `uv_replace_pip` feature
  * Fix UV cache based on sync/pip-replacement
  * Fix if UV fails but lock file is missing, revert to UV as pip drop in replacement
  * Fix use UV bin instead of UV Python package to avoid nested `VIRTUAL_ENV` issues
  * Fix UV `pip freeze` fails
  * Fix UV as pip drop-in replacement print
* Fix cached venv tries to reinstall priority packages even through they are preinstalled
* Fix pip freeze dump to comply with YAML fancy print
* Fix pip requirements print dump should be sorted
* Fix force the stop command to avoid a potential race
* Fix failure to kill one child process prevents attempts to terminate remaining processes
* Fix untitled file based on binary is now `py`/`sh` based on requested binary
* Fix session should retry on any error if send fails
* Fix potential issue with agent not sending queues in status report
* Fix task is set to Aborted after already marked as Failed
* Fix installing venv from the agent's python binary when the selected Python failed
* Fix fallback to system path `python3` if pip is unavailable for selected Python 
* Fix fallback to system python changes the Python bin inside the new virtual environment