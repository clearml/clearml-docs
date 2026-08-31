---
title: Storage
---


ClearML integrates with popular storage solutions for storing model checkpoints, artifacts, datasets and charts.

Supported storage mediums include:

![Supported storage](../../static/icons/ClearML_Supported_Storage--on-light.png)

To use cloud storage with ClearML, [install](#installation) the `clearml` package for your cloud storage type, and then 
[configure](#configuring-network-storage) your storage credentials.

:::note
Once uploading an object to a storage medium, each machine that uses the object must have access to it.
:::

## Installation

Install the ClearML package for your cloud storage type:
* AWS S3 - `pip install clearml[s3]`
* Azure - `pip install clearml[azure]`
* Google Storage - `pip install clearml[gs]`

## Configuring Network Storage

You can configure storage using any of the following methods, listed in order of precedence (higher ordered methods 
override the lower ones):
1. Command-line arguments (e.g. [clearml-task](../apps/clearml_task.md), [clearml-agent](../clearml_agent/clearml_agent_ref.md), 
   [clearml-session](../apps/clearml_session.md), [clearml-data](../clearml_data/clearml_data_cli.md) arguments)
1. [Environment variables](../configs/env_vars.md)
1. [Configuration Vaults](../webapp/settings/webapp_settings_profile.md#configuration-vault) (available under the ClearML Enterprise plan)
1. [clearml.conf](../configs/clearml_conf.md)

:::note
Most examples below use the configuration file, but the same parameters can be applied via Vaults
:::

The ClearML configuration file uses [HOCON](https://github.com/lightbend/config/blob/main/HOCON.md) format, which lets you 
reference environment variables from within the file's own values (as shown in the examples below), separately from the 
environment variable overrides mentioned above.

### AWS S3

You can configure S3 credentials under the `sdk.aws.s3` section of the `clearml.conf`.

You can also give access to specific S3 buckets in the `sdk.aws.s3.credentials` section. If no bucket-specific 
configuration is provided, the default values under `sdk.aws.s3` are used.

You can also enable using a credentials chain allowing Boto3 
to select the right credentials from environment variables, a credentials file, and metadata service with an IAM role 
configured. For more details, see [Boto3 documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html#configuring-credentials).

You can specify additional [ExtraArgs](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-uploading-files.html#the-extraargs-parameter) 
to pass to Boto3 when uploading files. You can set this on a per-bucket basis. 

```
sdk {
    aws {
        s3 {
            # S3 credentials, used for read/write access by various SDK elements
    
            # default, used for any bucket not specified below
            key: ""
            secret: ""
            region: ""
            use_credentials_chain: false
            extra_args: {}
            
            credentials: [
                # specifies key/secret credentials to use when handling s3 URLs (read or write)
                {
                    bucket: "my-bucket-name"
                    key: ""
                    secret: ""
                    use_credentials_chain: false
                },
                    
            ]
        }
        boto3 {
            pool_connections: 512
            max_multipart_concurrency: 16
        }
    }
}
```

AWS S3 access parameters can be specified by referencing the standard environment variables if they are already defined.

For example: 
```
sdk {
    aws {
        s3 {
            # default, used for any bucket not specified below
            key: ${AWS_ACCESS_KEY_ID}
            secret: ${AWS_SECRET_ACCESS_KEY}
            region: ${AWS_DEFAULT_REGION}
        }
    }
}
``` 

#### Non-AWS Endpoints
ClearML supports any S3-compatible services, such as [MinIO](https://github.com/minio/minio) and
[Backblaze B2](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api) as well as other cloud-based or locally
deployed storage services. For non-AWS endpoints, use a configuration like this:

```
sdk {
    aws {
        s3 {
            # default, used for any bucket not specified below
            key: ""
            secret: ""
            region: ""
    
            credentials: [
                {
                    # This will apply to all buckets in this host (unless key/value is specifically provided for a given bucket)
                    host: "my-minio-host:9000"
                    key: ""
                    secret: ""
                    multipart: false
                    secure: false
                    verify: true # OR "/path/to/ca/bundle.crt" OR "https://url/of/ca/bundle.crt" OR false to not verify                    
                }
            ]
        } 
    }
}
```

To force usage of a non-AWS endpoint, port declaration is *always* needed (e.g. `host: "my-minio-host:9000"`), 
even for standard ports like `433` for HTTPS (e.g. `host: "my-minio-host:433"`).

:::important
Port specification is required for non-AWS S3 endpoint access. Use the following URI 
format: `s3://<hostname>:<port>/<bucket-name>/path`.

This applies when:
* Setting output URIs for tasks (via SDK or UI)
* Registering Hyper-Dataset frames
* All fields where endpoint access is specified. 
:::


##### TLS
To enable TLS, pass `secure: true`. For example: 
```
sdk {
   aws {
      s3 {
         key: ""
         secret: ""
         region: ""
   
         credentials: [
            {
               host: "my-minio-host:9000"
               key: ""
               secret: ""
               multipart: false
               secure: true
               verify: true
            }
         ]
      } 
   }
}
```

To control SSL certificate verification, use the `sdk.aws.s3.credentials.verify` configuration option:
* By default, verify is set to `true`, meaning certificate verification is enabled
* You can provide a path or a URL to a CA bundle for custom certificate verification

##### Dell PowerScale with S3
When using Dell PowerScale as your S3-compatible storage backend, set `sdk.aws.boto3.signature_version` to `"s3"`:

```
sdk {
    aws {
        boto3 {
            signature_version: "s3"
        }
    }
}
```
This ensures Boto3 uses the correct signature version required by PowerScale's S3 interface.

:::note
You still must configure access credentials and endpoint information under `sdk.aws.s3` and `sdk.aws.s3.credentials` as 
described [above](#non-aws-endpoints).
:::

### Azure
To configure Azure blob storage specify the account name and key.

```
sdk {
    azure.storage {
        containers: [
            {
                account_name: ""
                account_key: ""
                # container_name:
            }
        ]
    }
}
```

You can specify Azure's storage access parameters by referencing the standard environment variables if already defined.

For example:
```
sdk {
    azure.storage {
        containers: [
            {
                account_name: ${AZURE_STORAGE_ACCOUNT}
                account_key: ${AZURE_STORAGE_KEY}
                # container_name:
            }
        ]
    }
}
```

### Google Storage
To configure Google Storage, specify the project and the path to the credentials JSON file.

It's also possible to specify credentials for a specific bucket in the `google.storage.credentials` section. The default 
configuration provided in the `google.storage` section is applied to any bucket without a bucket-specific configuration.

```
sdk {
    google.storage {
        # Default project and credentials file
        # Will be used when no bucket configuration is found
        project: "clearml"
        credentials_json: "/path/to/credentials.json"
    
        # Specific credentials per bucket and sub directory
        credentials = [
             {
                 bucket: ""
                 subdir: "path/in/bucket" # Not required
                 project: ""
                 credentials_json: "/path/to/credentials.json"
             },
         ]
    }
}
```

You can specify GCP storage access parameters by referencing the standard environment variables if already defined.

```
sdk {
    google.storage {
        credentials = [
             {
                 bucket: ""
                 subdir: "path/in/bucket" # Not required
                 project: ""
                 credentials_json: ${GOOGLE_APPLICATION_CREDENTIALS}
             },
         ]
    }
}
```

:::tip[Direct Decoding]
From v1.13.2, `clearml` supports directly decoding JSON from the `credentials_json` argument. If ClearML
fails to load the credentials as a file, it will attempt to decode the JSON directly. 
:::

## Client Configuration

This section covers how ClearML clients interact with configured storage services.

### StorageManager

The [StorageManager](../references/sdk/storage.md) class provides a storage-agnostic interface for downloading, uploading, 
and caching content directly from code, so you don't need to handle each storage backend's own SDK or API. It supports 
HTTP(S), S3, Google Cloud Storage, Azure, and local file system paths.

StorageManager provides methods for:
* Downloading a [file](../guides/storage/examples_storagehelper.md#downloading-a-file) or 
  [folder](../guides/storage/examples_storagehelper.md#downloading-a-folder) from remote storage to a local path, with 
  automatic caching so the same object isn't downloaded twice
* Uploading a local [file](../guides/storage/examples_storagehelper.md#uploading-a-file) or 
  [folder](../guides/storage/examples_storagehelper.md#uploading-a-folder) to remote storage, with configurable retry 
  behavior on failure
* [Limiting the number of files](../guides/storage/examples_storagehelper.md#setting-cache-limits) kept in the local cache

See [StorageManager Examples](../guides/storage/examples_storagehelper.md) for the full set of code samples, including 
folder upload/download, upload retries, download/upload progress reporting, and cache file limits.

#### Path Substitution
The ClearML StorageManager supports local path substitution when fetching files.

This is especially useful when managing data using [`clearml-data`](../clearml_data/clearml_data_cli.md)! If different data consumers have the data physically stored in different locations, path 
substitution allows for registering the data into `clearml-data` once, and then storing and accessing it in multiple locations.

To enable path substitution, configure the following:

```bash
sdk {
    storage {
        path_substitution = [
            # Replace registered links with local prefixes,
            # Solve mapping issues, and allow for external resource caching.
            # {
            #     registered_prefix = "s3://bucket/research"
            #     local_prefix = "file:///mnt/shared/bucket/research
            # },
            # {
            #     registered_prefix = "file:///mnt/shared/folder/"
            #     local_prefix = "file:///home/user/shared/folder"
            # }
        ]
    }
}
```

### Per-task Storage Control
In addition to global storage configuration, each task can control where its own artifacts and models are stored by 
setting the `Task.output_uri` property.

* If `output_uri` is set, all artifacts and models logged by the task will be stored under the specified location.
* The URI can point to any supported storage backend (e.g. `s3://bucket/path`, `gs://bucket/path`, `azure://container/path`, 
  or `file:///mnt/shared/path`).
* If `output_uri` is not set, ClearML falls back to the global storage configuration.

```python
from clearml import Task
task = Task.init(project_name="Demo", task_name="Train Model")
task.output_uri = "s3://my-bucket/training-runs/"
```

### Caching
ClearML also manages a cache of all downloaded content so nothing is duplicated, and code won't need to download the same
piece twice!

Set cache location by configuring the following:

```
sdk {
    storage {
        cache {
            # Defaults to <system_temp_folder>/clearml_cache
            default_base_dir: "~/.clearml/cache"
        }
    
        direct_access: [
            # Objects matching are considered to be available for direct access, i.e. they will not be downloaded
            # or cached, and any download request will return a direct reference.
            # Objects are specified in glob format, available for url and content_type.
            { url: "file://*" }  # file-urls are always directly referenced
        ]
    }
}
```

Additional cache options are available, such as limiting the number of cached files and choosing a disk-space-based 
eviction strategy instead. See the [clearml.conf Reference](../configs/clearml_conf.md#sdkstoragecache) for the 
full list.

### Direct Access
By default, all artifacts (Models / Artifacts / Datasets) are automatically downloaded to the cache before they're used.

Some storage mediums (NFS / Local storage) allows for direct access,
which means that the code would work with the object where it's originally stored and not downloaded to cache first.

To enable direct access, specify the URLs to access directly.