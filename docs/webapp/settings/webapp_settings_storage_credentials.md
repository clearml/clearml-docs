---
title: Storage Credentials 
---

To enable ClearML to delete task artifacts stored in cloud storage when a task is deleted, configure access credentials for your storage provider:
* [Google Cloud Storage](#google-cloud-storage)
* [AWS S3 Storage](#aws-s3-storage)
* [Azure](#azure)

![Storage Credentials page](../../img/webapp_settings_storage_credentials.png#light-mode-only)
![Storage Credentials page](../../img/webapp_settings_storage_credentials_dark.png#dark-mode-only)

## Google Cloud Storage
Set up credentials for Google Cloud buckets: 
* Default credentials - These credentials apply to all GCS buckets unless bucket-specific credentials are set.
  * Project - Default Google Cloud Storage project
  * Credentials JSON
* Bucket specific credentials:
  * Bucket 
  * Project
  * Credentials JSON

## AWS S3 Storage 
Set up credentials for S3 protocol storage (i.e. AWS S3, MinIO, etc.): 
* Default credentials - These credentials apply to all buckets unless bucket-specific credentials are set:
  * Access Key - Default access key for the storage service.
  * Secret -  Default secret access key.
  * Access token - Session key for temporary credentials (if applicable).
  * Region -  Default region for all unspecified buckets.
  * Credentials Chain - If selected, use boto3 default [credentials search](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html#configuring-credentials) 
  (i.e. look for credentials in environment variables, credential files, and instance metadata services).
* Bucket Specific Credentials: 
  * Bucket - Name of the specific bucket.
  * Region - Region for the bucket.
  * Host - For non-AWS endpoints, the host URL and port number of the specific bucket. Note that port specification 
  is *always* needed (e.g. `my-minio-host:9000`), even for standard ports like 433 for HTTPS (e.g. `my-minio-host:433`) 
  * Secure Host - Select in order to enable TLS. 
  * Verify SSL certificate - Select to enable SSL verification for secure hosts.
  * Access key - Access key for the bucket.
  * Secret - Secret key for the bucket.
  * Access token - The session key for your bucket. This is only needed when you are using temporary credentials.
  * Use Credentials chain - If selected, use boto3 default [credentials search](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html#configuring-credentials) 
  (i.e. looks for credentials in environment variables, credential files, and instance metadata services).

## Azure
Set up credentials for Azure storage containers: 
* Account name - Azure storage account name.
* Account key - Azure storage account key.
* Container name - Name of the specific container.



