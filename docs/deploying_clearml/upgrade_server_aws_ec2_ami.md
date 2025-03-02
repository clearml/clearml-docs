---
title: AWS EC2 AMIs
---

<Collapsible title="Important: Upgrading to v2.x from v1.16.0 or older" type="info">

MongoDB major version was upgraded from `v5.x` to `6.x`. Please note that if your current ClearML Server version is older than 
`v1.17` (where MongoDB `v5.x` was first used), you'll need to first upgrade to ClearML Server v1.17.

First upgrade to ClearML Server v1.17 following the procedure below and using [this `docker-compose` file](https://github.com/clearml/clearml-server/blob/2976ce69cc91550a3614996e8a8d8cd799af2efd/upgrade/1_17_to_2_0/docker-compose.yml). Once successfully upgraded, 
you can proceed to upgrade to v2.x. 

</Collapsible>

 
The sections below contain the steps to upgrade ClearML Server on the [same AWS instance](#upgrading-on-the-same-aws-instance), and 
to upgrade and migrate to a [new AWS instance](#upgrading-and-migrating-to-a-new-aws-instance).

## Upgrading on the Same AWS Instance

This section contains the steps to upgrade ClearML Server on the same AWS instance.

:::warning
Some legacy **Trains Server** AMIs provided an auto-upgrade on restart capability. This functionality is now deprecated.
:::

**To upgrade your ClearML Server AWS AMI:**

1. Shutdown the ClearML Server executing the following command (which assumes the configuration file is in the environment path). 
   
   ``` 
   docker-compose -f /opt/clearml/docker-compose.yml down
   ```
   
   If you are upgrading from **Trains Server**, use this command:

   ```
   docker-compose -f /opt/trains/docker-compose.yml down
   ```
   
1. [Backing up your data](clearml_server_aws_ec2_ami.md#backing-up-and-restoring-data-and-configuration) is recommended, 
   and if your configuration folder is not empty, backing up your configuration.

1. If upgrading from ClearML Server version older than 1.2, you need to migrate your data before upgrading your server. See instructions [here](clearml_server_mongo44_migration.md).  
If upgrading from Trains Server version 0.15 or older, a data migration is required before continuing this upgrade. See instructions [here](clearml_server_es7_migration.md).
   
1. If upgrading from **Trains Server** to **ClearML Server**, rename `/opt/trains` to `/opt/clearml`.

1. Download the latest `docker-compose.yml` file. Execute the following command:

   ```
   sudo curl https://raw.githubusercontent.com/clearml/clearml-server/master/docker/docker-compose.yml -o /opt/clearml/docker-compose.yml
   ```
   
1. Startup ClearML Server. This automatically pulls the latest ClearML Server build.

     ``` 
     docker-compose -f /opt/clearml/docker-compose.yml pull
     docker-compose -f docker-compose.yml up -d
     ```

## Upgrading and Migrating to a New AWS Instance

This section contains the steps to upgrade ClearML Server on the new AWS instance.

**To migrate and to upgrade your ClearML Server AWS AMI:**

1. Shutdown ClearML Server. Executing the following command (which assumes the configuration file is in the environment path).

   ```
   docker-compose down
   ```
   
1. On the old AWS instance, [backup your data](clearml_server_aws_ec2_ami.md#backing-up-and-restoring-data-and-configuration) 
   and, if your configuration folder is not empty, backup your configuration.

1. If upgrading from Trains Server version 0.15 or older, you need to migrate your data before upgrading your server. See instructions [here](clearml_server_es7_migration.md).
   
1. If upgrading from ClearML Server version 1.1 or older, you need to migrate your data before upgrading your server. See instructions [here](clearml_server_mongo44_migration.md).

1. On the new AWS instance, [restore your data](clearml_server_aws_ec2_ami.md#backing-up-and-restoring-data-and-configuration) and, if the configuration folder is not empty, restore the 
   configuration.

1. Startup ClearML Server. This automatically pulls the latest ClearML Server build.

   ```
   docker-compose -f docker-compose.yml pull
   docker-compose -f docker-compose.yml up -d
   ```