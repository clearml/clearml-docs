---
title: Hyper-Datasets
---

:::important Enterprise Feature
Hyper-Datasets are available under the ClearML Enterprise plan.
:::

The ClearML Hyper-Datasets SDK interface is provided through:
* Main interface: `clearml` Python package (as of v2.1.0)
* Legacy interface: `allegroai` Python package

Both packages provide a programmatic interface for ClearML's Hyper-Datasets, albeit through a slightly different class hierarchy.

## clearml ≥ 2.1

Starting with version 2.1, the `clearml` Python package provides the following interface for Hyper-Datasets:

* [**HyperDataset**](sdk/hpd_hyperdataset.md) - Handle to a specific Dataset version, used for adding new data and performing queries like vector search
* [**HyperDatasetManagement**](sdk/hpd_hyperdatasetmanagement.md) - Management operations for Hyper-Datasets (e.g. listing, fetching, and deleting)
* [**DataEntry**](sdk/hpd_dataentry.md) - Logical unit of data. It contains one or more DataSubEntry objects
* [**DataSubEntry**](sdk/hpd_datasubentry.md) - Represents a source file within a `DataEntry`
* [**DataEntryImage**](sdk/hpd_dataentryimage.md) - Image-specific `DataEntry` implementation, providing image-oriented metadata and access patterns.
* [**DataSubEntryImage**](sdk/hpd_datasubentryimage.md) - Image-specific sub-entry associated with a `DataEntryImage`
* [**DataView**](sdk/hpd_dataview.md) - Defines how data is consumed and iterated over without modifying the underlying dataset
* [**HyperDatasetQuery**](sdk/hpd_hyperdatasetquery.md) - Represents a single query or filter rule used to construct DataView objects across one or more dataset versions

## allegroai 

:::important Legacy Interface
The `allegroai` Python package is a legacy SDK that is maintained for backwards compatibility.
Users are urged to move to newer versions of the `clearml` Python package.
:::

The `allegroai` Python package provides the following interface for Hyper-Datasets:
* [**Dataset**](hyperdataset/hyperdataset.md) - Represents a Hyper-Dataset and provides access to its versions and metadata
* [**DatasetVersion**](hyperdataset/hyperdatasetversion.md) - A specific version of a Hyper-Dataset, containing frames and annotations
* [**SingleFrame**](hyperdataset/singleframe.md) - The basic units of data within a dataset version. For example, one image
* [**FrameGroup**](hyperdataset/framegroup.md) - A collection of multiple frames such as multiple image sources at the same point in time
* [**Annotation**](hyperdataset/annotation.md) - Annotation data associated with frames, such as ROIs or frame labels 
* [**DataView**](hyperdataset/dataview.md) - Filtered view over dataset frames, enabling iteration over a subset of the data



