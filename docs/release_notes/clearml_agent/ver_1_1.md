---
title: Version 1.1
---

### ClearML Agent 1.1.2

**Bug Fix**

- Fix the `six` conflict with the new `pathlib2` version 2.3.7 and up.

### ClearML Agent 1.1.1

**Features and Bug Fixes**

- Add support for truncating task log file after reporting to server using `agent.truncate_task_output_files` configuration setting
- Fix PyJWT resiliency support
- Fix `--stop` checking default queue tag ([ClearML Agent GitHub issue #80](https://github.com/clearml/clearml-agent/issues/80))
- Fix queue tag `default` does not exist and `--queue` not specified (try queue named `"default"`)
- Fix Python 3.5 compatibility
- Fix PY2.7 support for PyTorch

### ClearML Agent 1.1.0

:::info Breaking Changes
ClearML Agent will no longer try to use the demo server by default (change this by setting the `CLEARML_NO_DEFAULT_SERVER=0` environment variable)

ClearML k8s glue default pod label was changed to `CLEARML=agent` (instead of `TRAINS=agent`)
:::

  
**Features**

- Add poetry cache into docker mapping ([ClearML Agent GitHub issue #74](https://github.com/clearml/clearml-agent/issues/74))
- Allow rewriting SSH URLs (see [here](https://github.com/clearml/clearml-agent/commit/9456e493ac6d6495310ee084db906f9cdca8218c)), refers to [ClearML Agent GitHub PR #72](https://github.com/clearml/clearml-agent/pull/72) ([ClearML Agent GitHub issue #42](https://github.com/clearml/clearml-agent/issues/42))
- Add docker environment arguments log masking support, customizable using the `agent.hide_docker_command_env_vars` configuration value (see [here](https://github.com/clearml/clearml-agent/blob/db57441c5dda43d8e38f01d7f52f047913e95ba5/docs/clearml.conf#L172)) ([ClearML Agent GitHub issue #67](https://github.com/clearml/clearml-agent/issues/67))
- Add support for naming docker containers using the `agent.docker_container_name_format` configuration option to set a name format (disabled by default) ([ClearML issue #412](https://github.com/clearml/clearml/issues/412))
- k8s glue
  - Remove queue name from pod name, add queue name and ID to pod labels ([ClearML Agent GitHub issue #64](https://github.com/clearml/clearml-agent/issues/64))
  - Update task `status_message` for non-responsive or hanging pods
  - Support the `agent.docker_force_pull` configuration option for scheduled pods
  - Add docker example for running the k8s glue as a pod in a k8s cluster
- Add `agent.ignore_requested_python_version` configuration option to ignore any requested Python version (default false, see [here](https://github.com/clearml/clearml-agent/blob/db57441c5dda43d8e38f01d7f52f047913e95ba5/docs/clearml.conf#L45))
- Add `agent.docker_internal_mounts` configuration option to control containers internal mounts (non-root containers, see [here](https://github.com/clearml/clearml-agent/blob/db57441c5dda43d8e38f01d7f52f047913e95ba5/docs/clearml.conf#L184))
- Add support for `-r requirements.txt` in the Installed Packages section
- Add support for `CLEARML_AGENT_INITIAL_CONNECT_RETRY_OVERRIDE` environment variable to override initial server connection behavior (defaults to true, allows boolean value or an explicit number specifying the number of connect retries)
- Add support for `CLEARML_AGENT_DISABLE_SSH_MOUNT` environment variable allowing to disable the auto `.ssh` mount into the docker
- Add support for `CLEARML_AGENT_SKIP_PIP_VENV_INSTALL` environment variable to skip Python virtual env installation on execute and allow providing a custom venv binary
- Add support for `CLEARML_AGENT_VENV_CACHE_PATH` environment variable to allow overriding venv cache folder configuration
- Add support for `CLEARML_AGENT_EXTRA_DOCKER_ARGS` environment variable to allow overriding extra docker args configuration
- Add support for environment variables containing bash-style string lists using shlex
- Add printout when using ClearML key/secret from environment variables
- Increase worker keep-alive timeout to 10 minutes instead of 1 minute
- Update documentation

**Bug Fixes**

- Fix auto mount `SSH_AUTH_SOCK` into docker ([ClearML Agent GitHub issue #45](https://github.com/clearml/clearml-agent/issues/45))
- Fix package manager configuration documentation ([ClearML Agent GitHub issue #78](https://github.com/clearml/clearml-agent/issues/78))
- Fix support for spaces in docker arguments ([ClearML GitHub issue #358](https://github.com/clearml/clearml/issues/358))
- Fix standalone script with pre-exiting conda venv
- Fix PyYAML v5.4, v5.4.1 versions not supported
- Fix parsing VCS links starting with `git+git@` (notice `git+git://` was already supported)
- Fix Python package with `git+git://` links or `git+ssh://` conversion
- Fix `--services-mode` if the execute agent fails when starting to run with error code 0
- Fix `--stop` with dynamic gpus
- Fix support for unicode standalone scripts, changing default `ascii` encoding to `UTF-8`
- Fix venv cache cannot reinstall package from git with http credentials
- Fix `PYTHONIOENCODING` environment variable is overwritten when already defined
- k8s glue
  - Fix support for multiple k8s glue instances with pod limits
  - Fix task container handling fails parsing docker image
  - Fix task container is not set when using default image/arguments
  - Fix task container image arguments are used when no image is specified
  - Fix task container arguments not supported in when template is not provided
  - Fix `agent.extra_docker_bash_script` not applied correctly
  - Fix task runtime properties are removed when re-enqueuing task
  - Fix error is not thrown when failing to push task to queue
