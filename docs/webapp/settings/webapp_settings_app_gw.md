---
title: Application Gateway
---

The ClearML [Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md) facilitates setting up secure, 
authenticated access to jobs running on your compute nodes from external networks (see application gateway installation
for [Kubernetes](../../deploying_clearml/enterprise_deploy/appgw_install_k8s.md), [Docker-Compose Self-Hosted Deployment](../../deploying_clearml/enterprise_deploy/appgw_install_compose.md) 
or [Docker-Compose Hosted Deployment](../../deploying_clearml/enterprise_deploy/appgw_install_compose_hosted.md)).

The **Application Gateway** table lets you monitor all active app gateway routers, as well as verify gateway functionality. The table shows each router’s:
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
