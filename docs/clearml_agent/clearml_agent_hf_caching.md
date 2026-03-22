---
title: HuggingFace Cache
---

HuggingFace libraries provide their own cache mechanism for downloaded files. The HuggingFace cache location is controlled 
by the `HF_HOME` environment variable.

When deploying the ClearML agent on K8S, the volume information can be set through the overrides file. For example:

```yaml
agentk8sglue:
  basePodTemplate:
    env:
      - name: HF_HOME
        value: "/root/.cache/huggingface"
    volumes:
      - name: hf-cache
        hostPath:
          path: /root/.clearml/cache/hf
          type: DirectoryOrCreate
    volumeMounts:
      - name: hf-cache
        mountPath: /root/.cache/huggingface
```