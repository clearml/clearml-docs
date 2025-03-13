---
title: Docker-Compose Deployment
---

:::important Enterprise Feature
The Application Gateway is available under the ClearML Enterprise plan.
:::

## Requirements

* Linux OS (x86) machine  
* Root access  
* Credentials for the ClearML/allegroai docker repository  
* A valid ClearML Server installation

## Host Configurations

### Docker Installation

Installing `docker` and `docker-compose` might vary depending on the specific operating system you’re using. Here is an example for AmazonLinux:

```
sudo dnf -y install docker
DOCKER_CONFIG="/usr/local/lib/docker"
sudo mkdir -p $DOCKER_CONFIG/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.17.3/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
sudo chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
sudo systemctl enable docker
sudo systemctl start docker
 
sudo docker login
```

Use the ClearML/allegroai dockerhub credentials when prompted by docker login.

### Docker-compose File

This is an example of the `docker-compose` file you will need:

```
version: '3.5'
services:
  task_traffic_webserver:
    image: clearml/ai-gateway-proxy:${PROXY_TAG:?err}
    network_mode: "host"
    restart: unless-stopped
    container_name: task_traffic_webserver
    volumes:
    - ./task_traffic_router/config/nginx:/etc/nginx/conf.d:ro
    - ./task_traffic_router/config/lua:/usr/local/openresty/nginx/lua:ro
  task_traffic_router:
    image: clearml/ai-gateway-router:${ROUTER_TAG:?err}
    restart: unless-stopped
    container_name: task_traffic_router
    volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - ./task_traffic_router/config/nginx:/etc/nginx/conf.d:rw
    - ./task_traffic_router/config/lua:/usr/local/openresty/nginx/lua:rw
    environment:
    - ROUTER_NAME=${ROUTER_NAME:?err}
    - ROUTER__WEBSERVER__SERVER_PORT=${ROUTER__WEBSERVER__SERVER_PORT:?err}
    - ROUTER_URL=${ROUTER_URL:?err}
    - CLEARML_API_HOST=${CLEARML_API_HOST:?err}
    - CLEARML_API_ACCESS_KEY=${CLEARML_API_ACCESS_KEY:?err}
    - CLEARML_API_SECRET_KEY=${CLEARML_API_SECRET_KEY:?err}
    - AUTH_COOKIE_NAME=${AUTH_COOKIE_NAME:?err}
    - AUTH_SECURE_ENABLED=${AUTH_SECURE_ENABLED}
    - TCP_ROUTER_ADDRESS=${TCP_ROUTER_ADDRESS}
    - TCP_PORT_START=${TCP_PORT_START}
    - TCP_PORT_END=${TCP_PORT_END}
```

Create a `runtime.env` file containing the following entries:

```
PROXY_TAG=
ROUTER_TAG=
ROUTER_NAME=main-router
ROUTER__WEBSERVER__SERVER_PORT=8010
ROUTER_URL=
CLEARML_API_HOST=
CLEARML_API_ACCESS_KEY=
CLEARML_API_SECRET_KEY=
AUTH_COOKIE_NAME=
AUTH_SECURE_ENABLED=true
TCP_ROUTER_ADDRESS=
TCP_PORT_START=
TCP_PORT_END=
```

Edit it according to the following guidelines:
* `PROXY_TAG`: AI Application Gateway proxy tag.
* `ROUTER_TAG`: AI Application Gateway Router tag.
* `ROUTER_NAME`: Unique name for this router, needed in case of [multiple routers on the same tenant](#install-multiple-routers-for-the-same-tenant).
* `ROUTER__WEBSERVER__SERVER_PORT`: Webserver port. Default is 8080 but can be set differently based on network needs.
* `ROUTER_URL`: URL for this router that was previously configured in the load balancer starting with `https://`.
* `CLEARML_API_HOST`: ClearML API server URL usually starting with `https://api.`
* `CLEARML_API_ACCESS_KEY`: ClearML server API key.
* `CLEARML_API_SECRET_KEY`: ClearML server secret key.
* `AUTH_COOKIE_NAME`: Cookie name used by the ClearML server to store the ClearML authentication cookie. This can usually be found in the `value_prefix` key starting with `allegro_token` in `envoy.yaml` file in the ClearML server installation (`/opt/allegro/config/envoy/envoy.yaml`)
* `AUTH_SECURE_ENABLED`: Enable the Set-Cookie `secure` parameter. Set to `false` in case services are exposed with `http`.
* `TCP_ROUTER_ADDRESS`: Router external address, can be an IP or the host machine or a load balancer hostname, depends on network configuration  
* `TCP_PORT_START`: Start port for the TCP Session feature  
* `TCP_PORT_END`: End port for the TCP Session feature

Run the following command to start the router:

```
sudo docker compose --env-file runtime.env up -d
```

### Advanced Configuration

#### Running without Certificates
When running on `docker-compose` with an HTTP interface without certificates, set the following entry in the 
`runtime.env`:

```
AUTH_SECURE_ENABLED=false
```

#### Install Multiple Routers for the Same Tenant
To deploy multiple routers within the same tenant, you must configure each router to handle specific workloads. 

Using this setting, each router will only route tasks that originated from its assigned queues. This 
is important in case you have multiple networks with different agents. For example:
* Tasks started by Agent A can only be reached by Router A (within the same network), but cannot be reached by Router B
* Agent B will handle a separate set of tasks which can only be reached by Router B

The assumption in this case is that Agent A and Agent B will service different queues, and routers must be configured to 
route tasks based on these queue definitions.

Each router in the same tenant must have: 
* A unique `ROUTER_NAME` 
* Distinct set of queues listed in `LISTEN_QUEUE_NAME`

For example:
* **Router-A** `runtime.env`

  ```
  ROUTER_NAME=router-a
  LISTEN_QUEUE_NAME=queue1,queue2
  ```

* **Router-B** `runtime.env`

  ```
  ROUTER_NAME=router-b
  LISTEN_QUEUE_NAME=queue3,queue4
  ````

Ensure that `LISTEN_QUEUE_NAME` is included in the [`docker-compose` environment variables](#docker-compose-file) for each router 
instance.



