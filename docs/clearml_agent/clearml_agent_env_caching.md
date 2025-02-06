---
title: Environment Caching
---

ClearML Agent caches virtual environments so when running tasks multiple times, there's no need to spend time reinstalling 
pre-installed packages. To make use of the cached virtual environments, enable the virtual environment reuse mechanism. 

## Virtual Environment Reuse

The virtual environment reuse feature may reduce task startup time dramatically.

By default, ClearML uses the package manager's environment caching. This means that even if no 
new packages need to be installed, checking the list of packages can take a long time.

ClearML has a virtual environment reuse mechanism which, when enabled, allows using environments as-is without resolving 
installed packages. This means that when executing multiple tasks with the same package dependencies, 
the same environment will be used.

:::note
ClearML does not support environment reuse when using Poetry package manager
:::

To enable virtual environment reuse, modify the `clearml.conf` file and uncomment the `venvs_cache` section.
```
venvs_cache: {
        # maximum number of cached venvs
        max_entries: 10
        # minimum required free space to allow for cache entry, disable by passing 0 or negative value
        free_space_threshold_gb: 2.0
        # uncomment to enable virtual environment caching
        # path: ~/.clearml/venvs-cache
    },
```