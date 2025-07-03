---
title: ClearML Agent on Kubernetes
---

The ClearML Agent enables scheduling and executing distributed experiments on a Kubernetes cluster.

## Prerequisites

- A running [ClearML Enterprise Server](k8s.md)
- API credentials (`<ACCESS_KEY>` and `<SECRET_KEY>`) generated via 
  the ClearML UI (**Settings > Workspace > API Credentials > Create new credentials**). For more information, see [ClearML API Credentials](../../webapp/settings/webapp_settings_profile.md#clearml-api-credentials). 

  :::note
  Make sure these credentials belong to an admin user or a service account with admin privileges.
  :::
 
- The worker environment must be able to access the ClearML Server over the same network.
- Helm token to access `clearml-enterprise` Helm chart repo
- To support **GPU** queues, you must deploy the **NVIDIA GPU Operator** on your Kubernetes cluster. For more information, see [GPU Operator](../../clearml_agent/fractional_gpus/gpu_operator.md).

## Installation

### Add the Helm Repo Locally

Add the ClearML Helm repository:
```bash
helm repo add clearml-enterprise https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages --username <HELM_REPO_TOKEN> --password <HELM_REPO_TOKEN>
```

Update the local repository:
```bash
helm repo update
```

### Create a Values Override File

Create a `clearml-agent-values.override.yaml` file with the following content:

:::note
Replace the `<ACCESS_KEY>` and `<SECRET_KEY>`with the API credentials you generated earlier. 
Set the `<api|file|web>ServerUrlReference` fields to match your ClearML 
Server URLs.
:::

```yaml
imageCredentials:
  password: "<CLEARML_DOCKERHUB_TOKEN>"
clearml:
  agentk8sglueKey: "<ACCESS_KEY>"
  agentk8sglueSecret: "<SECRET_KEY>"
agentk8sglue:
  apiServerUrlReference: "<CLEARML_API_SERVER_REFERENCE>"
  fileServerUrlReference: "<CLEARML_FILE_SERVER_REFERENCE>"
  webServerUrlReference: "<CLEARML_WEB_SERVER_REFERENCE>"
  createQueues: true
  queues:
    exampleQueue:
      templateOverrides: {}
      queueSettings: {}
```

### Install the Chart

Install the ClearML Enterprise Agent Helm chart:

```bash
helm upgrade -i -n <WORKER_NAMESPACE> clearml-agent clearml-enterprise/clearml-enterprise-agent --create-namespace -f clearml-agent-values.override.yaml
```

## Additional Configuration Options

To view available configuration options for the Helm chart, run the following command:

```bash
helm show readme clearml-enterprise/clearml-enterprise-agent
# or
helm show values clearml-enterprise/clearml-enterprise-agent
```

### Reporting GPU Availability to Orchestration Dashboard

To show GPU availability in the [Orchestration Dashboard](../../webapp/webapp_orchestration_dash.md), explicitly set the number of GPUs:

```yaml
agentk8sglue:
  # -- Agent reporting to Dashboard max GPU available. This will report 2 GPUs.
  dashboardReportMaxGpu: 2
```

### Queues

The ClearML Agent monitors [ClearML queues](../../fundamentals/agents_and_queues.md) and pulls tasks that are
scheduled for execution.

A single agent can monitor multiple queues. By default, all queues share a base pod template (`agentk8sglue.basePodTemplate`) 
used when launching tasks on Kubernetes after it has been pulled from the queue.

Each queue can be configured to override the base pod template with its own settings with a `templateOverrides` queue template. 
This way queue definitions can be tailored to different use cases.

The following are a few examples of agent queue templates:

#### Example: GPU Queues

To support GPU queues, you must deploy the NVIDIA GPU Operator on your Kubernetes cluster. For more information, see [GPU Operator](../../clearml_agent/fractional_gpus/gpu_operator.md).

```yaml
agentk8sglue:
  createQueues: true
  queues:
    1xGPU:
      templateOverrides:
        resources:
          limits:
            nvidia.com/gpu: 1
    2xGPU:
      templateOverrides:
        resources:
          limits:
            nvidia.com/gpu: 2
```

#### Example: Custom Pod Template per Queue

This example demonstrates how to override the base pod template definitions on a per-queue basis.
In this example:

- The `red` queue inherits both the label `team=red` and the 1Gi memory limit from the `basePodTemplate` section.
- The `blue` queue overrides the label by setting it to `team=blue`, and inherits the 1Gi memory from the `basePodTemplate` section.
- The `green` queue overrides the label by setting it to `team=green`, and overrides the memory limit by setting it to 2Gi. 
  It also sets an annotation and an environment variable.

```yaml
agentk8sglue:
  # Defines common template
  basePodTemplate:
    labels:
      team: red
    resources:
      limits:
        memory: 1Gi
  createQueues: true
  queues:
    red:
      # Does not override
      templateOverrides: {}
    blue:
      # Overrides labels
      templateOverrides:
        labels:
          team: blue
    green:
      # Overrides labels and resources, plus set new fields
      templateOverrides:
        labels:
          team: green
        annotations:
          example: "example value"
        resources:
          limits:
            memory: 2Gi
        env:
          - name: MY_ENV
            value: "my_value"
```

## Next Steps

Once the agent is up and running, proceed with deploying the [ClearML Enterprise App Gateway](appgw_install_k8s.md).

