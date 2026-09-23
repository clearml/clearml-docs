---
title: Code Examples
---

The following examples demonstrate registering, retrieving, and ingesting your data through the Hyper-Datasets Python 
interface. 

## clearml

### Registering your Data
* [create_coco_hyperdataset.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/create_coco_hyperdataset.py) - 
Demonstrates creating a new [HyperDataset](clearml/hyperdataset.md) and registering [DataEntryImage](clearml/data_entries.md) 
objects built from the COCO dataset, including bounding box, polygon, and keypoint [annotations](clearml/annotations.md) 
and frame-level labels.
* [create_image_entries.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/create_image_entries.py) - 
Demonstrates registering `DataEntryImage` objects with the [`add_data_entries`](clearml/data_entries.md#adding-data-entries-to-a-hyperdataset) 
method.
* [create_qa_entries.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/create_qa_entries.py) - 
Demonstrates [extending `DataEntry`/`DataSubEntry`](clearml/data_entries.md#extending-data-entries) with custom 
subclasses, and storing embedding vectors on entries for [vector search](clearml/vector_search.md).

After executing any of these scripts, you can view your HyperDataset contents and details in the UI.   

### Using your Data
#### Dataviews
The [dataview.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/dataview.py) example 
demonstrates how to use a [DataView](clearml/dataviews.md) to retrieve your data as `DataEntry`/`DataEntryImage` 
objects as part of a running task, by adding a `HyperDatasetQuery` and retrieving the matching entries.

The [dataview_pytorch_dataloader.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/dataview_pytorch_dataloader.py) 
example demonstrates wrapping a DataView as a PyTorch `IterableDataset`, [sharding iteration](clearml/dataviews.md#distributed--multi-worker-iteration) 
across the `DataLoader`'s worker processes.

DataView details are displayed in the UI in a task's **DATAVIEWS** tab. 

#### Vector Search
The [vector_search.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/vector_search.py) 
example demonstrates resolving a HyperDataset version and calling 
[`vector_search`](clearml/vector_search.md#searching-by-vector) to retrieve the entries nearest to a reference 
embedding.

## allegroai (Legacy)

:::important[Legacy Interface]
The `allegroai` Python package is a legacy SDK that is maintained for backwards compatibility.
Users are urged to move to newer versions of the `clearml` Python package.
:::

### Registering your Data
* [register_dataset_with_roi.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/legacy/data-registration/register_dataset_with_roi.py) - Demonstrates 
creating a new DatasetVersion and adding to it frames, supporting ROI annotations and metadata
* [register_dataset_masks.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/legacy/data-registration/register_dataset_masks.py) - Demonstrates 
creating a new DatasetVersion and adding to it frames containing masks. This example also demonstrates the 
DatasetVersion-level [pixel segmentation masks](masks.md#pixel-segmentation-masks).

After executing either of these scripts, you can view your DatasetVersion contents and details in the UI.   

### Using your Data
#### Dataviews
The [dataview_example_framegroup.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/legacy/data-ingestion/dataview_example_framegroup.py) 
and [dataview_example_singleframe.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/legacy/data-ingestion/dataview_example_singleframe.py) 
examples demonstrate how to use a [DataView](dataviews.md) to retrieve your data as SingleFrames and FrameGroups as 
part of a running task. This is done by creating a DataView query and then retrieving the corresponding frames.

DataView details are displayed in the UI in a task's **DATAVIEWS** tab. 


#### Data Ingestion
The [pytorch_dataset_example.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/legacy/data-ingestion/pytorch_dataset_example.py) 
example demonstrates how to feed your DataViews to an ML framework by creating a DataView query and wrapping it as a 
PyTorch Dataset.

The [pytorch_dataset_example_with_masks.py](https://github.com/clearml/clearml/blob/master/examples/hyperdatasets/legacy/data-ingestion/pytorch_dataset_example_with_masks.py) 
example demonstrates the additional actions required when your frames contain masks.
