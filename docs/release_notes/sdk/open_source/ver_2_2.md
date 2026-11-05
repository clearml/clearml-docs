---
title: Version 2.2
---

### ClearML 2.2.0

**New Features and Improvements**

* Add `sdk.storage.zip_compression` configuration option to select the zip compression algorithm (`stored`, `deflated`, 
  `bzip2`, `lzma`) used for dataset chunks, folder artifacts, and offline session packages ([#1733](https://github.com/clearml/clearml/pull/1733))
* Add `DataView.to_list()` to retrieve all data entries of a DataView as a list ([#1734](https://github.com/clearml/clearml/pull/1734))
* Add `CLEARML_API_RETRY_VALUES` environment variable and vault support for overriding the API session retry settings 
  at runtime ([#1735](https://github.com/clearml/clearml/pull/1735))
* Add `sdk.development.worker.log_stdout`, `sdk.development.worker.log_stderr`, and `sdk.development.worker.resource_monitoring` 
  configuration options to disable stdout/stderr capture and resource monitoring ([#1703](https://github.com/clearml/clearml/pull/1703))
* `CLEARML_LOG_LEVEL` now also accepts logging level names ([#1703](https://github.com/clearml/clearml/pull/1703))
* Update docstrings for HPO, task scheduler, trigger scheduler, hyperdatasets, `Task`, and `HttpRouter` ([#1705](https://github.com/clearml/clearml/pull/1705), 
  [#1706](https://github.com/clearml/clearml/pull/1706), [#1707](https://github.com/clearml/clearml/pull/1707), 
  [#1708](https://github.com/clearml/clearml/pull/1708), [#1709](https://github.com/clearml/clearml/pull/1709), 
  [#1710](https://github.com/clearml/clearml/pull/1710))
* Remove Python 2 compatibility shims and `six` usage from the SDK code (`abstractproperty`, `python_2_unicode_compatible`, 
  abstract context manager, `abstractclassmethod`, `six.moves`, `six.BytesIO`/`six.StringIO`, `PostImportHookPatching` 
  dead code) and no-op `from __future__` imports ([#1711](https://github.com/clearml/clearml/pull/1711) to 
  [#1720](https://github.com/clearml/clearml/pull/1720), [#1738](https://github.com/clearml/clearml/pull/1738))

**Bug Fixes**

* Fix nondeterministic type validation error messages in `DataModel.assert_isinstance` ([#1693](https://github.com/clearml/clearml/pull/1693))
* Fix cache cleanup evicting files currently served to another process (e.g. sibling DataLoader workers) by protecting 
  cache hits with advisory file locks ([#1737](https://github.com/clearml/clearml/pull/1737))
* Fix shell command argument escaping in the autoscaler cloud driver to prevent syntax errors and injections ([#1704](https://github.com/clearml/clearml/pull/1704))
* Fix CPU usage reporting when running inside a container: usage is now reported relative to the container's CPU limit 
  (cgroup v2) instead of machine-wide usage ([#1736](https://github.com/clearml/clearml/pull/1736))
