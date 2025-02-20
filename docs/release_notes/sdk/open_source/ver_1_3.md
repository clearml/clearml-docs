---
title: Version 1.3
---

### ClearML 1.3.2

**New Features and Improvements**

* Add support for setting reported values for `NaN` and `Inf` ([ClearML GitHub issue #604](https://github.com/clearml/clearml/issues/604))
* Add reserved OS environments warning
* Add git credentials to colab example ([ClearML GitHub PR #621](https://github.com/clearml/clearml/pull/621))
* Add jsonargparse support ([ClearML GitHub issue #403](https://github.com/clearml/clearml/issues/403))
* Update autokeras example

**Bug Fixes**

* Fix sub-project separators are incorrectly quoted in generated URLs ([ClearML GitHub PR #584](https://github.com/clearml/clearml/pull/584))
* Revert Optuna deprecation fix ([ClearML GitHub PR #613](https://github.com/clearml/clearml/pull/613))
* Fix HPO randomly aborts running tasks before the time limit
* Fix cloud driver overwrites `agent.extra_docker_arguments`
* Fix Pipeline Controller auto-magic framework connect
* Fix unused scroll is not cleared in `Task.get_reported_plots()`

### ClearML 1.3.1

**New Features and Improvements** 

* Add Python 3.10 support

**Bug Fixes**

* Update Slack SDK requirement ([ClearML GitHub issue #597](https://github.com/clearml/clearml/issues/597))
* Fix fork after `task.close()` is called ([ClearML GitHub issue #605](https://github.com/clearml/clearml/issues/605))
* Fix Azure storage upload ([ClearML GitHub issue #598](https://github.com/clearml/clearml/issues/598))
* Fix offline mode crash
* Fix task delete response not checked
* Fix pipeline controller kwargs with list
* Fix `PipelineDecorator.debug_pipeline()`
* Fix PipelineDecorator example
* Fix Python 3.10 issues
* Fix handling of legacy fileserver (files.community.clear.ml)
* Fix cloud driver may use None credentials
* Fix APIClient worker raises exception when accessing .name attribute
* Fix minimum/default API version setting


### ClearML 1.3.0

**New Features and Improvements** 

* Add new pipeline visualization support (requires ClearML Server v1.3)
* Support IAM Instance Profile in AWS auto-scaler
* Remove old server API versions support (pre-ClearML Server)
* Restructure FastAI examples

**Bug Fixes**

* Fix failed catboost bind on GPU ([ClearML GitHub issue #592](https://github.com/clearml/clearml/issues/592))
* Fix Optuna `n_jobs` deprecation warning
* Fix invalid method called on `delete()` error
