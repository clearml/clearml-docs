---
title: FrameGroups
---

:::important[Legacy Interface]
This page describes the legacy `allegroai` Python package.
For the current interface, available through the `clearml` Python package (v2.1 and above), see [Hyper-Datasets](overview.md).
:::

The ClearML Enterprise provides **FrameGroup**s as an easy-to-use type of frame supporting multiple sources. 
Add a list of SingleFrames to a FrameGroup, and then register FrameGroups in a Dataset version. 
[View and edit](webapp/webapp_datasets_frames.md) FrameGroups and the SingleFrames they contain 
in the ClearML Enterprise WebApp (UI).

A SingleFrame is composed of metadata for raw data that is harvested at a specific point in time for a 
specific spatial area, as well as additional metadata such as annotations and masks. Therefore, a **FrameGroup** combines 
more than one set of raw data and its additional metadata for the same point in time.

For example, use FrameGroups for the following:

* Multiple cameras on an autonomous car - A FrameGroup composed of SingleFrames for each camera.
* Multiple sensors on a machine detecting defects - A FrameGroup composed of SingleFrames for each sensor.


## Usage

### Creating a FrameGroup

A FrameGroup is like a dictionary of SingleFrames. Instantiate a FrameGroup and a SingleFrame. Then add the SingleFrame
object into the FrameGroup, with the key being the name of the SingleFrame, and the value being the SingleFrame object. 

```python
from allegroai import FrameGroup, SingleFrame

# Create a FrameGroup object
frame_group = FrameGroup()

# Create a SingleFrame
frame = SingleFrame(
    source='https://allegro-datasets.s3.amazonaws.com/tutorials/000012.jpg', 
    width=512, height=512, 
    preview_uri='https://allegro-datasets.s3.amazonaws.com/tutorials/000012.jpg'
)
    
# Add the first SingleFrame to the FrameGroup.
frame_group['FrameOne'] = frame
```

### Adding FrameGroups to a Dataset Version

To add FrameGroups to a Dataset Version: 
1. Create a FrameGroup object

1. Add SingleFrames to the FrameGroup, where the key of each SingleFrame in the FrameGroup is the SingleFrame's name
  
1. Append the FrameGroup object to a list of frames
  
1. Add that list to a DatasetVersion using the [`DatasetVersion.add_frames()`](../references/hyperdataset/hyperdatasetversion.md#add_frames) 
method. Use the `upload_retries` parameter to set the number of times the upload of a frame should be retried in case of 
failure, before marking the frame as failed and continuing to upload the next frames. In the case that a single frame in 
the FrameGroup fails to upload, the entire group will not be registered. The method returns a list of frames that were 
not successfully registered or uploaded. 

```python
# Create a FrameGroup object
frame_group = FrameGroup()

# Create SingleFrame
single_frame = SingleFrame(
    source='https://allegro-datasets.s3.amazonaws.com/tutorials/000012.jpg'
)

# Add the first SingleFrame to the FrameGroup.
frame_group['FrameOne'] = single_frame

# The DatasetVersion.add_frames requires a list of frames.
frames = []

frames.append(frame_group)
# Add the FrameGroup to the version
myVersion.add_frames(frames)
```

### Accessing a FrameGroup

To access a FrameGroup, use [`DatasetVersion.get_single_frame()`](../references/hyperdataset/hyperdatasetversion.md#datasetversionget_single_frame), 
just like when [accessing a SingleFrame](single_frames.md#accessing-singleframes):

```python
# Get the FrameGroup
frame_group = DatasetVersion.get_single_frame(
    frame_id='f3ed0e09bf23fc947f426a0d254c652c', 
    dataset_name='MyDataset', 
    version_name='FrameGroup'
)
```

### Updating FrameGroups

Updating FrameGroups is similar to [updating SingleFrames](single_frames.md#updating-singleframes), except that each 
SingleFrame needs to be referenced using its name as the key in the FrameGroup.

```python
frames = []                

# Get the FrameGroup
frame_group = DatasetVersion.get_single_frame(
    frame_id='f3ed0e09bf23fc947f426a0d254c652c', 
    dataset_name='MyDataset', 
    version_name='FrameGroup'
)
        
# Add metadata by referencing the name of the SingleFrame in the FrameGroup
frame_group['FrameOne'].metadata['new_key'] = 'new_value'
    
# Update change to the FrameGroup 
frames.append(frame_group)
myVersion.update_frames(frames)                

```    
   
### Deleting Frames

To delete a FrameGroup, use the [`DatasetVersion.delete_frames()`](../references/hyperdataset/hyperdatasetversion.md#delete_frames) 
method, just like when deleting a SingleFrame, except that a FrameGroup is being referenced.

```python
frames = []                

# Get the FrameGroup
frame_group = DatasetVersion.get_single_frame(
    frame_id='f3ed0e09bf23fc947f426a0d254c652c', 
    dataset_name='MyDataset', 
    version_name='FrameGroup'
)

# Delete the FrameGroup
frames.append(frame_group)
myVersion.delete_frames(frames)
```    
