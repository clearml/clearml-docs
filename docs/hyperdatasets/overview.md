---
title: Hyper-Datasets
---

:::important[Enterprise Feature]
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

ClearML's Hyper-Datasets are an MLOps-oriented abstraction of your data, which facilitates traceable, reproducible model development
through parameterized data access and meta-data version control.

The basic premise is that a user-formed query is a full representation of the dataset used by the ML/DL process. 

ClearML Enterprise's Hyper-Datasets support rapid prototyping, creating new opportunities such as: 
* Hyperparameter optimization of the data itself
* QA/QC pipelining
* CD/CT (continuous training) during deployment
* Enabling complex applications like collaborative (federated) learning. 


## Hyper-Dataset Components 

A Hyper-Dataset is composed of the following components. Access to all of them is provided through the 
`clearml` Python package (as of v2.1.0). 

* [HyperDatasets and Versions](clearml/hyperdataset.md) - Data entries are added to a HyperDataset version. Versions can 
  be created, modified, and removed; the different versions are recorded and available, so tasks and their data are 
  reproducible and traceable.
* [Data Entries](clearml/data_entries.md) - The basic units of data in ClearML Enterprise, optionally grouped by point 
  in time (for example, giving consecutive video frames a shared context so they can be ordered and viewed together).
  A Data Entry is composed of the following components:
    * [Sources](clearml/sources.md)
    * [Annotations](clearml/annotations.md)
    * [Masks](clearml/masks.md)
    * [Previews](clearml/previews.md)
    * [Custom Metadata](clearml/custom_metadata.md)
* [Dataviews](clearml/dataviews.md) - Manage views of a HyperDataset with queries, so a task's input data can be defined 
  from a subset of a HyperDataset, or a combination of HyperDatasets.
* [Vector Search](clearml/vector_search.md) - Store an embedding vector as metadata on a data entry, then find entries 
  whose embeddings are nearest to a reference vector.

See [Hyper-Datasets](../references/hpd_overview.md) for the full SDK reference.

:::info[Legacy Interface]
Versions prior to v2.1 used the `allegroai` Python package to access Hyper-Datasets.
See [allegroai (Legacy)](legacy_overview.md) for details.
:::