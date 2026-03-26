---
title: ClearML Data Cache
---

ClearML maintains a cache for the files downloaded while executing tasks (task artifacts, datasets etc.). The location 
of the cache folder can be controlled with the `CLEARML_CACHE_DIR` environment variable.

When deploying the ClearML agent on K8s, the volume information can be set through the overrides file. For example:

```yaml
agentk8sglue:
  basePodTemplate:
    env:
      - name: CLEARML_CACHE_DIR
        value: "/root/.clearml/cache"
    volumes:
      - name: clearml-cache
        hostPath:
          path: /root/clearml-cache
          type: DirectoryOrCreate
    volumeMounts:
      - name: clearml-cache
        mountPath: /root/.clearml/cache
```

