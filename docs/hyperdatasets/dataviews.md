---
title: Dataviews
---

Dataviews is a powerful and easy-to-use ClearML Enterprise feature for creating and managing local views of remote 
Datasets. Dataviews can use sophisticated queries to input data from a subset of a Dataset 
or combinations of Datasets. 

Dataviews support:

* Filtering by ROI labels, frame metadata, and data sources
* Data debiasing to adjust for imbalanced data
* ROI label mapping (label translation)
* Class label enumeration
* Controls for the frame iteration, such as sequential or random iteration, limited or infinite iteration, and reproducibility. 

Dataviews are lazy and optimize processing. When a task script runs in a local environment, Dataview pointers
are initialized. If the task is cloned or extended, and that newly cloned or extended task is tuned and run, 
only changed pointers are initialized. The pointers that did not change are reused.

## Dataview State
Dataviews can be in either *Draft* or *Published* state.

A *Draft* Dataview is editable. A *Published* Dataview is read-only, which ensures reproducible tasks and 
preserves the Dataview's settings. 

## Filtering

A Dataview filters task input data, using one or more frame filters. A frame filter defines the criteria for the 
selection of SingleFrames iterated by a Dataview.  

A frame filter contains the following criteria:

* Dataset version - Choose whether the filter applies to one version or all versions of a Dataset.
* Any combination of the following rules:

    * ROI rule - Include or exclude frames containing at least one ROI with any combination of labels in the Dataset version. 
      Optionally, limit the number of matching ROIs (instances) per frame, and/or limit the confidence level of the label.  
      For example: include frames containing two to four ROIs labeled `cat` and `dog`, with a confidence level from `0.8` to `1.0`.
    * Frame rule - Filter by frame metadata key-value pairs, or ROI labels.   
      For example: if some frames contain the metadata 
      key `dangerous` with values of `yes` or `no`, filter `(meta.dangerous:'yes')`.
    * Source rule - Filter by frame `source` dictionary key-value pairs.  
      For example: filter by source ID `(source.id:00)`.

* A ratio (weight) allowing to debias input data, to and adjust an imbalance in SingleFrames iterated by the Dataview (optional).

Use combinations of these frame filters to build sophisticated queries.

## Debiasing Input Data

Apply debiasing to each frame filter to adjust for an imbalance in input data. Ratios (weights) enable setting the proportion 
of frames that are inputted, according to any of the criteria in a frame filter, including ROI labels, frame metadata, 
and sources, as well as each Dataset version compared with the others. 

For example, data may contain five times the number of frames labeled `daylight` as those labeled `nighttime`, but 
you want to input the same number of both. To debias the data, create two frame filters, one for `daylight` with a ratio 
of `1`, and the other for `nighttime` with a ratio of `5`. The Dataview will iterate approximately an equal number of 
SingleFrames for each. 

## ROI Label Mapping (Label Translation)

ROI label mapping (label translation) applies to the new model. For example, apply mapping to:

* Combine different labels under another more generic label.
* Consolidate disparate datasets containing different names for the ROI.
* Hide labeled objects from the training process.

## Class Label Enumeration

Define class labels for the new model and assign integers to each in order to maintain data conformity across multiple 
codebases and datasets. It is important to set enumeration values for all labels of importance. 

## Iteration Control

The input data **iteration control** settings determine the order, number, timing, and reproducibility of the Dataview iterating 
SingleFrames. Depending upon the combination of iteration control settings, all SingleFrames may not be iterated, and some 
may repeat. The settings include the following:

* Order - Order of the SingleFrames returned by the iteration, which can be either:

    * Sequential - Iterate SingleFrames in sorted order by context ID and timestamp.
    * Random - Iterate SingleFrames randomly using a random seed that can be set (see Random Seed below).

* Repetition - The repetition of SingleFrames that, in conjunction with the order, determines whether all SingleFrames 
  are returned, and whether any may repeat. The repetition settings and their impact on iteration are the following:

    * Use Each Frame Once - All SingleFrames are iterated. If the order is sequential, then no SingleFrames repeat. If 
      the order is random, then some SingleFrames may repeat. 

    * Limit Frames - The maximum number of SingleFrames to iterate, unless the actual number of SingleFrames is fewer than 
      the maximum, then the actual number of SingleFrames are iterated. If the order is sequential, then no SingleFrames 
      repeat. If the order is random, then some SingleFrames may repeat. 

    * Infinite Iterations - Iterate SingleFrames until the task is manually terminated. If the order is sequential, 
      then all SingleFrames are iterated (unless the task is manually terminated before all iterate) and SingleFrames 
      repeat. If the order is random, then all SingleFrames may not be iterated, and some SingleFrames may repeat.
        
* Random Seed - If the task is rerun and the seed remains unchanged, the SingleFrames iteration is the same.

