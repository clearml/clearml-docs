---
title: Previews
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

Previews are optional images or videos that can be used in the ClearML Enterprise WebApp (UI) to help visualize
content in a HyperDataset.

They are useful for displaying images with formats that cannot be rendered in a web browser (such as TIFF and 3D
formats), or to provide an alternative visual representation of the data.

On a [Data Sub-Entry](data_entries.md#data-sub-entries), `source` typically points to the original raw data used
for training or experimentation, while `preview_source` is intended for display in the UI.

Previews appear in the following WebApp pages:
* [Dataset version page](../webapp/webapp_datasets_versioning.md): As thumbnails representing each entry in the
  dataset version. If a `preview_source` is provided, it's used for the thumbnail; otherwise, the sub-entry's
  source is shown.

  ![Previews](../../img/hyperdatasets/dataset_versions.png#light-mode-only)
  ![Previews](../../img/hyperdatasets/dataset_versions_dark.png#dark-mode-only)

  If `preview_source` points to a video, the thumbnail includes video controls:

  ![Video previews](../../img/hyperdatasets/video_preview.png#light-mode-only)
  ![Video previews](../../img/hyperdatasets/video_preview_dark.png#dark-mode-only)

* [Frame viewer](../webapp/webapp_datasets_frames.md): When inspecting a single entry, the frame viewer lets you
  toggle between `source` and `preview_source` if both are provided and differ. If no `preview_source` is
  provided, the sub-entry's source is shown.

  ![Use source toggle](../../img/hyperdatasets/source_preview.png#light-mode-only)
  ![Use source toggle](../../img/hyperdatasets/source_preview_dark.png#dark-mode-only)

## Usage

### Registering a Sub-Entry with a Preview

Set `preview_source` when constructing a sub-entry. For example, a sub-entry whose `source` is a TIFF file (which
browsers can't render) can set `preview_source` to a JPEG rendering of the same image:

```python
from clearml import DataSubEntryImage

sub_entry = DataSubEntryImage(
    source='https://acme-datasets.s3.amazonaws.com/scans/000012.tiff',
    width=512, height=512,
    preview_source='https://acme-datasets.s3.amazonaws.com/previews/000012.jpg',
)
```

Afterward, read it with the read-only `preview_source` property. To update it, use
[`set_source()`](../../references/sdk/hpd_datasubentry.md#set_source) with `source_field='preview_source'`:

```python
sub_entry.set_source(source_field='preview_source', uri='s3://my/bucket/new_preview.jpg')
```

### Accessing Previews Locally

To download a sub-entry's preview to a local cache and get its local path, use
[`get_local_preview_source()`](../../references/sdk/hpd_datasubentry.md#get_local_preview_source):

```python
local_preview_path = sub_entry.get_local_preview_source()
```
