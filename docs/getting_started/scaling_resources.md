---
title: Autoscaling Resources
---

ClearML provides the options to automate your resource scaling, while optimizing machine usage.
Autoscaling allows you to dynamically manage compute resources based on demand, optimizing efficiency and cost. 

When running machine learning experiments or large-scale compute tasks, demand for resources fluctuates. Autoscaling ensures that:
- **Resources are available when needed**, preventing delays in task execution.
- **Idle resources are automatically spun down**, reducing unnecessary costs.
- **Workloads can be distributed efficiently**.

ClearML offers the following resource autoscaling solutions:
* [GUI applications](#gui-autoscaler-applications) (available under the Pro and Enterprise plans) -  Use the built-in apps to define your compute 
  resource budget, and have the apps automatically manage your resource consumption as needed–with no code! 
  * AWS Autoscaler
  * GCP Autoscaler
* [Kubernetes integration](#kubernetes-integration) - Deploy agents in Kubernetes for automated resource allocation and scaling
* [Custom autoscaler implementation](#custom-autoscaler-implementation) using the `AutoScaler` class

## GUI Autoscaler Applications
For users on Pro and Enterprise plans, ClearML provides a UI applications to configure autoscaling for cloud 
resources. These applications include:
* [AWS Autoscaler](../webapp/applications/apps_aws_autoscaler.md): Automatically provisions and shuts down AWS EC2 instances based on workload demand.
* [GCP Autoscaler](../webapp/applications/apps_gcp_autoscaler.md): Manages Google Cloud instances dynamically according to defined budgets.

These applications allow users to set up autoscaling with minimal configuration, defining compute budgets and resource limits directly through the UI.

## Kubernetes Integration

You can install `clearml-agent` through a Helm chart.

ClearML integrates with Kubernetes, allowing agents to be deployed within a cluster. Kubernetes handles:
* Automatic pod creation for executing tasks.
* Resource allocation and scaling based on workload.
* Optional integration with Kubernetes' cluster autoscaler, which adjusts the number of nodes dynamically.

The Clearml Agent deployment is set to service a queue(s). When tasks are added to the queues, the agent pulls the task 
and creates a pod to execute the task. Kubernetes handles resource management. Your task pod will remain pending until 
enough resources are available.

You can set up Kubernetes' cluster autoscaler to work with your cloud providers, which automatically adjusts the size of 
your Kubernetes cluster as needed; increasing the amount of nodes when there aren't enough to execute pods and removing
underutilized nodes. See charts for specific cloud providers.

For more information, see [ClearML Kubernetes Agent](https://github.com/clearml/clearml-helm-charts/tree/main/charts/clearml-agent).

:::note Enterprise features
The ClearML Enterprise plan supports K8S servicing multiple ClearML queues, as well as providing a pod template for each 
queue for describing the resources for each pod to use. See [ClearML Helm Charts](https://github.com/clearml/clearml-helm-charts/tree/main).
:::

## Custom Autoscaler Implementation
You can build their own autoscaler using the [`clearml.automation.auto_scaler.AutoScaler`](https://github.com/clearml/clearml/blob/master/clearml/automation/auto_scaler.py#L77) class which enables:
* Direct control over instance scaling logic
* Custom rules for resource allocation

An `AutoScaler` instance monitors ClearML task queues and dynamically adjusts the number of cloud instances based on workload demand.
By integrating with a [CloudDriver](https://github.com/clearml/clearml/blob/master/clearml/automation/cloud_driver.py#L62), 
it supports cloud providers like AWS and GCP.

See the [AWS Autoscaler Example](../guides/services/aws_autoscaler.md) for a practical implementation using the 
`AutoScaler` class. The script can be adapted for GCP autoscaling as well.

