---
title: Folder Sync with CLI
---

This example shows how to use the `clearml-data` folder sync function.

`clearml-data` folder sync mode is useful for cases when users have a single point of truth (i.e. a folder) that updates 
from time to time. When the point of truth is updated, users can call `clearml-data sync` and the 
changes (file addition, modification, or removal) will be reflected in ClearML.

## Prerequisites
1. First, make sure that you have cloned the [clearml](https://github.com/clearml/clearml) repository. It contains all
the needed files.

1. Open terminal and change directory to the cloned repository's examples folder
    
   ```
   cd clearml/examples/reporting
   ```

## Syncing a Folder
Create a dataset and sync the `data_samples` folder from the repo to ClearML
```bash
clearml-data sync --project datasets --name sync_folder --folder data_samples
```

Expected response:

```
clearml-data - Dataset Management & Versioning CLI
Creating a new dataset:
New dataset created id=0d8f5f3e5ebd4f849bfb218021be1ede
Syncing dataset id 0d8f5f3e5ebd4f849bfb218021be1ede to local folder data_samples
Generating SHA2 hash for 5 files
Hash generation completed
Sync completed: 0 files removed, 5 added / modified
Finalizing dataset
Pending uploads, starting dataset upload to https://files.community.clear.ml
Uploading compressed dataset changes (5 files, total 222.17 KB) to https://files.community.clear.ml
Upload completed (222.17 KB)
2021-05-04 09:57:56,809 - clearml.Task - INFO - Waiting to finish uploads
2021-05-04 09:57:57,581 - clearml.Task - INFO - Finished uploading
Dataset closed and finalized
```

As can be seen, the `clearml-data sync` command creates the dataset, then uploads the files, and closes the dataset.


## Modifying Synced Folder

Modify the data folder:
1. Add another line to one of the files in the `data_samples` folder.
1. Add a file to the sample_data folder.<br/> 
   Run `echo "data data data" > data_samples/new_data.txt` (this will create the file `new_data.txt` and put it in the `data_samples` folder)

1. Repeat the process of creating a new dataset with the previous one as its parent, and syncing the folder.

   ```bash
   clearml-data sync --project datasets --name second_ds --parents a1ddc8b0711b4178828f6c6e6e994b7c --folder data_samples
   ```
   
   Expected response:
   ```
   clearml-data - Dataset Management & Versioning CLI
   Creating a new dataset:
   New dataset created id=0992dd6bae6144388e0f2ef131d9724a
   Syncing dataset id 0992dd6bae6144388e0f2ef131d9724a to local folder data_samples
   Generating SHA2 hash for 6 files
   Hash generation completed
   Sync completed: 0 files removed, 2 added / modified
   Finalizing dataset
   Pending uploads, starting dataset upload to https://files.community.clear.ml
   Uploading compressed dataset changes (2 files, total 742 bytes) to https://files.community.clear.ml
   Upload completed (742 bytes)
   2021-05-04 10:05:42,353 - clearml.Task - INFO - Waiting to finish uploads
   2021-05-04 10:05:43,106 - clearml.Task - INFO - Finished uploading
   Dataset closed and finalized
   ```
   
   See that 2 files were added or modified, just as expected!
