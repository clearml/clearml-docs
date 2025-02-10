---
title: Version 1.7
---

### ClearML Agent 1.7.0
**New Features**
* Add `agent.docker_args_extra_precedes_task` and `agent.protected_docker_extra_args` configuration settings to prevent 
the same switch to be used by both `agent.extra_docker_args` and a Task's docker args
* Add `agent.resource_monitoring.disk_use_path` configuration option to allow monitoring a different volume than the one 
containing the home folder
* Change default `agent.enable_git_ask_pass` to `true`
* Add example and support for pre-built containers including services-mode support with overrides `CLEARML_AGENT_FORCE_CODE_DIR` 
and `CLEARML_AGENT_FORCE_EXEC_SCRIPT`
* Add `CLEARML_AGENT_SERVICE_TASK=1` environment variable in case of running a service task
* Add `CLEARML_AGENT_TEMP_STDOUT_FILE_DIR` to allow specifying temp dir used for storing agent log files and temporary 
log files (daemon and execution)
* Update GPU stats and pynvml support
* Add git clone verbosity using `CLEARML_AGENT_GIT_CLONE_VERBOSE` environment variable
* k8s glue
  * Add status reason when aborting before moving to `k8s_scheduler` queue
  * When cleaning up pending pods, verify task is still aborted and pod is still pending before deleting the pod
  * Set worker ID in k8s pod execution

**Bug Fixes**
* Fix `agent.package_manager.poetry_install_extra_args` are used in all Poetry commands and not just in `install` ([ClearML Agent GitHub issue #173](https://github.com/allegroai/clearml-agent/issues/173))
* Fix if process return code is SIGKILL (-9 or 137) and abort callback was called, do not mark as failed but as aborted
* Fix `agent.git_host` setting will cause git@domain URLs to not be replaced by SSH URLs since furl cannot parse them to 
obtain host
* Fix an environment variable that should be set with a numerical value of 0 (i.e. end up as `"0"` or `"0.0"`) is set to 
an empty string
* Fix `agent.package_manager.extra_index_url` URLs are not sanitized in configuration printout
* Fix recursion issue when deep-copying a session
* k8s glue
  * Fix k8s glue configuration might be contaminated when changed during apply
  * Fix `KeyError` if container does not contain the arguments field 

