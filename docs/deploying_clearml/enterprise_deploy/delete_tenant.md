---
title: Deleting Tenants from ClearML
---

The following is a step-by-step guide for deleting tenants (i.e. companies, workspaces) from ClearML.

:::caution 
Deleting a tenant is a destructive operation that cannot be undone.
* Make sure you have the data prior to deleting the tenant.
* Backing up the system before deleting is recommended.
:::

The tenant deletion is done from MongoDB, ElasticsSearch, and the Fileserver.

The first two are done from within the `apiserver` container, and last from within the `fileserver` container.

Any external artifacts (ex: AWS S3, GCS, minio) can be removed manually.

## Deleting Tenants from MongoDB and ElasticSearch

1. Enter the `apiserver` in one of the following ways 
   * In `docker-compose`:

     ```
     sudo docker exec -it allegro-apiserver /bin/bash
     ```
   * In Kubernetes:

     ```
     kubectl -n <namespace> exec -it <apiserver pod name> -c clearml-apiserver -- /bin/bash
     ```

1. Set the ID and the name of the  company (tenant) you wish to delete

   ```
   tenant_to_delete=<tenant-id>
   company_name_to_delete="<company-name>"
   ```

1. Delete the company's data from MongoDB:

   ```
   PYTHONPATH=../trains-server-repo python3 \
     -m jobs.management.delete_company_data_from_mongo \
     --id $tenant_to_delete \
     --name <company-name> \
     --delete-user
   ```

   :::note
   This also deletes the admin users. Remove `--delete-user` to avoid this.
   ::: 

1. Delete the company's data from ElasticSearch:

   ```
   PYTHONPATH=../trains-server-repo python3 \
   -m jobs.management.cleanup_deleted_companies \
   --ids $tenant_to_delete --delete-company
   ```

1. Exit pod/container

## Deleting Tenants from the Fileserver

To remove a tenant's data from the fileserver, you can choose one of the following methods depending on your deployment setup:

* Option 1: Delete the tenant's data from within the fileserver container or pod.
* Option 2: Delete the tenant's data externally from the host system.

### Option 1 - From Within the Fileserver


1. Enter the `fileserver` in one of the following ways 
   * In `docker-compose`:

     ```
     sudo docker exec -it allegro-fileserver /bin/bash
     ```
   * In Kubernetes:

     ```
     kubectl -n <namespace> exec -it <fileserver pod name> -c clearml-fileserver -- /bin/bash
     ```
     
1. Run the following:

   ```
   rm -rf /mnt/fileserver/<tenant-id>
   ```

1. Exit pod/container

### Option 2 - External Deletion

#### Docker compose

Run the following:

```
rm -rf /opt/allegro/data/fileserver/<tenant-id>
```

#### Kubernetes

Run the following:

```
kubectl -n <namespace> exec -it <apiserver-pod-name> -c clearml-apiserver -- /bin/bash -c "PYTHONPATH=../trains-server-repo python3 -m jobs.management.delete_company_data_from_mongo --id <tenant-id> --delete-user"

kubectl -n <namespace> exec -it <apiserver-pod-name> -c clearml-apiserver -- /bin/bash -c "PYTHONPATH=../trains-server-repo python3 -m jobs.management.cleanup_deleted_companies --ids <tenant-id> --delete-company"

kubectl -n <namespace> exec -it <fileserver-pod-name> -c clearml-fileserver -- /bin/bash -c "rm -rf /mnt/fileserver/<tenant-id>"
```

