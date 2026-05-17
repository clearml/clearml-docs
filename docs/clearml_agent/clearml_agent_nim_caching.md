---
title: NIM Cache
---

NVIDIA NIM containers use a local cache directory for downloaded models. The cache location is controlled by the 
`NIM_CACHE_PATH` environment variable.

When deploying the ClearML Agent on K8s, the volume information can be set through the overrides file. For example:

```
agentk8sglue:
  basePodTemplate:
    env:
      - name: NIM_CACHE_PATH
        value: /opt/nim/.cache
    volumeMounts:
      - name: nim-cache
        mountPath: /opt/nim/.cache
    volumes:
      - name: nim-cache
        persistentVolumeClaim:
          claimName: nim-cache-pvc
```