---
title: Upgrading Server from v1.1 or Older
---

:::important 
If your server is v0.15 or older, you must first go through the [v0.16 upgrade procedure](clearml_server_es7_migration.md) 
and continue here once successfully completed.
:::

In v1.2, the MongoDB subsystem of ClearML Server has been upgraded from version 3.6 to version 4.4. This change 
necessitates the migration of the database contents to be compatible with the new version.

:::note Kubernetes installations
[ClearML’s helm chart](https://github.com/clearml/clearml-helm-charts/tree/main/charts/clearml) is already running 
mongodb version 4.4. If your ClearML server had been deployed with this chart (with the default mongodb bitnami chart) - 
You can stop reading here, as no migration is required.
:::

The migration process includes the following:
* Backing up your data
* Creating a copy of the data which will be migrated for use with the new version
* Sequentially running data migration for MongoDB: 3.6->4.0, 4.0->4.2, 4.0->4.4

At the end of the process, your data will be available in the new location, ready to be used with ClearML Server v1.2.

Once ClearML Server v1.2 is up and running, and you are satisfied that your data is intact, you can safely delete the 
old copy of your data.

## Prerequisites 
* Read/write permissions for the default ClearML Server data directory `/opt/clearml/data` and its subdirectories, or, 
  if a different location had been used, permissions for that directory and its subdirectories.
* Minimum free disk space of at least three times the size of the data.
* Python version >=2.7 or >=3.6, and Python accessible from the command-line as python

## Before You Begin
To avoid data corruption, shut down your ClearML server before applying the migration procedure:
* Linux and macOS

  ```bash
  docker-compose -f /opt/clearml/docker-compose.yml down
  ```
* Windows

  ```bash
  docker-compose -f c:\opt\clearml\docker-compose-win10.yml down
  ```

## Migrating the Data

### Migrating by Script
A migration script is available to automatically run this process for all supported OSs.  
[Download the script](https://github.com/clearml/clearml-server/releases/download/1.2.0/clearml-server-1.2.0-migration.py) and run it on your ClearML server.
Run `clearml-server-1.2.0-migration.py -–help` to see execution options.  
Note the script will create a backup archive of your data in the original directory.

Once the script finishes successfully, [continue with your upgrade](#completing-the-installation).

### Manual migration

The following are the instructions for migrating your ClearML data from mongodb 3.6 to mongodb 4.4.

The commands are provided for a Linux environment, and assume ClearML is installed in its default paths.

If you are using a different OS, replace the shell and docker commands to the ones appropriate for your OS. If you’ve 
installed ClearML under a different path, replace the file locations accordingly.

1. Backup the source data folder:
   
   ```bash
   sudo tar -zcf mongodb_upgrade.gz -C /opt/clearml/data/mongo .
   ```
1. Copy the data to the new folder and set permissions (permissions are required on Linux):

   ```bash
   sudo mkdir /opt/clearml/data/mongo_4
   sudo tar -xzf mongodb_upgrade.gz -C /opt/clearml/data/mongo_4
   sudo chown -R 1000:1000 /opt/clearml/data/mongo_4    
   ```
1. Run the mongo 4.0 container:

   ```bash
   sudo docker run -id -v /opt/clearml/data/mongo_4/db:/data/db -v /opt/clearml/data/mongo_4/configdb:/data/configdb --name mongodb_upgrade mongo:4.0.27
   ```
1. Upgrade data to mongo 4.0:
   
   ```bash
   sudo docker exec mongodb_upgrade bash -c 'mongo --eval "db.adminCommand({setFeatureCompatibilityVersion:\"4.0\"})"'
   ```
   This command should return an `{ "ok" : 1 }` response.
1. Stop the mongo 4.0 container:
   
   ```bash
   sudo docker stop mongodb_upgrade && sudo docker rm mongodb_upgrade
   ```
1. Run the mongo 4.2 container:

   ```bash
   sudo docker run -id -v /opt/clearml/data/mongo_4/db:/data/db -v /opt/clearml/data/mongo_4/configdb:/data/configdb --name mongodb_upgrade mongo:4.2.16
   ```
1. Upgrade data to mongo 4.2:

   ```bash
   sudo docker exec mongodb_upgrade bash -c 'mongo --eval "db.adminCommand({setFeatureCompatibilityVersion:\"4.2\"})"'  
   ```
   This command should return an `{ "ok" : 1 }` response. 
1. Stop the mongo 4.2 container:

   ```bash
   sudo docker stop mongodb_upgrade && sudo docker rm mongodb_upgrade
   ```
1. Run the mongo 4.4 container:

   ```bash
   sudo docker run -id -v /opt/clearml/data/mongo_4/db:/data/db -v /opt/clearml/data/mongo_4/configdb:/data/configdb --name mongodb_upgrade mongo:4.4.9
   ```
1. Upgrade data to mongo 4.4:

   ```bash
   sudo docker exec mongodb_upgrade bash -c 'mongo --eval "db.adminCommand({setFeatureCompatibilityVersion:\"4.4\"})"'   
   ```
   This command should return an `{ "ok" : 1 }` response.
1. Stop the mongo 4.4:

   ```bash
   sudo docker stop mongodb_upgrade && sudo docker rm mongodb_upgrade
   ```
## Completing the Installation
Continue upgrading your ClearML Server:
   * [AWS EC2 AMIs](upgrade_server_aws_ec2_ami.md)
   * [Google Cloud Platform custom images](upgrade_server_gcp.md)
   * [Linux and macOS](upgrade_server_linux_mac.md)
   * [Windows](upgrade_server_win.md)
   
