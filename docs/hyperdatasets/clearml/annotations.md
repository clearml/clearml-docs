---
title: Annotations
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

With ClearML Enterprise, annotations can be applied to video and image data. There are three ways to attach an
annotation, depending on what it should apply to:

* [Sub-Entry Annotations](#sub-entry-annotations) - Labeled Regions of Interest (ROIs) on a single
  [Data Sub-Entry](data_entries.md#data-sub-entries)
* [Entry-Level Annotations](#entry-level-annotations) - Labels applied to an entire `DataEntry`, not a region
  (analogous to legacy "Frame labels")
* [Global Annotations](#global-annotations) - Annotations applied across every sub-entry of a
  `DataEntryImage`

Annotation Tasks can be used to efficiently organize the annotation of data entries in HyperDataset versions (see
[Annotation Tasks](../webapp/webapp_annotator.md)). For information about how to view, create, and manage
annotations using the WebApp, see [Annotating Images and Videos](../webapp/webapp_annotator.md#annotating-images-and-video).

## Sub-Entry Annotations

Sub-entry annotations are labeled Regions of Interest (ROIs), which can be bounded by bounding boxes, polygons, ellipses, or key points. 
These ROIs are useful for object detection, classification, or semantic
segmentation.

To add a sub-entry annotation, use [`DataSubEntryImage.add_annotation()`](../../references/sdk/hpd_datasubentryimage.md#add_annotation):

```python
# a bounding box labeled "car" at x=10,y=10 with width of 30px and height of 20px
sub_entry.add_annotation(box2d_xywh=(10, 10, 30, 20), labels=['car'])
```

The `box2d_xywh` argument specifies the coordinates of the annotation's bounding box, and the `labels` argument
specifies a list of labels for the annotation.

Enter the annotation's boundaries in one of the following ways:
* `poly2d_xy` - A list of floating points (x,y) to create a single polygon, or a list of floating point lists for
  a complex polygon.
* `poly3d_xyz` / `points2d_xy` / `points3d_xyz` / `box3d_xyzwhxyzwh` - 3D and point-based alternatives.
* `ellipse2d_xyrrt` - A list consisting of cx, cy, rx, ry, and theta for an ellipse.
* `mask_rgb` - An RGB value tying the annotation to a [mask](masks.md).

You can also pass `confidence` (a float between 0 and 1.0) and `metadata` (see [Custom Metadata](custom_metadata.md)).
See [`DataSubEntryImage.add_annotation`](../../references/sdk/hpd_datasubentryimage.md#add_annotation)
for the full list of options.

Read annotations back with [`get_all_annotations()`](../../references/sdk/hpd_datasubentryimage.md#get_all_annotations) 
or [`DataSubEntryImage.get_annotations()`](../../references/sdk/hpd_datasubentryimage.md#get_annotations).

To remove annotations:
* Remove a single annotation with [`DataSubEntryImage.remove_annotation()`](../../references/sdk/hpd_datasubentryimage.md#remove_annotation), 
  by index or by `id`.
* Remove multiple annotations with [`DataSubEntryImage.remove_annotations()`](../../references/sdk/hpd_datasubentryimage.md#remove_annotations), 
  by `id`, `label`, or `labels`.

## Entry-Level Annotations

Entry-level annotations apply to an entire `DataEntry`, not a region within it. They are the equivalent of the old
"Frame labels". Use [`DataEntry.add_annotation()`](../../references/sdk/hpd_dataentry.md#add_annotation) and
specify only `labels` (no geometry):

```python
# labels for the whole entry
entry.add_annotation(labels=['frame level label one', 'frame level label two'])
```

## Global Annotations

Add a global annotation that applies to every sub-entry of a `DataEntryImage`, using
[`DataEntryImage.add_global_annotation()`](../../references/sdk/hpd_dataentryimage.md#add_global_annotation):

```python
entry.add_global_annotation(labels=['cityscape'], confidence=1.0)
```

`add_global_annotation()` accepts the same annotation parameters as
[`DataSubEntryImage.add_annotation()`](#sub-entry-annotations), and returns the list of annotation indices created
on each sub-entry. Use `remove_global_annotation()`/`remove_global_annotations()` to remove them, and
`get_all_global_annotations()`/`get_global_annotations()` to read them back.
