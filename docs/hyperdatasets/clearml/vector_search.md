---
title: Vector Search
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

Vector search lets you
store an embedding vector as metadata on a [Data Entry](data_entries.md), and later find the entries whose
embeddings are nearest to a reference vector.

:::note[ClearML Server version]
Vector search requires ClearML Enterprise Server v3.25 or later.
:::

## Registering a Searchable Vector Field

When creating a [`HyperDataset`](hyperdataset.md#creating-a-hyperdataset), declare which metadata field(s) should
be indexed as dense vectors using `field_mappings`. This way ClearML knows to make it searchable by similarity.
Field mappings can only be set when the dataset is first created, so decide on your vector fields up front:

```python
from clearml import HyperDataset

hyperdataset = HyperDataset(
    project_name='MyProject',
    dataset_name='QADataset',
    version_name='Current',
    field_mappings={
        'meta.qa_vector': {
            'type': 'dense_vector',
            'element_type': 'float',
            'dims': 768,
        }
    },
)
```

Each entry in `field_mappings` consists of: 
* Key - The fully-qualified metadata path. For example, `meta.qa_vector` for the `qa_vector` key in an entry's metadata.
* Value - Describes the field's Elasticsearch mapping. For a vector field, this means:
  * `type: 'dense_vector'`
  * `element_type` - Vector's element type (for example, `float`)
  * `dims` - Vector's dimensionality

Passing `field_mappings` for a dataset that already exists raises an error. When creating additional versions of
the dataset later, omit `field_mappings`. The mappings set at creation apply to all of the dataset's versions.

## Storing a Vector on a Data Entry

Attach an embedding vector to an entry with
[`DataEntry.set_vector()`](../../references/sdk/hpd_dataentry.md#set_vector), passing the same
`metadata_field` name used in `field_mappings` (without the `meta.` prefix):

```python
from clearml import DataEntry

entry = DataEntry(metadata={'question': 'What is ClearML?'})
entry.set_vector(embedding, metadata_field='qa_vector')

hyperdataset.add_data_entries([entry])
```

`embedding`'s length must match the `dims` declared for this field in `field_mappings`; ClearML validates it when
the entry is registered.

## Searching by Vector

Use [`HyperDataset.vector_search()`](../../references/sdk/hpd_hyperdataset.md#vector_search) to find
the entries whose stored vector is closest to a reference vector:

```python
results = hyperdataset.vector_search(
    reference_vector=query_embedding,
    vector_field='qa_vector',
    number_of_neighbors=10,
)
```

`vector_search()` supports the following parameters:
* `reference_vector` - The embedding to search against.
* `vector_field` - The metadata field name the vectors were stored under (matching `field_mappings` and
  `set_vector()`'s `metadata_field`).
* `number_of_neighbors` - Maximum number of results to return (default `50`).
* `similarity_function` - `"cosine"` (default), `"l2_norm"`, or `"dot_product"`.
* `fast` - If `True`, uses an approximate search mode; only supported with `similarity_function="cosine"`.

The method returns the matching entries, reconstructed as `DataEntry`/`DataEntryImage` objects (or your own
[custom subclasses](data_entries.md#extending-data-entries)), ordered by similarity to `reference_vector`.
