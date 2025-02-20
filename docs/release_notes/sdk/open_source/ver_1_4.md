---
title: Version 1.4
---

### ClearML 1.4.1 

**Bug Fix**
* Fix Process Pool hangs at exit ([ClearML GitHub issue #674](https://github.com/clearml/clearml/issues/674))

### ClearML 1.4.0

**New Features**
* Add OpenMMLab example ([ClearML GitHub issue #654](https://github.com/clearml/clearml/issues/654))
* Add support for saving artifacts with different formats ([ClearML GitHub issue #634](https://github.com/clearml/clearml/issues/634))
* Add support for setting reported values for `NaN` and `Inf` ([ClearML GitHub issue #604](https://github.com/clearml/clearml/issues/604))
* Support more than 500 results in `Task.get_tasks()` using the `fetch_only_first_page` argument ([ClearML GitHub issue #612](https://github.com/clearml/clearml/issues/612))
* Support links in `clearml-data` ([ClearML GitHub issue #585](https://github.com/clearml/clearml/issues/585))
* Support deferred task initialization using `Task.init()` argument `deferred_init` (beta feature)
* Support resuming experiments when importing an Offline session
* Add `--import-offline-session` command line option to `clearml-task`
* Support automatically logging Tensorboard Hparams
* Add wildcard support for model auto-logging, see [`Task.init()`](../../../references/sdk/task.md#taskinit)
* Add support for Lightning CLI
* Support None values in `Task.connect()`
* Add `Model.project` getter/setter
* Add support for Task progress indication
* Datasets
    * Improve Dataset version table
    * Add warning to Dataset creation on current Task
* Examples and documentation
    * Add manual seaborn logging example ([ClearML GitHub PR #628](https://github.com/clearml/clearml/pull/628))
    * Change package author
    * Change pipeline example to run locally ([ClearML GitHub PR #642](https://github.com/clearml/clearml/pull/642))
    * Update PyTorch Lightning example for `pytorch-lightning>=v1.6.0` ([ClearML GitHub PR #650](https://github.com/clearml/clearml/pull/650))

**Bug Fixes**
* Fix Keras model config serialization in `PatchKerasModelIO` ([ClearML GitHub issue #614](https://github.com/clearml/clearml/issues/614))
* Fix `task.get_parameters_as_dict(cast=True)` casts `False` to `True` ([ClearML GitHub PR #622](https://github.com/clearml/clearml/pull/622))
* Fix Fire integration is not compatible with typing library ([ClearML GitHub issue #610](https://github.com/clearml/clearml/issues/610))
* Fix remote execution with `argparse` mutually exclusive groups raises "required" error even when no argument is required
* Fix Hydra tasks never fail and are only set to completed (fix handling return code)
* Fix `clearml-data` wildcard support
* Fix HPO randomly aborts running tasks before the time limit
* Fix matplotlib capture
* Fix issue with accessing images in projects containing `/`
* AutoScaler
    * Fix resource name with a prefix matching a resource type may cause the auto-scaler to avoid spinning down idle instances
    * Fix Idle workers should contain resource name and not instance type
* Fix backwards compatibility issue when using `abstractmethod`
* Matplotlib
    * Fix uploading 3D plots with matplotlib plt shows 2D plot on task results page 
    * Fix wrong Histogram plotting using when matplotlib
* Fix PyTorch `ScriptModule` autobind
* Fix PyTorch auto-magic logging TorchScript models
* Fix forked process will not call `_at_exit` and flush all outstanding reports
* Fix matplotlib to plotly conversion fails on subplots (convert as image if figure has subplots)
* Fix Windows sub process might end up waiting forever for uploads to finish if subprocess is very shot lived
* Fix `StorageManager.get_local_copy()` returning None for a valid path in Windows
* Fix Jupyter notebook cannot be detected
* Fix PipelineController does not change node Task name, only pipeline step name
* Fix `Task.query_tasks()` specifying page size or page number
