---
title: ClearML Data SDK
---

:::important
This page covers `clearml-data`, ClearML's file-based data management solution.
See [Hyper-Datasets](../hyperdatasets/overview.md) for ClearML's advanced queryable dataset management solution.
:::

Datasets can be created, modified, and managed with ClearML Data's Python interface. You can upload your dataset to any 
storage service of your choice (S3 / GS / Azure / Network Storage) by setting the dataset's upload destination (see 
[`output_url`](#uploading-files) parameter of `Dataset.upload()`). Once you have uploaded your dataset, you can access 
it from any machine.  

The following page provides an overview for using the most basic methods of the `Dataset` class. See the [Dataset reference page](../references/sdk/dataset.md) 
for a complete list of available methods.

Import the `Dataset` class, and let's get started!

```python
from clearml import Dataset
```

## Creating Datasets 

ClearML Data supports multiple ways to create datasets programmatically, which provides for a variety of use-cases:
* [`Dataset.create()`](#datasetcreate) - Create a new dataset. Parent datasets can be specified, from which the new dataset 
  will inherit its data
* [`Dataset.squash()`](#datasetsquash) - Generate a new dataset from by squashing together a set of related datasets

You can add metadata to your datasets using [`Dataset.set_metadata()`](../references/sdk/dataset.md#set_metadata), 
and access the metadata using [`Dataset.get_metadata()`](../references/sdk/dataset.md#get_metadata).

### Dataset.create()

Use the [`Dataset.create`](../references/sdk/dataset.md#datasetcreate) class method to create a dataset.

Creating datasets programmatically is especially helpful when preprocessing the data so that the 
preprocessing code and the resulting dataset are saved in a single task (see `use_current_task` parameter in [`Dataset.create`](../references/sdk/dataset.md#datasetcreate)).  

```python
# Preprocessing code here
dataset = Dataset.create(
  dataset_name='dataset name',
  dataset_project='dataset project', 
  parent_datasets=[PARENT_DS_ID_1, PARENT_DS_ID_2],
  dataset_version="1.0",
  output_uri="gs://bucket-name/folder",
  description='my dataset description'
)
```

:::tip Locating Dataset ID
For datasets created with `clearml` v1.6 or newer on ClearML Server v1.6 or newer, find the ID in the dataset version's info panel in the [Dataset UI](../webapp/datasets/webapp_dataset_viewing.md).  
For datasets created with earlier versions of `clearml`, or if using an earlier version of ClearML Server, find the ID in the task header of the [dataset task's info panel](../webapp/webapp_exp_track_visual.md).  
:::

:::info Dataset Version
Input the dataset's version using the [semantic versioning](https://semver.org) scheme (for example: `1.0.1`, `2.0`). If a version 
is not input, the method tries finding the latest dataset version with the specified `dataset_name` and `dataset_project` 
and auto-increments the version number. 
:::

Use the `output_uri` parameter to specify a network storage target to upload the dataset files, and associated information 
(such as previews) to. For example:
* A shared folder: `/mnt/share/folder`
* S3: `s3://bucket/folder`
* Non-AWS S3-like services (such as MinIO): `s3://host_addr:port/bucket`. **Note that port specification is required**. 
* Google Cloud Storage: `gs://bucket-name/folder`
* Azure Storage: `azure://<account name>.blob.core.windows.net/path/to/file`

By default, the dataset uploads to ClearML's file server. The `output_uri` parameter of [`Dataset.upload()`](#uploading-files)
overrides this parameter's value.

The created dataset inherits the content of the `parent_datasets`. When multiple dataset parents are listed, 
they are merged in order of specification. Each parent overrides any overlapping files from a previous parent dataset.

### Dataset.squash()

To improve deep dataset DAG storage and speed, dataset squashing was introduced. The [`Dataset.squash`](../references/sdk/dataset.md#datasetsquash) 
class method generates a new dataset by squashing a set of dataset versions, and merging down all changes introduced in 
their lineage DAG, creating a new, flat, independent version.

The datasets being squashed into a single dataset can be specified by their IDs or by project and name pairs. 

```python
# option 1 - list dataset IDs
squashed_dataset_1 = Dataset.squash(
  dataset_name='squashed dataset\'s name',
  dataset_ids=[DS1_ID, DS2_ID, DS3_ID]
)

# option 2 - list project and dataset pairs 
squashed_dataset_2 = Dataset.squash(
  dataset_name='squashed dataset 2',
  dataset_project_name_pairs=[('dataset1 project', 'dataset1 name'), 
                              ('dataset2 project', 'dataset2 name')]
)
```

In addition, the target storage location for the squashed dataset can be specified using the `output_uri` parameter of
[`Dataset.squash()`](../references/sdk/dataset.md#datasetsquash).

## Accessing Datasets
Once a dataset has been created and uploaded to a server, the dataset can be accessed programmatically from anywhere. 

Use the [`Dataset.get`](../references/sdk/dataset.md#datasetget) class method to access a specific Dataset object, by 
providing any of the dataset's following attributes: dataset ID, project, name, tags, and or version. If multiple 
datasets match the query, the most recent one is returned.

```python
dataset = Dataset.get(
        dataset_id=None,  
        dataset_project="Example Project",
        dataset_name="Example Dataset",
        dataset_tags="my tag",
        dataset_version="1.2",
        only_completed=True, 
        only_published=False, 
)
```

Pass `auto_create=True`, and a dataset will be created on-the-fly with the input attributes (project name, dataset name, 
and tags) if no datasets match the query. 

In cases where you use a dataset in a task (e.g. consuming a dataset), you can have its ID stored in the task's 
hyperparameters: pass `alias=<dataset_alias_string>`, and the task using the dataset will store the dataset's ID in the 
`dataset_alias_string` parameter under the `Datasets` hyperparameters section. This way you can easily track which 
dataset the task is using. If you use `alias` with `overridable=True`, you can override the dataset ID from the UI's 
**CONFIGURATION > HYPERPARAMETERS >** `Datasets` section, allowing you to change the dataset used when running a task 
remotely. 

In case you want to get a modifiable dataset, you can get a newly created mutable dataset with the current one as its 
parent, by passing `writable_copy=True`.

Once a specific dataset object has been obtained, get a local copy of the dataset using one of the following options:
* [`Dataset.get_local_copy()`](../references/sdk/dataset.md#get_local_copy) - get a read-only local copy of an entire dataset. 
  This method returns a path to the dataset in local cache (downloading the dataset if it is not already in cache).
* [`Dataset.get_mutable_local_copy()`](../references/sdk/dataset.md#get_mutable_local_copy) - get a writable local copy 
  of an entire dataset. This method downloads the dataset to a specific folder (non-cached), specified with the `target_folder` parameter. If 
  the specified folder already has contents, specify whether to overwrite its contents with the dataset contents, using the `overwrite` parameter.

  :::note
  `Dataset.get_mutable_local_copy()` initially downloads the local copy into a cache directory before moving it to the
  location specified in `target_folder`. If the default cache directory does not have sufficient disk space, you can 
  change the directory by setting the `CLEARML_CACHE_DIR` environment variable.
  :::


ClearML supports parallel downloading of datasets. Use the `max_workers` parameter of the `Dataset.get_local_copy` or 
`Dataset.get_mutable_local_copy` methods to specify the number of threads to use when downloading the dataset. By default, it's 
the number of your machine's logical cores.

## Modifying Datasets

Once a dataset has been created, its contents can be modified and replaced. When your data is changed, you can 
add updated files or remove unnecessary files. 

### add_files()

To add local files or folders into the current dataset, use the [`Dataset.add_files`](../references/sdk/dataset.md#add_files) 
method. 

If a file is already in a dataset, but it has been modified, it can be added again, and ClearML will 
upload the file diff.

```python
dataset = Dataset.create(dataset_name="my dataset", dataset_project="example project")
dataset.add_files(path="path/to/folder_or_file")
```

You can add a set of files based on wildcard matching of a single string or a list of strings, using the 
`wildcard` parameter. Specify whether to match the wildcard files recursively using the `recursive` parameter.

For example:

```python
dataset.add_files(
  path="path/to/folder",
  wildcard="~/data/*.jpg",
  recursive=True
)
```
 
### add_external_files()

To add files or folders to the current dataset, leaving them in their original location, use the [`Dataset.add_external_files`](../references/sdk/dataset.md#add_external_files) 
method. Input the `source_url` argument, which can be a link or a list of links from cloud storage (`s3://`, `gs://`, `azure://`) 
or local / network storage (`file://`).

```python
dataset = Dataset.create(dataset_name="my dataset", dataset_project="example project")
dataset.add_external_files(
  source_url="s3://my/bucket/path_to_folder_or_file", 
  dataset_path="/my_dataset/new_folder/"
)
dataset.add_external_files(
  source_url=[
    "s3://my/bucket/path_to_folder_or_file",
    "s3://my/bucket/path_to_another_folder_or_file", 
  ],
  dataset_path="/my_dataset/new_folder/"
)
```

You can add a set of files based on wildcard matching of a single string or a list of wildcards using the 
`wildcard` parameter. Specify whether to match the wildcard files recursively using the `recursive` parameter.

```python
# Add all jpg files located in s3 bucket called "my_bucket" to the dataset:
dataset.add_external_files(
  source_url="s3://my/bucket/", 
  wildcard = "*.jpg",
  dataset_path="/my_dataset/new_folder/"
)
```

### remove_files()
To remove files from a current dataset, use [`Dataset.remove_files()`](../references/sdk/dataset.md#remove_files).
Input the path to the folder or file to be removed in the `dataset_path` parameter. The path is relative to the dataset.
To remove links, specify their URL (for example, `s3://bucket/file`).

You can also input a wildcard into `dataset_path` to remove a set of files matching the wildcard. 
Set the `recursive` parameter to `True` to match all wildcard files recursively

For example:

```python
dataset.remove_files(dataset_path="*.csv", recursive=True)
```

## Dataset Preview

Add informative metrics, plots, or media to the Dataset. Use [`Dataset.get_logger()`](../references/sdk/dataset.md#get_logger)
to access the dataset's logger object, then add any additional information to the dataset, using the methods
available with a [`Logger`](../references/sdk/logger.md) object. 

You can add some dataset summaries (like [table reporting](../references/sdk/logger.md#report_table)) to create a preview 
of the data stored for better visibility, or attach any statistics generated by the data ingestion process. 

For example: 

```python
# Attach a table to the dataset
dataset.get_logger().report_table(
    title="Raw Dataset Metadata", series="Raw Dataset Metadata", csv="path/to/csv"
)

# Attach a historgram to the table
dataset.get_logger().report_histogram(
    title="Class distribution",
    series="Class distribution",
    values=histogram_data,
    iteration=0,
    xlabels=histogram_data.index.tolist(),
    yaxis="Number of samples",
)
```

## Uploading Files

To upload the dataset files to network storage, use [`Dataset.upload()`](../references/sdk/dataset.md#upload). 

Use the `output_url` parameter to specify storage target, such as S3 / GS / Azure. For example:
* A shared folder: `/mnt/share/folder`
* S3: `s3://bucket/folder`
* Non-AWS S3-like services (such as MinIO): `s3://host_addr:port/bucket`. **Note that port specification is required**. 
* Google Cloud Storage: `gs://bucket-name/folder`
* Azure Storage: `azure://<account name>.blob.core.windows.net/path/to/file`

By default, the dataset uploads to ClearML's file server. This target storage overrides the `output_uri` value of 
[`Dataset.create()`](#creating-datasets).    

ClearML supports parallel uploading of datasets. Use the `max_workers` parameter to specify the number of threads to use 
when uploading the dataset. By default, it's the number of your machine's logical cores.

Dataset files must be uploaded before a dataset is [finalized](#finalizing-a-dataset). 


## Finalizing a Dataset

Use [`Dataset.finalize()`](../references/sdk/dataset.md#finalize) to close the current dataset. This marks the 
dataset task as *Completed*, at which point, the dataset can no longer be modified. 

Before closing a dataset, its files must first be [uploaded](#uploading-files).


## Syncing Local Storage

Use [`Dataset.sync_folder()`](../references/sdk/dataset.md#sync_folder) in order to update a dataset according
to a specific folder's content changes. Specify the folder to sync with the `local_path` parameter (the method assumes all files within the folder and recursive). 

This method is useful in the case where there's a single point of truth, either a local or network folder, that gets updated periodically. 
The folder changes will be reflected in a new dataset version. This method saves time since you don't have to manually 
update (add / remove) files in a dataset.

## Deleting Datasets
Delete a dataset using the [`Dataset.delete()`](../references/sdk/dataset.md#datasetdelete) class method. Input any of the 
attributes of the dataset(s) you want to delete, including ID, project name, version, and/or dataset name. Multiple 
datasets matching the query will raise an exception, unless you pass `entire_dataset=True` and `force=True`. In this 
case, all matching datasets will be deleted. 

If a dataset is a parent to a dataset(s), you must pass `force=True` in order to delete it. 

:::warning
Deleting a parent dataset may cause child datasets to lose data!
:::


```python
Dataset.delete(
  dataset_id=None,
  dataset_project="example project",
  dataset_name="example dataset", 
  force=False,  
  dataset_version="3.0",
  entire_dataset=False
) 
``` 

## Renaming Datasets
Rename a dataset using the [`Dataset.rename()`](../references/sdk/dataset.md#datasetrename) class method. All the datasets 
with the given `dataset_project` and `dataset_name` will be renamed.  

```python
Dataset.rename(
  new_dataset_name="New name",
  dataset_project="Example project", 
  dataset_name="Example dataset",  
)
```

## Moving Datasets to Another Project
Move a dataset to another project using the [`Dataset.move_to_project()`](../references/sdk/dataset.md#datasetmove_to_projetc) 
class method. All the datasets with the given `dataset_project` and `dataset_name` will be moved to the new dataset 
project. 

```python
Dataset.move_to_project(
  new_dataset_project="New project",
  dataset_project="Example project", 
  dataset_name="Example dataset",  
)
```

## Offline Mode

You can work with datasets in **Offline Mode**, in which all the data and logs are stored in a local session folder, 
which can later be uploaded to the [ClearML Server](../deploying_clearml/clearml_server.md). 

You can enable offline mode in one of the following ways:
* Before creating a dataset, use [`Dataset.set_offline()`](../references/sdk/dataset.md#datasetset_offline) and set the 
  `offline_mode` argument to `True`: 

  ```python
  from clearml import Dataset
  
  # Use the set_offline class method before creating a Dataset
  Dataset.set_offline(offline_mode=True)
  # Create a dataset
  dataset = Dataset.create(dataset_name="Dataset example", dataset_project="Example project")
  # add files to dataset
  dataset.add_files(path='my_image.jpg')
  ```
  
* Before creating a dataset, set `CLEARML_OFFLINE_MODE=1`

All the dataset's information is zipped and is saved locally.

The dataset task's console output displays the task's ID and a path to the local dataset folder:

```
ClearML Task: created new task id=offline-372657bb04444c25a31bc6af86552cc9
...
...
ClearML Task: Offline session stored in /home/user/.clearml/cache/offline/b786845decb14eecadf2be24affc7418.zip
```

Note that in offline mode, any methods that require communicating with the server have no effect (such as `squash()`, 
`finalize()`, `get_local_copy()`, `get()`, `move_to_project()`, etc.). 

Upload the offline dataset to the ClearML Server using [`Dataset.import_offline_session()`](../references/sdk/dataset.md#datasetimport_offline_session). 
In the `session_folder_zip` argument, insert the path to the zip folder containing the dataset. To [upload](#uploading-files) 
the dataset's data to network storage, set `upload` to `True`.  To [finalize](#finalizing-a-dataset) the dataset, 
which will close it and prevent further modifications to the dataset, set `finalize` to `True`. 

```python
Dataset.import_offline_session(session_folder_zip="<path_to_offline_dataset>", upload=True, finalize=True)
```

