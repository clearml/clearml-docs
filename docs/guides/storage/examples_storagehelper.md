---
title: StorageManager
---

This page describes storage examples using the [`StorageManager`](../../references/sdk/storage.md) 
class. The storage examples include:

* Downloading [files](#downloading-a-file) and [folders](#downloading-a-folder) - Get an object from storage.
* Uploading [files](#uploading-a-file) and [folders](#uploading-a-folder) - Upload an object.
* [Setting cache limits](#setting-cache-limits)

:::note 
`StorageManager` supports HTTP(S), S3, Google Cloud Storage, Azure, and file system folders.
:::

## Working with Files
### Downloading a File

To download a ZIP file from storage to the `global` cache context, use the [`StorageManager.get_local_copy()`](../../references/sdk/storage.md#storagemanagerget_local_copy) 
class method, and specify the destination location as the `remote_url` argument:

```python
from clearml import StorageManager

StorageManager.get_local_copy(remote_url="s3://MyBucket/MyFolder/file.zip")
```

:::note
Zip and tar.gz files will be automatically extracted to cache. This can be controlled with the `extract_archive` flag.
:::

To download a file to a specific context in cache, specify the name of the context as the `cache_context` argument:

```python
StorageManager.get_local_copy(remote_url="s3://MyBucket/MyFolder/file.ext", cache_context="test")
```

To download a non-compressed file, set the `extract_archive` argument to `False`. 

```python
StorageManager.get_local_copy(remote_url="s3://MyBucket/MyFolder/file.ext", extract_archive=False)
```

By default, the `StorageManager` reports its download progress to the console every 5MB. You can change this using the 
[`StorageManager.set_report_download_chunk_size()`](../../references/sdk/storage.md#storagemanagerset_report_download_chunk_size) 
class method, and specifying the chunk size in MB (not supported for Azure and GCP storage).

```python
StorageManager.set_report_download_chunk_size(chunk_size_mb=10)
```

### Uploading a File

To upload a file to storage, use the [`StorageManager.upload_file()`](../../references/sdk/storage.md#storagemanagerupload_file) 
class method. Specify the full path of the local file as the `local_file` argument, and the remote URL as the `remote_url` 
argument.

```python
StorageManager.upload_file(
    local_file="/mnt/data/also_file.ext", remote_url="s3://MyBucket/MyFolder/also_file.ext"
)
```

Use the `retries` parameter to set the number of times file upload should be retried in case of failure.

By default, the `StorageManager` reports its upload progress to the console every 5MB. You can change this using the 
[`StorageManager.set_report_upload_chunk_size()`](../../references/sdk/storage.md#storagemanagerset_report_upload_chunk_size) 
class method, and specifying the chunk size in MB (not supported for Azure and GCP storage).

```python
StorageManager.set_report_upload_chunk_size(chunk_size_mb=10)
```

## Working with Folders
### Downloading a Folder
Download a folder to a local machine using the [`StorageManager.download_folder()`](../../references/sdk/storage.md#storagemanagerdownload_folder) 
class method. Specify the remote storage location as the `remote_url` argument and the target local location as the 
`local_folder` argument. 

```python
StorageManager.download_folder(remote_url="s3://bucket/", local_folder="/folder/")
```

This method downloads a remote folder recursively, maintaining the sub-folder structure from 
the remote storage.

For example: if you have a remote file `s3://bucket/sub/file.ext`, then 
`StorageManager.download_folder(remote_url="s3://bucket/", local_file="/folder/")` will create `/folder/sub/file.ext`.

You can input `match_wildcard` so only files matching the wildcard are downloaded.

### Uploading a Folder
Upload a local folder to remote storage using the [`StorageManager.upload_folder()`](../../references/sdk/storage.md#storagemanagerupload_folder) 
class method. Specify the local folder to upload as the `local_folder` argument and the target remote location as the
`remote_url` argument. 

```python
StorageManager.upload_folder(local_file="/LocalFolder", remote_url="s3://MyBucket/MyFolder")
```

This method uploads the local folder recursively to remote storage, maintaining the sub-folder structure from the local 
storage. 

For example: If you have a local file `/LocalFolder/sub/file.ext` then `StorageManager.upload_folder(local_file="/LocalFolder", remote_url="s3://MyBucket/MyFolder")`
will create `s3://bucket/sub/file.ext`.

Use the `retries` parameter to set the number of upload attempts for each file in the folder in case 
of failure. If some files fail to upload, the incomplete folder will remain in the target location with the 
successfully uploaded files.

You can input `match_wildcard` so only files matching the wildcard are uploaded.

## Setting Cache Limits

To set a limit on the number of files cached, use the [`StorageManager.set_cache_file_limit()`](../../references/sdk/storage.md#storagemanagerset_cache_file_limit) 
class method and specify the `cache_file_limit` argument as the maximum number of files. This does not limit the cache size, 
only the number of files.

```python
new_cache_limit = StorageManager.set_cache_file_limit(cache_file_limit=100)
```
