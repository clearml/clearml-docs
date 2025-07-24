---
title: Version 1.2
---

### ClearML 1.2.1

**Bug Fix**

- Fix HTTP download fails constructing URL ([#593](https://github.com/clearml/clearml/issues/593))

### ClearML 1.2.0

**Features**

- Add fastai v2 support ([#571](https://github.com/clearml/clearml/pull/571))
- Add catboost support ([#542](https://github.com/clearml/clearml/pull/542))
- Add Python Fire support ([#550](https://github.com/clearml/clearml/pull/550))
- Add new Azure Storage driver support ([#548](https://github.com/clearml/clearml/pull/548))
- Add requirements file support in `Task.add_requirements` ([#575](https://github.com/clearml/clearml/pull/575))
- Allow overriding `auto_delete_file` in `Task.update_output_model()` ([#554](https://github.com/clearml/clearml/issues/554))
- Support `artifact_object` empty string
- Add `skip_zero_size_check` to `StorageManager.download_folder()`
- Add support for extra HTTP retry codes (see [here](https://github.com/clearml/clearml/blob/2c916181b90c784fe0bd267cd67ea915e53e36e4/clearml/backend_api/config/default/api.conf#L29) or use `CLEARML_API_EXTRA_RETRY_CODES`)
- Add `Task.get_parameters()` cast back to original type
- Add callback support to `Task.delete()`
- Add autoscaler CPU-only support
- Add AWS autoscaler IAM instance profile support
- Update examples
  - Edit HTML reporting examples ([#546](https://github.com/clearml/clearml/pull/546))
  - Add model reporting examples ([#553](https://github.com/clearml/clearml/pull/553))

**Bug Fixes**

- Fix `nargs="?"` without type does not properly cast the default value ([#531](https://github.com/clearml/clearml/issues/531))
- Fix using invalid configurations ([#544](https://github.com/clearml/clearml/issues/544))
- Fix extra_layout not passed to report_matrix ([#559](https://github.com/clearml/clearml/issues/559))
- Fix group arguments in click ([#561](https://github.com/clearml/clearml/pull/561))
- Fix no warning when failing to patch argparse ([#576](https://github.com/clearml/clearml/pull/576))
- Fix crash in `Dataset.upload()` when there is nothing to upload ([#579](https://github.com/clearml/clearml/pull/579))
- Fix requirements, refactor and reformat examples ([#567](https://github.com/clearml/clearml/pull/567), [#573](https://github.com/clearml/clearml/pull/573), [#582](https://github.com/clearml/clearml/pull/582))
- Auto-scaler
  - Change confusing log message
  - Fix AWS tags support
  - Fix instance startup script fails on any command (should only fail on the agent failing to launch)
  - Fix spin down stuck machine, ignore unknown stale workers
- Fix pandas object passed as `Task.upload_artifact()` preview object
- Fix incorrect timeout used for stale workers
- Fix `clearml-task` calls `Task.init()` in the wrong place when a single local file is used
- Fix ArgumentParser `SUPPRESS` as default should be resolved at remote execution in the same way (i.e. empty string equals `SUPPRESS`)
- Upgrade six version (in case `pathlib2>2.3.7` is installed)
- Fix connected object base class members are not used
- Fix `clearml-init` changing web host after pasting full credentials
- Fix fileserver upload does not support path in URL
- Fix crash on semaphore acquire error
- Fix docs and docstrings ([#558](https://github.com/clearml/clearml/pull/558), [#560](https://github.com/clearml/clearml/pull/560))

