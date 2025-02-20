---
title: Version 1.9
---

### ClearML 1.9.3

**Bug Fixes**
* Fix broken `Task._get_status()`, which was breaking `clearml-session` in the latest version
* Fix path substitution, making it possible to store unsubstituted URL for models ([ClearML GitHub PR #935](https://github.com/clearml/clearml/pull/935))

### ClearML 1.9.2

**New Features and Improvements**
* Support parsing queue name when providing execution queue in pipelines code ([ClearML GitHub PR #857](https://github.com/clearml/clearml/pull/857))
* Ignore `None` values for keys in the `click` argument parser ([ClearML GitHub issue #902](https://github.com/clearml/clearml/issues/902))
* Improve docstrings for `Task.mark_completed()` and `Task.close()` (ClearML GitHub PRs [#920](https://github.com/clearml/clearml/pull/920) and [#921](https://github.com/clearml/clearml/pull/921))
* Add pre/post execution callbacks to pipeline steps through `@PipelineDecorator.component`
* Add status-change callback to pipeline steps through `PipelineController.add_step()`, `PipelineController.add_function_step()`, 
and `@PipelineDecorator.component`

**Bug Fixes**
* Fix missing debug samples when reporting using TensorBoard ([ClearML GitHub issue #923](https://github.com/clearml/clearml/issues/923))
* Fix wrong Jupyter API token during repository detection ([ClearML GitHub PR #904](https://github.com/clearml/clearml/pull/904))
* Fix typo in the warning for very large git diffs ([ClearML GitHub PR #932](https://github.com/clearml/clearml/pull/932))
* Fix pipelines from tasks don't propagate `parameter_override` values in `PipelineController.add_step()`
* Fix folders and files uploaded to S3 and Azure with `StorageManager.upload_file()` receive wrong MIME types
* Fix the CSV file preview in Datasets
* Fix `Task.connect_configuration()` doesn't work with non-string dictionary keys 
* Fix `lightgbm_example` deprecation warning 
* Fix potential race condition in `get_or_create_project()`


### ClearML 1.9.1

**New Features and Improvements**
* Add signature version to `boto3` configuration ([ClearML GitHub issue #883](https://github.com/clearml/clearml/issues/883))
* Allow requesting custom token expiration using the `api.auth.req_token_expiration_sec` configuration setting
* Add Python 3.11 support

**Bug Fixes**
* Fix `UniformParameterRange.to_list` throws error when step size is not defined ([ClearML GitHub issue #858](https://github.com/clearml/clearml/issues/858))
* Fix `StorageManager.list()` does not return size metadata ([ClearML GitHub issue #865](https://github.com/clearml/clearml/issues/865))
* Fix storage with path substitutions ([ClearML GitHub issue #825](https://github.com/clearml/clearml/issues/825))
* Fix extras in ClearML installation prevents clearml from being included in requirements ([ClearML GitHub issue #867](https://github.com/clearml/clearml/issues/867))
* Fix metadata set on an uploaded model object is not accessible ([ClearML GitHub issue #890](https://github.com/clearml/clearml/issues/890))
* Fix Azure storage upload not working ([ClearML GitHub issue #868](https://github.com/clearml/clearml/issues/868))
* Fix `task.connect` list of dicts parsed incorrectly in remote
* Fix casting `None` to `int` fails uploads and permission checks
* Fix numpy 1.24 support
* Fix `clearml-data` previews are saved on file server even when `output_uri` is specified
* Fix connecting a dictionary to task sometimes raises an exception 
* Fix authentication headers are not set on substituted fileserver URLs
* Fix `Task.get_project_id()` cannot find hidden projects
* Fix TriggerScheduler docstrings ([ClearML GitHub issue #881](https://github.com/clearml/clearml/issues/881))

### ClearML 1.9.0 

**New Features and Improvements**
* Add `r` prefix to `re.match()` strings ([ClearML GitHub issue #834](https://github.com/clearml/clearml/issues/834))
* Add `path_substitution` to `clearml.conf` example file ([ClearML GitHub PR #842](https://github.com/clearml/clearml/pull/842))
* Clarify `deferred_init` usage in `Task.init()` ([ClearML GitHub issue #855](https://github.com/clearml/clearml/issues/855))
* Add pipeline decorator argument to control docker image ([ClearML GitHub issue #856](https://github.com/clearml/clearml/issues/856))
* Add `StorageManager.set_report_upload_chunk_size()` and `StorageManager.set_report_download_chunk_size()` to set chunk 
size for upload and download
* Add `allow_archived` argument in `Task.get_tasks()`
* Support querying model metadata in `Model.query_models()`
* Add `Dataset.set_metadata()` and `Dataset.get_metadata()`
* Add `delete_from_storage` (default `True`) to `Task.delete_artifacts()`

**Bug Fixes**
* Fix jsonargparse and pytorch lightning integration broken for remote execution ([ClearML GitHub issue #403](https://github.com/clearml/clearml/issues/403))
* Fix error when using `TaskScheduler` with `limit_execution_time` ([ClearML GitHub issue #648](https://github.com/clearml/clearml/issues/648))
* Fix dataset not synced if the changes are only modified files ([ClearML GitHub issue #822](https://github.com/clearml/clearml/issues/822))
* Fix `StorageHelper.delete()` does not respect path substitutions ([ClearML GitHub issue #825](https://github.com/clearml/clearml/issues/825))
* Fix can't write more than 2 GB to a file
* Fix `StorageManager.get_file_size_bytes()` returns `ClientError` instead of `None` for invalid S3 links
* Fix Dataset lineage view is broken with multiple dataset dependencies
* Fix `tensorflow_macos` support
* Fix crash when calling `task.flush(wait_for_uploads=True)` while executing remotely
* Fix `None` values get casted to empty strings when connecting a dictionary
