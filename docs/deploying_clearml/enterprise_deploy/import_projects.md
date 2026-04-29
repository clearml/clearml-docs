---
title: Project Migration
---

When migrating from a ClearML Open Server to a ClearML Enterprise Server, you may need to transfer projects. This is done 
using the `data_tool.py` script. This utility is available in the `apiserver` Docker image, and can be used for 
exporting and importing ClearML project data for both open source and Enterprise versions.

This guide covers the following:
* Exporting data from Open Source and Enterprise servers  
* Importing data into an Enterprise server 
* Handling the artifacts stored on the file server. 

:::note 
Export instructions differ for ClearML open and Enterprise servers. Make sure you follow the guidelines that match your 
server type.
:::

## Exporting Data

The export process is done by running the ***data_tool*** script that generates a zip file containing project and task 
data. This file should then be copied to the server on which the import will run.

Note that artifacts stored in the ClearML ***file server*** should be copied manually if required (see [Handling Artifacts](#handling-artifacts)).

### Exporting Data from ClearML Open Servers

#### Preparation

* Make sure the `apiserver` is at least Open Source server version 1.12.0.  
* Note that any `pending` or `running` tasks will not be exported. If you wish to export them, make sure to stop/dequeue 
them before exporting.

#### Running the Data Tool

Execute the data tool within the `apiserver` container.

Open a bash session inside the `apiserver` container of the server:  
* In `docker-compose`:
  
  ```commandline
  sudo docker exec -it clearml-apiserver /bin/bash
  ```

* In Kubernetes:
  
  ```commandline
  kubectl exec -it -n <clearml-namespace> <clearml-apiserver-pod-name> -- bash 
  ```

#### Export Commands
**To export specific projects:**

```commandline
python3 -m apiserver.data_tool export --projects <project_id1> <project_id2>
--statuses created stopped published failed completed --output <output-file-name>.zip
```

As a result, you should get a `<output-file-name>.zip` file that contains all the data from the specified projects and 
their children.

**To export all the projects:**

```commandline
python3 -m apiserver.data_tool export \
  --all \
  --statuses created stopped published failed completed \
  --output <output-file-name>.zip
```

#### Optional Parameters

* `--experiments <list of experiment IDs>` - If not specified then all experiments from the specified projects are exported  
* `--statuses <list of task statuses>` - Export tasks of specific statuses. If the parameter 
  is omitted, only `published` tasks are exported  
* `--no-events` - Do not export task events, i.e. logs and metrics (scalar, plots, debug samples).

Make sure to copy the generated zip file containing the exported data.

### Exporting Data from ClearML Enterprise Servers

#### Preparation

* Make sure the `apiserver` is at least Enterprise Server version 3.18.0.  
* Note that any `pending` or `running` tasks will not be exported. If you wish to export them, make sure to stop/dequeue 
before exporting.

#### Running the Data Tool

Execute the data tool from within the `apiserver` docker container.

Open a bash session inside the `apiserver` container of the server:  
* In `docker-compose`:
  
  ```commandline
  sudo docker exec -it clearml-apiserver /bin/bash
  ```
  
* In Kubernetes:
  
  ```commandline
  kubectl exec -it -n <clearml-namespace> <clearml-apiserver-pod-name> -- bash 
  ```

#### Export Commands

**To export specific projects:**

```commandline
PYTHONPATH=/opt/seematics/apiserver/trains-server-repo python3 data_tool.py \
  export \
  --projects <project_id1> <project_id2> \
  --statuses created stopped published failed completed \
  --output <output-file-name>.zip
```

As a result, you should get `<output-file-name>.zip` file that contains all the data from the specified projects and 
their children.

**To export all the projects:**

```commandline
PYTHONPATH=/opt/seematics/apiserver/trains-server-repo python3 data_tool.py \
  export \
  --all \
  --statuses created stopped published failed completed \
  --output <output-file-name>.zip
```

#### Optional Parameters

* `--experiments <list of experiment IDs>` - If not specified then all experiments from the specified projects are exported  
* `--statuses <list of task statuses>` - Can be used to allow exporting tasks of specific statuses. If the parameter is
  omitted, only `published` tasks are exported.  
* `--no-events` - Do not export task events, i.e. logs, and metrics (scalar, plots, debug samples).

Make sure to copy the generated zip file containing the exported data.

## Importing Data

This section explains how to import the exported data into a ClearML Enterprise server.

### Preparation

* It is highly recommended to back up the ClearML databases before importing data, as import injects data into the 
databases, and can't be undone.
* Make sure you are working with `apiserver` version 3.22.3 or higher.
* Make the zip file accessible from within the `apiserver` container by copying the exported data to the 
`apiserver` container or to a folder on the host, which the `apiserver` is mounted to.

### Usage

The data tool should be executed from within the `apiserver` docker container.

1. Open a bash session inside the `apiserver` container of the server:  
   * In `docker-compose`:
  
     ```commandline
     sudo docker exec -it clearml-apiserver /bin/bash
     ```
  
   * In Kubernetes:
  
     ```commandline
     kubectl exec -it -n <clearml-namespace> <clearml-apiserver-pod-name> -- bash 
     ```

1. Run the data tool script in *import* mode:

   ```commandline
   PYTHONPATH=/opt/seematics/apiserver/trains-server-repo python3 data_tool.py \
     import \
     <path to zip file> \ 
     --company <company_id> \
     --user <user_id>
   ```

   * `company_id`- The default company ID used in the target deployment. Inside the `apiserver` container you can 
     usually get it from the environment variable `CLEARML__APISERVER__DEFAULT_COMPANY`.   
     If you do not specify the `--company` parameter then all the data will be imported as `Examples` (read-only)  
   * `user_id` - The ID of the user in the target deployment who will become the owner of the imported data

## Handling Artifacts

***Artifacts*** refers to any content which the ClearML server holds references to. This can include: 
* Dataset or Hyper-Dataset frame URLs
* ClearML artifact URLs 
* Model snapshots
* Debug samples

Artifacts may be stored in any external storage (e.g., AWS S3, minio, Google Cloud Storage) or in the ClearML file server.  
* If the artifacts are **not** stored in the ClearML file server, they do not need to be moved during the export/import process, 
as the URLs registered in ClearML entities pointing to these artifacts will not change.  
* If the artifacts are stored in the ClearML file server, then the file server content must also be moved, and the URLs 
  in the ClearML databases must point to the new location. See instructions [below](#exporting-file-server-data-for-clearml-open-server).

### Exporting File Server Data for ClearML Open Server

Data in the file server is organized by project. For each project, all data references by entities in that project is 
stored in a folder bearing the name of the project. This folder can be located in: 

```
${CLEARML_ROOT}/data/fileserver/<project name>
```

The entire projects' folders content should be copied to the target server (see [Importing Fileserver Data](#importing-file-server-data)).

### Exporting File Server Data for ClearML Enterprise Server

Data in the file server is organized by tenant and project. For each project, all data references by entities in that 
project is stored in a folder bearing the name of the project. This folder can be located in:

```
${CLEARML_ROOT}/data/fileserver/<company_id>/<project name>
```
:::note
The file server root is defined by `CLEARML_ROOT` in `constants.env`.
Earlier versions used `/opt/allegro` by default. When migrating, ensure `CLEARML_ROOT` points to the existing data directory.
:::


The entire projects' folders content should be copied to the target server (see  [Importing Fileserver Data](#importing-file-server-data)).

## Importing File Server Data

### Copying the Data

Place the exported projects' folder(s) content into the target file server's storage in the following folder:

```
${CLEARML_ROOT}/data/fileserver/<company_id>/<project name>
```

### Fixing Registered URLs

Since URLs pointing to the file server contain the file server's address, these need to be changed to the address of the 
new file server.  

Note that this is not required if the new file server is replacing the old file server and can be accessed using the same 
exact address.

Once the projects' data has been copied to the target server, and the projects themselves were imported, see 
[Changing ClearML Artifacts Links](change_artifact_links.md) for information on how to fix the URLs.  

## Updating Embedded Links in Reports and Projects Overview

After migrating your ClearML data to a new server, you should update embedded URLs in your project [overviews](../../webapp/webapp_project_overview.md) 
and [reports](../../webapp/webapp_reports.md) to reflect the new server address. The following commands connect to your MongoDB instance and perform a find-and-replace operation.

:::note
This section converts all the embedded links in the projects' overviews and reports. If you have project overviews or 
reports that contain links to objects in the old URL, you will need to update the links manually using the ClearML web UI.
:::

### Connect to the MongoDB Shell

First, open a shell session inside your MongoDB container or pod.

For Docker Compose:

```shell
sudo docker exec -it \
  <clearml-mongo-container-name> \
  mongosh
```

For Kubernetes:

```shell
kubectl exec -it \
  <clearml-mongo-pod-name> \
  -- mongosh
```

**Note:** To find the container or pod name, you can use `docker ps --filter "name=mongo"` for Docker or `kubectl get pods -n clearml | grep mongo` for Kubernetes.

### Configure Your Server URLs

Once inside the `mongosh` shell, run the following commands. **Please replace the placeholder URLs** with your actual old and new server addresses.

```shell
// Replace the placeholder URLs below with your actual server addresses.
// Example old URL: "http://old-clearml.company.com:8080"
// Example new URL: "https://clearml.my-new-domain.com"
const OLD_SERVER_URL = "<URL OF OLD SERVER>";
const NEW_SERVER_URL = "<URL OF NEW SERVER>";
```

### Use the Backend Database

Set MongoSh to update the `backend` database:

```shell
use backend;
```

### Update Reports

These commands find and replace the URL in the `report` and `report_assets` fields within the `task` collection.

Copy and paste the entire block into the `mongosh` shell.

```shell
print("--- Updating 'task' collection ---");

// Update the 'report' field
db.task.updateMany(
  { report: { $regex: OLD_SERVER_URL } },
  [{
    $set: {
      report: {
        $replaceAll: {
          input: "$report",
          find: OLD_SERVER_URL,
          replacement: NEW_SERVER_URL
        }
      }
    }
  }]
);

// Update the 'report_assets' array
db.task.updateMany(
  { "report_assets": { $regex: OLD_SERVER_URL } },
  [{
    $set: {
      report_assets: {
        $map: {
          input: "$report_assets",
          as: "asset",
          in: {
            $replaceAll: {
              input: "$$asset",
              find: OLD_SERVER_URL,
              replacement: NEW_SERVER_URL
            }
          }
        }
      }
    }
  }]
);

print("--- 'task' collection update complete. ---");
```

### Update Project Descriptions

This command updates the `description` field in the `project` collection.

```shell
print("--- Updating 'project' collection ---");

db.project.updateMany(
  { description: { $regex: OLD_SERVER_URL } },
  [{
    $set: {
      description: {
        $replaceAll: {
          input: "$description",
          find: OLD_SERVER_URL,
          replacement: NEW_SERVER_URL
        }
      }
    }
  }]
);

print("--- 'project' collection update complete. ---");
```

### Optional: Validation

To confirm the changes, you can inspect a single document from each collection to ensure the URL has been updated.

```shell
print("--- Verifying updates (all counts should be 0) ---");

print("Remaining projects with old URL:");
db.project.countDocuments({ description: { $regex: OLD_SERVER_URL } });

print("Remaining tasks with old URL in 'report' field:");
db.task.countDocuments({ report: { $regex: OLD_SERVER_URL } });

print("Remaining tasks with old URL in 'report_assets' field:");
db.task.countDocuments({ "report_assets": { $regex: OLD_SERVER_URL } });
```


