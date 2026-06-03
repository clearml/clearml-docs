---
title: Version 3.0
---

### ClearML Agent 3.0.3

**New Features and Bug Fixes**

* Fix MD5 hashing compatibility with FIPS-enabled systems on Python 3.6+
* Add `agent.package_manager.uv_run_extra_args` configuration option to pass extra arguments to `uv run` (mirrors `uv_sync_extra_args`)
* Add `agent.git_fetch_args` configuration option to pass extra arguments to `git fetch` when refreshing cached repositories
* Add `agent.docker_apply_environment_from_vault` configuration option to inject task owner's vault environment variables 
  as `docker -e args` when running in `host/docker` mode
* Consolidate `k8s-glue` Dockerfiles into a single multi-provider build (`glue-build`)

### ClearML Agent 3.0.2
**New Features and Bug Fixes**

* Fix `setuptools`'s `pkg_resources` deprecation affects Python 3.9 and up
* Add support for forbidden docker args configuration using the `agent.forbidden_docker_args` setting to prevent user 
  configuration from interfering with task startup process
* Add k8s glue support for delayed pod cleanup (for debugging purposes)

### ClearML Agent 3.0.1

**New Features**
* Add daemon `--check-bootstrap` option (with `agent.bootstrap.check_for_latest` configuration option)

### ClearML Agent 3.0.0

**New Features and Bug Fixes**
* New `clearml-agent-bootstrap` package: when enabled, agent pre-packages compiled Python and Git binaries on 
  the host and mounts them directly into containers at launch, reducing boot time
* Add `agent.package_manager.uv_sync_locked_if_lock_file` configuration option (default `True`) to allow removing 
  `uv sync` --locked flag even when lockfile exists in repository
* Add `unsafe-best-match` to bootstrap `uv` when used as pip drop-in replacement - necessary when resolving some packages
* Autodetect ROCM version for torch installs
* Remove deprecated conda `--mkdir` command line option
* Kubernetes glue
  * Support pod auto-eviction for invalid image name errors (as well as on image pull backoff)
  * Add support for better task cleanup and support re-enqueueing tasks whose launch failed
  * Add support for additional mappings in custom template
  * Propagate task data when resolving pod template
  * Fix fractions calculation
* Add support for an allowed mapped ports range when spinning up a Docker workload
* Add `--podman` daemon command line option adding support for launching docker containers with podman
* Fix requirements should be taken from task, if provided
* Fix agent might not mount AMD GPUs properly into Docker container
* Fix URL matching