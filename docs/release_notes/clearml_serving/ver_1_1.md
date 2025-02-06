---
title: Version 1.1
---

### ClearML Serving 1.1.0 

:::warning Backwards Compatibility
This release is not backwards compatible. See `Upgrading from v1.0` note below. 
:::

**Breaking Changes**
* Triton engine size supports variable request size (-1)

**Features and Bug Fixes**

* Add version number of serving session task
* Triton engine support for variable request (matrix) sizes
* Triton support, fix `--aux-config` to support more configurations elements
* Hugging Face Transformer support
* `Preprocess` class as module (see `Preprocess Class` note below)

:::note Upgrading from v1.0
1. Take down the serving containers (docker-compose or k8s)
1. Update the clearml-serving CLI: `pip3 install -U clearml-serving`
1. Re-add a single existing endpoint: `clearml-serving model add ...` (press `yes` when asked). This will upgrade the 
clearml-serving session definitions
1. Pull latest serving containers (`docker-compose pull ...` or k8s)
1. Re-spin serving containers (docker-compose or k8s)
:::

:::note Preprocess Class
You can now add a `Preprocess` class from a module. The entire module folder will be packaged.

```
preprocess_folder
├── __init__.py  # from .sub.some_file import Preprocess
└── sub
    └── some_file.py
```

Pass the top-level folder path using `--preprocess`. For example:

```
clearml-serving --id <serving_session_id> model add --preprocess /path/to/preprocess_folder ...
```
:::