---
title: Version 1.8
---

### ClearML Agent 1.8.1

**New Features**
* Add option to set daemon polling interval ([ClearML Agent GitHub PR #197](https://github.com/clearml/clearml-agent/pull/197))
* Add Python 3.12 support

**Bug Fixes**
* Fix git pulling on cached invalid git entry. On error, re-clone the entire repository again (enable using `agent.vcs_cache.clone_on_pull_fail: true`)
* Fix conda env should not be cached if installing into base conda or conda existing env
* Fix cached repositories not passing user/token when pulling
* Fix when disabling vcs cache do not add vcs mount point to container

### ClearML Agent 1.8.0

**New Features**
* Add `CLEARML_AGENT_FORCE_POETRY` environment variable to allow forcing poetry even when using pip requirements manager
* Add `CLEARML_AGENT_FORCE_TASK_INIT` environment variable to allow runtime patching of script even if no repository is 
specified and the code is running a preinstalled docker
* Improve venv cache handling:
  * Add `FileLock` readonly mode, default is write mode (i.e. exclusive lock, preserving behavior)
  * Add venv cache now uses readonly lock when copying folders from venv cache into target folder. This enables multiple read, single write operation
  * Do not lock the cache folder if we do not need to delete old entries
  * Add `agent.venvs_cache.lock_timeout` to control the venv cache folder lock timeout (in seconds, default 30)
* Add protection for `truncate()` call
* Move configuration sanitization settings to the default config file
* Add queue ID report before pulling task
* Improve GPU monitoring for MIGs

**Bug Fixes**
* Use correct Python version in Poetry init ([ClearML Agent GitHub PR #179](https://github.com/clearml/clearml-agent/pull/179))
* Fix queue handling in `K8sIntegration` and `k8s_glue_example.py` ([ClearML Agent GitHub PR #183](https://github.com/clearml/clearml-agent/pull/183))
* Fix `FileNotFoundException` crash in `find_python_executable_for_version` ([ClearML Agent GitHub issue #164](https://github.com/clearml/clearml-agent/issues/164))
* Fix delete temp console pipe log files after Task execution is completed (important for long-lasting services agents to avoid collecting temp files on host machine)
* Fix `agent.enable_git_ask_pass` does not show in configuration dump
* Fix `pip` is returned as a pip version if no value exists in `agent.package_manager.pip_version`
* Fix Python 3.12 support by removing `distutil` imports
* Fix `IOError` on file lock when using shared folder
* Fix torch resolver settings applied to `PytorchRequirement` instance are not used
* Fix comment lines (starting with `#`) are not ignored in docker startup bash script
* Fix dynamic GPU sometimes misses the initial print

