---
title: Frames Overview
---

:::important[Legacy Interface]
This page describes the legacy `allegroai` Python package.
For the current interface, available through the `clearml` Python package (v2.1 and above), see [Hyper-Datasets](overview.md).
:::

The concept of a **Frame** represents the basic building block of data in ClearML Enterprise. 

Two types of frames are supported:

* [SingleFrames](single_frames.md) - A frame with one source. For example, one image.
* [FrameGroups](frame_groups.md) - A frame with multiple sources. For example, multiple images.

**SingleFrames** and **FrameGroups** contain data sources, metadata, and other data. A Frame can be added to [Datasets](dataset.md) 
and then modified or removed. [Versions](dataset.md#dataset-versioning) of the Datasets can be created, which enables 
documenting changes and reproducing data for tasks. 
