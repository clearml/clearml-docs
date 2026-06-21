---
title: Version 2.1
---

### ClearML 2.1.9

**Bug fixes and Improvements**

* Add method to create a Hyper-Dataset version snapshot
* Implement static route validator `RouterService` class
* Fix syntax-related error in the `Dataset.get()` ([#1648](https://github.com/clearml/clearml/pull/1648))
* Improvements in formatting via f-strings instead of `.format`

### ClearML 2.1.8

**New Features Improvements**
* HyperDatasets
  * Add ability to publish a HyperDataset via single method call
  * Add HyperDataset tagging 
* Datasets
  * Add path traversal check in `Dataset._merge_datasets`
  * Add `status` attribute in `Dataset.list_datasets` dataset return values
* Add support for `DefaultAzureCredential`

**Bug Fix**
* Fix issue that users restricted to a project cannot create Dataviews

### ClearML 2.1.7

**Bug fixes and Improvements**
* Add optional (opt-out) parameter to prevent processing of pickled artifacts ([#1619](https://github.com/clearml/clearml/pull/1619), 
  [#1621](https://github.com/clearml/clearml/pull/1621)):
  * Use `task.artifacts[0].get(block_unsafe_artifacts=True)`, or
  * Via configuration with the environment variable `CLEARML_BLOCK_PICKLED_ARTIFACTS=1`
  * Via `sdk.storage.block_pickled_artifacts: true`
* Prevent resource leak during interrupted queries in `GPUStatCollection._new_query_nvidia` ([#1617](https://github.com/clearml/clearml/pull/1617))
* Add vulnerability check in `Task.import_offline_session` when extracting `.zip` archives to prevent path-traversal attacks ([#1620](https://github.com/clearml/clearml/pull/1620))

### ClearML 2.1.6

**Bug Fixes and Improvements**

* Add default shell binary option for script execution ([#1586](https://github.com/clearml/clearml/pull/1586))
* Add option to set plots upload destination ([#1587](https://github.com/clearml/clearml/pull/1587))
* Add `exc_info` param to improve error logging ([#1550](https://github.com/clearml/clearml/issues/1550))
* Raise duplicate `InputModel` import log from debug to info ([#1582](https://github.com/clearml/clearml/pull/1582))
* Add pickle file integrity hash verification for `pd.DataFrame` pickled artifacts ([#1599](https://github.com/clearml/clearml/pull/1599))
* Add check to avoid `KeyError` in dataset ([#1598](https://github.com/clearml/clearml/pull/1598))
* Routing fixes when using queues on autoscaler instances ([#1602](https://github.com/clearml/clearml/pull/1602))
* Refactor `clearml/storage`
* Add hash comparison for external link change detection, subset file pulling in `Dataset.get_local_copy()`, and stale 
  link entry pruning in `Dataset.sync_folder` ([#1611](https://github.com/clearml/clearml/pull/1611))

### ClearML 2.1.5

**Bug fixes and improvements**
* Add task method to remove tags
* Fix `_SaveFramesRequestNoValidate` in offline mode ([#1517](https://github.com/clearml/clearml/issues/1517))

### ClearML 2.1.4
**New Features and Bug Fixes**
* Fix syntax error on Python 3.14 ([#1521](https://github.com/clearml/clearml/pull/1521))
* Add support for boto3 S3 specific configuration ([#1516](https://github.com/clearml/clearml/pull/1516))
* Add option to close squashed dataset ([#1513](https://github.com/clearml/clearml/pull/1513))
* Move `None` check earlier in `CacheContext.get_local_copy` ([#1570](https://github.com/clearml/clearml/pull/1570))
* Update to `examples/hyperdatasets/finetune_qa_lora.py` 
* Fix race condition with not using incremental logging config 
* Validate queue visibility in job scheduler
* Use UTC everywhere in `clearml/automation/scheduler.py` 
* Implement improvement in `is_within_directory`

### ClearML 2.1.3

**New Features and Bug Fixes**
* Fix GPU reporting for `NVIDIA_VISIBLE_DEVICES=void`
* Fix default example parameters for `sklearn joblib`
* Add support for ClearML App Gateway static routes in Gradio binding

### ClearML 2.1.2

**Bug Fix**

* Fix broken ArgParser integration with `SUPPRESS`

### ClearML 2.1.1

**New Features and Bug Fixes**
* Fix space is missing from the safe characters list when quoting downloaded file names
* Add support for `sdk.storage.http.legacy_fileservers` to allow downloading data from legacy fileservers
* Add Python 3.14 support

### ClearML 2.1.0

**New Features**
* Add Hyper-Datasets support (Enterprise server required)
* Update `datetime` usage ([#1491](https://github.com/clearml/clearml/pull/1491))
* Remove support for Python 3.5 and lower in required packages
* Add support for multiple ports/endpoints in `Task.request_external_endpoint()` and router (Enterprise server required)
* Improve GPU reporting on ARM GPUs
* Add model fine-tuning and model embedding examples ([#1483](https://github.com/clearml/clearml/pull/1483))

**Bug Fixes**
* Fix `Task.init()` fails for tags with tuple type ([#1468](https://github.com/clearml/clearml/pull/1468))
* Make sure git diffs are always valid inputs for `git apply` ([#1479](https://github.com/clearml/clearml/pull/1479))
* Fix duplicate files in dataset uploads ([#1463](https://github.com/clearml/clearml/pull/1479))
* Fix transient error in machine stats should not break reporting