---
title: Version 1.5
---

### ClearML 1.5.0

**New Features and Improvements**
* Add support for single value metric reporting ([#400](https://github.com/clearml/clearml/issues/400))
* Add support for specifying parameter sections in `PipelineDecorator` ([#629](https://github.com/clearml/clearml/issues/629))
* Add support for parallel uploads and downloads (upload / download and zip / unzip of artifacts)
* Add support for specifying execution details (repository, branch, commit, packages, image) in `PipelineDecorator`
* Bump PyJWT version due to "*Key confusion through non-blocklisted public key formats*" vulnerability
* Add support for AWS Session Token (using boto3's `aws_session_token` argument)

**Bug Fixes**
* Fix `Task.get_projects()` retrieves only the first 500 results ([#612](https://github.com/clearml/clearml/issues/612))
* Fix failure to delete artifacts stored in Azure ([#660](https://github.com/clearml/clearml/issues/660))
* Fix Process Pool hangs at exit ([#674](https://github.com/clearml/clearml/issues/674))
* Fix number of unpacked values when syncing a dataset ([#682](https://github.com/clearml/clearml/issues/682))
* Fix FastAI DeprecationWarning ([#683](https://github.com/clearml/clearml/issues/683))
* Fix `StorageManager.download_folder()` crash
* Fix pipelines can't handle `None` return value
* Fix pre-existing pipeline raises an exception
* Fix deprecation warning in the `image_reporting` example
* Fix patches are kept binded after `Task.close()` is called
* Fix running pipeline code remotely without first running it locally (i.e. no configuration on the Task)
* Fix local task execution with empty working directory
* Fix permission check fails when using local storage folder that does not exist
* Fix pipeline `add_function_step` breaks in remote execution
* Fix wrong mimetype used for any file or folder uploaded to S3 using `StorageManager`
* Add missing default `default_cache_manager_size` in configuration files
