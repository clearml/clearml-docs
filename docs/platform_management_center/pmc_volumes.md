---
title: Volume Templates
---

Volume templates are storage configuration templates that can be applied to tenant workloads. Platform administrators 
create the templates, set custom configuration points for tenant administrators and users, and make them available to 
selected tenants.

Tenant administrators use these templates to fill in the parameters assigned to them and make these configurations 
available across the tenant projects, where in turn tenant users can apply them to their workloads.

## Create a Volume Template
1. Go to **Volume Templates** in the Platform Management Center
1. Click **Add Volume Template**
1. Configure the following:
   * **Name** - Unique template identifier
   * **Tenants** - Tenants allowed to use this template
   * **Storage Template** - Select an example use-case:
     * User specified tmp dir - Define an ephemeral volume that is deleted when the pod stops running). Users control 
       the container mount path (`TMP_PATH`).
     * Local node cache - Configure a common cache folder on node storage, with a separate directory per tenant. Users 
       control where the cache is mounted in the container (`MOUNT_POINT`).
     * Shared memory cache - Uses node memory (RAM disk) mounted at `/dev/shm`. Users control the amount of allocated 
       memory (`DISK_SIZE`).
     * Persistent storage - Let users mount a tenant-specific PVC at a container path of their choice (`MOUNT_POINT`).
       Assumes PVCs follow the naming convention `pvc-${CLEARML_TENANT_ID}-big`.
     * Tenant configuration projection - Provide access to aggregated tenant configuration and secrets, mounted at a 
       user-defined path (`CONFIG_PATH`). Assumes Kubernetes resources named `config-map-${CLEARML_TENANT_ID}` and `credentials-${CLEARML_TENANT_ID}` 
       exist
     * Common shared NFS server - Allow mounting an external NFS share at a specified container path (`MOUNT_POINT`). 
       Requires a valid NFS server URL and a directory defined by `${NFS_PATH}`.
   * Configuration Specification - Storage configuration in YAML format.
   
![Volume Template](../img/pmc_volume_temp.png#light-mode-only)
![Volume Template](../img/pmc_volume_temp_dark.png#dark-mode-only)

### Template Variables
Platform administrators can provide placeholders for tenant administrators and users to customize the storage 
configuration through custom variables using the `${variable}` format (e.g. `"${MOUNT_POINT}"`).

When specifying a custom variable, it is automatically added to the **Custom Variables Definitions** list where the 
following can be configured (Hover over the variable in the **Custom Variables Definitions** and click  <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" />):
* **Display Name** - What this variable will be called in UI forms that tenant administrators/users will fill in
* **Description** - Additional information to be provided as tooltips in UI forms tenant administrators/users will fill
* **Available to** - Whether tenant administrators provide variable value (when defining tenant assignment) or tenant 
  users (when configuring for their project) 
* **Mandatory** - Whether users must provide this information or it can be left blank
* **Set Default Value** - A value to be used if the user does not provide input

#### Built-in System Variables
Template specification can make use of built-in agent [string templates](../clearml_agent/clearml_agent_string_template.md)
which are filled in based on workload runtime values.

To view all available system variables hover over the template definition window and click **View System Variables**. 
Hover over a variable and click <img src="/docs/latest/icons/ico-info.svg" alt="Info" className="icon size-md space-sm" /> 
to view its description or click <img src="/docs/latest/icons/ico-copy-to-clipboard.svg" alt="Copy" className="icon size-md space-sm" /> 
to copy its name.

## Delete a Template
Deleting a template may affect existing tenant volumes associated with it.

To delete a template: 
1. Hover over the template in the **Volume Templates** table
1. Click Menu <img src="/docs/latest/icons/ico-dots-v-menu.svg" alt="Dot menu" className="icon size-md space-sm" /> and Delete <img src="/docs/latest/icons/ico-trash.svg" alt="Trash" className="icon size-md space-sm" /> 
