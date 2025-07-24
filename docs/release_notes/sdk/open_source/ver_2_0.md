---
title: Version 2.0
---

### ClearML 2.0.2

**New Features and Bug Fixes**
* Add `py.typed` to support PEP 561 type checking ([#1411](https://github.com/clearml/clearml/pull/1411))
* Handle unsafe links inside `safe_extract()`
* Update task models list when reloading a model
* Add static routes support

### ClearML 2.0.1

**New Features and Improvements**
* Add support for grouping pipeline steps by stage
* Add warning when calling `Task.force_requirements_env_freeze()` / `Task.force_store_standalone_script()` after `Task.init()` ([#1425](https://github.com/clearml/clearml/issues/1425))

**Bug Fixes**
* Fix access to default output destination when project can't be loaded. Add warning message but do not fail
* Fix inaccessible or unavailable project causes task startup to fail. Add warning

### ClearML 2.0.0

**New Features**
* Clean up exception handling in `cleanup_service.py` ([#1386](https://github.com/clearml/clearml/pull/1386)) 
* Add support for `clearml-task` command line options `--force-no-requirements`,` --skip-repo-detection`, and `--skip-python-env-install`
* Allow calling the same pipeline step multiple times with inputs that originate from tasks/controller
* Add` Task.upload_artifact()` argument` sort_keys` to allow disabling sorting yaml/json keys when uploading artifacts
* Add Python annotations to all methods
* Update `pyjwt` constraint version

**Bug Fixes**
* Fix local file uploads without scheme ([#1313](https://github.com/clearml/clearml/pull/1313))
* Fix argument order mismatch in `PipelineController` ([#1406](https://github.com/clearml/clearml/pull/1406))
* Fix `_logger` property might be `None` in Session ([#1412](https://github.com/clearml/clearml/pull/1412))
* Fix unhandled `None` value in project IDs when listing all datasets ([#1413](https://github.com/clearml/clearml/pull/1413))
* Fix typo in config exception string ([#1418](https://github.com/clearml/clearml/pull/1418))
* Fix experiments are created twice during HPO ([#644](https://github.com/clearml/clearml/issues/644))
* Fix `clearml-task-run` HPO breaks up ([#1151](https://github.com/clearml/clearml/issues/1151))
* Fix oversized event reports cause subsequent events to be lost ([#1316](https://github.com/clearml/clearml/issues/1316))
* Fix downloading datasets with multiple parents might not work ([#1398](https://github.com/clearml/clearml/issues/1398))
* Fix GPU reporting fails to detect GPU when the `NVIDIA_VISIBLE_DEVICES` env var contains a directory reference
* Fix verify configuration option for S3 storage (boto3) is not used when testing buckets
* Fix `PipelineDecorator.component()` ignores `*args` and crashes with `**kwargs`
* Fix Pipelines run via `clearml-task` do not appear in the UI
* Fix task log URL print for API v2.31 should show `"/tasks/{}/output/log"`
* Fix tqdm upload/download reporting, remove warning
* Fix pipeline from CLI with no args fails
* Fix pillow constraint for `Python<=3.7`
* Fix requests constraint for `Python<3.8`