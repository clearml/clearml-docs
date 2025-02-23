---
title: Logging and Using Task Artifacts
---

:::note
This tutorial assumes that you've already set up [ClearML](../clearml_sdk/clearml_sdk_setup.md)
:::


ClearML lets you easily store a task's output products--or **Artifacts**: 
* [Model](#models) snapshot / weights file
* Preprocessing of your data
* Feature representation of data 
* And more!

**Artifacts** are files or Python objects that are uploaded and stored alongside the Task.
These artifacts can be easily accessed by the web UI or programmatically.
 
Artifacts can be stored anywhere, either on the ClearML Server, or any object storage solution or shared folder.
See all [storage capabilities](../integrations/storage.md).


## Adding Artifacts

Let's create a [Task](../fundamentals/task.md) and add some artifacts to it. 

1. Create a task using [`Task.init()`](../references/sdk/task.md#taskinit)

    ```python
    from clearml import Task
    
    task = Task.init(project_name='great project', task_name='task with artifacts')
    ```

1. Upload a local **file** using [`Task.upload_folder()`](../references/sdk/task.md#upload_artifact) and specifying the artifact's 
   name and its path:

    ```python
    task.upload_artifact(name='data', artifact_object='/path/to/preprocess_data.csv')
    ```

1. Upload an **entire folder** with all its content by passing the folder path (the folder will be zipped and uploaded as a single zip file).

   ```python
   task.upload_artifact(name='folder', artifact_object='/path/to/folder/')
   ```

1. Upload an instance of an object. Numpy/Pandas/PIL Images are supported with `npz`/`csv.gz`/`jpg` formats accordingly.
   If the object type is unknown, ClearML pickles it and uploads the pickle file.
 
   ```python
   numpy_object = np.eye(100, 100)
   task.upload_artifact(name='features', artifact_object=numpy_object)
   ```

For more artifact logging options, see [Artifacts](../clearml_sdk/task_sdk.md#artifacts).

### Using Artifacts

Logged artifacts can be used by other Tasks, whether it's a pre-trained Model or processed data.
To use an artifact, first you have to get an instance of the Task that originally created it,
then you either download it and get its path, or get the artifact object directly.

For example, using a previously generated preprocessed data.

```python
preprocess_task = Task.get_task(task_id='preprocessing_task_id')
local_csv = preprocess_task.artifacts['data'].get_local_copy()
```

`task.artifacts` is a dictionary where the keys are the artifact names, and the returned object is the artifact object.
Calling `get_local_copy()` returns a local cached copy of the artifact. Therefore, next time you execute the code, you don't
need to download the artifact again.
Calling `get()` gets a deserialized pickled object.

Check out the [artifacts retrieval](https://github.com/clearml/clearml/blob/master/examples/reporting/artifacts_retrieval.py) example code.

## Models

Models are a special kind of artifact.
Models created by popular frameworks (such as PyTorch, TensorFlow, Scikit-learn) are automatically logged by ClearML.
All snapshots are automatically logged. In order to make sure you also automatically upload the model snapshot (instead of saving its local path),
pass a storage location for the model files to be uploaded to.

For example, upload all snapshots to an S3 bucket:
```python
task = Task.init(
    project_name='examples',
    task_name='storing model',
    output_uri='s3://my_models/'
)
```

Now, whenever the framework (TensorFlow/Keras/PyTorch etc.) stores a snapshot, the model file is automatically uploaded to the bucket to a specific folder for the task.

Loading models by a framework is also logged by the system; these models appear in a task's **Artifacts** tab,
under the "Input Models" section.

Check out model snapshots examples for [TensorFlow](https://github.com/clearml/clearml/blob/master/examples/frameworks/tensorflow/tensorflow_mnist.py),
[PyTorch](https://github.com/clearml/clearml/blob/master/examples/frameworks/pytorch/pytorch_mnist.py),
[Keras](https://github.com/clearml/clearml/blob/master/examples/frameworks/keras/keras_tensorboard.py),
[scikit-learn](https://github.com/clearml/clearml/blob/master/examples/frameworks/scikit-learn/sklearn_joblib_example.py).

### Loading Models
Loading a previously trained model is quite similar to loading artifacts.

```python
prev_task = Task.get_task(task_id='the_training_task')
last_snapshot = prev_task.models['output'][-1]
local_weights_path = last_snapshot.get_local_copy()
```

Like before, you have to get the instance of the task training the original weights files, then you can query the task for its output models (a list of snapshots), and get the latest snapshot.

:::note
Using TensorFlow, the snapshots are stored in a folder, meaning the `local_weights_path` will point to a folder containing your requested snapshot.
:::

As with artifacts, all models are cached, meaning the next time you run this code, no model needs to be downloaded.
Once one of the frameworks will load the weights file, the running task will be automatically updated with "Input Model" pointing directly to the original training Task's Model.
This feature lets you easily get a full genealogy of every trained and used model by your system!

