---
title: Version 1.2
---

### ClearML Serving 1.2.0

**New Features and Improvements**
* Improve GPU Performance, 50%-300% improvement over vanilla Triton
* Improve performance on CPU, optimize uvloop + multi-processing
* Add Hugging Face Transformer example
* Add binary input support ([ClearML Serving PR #37](https://github.com/allegroai/clearml-serving/pull/37) )

**Bug Fix**
* stdout/stderr in inference service not logging to dedicated Task

