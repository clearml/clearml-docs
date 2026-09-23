---
title: Previews
---

:::important[Legacy Interface]
This page describes the legacy `allegroai` Python package.
For the current interface, available through the `clearml` Python package (v2.1 and above), see [Hyper-Datasets](overview.md).
:::

Previews are optional images or videos that can be used in the ClearML Enterprise
WebApp (UI) to help visualize selected content in a Hyper-Dataset.

They are useful for displaying images with formats that cannot be rendered in a web browser 
(such as TIFF and 3D formats), or to provide an alternative visual representation of the data.

In a Hyper-Dataset frame, the `source` typically points to the original raw data used for training or experimentation, 
while the `preview_uri` is intended for display in the UI.

Previews appear in the following WebApp pages: 
* [Dataset version page](webapp/webapp_datasets_versioning.md): As thumbnails representing each frame in the dataset version. 
  If a `preview_uri` is provided, it will be used for the thumbnail. Otherwise, the frame's source is shown. 
  
  ![Previews](../img/hyperdatasets/dataset_versions.png#light-mode-only)
  ![Previews](../img/hyperdatasets/dataset_versions_dark.png#dark-mode-only)

  If the `preview_uri` points to a video, the thumbnail includes video controls:

  ![Video previews](../img/hyperdatasets/video_preview.png#light-mode-only)
  ![Video previews](../img/hyperdatasets/video_preview_dark.png#dark-mode-only)
 
* [Frame viewer](webapp/webapp_datasets_frames.md): When inspecting a single frame, the frame viewer lets you toggle between the 
  `source` and the `preview_uri` if both are provided and differ. If no `preview_uri` is provided, the frame's source is 
  shown.  

  ![Use source toggle](../img/hyperdatasets/source_preview.png#light-mode-only)
  ![Use source toggle](../img/hyperdatasets/source_preview_dark.png#dark-mode-only)

## Usage

### Register Frames with a Preview 

To register a frame with a preview, set the `preview_uri` when creating the frame:

```python
# create dataset version
version = DatasetVersion.create_version(
 dataset_name="Example",
 version_name="Registering frame with preview"
)

frame = SingleFrame(
    source='https://acme-datasets.s3.amazonaws.com/tutorials/000012.jpg', 
    width=512, height=512, 
    preview_uri='https://acme-datasets.s3.amazonaws.com/images/000012.jpg'
)

# add frame to version
version.add_frames([frame])
```