---
title: Setting up API Auditing
---

To facilitate API audit (for security reviews, operational troubleshooting, or usage analysis), the ClearML server can provide detailed request/response logs.

When enabled, each API call’s log entry includes:

* Endpoint name
* Request and response metadata
* Caller identity information (user, role, tenant)
* Source IP
* Duration and status codes

An audit log entry looks like this:

```json
{
     "@timestamp": "2025-10-21T09:49:08.908Z",
     "call_id": "c9be3d7b4b914e2ea3eef53ccbd449e3",
     "ip": "2.37.206.134",
     "endpoint": "users.set_preferences",
     "duration": 11,
        "request_size": 112,
     "response_size": 332,
  "auth": {
          "identity": {
               "role": "admin",
               "user_name": "user",
                  "company_name": "abcd"
               }
      },
         "result": {
           "code": 200,
           "msg": "OK"
        }
}
```

:::important
Collecting, storing and analysing the logs (e.g. via Kubernetes logging, Fluentd, Elastic, or other tooling) is outside 
the scope of this document. 
:::

The ClearML server API logs are made available through dedicated adapters:
* `raw_log`: Sends JSON audit logs to the server’s standard output (stdout) using the standard Python logger, making 
  them automatically available through Kubernetes logging mechanisms.  
* `logging`: Sends logs to a Fluentd handler. Requires Fluentd infrastructure.   
* `elastic`: Writes logs directly to an Elasticsearch index.

## Standard Python Logger (Recommended)

To enable API logging to standard output, set the following environment variables on the ClearML API Server container:

* Enable API call logging: `CLEARML__APISERVER__log_calls=true`   
* Use the logging adapter for stdout JSON output: `CLEARML__APISERVER__apilog__adapter=raw_log`

:::note Helm Setup Alternative
If deploying the server via the ClearML Helm chart, logging can be enabled using a single override:

```
apiserver:
  logCalls: true
```

This automatically sets the required environment variables.
:::

In Kubernetes, these logs can be viewed using:

```
kubectl logs <apiserver-pod-name>
```

## Fluentd (Alternative)

ClearML also includes a logging adapter capable of sending the API logs to Fluentd, which can then route them to Elastic 
or other backends. This setup is not encouraged, as the default `raw_log` adapter is adequate for most deployments.

### Configuration

* Enable API call logging: `CLEARML__apiserver__log_calls=true`  
* Enable Fluentd Adapter: `CLEARML__apiserver__apilog__adapter=logging`  
* Set Fluentd connection settings:

  ```
  CLEARML__apiserver__apilog__adapters__logging__handler__kwargs__host=<fluentd_host>
  CLEARML__apiserver__apilog__adapters__logging__handler__kwargs__port=24224
  ```

## Elastic (Alternative)

ClearML also includes a logging adapter capable of sending the API logs directly to elastic. This setup is not encouraged,
as the default `raw_log` adapter is adequate for most deployments.

### Configuration

* Enable API call logging: `CLEARML__apiserver__log_calls=true`  
* Enable elasticsearch Adapter: `CLEARML__apiserver__apilog__adapter=elastic`  
* Configure Elasticsearch connection and batch settings (optional: You only need to define these if you want to override the defaults):
   
   ```
   # Seconds to wait after unsuccessful try to init the ES cluster
   CLEARML__apiserver__apilog__adapters__elastic__init_timout_sec: 60
  
   # Enable bulk writes
   CLEARML__apiserver__apilog__adapters__elastic__bulk_enabled: true
  
   # Delay between bulk write flushes (seconds) 
   CLEARML__apiserver__apilog__adapters__elastic__bulk_write_delay_sec: 5
  
   # Timeout for bulk write operations (seconds)
   CLEARML__apiserver__apilog__adapters__elastic__bulk_write_timeout_sec: 15  
  
   # Minimum number of log entries required before triggering a bulk write  
   CLEARML__apiserver__apilog__adapters__elastic__bulk_min_items: 100
   ```

## Verifying Logging Configuration

Once the server is configured for logging API calls, make some API calls to check if the logs are available.

The log's location depends on the logging adapter used

* For the `raw_log` adapter, logs are written to the API Server’s standard output (stdout)  
* For the `logging` (Fluentd) adapter, logs are sent through the Fluentd handler and forwarded to your central logging backend  
* For the `elastic` adapter, logs are written directly to elasticsearch. 

