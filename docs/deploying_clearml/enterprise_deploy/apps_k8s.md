---
title: Application Installation on Kubernetes
---

:::important Enterprise Feature
UI application deployment is available under the ClearML Enterprise plan.
:::

ClearML Applications are plugins that extend the functionality of the ClearML Enterprise Server. They enable users 
to: 
* Manage ML workloads 
* Automate recurring workflows--no code required

Applications are installed on top of the ClearML Server and are provided by the ClearML team.

## Requirements

- Python 3 installed on your local machine to run the provided installation scripts
- A ClearML Enterprise Server is up and running with `clearmlApplications.enabled` set to `"true"` in the server's `overrides.yaml` file.
- Applications package provided by ClearML, including the following scripts:
  - `convert_image_registry.py`
  - `upload_apps.py`
- API credentials (`<ACCESS_KEY>` and `<SECRET_KEY>`) generated via 
  the ClearML UI (**Settings > Workspace > API Credentials > Create new credentials**). Make sure these credentials 
  belong to an admin user or a service user with admin privileges. For more information, see [ClearML API Credentials](../../webapp/settings/webapp_settings_profile.md#clearml-api-credentials). 

## Installation

To install the ClearML Applications on a newly installed ClearML Enterprise Server: 

### Download and Extract

Download the applications package using the URL provided by ClearML:

```bash
wget -O apps.zip "<ClearML enterprise applications configuration download url>"
unzip apps.zip
```

### Adjust Application Docker Images Location (Air-Gapped Systems)

ClearML Applications use pre-built Docker images from the ClearML DockerHub repository. If you are 
installing in an air-gapped system, these images must be available in your internal docker registry. You must specify 
the docker images location before installing the applications.

Use the provided script to modify the application zip files to reference your internal registry:

```bash
python convert_image_registry.py \
--apps-dir "<PATH_TO_APPS_DIR>" \
--artifactory <LOCAL_REGISTRY>/clearml_apps
```

The script will:
* Update the application zip files to point to the new registry
* Output the list of images that need to be copied to the local registry. For example:

   ```
   > make sure `allegroai/clearml-apps:hpo-1.10.0-1062` was added to `local_registry/clearml-apps`
   ```

### Upload Applications to ClearML Server

Use `upload_apps.py` to upload the application packages to the ClearML Server.

To see available options, run `python3 upload_apps.py --help`.

**Upload a Single application:**

```bash
python3 upload_apps.py --host <APISERVER_URL> --key <ACCESS_KEY> --secret <SECRET_KEY> --command upload --files "YOUR_APP.zip"
```

**Upload Multiple applications:**

```bash
python3 upload_apps.py --host <APISERVER_URL> --key <ACCESS_KEY> --secret <SECRET_KEY> --command upload --dir "<PATH_TO_APPS_DIR>" -ml
```
