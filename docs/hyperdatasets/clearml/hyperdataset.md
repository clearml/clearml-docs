---
title: HyperDatasets and Versions
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

ClearML Enterprise's **`HyperDataset`** class represents a dataset and provides the functionality for the
following purposes:
* Connecting source data to the ClearML Enterprise platform
* Using ClearML Enterprise's Git-like [dataset versioning](#hyperdataset-versioning)
* Feeding a task with a subset of one or more dataset versions, using [Dataviews](dataviews.md) to query, filter, and iterate over entries
* [Annotating](../webapp/webapp_datasets_frames.md#annotations) images and videos

A `HyperDataset` object is a handle bound to a specific dataset **version**. A dataset can have multiple
versions, which can have multiple children that inherit their parent's contents.

## HyperDataset Versioning

Dataset versioning refers to the group of ClearML Enterprise SDK and WebApp (UI) features for creating, modifying,
and deleting dataset versions.

ClearML Enterprise supports simple and advanced versioning workflows. 

A **simple version workflow** uses a
single evolving version, with historic static snapshots. Continuously push your changes to your single dataset
version, and [take a snapshot](#creating-snapshots) to record the content of your dataset at a specific point in time.

An **advanced workflow** uses multiple versions that can evolve independently through
[parent/child inheritance](#creating-child-versions). You can create child versions from published versions and 
independently modify or publish each child.

## HyperDataset Version State

Dataset versions can have either *Draft* or *Published* state.

A *Draft* version is editable. You can add, delete, and modify data entries and update the version's metadata and tags.

A *Published* version is read-only, which ensures reproducible tasks and preserves the version's contents. Child
versions can only be created from *Published* versions, as they inherit their predecessor version's contents.

## Usage

### Creating a HyperDataset

Instantiate the [`HyperDataset`](../../references/sdk/hpd_hyperdataset.md) class to create (or reuse) a 
dataset, version, and project. If the version already exists, the returned object is bound to it instead of
creating a duplicate.

```python
from clearml import HyperDataset

hyperdataset = HyperDataset(
    project_name='MyProject',
    dataset_name='MyDataset',
    version_name='Current',
    description='some description text',
)
```

To check whether a version already exists before creating it:

```python
exists = HyperDataset.exists(dataset_name='MyDataset', version_name='Current', project_name='MyProject')
```

:::tip[Vector search]
To make a version's metadata fields searchable by embedding vector, pass `field_mappings` when creating it. See
[Vector Search](vector_search.md).
:::

### Getting a HyperDataset

To get a handle to an existing dataset version without creating a new one, use
[`HyperDataset.get()`](../../references/sdk/hpd_hyperdataset.md#hyperdatasetget):

```python
from clearml import HyperDataset

hyperdataset = HyperDataset.get(dataset_name='MyDataset', version_name='Current', project_name='MyProject')
```

`HyperDataset.get()` also accepts `dataset_id`/`version_id` instead of names.

### Adding Data to a HyperDataset

Data entries are added to a *Draft* version with
[`HyperDataset.add_data_entries`](../../references/sdk/hpd_hyperdataset.md#add_data_entries). See
[Data Entries](data_entries.md) for details on constructing entries and how entries are uploaded and registered.

### Committing and Publishing a Version

Use [`commit_version()`](../../references/sdk/hpd_hyperdataset.md#commit_version) to refresh a *Draft* version's backend
statistics (for example, after adding data entries) without publishing it:

```python
hyperdataset.commit_version()
```

Use [`publish_version()`](../../references/sdk/hpd_hyperdataset.md#publish_version) to change a *Draft* version to 
*Published*, making it read-only:

```python
hyperdataset.publish_version()
```

### Creating Snapshots

If the dataset contains a single evolving (*Draft*) version, a snapshot of its current contents can be created with
[`HyperDataset.create_snapshot`](../../references/sdk/hpd_hyperdataset.md#create_snapshot). This is the
simple versioning workflow.

```python
snapshot = hyperdataset.create_snapshot()
```

After this call:
* The version that `hyperdataset` previously pointed to becomes a *Published* snapshot, keeping its original
  version ID. Its name follows the pattern `snapshot <timestamp>` (ISO 8601), for example
  `snapshot 2020-03-26T16:55:38.441671`. The `snapshot` object returned above is bound to this now-published version.
* The `hyperdataset` object itself is updated in place to point to a newly created *Draft* version (with a new
  version ID), so you can keep adding data entries to it without interruption.

Repeated calls to `create_snapshot()` build a linear chain of snapshots, each one the parent of the next.

### Creating Child Versions

For the advanced versioning structure, create a new version whose parent is any existing *Published* version, using
the `parent_id` argument. The child inherits its parent's data entries.

```python
parent = HyperDataset.get(dataset_name='MyDataset', version_name='PublishedVersion', project_name='MyProject')

child = HyperDataset(
    project_name='MyProject',
    dataset_name='MyDataset',
    version_name='NewChildVersion',
    parent_id=parent.version_id,
)
```

Only a single parent per version is supported.

### Adding Version Metadata

Store your own metadata on a HyperDataset version with
[`set_metadata()`](../../references/sdk/hpd_hyperdataset.md#set_metadata), and read it back with
[`get_metadata()`](../../references/sdk/hpd_hyperdataset.md#get_metadata):

```python
hyperdataset.set_metadata({'source': 'acme-corp', 'reviewed': True})

metadata = hyperdataset.get_metadata()
```

`set_metadata()` replaces any previously stored metadata rather than merging into it. It only works on a *Draft*
version. 

You can also set metadata on individual entries and sub-entries; see [Custom Metadata](custom_metadata.md).

### Organizing and Finding HyperDatasets

As datasets and versions accumulate, tag them to identify and group them, then use those tags (along with a
project and/or name filter) to find the ones you need.

```python
hyperdataset.add_tags(['coco', 'dogs'])
```

Tags can also be removed (`remove_tags`), replaced outright (`set_tags`), or read back (`get_tags`). See
[`HyperDataset`](../../references/sdk/hpd_hyperdataset.md) SDK reference for details.

List dataset collections matching a project, name, and/or tag filter with
[`HyperDataset.list`](../../references/sdk/hpd_hyperdataset.md#hyperdatasetlist):

```python
from clearml import HyperDataset

datasets = HyperDataset.list(project_name='MyProject', partial_name='My', tags=['coco'])
```

### Deleting HyperDatasets

Use [`HyperDataset.delete`](../../references/sdk/hpd_hyperdataset.md#hyperdatasetdelete) to remove a version or an 
entire dataset that's no longer needed:

* Delete a specific version whose status is *Draft*:

  ```python
  HyperDataset.delete(dataset_name='MyDataset', version_name='VersionToDelete')
  ```

* Delete a dataset even if it contains versions whose status is *Published* (omit `version_name` to delete the
  whole dataset and all its versions):

  ```python
  HyperDataset.delete(dataset_name='MyDataset', force=True)
  ```
