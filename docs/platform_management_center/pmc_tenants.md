---
title: Tenants
---

The Platform Management Center **Tenants** page displays a list of all tenants in the ClearML deployment.

Each tenant's name, UUID, and a list of its administrators and their e-mail addresses are displayed.

![Tenant List](../img/pmc_tenant_list.png#light-mode-only)
![Tenant List](../img/pmc_tenant_list_dark.png#dark-mode-only)

Click on a tenant to access its Overview page. When viewing tenant details, the following sidebar items become available: 
* [**Overview**](#tenant-overview) - Administrative dashboard that displays a tenant's usage and configuration.  
* [**Orchestration**](#orchestration) - View of the tenant’s compute resource availability and utilization.
* [**Volume Templates**](#volume-templates) - Storage configuration templates available to the tenant.
* [**Variable Overrides**](#variable-overrides) - Custom template variable overrides for this tenant.
* [**Applications**](#applications) - UI applications available to the tenant.


## Creating a Tenant
1. On the Tenants page, click **Create Tenant**.
1. Fill in the following fields:
   * Tenant Name
   * Max Users - Maximum number of users allowed. Leave empty to use the system default limit. Select `Unlimited` to 
     remove the cap.
   * Max Service Users - Maximum number of service accounts allowed. Leave empty to use the system default limit. 
     Select `Unlimited` to remove the cap.
   * Login Domain - The email domain (e.g. `acme.ai`) associated with the tenant: users with this domain will be 
     assigned to this tenant.
   * Admin Emails - Email addresses of users to be designated as tenant administrators. Administrators can add 
     additional users to the tenant. 
1. Click **Create**.

The dialog displays new admin credentials for the tenant. The credentials for this tenant are displayed once at the end 
of the creation flow. In case these credentials are lost, a new set can be created from the tenant table. 

:::tip[Next steps]
To enable user workloads, install and configure the [ClearML Enterprise Agent](../clearml_agent/clearml_agent_deployment_k8s.md#agent-with-an-enterprise-server)
and [AI App Gateway](../deploying_clearml/enterprise_deploy/appgw_install_k8s.md). 
:::

### Generating New Admin Credentials
To generate new tenant admin credentials, click the <img src="/docs/latest/icons/ico-credentials.svg" alt="credentials" className="icon size-md space-sm" /> 
at the end of the tenant's row on the **Tenants** page. The new credentials are displayed in the dialog.

## Tenant Overview
The **Overview** page is an administrative dashboard that  shows a tenant's [metered events](../deploying_clearml/enterprise_deploy/extra_configs/event_metering.mdx) 
along with additional usage metrics. Cost totals and breakdown is available for metered events that have associated costs defined.

![Tenant Dashboard](../img/pmc_tenant_dashboard.png#light-mode-only)
![Tenant Dashboard](../img/pmc_tenant_dashboard.png#dark-mode-only)

### Summary Metrics
The dashboard displays the following summary metrics:
* Total Projects - Current total number of projects in the tenant.
* Total Tasks - Current total number of tasks in the tenant. Click the graph icon <img src="/docs/latest/icons/ico-charts-view.svg" alt="Graph view" className="icon size-md space-sm" /> 
  to show a plot of new tasks created over time
* Tenant Users - Number of registered users out of the tenant's configured user quota. Click to open a list of the tenant's 
  users and their details (email, ID, role, etc.).
* GPU Hours today - Total GPU hours consumed today. Click  <img src="/docs/latest/icons/ico-charts-view.svg" alt="Graph view" className="icon size-md space-sm" />  
  to view a runtime breakdown by queue over time.
* Hyper-Datasets / Datasets / Reports - Current total number for each object type in the tenant

### Configuration Panels

* **Volume Templates** shows a listing of some of the tenant's configured volume templates and their types (e.g. 
  `shared memory cache`, `persistent storage`). Click **View more** to open the full list of volume templates available to 
  this tenant. See [Volume Templates](pmc_volumes.md) for more details.

* **Applications** - Lists a sample of the tenant's enabled UI applications and their versions. **Click View** more to see 
  the full list of applications that are available to this tenant. See [Applications](#applications) for more details.
* **Template variables** - Lists a sample of the platform variable overrides defined for the tenant. **Click View** more 
  to open the full list of tenant’s template variable overrides. See [Template variables](pmc_template_variables.md) for more details.  

### Metered Events

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

![Platform Management Center Compute details](../img/platform_management_compute.png#light-mode-only)
![Platform Management Center Compute details](../img/platform_management_compute_dark.png#dark-mode-only)

### Deleting a Tenant

:::warning
Tenant deletion is permanent and cannot be undone. All data associated with the tenant will be removed.
:::

To delete a tenant:
1. Open the tenant's **Overview** page. 
1. On the bottom of the page click `Delete Tenant` 
1. In the dialog, type the tenant's name to confirm deletion.

## Orchestration
The tenant’s Orchestration page provides the tenant’s compute resource availability and utilization. Use it to monitor 
the tenant's available and in-use resources, utilization trends, resource usage history, and detailed performance
metrics. 

This page mirrors what tenant administrators see in the tenant [Orchestration Dashboard](../webapp/webapp_orchestration_dash.md).

## Volume Templates
The [Volume Templates](pmc_volumes.md) applied to this tenant.

## Variable Overrides
Tenant-specific override values for platform [Template Variables](pmc_template_variables.md).

To override a template variable for a specific tenant: 

1. Click **Add Variable Override**
2. In the modal:
   * Variable name - Select the variable to override.
   * Tenant Override Value - Tenant-specific value 
3. Click **Override**

Hover over a variable override’s row in the tenant’s **Template Overrides** table to Delete or Edit it.

## Applications
The tenant's **Applications** page lets you manage which UI applications are available to this tenant. 

### Application Table
The application table lists all applications currently deployed on the tenant. For each application, the table shows:
* App name
* App category
* Deployed app version

### Adding Applications
Applications can be added to a tenant in two ways:
* **Globally deployed** - When a platform administrator deploys an application at the platform level, it is 
  automatically assigned to all tenants and appears in the tenant's application table as Deployed. See [Applications](pmc_apps.md) for details.
* **Add application** - To add an application to this tenant only, click **Add application** on top of the page.

### Application States

|State|Description|
|--|--|
| Undeployed | The application is not assigned to this tenant.|
| Deployed | The application is assigned to this tenant and available to its users.| 
| Disabled | The application is deployed but read-only. Users can view existing instances but cannot launch new ones.|


### Application Actions
Hover over an application row to access the actions available for that app.

| Action | Description | Valid States | Resulting State|
|--|--|--|--|
| Deploy | Assigns the application to this tenant, making it visible to users. | Undeployed | Deployed |
| Disable | Prevents users from launching new instances. | Deployed | Disabled | 
| Undeploy | Removes the application from this tenant. It can be re-added via Add application or by redeploying it at the platform level. | Disabled | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| Enable | Allows users to launch new instances of the application. | Disabled | Deployed |




