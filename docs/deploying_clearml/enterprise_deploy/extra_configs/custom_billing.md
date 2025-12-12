---
title: Custom Events
---

:::important Enterprise Feature
Sending custom events is available under the ClearML Enterprise plan.
:::

ClearML supports sending custom events to selected Kafka topics. Event sending is triggered by API calls and 
is available only to tenants with the `custom_events` feature configured.

This feature can be used to implement custom billing.

## Enabling Custom Events in ClearML Server 

:::important Prerequisite
**Precondition**: Customer Kafka for custom events is installed and reachable from the `apiserver`.
:::

Modify the server's `clearml-values.override.yaml` file, then upgrade the chart:

```yaml
apiserver:
  extraEnvs:
    # Enable custom events.
    - name: CLEARML__services__custom_events__enabled
      value: "true"
    # Folder where the ClearML Apiserver container can find the custom message templates.
    - name: CLEARML__services__custom_events__template_folder
      value: "/mnt/custom_events/templates"
    # Kafka host configuration for custom events.
    - name: CLEARML__hosts__kafka__custom_events__host
      value: "[<KAFKA_HOST_ADDRESS>:<KAFKA_HOST_PORT>]"
    # Kafka security parameters. Below is the example for SASL plaintext security.
    - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__security_protocol
      value: "SASL_PLAINTEXT" 
    - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__sasl_mechanism
      value: "SCRAM-SHA-512" 
    - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__sasl_plain_username
      value: "<USERNAME>" 
    - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__sasl_plain_password
      value: "<PASSWORD>"
    # Kafka topics names for lifecycle and inventory messages.
    - name: CLEARML__services__custom_events__channels__main__topics__service_instance_lifecycle
      value: "lifecycle"
    - name: CLEARML__services__custom_events__channels__main__topics__service_instance_inventory
      value: "inventory"
```

### Configure Per-Tenant Custom Event Fields

For each tenant, configure the values required by the message templates using the following API call:

```bash
curl $APISERVER_URL/system.update_company_custom_events_config -H "Content-Type: application/json" -u $APISERVER_KEY:$APISERVER_SECRET -d'{
  "company": "<company_id>",
  "fields": {
    "service_instance_id": "<value>",
    "service_instance_name": "<value>",
    "service_instance_customer_tenant_name": "<value>",
    "service_instance_customer_space_name": "<value>",
    "service_instance_customer_space_id": "<value>",
    "parameters_connection_points": ["<value1>", "<value2>"]
}}'  
```


## Sending Custom Events to the API Server

:::important Prerequisite
**Precondition:** Dedicated custom-events Redis instance installed and reachable from all the custom events deployments.
:::

Environment lifecycle events are sent directly by the ClearML `apiserver`. Other event types are emitted by the following 
services (Helm charts in Kubernetes):


* `clearml-pods-monitor-exporter` - Monitors running pods (tasks) and sends lifecycle events.  Should run one per cluster 
  with a unique identifier (a UUID is required for the installation):  

* `clearml-pods-inventory` - Periodically sends inventory events about running pods.

* `clearml-company-inventory` - Monitors ClearML companies and sends environment inventory events.  

### Install custom-events

The `clearml-custom-events` is the Kubernetes "Custom Events" umbrella Helm chart for ClearML. 
It bundles all necessary services and sets up a dedicated Redis instance.

#### Prepare Values

Create a `clearml-custom-events-values.override.yaml` file with the following content (make sure to replace the `<PLACEHOLDERS>`):

```yaml
global:
  imageCredentials:
    password: "<CLEARML_DOCKERHUB_TOKEN>"
  clearml:
    apiServerUrlReference: "<CLEARML_APISERVER_URL>"
    apiServerKey: "<ACCESSKEY>"
    apiServerSecret: "<SECRETKEY>"

clearml-pods-monitor-exporter:
  checkIntervalSeconds: 60
  # -- *REQUIRED* Universal Unique string to identify Pods Monitor instances across worker clusters. Cannot be empty.
  # Uniqueness is required across different clusters installations to preserve the reported data status.
  podsMonitorUUID: ""

clearml-pods-inventory:
  cronJob:
    schedule: "@daily"

clearml-company-inventory:
  cronJob:
    schedule: "@daily"
```

#### Install

Install the Custom Events umbrella chart:

```bash
helm upgrade -i clearml-custom-events oci://docker.io/clearml/clearml-custom-events -f clearml-custom-events-values.override.yaml
```