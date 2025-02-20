---
title: ClearML Server
---

## What is ClearML Server? 
The ClearML Server is the backend service infrastructure for ClearML. It allows multiple users to collaborate and 
manage their tasks by working seamlessly with the ClearML Python package and [ClearML Agent](../clearml_agent.md). 

ClearML Server is composed of the following:
* Web server including the [ClearML Web UI](../webapp/webapp_overview.md), which is the user interface for tracking, comparing, and managing tasks.
* API server which is a RESTful API for:

    * Documenting and logging tasks, including information, statistics, and results.
    * Querying task history, logs, and results.

* File server which stores media and models making them easily accessible using the ClearML Web UI.

The [**ClearML Hosted Service**](https://app.clear.ml) is essentially the ClearML Server maintained for you.

![image](../img/ClearML_Server_Diagram.png)

The ClearML Web UI is the ClearML user interface and is part of ClearML Server.

Use the ClearML Web UI to:

* Track tasks
* Compare tasks
* Manage tasks

For detailed information about the ClearML Web UI, see [User Interface](../webapp/webapp_overview.md).

ClearML Server also comes with a [services agent](../clearml_agent/clearml_agent_services_mode.md) preinstalled.

## Deployment

The ClearML Server can be deployed in any of the formats listed below. Once deployed, configure the server for web login 
authentication, subdomains, and load balancers, and use any of its many configuration settings.

**To deploy your own ClearML Server:**

1. Deploy ``clearml-server`` using any of the available formats, which include:

    * Pre-built [AWS EC2 AMIs](clearml_server_aws_ec2_ami.md)
    * Pre-built [Google Cloud Platform custom images](clearml_server_gcp.md)
    * Pre-built Docker images for [Linux](clearml_server_linux_mac.md), [macOS](clearml_server_linux_mac.md), and 
      [Windows 10](clearml_server_win.md)
    * [Kubernetes using Helm](clearml_server_kubernetes_helm.md)

1. Optionally, [configure ClearML Server](clearml_server_config.md) for additional features, including subdomains and load balancers, 
   web login authentication, and the non-responsive task watchdog.

1. [Connect the ClearML SDK to the ClearML Server](../getting_started/ds/ds_first_steps.md)

## Updating

When necessary, upgrade your ClearML Server on any of the available formats:
* [AWS EC2 AMIs](upgrade_server_aws_ec2_ami.md)
* [Google Cloud Platform](upgrade_server_gcp.md)
* [Linux or MacOS](upgrade_server_linux_mac.md)
* [Windows 10](upgrade_server_win.md)
* [Kubernetes](upgrade_server_kubernetes_helm.md)

If you are using v0.15 or Older, [upgrade to ClearML Server](clearml_server_es7_migration.md).