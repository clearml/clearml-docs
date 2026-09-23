---
title: Dataviews
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

A **Dataview** manages a view of one or more HyperDataset versions through a set of queries, so a task's input
data can be defined from a subset of a dataset, or from a combination of datasets and versions, without copying
or modifying the underlying data.

## Dataview State

A [`DataView`](../../references/sdk/hpd_dataview.md) can be used purely inline (building queries and iterating or
counting entries) without ever being persisted, and without needing write permission on any project. It's automatically 
assigned an ID and persisted the first time it's iterated, unless you disable this behavior (see
[Storing Dataviews](#storing-dataviews)), in which case you must call [`DataView.store()`](../../references/sdk/hpd_dataview.md#store) 
explicitly.

## Queries

A [`HyperDatasetQuery`](../../references/sdk/hpd_hyperdatasetquery.md) is a single filter rule targeting one
dataset version (or a wildcard `"*"` across many). A `DataView` aggregates one or more of these queries.

Each query supports:
* `project_id` / `dataset_id` / `version_id` - Which project/dataset/version to pull entries from. Defaults to
  `"*"` (any).
* `frame_query` - A Lucene query filtering entries by their metadata.
* `source_query` - A Lucene query filtering entries by properties of their sources.
* `filter_by_roi` - How to filter entries by their ROI annotations: `"label_rules"` (only entries matching
  `label_rules`, the default; with no rules, every entry matches), `"no_rois"` (only entries with no ROIs), or
  `"disabled"` (no ROI filtering).
* `label_rules` - When `filter_by_roi='label_rules'`, one or more rules an entry's ROIs must match, each a dict
  with a `label` (Lucene query string matched against the ROI label, for example `'car'`), and optionally
  `count_range`/`conf_range` (min/max ROI count or confidence) and `must_not` (negate the rule). Multiple rules are
  ANDed together. This filters entries; it doesn't rename labels (see
  [Relabeling ROIs](#relabeling-rois) for that).
* `weight` - When a `DataView` has multiple queries, controls the relative sampling weight of this query's version
  relative to the others.

## Iteration Control

A `DataView`'s iteration behavior is set at construction:
* `iteration_order` - `"sequential"` (default) or `"random"`.
* `iteration_infinite` - If `True`, iteration never raises `StopIteration` on its own.
* `iteration_random_seed` - Seed used when `iteration_order='random'`.
* `iteration_limit` - Maximum number of entries returned per iteration pass.

`iteration_infinite` and `iteration_limit` can also be changed afterward with `set_iteration_parameters()`;
`iteration_order` and `iteration_random_seed` can only be set at construction.

## Usage

### Creating a Dataview

Instantiate the `DataView` class:

```python
from clearml import DataView

dataview = DataView(name='MyDataView', iteration_order='random')
```

### Adding Queries

Use [`add_query()`](../../references/sdk/hpd_dataview.md#add_query) to add a filter rule to the Dataview, targeting a specific dataset version:

```python
dataview.add_query(
    project_id=hyperdataset.project_id,
    dataset_id=hyperdataset.dataset_id,
    version_id=hyperdataset.version_id,
)
```

With no `frame_query` or `label_rules` arguments supplied, this query matches every entry in that version; 
the sections below show how to narrow it by metadata or ROI label, or add further queries to pull from 
multiple datasets/versions at once.

#### Frame Query by Metadata

Filter entries by a metadata field using a Lucene query string:

```python
# entries with the meta key "city" set to "bremen"
dataview.add_query(
    dataset_id=hyperdataset.dataset_id,
    version_id=hyperdataset.version_id,
    frame_query='meta.city:bremen',
)
```

#### ROI Query for a Single Label

Filter entries by an ROI label with `label_rules` (`filter_by_roi='label_rules'` is the default, so it can be
omitted):

```python
# entries with at least one ROI labeled "car"
dataview.add_query(
    dataset_id=hyperdataset.dataset_id,
    version_id=hyperdataset.version_id,
    label_rules=[{'label': 'car'}],
)
```

#### Querying Multiple Datasets and Versions

Add multiple queries to combine data from different datasets/versions into a single Dataview, optionally weighting
each source:

```python
# the 1st dataset version
dataview.add_query(dataset_id='dataset_1', version_id='version_a', weight=1.0)

# the 1st dataset, a different version
dataview.add_query(dataset_id='dataset_1', version_id='version_b', weight=1.0)

# a 2nd dataset (version)
dataview.add_query(dataset_id='dataset_2', version_id='version_a', weight=2.0)
```

### Relabeling ROIs

Use [`add_mapping_rule()`](../../references/sdk/hpd_dataview.md#add_mapping_rule) to rename ROI labels returned while 
iterating. This is useful when combining datasets that use different names for the same class:

```python
# ROIs labeled "pedestrian" are returned as "person"
dataview.add_mapping_rule(from_labels='pedestrian', to_label='person')
```

`from_labels` can be a single label or a list. If it's a list, an ROI must match all of them for the mapping to apply. 

By default, a mapping rule applies across every dataset/version in the Dataview. To scope it to just one, pass `dataset_id`/`dataset_name` 
(and optionally `version_id`/`version_name`). 

Mapping happens *after* queries are matched, so `label_rules`/`filter_by_roi` must still reference the original label names,
not the mapped ones.

You can add multiple mapping rules. Read back everything currently applied with [`DataView.get_mapping_rules()`](../../references/sdk/hpd_dataview.md#get_mapping_rules).

### Label Enumeration

Use `set_labels()` to map ROI label strings to integer class IDs, so each ROI returned while iterating carries a
matching `label_num`:

```python
# both "person" and "pedestrian" ROIs are returned with label_num=1
dataview.set_labels({'person': 1, 'pedestrian': 1, 'background': 0})
```

Read the current enumeration back with `get_labels()`.

### Controlling Query Iteration

* Iterate Entries Infinitely

   ```python
   dataview.set_iteration_parameters(infinite=True)
   ```

* Iterate a Maximum Number of Entries

   ```python
   dataview.set_iteration_parameters(limit=1000)
   ```

### Retrieving Entries

Stream entries with [`get_iterator()`](../../references/sdk/hpd_dataview.md#get_iterator), which starts a
background fetch thread and yields reconstructed `DataEntry`/`DataEntryImage` objects (including [custom subclasses](data_entries.md#extending-data-entries)):

```python
for entry in dataview.get_iterator():
    local_path = entry.sub_data_entries[0].get_local_source()
```

Pass `cache_in_memory=True` to replay the same entries on subsequent passes without re-fetching from the server.

To get all matching entries at once instead of streaming them, use [`to_list()`](../../references/sdk/hpd_dataview.md#to_list). 
Each call fetches a fresh list from the server. It raises a `ValueError` if the Dataview iterates infinitely with no 
`iteration_limit`:

```python
entries = dataview.to_list()
```

To check how many entries a Dataview's queries match before iterating, use `get_count()`:

```python
count = dataview.get_count()
```

`len(dataview)` returns the same value, unless an `iteration_limit` (or a synthetic epoch limit from
`allow_repetition`, see below) is set, in which case it reflects that effective iteration length instead.

### Debiasing Input Data with Weighted Queries and Repetition

When a Dataview combines multiple queries with different `weight` values and/or differing entry counts, pass
`allow_repetition=True` to `get_iterator()` to balance sampling across a "synthetic epoch": under-represented
queries are repeated so that the overall mixture reflects each query's weight, rather than being dominated by
whichever query happens to have the most matching entries:

```python
iterator = dataview.get_iterator(allow_repetition=True)
```

To do this, `allow_repetition=True` updates the Dataview's own iteration parameters: it sets `iteration_infinite`
to `True` and `iteration_limit` to the synthetic epoch length. These settings remain on the Dataview after the call.

### Distributed / Multi-Worker Iteration

`DataView` iterators can be split across multiple workers or nodes, for example when using a PyTorch
`DataLoader` with multiple worker processes. Pass `worker_index` and `num_workers` to `get_iterator()`, or call
`set_concurrency()` on an iterator before it starts fetching:

```python
import torch


class MyIterableDataset(torch.utils.data.IterableDataset):
    def __init__(self, dataview):
        self.dataview = dataview

    def __iter__(self):
        worker_info = torch.utils.data.get_worker_info()
        worker_index = worker_info.id if worker_info else 0
        num_workers = worker_info.num_workers if worker_info else 1
        return iter(self.dataview.get_iterator(worker_index=worker_index, num_workers=num_workers))
```

### Prefetching Local Sources

To avoid downloading files one at a time during training, use
[`prefetch_local_sources()`](../../references/sdk/hpd_dataview.md#prefetch_local_sources) to download everything a 
Dataview references before training starts. 

Pass `get_previews=True` to prefetch preview sources too.

```python
dataview.prefetch_local_sources(num_workers=8, get_previews=True)
```

### Storing Dataviews

By default, a Dataview is automatically stored on the server the first time it's iterated
(`sdk.development.store_dataviews_on_creation`, enabled by default), and, when created inside a running
[Task](../../fundamentals/task.md) (`auto_connect_with_task=True`, the default), it's attached to that Task so it
appears in the WebApp's task **DATAVIEWS** tab.

To store a Dataview explicitly and get its ID:

```python
dataview_id = dataview.store()
```

### Getting a Stored Dataview

Retrieve a previously stored Dataview by ID or name with
[`DataView.get()`](../../references/sdk/hpd_dataview.md#dataviewget):

```python
dataview = DataView.get(dataview_name='MyDataView')
```
