---
title: Applications
---

The Platform Management Center **Applications** page allows platform administrators to manage ClearML applications 
deployment across the platform. 


## Application Table
The application table lists every application currently installed or available for installation on the platform. For 
each application, the table shows:
* App name
* App category
* Deployed app version
* Origin - **Manual** (manually uploaded) or **Hub** (retrieved through ClearML customer hub)
* Number of tenants the app is deployed on


![Platform Applications](../img/pmc_apps.png#light-mode-only)
![Platform Applications](../img/pmc_apps_dark.png#dark-mode-only)

### Application Details
Click an application to view its details:
* Deployed version
* Number of tenants the app is assigned to, and a list of those tenants
* App origin
* Available versions - hover over a version to deploy or undeploy that specific version, or remove it entirely from the 
platform

## Installing Applications
There are two ways to add applications to the platform.

### Sync from Hub
The platform management center can show and install applications available to the platform through the ClearML Customer Hub:

1. Click **Sync from Hub**.
1. Enter a Hub API token if required. 

   :::tip[Obtaining Hub API token]
   To obtain a Hub API token:
   1. Go to the ClearML CustomerHub (A link to the Customer Hub is available in the token prompt)
   1. Click **API Token**
   1. Click **Add API Token**
   1. Copy the generated token. 
   :::
1. Click **Sync**. New applications appear in the applications table. Applications that have a newer version available will show an indication.

### Manual Upload 
Applications can be manually installed onto the platform by uploading an application package (e.g. applications 
downloaded from the ClearML Customer Hub):

1. Click **Upload**.
1. Select the applications zip file. The new applications will appear in the installed applications table. 

## Application States
An application can be in one of the following states:

| State | Description|
|--|--|
| Undeployed | The application is installed on the platform but not assigned to any tenant. |
| Deployed | The application is assigned to all tenants (visible to tenant users). |
| Disabled | The application is assigned to tenants, but is read-only: Users can view existing instances but cannot launch new ones. |


## Managing Applications

The following table describes the actions available from the app table, including the states to which they apply.

Access these actions in any of the following ways:
* Hover over an application row, and the actions relevant to that app will appear
* Through the batch action bar: available at screen bottom when multiple apps are selected

| Action | Description | States Valid for the Action | State Transition |
|--|--|--|--|
| Deploy | Assigns the application to all tenants, making it available to their users (visible in the Web UI).  | Undeployed | Deployed |
| Undeploy | Unassigns the application from all tenants.| Deployed, Disabled | Undeployed |
| Disable | Makes the application read-only. Users can view existing instances but cannot launch new ones. | Deployed, Enabled | Disabled |
| Enable | Reverts a disabled application to active, allowing users to launch new instances. | Disabled | Deployed |
| Update to Latest | Deploys the latest available version of the application. | All States | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| Remove | Deletes the application from the Platform. The application can be restored by syncing from the Hub again. | Undeployed | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |



## Assigning Applications to Tenant
By default, deploying an application makes it available to all tenants. To manage availability for a specific tenant, 
navigate to the tenant's dashboard and open its **Applications** page. For more information, see tenant [Applications](pmc_tenants.md#applications).  
