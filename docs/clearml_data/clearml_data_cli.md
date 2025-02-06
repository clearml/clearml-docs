---
title: ClearML Data CLI 
--- 

:::important
This page covers `clearml-data`, ClearML's file-based data management solution.
See [Hyper-Datasets](../hyperdatasets/overview.md) for ClearML's advanced queryable dataset management solution.
:::

`clearml-data` is a data management CLI tool that comes as part of the `clearml` python package. Use `clearml-data` to 
create, modify, and manage your datasets. You can upload your dataset to any storage service of your choice (S3 / GS / 
Azure / Network Storage) by setting the dataset's upload destination (see [`--storage`](#upload)). Once you have uploaded 
your dataset, you can access it from any machine. 

The following page provides a reference to `clearml-data`'s CLI commands. 

## create

Creates a new dataset. 

```bash
clearml-data create [-h] [--parents [PARENTS [PARENTS ...]]] [--project PROJECT] 
                    --name NAME [--version VERSION] [--output-uri OUTPUT_URI] 
                    [--tags [TAGS [TAGS ...]]]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--name` |Dataset's name| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
|`--project`|Dataset's project| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
|`--version` |Dataset version. Use the [semantic versioning](https://semver.org) scheme. If not specified a version will automatically be assigned | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--parents`|IDs of the dataset's parents. The dataset inherits all of its parents' content. Multiple parents can be entered, but they are merged in the order they were entered| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--output-uri`| Sets where dataset and its previews are uploaded to| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--tags` |Dataset user tags. The dataset can be labeled, which can be useful for organizing datasets| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>


:::tip Dataset ID
* For datasets created with `clearml` v1.6 or newer on ClearML Server v1.6 or newer, find the ID in the dataset version's info panel in the [Dataset UI](../webapp/datasets/webapp_dataset_viewing.md).  
  For datasets created with earlier versions of `clearml`, or if using an earlier version of ClearML Server, find the ID in the task header of the [dataset task's info panel](../webapp/webapp_exp_track_visual.md).  
* clearml-data works in a stateful mode so once a new dataset is created, the following commands
do not require the `--id` flag.
:::

<br/>

## add

Add individual files or complete folders to the dataset.

```bash
clearml-data add [-h] [--id ID] [--dataset-folder DATASET_FOLDER]
                 [--files [FILES [FILES ...]]] [--wildcard [WILDCARD [WILDCARD ...]]]
                 [--links [LINKS [LINKS ...]]] [--non-recursive] [--verbose]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id` | Dataset's ID. Default: previously created / accessed dataset| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--files`| Files / folders to add. Items will be uploaded to the dataset's designated storage.  | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--wildcard`|  Add specific set of files, denoted by these wildcards. For example: `~/data/*.jpg ~/data/json`. Multiple wildcards can be passed. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--links`| Files / folders link to add. Supports S3, GS, Azure links. Example: `s3://bucket/data` `azure://<account name>.blob.core.windows.net/path/to/file`. Items remain in their original location. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--dataset-folder` | Dataset base folder to add the files to in the dataset. Default: dataset root| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--non-recursive` | Disable recursive scan of files | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--verbose` | Verbose reporting | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## remove

Remove files/links from the dataset.

```bash
clearml-data remove [-h] [--id ID] [--files [FILES [FILES ...]]] 
                    [--non-recursive] [--verbose]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id` | Dataset's ID. Default: previously created / accessed dataset| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--files` |  Files / folders to remove (wildcard selection is supported, for example: `~/data/*.jpg ~/data/json`). Notice: file path is the path within the dataset, not the local path. For links, you can specify their URL (for example, `s3://bucket/data`) | <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
|`--non-recursive` | Disable recursive scan of files | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--verbose` | Verbose reporting | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## upload

Upload the local dataset changes to the server. By default, it's uploaded to the ClearML file server. You can specify a different storage
medium by entering an upload destination. For example: 
* A shared folder: `/mnt/shared/folder`
* S3: `s3://bucket/folder`
* Non-AWS S3-like services (such as MinIO): `s3://host_addr:port/bucket`. **Note that port specification is required**. 
* Google Cloud Storage: `gs://bucket-name/folder`
* Azure Storage: `azure://<account name>.blob.core.windows.net/path/to/file`

```bash
clearml-data upload [-h] [--id ID] [--storage STORAGE] [--chunk-size CHUNK_SIZE] 
                    [--verbose]
```


**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`| Dataset's ID. Default: previously created / accessed dataset| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--storage`| Remote storage to use for the dataset files. Default: files_server | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--chunk-size`| Set dataset artifact upload chunk size in MB. Default 512, (pass -1 for a single chunk). Example: 512, dataset will be split and uploaded in 512 MB chunks. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--verbose` | Verbose reporting | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## close

Finalize the dataset and make it ready to be consumed. This automatically uploads all files that were not previously uploaded.
Once a dataset is finalized, it can no longer be modified.

```bash
clearml-data close [-h] [--id ID] [--storage STORAGE] [--disable-upload]
                   [--chunk-size CHUNK_SIZE] [--verbose]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`| Dataset's ID. Default: previously created / accessed dataset| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--storage`| Remote storage to use for the dataset files. Default: files_server | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--disable-upload` | Disable automatic upload when closing the dataset | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--chunk-size`| Set dataset artifact upload chunk size in MB. Default 512, (pass -1 for a single chunk). Example: 512, dataset will be split and uploaded in 512 MB chunks. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--verbose` | Verbose reporting | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## sync

Sync a folder's content with ClearML. This option is useful in case a user has a single point of truth (i.e. a folder) which
updates from time to time.

Once an update should be reflected in ClearML's system, call `clearml-data sync` and pass the folder path,
and the changes (either file addition, modification and removal) will be reflected in ClearML.

This command also uploads the data and finalizes the dataset automatically.

```bash
clearml-data sync [-h] [--id ID] [--dataset-folder DATASET_FOLDER] --folder FOLDER
                  [--parents [PARENTS [PARENTS ...]]] [--project PROJECT] [--name NAME]
                  [--version VERSION] [--output-uri OUTPUT_URI] [--tags [TAGS [TAGS ...]]]
                  [--storage STORAGE] [--skip-close] [--chunk-size CHUNK_SIZE] [--verbose]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`| Dataset's ID. Default: previously created / accessed dataset| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--dataset-folder`|Dataset base folder to add the files to (default: Dataset root)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--folder`|Local folder to sync. Wildcard selection is supported, for example: `~/data/*.jpg ~/data/json`|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--storage`|Remote storage to use for the dataset files. Default: files server |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--parents`|IDs of the dataset's parents (i.e. merge all parents). All modifications made to the folder since the parents were synced will be reflected in the dataset|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project`|If creating a new dataset, specify the dataset's project name|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--name`|If creating a new dataset, specify the dataset's name|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--version`|Specify the dataset's version using the [semantic versioning](https://semver.org) scheme. Default: `1.0.0`|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--tags`|Dataset user tags|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--skip-close`|Do not auto close dataset after syncing folders|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--chunk-size`| Set dataset artifact upload chunk size in MB. Default 512, (pass -1 for a single chunk). Example: 512, dataset will be split and uploaded in 512 MB chunks. |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--verbose` | Verbose reporting |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## list

List a dataset's contents.

```bash
clearml-data list [-h] [--id ID] [--project PROJECT] [--name NAME] [--version VERSION]
                  [--filter [FILTER [FILTER ...]]] [--modified]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`|Dataset ID whose contents will be shown (alternatively, use project / name combination). Default: previously accessed dataset|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project`|Specify dataset project name (if used instead of ID, dataset name is also required)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--name`|Specify dataset name (if used instead of ID, dataset project is also required)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--version`|Specify dataset version. Default: most recent version |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--filter`|Filter files based on folder / wildcard. Multiple filters are supported. Example: `folder/date_*.json folder/subfolder`|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--modified`|Only list file changes (add / remove / modify) introduced in this version|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## set-description

Sets the description of an existing dataset.

```bash
clearml-data set-description [-h] [--id ID] [--description DESCRIPTION]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`|Dataset's ID|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--description`|Description to be set|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|


</div>

<br/>


## delete

Deletes dataset(s). Pass any of the attributes of the dataset(s) you want to delete. Multiple datasets matching the 
request will raise an exception, unless you pass `--entire-dataset` and `--force`. In this case, all matching datasets 
will be deleted. 

If a dataset is a parent to a dataset(s), you must pass `--force` to delete it. 

:::warning
Deleting a parent dataset may cause child datasets to lose data!
:::

```bash
clearml-data delete [-h] [--id ID] [--project PROJECT] [--name NAME] 
                    [--version VERSION] [--force] [--entire-dataset]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`|ID of the dataset to delete (alternatively, use project / name combination).|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project`|Specify dataset project name (if used instead of ID, dataset name is also required)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--name`|Specify dataset name (if used instead of ID, dataset project is also required)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--version`|Specify dataset version|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`-–force`|Force dataset deletion even if other dataset versions depend on it. Must also be used if `--entire-dataset` flag is used|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--entire-dataset`|Delete all found datasets|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## rename

Rename a dataset (and all of its versions).

```bash
clearml-data rename [-h] --new-name NEW_NAME --project PROJECT --name NAME
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--new-name`|The new name of the dataset|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--project`|The project the dataset to be renamed belongs to|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--name`|The current name of the dataset(s) to be renamed|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|

</div>

<br/>


## move

Moves a dataset to another project 

```bash
clearml-data move [-h] --new-project NEW_PROJECT --project PROJECT --name NAME
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--new-project`|The new project of the dataset|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--project`|The current project the dataset to be move belongs to|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--name`|The name of the dataset to be moved|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|

</div>

<br/>

## search

Search datasets in the system by project, name, ID, and/or tags.

Returns list of all datasets in the system that match the search request, sorted by creation time.

```bash
clearml-data search [-h] [--ids [IDS [IDS ...]]] [--project PROJECT] 
                    [--name NAME] [--tags [TAGS [TAGS ...]]]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--ids`|A list of dataset IDs|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project`|The project name of the datasets|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--name`|A dataset name or a partial name to filter datasets by|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--tags`|A list of dataset user tags|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## compare 


Compare two datasets (target vs. source). The command returns a comparison summary that looks like this:
`Comparison summary: 4 files removed, 3 files modified, 0 files added`

```bash
clearml-data compare [-h] --source SOURCE --target TARGET [--verbose]
```


**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--source`|Source dataset ID (used as baseline)|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--target`|Target dataset ID (compare against the source baseline dataset)|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--verbose`|Verbose report all file changes (instead of summary)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

## squash

Squash multiple datasets into a single dataset version (merge down).

```bash
clearml-data squash [-h] --name NAME --ids [IDS [IDS ...]] [--storage STORAGE] [--verbose]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--name`|Create squashed dataset name|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--ids`|Source dataset IDs to squash (merge down)|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--storage`|Remote storage to use for the dataset files. Default: files_server |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--verbose`|Verbose report all file changes (instead of summary)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

## verify

Verify that the dataset content matches the data from the local source.  

```bash
clearml-data verify [-h] [--id ID] [--folder FOLDER] [--filesize] [--verbose]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`|Specify dataset ID. Default: previously created/accessed dataset|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--folder`|Specify dataset local copy (if not provided the local cache folder will be verified)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--filesize`| If `True`, only verify file size and skip hash checks (default: `False`)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--verbose`|Verbose report all file changes (instead of summary)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

## get

Get a local copy of a dataset. By default, you get a read only cached folder, but you can get a mutable copy by using the 
`--copy` flag. 

```bash
clearml-data get [-h] [--id ID] [--copy COPY] [--link LINK] [--part PART]
                 [--num-parts NUM_PARTS] [--overwrite] [--verbose]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`| Specify dataset ID. Default: previously created / accessed dataset|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--copy`| Get a writable copy of the dataset to a specific output folder|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--link`| Create a soft link (not supported on Windows) to a read-only cached folder containing the dataset|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--part`|Retrieve a partial copy of the dataset. Part number (0 to `--num-parts`-1) of total parts `--num-parts`.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--num-parts`|Total number of parts to divide the dataset into. Notice, minimum retrieved part is a single chunk in a dataset (or its parents). Example: Dataset gen4, with 3 parents, each with a single chunk, can be divided into 4 parts |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--overwrite`| If `True`, overwrite the target folder|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--verbose`| Verbose report all file changes (instead of summary)| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

## publish

Publish the dataset for public use. The dataset must be [finalized](#close) before it is published.

```bash
clearml-data publish [-h] --id ID
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`| The dataset task ID to be published.| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|

</div>
