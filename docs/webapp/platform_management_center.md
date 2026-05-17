---
title: Platform Management Center
---

:::important
The Platform Management Center is available under the ClearML Enterprise plan.
:::

The **Platform Management Center** provides an administrative dashboard for all tenants across a ClearML deployment. 
It enables platform administrators to monitor tenant activity, usage, and costs.

![Platform Management Center](../img/platform_management.png)
## Tenants
### Tenants Overview
The Platform Management Center tenant's page displays a list of all tenants in the ClearML deployment.

For each tenant, its name, UUID, and the list of its administrators and their e-mail addresses are displayed.

Select a tenant to open its administrative dashboard.

### Tenant Dashboard
The tenant dashboard shows a tenant's [metered events](../deploying_clearml/enterprise_deploy/extra_configs/event_metering.mdx) along with additional usage metrics. Cost totals and breakdown 
is available for metered events that have associated costs defined.


The dashboard displays the following summary metrics:
* Total Projects - Current total number of projects in the tenant.
* Total Tasks - Current total number of tasks in the tenant. Click the graph icon <img src="/docs/latest/icons/ico-charts-view.svg" alt="Graph view" className="icon size-md space-sm" /> 
  to show a plot of new tasks created over time
* Tenant Users - Number of registered users out of the tenant's configured user quota.Click to open a list of the tenant's 
  users and their details (email, ID, role, etc.).
* Task Runtime - Total task runtime (in hours) for the current day. Click the graph icon <img src="/docs/latest/icons/ico-charts-view.svg" alt="Graph view" className="icon size-md space-sm" /> 
  to show a detailed breakdown:
  * Task runtime over time by queue
  * Relative runtime totals by queue

**Volume Templates** shows a listing of some of the tenant's configured volume templates and their types (e.g. 
`shared memory cache`, `persistent storage`). Click **View more** to open the full list of volume templates available to 
this tenant. See [Volume Templates](#volume-templates) for more details.

The dashboard shows plots for all of the tenant’s metered events for a selected period. By default, ClearML meters:
* Cluster Compute
* Users and Service Accounts
* ClearML Storage

The dashboard shows the tenant's estimated cost for the selected period, summed across all metered events.

:::important
Estimated costs and cost breakdowns are displayed only if any costs are associated with any of the metered events. See 
[Event metering](../deploying_clearml/enterprise_deploy/extra_configs/event_metering.mdx).
:::

Metered events plots display:
* Selected period - Event count over the selected report period
* Reference period - Event count over the previous equivalent period (e.g. usage for the previous 7 days)
* Trend indicator - Displays the total increase or decrease compared to the previous period. 

Click **View Period Details** for a detailed breakdown of an event's data.

In the details view, you can:
* Adjust the **Report Period** specifically for that event
* Show either:
  * Usage - View usage over time and a breakdown by event categories (e.g. Compute: usage per GPU type, Storage: usage per storage service)
  * Cost - View cost over time and a breakdown by event categories (e.g. Compute: cost per GPU type, Storage: cost per storage service)
  * Category totals for the period are also available below the chart.

![Platform Management Center Compute details](../img/platform_management_compute.png)

## Volume Templates
Volume templates are storage configuration templates that can be applied to tenant workloads. Platform administrators 
create the templates, set custom configuration points for tenant administrators and users, and make them available to 
selected tenants.

Tenant administrators use these templates to fill in the parameters assigned to them and make these configurations 
available across the tenant projects, where in turn tenant users can apply them to their workloads.

### Create a Volume Template
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
   
#### Template Variables
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

##### Built-in System Variables
Template specification can make use of built-in agent [string templates](../clearml_agent/clearml_agent_string_template.md)
which are filled in based on workload runtime values.

To view all available system variables hover over the template definition window and click **View System Variables**. 
Hover over a variable and click <img src="/docs/latest/icons/ico-info.svg" alt="Info" className="icon size-md space-sm" /> 
to view its description or click <img src="/docs/latest/icons/ico-copy-to-clipboard.svg" alt="Copy" className="icon size-md space-sm" /> 
to copy its name.

#### Delete a Template
Deleting a template may affect existing tenant volumes associated with it.

To delete a template: 
1. Hover over the template in the **Volume Templates** table
1. Click Menu <img src="/docs/latest/icons/ico-dots-v-menu.svg" alt="Dot menu" className="icon size-md space-sm" /> and Delete <img src="/docs/latest/icons/ico-trash.svg" alt="Trash" className="icon size-md space-sm" /> 

## Deployment

For deployment instructions, see [Platform Management Center](../deploying_clearml/enterprise_deploy/extra_configs/platform_management_center_deploy.md). 

