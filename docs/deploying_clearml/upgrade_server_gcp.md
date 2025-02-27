---
title: Google Cloud Platform
---

<Collapsible title="Important: Upgrading to v2.x from v1.16.0 or older" type="info">

MongoDB major version was upgraded from `v5.x` to `6.x`. Please note that if your current ClearML Server version is older than 
`v1.17` (where MongoDB `v5.x` was first used), you'll need to first upgrade to ClearML Server v1.17.

First upgrade to ClearML Server v1.17 following the procedure below and using [this `docker-compose` file](https://github.com/clearml/clearml-server/blob/2976ce69cc91550a3614996e8a8d8cd799af2efd/upgrade/1_17_to_2_0/docker-compose.yml). Once successfully upgraded, 
you can proceed to upgrade to v2.x. 

</Collapsible>

**To upgrade ClearML Server Docker deployment:**

1. Shut down the docker containers with the following command:

   ```
   docker-compose -f docker-compose.yml down
   ```

1. [Backing up data](clearml_server_gcp.md#backing-up-and-restoring-data-and-configuration) is recommended, and if the configuration folder is 
   not empty, backing up the configuration.
   
1. If upgrading from **Trains Server** version 0.15 or older to **ClearML Server**, do the following:

    1. Follow these [data migration instructions](clearml_server_es7_migration.md).
       
    1. Rename `/opt/trains` and its subdirectories to `/opt/clearml`:
   
       ```
       sudo mv /opt/trains /opt/clearml
       ```
       
1. If upgrading from ClearML Server version 1.1 or older, you need to migrate your data before upgrading your server. See instructions [here](clearml_server_mongo44_migration.md).

1. Download the latest `docker-compose.yml` file:

   ```
   curl https://raw.githubusercontent.com/allegroai/clearml-server/master/docker/docker-compose.yml -o /opt/clearml/docker-compose.yml
   ```
   
1. Startup ClearML Server. This automatically pulls the latest ClearML Server build.
        
   ```   
   docker-compose -f /opt/clearml/docker-compose.yml pull
   docker-compose -f /opt/clearml/docker-compose.yml up -d
   ```
        
If issues arise during your upgrade, see the FAQ page, [How do I fix Docker upgrade errors?](../faq.md#common-docker-upgrade-errors)
