---
title: Changing ClearML Artifacts Links
---

This guide describes how to update artifact references in the ClearML Enterprise server.

By default, artifacts are stored on the file server; however, an external storage such as AWS S3, Minio, Google Cloud 
Storage, etc. may be used to store artifacts. References to these artifacts may exist in ClearML databases: MongoDB and ElasticSearch.  
This procedure should be used if external storage is being migrated to a different location or URL.

:::important
This procedure does not deal with the actual migration of the data. It only changes the references in ClearML that 
point to the data.
:::

## Preparation

### Identifying the URL Prefix

The script updates links by prefix: every link that starts with the old URL prefix is changed to start with the new 
URL prefix instead. Before running it, note the old prefix exactly as it appears in your existing links, and the new 
prefix that should replace it. Use a trailing slash on both the old and new prefixes, or on neither.

To view an existing link in the ClearML UI, open a task, go to its **ARTIFACTS** tab, and select an artifact to see 
its **File Path**.

:::tip[Examples]
* ClearML file server: `https://files.host.domain.name/path/to/filename.extension`
* External S3 bucket: `s3://bucket-name/path/to/filename.extension`
:::

### Version Confirmation

To change the links, use the `fix_fileserver_urls.py` script, located inside the `clearml-apiserver` 
Docker container. This script will be executed from within the `apiserver` container. Make sure the `apiserver` version 
is 3.20 or higher.

### Backup

It is highly recommended to back up the ClearML MongoDB and ElasticSearch databases before running the script, as the 
script changes the values in the databases, and can't be undone.

## Fixing MongoDB links

1. Access the `apiserver` Docker container:  

   * In `docker-compose`:
    
      ```commandline
      sudo docker exec -it clearml-apiserver /bin/bash
      ```
    
   * In Kubernetes:
   
      ```commandline
      kubectl exec -it -n clearml <clearml-apiserver-pod-name> -- bash
      ```

1. Navigate to the script location in the `upgrade` folder:

   ```commandline
   cd /opt/seematics/apiserver/server/upgrade
   ```
     
1. Run the script, replacing the `--host-source` and `--host-target` values with your old and new URL prefixes. In 
   this example, the old prefix includes a port and the new one does not:
 
    ```commandline
    python3 fix_fileserver_urls.py \
    --mongo-host mongodb://mongo:27017 \
    --elastic-host elasticsearch:9200 \
    --host-source "https://files.old.host.domain.name:8081/" \
    --host-target "https://files.new.host.domain.name/" \
    --datasets
    ```

:::note[Notes]
* If MongoDB or ElasticSearch services are accessed from the `apiserver` container using custom addresses, then 
`--mongo-host` and `--elastic-host` arguments should be updated accordingly.  
* If MongoDB is set up to require authentication (`apiserver` v3.26 or higher), use the following arguments to pass 
the user and password: `--mongo-user <mongo_user> --mongo-password <mongo_pass>`
* If ElasticSearch is set up to require authentication then the following arguments should be used to pass the user 
and password: `--elastic-user <es_user> --elastic-password <es_pass>`
* `--datasets` also generates the command for updating links in Hyper-Datasets.
* To write the ElasticSearch commands to a JSON file instead of printing them, add `--output <file_name>.json`.
:::

The script fixes the links in MongoDB, and outputs `cURL` commands for updating the links in ElasticSearch. The script 
also saves its output, including the `cURL` commands (unless `--output` is used), to a `fix_fileserver_urls_<timestamp>.log` file in the current 
directory. This file is lost if the container is recreated, so make sure to keep a copy of the commands until you have 
run them.

## Fixing the ElasticSearch Links

Copy the `cURL` commands printed by the script run in the previous stage (or saved to the `--output` file), and run 
them one after the other. Make sure to 
inspect that a "success" result was returned from each command. Depending on the amount of the data in the ElasticSearch, 
running these commands may take some time.
