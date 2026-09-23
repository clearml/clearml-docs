---
title: HttpRouter
---

The [`HttpRouter`](../references/sdk/http_router.md) class provides a local HTTP proxy for routing traffic to services running in or accessible from 
a ClearML task. It provides:

* **Local routing** - Forward traffic arriving at the proxy to one or more target URLs, based on the request path
* **Callbacks** - Intercept and modify requests, responses, and errors as they pass through the proxy. See [Callbacks](#callbacks)
* **Endpoint telemetry** - Collect and report telemetry for a route to the ClearML Server, with optional endpoint, model, 
  application, and tag metadata
* **External endpoints** - Request an external endpoint for the proxy. See [Deploy the Router](#deploy-the-router)

Local routing, callbacks, and telemetry collection all work locally and don't require any additional infrastructure.
Requesting an external endpoint requires the AI Application Gateway (see [Deploy the Router](#deploy-the-router) below).

`HttpRouter` operates in the context of the current ClearML task.

:::note HTTPS
`HttpRouter` is also relevant for HTTPS traffic. Route targets (including the default target) can be
`https://` URLs, and the external endpoint assigned through the AI Application Gateway is served over HTTPS. The local
proxy itself listens for plain HTTP on its incoming port.
:::

## Usage

Obtain a router instance through the current task:

```python
router = Task.current_task().get_http_router()
```

Setting up routing generally follows this flow:
1. [Configure the local proxy](#set-up-a-local-proxy) if needed. A default configuration is used otherwise.
1. [Create one or more local routes](#set-up-a-local-route) that map paths to the services you want to route traffic to,
   optionally intercepting requests and responses with callbacks
1. [Deploy the router](#deploy-the-router) to request an external, publicly accessible endpoint for the proxy

### Set Up a Local Proxy

All local routes are served through a local proxy. To customize its configuration, use
[`set_local_proxy_parameters()`](../references/sdk/http_router.md#set_local_proxy_parameters) before creating any routes
or deploying the router:

```python
router.set_local_proxy_parameters(incoming_port=9000, default_target="http://localhost:8000")
```

* `incoming_port` - The port the proxy listens on for incoming traffic (default `9000`)
* `default_target` - Where to route traffic that doesn't match any configured local route. If not set, unmatched
  traffic is not routed anywhere

You can also configure proxy logging and response streaming with [`set_local_proxy_parameters()`](../references/sdk/http_router.md#set_local_proxy_parameters).

If you only need the proxy to run locally, without requesting an external endpoint, start it directly with
[`start_local_proxy()`](../references/sdk/http_router.md#start_local_proxy):

```python
router.start_local_proxy()
```

Creating a local route ([see below](#set-up-a-local-route)) or deploying the router will start the proxy automatically 
if it isn't running yet, so calling `start_local_proxy()` explicitly is only needed if you want the proxy running 
without also creating a route or deploying.

### Set Up a Local Route

A local route maps a path on the proxy to a target URL, so that traffic sent to that path is forwarded to the target.
Create one with [`create_local_route()`](../references/sdk/http_router.md#create_local_route):

```python
router.create_local_route(
    source="/",
    target="http://localhost:8000",
    request_callback=request_callback,
    response_callback=response_callback,
    endpoint_telemetry={"model": "MyModel"}
)
```

* `source` - The path prefix to match on the proxy. For example, `/` matches all traffic sent to the proxy, while
  `/example` only matches `/example` and paths under it, such as `/example/predict`
* `target` - The URL to forward matched traffic to. The `source` prefix is removed and the rest of the path is appended
  to the target. For example, with `source="/example"` and `target="http://localhost:8000"`, a request to
  `/example/predict` is forwarded to `http://localhost:8000/predict`. Query parameters are forwarded as well
* `request_callback`, `response_callback`, and `error_callback` - Optional callbacks for processing requests,
  responses, and errors raised while forwarding to the target. See [Callbacks](#callbacks)
* `endpoint_telemetry` - Set to `True` (default) to enable telemetry for this route.
  Optionally, pass a dictionary of custom parameters, such as `model_name`, `endpoint_url`, or `tags`. See
  [`create_local_route()`](../references/sdk/http_router.md#create_local_route) for the complete list of supported parameters

Telemetry reports include the endpoint's URL. If you don't [deploy the router](#deploy-the-router), set `endpoint_url`
in the telemetry dictionary. Otherwise, telemetry waits for an external endpoint to be assigned before reporting.

To remove a route, use [`remove_local_route()`](../references/sdk/http_router.md#remove_local_route), passing the
same `source` path used to create it. If telemetry was enabled for that route, it is disabled as well:

```python
router.remove_local_route("/")
```

### Deploy the Router

:::important[Enterprise Feature]
Requesting an external endpoint requires a ClearML Server with the AI Application Gateway installed, which is
available under the ClearML Enterprise plan. Without it, `deploy()`, `wait_for_external_endpoint()`, and
`list_external_endpoints()` will not work.
:::

To request an external endpoint for the proxy, use
[`deploy()`](../references/sdk/http_router.md#deploy):

```python
router.deploy(wait=True)
```

Calling `deploy()`:
* Starts the local proxy, if it isn't running yet
* Requests an external endpoint for the proxy
* If `wait=True`, waits until the endpoint is assigned and returns its details. By default (`wait=False`), `deploy()`
  returns `None` immediately without waiting. If the endpoint isn't assigned within the wait timeout (90 seconds by
  default), `deploy()` also returns `None`

The [AI Application Gateway](../deploying_clearml/enterprise_deploy/appgw.md) watches for tasks that request external 
endpoints and provisions the corresponding external route. The assigned endpoint information is then made available
through the task.

You can also pass a `static_route` name instead of letting ClearML generate one from the task ID, which is useful for creating a
persistent, load-balanced route that multiple task instances can share.

If you didn't wait for the endpoint at deploy time, you can wait for it later with
[`wait_for_external_endpoint()`](../references/sdk/http_router.md#wait_for_external_endpoint), and list all endpoints
requested for the task with [`list_external_endpoints()`](../references/sdk/http_router.md#list_external_endpoints):

```python
router.wait_for_external_endpoint()
router.list_external_endpoints()
```

See [`deploy()`](../references/sdk/http_router.md#deploy) for the full list of parameters, and the return value
describing the assigned endpoint.

### Callbacks

`create_local_route()` supports callbacks for intercepting and modifying requests, responses, and errors as they
pass through the proxy. Callbacks can be regular functions or `async` functions.

#### Request Callback

A request callback processes a request before it is forwarded to the target. It must accept:

* `request` - The intercepted request, as a FastAPI `Request`
* `persistent_state` - A dictionary for maintaining state across callbacks. The same dictionary is shared by the
  route's request, response, and error callbacks.

If the callback returns a FastAPI `Request`, that request is forwarded to the target instead of the original one.
Otherwise, the original request is used.

#### Response Callback

A response callback processes a response before it is returned by the proxy. It must accept:

* `response` - The response returned by the target, as a FastAPI `Response`
* `request` - The request that the target received, as a FastAPI `Request` (after any modification by the request callback)
* `persistent_state` - The same route-level dictionary shared with the request and error callbacks

If the callback returns a FastAPI `Response`, that response is returned by the proxy instead of the original one.
Otherwise, the original response is used.

#### Error Callback

An error callback runs when forwarding a request to the target raises an exception. It must accept:

* `request` - The request that caused the error, as a FastAPI `Request`
* `error` - The exception that was raised
* `persistent_state` - The same route-level dictionary shared with the request and response callbacks

The error callback can't replace the response. After it runs, the original exception is raised again.

#### Callbacks Example

The following request and response callbacks measure request latency, and rewrite the response body of requests to
the `/modify` path, replacing occurrences of `"modify"` with `"modified"`:

```python
import copy
import time
import urllib.parse

from clearml import Task
from fastapi import Response

router = Task.current_task().get_http_router()

def request_callback(request, persistent_state):
    persistent_state["last_request_time"] = time.time()

def response_callback(response, request, persistent_state):
    print("Latency:", time.time() - persistent_state["last_request_time"])
    if urllib.parse.urlparse(str(request.url).rstrip("/")).path == "/modify":
        new_content = response.body.replace(b"modify", b"modified")
        headers = copy.deepcopy(response.headers)
        headers["Content-Length"] = str(len(new_content))
        return Response(status_code=response.status_code, headers=headers, content=new_content)

router.create_local_route(
    source="/",
    target="http://localhost:8000",
    request_callback=request_callback,
    response_callback=response_callback
)
```

## Example

See a complete example using `HttpRouter` in the [ClearML GitHub Repository](https://github.com/clearml/clearml/blob/master/examples/router/http_router.py).