* Clip Length - For video data sources, in the number of sequential SingleFrames from a clip to iterate.

## Usage

### Creating Dataviews

Use the `allegroai.DataView` class to create a DataView object. Instantiate DataView objects, specifying 
iteration settings and additional iteration parameters that control query iterations. 

```python
from allegroai import DataView, IterationOrder
# Create a DataView object that iterates randomly until terminated by the user
myDataView = DataView(iteration_order=IterationOrder.random, iteration_infinite=True)
```

### Adding Queries

Dataview filters are created by adding filter queries to the Dataview. To add a query to a DataView, use [`DataView.add_query()`](../references/hyperdataset/dataview.md#add_query) 
and specify Dataset versions, ROI and/or frame queries, and other criteria. 

Use the `dataset_name` and `version_name` arguments to specify the Dataset Version the query applies to. 

:::info Multi-version queries
`dataset_name` and `version_name` support wildcard input (`*`) meaning all Dataview datasets or all Dataview versions respectively.
At least one of the Dataview queries must specify a Dataset explicitly, for "All Dataview datasets" to be meaningful
:::

The `roi_query` and `frame_query` arguments specify the possible queries: 
* `roi_query` can be assigned ROI labels by label name or Lucene queries.
* `frame_query` must be assigned a Lucene query. 
  
Apply multiple filters (with the same or different queries) by calling [`DataView.add_query()`](../references/hyperdataset/dataview.md#add_query) 
multiple times.

Use [`DataView.add_multi_query()`](../references/hyperdataset/dataview.md#add_multi_query) for specifying multiple ROI 
rules in the same query.

You can retrieve the Dataview frames using [`DataView.to_list()`](../references/hyperdataset/dataview.md#to_list), 
[`DataView.to_dict()`](../references/hyperdataset/dataview.md#to_dict), or [`DataView.get_iterator()`](../references/hyperdataset/dataview.md#get_iterator)
(see [Accessing Frames](#accessing-frames)).

#### ROI Queries: 

* **ROI query for a single label**

This example uses an ROI query to filter for frames containing at least one ROI with the label `cat`:

```python
# Create a Dataview object for an iterator that randomly returns frames according to queries
myDataView = DataView(iteration_order=IterationOrder.random, iteration_infinite=False)

# Add a query for a Dataset version 
myDataView.add_query(
    dataset_name='myDataset',
    version_name='myVersion', 
    roi_query='cat'
)

# retrieving the actual SingleFrames / FrameGroups 
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```

* **ROI query for one label OR another**

This example uses an ROI query to filter for frames containing at least one ROI with either the label `cat` OR the label `dog`:

```python
# Add a query for a Dataset version 
myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion', 
    roi_query='cat'
)

myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion',
    roi_query='dog'
)

# retrieving the actual SingleFrames / FrameGroups 
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```

* **ROI query for two specific labels in the same ROI**  

This example uses an ROI query to filter for frames containing at least one ROI with both the label `Car` AND the label `partly_occluded`:

```python
# Add a query for a Dataset version
myDataView.add_query(
    dataset_name='myDataset', 
    version_name='training',
    roi_query=['Car','partly_occluded']
)

# retrieving the actual SingleFrames / FrameGroups 
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```

* **ROI query for one label AND NOT another (Lucene query)**    

This example uses an ROI query to filter for frames containing at least one ROI that has with the label `Car` AND DOES NOT 
have the label `partly_occluded`:

```python
# Add a query for a Dataset version
# Use a Lucene Query
#   "label" is a key in the rois dictionary of a frame
#   In this Lucene Query, specify two values for the label key and use a Logical AND NOT
myDataView.add_query(
    dataset_name='myDataset', 
    version_name='training',
    roi_query='label.keyword:\"Car\" AND NOT label.keyword:\"partly_occluded\"'
)

# retrieving the actual SingleFrames / FrameGroups 
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```

* **ROI query for one label AND another label in different ROIs**

This example uses an ROI query to filter for frames containing at least one ROI with the label `Car` and at least one 
ROI with the label `Person`. The example demonstrates using the `roi_queries` parameter of [`DataView.add_multi_query()`](../references/hyperdataset/dataview.md#add_multi_query) 
with a list of [`DataView.RoiQuery`](../references/hyperdataset/dataview.md#roiquery) objects:

```python
myDataview = DataView()
myDataview.add_multi_query(
    dataset_id=self._dataset_id,
    version_id=self._version_id,
    roi_queries=[DataView.RoiQuery(label='car'), DataView.RoiQuery(label='person')],
)
# retrieving the actual SingleFrames / FrameGroups
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```

* **ROI query for one label AND NOT another label in different ROIs**

This example uses an ROI query to filter for frames containing at least one ROI with the label `Car` AND that DO NOT 
contain ROIs with the label `Person`. To exclude an ROI, pass `must_not=True` in the [`DataView.RoiQuery`](../references/hyperdataset/dataview.md#roiquery) 
object. 

```python
myDataview = DataView()
myDataview.add_multi_query(
    dataset_id=self._dataset_id,
    version_id=self._version_id,
    roi_queries=[DataView.RoiQuery(label='car'), DataView.RoiQuery(label='person', must_not=True)],
)

# retrieving the actual SingleFrames / FrameGroups
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```


#### Querying Multiple Datasets and Versions

This example demonstrates an ROI query filtering for frames containing the ROI labels `car`, `truck`, or `bicycle` 
from two versions of one Dataset, and one version of another Dataset:

```python
# Add queries:

# The 1st Dataset version 
myDataView.add_query(
    dataset_name='dataset_1',
    version_name='version_1',
    roi_query='label.keyword:\"car\" OR label.keyword:\"truck\" OR '
                'label.keyword:\"bicycle\"'
)

# The 1st Dataset, but a different version
myDataView.add_query(
    dataset_name='dataset_1',
    version_name='version_2',
    roi_query='label.keyword:\"car\" OR label.keyword:\"truck\" OR '
                               'label.keyword:\"bicycle\"'
)

# A 2nd Dataset (version)
myDataView.add_query(
    dataset_name='dataset_2',
    version_name='some_version',
    roi_query='label.keyword:\"car\" OR label.keyword:\"truck\" OR '
                               'label.keyword:\"bicycle\"'
)

# retrieving the actual SingleFrames / FrameGroups 
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```

#### Frame Queries

Use frame queries to filter frames by ROI labels and/or frame metadata key-value pairs that a frame must include or 
exclude for the Dataview to return the frame. 

**Frame queries** match frame meta key-value pairs, ROI labels, or both.
They use the same logical OR, AND, NOT AND matching as ROI queries.

This example demonstrates a frame query filtering for frames containing the meta key `city` value of `bremen`:
        
```python
# Add a frame query for frames with the meta key "city" value of "bremen"
myDataView.add_query(
    dataset_name='myDataset',
    version_name='version',
    frame_query='meta.city:"bremen"'
)

# retrieving the actual SingleFrames / FrameGroups 
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```


### Controlling Query Iteration

Use [`DataView.set_iteration_parameters()`](../references/hyperdataset/dataview.md#set_iteration_parameters) to manage the 
order, number, timing, and reproducibility of frames for training.


#### Iterate Frames Infinitely 

This example demonstrates creating a Dataview and setting its parameters to iterate infinitely until the script is 
manually terminated: 

```python
# Create a Dataview object for an iterator that returns frames
myDataView = DataView()

# Set Iteration Parameters (overrides parameters in constructing the DataView object
myDataView.set_iteration_parameters(order=IterationOrder.random, infinite=True)
```

#### Iterate All Frames Matching the Query
This example demonstrates creating a DataView and setting its parameters to iterate and return all frames matching a query:

```python
# Create a Dataview object for an iterator for frames
myDataView = DataView(iteration_order=IterationOrder.random, iteration_infinite=False)

# Set Iteration Parameters (overrides parameters in constructing the DataView object
myDataView.set_iteration_parameters(
    order=IterationOrder.random, 
    infinite=False
)

# Add a query for a Dataset version 
myDataView.add_query(
    dataset_name='myDataset',
    version_name='myVersion', 
    roi_query='cat'
)

# retrieving the actual SingleFrames / FrameGroups 
# you can also iterate over the frames with `for frame in myDataView.get_iterator():`
list_of_frames = myDataView.to_list()
```

#### Iterate a Maximum Number of Frames
This example demonstrates creating a Dataview and setting its parameters to iterate a specific number of frames. If the 
Dataset version contains fewer than that number of frames matching the query, then fewer are returned by the iterator.

```python
# Create a Dataview object for an iterator for frames
myDataView = DataView(iteration_order=IterationOrder.random, iteration_infinite=True)

# Set Iteration Parameters (overrides parameters in constructing the DataView object
myDataView.set_iteration_parameters(
    order=IterationOrder.random, 
    infinite=False,
    maximum_number_of_frames=5000
)
```

### Debiasing Input Data

Debias input data using the [`DataView.add_query`](../references/hyperdataset/dataview.md#add_query) method's `weight` 
argument to add weights. This is the same `DataView.add_query` that can be used to specify Dataset versions, and ROI 
queries and frame queries.

This example adjusts an imbalance in the input data to improve training for `Car` ROIs that are also `largely occluded` 
(obstructed). For every frame containing at least one ROI labeled `Car`, approximately five frames containing at least 
one ROI labeled with both `Car` and `largely_occluded` will be input.

```python
myDataView = DataView(iteration_order=IterationOrder.random, iteration_infinite=True)

myDataView.add_query(
    dataset_name='myDataset', 
    version_name='training', 
    roi_query='Car', 
    weight = 1
)

myDataView.add_query(
    dataset_name='myDataset', 
    version_name='training',
    roi_query='label.keyword:\"Car\" AND label.keyword:\"largely_occluded\"', 
    weight = 5
)
```

### Setting Label Enumeration Values

Set label enumeration values to maintain data conformity across multiple codebases and datasets. 
It is important to set enumeration values for all labels of importance. 
The default value for labels that are not assigned values is `-1`.

To assign enumeration values for labels use the `DataView.set_labels` method, set a mapping of a label 
(string) to an integer for ROI labels in a Dataview object.

If certain ROI labels are [mapped](#mapping-roi-labels) from certain labels **to** other labels, 
then use the labels you map **to** when setting enumeration values. 
For example, if the labels `truck`, `van`, and `car` are mapped **to** `vehicle`, then set enumeration for `vehicle`. 

```python
# Create a Dataview object for an iterator that randomly returns frames according to queries
myDataView = DataView(iteration_order=IterationOrder.random, iteration_infinite=True)

# Add a query for a Dataset version 
myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion', 
    roi_query='cat'
)

myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion', 
    roi_query='dog'
)

myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion', 
    roi_query='bird'
)

myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion', 
    roi_query='sheep'
)

myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion', 
    roi_query='cow'
)

# Set the enumeration label values
myDataView.set_labels(
    {"cat": 1, "dog": 2, "bird": 3, "sheep": 4, "cow": 5, "ignore": -1,}
)
```

### Mapping ROI Labels

ROI label translation (label mapping) enables combining labels for training, combining disparate datasets, and hiding 
certain labels for training.

This example demonstrates consolidating two disparate Datasets. Two Dataset versions use `car` (lower case "c"), but the
third uses `Car` (upper case "C"). 
The example maps `Car` (upper case "C") to `car` (lower case "c"):

```python
# Create a Dataview object for an iterator that randomly returns frames according to queries 
myDataView = DataView(iteration_order=IterationOrder.random, iteration_infinite=True)

# The 1st Dataset (version) - "car" with lowercase "c"
myDataView.add_query(
    dataset_name='myDataset', 
    version_name='myVersion', 
    roi_query='car'
)

# The 2nd Dataset (version) - "car" with lowercase "c"
myDataView.add_query(
    dataset_name='dataset_2', 
    version_name='aVersion',  
    roi_query='car'
)

# A 3rd Dataset (version) - "Car" with uppercase "C"
myDataView.add_query(
    dataset_name='dataset_3', 
    version_name='training',
    roi_query='Car'
)

# Use a mapping rule to translate "Car" (uppercase) to "car" (lowercase)
myDataView.add_mapping_rule(
    dataset_name='dataset_3',
    version_name='training', 
    from_labels=['Car'], 
    to_label='car'
)
```

### Accessing Frames

Dataview objects can be retrieved by the Dataview ID or name using the [`DataView.get`](../references/hyperdataset/dataview.md#dataviewget) 
class method.

```python
my_dataview = DataView.get(dataview_id='<dataview_id>')
```

Access the Dataview's frames as a Python list, dictionary, or through a pythonic iterator.

[`DataView.to_list()`](../references/hyperdataset/dataview.md#to_list) returns the Dataview queries result as a Python list. 	

[`DataView.to_dict()`](../references/hyperdataset/dataview.md#to_dict) returns a list of dictionaries, where each dictionary represents a frame. Use the 
`projection` parameter to specify a subset of the frame fields to be included in the result. Input a list of strings, 
where each string represents a frame field or subfield (using dot-separated notation). 

For example, the code below specifies that the frame dictionaries should include only the `id` and `sources` fields and 
the `dataset.id` subfield:  

```python
my_dataview = DataView.get(dataview_id='<dataview_id>')
my_dataview.to_dict(projection=['id', 'dataset.id', 'sources'])
```

The method returns a list of dictionaries that looks something like this:

```json
[   
  {
    "id": "<dataview_id>",
    "dataset": {
      "id": "<dataset_id>"
    },
    "sources": [
      {
        "id": "<id>",
        "uri": "<uri>",
        "timestamp": <timestamp>,
        "preview": {
          "uri": "<uri>",
          "timestamp": <timestamp>
        }
      }
    ]
  },
  #   additional dictionaries with the same format here
]
```

Since the `to_list`/`to_dict` methods return all the frames in the Dataview, it is recommended to use the [`DataView.get_iterator`](../references/hyperdataset/dataview.md#get_iterator) 
method, which returns an iterator of the Dataview. You can also specify the desired frame fields in this method using 
the `projection` parameter, just like in the `DataView.to_dict` method, as described above.
