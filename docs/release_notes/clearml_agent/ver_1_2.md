---
title: Version 1.2
---

### ClearML Agent 1.2.3

**Bug Fixes**

- Fix PYTHONPATH is overwritten when executing a task (append to it instead)
- Fix pytorch package is reinstalled when the same version is already installed
- Fix copying configuration sets an empty worker name
- Protect dynamic GPUs from failing to parse worker GPU index

### ClearML Agent 1.2.2

**Bug Fixes**

- Fix `CLEARML_AGENT_SKIP_PIP_VENV_INSTALL` fails to find Python executable
- Fix `apt-get update` failure causes `apt-get install` not to be executed

### ClearML Agent 1.2.1

**New Features and Improvements**

- Update S3 bucket verify option for minio ([ClearML Agent GitHub PR #83](https://github.com/clearml/clearml-agent/pull/83))
- Add environment variable for request method ([ClearML Agent GitHub PR #91](https://github.com/clearml/clearml-agent/pull/91))
- Add additional k8s-glue dockerfiles ([ClearML Agent GitHub PR #94](https://github.com/clearml/clearml-agent/pull/94) )
- Update default docker image to `nvidia/cuda:10.2-cudnn7-runtime-ubuntu18.04`
- Add support for custom docker image resolving using the `agent.default_docker.match_rules` configuration setting (see [here](https://github.com/clearml/clearml-agent/blob/8712c5e636d9a02e939a9759348d29521a3939a9/docs/clearml.conf#L169))
- Add `agent.force_git_root_python_path` configuration setting to force adding the git repository root folder to the `PYTHONPATH` (if set working directory is not added to the `PYHTONPATH`)
- Add `build --force-docker` command line argument to the to allow ignoring task container data
- Add `agent.poetry_version` configuration setting to specify poetry version (and force installation of poetry if missing, see [here](https://github.com/clearml/clearml-agent/blob/8712c5e636d9a02e939a9759348d29521a3939a9/docs/clearml.conf#L65))
- Add custom build script support
- Add extra configurations when starting daemon
- Add `agent.package_manager.force_original_requirements` configuration option, allowing to only use original requirements produced by local execution (note that using this configuration option prevents editing installed packages using the UI)
- Add support for the `CLEARML_AGENT_PROPAGATE_EXITCODE` environment variable. Set this variable to `1` to allow ClearML Agent to return a nonzero exit code on failure
- Update `clearml-agent init` (use `app.clear.ml` as default server, add git token references)

**Bug Fixes**

- Fix virtualenv Python interpreter used ([ClearML Agent GitHub PR #98](https://github.com/clearml/clearml-agent/pull/98))
- Fix typing package incorrectly required for Python>3.5 ([ClearML Agent GitHub PR #103](https://github.com/clearml/clearml-agent/pull/103))
- Fix symbolic links not copied from cached VCS into working copy (windows platform will result with default copy content instead of original symbolic link) ([ClearML Agent GitHub PR #89](https://github.com/clearml/clearml-agent/pull/89))
- Fix agent fails to check out code from main branch when branch/commit is not explicitly specified ([ClearML GitHub issue #551](https://github.com/clearml/clearml/issues/551))
- Fix `git+git://` requirements
- Fix `default_python` calculation (and verbosity)
- Fix using deprecated `abc` support (Python 3.10 compatibility)
- Fix no default value for `CLEARML_API_DEFAULT_REQ_METHOD` causes `ValueError` if not specified
- Fix `agent.hide_docker_command_env_vars` mode to include URL passwords and handle environment vars containing docker commands
- Fix conda package manager listed packages with local links (`@ file://`) should ignore the local package if it does not exist
- Fix cuda patch version support in conda
- Fix agent attempts to check out code when in standalone mode
- Fix `FORCE_LOCAL_CLEARML_AGENT_WHEEL` environment variable handling when running from a Windows host
- Fix user-provided `"` is unnecessarily replaced to `\\"`
- Fix token is not propagated to docker in case credentials are not available
- Fix PyTorch aarch64 and windows support
- Fix VCS packages are reinstalled when the same commit version is already installed
- Fix git packages are installed even if commit is given and is preinstalled when using cached virtual environment