### Option 1: UI Activity

If both ClearML API and Web server components are running, simply navigating through the UI will generate API calls.
These calls should appear as entries in the API Server logs.

### Option 2: Direct API Call

You can also generate an explicit API call using curl. For example:

```
curl $APISERVER_URL/auth.create_credentials \
   -H "Content-Type: application/json" \
   -H "X-Clearml-Impersonate-As: <USER_ID>" \
   -u $APISERVER_KEY:$APISERVER_SECRET
```

## Customizing API Logs

The audit logging system provides fine-grained control over which endpoints are logged and which parts of the request/response 
are included. This section lists the most common options.

The logging configuration is defined in the endpoint section of the server’s `apiserver.conf`. Custom settings can be 
applied by modifying these entries, or by setting them through environment variables as demonstrated in the following sections.

### Logging Options Per Endpoint

Each endpoint supports three logging flags:

* `log_call`: whether to log the API call itself (e.g. endpoint name, timestamp, user)  
* `log_data`: whether to log request parameters  
* `log_result_data`: whether to log response data

You can enable or disable each flag independently for any endpoint. For `log_data` or `log_result_data`, you can also 
specify exact request/response fields to include, instead of logging the entire payload.

The default configuration is defined in the `endpoints` section of the server’s `apiserver.conf`, which you can reference for the full list. 

### Default Logging Behavior

You can configure the default logging behavior for all endpoints that do not have specific per-endpoint settings through the `_default_` variables:

```
CLEARML__apiserver__endpoints___default__log_call=true
CLEARML__apiserver__endpoints___default__log_data=true
CLEARML__apiserver__endpoints___default__log_result_data=true
```

* Set a variable to `true` to enable logging for all unspecified endpoints.  
* Set a variable to `false` to disable logging by default.

:::caution
`log_data` and especially `log_result_data` can generate large payloads, particularly for endpoints like frame streaming or worker status reporting.  
:::

You can also override these defaults for individual endpoints using per-endpoint environment variables. 

### Per-Endpoint Logging

Specify a non-default logging policy for certain endpoints according to the following pattern:

```
CLEARML__APISERVER__ENDPOINTS__<endpoint_path>__<log_option>
```

* `<endpoint_path>`: the endpoint name, with dots (`.`) replaced by double underscores (`__`)  
* `<log_option>`: one of `log_call`, `log_data`, or `log_result_data`

Example: Enable logging for the `workers.status_reports` endpoint, including its response data:

```
CLEARML__apiserver__endpoints__workers__status_report__log_call=true
CLEARML__apiserver__endpoints__workers__status_report__log_result_data=true
```

You can also specify specific fields to log. For example: Enable logging the `workers.status_reports` endpoint's request's `queue` and `tags` fields. 

```
CLEARML__apiserver__endpoints__workers__status_report__log_data=["queue", "tags"]
```

### Logging Specific Request Fields

If you want to reduce the size of log entries or limit sensitive information, you can selectively enable or disable
categories of fields in the log entry (auth metadata, headers, stats, result data, etc.).

```
CLEARML__apiserver__apilog__log_fields__auth__enabled=true

CLEARML__apiserver__apilog__log_fields__headers__enabled=true

CLEARML__apiserver__apilog__log_fields__version__enabled=true

CLEARML__apiserver__apilog__log_fields__stats__enabled=true

CLEARML__apiserver__apilog__log_fields__result__enabled=true

CLEARML__apiserver__apilog__log_fields__data__enabled=true
```

### Identity Redaction

If you want to suppress sensitive identity information in the API logs while still recording the rest of the 
request/response metadata, set the following environment variable:

```
CLEARML__apiserver__apilog__redact_identity=true
```

### Time-Based Index/Tag Suffixing

You can automatically append a time-based suffix to the log tag or index, which can be useful if your API logs are sent 
to a backend that organizes data by time (e.g., Fluentd).

Set the suffix using:

```
CLEARML__apiserver__apilog__rotation__time=<period>
```

`<period>` can be:

* `"monthly"` - tags like `clearml.apiserver.api-logs.202501`  
* `"quarterly"` - tags like `clearml.apiserver.api-logs.2025Q1`  
* `"yearly"` - tags like `clearml.apiserver.api-logs.2025`