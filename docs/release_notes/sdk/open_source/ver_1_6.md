---
title: Version 1.6
---

### ClearML 1.6.4

**Bug Fix**
* Fix `APIClient` fails when calling `get_all` endpoints with API 2.20 (affects CLI tools such as `clearml-session`)

### ClearML 1.6.3

**New Features and Improvements**
* Add option to specify an endpoint URL when creating S3 resource service ([ClearML GitHub issue #673](https://github.com/allegroai/clearml/issues/673))
* Add support for providing `ExtraArgs` to boto3 when uploading files using the `sdk.aws.s3.extra_args` configuration option
* Add support for Server API 2.20
* Add `Task.get_num_enqueued_tasks()` to get the number of tasks enqueued in a specific queue
* Add support for updating model metadata using `Model.set_metadata()`, `Model.get_metadata()`, `Model.get_all_metadata()`, 
  `Model.get_all_metadata_casted()`, and `Model.set_all_metadata()`
* Add `Task.get_reported_single_value()`
* Add a retry mechanism for models and artifacts upload
* Pipelines with empty configuration takes it from code
* Add support for running pipeline steps on preemptible instances
* Datasets
  * Add description to Datasets
  * Add wild-card support in `clearml-data`

**Bug Fixes**
* Fix dataset download ([ClearML GitHub issue #713](https://github.com/allegroai/clearml/issues/713))
* Fix lock is not released after dataset cache is downloaded ([ClearML GitHub issue #671](https://github.com/allegroai/clearml/issues/671))
* Fix deadlock might occur when using process pool large number processes ([ClearML GitHub issue #674](https://github.com/allegroai/clearml/issues/674))
* Fix 'series' not appearing on UI when using `logger.report_table()` ([ClearML GitHub issue #684](https://github.com/allegroai/clearml/issues/684))
* Fix `Task.init()` docstring to include behavior when executing remotely ([ClearML GitHub PR #737](https://github.com/allegroai/clearml/pull/737))
* Fix `KeyError` when running remotely and no params were passed to click ([ClearML Agent GitHub issue #111](https://github.com/allegroai/clearml-agent/issues/111))
* Fix full path is stored when uploading a single artifact file
* Fix passing non-alphanumeric filename in `sdk.development.detect_with_pip_freeze`
* Fix Python 3.6 and 3.10 support
* Fix mimetype cannot be `None` when uploading to S3
* Pipelines
  * Fix pipeline DAG
  * Add support for pipelines with spot instances
  * Fix pipeline proxy object is always resolved in main pipeline logic
  * Fix pipeline steps with empty configuration should try and take it from code
  * Fix wait for jobs based on local/remote pool frequency
  * Fix `UniformIntegerParameterRange.to_list()` ignores min value
  * Fix pipeline component returning a list of length 1
* Datasets
  * Fix `Dataset.get()` does not respect `auto_create`
  * Fix getting datasets fails with new ClearML Server v1.6
  * Fix datasets can't be queried by project/name alone
  * Fix adding child dataset to older parent dataset without stats
* Fix error when connecting an input model
* Fix deadlocks, including:
  * Change thread Event/Lock to a process fork safe threading objects
  * Use file lock instead of process lock to avoid future deadlocks since Python process lock is not process safe 
    (killing a process holding a lock will Not release the lock)
* Fix `StorageManager.list()` on a local Windows path
* Fix model not created in the current project
* Fix `keras_tuner_cifar` example raises DeprecationWarning and ValueError

### ClearML 1.6.2

**Bug Fix**

* Fix format string construction sometimes causing delayed evaluation errors ([ClearML GitHub issue #706](https://github.com/allegroai/clearml/issues/706))

### ClearML 1.6.1

**Bug Fixes**
* Fix `Task.get_tasks()` fails when sending `search_hidden=False`
* Fix LightGBM example shows UserWarning

### ClearML 1.6.0

**New Features and Improvements**
* New Hyperparameter Optimization CLI `clearml-param-search`
* Improvements to ClearML Data
  * Add support for a new ClearML Data UI in the ClearML WebApp
  * Add `clearml-data` new options set-description and rename
* Add random seed control using `Task.set_random_seed()` allowing to set a new random seed for task initialization or 
  to disable it
* Improve error messages when failing to download an artifact
* Improve error messages when testing for permissions

**Bug Fixes**
* Fix axis range settings when logging plots
* Fix `Task.get_project()` to return more than 500 entries ([ClearML GitHub issue #612](https://github.com/allegroai/clearml/issues/612))
* Fix pipeline progress calculation
* Fix `StorageManager.upload_folder()` returns `None` for both successful and unsuccessful uploads
* Fix script path capturing stores a relative path and not an absolute path
* Fix HTML debug samples are saved incorrectly on S3
* Fix Hydra deprecation warning in examples
* Fix missing requirement for TensorBoardX example

**Known Issues**
* When removing an image from a Dataset, its preview image won't be removed
* Moving Datasets between projects still shows the Dataset in the old project
