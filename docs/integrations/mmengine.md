---
title: MMEngine
---

:::tip
If you are not already using ClearML, see [Getting Started](../getting_started/ds/ds_first_steps.md) for setup 
instructions.
:::

[MMEngine](https://github.com/open-mmlab/mmengine) is a library for training deep learning models based on PyTorch. 
MMEngine supports ClearML through a builtin logger: It automatically logs task environment information, such as 
required packages and uncommitted changes, and supports reporting scalars, parameters, and debug samples.

Integrate ClearML with the following steps:
1. Instantiate a [`ClearMLVisBackend`](https://mmengine.readthedocs.io/en/latest/api/generated/mmengine.visualization.ClearMLVisBackend.html#mmengine.visualization.ClearMLVisBackend) 
   object. This creates a ClearML Task that logs the task’s environment information.   
   
   ```python
   from mmengine.visualization import ClearMLVisBackend
   vis_backend = ClearMLVisBackend(
       artifact_suffix=('.py', 'pth'), 
       init_kwargs=dict(
           project_name='examples',
           task_name='OpenMMLab cifar10',
           output_uri=True
       )
   )
   ```
   
   You can specify the following parameters: 

   * `init_kwargs` – A dictionary that contains the arguments to pass to ClearML's [`Task.init()`](../references/sdk/task.md#taskinit).  
   * `artifact_suffix` – At the end of training, artifacts with these suffixes will be uploaded to the task's `output_uri`. 
   Defaults to (`.py`, `pth`).  

2. Log task parameters using `ClearMLVisBackend.add_config()`. Under the `config` parameter, input a dictionary of parameter key-value pairs.  

    ```python
    cfg = Config(dict(a=1, b=dict(b1=[0, 1])))
    vis_backend.add_config(config=cfg)
    ```

    The parameters will be displayed in the ClearML WebApp, under the task’s Hyperparameters

3. Log your task’s scalars using either `ClearMLVisBackend.add_scalar()` for single values or `ClearMLVisBackend.add_scalars()` 
   for multiple values: 
   
   ```python
   vis_backend.add_scalar(name='mAP', value=0.6, step=1)
   vis_backend.add_scalars(scalar_dict={'loss': 0.1,'acc':0.8}, step=1)
   ```

   The scalars are displayed in the task's **Scalars** tab.

5. Report images to your task using `ClearMLVisBackend.add_image()`. Under the `image` parameter, input the image 
   to be reported as an `np.ndarray` in RGB format:

   ```python
   img = np.random.randint(0, 256, size=(10, 10, 3))
   vis_backend.add_image(name='img.png', image=img, step=1)
   ```
   The images will be displayed in the task's **Debug Samples** tab.

5. Once you've finished training, make sure to run `ClearMLVisBackend.close()` so that ClearML can mark the task as 
   completed. This will also scan the directory for relevant artifacts with the suffixes input when instantiating 
   `ClearMLVisBackend` and log the artifacts to your task. 

    ```python
    vis_backend.close()
    ```
