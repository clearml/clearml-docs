---
title: Custom Billing Events
---

:::important Enterprise Feature
This feature is available under the ClearML Enterprise plan.
:::

ClearML supports sending custom events to selected Kafka topics. Event sending is triggered by API calls and 
is available only for the companies with the `custom_events` settings set.

## Enabling Custom Events in ClearML Server 

:::important Prerequisite
**Precondition**: Customer Kafka for custom events is installed and reachable from the `apiserver`.
:::

Set the following environment variables in the ClearML Enterprise helm chart under the `apiserver.extraEnv`:

* Enable custom events:

   ``` 
   - name: CLEARML__services__custom_events__enabled  
     value: "true" 
   ```
* Mount custom message template files into `/mnt/custom_events/templates` folder in the `apiserver` container and point 
  the `apiserver` into it:  

   ```
   - name: CLEARML__services__custom_events__template_folder  
     value: "/mnt/custom_events/templates"
   ``` 
* Configure the Kafka host for sending events:  

   ```
   - name: CLEARML__hosts__kafka__custom_events__host  
     value: "[<KAFKA host address:port>]"
   ```   
   Configure Kafka security parameters. Below is the example for SASL plaintext security:  

   ```
   - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__security_protocol  
     value: "SASL_PLAINTEXT"   
   - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__sasl_mechanism  
     value: "SCRAM-SHA-512"   
   - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__sasl_plain_username  
     value: "<username>"   
   - name: CLEARML__SECURE__KAFKA__CUSTOM_EVENTS__sasl_plain_password  
     value: "<password>"
   ```
* Define Kafka topics for lifecycle and inventory messages:  

   ```
   - name: CLEARML__services__custom_events__channels__main__topics__service_instance_lifecycle  
     value: "lifecycle"  
   - name: CLEARML__services__custom_events__channels__main__topics__service_instance_inventory  
     value: "inventory"
   ```
* For the desired companies set up the custom events properties required by the event message templates: 

   ```
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

Environment lifecycle events are sent directly by the `apiserver`. Other event types are emitted by the following helm charts:

* `clearml-pods-monitor-exporter` - Monitors running pods and sends container lifecycle events (should run one per cluster with a unique identifier, a UUID is required for the installation):  

   ```
   # -- Universal Unique string to identify Pods Monitor instances across worker clusters. It cannot be empty. 
   # Uniqueness is required across different cluster installations to preserve the reported data status.
   podsMonitorUUID: "<Unique ID>"
   # Interval
   checkIntervalSeconds: 60
   ``` 
* `clearml-pods-inventory` - Periodically sends inventory events about running pods.

   ```
   # Cron schedule - https://crontab.guru/  
   cronJob:  
     schedule: "@daily" 
   ``` 
* `clearml-company-inventory` - Monitors Clearml companies and sends environment inventory events.  

   ```
   # Cron schedule - https://crontab.guru/
   cronJob:  
     schedule: "@daily"  
   ```

For every script chart add the below configuration to enable redis access and connection to the `apiserver`:

```
clearml:  
  apiServerUrlReference: "<APISERVER_URL>"
  apiServerKey: "<APISERVER_KEY>"
  apiServerSecret: "<APISERVER_SECRET>"
redisConnection:
  host: "<REDIS_HOST>"  
  port: <REDIS_PORT>  
  password: "<REDIS_PWD>"
```

See all other available options to customize the `custom-events` charts by running: 
```
helm show readme allegroai-enterprise/<CHART_NAME>
```