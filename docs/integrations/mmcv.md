---
title: MMCV v1.x
---

:::info
`ClearMLLoggerHook` is supported by mmcv `=>1.5.1` and `<=1.7.0`. 
:::

:::tip
If you are not already using ClearML, see [Getting Started](../getting_started/ds/ds_first_steps.md) for setup 
instructions.
:::

[MMCV](https://github.com/open-mmlab/mmcv/tree/1.x) is a computer vision framework developed by OpenMMLab. You can integrate ClearML into your 
code using the `mmcv` package's [`ClearMLLoggerHook`](https://mmcv.readthedocs.io/en/master/_modules/mmcv/runner/hooks/logger/clearml.html)
class. This class is used to create a ClearML Task and to automatically log metrics. 

For example, the following code sets up the configuration for logging metrics periodically to ClearML, and then registers
the ClearML hook to a [runner](https://mmcv.readthedocs.io/en/v1.3.8/runner.html?highlight=register_training_hooks#epochbasedrunner),
which manages training in `mmcv`:

```python
log_config = dict(
    interval=100,
    hooks=[
        dict(
            type='ClearMLLoggerHook',
            init_kwargs=dict(
                project_name='examples',
                task_name='OpenMMLab cifar10',
                output_uri=True
            )
        ),
    ]
)

# register hooks to runner and those hooks will be invoked automatically
runner.register_training_hooks(
    lr_config=lr_config,
    optimizer_config=optimizer_config,
    checkpoint_config=checkpoint_config,
    log_config=log_config # ClearMLLogger hook
)
```

The `init_kwargs` dictionary can include any parameter from [`Task.init()`](../references/sdk/task.md#taskinit). 

This creates a [ClearML Task](../fundamentals/task.md) `OpenMMLab cifar10` in the `examples` project.
You can view the captured metrics in the task's **Scalars** tab in the [WebApp](../webapp/webapp_overview.md).

![OpenMMLab scalars](../img/integration_openmmlab_scalars.png)

See MMCV code example [here](https://github.com/clearml/clearml/blob/master/examples/frameworks/openmmlab/openmmlab_cifar10.py).