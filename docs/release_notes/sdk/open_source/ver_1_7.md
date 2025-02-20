---
title: Version 1.7
---

### ClearML 1.7.2
**New Features and Improvements**
* Support running Jupyter Notebook inside a git repository (repository will be referenced without uncommitted changes 
  and Jupyter Notebook will be stored on plain code as uncommitted changes)
* Add Jupyter Notebook fail warning
* Allow pipeline steps to return string paths without them being treated as a folder artifact and zipped ([ClearML GitHub issue #780](https://github.com/clearml/clearml/issues/780))
* Remove `future` from Python 3 requirements

**Bug Fixes**
* Fix exception raised when using `ThreadPool` ([ClearML GitHub issue #790](https://github.com/clearml/clearml/issues/790))
* Fix Pyplot/Matplotlib binding reports incorrect line labels and colors ([ClearML GitHub issue #791](https://github.com/clearml/clearml/issues/791))
* Pipelines
    * Fix crash when running cloned pipeline that invokes a step twice ([ClearML GitHub issue #769](https://github.com/clearml/clearml/issues/769))
    * Fix pipeline argument becomes `None` if default value is not set
    * Fix `retry_on_failure` callback does nothing when specified on `PipelineController.add_step()`
    * Fix pipeline clone logic
* Jupyter Notebook
    * Fix support for multiple Jupyter servers running on the same machine
    * Fix issue with old/new notebook packages installed
* Fix local cache with access rules disabling partial local access
* Fix `Task.upload_artifact()` fails uploading pandas `DataFrame`
* Fix relative paths in examples ([ClearML GitHub PR #787](https://github.com/clearml/clearml/issues/787)

### ClearML 1.7.1

**New Feature**
* Add callback option for pipeline step retry

**Bug Fixes**
* Fix Python Fire binding
* Fix Dataset failing to load helper packages should not crash
* Fix `Dataset.get_local_copy()` is allowed for a non-finalized dataset
* Fix `Task.upload_artifact()` does not upload empty lists/tuples
* Fix pipeline retry mechanism interface
* Fix `Python <3.5` compatibility
* Fix local cache warning (should be a debug message)

### ClearML 1.7.0

**New Features and Improvements**
* ClearML Data: Support providing list of links
* Upload artifacts with a custom serializer ([ClearML GitHub issue #689](https://github.com/clearml/clearml/issues/689))
* Allow user to specify extension when using custom serializer functions (for artifacts)
* Skip server URL verification in `clearml-init` wizard process
* When calling `Dataset.get()` without "alias" field, tell user that he can use alias to log it in the UI
* Add support for mmcv for logging models
* Add support for Azure and GCP storage in `task.setup_upload()`
* Support pipeline retrying tasks which are failing on suspected non-stable failures
* Better storage (AWS, GCP) internal load balancing and configurations
* Add `Task.register_abort_callback`

**Bug Fixes**
* Allow getting datasets with non-semantic versioning ([ClearML GitHub issue #776](https://github.com/clearml/clearml/issues/776))
* Fix interactive plots (instead of a generated png)
* Fix Python 2.7 support
* Fix clearml datasets `list` functionality
* Fix `Dataset.init` to not modify task (to `Dataset.create`)
* Fix failure with large files upload on HTTPS
* Fix 3d plots with plt shows 2d plot on task results page
* Fix uploading files with project's `default_upload_destination` ([ClearML GitHub issue #734](https://github.com/clearml/clearml/issues/734))
* Fix broken Matplotlib reporting - using logarithmic scale breaks reporting
* Fix wildcard support in `clearml-data` CLI
* Fix `report_histogram` - does not show "horizontal" orientation ([ClearML GitHub issue 699](https://github.com/clearml/clearml/issues/699))
* Fix table reporting - when using `logger.report_table(title, series, iteration, etc)`, the `series` arg does not appear in UI ([ClearML GitHub issue 684](https://github.com/clearml/clearml/issues/684))
* Fix artifacts (and models) use task's original name and not new name
* Fix very long filenames from S3 can't be downloaded (with `get_local_copy()`)
* Fix overwrite of existing output models on pipeline task with `monitor_models` ([ClearML GitHub issue #757](https://github.com/clearml/clearml/issues/757))