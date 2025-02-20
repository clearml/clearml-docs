---
title: Version 1.0
---

### ClearML Agent 1.0.0

**Features**

* Add conda and pip environment debug prints (using `--debug`)
* Add support for PyJWT v2
* Change the default conda channel order, so it pulls the correct `pytorch` package
* Improve k8s glue support
  * Support k8s glue container env vars merging
  * Add number of pods limit to k8s glue using the `max_pods_limit` argument (use `--max-pods` switch in the k8s glue example)
  * Add k8s glue default `restartPolicy=Never` to template to prevent pods from restarting
* Add `--stop` switch support for dynamic gpus
* Verify `docker` command exists when running in docker mode
* Add support for terminating dockers on `sig_term` in dynamic mode
* Add stopping message on Task process termination
* Add `agent.docker_install_opencv_libs` configuration option to enable automatic opencv libs install for faster docker spin-up (default: `true`, see [here](https://github.com/clearml/clearml-agent/blob/4f18bb7ea0600db6ee63ecb5ad0ea8d048a272ca/docs/clearml.conf#L139))
* Add support for new container base setup script feature
* Bump virtualenv dependency version (support `v>=16,<21`)
* Add support for dynamic gpus opportunistic scheduling (with min/max gpus per queue)
* Deprecate `venv_update` in configuration (replaced by the more robust `venvs_cache`)
* Add Python 3.9 to the support table

**Bug Fixes**

* Fix agent can return non-zero error code and pods will end up restarting forever ([clearml-agent GitHub Issue 56](https://github.com/clearml/clearml-agent/issues/56))
* Fix poetry support ([clearml-agent GitHub Issue 57](https://github.com/clearml/clearml-agent/issues/57))
* Fix cuda version from driver does not return minor version
* Fix requirements local path replace back when using cache
* Fix k8s glue
  * Fix broken k8s glue docker args parsing
  * Fix empty env prevents override when merging template
* Fix venv cache crash on bad symbolic links
* Fix no docker arguments provided
