---
title: allegroai (Legacy)
---

:::important[Legacy Interface]
The `allegroai` Python package is a legacy SDK that is maintained for backwards compatibility.
Users are urged to move to newer versions of the `clearml` Python package. See the [Hyper-Datasets](overview.md)
overview for the current interface.
:::

Before version 2.1, ClearML Enterprise's Hyper-Datasets were accessed through the `allegroai` Python package:

* [Frames](frames.md)
    * [SingleFrames](single_frames.md)
    * [FrameGroups](frame_groups.md)
* [Datasets and Dataset Versions](dataset.md)
* [Dataviews](dataviews.md)

Frames are the basic units of data in ClearML Enterprise. SingleFrames and FrameGroups make up a Dataset version.
Dataset versions can be created, modified, and removed. The different versions are recorded and available,
so tasks, and their data are reproducible and traceable.

Lastly, Dataviews manage views of the dataset with queries, so a task's input data can be defined from a
subset of a Dataset or combinations of Datasets.
