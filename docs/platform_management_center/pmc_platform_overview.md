---
title: Platform Overview
---

The Platform Management Center's **Overview** section provides dashboards for platform-wide visibility across all 
tenants. It includes an aggregated tenant usage dashboard and a platform wide orchestration dashboard.

## Platform Usage
The **Platform Usage** dashboard provides platform administrators with an aggregated view of [metered event](../deploying_clearml/enterprise_deploy/extra_configs/event_metering.mdx)
usage and costs across all platform tenants. 

Each metered event card displays:
* Usage for the selected reporting period
* Usage for the previous equivalent period
* A trend indicator showing the increase or decrease compared to the previous period
* The most-used items within that metered event category, along with their usage and cost values. 

The dashboard also displays the total estimated cost for the selected reporting period, aggregated across all metered events.

:::important
Cost information is displayed only if any costs are associated with any of the metered events. See [Event metering](../deploying_clearml/enterprise_deploy/extra_configs/event_metering.mdx).
:::

![Platform Management Center](../img/pmc_platform_usage.png#light-mode-only)
![Platform Management Center](../img/pmc_platform_usage_dark.png#dark-mode-only)


Click **View Period Details** for a detailed breakdown of a specific event. In the details page you can:
* Adjust the **Report Period** 
* Break down the event data by either sub-category or tenant
* Show either Usage or Cost for the selected data

The page shows a time-series graph with series according to the breakdown selected (category/tenant), and a summary 
table with the detailed sum totals according to that breakdown. Click on a category row to view its usage/cost breakdown 
by tenant. Click on a tenant row to go to the [tenant's overview page](pmc_tenants.md#tenants-overview).   

## Orchestration
The **Orchestration** dashboard provides a platform-wide view of compute resource usage across all tenants. It enables 
platform administrators to monitor resource availability, utilization, consumption trends, resource groups, and worker 
activity throughout the platform. 

It provides the same monitoring and resource management capabilities the tenant [Orchestration Dashboard](../webapp/webapp_orchestration_dash.md) 
provides tenant administrators, while aggregating data across the entire platform. 

![Platform orchestration dashboard](../img/pmc_overview_orch_dash.png#light-mode-only)
![Platform orchestration dashboard](../img/pmc_overview_orch_dash_dark.png#dark-mode-only)

### Current Usage Data
The top of the dashboard displays the current resource availability and utilization counts. This gives you an overall 
picture of the resources available and in use. 

The **Total** section displays available and idle resource counts:
* GPUs - The total number of GPUs in currently running workers out of the total number of GPUs in all provisioned workers, 
  and the number of idle GPUs. GPUs are considered idle when their average utilization falls below 80%.
* CPUs - The total number of CPUs in currently running workers out of the total number of CPUs in all provisioned workers, 
  and the number of idle CPUs. CPUs are considered idle when their average utilization falls below 30%.
* Workers - The number of currently running workers out of the total number of provisioned workers (through autoscalers 
  or K8s), and the number of idle workers. Workers are considered idle if all of their GPUs and CPUs are idle or if they 
  are not executing any task.

The summary cards break down total resource usage by tenant. Each card displays the resource count and utilization for:
* Workers
* GPUs
* CPUs

Hover over any item to see the number of currently idle machines.

Click a summary card to navigate to that tenant’s orchestration dashboard. 

Use the **Event Log** to view updates of worker events: worker addition/removal, worker has become idle/busy. Hover over 
the log to download (<img src="/docs/latest/icons/ico-download.svg" alt="Download" className="icon size-md space-sm" />) 
it or open the expanded view (<img src="/docs/latest/icons/ico-maximize.svg" alt="Maximize" className="icon size-md space-sm" />).

### Resource Graph
The **Resource** graph displays resource usage over time. The graph time span can be controlled through the dropdown 
menu above the graph (between 3 hours and 1 month). Hover over the plot to see specific data point values.

Use the tabs above the graph to switch between views: 
* **Resources** - Displays number of resources used over time.
  A **Resource Groups** table below the graph shows resource usage details collected by resource groups.
  Click on a group in the list to have the graph display usage for that specific group. When viewing a group's usage, 
  select what data to display from the dropdown menu at the top of the plot:
  * Compute Units - Available/Idle CPUs/GPUs
  * Compute Utilization - Average CPU/GPU utilization
  * Available Memory - Total and Free RAM
  * Free Home Storage
  * Network Throughput - Rx/Tx 
* **Consumption vs. Quota** - Displays GPU, CPU, or Worker consumption relative to configured quotas over time. Use the 
  dropdown to select the resource type. 

#### Resource Groups
The Resource Groups table is available in the Resources view and displays current usage numbers for each group:
Worker count - number of workers in the group
* GPU count
* Average GPU Utilization (%)
* Average CPU Load (%)
* Available (total) RAM (GB)
* Free RAM (GB)
* Free home disk (GB)
* Network (Tx/Rx Mbps)

Click <img src="/docs/latest/icons/ico-chevron-right.svg" alt="Expand" className="icon size-md" /> to expand the resource 
group and view the stats of each worker within the group. Filters can be applied by clicking <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" /> 
on a column, and the relevant filter appears. To clear all active filters, click <img src="/docs/latest/icons/ico-filter-reset.svg" alt="Clear filters" className="icon size-md" />.

Clicking on a resource group opens the group's info panel and replaces the **All Active Resources graph** with that 
resource's usage history. 

![Platform orchestration dashboard](../img/pmc_overview_orch_dash_groups.png#light-mode-only)
![Platform orchestration dashboard](../img/pmc_overview_orch_dash_groups_dark.png#dark-mode-only)


The info panel displays the group's:
* Total GPU count
* Total CPU count
* Total Worker RAM
* Total GPU RAM
* Aggregate Idle time in last 30 days

Click `✕` to close the info panel and return the graph to displaying all resources. 
