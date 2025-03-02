---
title: Upgrading Server from v0.15 or Older to ClearML Server
---

:::important updating to ClearML Server v1.2+
If you are upgrading your ClearML Server to version 1.2 or newer, you will need to migrate your database contents to be compatible with the new version, 
after performing the migration instructions below. 
:::

In v0.16, the Elasticsearch subsystem of **Trains Server** was upgraded from version 5.6 to version 7.6. This change necessitates 
the migration of the database contents to accommodate the change in index structure across the different versions.  
  
This page provides the instructions to carry out the migration process. Follow this process if using **Trains Server** 
version 0.15 or older and are upgrading to ClearML Server. 
  
The migration process makes use of a script that automatically performs the following:

* Backs up the existing **Trains Server** Elasticsearch data.
* Launches a pair of Elasticsearch 5 and Elasticsearch 7 migration containers.
* Copies the Elasticsearch indices using the migration containers.
* Terminates the migration containers.
* Renames the original data directory to avoid accidental reuse.


:::warning 
Once the migration process completes successfully, the data is no longer accessible to the older version of Trains Server, 
and ClearML Server needs to be installed.
:::

### Prerequisites


* Read/write permissions for the default **Trains Server** data directory `/opt/clearml/data` and its subdirectories, or, 
  if this default directory is not used, the permissions for the directory and subdirectories that are used.
* A minimum of 8 GB system RAM.
* Minimum free disk space of at least 30% plus two times the size of the data.
* Python version >=2.7 or >=3.6, and Python accessible from the command-line as `python`

### Migrating the Data

**To migrate the data:**

1. If the **Trains Server** is up, shut it down:

    * **Linux and macOS**
    
        ```bash
        docker-compose -f /opt/trains/docker-compose.yml down
        ```
   
    * **Windows**
            
        ```bash
        docker-compose -f c:\opt\trains\docker-compose-win10.yml down
        ```
            
    * **Kubernetes**
        
        ```bash
        kubectl delete -k overlays/current_version
        ```
    
    * **Kubernetes using Helm**
    
        ```bash
        helm del --purge trains-server
        kubectl delete namespace trains          
        ```      
            
1. For **Kubernetes** and **Kubernetes using Helm**, connect to the node in the Kubernetes cluster labeled `app=trains`.
                
1. Download the migration package archive:

   ``` 
   curl -L -O  https://github.com/clearml/clearml-server/releases/download/0.16.0/trains-server-0.16.0-migration.zip
   ```
   
   If the file needs to be downloaded manually, use this direct link: [trains-server-0.16.0-migration.zip](https://github.com/clearml/clearml-server/releases/download/0.16.0/trains-server-0.16.0-migration.zip).

1. Extract the archive:

   ```
   unzip trains-server-0.16.0-migration.zip  -d /opt/trains
   ```
        
1. Migrate the data:      

    * **Linux, macOS, and Windows** - if managing own containers.
    
      Run the migration script. If elevated privileges are used to run Docker (`sudo` in Linux, or admin in Windows), 
      then use elevated privileges to run the migration script.
    
      ```bash
      python elastic_upgrade.py [-s|--source <source_path>] [-t|--target <target_path>] [-n|--no-backup] [-p|--parallel]
      ``` 
      
        The following optional command line parameters can be used to control the execution of the migration script:           
    
        * `<source_path>` - The path to the Elasticsearch data directory in the current **Trains Server** deployment.  
          If not specified, uses the default value of `/opt/trains/data/elastic` (or `c:\opt\trains\data\elastic` in Windows)
        * `<target_path>` - The path to the Elasticsearch data directory in the current **Trains Server** deployment.  
          If not specified, uses the default value of `/opt/trains/data/elastic_7` (or `c:\opt\trains\data\elastic_7` in Windows)
        * `no-backup` - Skip creating a backup of the existing Elasticsearch data directory before performing the migration.  
          If not specified, takes on the default value of `False` (Performs backup)
        * `parallel` - Copy several indices in parallel to utilize more CPU cores. If not specified, parallel indexing is turned off.          
          
    * **Kubernetes**
    
        1. Clone the `trains-server-k8s` repository and change to the new `trains-server-k8s/upgrade-elastic` directory:
    
           ```
           git clone https://github.com/clearml/clearml-server-k8s.git && cd clearml-server-k8s/upgrade-elastic
           ```
            
        1. Create the `upgrade-elastic` namespace and deployments:
        
           ```
           kubectl apply -k overlays/current_version
           ```     
           
           Wait for the job to be completed. To check if it's completed, run:
            
           ```
           kubectl get jobs -n upgrade-elastic
           ```
                
    * **Kubernetes using Helm**
    
        1. Add the `clearml-server` repository to Helm client.

           ```
           helm repo add clearml https://clearml.github.io/clearml-server-helm/
           ```    
           
           Confirm the `clearml-server` repository is now in the Helm client.
    
           ```
           helm search clearml
           ```
           
           The `helm search` results must include `allegroai/upgrade-elastic-helm`.
            
        1. Install `upgrade-elastic-helm` on the cluster:
        
           ```
           helm install allegroai/upgrade-elastic-helm --namespace=upgrade-elastic --name upgrade
           ```     
           
           An upgrade-elastic `namespace` is created in the cluster, and the upgrade is deployed in it.

           Wait for the job to complete. To check if it completed, execute the following command:

           ```
           kubectl get jobs -n upgrade-elastic
           ```

### Verifying the Data Migration

Upon successful completion, the migration script renames the original **Trains Server** directory, which contains the now 
migrated data, and prints a completion message:
```
Renaming the source directory /opt/trains/data/elastic to /opt/trains/data/elastic_migrated_<date_time>.
Upgrade completed.
```
All console output during the execution of the migration script is saved to a log file in the directory where the migration script executes:
``` 
<path_to_script>/upgrade_to_7_<date_time>.log
```    
If the migration script does not complete successfully, the migration script prints the error.

:::important  
For help in resolving migration issues, check the **ClearML** [Slack channel](https://joinslack.clear.ml), 
[GitHub issues](https://github.com/clearml/clearml-server/issues), and the **ClearML Server** sections of the [FAQ](../faq.md).     
:::
    
### Upgrading to ClearML Server v.1.2 or Newer
If you are upgrading your ClearML Server to version 1.2 or newer, you will need to migrate your database contents to be 
compatible with the new version. See instructions [here](clearml_server_mongo44_migration.md). Otherwise, continue the instructions below.

### Completing the Installation

After verifying the data migration completed successfully, continue upgrading your server:
* [AWS EC2 AMIs](upgrade_server_aws_ec2_ami.md)
* [Google Cloud Platform custom images](upgrade_server_gcp.md)
* [Linux and macOS](upgrade_server_linux_mac.md)
* [Windows](upgrade_server_win.md)
