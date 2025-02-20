---
title: Version 1.4
---

### ClearML Agent 1.4.1

**New Features and Improvements**
* Add warning if venv cache is disabled
* Add `agent.disable_ssh_mount` configuration option (same as the `CLEARML_AGENT_DISABLE_SSH_MOUNT` environment variable)

**Bug Fixes**
* Fix docker command for monitoring child agents
* Fix `--gpus all` not reporting GPU stats on worker machine

### ClearML Agent 1.4.0

**New Features and Improvements**
* Add support for MIG devices (use `0:1` for GPU 0 slice 1, or use 0.1)
* Add `agent.enable_git_ask_pass` to improve passing user/pass to git commands
* Add docker `ssh_ro_folder` (default `/.ssh`) and changed docker `ssh_folder `(default: `~/.ssh`)
* Allow overriding pytorch lookup page (See `torch_page`, `torch_nightly_page` and `torch_url_template_prefix` under the 
  `agent.package_manager` configuration settings)
* Add support for abort callback registration
* K8s glue
  * Add `CLEARML_K8S_GLUE_START_AGENT_SCRIPT_PATH` environment variable to allow customizing the agent startup script location
  * Add debug environment variable `CLEARML_AGENT_DEBUG_INFO`
  * Add `CLEARML_AGENT_CHILD_AGENTS_COUNT_CMD` environment variable to allow overriding child agent count command in k8s
  * Refactor template handling
**Bug Fixes**
* Fix Python 3.10+ support
* Fix `use_credentials_chain` is missing in config file example
* Fix Git PAT messages
* Fix home folder in `clearml.conf` to ~ (instead of `/root`)
* Fix docker mode uses `~/.clearml/venvs-builds` as default for easier user-mode containers
* Fix package `@ file://` with quoted (URL style) links should not be ignored
* Fix name not escaped as regex (all services "get_all" use regex for name)
* Fix second .ssh temp mount fails if container changes the files inside
* Fix GCP load balancer does not forward GET request body (allow changing default request action to `PUT/POST/GET`. See 
  `api.http.default_method` or `CLEARML_API_DEFAULT_REQ_METHOD`)
* K8s glue
  * Fix resolving k8s pending queue may cause a queue with a UUID name to be created
  * Fix template namespace should override default namespace
  * Fix `extra_bash_init_cmd` location in initial bash script
  * Fix debug mode
* Fixed documentation ([ClearML Agent PR #117](https://github.com/clearml/clearml-agent/pull/117))
