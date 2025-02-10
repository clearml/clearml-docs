---
title: Artifacts
---

**Artifacts** are objects associated with ClearML [tasks](task.md) that are logged to ClearML, so they can later be 
easily accessed, modified, and used. 

Task artifacts support built-in serialization for a wide range of object types, such as:
* Numpy arrays (`.npz`)
* Pandas DataFrames
* PIL images (converted to `.jpg`)
* Files and folders
* Python objects
* and more

ClearML also logs your tasks' input and output models as well as interim model checkpoints. Model artifacts also have 
unique ClearML Model IDs (see [Models](models.md)).

Artifacts allow you to:
* **Track Task Inputs**: Record non source-controlled data to reproduce your workflows.
* **Compare Outputs**: Easily access model snapshots.
* **Build Elaborate Workflows**: Implement pipelines by using the outputs of one task as inputs to another (e.g. a data 
cleaning task logs its clean dataset for use by a subsequent training task).

## Logging Artifacts
ClearML automatically logs artifacts created by popular frameworks, including TensorFlow and PyTorch. See [supported frameworks](../clearml_sdk/task_sdk.md#automatic-logging).

You can also log any other object using [`Task.upload_artifact()`](../references/sdk/task.md#upload_)artifact. See 
the [Artifacts Reporting](../guides/reporting/artifacts.md) example for details.

ClearML can be configured to upload artifacts to any supported types of storage, which include local and shared folders, 
AWS S3 buckets, Google Cloud Storage, and Azure Storage (see [Storage](../integrations/storage.md)).

## Updating Artifacts Dynamically

Clearml can automatically update artifacts as their contents change while your task is running through the use of 
[`register_artifact()`](../references/sdk/task.md#register_artifact).

## Accessing Artifacts
Task artifacts can be accessed by other tasks. To use an artifact, first retrieve the `Task` that created it. Then use 
one of the following methods:
* `get_local_copy()`: Caches the file for later use and returns its path.
* `get()`: Directly retrieves the Python object associated with the artifact.

For more information, see [Using Artifacts](../clearml_sdk/task_sdk.md#using-artifacts).

## WebApp Interface
Artifacts appear under the **ARTIFACTS** tab of a Task. Each artifact's location is displayed in the **FILE PATH** field:
* **Locally stored artifacts**: Include an option to copy the artifact’s location for accessibility (since web 
applications are prohibited from accessing the local disk for security reasons)
* **Network stored artifacts**: Display a download action to retrieve files from URLs (e.g., `https://`, `s3://`).

![WebApp Artifacts section](../img/webapp_tracking_30.png#light-mode-only)
![WebApp Artifacts section](../img/webapp_tracking_30_dark.png#dark-mode-only)

## SDK Interface
See the [Artifacts](../clearml_sdk/task_sdk.md#artifacts) section in the Task SDK page for an overview of how to work 
with ClearML Artifacts using Pythonic methods. 

