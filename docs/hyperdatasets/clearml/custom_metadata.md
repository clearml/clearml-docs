---
title: Custom Metadata
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

Metadata can be customized using `metadata` dictionaries:
* On a [`DataEntry`](../../references/sdk/hpd_dataentry.md)/[`DataEntryImage`](../../references/sdk/hpd_dataentryimage.md),
  for metadata applying to the entire entry.
* On a [`DataSubEntry`](../../references/sdk/hpd_datasubentry.md)/[`DataSubEntryImage`](../../references/sdk/hpd_datasubentryimage.md),
  for metadata applying to that specific sub-entry.
* On an individual [annotation](annotations.md), for metadata applying to that specific ROI or label.

## Usage

### Adding Entry Metadata

To attach metadata to an entire entry, pass `metadata` when creating a `DataEntry` (or `DataEntryImage`):

```python
from clearml import DataEntryImage

entry = DataEntryImage(
    metadata={'alive': 'yes'},
)
```

### Adding Sub-Entry Metadata

To attach metadata to a specific sub-entry, pass `metadata` when creating a `DataSubEntry` (or `DataSubEntryImage`):

```python
from clearml import DataSubEntryImage

sub_entry = DataSubEntryImage(
    source='https://acme-datasets.s3.amazonaws.com/tutorials/000012.jpg',
    preview_source='https://acme-datasets.s3.amazonaws.com/tutorials/000012.jpg',
    metadata={'dangerous': 'no'},
)
```

### Adding Annotation Metadata

Metadata can be added to an individual annotation when calling
[`DataSubEntryImage.add_annotation()`](../../references/sdk/hpd_datasubentryimage.md#add_annotation):

```python
sub_entry.add_annotation(
    box2d_xywh=(10, 10, 30, 20),
    labels=['tiger'],
    metadata={'dangerous': 'yes'},
)
```

## Vector Metadata

Metadata fields aren't limited to plain values. A `DataEntry`'s metadata can also hold an embedding vector,
making it searchable with `HyperDataset.vector_search()`. See [Vector Search](vector_search.md)
for details.
