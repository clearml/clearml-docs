---
title: Analytics
---

:::important[Enterprise Feature]
Custom event analytics are available under the ClearML Enterprise plan.
:::

The Analytics section is available where the service administrators have configured [custom event metering](../../deploying_clearml/enterprise_deploy/extra_configs/event_metering.md), 
enabling administrators to monitor usage and spend over a selected time period, based on custom events metered by their server. 
Spend estimates are provided for events that have cost associated to them by the service administrators.

This page helps admins:
* Understand how usage changes over time
* Compare current usage to previous periods
* Identify cost drivers across metered events

The **Analytics** page shows:
* Estimated Cost for the selected period
* [Usage and cost plots](#usage-and-cost-plots) for the metered events

The time period of the displayed analytics can be controlled through the **Report Period** menu on the top of the page. 
Changing the report period updates all plots and the estimated cost accordingly.

## Usage and Cost Plots
The Analytics page shows plots for all metered events. By default, ClearML provides metering of:
* Cluster Compute
* Service Accounts
* Storage
* Users

Each plot displays:
* Selected period - Usage over the selected report period
* Comparative period - Usage over the previous equivalent period (e.g. usage for the previous 7 days)
* Trend indicator - Displays the increase or decrease in usage and cost compared to the previous period. 

Click **View Period Details** for a detailed breakdown of a metrics usage and costs.

In the details view, you can:
* Adjust the Report Period specifically for that metric
* Toggle between: 
  * Usage view - View usage over time and a breakdown by usage categories (e.g. Compute: usage per GPU type, Storage: usage per storage service)
  * Cost view - View cost over time and a breakdown by metric categories (e.g. Compute: cost per GPU type, Storage: cost per storage service)

Category totals for the period are also available below the chart.
