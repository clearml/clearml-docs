---
title: Windows
---

<Collapsible title="Important: Upgrading to v2.x from v1.16.0 or older" type="info">

MongoDB major version was upgraded from `v5.x` to `6.x`. Please note that if your current ClearML Server version is older than 
`v1.17` (where MongoDB `v5.x` was first used), you'll need to first upgrade to ClearML Server v1.17.

First upgrade to ClearML Server v1.17 following the procedure below and using [this `docker-compose` file](https://github.com/allegroai/clearml-server/blob/2976ce69cc91550a3614996e8a8d8cd799af2efd/upgrade/1_17_to_2_0/docker-compose-win10.yml). Once successfully upgraded, 
you can proceed to upgrade to v2.x. 

</Collapsible>

**To upgrade ClearML Server Docker deployment:**

1. Shut down the docker containers. 
   
1. Execute one of the following commands, depending upon the version that is being upgraded:
   
   * Upgrading ClearML Server version:

      ```
      docker-compose -f c:\opt\clearml\docker-compose-win10.yml down
      ```
     
   * Upgrading from **Trains Server** to **ClearML Server**:

      ```
      docker-compose -f c:\opt\trains\docker-compose-win10.yml down
      ```
       
1. If upgrading from **Trains Server** version 0.15 or older, a data migration is required before continuing this upgrade. See instructions [here](clearml_server_es7_migration.md).

1. If upgrading from ClearML Server version older than 1.2, you need to migrate your data before upgrading your server. See instructions [here](clearml_server_mongo44_migration.md).

1. Backing up data is recommended, and if the configuration folder is not empty, backing up the configuration.
 
    :::note
    For example, if the configuration is in ``c:\opt\clearml``, then backup ``c:\opt\clearml\config`` and ``c:\opt\clearml\data``. 
    Before restoring, remove the old artifacts in ``c:\opt\clearml\config`` and ``c:\opt\clearml\data``, and then restore. 
    :::
   
1. If upgrading from **Trains Server** to **ClearML Server**, rename `/opt/trains` and its subdirectories to `/opt/clearml`.

1. Download the latest `docker-compose.yml` file:

   ```  
   curl https://raw.githubusercontent.com/allegroai/clearml-server/master/docker/docker-compose-win10.yml -o c:\opt\clearml\docker-compose-win10.yml
   ```
        
1. Startup ClearML Server. This automatically pulls the latest ClearML Server build.
        
   ```   
   docker-compose -f c:\opt\clearml\docker-compose-win10.yml pull
   docker-compose -f c:\opt\clearml\docker-compose-win10.yml up -d
   ```
   
If issues arise during your upgrade, see the FAQ page, [How do I fix Docker upgrade errors?](../faq.md#common-docker-upgrade-errors)
