---
title: Hyper-Datasets
---

:::important ENTERPRISE FEATURE
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

ClearML's Hyper-Datasets are an MLOps-oriented abstraction of your data, which facilitates traceable, reproducible model development
through parameterized data access and meta-data version control.

The basic premise is that a user-formed query is a full representation of the dataset used by the ML/DL process. 

ClearML **Enterprise**'s Hyper-Datasets supports rapid prototyping, creating new opportunities such as: 
* Hyperparameter optimization of the data itself
* QA/QC pipelining
* CD/CT (continuous training) during deployment
* Enabling complex applications like collaborative (federated) learning. 


## Hyper-Dataset Components 

A Hyper-Dataset is composed of the following components:

* [Frames](frames.md)
    * [SingleFrames](single_frames.md) 
    * [FrameGroups](frame_groups.md)
* [Datasets and Dataset Versions](dataset.md)
* [Dataviews](dataviews.md)

These components interact in a way that enables revising data and tracking and accessing all of its versions. 

Frames are the basic units of data in ClearML Enterprise. SingleFrames and FrameGroups make up a Dataset version. 
Dataset versions can be created, modified, and removed. The different versions are recorded and available, 
so experiments, and their data are reproducible and traceable. 

Lastly, Dataviews manage views of the dataset with queries, so a task's input data can be defined from a 
subset of a Dataset or combinations of Datasets.