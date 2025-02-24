---
title: Managing Your Data
---

Data is probably one of the biggest factors that determines the success of a project. Associating a model's data with
the model's configuration, code, and results (such as accuracy) is key to deducing meaningful insights into model behavior.

[ClearML Data](../clearml_data/clearml_data.md) lets you:
* Version your data
* Fetch your data from every machine with minimal code changes
* Use the data with any other task
* Associate data to task results.

ClearML offers the following data management solutions:

* `clearml.Dataset` - A Python interface for creating, retrieving, managing, and using datasets. See [SDK](../clearml_data/clearml_data_sdk.md) 
  for an overview of the basic methods of the Dataset module.
* `clearml-data` - A CLI utility for creating, uploading, and managing datasets. See [CLI](../clearml_data/clearml_data_cli.md) 
  for a reference of `clearml-data` commands.
* Hyper-Datasets - ClearML's advanced queryable dataset management solution. For more information, see [Hyper-Datasets](../hyperdatasets/overview.md)

The following guide will use both the `clearml-data` CLI and the `Dataset` class to do the following:
1. Create a ClearML dataset 
2. Access the dataset from a ClearML Task in order to preprocess the data
3. Create a new version of the dataset with the modified data 
4. Use the new version of the dataset to train a model

## Creating Dataset

Let's assume you have some code that extracts data from a production database into a local folder.
Your goal is to create an immutable copy of the data to be used by further steps.

1. Create the dataset using the `clearml-data create` command and passing the dataset's project and name. You can add a 
   `latest` tag, making it easier to find it later.

    ```bash
    clearml-data create --project chatbot_data --name dataset_v1 --latest
    ```

1. Add data to the dataset using `clearml-data sync` and passing the path of the folder to be added to the dataset.
   This command also uploads the data and finalizes the dataset automatically.

    ```bash
    clearml-data sync --folder ./work_dataset 
    ```


## Preprocessing Data
The second step is to preprocess the data. First access the data, then modify it,
and lastly create a new version of the data.

1. Create a task for you data preprocessing (not required):
   
   ```python
   from clearml import Task, Dataset

   # create a task for the data processing
   task = Task.init(project_name='data', task_name='create', task_type='data_processing')
   ``` 

1. Access a dataset using [`Dataset.get()`](../references/sdk/dataset.md#datasetget):

   ```python
   # get the v1 dataset
   dataset = Dataset.get(dataset_project='data', dataset_name='dataset_v1')
   ``` 
1. Get a local mutable copy of the dataset using [`Dataset.get_mutable_local_copy`](../references/sdk/dataset.md#get_mutable_local_copy). \
   This downloads the dataset to a specified `target_folder` (non-cached). If the folder already has contents, specify 
   whether to overwrite its contents with the dataset contents using the `overwrite` parameter.

   ```python
   # get a local mutable copy of the dataset
   dataset_folder = dataset.get_mutable_local_copy(
       target_folder='work_dataset', 
       overwrite=True
   )
   ```

1. Preprocess the data, including modifying some files in the `./work_dataset` folder.

1. Create a new version of the dataset: 

   ```python
   # create a new version of the dataset with the pickle file
   new_dataset = Dataset.create(
       dataset_project='data', 
       dataset_name='dataset_v2', 
       parent_datasets=[dataset], 
       # this will make sure we have the creation code and the actual dataset artifacts on the same Task 
       use_current_task=True,
   )

1. Add the modified data to the dataset: 

   ```python
   new_dataset.sync_folder(local_path=dataset_folder)
   new_dataset.upload()
   new_dataset.finalize()
   ```

1. Remove the `latest` tag from the previous dataset and add the tag to the new dataset:
   ```python
   # now let's remove the previous dataset tag
   dataset.tags = []
   new_dataset.tags = ['latest']
   ```

The new dataset inherits the contents of the datasets specified in `Dataset.create`'s `parent_datasets` argument.
This not only helps trace back dataset changes with full genealogy, but also makes the storage more efficient,
since it only stores the changed and/or added files from the parent versions.
When you access the dataset, it automatically merges the files from all parent versions 
in a fully automatic and transparent process, as if the files were always part of the requested Dataset.

## Training
You can now train your model with the **latest** dataset you have in the system, by getting the instance of the Dataset 
based on the `latest` tag (if you have two Datasets with the same tag you will get the newest).
Once you have the dataset you can request a local copy of the data. All local copy requests are cached,
which means that if you access the same dataset multiple times you will not have any unnecessary downloads.

```python
# create a task for the model training
task = Task.init(project_name='data', task_name='ingest', task_type='training')

# get the latest dataset with the tag `latest`
dataset = Dataset.get(dataset_tags='latest')

# get a cached copy of the Dataset files 
dataset_folder = dataset.get_local_copy()

# train model here
```