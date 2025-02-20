---
title: Linux or macOS
---

<Collapsible title="Important: Upgrading to v2.x from v1.16.0 or older" type="info">

MongoDB major version was upgraded from `v5.x` to `6.x`. Please note that if your current ClearML Server version is older than 
`v1.17` (where MongoDB `v5.x` was first used), you'll need to first upgrade to ClearML Server v1.17.

First upgrade to ClearML Server v1.17 following the procedure below and using [this `docker-compose` file](https://github.com/clearml/clearml-server/blob/2976ce69cc91550a3614996e8a8d8cd799af2efd/upgrade/1_17_to_2_0/docker-compose.yml). Once successfully upgraded, 
you can proceed to upgrade to v2.x. 

</Collapsible>

<Collapsible title="Important: Upgrading from v0.14 or older" type="info">
  
For Linux only, if upgrading from <strong>Trains Server</strong> v0.14 or older, configure the <strong>ClearML Agent Services</strong>.

   * If ``CLEARML_HOST_IP`` is not provided, then **ClearML Agent Services** uses the external public address of the ClearML Server.
   * If ``CLEARML_AGENT_GIT_USER`` / ``CLEARML_AGENT_GIT_PASS`` are not provided, then **ClearML Agent Services** can't access any private repositories for running service tasks:

      ```
      export CLEARML_HOST_IP=server_host_ip_here
      export CLEARML_AGENT_GIT_USER=git_username_here
      export CLEARML_AGENT_GIT_PASS=git_password_here
      ```
     
:::note
For backwards compatibility, the environment variables ``TRAINS_HOST_IP``, ``TRAINS_AGENT_GIT_USER``, and ``TRAINS_AGENT_GIT_PASS`` are supported.          
:::
    
</Collapsible>

<br/>

**To upgrade ClearML Server Docker deployment:**

1. Shutdown ClearML Server. Execute the following command (which assumes the configuration file is in the environment path):
   
   ```
   docker-compose -f docker-compose.yml down
   ```
        
1. If upgrading from **Trains Server** version 0.15 or older, a data migration is required before continuing this upgrade. See instructions [here](clearml_server_es7_migration.md).

1. If upgrading from ClearML Server version older than 1.2, you need to migrate your data before upgrading your server. See instructions [here](clearml_server_mongo44_migration.md).

1. [Backing up data](clearml_server_linux_mac.md#backing-up-and-restoring-data-and-configuration) is recommended and, if the configuration folder is 
   not empty, backing up the configuration.

1. If upgrading from **Trains Server** to **ClearML Server**, rename `/opt/trains` and its subdirectories to `/opt/clearml`:

   ``` 
   sudo mv /opt/trains /opt/clearml
   ```
   
1. Download the latest `docker-compose.yml` file:

   ```
   curl https://raw.githubusercontent.com/allegroai/clearml-server/master/docker/docker-compose.yml -o /opt/clearml/docker-compose.yml
   ```
   
1. Startup ClearML Server. This automatically pulls the latest ClearML Server build:
        
   ```   
   docker-compose -f /opt/clearml/docker-compose.yml pull
   docker-compose -f /opt/clearml/docker-compose.yml up -d
   ```

If issues arise during your upgrade, see the FAQ page, [How do I fix Docker upgrade errors?](../faq.md#common-docker-upgrade-errors)
