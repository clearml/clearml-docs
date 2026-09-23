---
title: Data Entries
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

A **Data Entry** is the basic unit of data in a HyperDataset. A `DataEntry`
contains one or more **Data Sub-Entries**, each pointing to a [source file](sources.md) (raw data)
and carrying its own metadata and annotations.

This replaces the old `SingleFrame`/`FrameGroup` split: 
* A `DataEntry` with a single sub-entry corresponds to a `SingleFrame`.
* A `DataEntry` with multiple sub-entries corresponds to a `FrameGroup`.

## Entry Types

* [`DataEntry`](../../references/sdk/hpd_dataentry.md) / [`DataSubEntry`](../../references/sdk/hpd_datasubentry.md) -
  Generic, source-agnostic entry and sub-entry. Use these directly for non-image data, or subclass them to add
  domain-specific fields (see [Extending Data Entries](#extending-data-entries)).
* [`DataEntryImage`](../../references/sdk/hpd_dataentryimage.md) / [`DataSubEntryImage`](../../references/sdk/hpd_datasubentryimage.md) -
  Image-specialized entry and sub-entry, adding width/height, timestamp, `context_id`, per-sub-entry
  [masks](masks.md), and [ROI/global annotations](annotations.md).

## Data Entry Components

A `DataEntry` (or `DataEntryImage`) contains the following components:
* One or more [Data Sub-Entries](#data-sub-entries), each with a name, a [source](sources.md), and an optional
  [preview source](previews.md)
* [Annotations](annotations.md) - Entry-level annotations. `DataEntryImage` also supports per-sub-entry ROI annotations 
  and global annotations that apply to all sub-entries.
* `metadata` - A dictionary of [custom metadata](custom_metadata.md) for the entry. Each sub-entry can also have its 
  own metadata.

### Data Sub-Entries

Each named sub-entry in a `DataEntry` points to one source file (for example, one image, one video, or one
sensor's raw data). 

Use multiple named sub-entries on the same `DataEntry` to group data captured at the same
point in time. For example:

* Multiple cameras on an autonomous car - a `DataEntryImage` with one named `DataSubEntryImage` per camera.
* Multiple sensors on a machine detecting defects - a `DataEntry` with one named `DataSubEntry` per sensor.

### Context ID

For `DataSubEntryImage`, the `context_id` identifies a shared context across multiple
`DataEntryImage` objects. For example, you can assign the same `context_id` to consecutive frames from the same video, 
while each frame has its own `timestamp`.

When a `DataEntryImage` contains multiple sub-entries, the context_id is taken from the first sub-entry. 
If different sub-entries have different context_id values, only the first sub-entry's value is used for 
the entry.

The WebApp can use the context ID to group related entries when displaying a dataset version in the frame browser.
Select **Group by URL** to display a single preview for sub-entries that share
the same context ID. This is useful for video data; assign the same context ID to all frames from the same video,
then view them in order in the frame viewer.

## Usage

### Creating a Data Entry

Instantiate a [`DataEntryImage`](../../references/sdk/hpd_dataentryimage.md) and one or more
[`DataSubEntryImage`](../../references/sdk/hpd_datasubentryimage.md) objects, then attach the sub-entries to the
entry:

```python
from clearml import DataEntryImage, DataSubEntryImage

entry = DataEntryImage(metadata={'alive': 'yes'})

sub_entry = DataSubEntryImage(
    name='image_entry_0',
    source='s3://my/bucket/path_to_file.jpg',
    preview_source='s3://my/bucket/path_to_file.jpg',
    width=512,
    height=512,
)

entry.add_sub_entries([sub_entry])
```

You can attach multiple named sub-entries to the same entry:

```python
front = DataSubEntryImage(name='front', source='https://s3.amazonaws.com/my_cars/car_1/front.jpg')
rear = DataSubEntryImage(name='rear', source='https://s3.amazonaws.com/my_cars/car_1/rear.jpg')

entry = DataEntryImage()
entry.add_sub_entries([front, rear])
```

Sub-entries are identified by name, so each sub-entry in an entry needs a unique name. Adding a sub-entry whose
name is already in use replaces the existing one. 

`DataSubEntryImage` defaults to `name='image_entry_0'`. When an entry contains multiple sub-entries, assign each one an 
explicit name.

For non-image data, use [`DataEntry`](../../references/sdk/hpd_dataentry.md) and
[`DataSubEntry`](../../references/sdk/hpd_datasubentry.md) the same way.

### Adding Data Entries to a HyperDataset

Use [`HyperDataset.add_data_entries()`](../../references/sdk/hpd_hyperdataset.md#add_data_entries) to
upload local sources and register a list of entries against a [Draft version](hyperdataset.md#hyperdataset-version-state):

```python
errors = hyperdataset.add_data_entries(
    [entry],
    upload_local_files_destination='s3://my-bucket/uploads',
)
```

`add_data_entries()` uploads any local file sources referenced by the entries' sub-entries and registers the entries in 
batches, returning a dictionary describing any upload or registration errors, keyed by entry ID. On success, it 
automatically commits the version so its statistics are refreshed (see
[HyperDataset Version State](hyperdataset.md#hyperdataset-version-state)). See the
[reference](../../references/sdk/hpd_hyperdataset.md#add_data_entries) for parameters that control
upload retries, parallelism, re-uploading, request size, and progress display.

### Retrieving Data Entries

To iterate over all of a version's entries, use
[`HyperDataset.get_iterator()`](../../references/sdk/hpd_hyperdataset.md#get_iterator):

```python
for entry in hyperdataset.get_iterator():
    local_path = entry.sub_data_entries[0].get_local_source()
```

For filtered, weighted, or multi-version iteration, query a version with a [`DataView`](dataviews.md) instead. See
[Dataviews](dataviews.md#retrieving-entries) for details.

### Deleting Data Entries

Use [`HyperDataset.delete_data_entries()`](../../references/sdk/hpd_hyperdataset.md#delete_data_entries) to remove
entries from a [Draft version](hyperdataset.md#hyperdataset-version-state), passing either `DataEntry` objects
(for example, ones yielded by [`get_iterator()`](#retrieving-data-entries)) or entry ID strings:

```python
deleted_count = hyperdataset.delete_data_entries([entry])
```

Deleting automatically commits the version to refresh its statistics (pass `refresh_version_stats=False` to skip
this).

## Extending Data Entries

Because `DataEntry`/`DataSubEntry` (and their image-specialized counterparts) are Python classes, you can
subclass them to add domain-specific fields or helper methods, for example to attach a question/answer pair or an
embedding vector to each entry:

```python
from clearml import DataEntry, DataSubEntry

class QADataSubEntry(DataSubEntry):
    def __init__(self, *args, answer=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.answer = answer

class QADataEntry(DataEntry):
    def __init__(self, *args, question=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.question = question
```

Custom subclasses are preserved end to end: entries registered with
[`HyperDataset.add_data_entries()`](../../references/sdk/hpd_hyperdataset.md#add_data_entries) come
back from [`DataView.get_iterator()`](dataviews.md#retrieving-entries) as instances of that same subclass, not the
generic `DataEntry`/`DataSubEntry` base class.
