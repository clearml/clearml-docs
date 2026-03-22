---
title: Orchestration Dashboard Customization (K8S)
---

:::important Enterprise Feature
The Orchestration Dashboard is available under the ClearML Enterprise plan.
:::

The ClearML [Orchestration Dashboard](../webapp/webapp_orchestration_dash.md) provides visibility into available and in-use compute resources across your 
infrastructure. Agent configuration controls how resources are reported to the dashboard and how workers are organized 
into categories and groups.

## Reporting GPU Capacity

To show the GPUs available to the agent in the Orchestration Dashboard,
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
  * `aggregate` - Send a report per agent. The dashboard aggregates all reports in the category automatically. For more information about agent categorization, see [Resource Categories and Groups](../webapp/webapp_orchestration_dash.md#resource-categories-and-groups).
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

## Customizing Worker IDs

The Orchestration Dashboard organizes agents in a 2-level hierarchy of **Categories** and **Resource Groups**.

The resource dashboard shows high-level aggregate utilization across the resource categories, with specific agent details 
listed in the workload table, grouped by resource group.

Agent categorization is controlled through the ID it assigned on launch, according to the following format:

```
<CATEGORY>:<RESOURCE_GROUP>:<WORKLOAD_ID>
```

The following defaults are used by the agent helm chart: 
* Category: `k8s`
* Resource Group: `group` 
* Workload ID: Makes use of the Task ID of the task executed in that node. How the agents appear in the dashboard can be 
  customized by chart overrides (`clearml-agent-values.override.yaml`):

  ```yaml
  agentk8sglue:
   # K8S Agent Worker ID
   workerIdOverride: "k8s:my-agent"
   # Default Worker ID template for nodes spawned by the K8S Agent
   taskWorkerIdOverride: "k8s:my-group:{task_id}"
  ```

:::important
Make sure the **CATEGORY** portion (the first segment before `:`) is the same in both `workerIdOverride` and `taskWorkerIdOverride` 
if you want the K8S Agent and its Tasks to appear in the same dashboard category box.
:::

Worker ID templates support the following dynamic variables using the `"{variable_name}"` syntax:
* `worker_id` – The Agent's Worker ID
* `worker_id_parts` – The Agent Worker ID split by `:`. For example: `"k8s:glue-agent:my-agent"` → `["k8s", "glue-agent", "my-agent"]`. 
  Each part can be referenced in templates using `{worker_id_parts[n]}`.
* `task_id` – The ClearML Task ID
* `pod_name` – The Kubernetes Pod/Job name
* `namespace` – The Kubernetes namespace used to run the Task

### Configure Resource Groups Per Queue

You can override the Worker ID template per queue. 

##### Example: Split by GPU Type

This configuration creates separate resource groups for different GPU queues. Both queues will appear under the `k8s` category, 
with two distinct resource groups: `H100` and `L40s`. Tasks will be listed inside each group by Task ID.

```yaml
agentk8sglue:
 queues:
   h100_queue:
     templateOverrides: {}
     queueSettings:
       customWorkerIdTemplate: "k8s:H100:{task_id}"

   l40s_queue:
     templateOverrides: {}
     queueSettings:
       customWorkerIdTemplate: "k8s:L40s:{task_id}"
```

### Hide Workers from the Orchestration Dashboard
To exclude specific workers from appearing in the Orchestration Dashboard, configure regex patterns in the control plane 
`clearml-values.override.yaml` file:

```yaml
clearml:
 orchestration:
   dashboard:
     hiddenWorkersPatterns:
       - "^apps-agent.*"
       - "^services-agent.*"
       - "^clearml-agent[^:]*$"
       - "^k8s:clearml-agent[^:]*$"
       # Copy the defaults above, then add your own patterns:
       - "^example.*"
```

