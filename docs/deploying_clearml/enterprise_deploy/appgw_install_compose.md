---
title: Docker-Compose Deployment
---

:::important Enterprise Feature
The Application Gateway is available under the ClearML Enterprise plan.
:::

The Application Gateway enables external HTTP(S) or direct TCP access to ClearML tasks and applications running on 
nodes. The gateway is configured with an endpoint or external address, making these services accessible from the user's 
machine, outside the workload's network.

This guide describes how to install and run the ClearML Application Gateway using docker-compose for environments 
where you manage both the ClearML Server and the workload nodes.


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
PROXY_TAG=1.5.1
ROUTER_TAG=2.6.2
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

**Configuration Options:**
* `PROXY_TAG`: Application Gateway proxy tag. The Docker image tag for the proxy component, which needs to be 
  specified during installation. This tag is provided by ClearML to ensure compatibility with the recommended version.
* `ROUTER_TAG`: App Gateway Router tag. The Docker image tag for the router component. It defines the specific version 
  to be installed and is provided by ClearML as part of the setup process.
* `ROUTER_NAME`: In the case of [multiple routers on the same tenant](#multiple-router-in-the-same-tenant), each router 
  needs to have a unique name.
* `ROUTER__WEBSERVER__SERVER_PORT`: Webserver port. The default port is 8080, but it can be adjusted to meet specific network requirements.
* `ROUTER_URL`: External address to access the router. This can be the IP address or DNS of the node where the router 
  is running, or the address of a load balancer if the router operates behind a proxy/load balancer. This URL is used 
  to access AI workload applications (e.g. remote IDE, model deployment, etc.), so it must be reachable and resolvable for them.
* `CLEARML_API_HOST`: ClearML API server URL starting with `https://api.`
* `CLEARML_API_ACCESS_KEY`: ClearML server API key.
* `CLEARML_API_SECRET_KEY`: ClearML server secret key.
* `AUTH_COOKIE_NAME`: Cookie used by the ClearML server to store the ClearML authentication cookie. This can usually be 
  found in the `envoy.yaml` file in the ClearML server installation (`/opt/allegro/config/envoy/envoy.yaml`), under the 
  `value_prefix` key starting with `allegro_token` 
* `AUTH_SECURE_ENABLED`: Enable the Set-Cookie `secure` parameter. Set to `false` in case services are exposed with `http`.
* `TCP_ROUTER_ADDRESS`: Router external address, can be an IP or the host machine or a load balancer hostname, depends on network configuration  
* `TCP_PORT_START`: Start port for the TCP Session feature  
* `TCP_PORT_END`: End port for the TCP Session feature

Run the following command to start the router:

```
sudo docker compose --env-file runtime.env up -d
```

### Advanced Configuration

#### Using Open HTTP

To deploy the App Gateway Router on open HTTP (without a certificate), set the `AUTH_SECURE_ENABLED` entry
to `false` in the `runtime.env` file. 

#### Multiple Router in the Same Tenant

If you have workloads running in separate networks that cannot communicate with each other, you need to deploy multiple
routers, one for each isolated environment. Each router will only process tasks from designated queues, ensuring that 
tasks are correctly routed to agents within the same network.

For example:
* If Agent A and Agent B are in separate networks, each must have its own router to receive tasks.
* Router A will handle tasks from Agent A’s queues. Router B will handle tasks from Agent B’s queues.

To achieve this, each router must be configured with:
* A unique `ROUTER_NAME`
* A distinct set of queues defined in `LISTEN_QUEUE_NAME`.

##### Example Configuration
Each router's `runtime.env` file should include:

* Router A:

  ```
  ROUTER_NAME=router-a  
  LISTEN_QUEUE_NAME=queue1,queue2  
  ```

* Router B:

  ```
  ROUTER_NAME=router-b  
  LISTEN_QUEUE_NAME=queue3,queue4  
  ```
  
Make sure `LISTEN_QUEUE_NAME` is set in the  [`docker-compose` environment variables](#docker-compose-file) for each router instance.

## Monitoring and Testing the Gateway

Once your gateway is deployed, you can monitor its status, view routed tasks, and run connectivity tests in 
ClearML WebApp, under **Settings > Application Gateway**.

![App Gateway Test](../../img/settings_app_gateway_test.png#light-mode-only)
![App Gateway Test](../../img/settings_app_gateway_test_dark.png#dark-mode-only)