---
title: Application Gateway
---

The ClearML [Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md) facilitates setting up secure, 
authenticated access to jobs running on your compute nodes from external networks (see application gateway installation
for [Kubernetes](../../deploying_clearml/enterprise_deploy/appgw_install_k8s.md), Docker-Compose for [Self-Hosted Deployment](../../deploying_clearml/enterprise_deploy/appgw_install_compose.md) 
or Docker-Compose for [Hosted Deployment](../../deploying_clearml/enterprise_deploy/appgw_install_compose_hosted.md)).

**Application Gateway** Settings include:
* **Routers** – Monitor gateway routers and verify routing functionality
* **Static Routes** – Define and monitor fixed, externally accessible endpoints that route to specific tasks or services.

## Routers 

The **Routers** table lets you monitor all active app gateway routers, as well as verify gateway functionality. The table shows each router's:
* Name 
* Externally accessible URL 
* Test Status: The result of the most recent connectivity test 
* Last Tested: The time the router was last tested 

![Application Gateway table](../../img/settings_app_gateway.png#light-mode-only)
![Application Gateway table](../../img/settings_app_gateway_dark.png#dark-mode-only)

Click on a router to open its details panel, which includes:
* **Info**: General router information
  * Router details 
    * Uptime 
    * Last update time 
    * Router version 
  * Routed Tasks table: ClearML tasks currently available for access through the router
    * Task name: Click to navigate to the task page
    * Endpoint: Exposed application URL
    * Owner: User who initiated the task

  ![Application Gateway info](../../img/settings_app_gateway_info.png#light-mode-only)
  ![Application Gateway info](../../img/settings_app_gateway_info_dark.png#dark-mode-only)

* **Test Details**: Administrators can run a test to verify that a gateway is functioning correctly: Identifying routed 
  tasks and creating accessible network endpoints for them. The test launches a small task in the target network 
  (specified through the desired ClearML queue), and checks that the router successfully creates a route to that task, 
  and routes the network traffic to it. 

  To run a test:
  1. Hover over the **Test Details** panel **>** Click **Test**
  1. Input a queue that is serviced by agents in the network environment the router should provide access to  
  1. Click **Test**
  
  <br/>

  :::note
  Testing is only supported when both the ClearML WebApp and the gateway endpoint are served over secure (HTTPS) protocols.
  :::

  The **Test Details** tab displays: 
  * Status - Result of the most recent test
  * Status message
  * Status reason
  * Started time
  * Completed time 
  * Run time
  * Queue - Queue where test task was enqueued for execution
  * Worker - ClearML Agent that executed the test task
  * Test Task name
  * Task ID 
  * Browser endpoint
  * Endpoint 

  ![Application Gateway test](../../img/settings_app_gateway_test.png#light-mode-only)
  ![Application Gateway test](../../img/settings_app_gateway_test_dark.png#dark-mode-only)

* **Test log**: Console output of the most recent router test. 

## Static Routes
**Static Routes** allow administrators to define external endpoints which users can attach to their ClearML application 
instances or services. Static routes decouple user network access from the specific deployed service instance (whose 
details make up the on-demand, router generated endpoints).

Static routes can operate in two modes:
* **Single Endpoint**: One internal endpoint per route
* **Load Balancing**: Multiple internal endpoints behind the single fixed endpoint. Load balancing endpoints maintain 
  session context to keep sessions routing to the same internal endpoint.

Both URL-path and subdomain static routes can be defined.

Administrators can also enable **authentication** for route access using group-based permissions.

The **Static Routes** table lets you monitor all defined routes. The table shows each route's:
* Enabled: Toggle to enable / disable the static route
* Name: Route label
* Route:
  * When active, displays the endpoint URL (e.g.` <router_url>/path` or `subdomain.<router_domain>`). Click to access the endpoint in a new tab
  * When inactive, displays the projected route template depending on the route configuration (e.g.  `<router url>/path` , `subdomain.<router domain>`)
* Type: URL or Subdomain route
* Load Balancing: Whether the route is single-endpoint or load balancing. 
* Status: Router status
  * `Not In Use` - Route is configured but not being used by any router.
  * `Pending` - Route is being set up for use by a router
  * `Routing` - Route configured and attached to at least one internal endpoint.
* Targets: Internal endpoints (Pod/IP:Port)
* Tasks: Linked tasks or app instances running the internal endpoints using the route
* Access: User groups with access to the route, or Public if no authentication is configured
* Created: Creation time
* Last Updated: Last modification time
* Updated By: User who last updated the route

### Creating a Static Route
To create a static route: 
1. Click **+ Add Route**
1. In the **Add New Route** modal, input the following information 
  * Name – Route label
  * Input a Route URL path or Subdomain name. Note that a path must begin with a slash (`/`) 
  * Load Balanced - Whether the route can serve multiple internal endpoints (load balancing) or just one. 
  * Authenticated Route -Whether the route is accessible to specific users (default) or is publicly accessible.
    * Endpoint Access -  When authentication is required, add the ClearML groups whose members can access this endpoint.

### Editing Routes
A static route can be modified only when it is disabled. To edit route details, hover and click **Edit** <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" /> 
in the **Static Routes** table.

An enabled route is view-only. To view its details, hover and click **View route** configuration <img src="/docs/latest/icons/ico-info.svg" alt="Info" className="icon size-md space-sm" /> 
in the **Static Routes** table.

### Deleting Routes
To delete a static route details, hover and click **Delete** <img src="/docs/latest/icons/ico-trash.svg" alt="Trash" className="icon size-md space-sm" /> 
in the **Static Routes** table. Disabling or Deleting a route removes the external endpoint and stops routing any active 
connections. 
