---
title: MongoDB 7 Latest Patch  
---

Bitnami has discontinued updates for their open MongoDB images, which earlier ClearML charts made use of.

To update to the latest patched MongoDB version 7, you can use the official MongoDB image by modifying your `clearml-values.override.yaml` as follows:

```yaml
mongodb:
  image:
    repository: mongo
    tag: 7.0.28
  persistence:
    mountPath: /data/db
```

:::warning[Deployment Mode Limitation]

This configuration is only compatible with deployments that use the default `mongodb.architecture` value set to `standalone`.

You cannot apply this configuration if your chart already uses a different MongoDB architecture setting. Attempting to change the architecture after deployment may result in **DATA LOSS**.
:::