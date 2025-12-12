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
- A DockerHub token to access the OCI enterprise Helm charts and Docker images
- To support **GPU** queues, you must deploy the **NVIDIA GPU Operator** on your Kubernetes cluster. For more information, see [GPU Operator](fractional_gpus/gpu_operator.md).

#### Installation

1. Login to the ClearML OCI Registry:

   ```bash
   helm registry login docker.io --username allegroaienterprise --password <CLEARML_DOCKERHUB_TOKEN>
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
   helm upgrade -i -n <WORKER_NAMESPACE> clearml-enterprise-agent oci://docker.io/clearml/clearml-enterprise-agent --create-namespace -f clearml-agent-values.override.yaml
   ```

#### Workload Customization

The ClearML Agent monitors [ClearML queues](../fundamentals/agents_and_queues.md) for tasks that are scheduled for execution.

ClearML supports specifying custom definitions for individual queues for fine-grained control of workload parameters; you 
can set Kubernetes overrides such as pod resources and labels, as well as runtime definitions like environment variables, 
container images, or ClearML worker ID formats.

For more information, see [Custom Workload Configuration](clearml_agent_custom_workload.md). 


#### Additional Configuration Options

To view available configuration options for the Helm chart, run the following command:

```bash
helm show readme oci://docker.io/clearml/clearml-enterprise-agent
# or
helm show values oci://docker.io/clearml/clearml-enterprise-agent
```

##### Reporting GPU Capacity to Orchestration Dashboard

To show the GPUs available to the agent in ClearML’s [Orchestration Dashboard](../webapp/webapp_orchestration_dash.md),
configure the agent in one of the following ways:

* **Fixed Value**:

  Use `reportMaxGpu` to report a fixed number of GPUs. This setting overrides GPU auto-discovery if both are enabled.
    
  ```yaml
  agentk8sglue:
    orchestrationDashboard:
      # -- Agent reporting to Dashboard max GPU available. This will report 2 GPUs.
      reportMaxGpu: 2
  ```

* **Automatic GPU Discovery**:

  Enable automatic discovery to have the agent detect and report GPUs across your Kubernetes cluster.
  This requires cluster-level access (`agentk8sglue.serviceAccountClusterAccess: true`), since the agent must list and evaluate all cluster nodes.

  When GPU discovery is enabled, the Agent identifies which cluster nodes have GPUs and how many GPUs each node provides.
  These options control how nodes are selected and how GPUs are counted:

  * `baseSelector` - The default label selector used to identify GPU nodes.
  * `nodeSelector` - An additional filter applied on top of `baseSelector` to narrow down which nodes are included in discovery. For 
  example, to limit discovery to a specific node pool, use `"nodepool=gpu-a100"`.
  * `gpuCountSelector` - Comma-separate list of labels used to count GPUs per node. The first matching label determines the reported GPU count.

  With discovery enabled, the agent evaluates nodes matching the provided selectors and reports their GPU 
  capacity to the dashboard at the configured interval.

  ```yaml
  agentk8sglue:
    # Cluster access is required for GPU discovery
    serviceAccountClusterAccess: true
  
    orchestrationDashboard:
      discovery:
        enabled: true
        baseSelector: "kubernetes.io/os=linux,nvidia.com/gpu.present=true"
        nodeSelector: ""  # Optional: further restrict discovery
        gpuCountSelector: "nvidia.com/gpu.count"
    ```

You can configure how reports are sent and how often:

* `reportType` - How the agent sends reports to the dashboard. Use on of the following options:
  * `disabled` (or no value) - Do not send any reports. 
  * `global` - Send a single category-level report that sums up all agents into the category total. Overrides individual 
  agent reports. For more information about agent categorization, see [Resource Categories and Groups](../webapp/webapp_orchestration_dash.md#resource-categories-and-groups). 
  * `aggregate` - Send a report per agent. The dashboard aggregates all reports in the category automatically. For more information about agent categorization, see [Resource Categories and Groups](../webapp/webapp_orchestration_dash.md#resource-categories-and-groups)
* `reportSeconds` - Interval in seconds between dashboard updates. Controls how frequently the agent sends GPU capacity data.

```yaml
agentk8sglue:
  # Cluster access is required for GPU discovery
  serviceAccountClusterAccess: true

  orchestrationDashboard:
    # Enable periodic reporting to the Orchestration Dashboard
    reportType: "global"   
    reportSeconds: 600
    # Overrides GPU discovery
    reportMaxGpu: 0
    # Enable GPU discovery
    discovery:
      enabled: true
      baseSelector: "kubernetes.io/os=linux,nvidia.com/gpu.present=true"
      nodeSelector: ""  # Optional: further restrict discovery
      gpuCountSelector: "nvidia.com/gpu.count"
```

