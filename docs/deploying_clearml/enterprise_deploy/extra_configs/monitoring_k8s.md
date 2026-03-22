---
title: Monitoring (K8s) 
---

The following are general recommendations for monitoring your ClearML deployment on Kubernetes. These practices help 
identify performance bottlenecks and maintain the system's reliability.

## API Server Logging and Analysis
Collect ClearML API Server logs using your preferred log aggregation solution. These logs can provide operational 
insights, including:
* HTTP activity - Status codes, errors, and warning messages.
* API call details - Request ID, duration, version, and associated task for each endpoint.
* Usage tracking - API activity by caller
* Database performance - Latency measurements for APIs, including time spent per database call.

For more details on configuring API auditing, log adapters, and customizing which API endpoints and fields are logged, 
see [Setting up API Auditing](../api_audit.md).

## Kubernetes Metrics and Infrastructure Monitoring
Monitor ClearML components at the Kubernetes level using standard metrics exporters and dashboards, such as Prometheus 
and Grafana, to ensure all components are performing reliably under load.

Commonly tracked metrics include:
* Pod-level CPU, memory, and network utilization for:
  * API Server
  * File Server
  * ClearML Agents
  * Application Gateways
* Storage utilization of the File Server or external object storage.
* Task pod metrics for pods prefixed with `clearml-id-*`.
* Ingress performance - Track Ingress Controller metrics using common exporters and dashboards (e.g., NGINX).
* Database performance - Track database performance using community-supported exporters and dashboards.
