---
title: Kubernetes
---

Agents can be deployed as Docker containers in a Kubernetes cluster. ClearML Agent adds missing scheduling capabilities to Kubernetes, enabling more flexible automation from code while leveraging all of ClearML Agent's features.

ClearML Agent is deployed onto a Kubernetes cluster using **Kubernetes-Glue**, which maps ClearML jobs directly to Kubernetes jobs. This allows seamless task execution and resource allocation across your cluster.

## How It Works
The ClearML Kubernetes-Glue performs the following:
- Pulls jobs from the ClearML execution queue.
- Prepares a Kubernetes job based on a provided YAML template.
- Inside each job pod, the `clearml-agent`:
  - Installs the required environment for the task.
  - Executes and monitors the task process.
  - Logs task data to the ClearML Server
   
## Deployment Options
You can deploy ClearML Agent onto Kubernetes using one of the following methods:

1. **K8s Glue Script**:
   Run a [K8s Glue script](https://github.com/clearml/clearml-agent/blob/master/examples/k8s_glue_example.py) on a Kubernetes CPU node. This approach is less scalable and typically suited for simpler use cases.

1. **ClearML Agent Helm Chart (Recommended)**:
   Use the ClearML Agent Helm Chart to spin up an agent pod acting as a controller. This is the recommended and 
   scalable approach. ClearML provides both [open-source](https://github.com/clearml/clearml-helm-charts/tree/main/charts/clearml-agent) 
   and [Enterprise](#agent-with-an-enterprise-server) Helm charts. See more details below. 


## ClearML Helm Chart
The ClearML Agent is installed on Kubernetes using a Helm chart. This sets up a controller pod that listens to ClearML queues and launches jobs as needed.

### Agent with an Open Source Server

1. Add the Helm Repository: 
  
   ```bash
   helm repo add clearml
   https://clearml.github.io/clearml-helm-charts
   ```

1. Update to latest version of this chart:
  
   ```bash
   helm repo update
   helm upgrade clearml-agent clearml/clearml-agent
   ```

1. Change values on existing installation:  
  
   ```bash
   helm upgrade clearml-agent clearml/clearml-agent --version <CURRENT CHART VERSION> -f custom_values.yaml
   ```

### Agent with an Enterprise Server

ClearML Enterprise adds advanced Kubernetes features, such as:
- **Multi-Queue Support**: Service multiple ClearML queues within the same Kubernetes cluster.
- **Pod-Specific Templates**: Define resource configurations per queue using pod templates.


#### Prerequisites

- A running [ClearML Enterprise Server](../deploying_clearml/enterprise_deploy/k8s.md)
- API credentials (`<ACCESS_KEY>` and `<SECRET_KEY>`) generated via 
  the ClearML UI (**Settings > Workspace > API Credentials > Create new credentials**). For more information, see [ClearML API Credentials](../webapp/settings/webapp_settings_profile.md#clearml-api-credentials). 

  :::note
  Make sure these credentials belong to an admin user or a service account with admin privileges.
  :::
 
- The worker environment must be able to access the ClearML Server over the same network.
- Helm token to access `clearml-enterprise` Helm chart repo
- To support **GPU** queues, you must deploy the **NVIDIA GPU Operator** on your Kubernetes cluster. For more information, see [GPU Operator](fractional_gpus/gpu_operator.md).

#### Installation

1. Add the ClearML Helm repository:

   ```bash
   helm repo add clearml-enterprise https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages --username <HELM_REPO_TOKEN> --password <HELM_REPO_TOKEN>
   ```

   Update the local repository:
   ```bash
   helm repo update
   ```

1. Create a `clearml-agent-values.override.yaml` file with the following content:

   :::note
   Replace the `<ACCESS_KEY>` and `<SECRET_KEY>` with the API credentials you generated earlier. 
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

1. Install the ClearML Enterprise Agent Helm chart:

   ```bash
   helm upgrade -i -n <WORKER_NAMESPACE> clearml-agent clearml-enterprise/clearml-enterprise-agent --create-namespace -f clearml-agent-values.override.yaml
   ```

#### Queues

The ClearML Agent monitors [ClearML queues](../fundamentals/agents_and_queues.md) and pulls tasks that are
scheduled for execution.

A single agent can monitor multiple queues. By default, all queues share the same base pod template (`agentk8sglue.basePodTemplate`) 
used when launching tasks on Kubernetes after they have been pulled from the queue.

Each queue can be configured to override the base pod template with its own settings with a `templateOverrides` queue template. 
This way queue definitions can be tailored to different use cases.

The following are a few examples of agent queue templates:

##### Example: GPU Queues

To support GPU queues, you must deploy the NVIDIA GPU Operator on your Kubernetes cluster. For more information, see [GPU Operator](fractional_gpus/gpu_operator.md).

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

##### Example: Custom Pod Template per Queue

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

#### Additional Configuration Options

To view available configuration options for the Helm chart, run the following command:

```bash
helm show readme clearml-enterprise/clearml-enterprise-agent
# or
helm show values clearml-enterprise/clearml-enterprise-agent
```

##### Reporting GPU Availability to Orchestration Dashboard

To show GPU availability in the [Orchestration Dashboard](../webapp/webapp_orchestration_dash.md), explicitly set the number of GPUs:

```yaml
agentk8sglue:
  # -- Agent reporting to Dashboard max GPU available. This will report 2 GPUs.
  dashboardReportMaxGpu: 2
```
