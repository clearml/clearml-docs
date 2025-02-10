---
title: Version 1.0
---

### ClearML Serving 1.0.0

:::warning Backwards Compatibility
This release is not backwards compatible
:::

**Breaking Changes**
* `preprocess` and `postprocess` class functions get 3 arguments
* Add support for per-request state storage, passing information between the pre/post-processing functions

**Features and Bug Fixes**

* Optimize serving latency while collecting statistics
* Fix metric statistics collecting auto-refresh issue
* Fix live update of model preprocessing code
* Add `pandas` to the default serving container
* Add per endpoint/variable statistics collection control
* Add `CLEARML_EXTRA_PYTHON_PACKAGES` for easier additional python package support (serving inference container)
* Upgrade Nvidia Triton base container image to 22.04 (requires Nvidia drivers 510+)
* Add Kubernetes Helm chart