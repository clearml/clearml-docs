---
title: Data Management from CLI
---

In this example we'll create a simple dataset and demonstrate basic actions on it, using the `clearml-data` CLI. 

## Prerequisites
1. First, make sure that you have cloned the [clearml](https://github.com/clearml/clearml) repository. It contains all
the needed files.
1. Open terminal and change directory to the cloned repository's examples folder:
   
    ```
    cd clearml/examples/reporting
   ```

## Creating Initial Dataset

1. To create the dataset, run this code:

    ```bash
    clearml-data create --project datasets --name HelloDataset
    ```

    Expected response:

    ```bash
    clearml-data - Dataset Management & Versioning CLI
    Creating a new dataset:
    New dataset created id=24d05040f3e14fbfbed8edb1bf08a88c
    ```

1. Add a folder. File addition is recursive, so it's enough to point at the folder 
to captures all files and subfolders:
   
   ```bash
   clearml-data add --files data_samples
   ```
   
   Expected response:
   
   ```bash
   clearml-data - Dataset Management & Versioning CLI
   Adding files/folder to dataset id 24d05040f3e14fbfbed8edb1bf08a88c
   Generating SHA2 hash for 2 files
   Hash generation completed
   5 files added
   ```
   
   
:::note
After creating a dataset, its ID doesn't need to be specified when running commands, such as `add`, `remove`, or `list`
:::

3. Close the dataset - this command uploads the files. By default, the files are uploaded to the file server, but 
this can be configured with the `--storage` flag to any of ClearML's supported storage mediums (see [storage](../../integrations/storage.md)).
The command also finalizes the dataset, making it immutable and ready to be consumed.

   ```bash
   clearml-data close
   ```

   Expected response:

   ```bash
   clearml-data - Dataset Management & Versioning CLI
   Finalizing dataset id 24d05040f3e14fbfbed8edb1bf08a88c
   Pending uploads, starting dataset upload to https://files.community.clear.ml
   Uploading compressed dataset changes (4 files, total 221.56 KB) to https://files.community.clear.ml
   Upload completed (221.56 KB)
   2021-05-04 09:32:03,388 - clearml.Task - INFO - Waiting to finish uploads
   2021-05-04 09:32:04,067 - clearml.Task - INFO - Finished uploading
   Dataset closed and finalized
   ```

## Listing Dataset Content

To see that all the files were added to the created dataset, use `clearml-data list` and enter the ID of the dataset
that was just closed.

   ```bash
  clearml-data list --id 24d05040f3e14fbfbed8edb1bf08a88c
   ```

Expected response:

```console
clearml-data - Dataset Management & Versioning CLI 

List dataset content: 24d05040f3e14fbfbed8edb1bf08a88c 
Listing dataset content
file name                        | size       | hash                                                            
-----------------------------------------------------------------------------------------------------------------
dancing.jpg                      |     40,484 | 78e804c0c1d54da8d67e9d072c1eec514b91f4d1f296cdf9bf16d6e54d63116a
data.csv                         |     21,440 | b618696f57b822cd2e9b92564a52b3cc93a2206f41df3f022956bb6cfe4e7ad5
picasso.jpg                      |    114,573 | 6b3c67ea9ec82b09bd7520dd09dad2f1176347d740fd2042c88720e780691a7c
sample.json                      |        132 | 9c42a9a978ac7a71873ebd5c65985e613cfaaff1c98f655af0d2ee0246502fd7
sample.mp3                       |     72,142 | fbb756ae14005420ff00ccdaff99416bebfcea3adb7e30963a69e68e9fbe361b
Total 5 files, 248771 bytes
```

## Creating a Child Dataset

Using ClearML Data, you can create child datasets that inherit the content of other datasets.

1. Create a new dataset, specifying the previously created one as its parent:

   ```bash
   clearml-data create --project datasets --name HelloDataset-improved --parents 24d05040f3e14fbfbed8edb1bf08a88c
   ```
   :::note
   You'll need to input the Dataset ID you received when created the dataset above 
   :::

1. Add a new file. 
   * Create a new file: `echo "data data data" > new_data.txt` 
   
   * Now add the file to the dataset:  

   ```bash
   clearml-data add --files new_data.txt
   ```
   The console should display this output:

   ```console
   clearml-data - Dataset Management & Versioning CLI
   Adding files/folder to dataset id 8b68686a4af040d081027ba3cf6bbca6
   1 file added
   ```
   
1. Remove a file. You need to specify the file's full path (within the dataset, not locally) to remove it.

   ```bash
   clearml-data remove --files data_samples/dancing.jpg
   ```

   Expected response:
   ```bash
   clearml-data - Dataset Management & Versioning CLI
   Removing files/folder from dataset id 8b68686a4af040d081027ba3cf6bbca6
   1 files removed
   ```

1. Close and finalize the dataset:

   ```bash
   clearml-data close
   ```
   
1. Look again at the files in the dataset:

   ```
   clearml-data list --id 8b68686a4af040d081027ba3cf6bbca6
   ```

   And see that the changes have been made! `new_data.txt` has been added, and `dancing.jpg` has been removed. 

   ```
   file name                                                        | size       | hash                                                            
   ------------------------------------------------------------------------------------------------------------------------------------------------
   data.csv                                                         |     21,440 | b618696f57b822cd2e9b92564a52b3cc93a2206f41df3f022956bb6cfe4e7ad5
   new_data.txt                                                     |         15 | 6df986a2154902260a836febc5a32543f5337eac60560c57db99257a7e012051
   picasso.jpg                                                      |    114,573 | 6b3c67ea9ec82b09bd7520dd09dad2f1176347d740fd2042c88720e780691a7c
   sample.json                                                      |        132 | 9c42a9a978ac7a71873ebd5c65985e613cfaaff1c98f655af0d2ee0246502fd7
   sample.mp3                                                       |     72,142 | fbb756ae14005420ff00ccdaff99416bebfcea3adb7e30963a69e68e9fbe361b
   Total 5 files, 208302 bytes
   ```

By using `clearml-data`, a clear lineage is created for the data. As seen in this example, when a dataset is closed, the 
only way to add or remove data is to create a new dataset, and to use the previous dataset as a parent. This way, the data 
is not reliant on the code and is reproducible. 
