---
title: Sources
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

Each [Data Sub-Entry](data_entries.md#data-sub-entries) points to raw data through a `source` URI, and optionally
a `preview_source` URI used by the WebApp (UI). For image sub-entries, it can also point to one or more
[mask sources](masks.md).

## Setting a Source

Provide `source` (and, optionally, `preview_source`) when constructing a sub-entry:

```python
from clearml import DataSubEntryImage

sub_entry = DataSubEntryImage(
    name='image_entry_0',
    source='s3://my/bucket/path_to_file.jpg',
    preview_source='s3://my/bucket/path_to_file.jpg',
)
```

Read a sub-entry's sources with the read-only `source` and `preview_source` properties. To update a source, use
[`set_source()`](../../references/sdk/hpd_datasubentry.md#set_source), passing `source_field='source'` or
`source_field='preview_source'` to specify which source you're updating.
[`get_source()`](../../references/sdk/hpd_datasubentry.md#get_source) reads a source the same way:

```python
sub_entry.set_source(source_field='source', uri='s3://my/bucket/new_path.jpg')

new_source = sub_entry.get_source(source_field='source')
```

Mask sources have their own methods. See [Masks](masks.md).

## Local Sources

If a sub-entry's `source` points to a local file, use [`set_local_sources_upload_destination()`](../../references/sdk/hpd_datasubentry.md#set_local_sources_upload_destination)
to tell the sub-entry where to upload that file before registering it:

```python
sub_entry.set_local_sources_upload_destination('s3://my-bucket/uploads')
```

If you're registering entries with [`HyperDataset.add_data_entries()`](data_entries.md#adding-data-entries-to-a-hyperdataset),
you don't need to set this per sub-entry. Pass `upload_local_files_destination` to that call instead, and it's
applied as the upload destination for every local-file source in the batch.

To download a sub-entry's source to a local cache and get its local path (for example, when iterating a
[`DataView`](dataviews.md)), use [`get_local_source()`](../../references/sdk/hpd_datasubentry.md#get_local_source):

```python
local_path = sub_entry.get_local_source()
```

Pass `force_download=True` to bypass the local cache and re-download the file, or `raise_on_error=True` to raise
instead of returning `None` on failure.

