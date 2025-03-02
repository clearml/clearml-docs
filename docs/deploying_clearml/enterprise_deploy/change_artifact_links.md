---
title: Changing ClearML Artifacts Links
---

This guide describes how to update artifact references in the ClearML Enterprise server.

By default, artifacts are stored on the file server; however, an external storage such as AWS S3, Minio, Google Cloud 
Storage, etc. may be used to store artifacts. References to these artifacts may exist in ClearML databases: MongoDB and ElasticSearch.  
This procedure should be used if external storage is being migrated to a different location or URL.

:::important
This procedure does not deal with the actual migration of the data--only with changing the references in ClearML that 
point to the data.
:::

## Preparation

### Version Confirmation

To change the links, use the `fix_fileserver_urls.py` script, located inside the `allegro-apiserver` 
Docker container. This script will be executed from within the `apiserver` container. Make sure the `apiserver` version 
is 3.20 or higher.

### Backup

It is highly recommended to back up the ClearML MongoDB and ElasticSearch databases before running the script, as the 
script changes the values in the databases, and can't be undone.

## Fixing MongoDB links

1. Access the `apiserver` Docker container:  
  * In `docker-compose:`
    
     ```commandline
     sudo docker exec -it allegro-apiserver /bin/bash
      ```
    
  * In Kubernetes:
   
     ```commandline
     kubectl exec -it -n clearml <clearml-apiserver-pod-name> -- bash
     ```

1. Navigate to the script location in the `upgrade` folder:

   ```commandline
   cd /opt/seematics/apiserver/server/upgrade
   ```
     
1. Run the following command:
 
    :::important
    Before running the script, verify that this is indeed the correct version (`apiserver` v3.20 or higher, 
    or that the script provided by ClearML was copied into the container).
    ::::
 
    ```commandline
    python3 fix_fileserver_urls.py \
    --mongo-host mongodb://mongo:27017 \
    --elastic-host elasticsearch:9200 \
    --host-source "<old fileserver host and/or port, as in artifact links>" \
    --host-target "<new fileserver host and/or port>" --datasets
    ```

:::note Notes
* If MongoDB or ElasticSearch services are accessed from the `apiserver` container using custom addresses, then 
`--mongo-host` and `--elastic-host` arguments should be updated accordingly.  
* If ElasticSearch is set up to require authentication then the following arguments should be used to pass the user 
and password: `--elastic-user <es_user> --elastic-password <es_pass>`
:::

The script fixes the links in MongoDB, and outputs `cURL` commands for updating the links in ElasticSearch.

## Fixing the ElasticSearch Links

Copy the `cURL` commands printed by the script run in the previous stage, and run them one after the other. Make sure to 
inspect that a "success" result was returned from each command. Depending on the amount of the data in the ElasticSearch, 
running these commands may take some time.