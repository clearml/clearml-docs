---
title: Custom Metadata
---

:::important[Legacy Interface]
This page describes the legacy `allegroai` Python package.
For the current interface, available through the `clearml` Python package (v2.1 and above), see [Hyper-Datasets](overview.md).
:::

Metadata can be customized as needed using: **meta** dictionaries: 
* As a top-level key for metadata applying to entire frame
* In `rois` dictionaries, for metadata applying to individual ROIs.

## Usage 

### Adding Frame Metadata

When instantiating a `SingleFrame`, metadata that applies to the entire frame can be
added as an argument:

```python
from allegroai import SingleFrame

# create a frame with metadata
frame = SingleFrame(
    source='https://allegro-datasets.s3.amazonaws.com/tutorials/000012.jpg',
    preview_uri='https://allegro-datasets.s3.amazonaws.com/tutorials/000012.jpg',
    # insert metadata dictionary
    metadata={'alive':'yes'}, 
)

# add metadata to the frame
frame.metadata['dangerous'] = 'no'
```

### Adding ROI Metadata

Metadata can be added to individual ROIs when adding an annotation to a `frame`, using [`SingleFrame.add_annotation()`](../references/hyperdataset/singleframe.md#add_annotation): 

```python
frame.add_annotation(
    box2d_xywh=(10, 10, 30, 20), 
    labels=['tiger'],
    # insert metadata dictionary
    metadata={'dangerous':'yes'}
)
```