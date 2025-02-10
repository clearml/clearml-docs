---
title: Version 1.5
---

### ClearML Agent 1.5.2

**New Features and Improvements**
* Switch services agent entrypoint shell from sh to bash ([ClearML Agent GitHub issue #140](https://github.com/allegroai/clearml-agent/issues/140))
* Improve poetry support
* Add poetry cwd support ([ClearML Agent GitHub issue #138](https://github.com/allegroai/clearml-agent/issues/138))
* Add `agent.package_manager.poetry_install_extra_args` configuration option
* Do not allow request exceptions (keep retrying, throw error only on the initial login call)

**Bug Fixes**
* Fix agent update version ([ClearML Agent GitHub PR #132](https://github.com/allegroai/clearml-agent/pull/132))
* Fix login uses `GET` with payload, which breaks when trying to connect a server running in GCP
* Fix `clearml-agent build --docker` stuck on certain containers
* Fix build fails when target is relative path
* Fix pinging running task (change default to once a minute)
* Fix `_` is allowed in k8s label names
* Fix k8s glue does not delete pending pods if the tasks they represent were aborted
* Reintroduce `CLEARML_AGENT_SERVICES_DOCKER_RESTART` accidentally reverted by a previous merge
* Fix `git+ssh://` links inside installed packages not being converted properly to HTTPS-authenticated links

### ClearML Agent 1.5.1

**New Features and Improvements**
* Upgrade requirements for `attrs`, `jsonschema`, `pyparsing`, `six`, and `pyjwt` ([ClearML Agent GitHub issue #129](https://github.com/allegroai/clearml-agent/issues/129))
* Add default output URI selection to `clearml-agent init`
* Add `agent.disable_task_docker_override` configuration option to disable docker override specified in executing tasks
* Add `CLEARML_AGENT_FORCE_SYSTEM_SITE_PACKAGES` env var (default `true`) to allow overriding default `system_site_packages: true` 
behavior when running tasks in containers (docker mode and k8s-glue)

**Bug Fixes**
* Fix using deprecated types validator argument raises an error (deprecated even before `jsonschema` 3.0.0 and unsupported 
since 4.0.0)
* Fix pip support allowing multiple pip version constraints (by default, one for < Python 3.10 and one for >= Python 3.10)

### ClearML Agent 1.5.0

**New Features and Improvements**
* Add option to crash agent on exception using `agent.crash_on_exception` configuration setting ([ClearML Agent GitHub issue #122](https://github.com/allegroai/clearml-agent/issues/122))
* Improve venv cache disabled message
* Upgrade packages for better Python 3.10 support
* Remove future package dependency (Python 2 is not supported for `clearml-agent`)
* Change default pip version used to `pip<21` for better Python 3.10 support
* Add support for operator `!=` in package version (mostly for better PyTorch resolving)
* Add support for PyTorch new `extra_index_url` repo (find the correct index url based on the cuda version, and let pip
do the rest)
* Make venv caching the default behavior
* Add support for `CLEARML_AGENT_DOCKER_ARGS_HIDE_ENV` environment variable (see `agent.hide_docker_command_env_vars` 
config option)
* Ping executing tasks to make sure the server does not consider them stale (set using the `agent.task_ping_interval_sec` 
configuration option, defaults to every 120 seconds)

**Bug Fixes**
* Fix docker extra arguments showing up in configuration printout
* Fix an issue with running on Python 3.10 / 3.11
* Fix cached git token prevents cloning repository (using `agent.enable_git_ask_pass` forcing the agent to use `GIT_ASKPASS` 
for user/password when cloning/fetching repositories)
* Fix setting `CLEARML_API_DEFAULT_REQ_METHOD` raises an error
* Fix `get_task_session()` may cause an old copy of the `APIClient` to be used containing a reference to the previous session
* K8s Glue
  * Fix `agent.system_site_packages` is not turned on by default in k8s glue
  * Make sure git_user/pass is passed to the task pod
  * Remove support for `kubectl run`

