---
title: Version 3.0
---

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