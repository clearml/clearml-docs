---
title: Application Installation on On-Prem and VPC Servers
---

:::important Enterprise Feature
UI application deployment is available under the ClearML Enterprise plan.
:::

ClearML Applications are like plugins that allow you to manage ML workloads and automatically run recurring workflows 
without any coding. Applications are installed on top of the ClearML Server.

## Requirements
To run application you will need the following:
* RAM: Make sure you have at least 400 MB of RAM per application instance.
* Applications Service: Make sure that the applications agent service is up and running on your server:
  * If you are using a docker-compose solution, make sure that the clearml-apps-agent service is running.
  * If you are using a Kubernetes cluster, check for the clearml-clearml-enterprise-apps component.
* Installation Files: Each application has its installation zip file. Make sure you have the relevant files for the 
applications you wish to install.
* Installation Script - See below

## Air-Gapped Environments
For Air-Gapped installations you need to copy docker images to the local registry and then update the application 
configuration files to use this repository. This can be achieved by using the `convert_image_registry.py` script with 
the `--repo` flag. For example:

```
python convert_image_registry.py \
  --apps-dir /path/to/apps/ \
  --repo local_registry/clearml-apps
```

The script will change the application zip files to point to the new registry, and will output the list of containers 
that need to be copied to the local registry. For example:

```
make sure allegroai/clearml-apps:hpo-1.10.0-1062 was added to local_registry/clearml-apps
```

## Installing on ClearML Server
The `upload_apps.py` script handles uploading the app packages to the ClearML Server. It requires Python3.

To see the options, run: 

```commandline
python3 upload_apps.py --help
```

### Credentials
The script requires user and password (`USER_KEY`/`USER_SECRET` in the example below). These can be taken from 
the credentials of an admin user, which can be generated in the ClearML web application.

### Host
For the host, supply the `apiserver` address. If running locally on the server, you can use `localhost:8008`.

### Uploading a Single Application

```commandline
python3 upload_apps.py \
  --host <APISERVER_URL> \
  --user <USER_KEY> \
  --password <USER_SECRET> \
  --files "YOUR_APP.zip"
```

### Uploading Multiple Applications
If you wish to install more than one app you can use the `--dir` instead of the `--files` argument:

```commandline
python3 upload_apps.py \
  --host <APISERVER_URL> \
  --user <USER_KEY> \
  --password <USER_SECRET> \
  --dir "DIRECTORY_CONTAINING_APPS_ZIP_FILES"
```

