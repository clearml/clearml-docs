---
title: Version 1.6
---

### ClearML Agent 1.6.1

**Bug Fix**
* Fix `requests` requirement lower constraint breaks backwards compatibility for Python 3.6

### ClearML Agent 1.6.0

**New Features and Improvements**
* Upgrade `requests` library ([ClearML Agent GitHub issue #161](https://github.com/allegroai/clearml-agent/issues/161))
* Add support for controlling PyTorch resolving mode using the `CLEARML_AGENT_PACKAGE_PYTORCH_RESOLVE` environment 
variable and `agent.package_manager.pytorch_resolve configuration` setting with `none` (no resolving), `pip` (sets extra 
index based on cuda and lets pip resolve) or `direct` (the previous parsing algorithm that does the matching and downloading). Default is `pip` ([ClearML Agent GitHub issue #152](https://github.com/allegroai/clearml-agent/issues/152))
* Add backwards compatibility in standalone mode using the `CLEARML_AGENT_STANDALONE_CONFIG_BC` environment variable
* Add `CLEARML_AGENT_DOCKER_AGENT_REPO` alias for the `FORCE_CLEARML_AGENT_REPO` environment variable
* Show a better message for `agent init` when an existing `clearml.conf` is found
* Add support for task field injection into container docker name using the `agent.docker_container_name_format_fields` 
configuration setting
* Add support for adding additional labels to docker containers using the `CLEARML_AGENT_EXTRA_DOCKER_LABELS` environment variable
* Add support for setting file mode in files applied by the agent (using the `files` configuration option) using the 
`mode` property
* Add support for skipping agent pip upgrade in the default k8s pod container bash script using the `CLEARML_AGENT_NO_UPDATE` environment variable
* Add support for additional pip install flags when installing dependencies using the `CLEARML_EXTRA_PIP_INSTALL_FLAGS` 
environment variable and `agent.package_manager.extra_pip_install_flags` configuration option
* Add support for extra docker arguments referencing machines environment variables using the `agent.docker_allow_host_environ` 
configuration option, allowing users to use `$ENV` in the task docker arguments (e.g. `-e HOST_NAME=$HOST_NAME`)
* Add support for k8s jobs execution (as opposed to only pods)
* Update default docker image versions
* Add Python 3.11 support

**Bug Fixes**
* Fix `git+ssh://` links inside installed packages not being properly converted to authenticated `https://` and vice versa
* Fix pip version required in the "Installed Packages" is now preserved and reinstalled
* Fix various agent paths not loaded correctly if an empty string or null is used (should be disabled, not converted to `.`)
* Fix docker container backwards compatibility for `API<2.13`
* Fix default docker match rules resolver (used incorrect field `"container" instead of "image")
* Fix task docker argument might be passed twice (might cause an error with flags such as `--network` and `--ipc`)
