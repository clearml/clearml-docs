---
title: Version 1.1
---

### ClearML 1.1.6

**Features**

- Add `Task.force_store_standalone_script()` to force storing standalone script instead of a Git repository reference ([ClearML GitHub issue #340](https://github.com/allegroai/clearml/issues/340))
- Add `Logger.set_default_debug_sample_history()` and `Logger.get_default_debug_sample_history()` to allow controlling 
  maximum debug samples programmatically
- Add populate now stores function arg types as part of the hyperparameters
- Add `status_message` argument to `Task.mark_stopped()`
- Change `HTTP` driver timeout and retry codes (connection timeout will now trigger a retry)

**Bug Fixes**

- Fix and upgrade the SlackMonitor ([ClearML GitHub issue #533](https://github.com/allegroai/clearml/issues/533))
- Fix network issues causing Task to stop on status change when no status change has occurred ([ClearML GitHub issue #535](https://github.com/allegroai/clearml/issues/535))
- Fix Pipeline controller function support for dict as input argument
- Fix uploading the same metric/variant from multiple processes in threading mode should create a unique file per process (since global counter is not passed between the subprocesses)
- Fix resource monitoring should only run in the main process when using threaded logging mode
- Fix fork patching so that the signal handler (`at_exit`) will be called on time
- Fix fork (process pool) hangs or drops reports when reports are at the end of the forked function in both threaded and subprocess mode reporting
- Fix multi-pipeline support
- Fix delete artifacts after upload
- Fix artifact preview has no truth value
- Fix storage cache cleanup does not remove all entries on a silent fail
- Fix always store session cache in `~/.clearml` (regardless of the cache folder)
- Fix `StorageManager.download_folder()` fails on Windows path

### ClearML 1.1.5

**Features**
* Add support for `jsonargpraser` ([ClearML GitHub issue #403](https://github.com/allegroai/clearml/issues/403))
* Add `HyperParameterOptimizer.get_top_experiments_details()` returns the hparams and metrics of the top performing 
  experiments of an HPO ([ClearML GitHub issue #473](https://github.com/allegroai/clearml/issues/473))
* Allow overriding initial iteration offset using environment variable (`CLEARML_SET_ITERATION_OFFSET`) or `Task.init(continue_last_task==<offset>)`
 ( [ClearML GitHub issue #496](https://github.com/allegroai/clearml/issues/496))
* Add better input handling for `clearml-init` in colab ([ClearML GitHub issue #515](https://github.com/allegroai/clearml/issues/515))
* Add environment variable for default request method ([ClearML GitHub issue #521](https://github.com/allegroai/clearml/issues/521))
* Add `LocalClearmlJob` as possible option for HPO ([ClearML GitHub issue #525](https://github.com/allegroai/clearml/issues/525))
* Add convenience functionality to `clearml-data` ([ClearML GitHub issue #526](https://github.com/allegroai/clearml/issues/526))
* Add support for `vscode-jupyter` ([microsoft/vscode-jupyter#8531](https://github.com/microsoft/vscode-jupyter/pull/8531))
* Improve detection of running reporting subprocess (including zombie state)
* Support controlling S3/Google Cloud Storage `_stream_download_pool_connections` using the `stream_connections` configuration 
  setting in `clearml.conf` (default 128)
* Add warning when losing reporting subprocess
* Add `Model.remove()` to allow removing a model from the model repository
* Add HTTP download timeout control (change default connection timeout to 30 seconds)
* Add initial setup callback to monitoring class
* Add `Task.get_reported_plots()`
* Allow `Monitor.get_query_parameters` to override defaults
* Add support for Google Cloud Storage `pool_connections` and `pool_maxsize` overrides
* Add last worker time to `AutoScaler`
* Add warning when opening an aborted Dataset
* Store multi-pipeline execution plots on the master pipeline Task
* Support pipeline return value stored on pipeline Task
* Add `PipelineDecorator.multi_instance_support`
* Add `PipelineDecorator` to `clearml` and `clearml.automation` namespaces
* Documentation and examples
  * Update docstrings ([ClearML GitHub issue #501](https://github.com/allegroai/clearml/issues/501))
  * Add Markdown in pipeline jupyter notebooks ([ClearML GitHub issue #502](https://github.com/allegroai/clearml/issues/502))
  * Update pipeline example ([ClearML GitHub issue #494](https://github.com/allegroai/clearml/issues/494))
  * Add abseil example ([ClearML GitHub issue #509](https://github.com/allegroai/clearml/issues/509))
  * Change README to dark theme ([ClearML GitHub issue #513](https://github.com/allegroai/clearml/issues/513))
  * Update XGBoost example ([ClearML GitHub issue #524](https://github.com/allegroai/clearml/issues/524))
  * Change example name ([ClearML GitHub issue #528](https://github.com/allegroai/clearml/issues/528))

**Bug Fixes**
* Fix `TriggerScheduler` on Dataset change ([ClearML GitHub issue #491](https://github.com/allegroai/clearml/issues/491))
* Fix links in Jupyter Notebooks ([ClearML GitHub issue #505](https://github.com/allegroai/clearml/issues/505))
* Fix `pandas` delta datetime conversion ([ClearML GitHub issue #510](https://github.com/allegroai/clearml/issues/510))
* Fix `matplotlib` auto-magic detect bar graph series name ([ClearML GitHub issue #518](https://github.com/allegroai/clearml/issues/518))
* Fix path limitation on storage services (posix, object storage) when storing target artifacts by limiting length of 
  project name (full path) and task name used for object path ([ClearML GitHub issue #516](https://github.com/allegroai/clearml/issues/516))
* Fix multi-processing context block catching exception
* Fix Google Cloud Storage with no default project causes a crash
* Fix main process's reporting subprocess lost, switch back to thread mode
* Fix forked `StorageHelper` should use its own `ThreadExecuter`
* Fix local `StorageHelper.delete()` raising exception on non-existent file instead of returning false
* Fix `StorageHelper` rename partial file throwing errors on multiple access
* Fix resource monitor fails on permission issues (skip over parts)
* Fix reusing Task does not reset it
* Fix support `clearml` PyCharm Plugin 1.0.2 (support partial pycharm git repo sync)
* Fix `Task.reset()` force argument ineffective
* Fix PY3.5 compatibility
* Fix validation error causes infinite loop
* Fix tasks schema prevents sending null container parts
* Fix missing `CLEARML_SET_ITERATION_OFFSET` definition
* Fix `Model.get_weights_package()` returns None on error
* Fix download progress bar based on `sdk.storage.log.report_download_chunk_size_mb` configuration
* Fix Conda lists the `CudaToolkit` version installed (for the agent to reproduce)
* Fix Jupyter kernel shutdown causing nested atexit callbacks leaving Task in running state
* Fix multi-subprocess can cause Task to hand at close
* Fix TF 2.7 support (get `logdir` on with multiple TB writers)


### ClearML 1.1.4

**Bug Fixes**

- Fix duplicate keyword argument (affects `clearml-data`, `Dataset.get()`) ([ClearML GitHub issue #490](https://github.com/allegroai/clearml/issues/490))
- Fix session raises missing host error when in offline mode ([ClearML GitHub issue #489](https://github.com/allegroai/clearml/issues/489))
- Fix `Task.get_task()` does not load `output_uri` from stored Task
- Fix `Task.get_models()['input']` returns string instead of `clearml.Model`
- Fix `tf.saved_model.load()` binding for `TensorFlow>=2.0`
- Fix hyperparams with `None` value converted to empty string causes inferred type to change to `str` in consecutive `Task.connect()` calls

### ClearML 1.1.3

**Features**

- Add support for MegEngine with examples ([ClearML GitHub issue #455](https://github.com/allegroai/clearml/issues/455))
- Add `TaskTypes` to main namespace ([ClearML GitHub issue #453](https://github.com/allegroai/clearml/issues/453))
- Add `LogUnifomParameterRange` for hyperparameter optimization with Optuna ([ClearML GitHub issue #462](https://github.com/allegroai/clearml/issues/462))
- Add joblib (equivalent to scikit) to `Task.init(auto_connect_frameworks)` argument
- Log environment variables starting with `*` in `environ_bind.py` ([ClearML GitHub issue #459](https://github.com/allegroai/clearml/issues/459))
- Pipeline
  - Add eager decorated pipeline execution
  - Support pipeline monitoring for scalars/models/artifacts
  - Add `PipelineController.upload_model()`
  - Add `PipelineController.add_step(configuration_overrides)` argument allowing to override Task configuration objects
  - Change `PipelineController.start_locally()` default `run_pipeline_steps_locally=False`
  - Add `PipelineController.stop(mark_failed, mark_aborted)` arguments
  - Add `PipelineController.run_locally` decorator
  - Add `PipelineController.continue_on_fail` property
  - Add `PipelineController.__init__(abort_on_failure)` argument
  - Add nested pipeline components missing pipeline tags
  - Add ClearmlJob state cache (refresh every second)
- Datasets
  - Add `clearml-data` multi-chunk support
  - Change `clearml-data` default chunk size to 512 MB
  - Change `Dataset.create()` now automatically reverts to using current Task if no project/name provided
- Add `Optimizer.get_top_experiments_id_metrics_pair()` for top performing experiments
- Add support for setting default value to auto connected argparse arguments
- Add `Task.get_script()` and `Task.set_script()` for getting and setting task's script properties for execution
- Add `Task.mark_completed()` `force` and `status_message` arguments
- Add `Task.stopped()` `reason` argument
- Add `Task.query_tasks()`, `Task.get_task()` and `Task.get_tasks()` `tags` argument

**Bug Fixes**

- Fix PyJWT resiliency support
- Fix xgb train overload ([ClearML GitHub issue #456](https://github.com/allegroai/clearml/issues/456))
- Fix `http://` throws `OSError` in Windows by using `pathlib2` instead of `os` ([ClearML GitHub issue #463](https://github.com/allegroai/clearml/issues/463))
- Fix local diff should include staged commits, otherwise applying git diff fails ([ClearML GitHub issue #457](https://github.com/allegroai/clearml/issues/457))
- Fix `task.upload_artifact` non-standard dictionary will now revert to `pickle` ([ClearML GitHub issue #452](https://github.com/allegroai/clearml/issues/452))
- Fix `S3BucketConfig.is_valid()` for EC2 environments with `use_credentials_chain` ([ClearML GitHub issue #478](https://github.com/allegroai/clearml/issues/478))
- Fix audio classifier example when training with a custom dataset ([ClearML GitHub issue #484](https://github.com/allegroai/clearml/issues/484))
- Fix `clearml-task` diff was corrupted by Windows drive letter and separator ([ClearML GitHub issue #483](https://github.com/allegroai/clearml/issues/483))
- Fix TQDM "line cleanup" not using `CR` but rather arrow-up escape sequence
- Fix `task.connect(dict)` value casting - if `None` is the default value, use backend stored type
- Fix Jupyter notebook should always set Task as completed/stopped, never failed (exceptions are caught in interactive session)
- Fix Pipeline support
  - Fix `LocalClearmlJob` setting failed status
  - Fix pipeline stopping all running steps
  - Fix nested pipeline component parent point to pipeline Task
  - Fix `PipelineController.start()` should not kill the process when done
  - Fix pipeline failing to create Step Task should cause the pipeline to be marked failed
  - Fix nested pipeline components missing pipeline tags
- Fix images reported over history size were not sent if frequency was too high
- Fix git detectors missing git repository without origin
- Fix support for upload `LazyEvalWrapper` artifacts
- Fix duplicate task dataset tags
- Fix FileLock create target folder
- Fix crash inside forked subprocess might leave SafeQueue in a locked state, causing `task.close()` to hang
- Fix PyTorch distributed example `TimeoutSocket` issue in Windows
- Fix broken `Dataset.finalize()`
- Fix Python 3.5 compatibility

### ClearML 1.1.2

**Bug Fix**

- Fix PyJWT issue (limit dependency to `<2.2.0`) 

### ClearML 1.1.1

**Bug Fixes**

- Fix `Logger.report_image()` throws warning
- Fix TensorBoard `add_image()` not being reported

### ClearML 1.1.0

:::info Breaking Changes
- New PipelineController v2 was introduced. New constructor is not backwards compatible!
- ClearML will no longer try to use the demo server by default (change this by setting the `CLEARML_NO_DEFAULT_SERVER=0` environment variable)
- `Task.completed()` was deprecated, use `Task.mark_completed()` instead
:::

**Features**

- Add Task Trigger Scheduler
- Add Task Cron Scheduler
- Add PipelineController from function
- Add PipelineDecorator (`PipelineDecorator.pipeline` and `PipelineDecorator.component` decorators for full custom pipeline logic)
- Add xgboost auto metric logging ([ClearML GitHub issue #381](https://github.com/allegroai/clearml/issues/381))
- Add `sdk.storage.log.report_upload_chunk_size_mb` and `sdk.storage.log.report_download_chunk_size_mb` configuration options to control upload/download log reporting ([ClearML GitHub issue #424](https://github.com/allegroai/clearml/issues/424))
- Add new optional `auto_connect_frameworks` argument value to `Task.init()` (e.g. `auto_connect_frameworks={'tfdefines':False}`) to allow disabling TF defines ([ClearML GitHub issue #408](https://github.com/allegroai/clearml/issues/408))
- Add support for `CLEARNL_CONFIG_VERBOSE` environment variable to allow external control over verbosity of the configuration loading process
- Add support for uploading artifacts with a list of files using `Task.upload_artifcats(name, [Path(), Path()])`
- Add missing *clearml-task* parameters `--docker_args`, `--docker_bash_setup_script` and `--output-uri`
- Change `CreateAndPopulate` will auto list packages imported but not installed locally
- Add `clearml.task.populate.create_task_from_function()` to create a Task from a function, wrapping function input arguments into hyper-parameter section as kwargs and storing function results as named artifacts
- Add support for Task serialization (e.g. for pickle)
- Add `Task.get_configuration_object_as_dict()`
- Add `docker_image` argument to `Task.set_base_docker()` (deprecate `docker_cmd`)
- Add `auto_version_bump` argument to `PipelineController`
- Add `sdk.development.detailed_import_report` configuration option to provide a detailed report of all Python package imports
- Set current Task as Dataset parent when creating dataset
- Add support for deferred configuration
- Examples
  - Add Pipeline v2 examples
  - Add `TaskScheduler` and `TriggerScheduler` examples
  - Add pipeline controller callback example
  - Improve existing examples and docstrings

**Bug Fixes**

- Fix plotly plots converting `NaN` to `nan` instead of `null` ([ClearML GitHub issue #373](https://github.com/allegroai/clearml/issues/373))
- Fix deprecation warning ([ClearML GitHub issue #376](https://github.com/allegroai/clearml/issues/376))
- Fix plotly multi-index without index names ([ClearML GitHub issue #399](https://github.com/allegroai/clearml/issues/399))
- Fix click support ([ClearML GitHub issue #437](https://github.com/allegroai/clearml/issues/437))
- Fix docstring ([ClearML GitHub issue #438](https://github.com/allegroai/clearml/issues/438))
- Fix passing `task-type` to *clearml-task* ([ClearML GitHub issue #422](https://github.com/allegroai/clearml/issues/422))
- Fix `clearml-task --version` throws an error ([ClearML GitHub issue #422](https://github.com/allegroai/clearml/issues/422))
- Fix *clearml-task* ssh repository links are not detected as remote repositories ([ClearML GitHub issue #423](https://github.com/allegroai/clearml/issues/423))
- Fix `getattr` throws an exception ([ClearML GitHub issue #426](https://github.com/allegroai/clearml/issues/426))
- Fix encoding while saving notebook preview ([ClearML GitHub issue #443](https://github.com/allegroai/clearml/issues/443))
- Fix poetry toml file without requirements.txt ([ClearML GitHub issue #444](https://github.com/allegroai/clearml/issues/444))
- Fix `PY3.x` fails calling `SemLock._after_fork` with forkserver context, forking while lock is acquired ([ClearML Agent GitHub issue #73](https://github.com/allegroai/clearml-agent/issues/73))
- Fix wrong download path in `StorageManager.download_folder()`
- Fix jupyter notebook `display(...)` convert to `print(...)`
- Fix TensorFlow `add_image()` with `description='text'`
- Fix `Task.close()` should remove `current_task()` reference
- Fix `TaskScheduler` weekdays, change default `execute_immediately` to `False`
- Fix Python2 compatibility
- Fix *clearml-task* exit with error when failing to verify `output_uri` (output warning instead)
- Fix unsafe Google Storage delete object
- Fix multi-process spawning wait-for-uploads can create a deadlock in very rare cases
- Fix `task.set_parent()` fails when passing Task object
- Fix `PipelineController` skipping queued Tasks
- Remove `humanfriendly` dependency (unused)
