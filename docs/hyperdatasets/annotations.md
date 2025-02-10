---
title: Annotations
---

With ClearML Enterprise, annotations can be applied to video and image frames. [Frames](single_frames.md) support 
two types of annotations: **Frame objects** and **Frame labels**.

Annotation Tasks can be used to efficiently organize the annotation of frames in Hyper-Dataset versions (see 
[Annotation Tasks](webapp/webapp_annotator.md)).  

For information about how to view, create, and manage annotations using the WebApp, see [Annotating Images and Videos](webapp/webapp_annotator.md#annotating-images-and-video).

## Frame Objects

Frame objects are labeled Regions of Interest (ROIs), which can be bounded by polygons (including rectangles), ellipses, 
or key points. These ROIs are useful for object detection, classification, or semantic segmentation. 

Frame objects can include ROI labels, confidence levels, and masks for semantic segmentation. In ClearML Enterprise, 
one or more labels and sources dictionaries can be associated with an ROI (although multiple source ROIs are not frequently used).

## Frame Labels

Frame labels are applied to an entire frame, not a region in a frame.


## Usage

### Adding a Frame Object

To add a frame object annotation to a SingleFrame, use [`SingleFrame.add_annotation()`](../references/hyperdataset/singleframe.md#add_annotation): 

```python
# a bounding box labeled "test" at x=10,y=10 with width of 30px and height of 20px
frame.add_annotation(box2d_xywh=(10, 10, 30, 20), labels=['test'])
```

The `box2d_xywh` argument specifies the coordinates of the annotation's bounding box, and the `labels` argument specifies
a list of labels for the annotation.

Enter the annotation's boundaries in one of the following ways: 
* `poly2d_xy` - A list of floating points (x,y) to create a single polygon, or a list of floating points lists for a 
  complex polygon.
* `ellipse2d_xyrrt` - A List consisting of cx, cy, rx, ry, and theta for an ellipse. 
* And more! See [`SingleFrame.add_annotation`](../references/hyperdataset/singleframe.md#add_annotation) for further options. 

### Adding a Frame Label

Adding a frame label is similar to creating a frame object, except that coordinates don't need to be specified, since 
the whole frame is being referenced. 

Use [`SingleFrame.add_annotation()`](../references/hyperdataset/singleframe.md#add_annotation), but specify only the 
`labels` parameter:

```python
# labels for the whole frame        
frame.add_annotation(labels=['frame level label one','frame level label two'])
```

### Adding a Global Annotation

Add a global annotation that will apply to all frames in a FrameGroup.

Use [`FrameGroup.add_global_annotation()`](../references/hyperdataset/framegroup.md#add_global_annotation) and specify 
the [Annotation](../references/hyperdataset/annotation.md) object to add to each frame:

```python
annotation = ImageAnnotation(labels=["cityscape"], confidence=1.0000,)
frame_group.add_global_annotation(annotation=annotation)
```
