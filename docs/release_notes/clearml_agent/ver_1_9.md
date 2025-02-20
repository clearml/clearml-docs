---
title: Version 1.9
---

### ClearML Agent 1.9.3

**New Features**
* Add support for `uv` as package manager ([ClearML Agent GitHub issue #214](https://github.com/clearml/clearml-agent/issues/214))
* Add `agent.docker_args_filters` to enforce filter whitelist on docker arguments allowing only 
those matching these filters to be used when running containers
* Add support for Python 3.13
* Remove Python 3.5 support
* Add `win32file` on Windows (`pywin32` dependency)
* Scan more Python 3 versions
* Support ignoring `kubectl` errors
* Support creating queue with tags

**Bug Fixes**
* Fix managed Python environment inside container (PEP 668)
* Fix default value handling in `merge_dicts()` utility function
* Fix Python 3.6 compatibility (no `:=` operator)

### ClearML Agent 1.9.2

**New Features and Bug Fixes**
* Handle OSError when checking for `is_file` ([ClearML GitHub issue #1337](https://github.com/clearml/clearml/issues/1337))
* Add support for pip legacy resolver for versions specified using the `agent.package_manager.pip_legacy_resolver` configuration option
* Add skip existing packages
* Fix report index not advancing in resource monitoring causes more than one GPU not to be reported
* Fix use `req_token_expiration_sec` and not the default value when creating a task session
* Fix reload method is found in the config object causing periodic agent error printouts

### ClearML Agent 1.9.1

**New Feature**
* Add default pip version support for Python 3.12

### ClearML Agent 1.9.0

**New Features and Improvements**
* Add `NO_DOCKER` flag to `clearml-agent-services` entrypoint ([ClearML Agent GitHub PR #206](https://github.com/clearml/clearml-agent/pull/206))
* Use `venv` module if `virtualenv` is not supported
* Find the correct Python version when using a pre-installed python environment
* Add `/bin/bash` support in the task's `script.binary` property
* Add support for `.ipynb` script entry files (install nbconvert in runtime, convert file to python and execute the 
python script). Includes `CLEARML_AGENT_FORCE_TASK_INIT` patching of `.ipynb` files (post-python conversion)
* Add `CLEARML_MULTI_NODE_SINGLE_TASK` (values -1, 0, 1, 2) for easier multi-node single Task workloads
* Add default docker `agent.default_docker.match_rules` configuration option (note: `matching_rules` are ignored if `--docker container` is passed in command line)
* Add `-m module args` in script entry now supports standalone script. Standalone script is placed in a file specified 
by the `working_dir` setting in the `<dir>:<target_file>` format (e.g. `:standalone.py`), or in `untitled.py` if not specified
* Add `K8S_GLUE_POD_USE_IMAGE_ENTRYPOINT` env var to allow running k8s pods without overriding the image entrypoint 
(useful for agents using prebuilt images in k8s)
* Add venv cache mount override for non-root containers (use: `agent.docker_internal_mounts.venvs_cache`)
* Add `/bin/bash -c "command"` support. Task binary should be set to `/bin/bash` and `entry_point` should be set to `-c command`
* Add support for tasks containing only bash script or python module command
* Add support for skipping container apt installs using `CLEARML_AGENT_SKIP_CONTAINER_APT` env var in k8s

**Bug Fixes**
* Fix git fetch did not update new tags ([ClearML Agent GitHub issue #209](https://github.com/clearml/clearml-agent/issues/209))
* Fix file mode should be optional in configuration `files` section
* Fix `-m module $env` to support parsing `$env` before launching
* Fix setting tasks that were just marked as `aborted` to `started` - only force task to `started` after dequeueing it, 
otherwise do nothing
* Fix slurm multi-node rank detection
* Fix passing only `--docker` (i.e. no default container image) when using `--dynamic-gpus` feature
* Fix logger object used even if `None`
* Fix a race condition where in rare conditions popping a task from a queue that was aborted did not set it to `started` 
before the watchdog killed it (not applicable in k8s/slurm)
* Fix multi-node support to only send `pip freeze` update, only set task as `started`, and only update task status on exit for RANK 0
* Fix do not cache venv cache if venv/python skip env var was set
* Fix use same state transition in k8s if supported by the server (instead of stopping the task before re-enqueue)
* Fix failed Task in services mode logged as `User aborted` instead of `failed`. Add Task state reason string
* Fix remove task from pending queue and set to `failed` in k8s when applying the pod template fails
