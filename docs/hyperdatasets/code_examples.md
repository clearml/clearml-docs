---
title: Code Examples
---

The following examples demonstrate registering, retrieving, and ingesting your data through the Hyper-Datasets python 
interface. 

## Registering your Data
* [register_dataset_with_roi.py](https://github.com/allegroai/clearml/blob/master/examples/hyperdatasets/data-registration/register_dataset_with_roi.py) - Demonstrates 
creating a new DatasetVersion and adding to it frames, supporting ROI annotations and metadata
* [register_dataset_masks.py](https://github.com/allegroai/clearml/blob/master/examples/hyperdatasets/data-registration/register_dataset_masks.py) - Demonstrates 
creating a new DatasetVersion and adding to it frames containing masks. This example also demonstrates the 
DatasetVersion-level [pixel segmentation masks](masks.md#pixel-segmentation-masks).

After executing either of these scripts, you can view your DatasetVersion contents and details in the UI.   

## Using your Data
### Dataviews
The [dataview_example_framegroup.py](https://github.com/allegroai/clearml/blob/master/examples/hyperdatasets/data-ingestion/dataview_example_framegroup.py) 
and [dataview_example_singleframe.py](https://github.com/allegroai/clearml/blob/master/examples/hyperdatasets/data-ingestion/dataview_example_singleframe.py) 
examples demonstrate how to use a [DataView](dataviews.md) to retrieve your data as SingleFrames and FrameGroups as 
part of a running task. This is done by creating a DataView query and then retrieving the corresponding frames.

DataView details are displayed in the UI in a task's **DATAVIEWS** tab. 


### Data Ingestion
The [pytorch_dataset_example.py](https://github.com/allegroai/clearml/blob/master/examples/hyperdatasets/data-ingestion/pytorch_dataset_example.py) 
example demonstrates how to feed your DataViews to an ML framework by creating a DataView query and wrapping it as a 
PyTorch Dataset.

The [pytorch_dataset_example_with_masks.py](https://github.com/allegroai/clearml/blob/master/examples/hyperdatasets/data-ingestion/pytorch_dataset_example_with_masks.py) 
example demonstrates the additional actions required when your frames contain masks.