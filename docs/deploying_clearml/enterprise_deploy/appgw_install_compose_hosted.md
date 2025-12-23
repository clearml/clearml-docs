---
title: Docker-Compose - Hosted Server
---

:::important Enterprise Feature 
The AI Application Gateway is available under the ClearML Enterprise plan.
:::

The AI Application Gateway enables external access to ClearML tasks, and applications running on workload nodes that
require HTTP or TCP access. The gateway is configured with an endpoint or external address, making these services 
accessible from the user's machine, outside the workload nodes’ network.

This guide details the installation of the App Gateway Router for ClearML users who use ClearML's hosted control 
plane while hosting their own workload nodes.

## Requirements

* Linux OS (x86) machine with root access  
* The machine needs to be reachable from your user network  
* The machine needs to have network reachability to workload nodes  
* Credentials for the ClearML docker repository
* A valid ClearML Server installation

Additionally, for a secure connection, it is recommended to have a DNS entry and a valid SSL Certificate assigned to the machine IP.

:::note Using Docker Compose V1?
Docker Compose V1 reached end-of-life in July 2023 and is no longer receiving updates.
The commands in this guide use V2 syntax. If you're still on V1:
- Replace `docker compose` with `docker-compose`
- Replace `compose.yaml` with `docker-compose.yml`

We strongly recommend [migrating to Docker Compose V2](https://docs.docker.com/compose/migrate/)
for continued support and new features.
:::

## Host Configuration

### Docker Installation

Installing `docker` and `docker-compose` might vary depending on the specific operating system you're using. Here is an 
example for AmazonLinux:

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

Use the ClearML docker hub credentials when prompted by `docker` login.

### Docker-compose File

This is an example of the `docker-compose` file you will need to create:

```
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
    - LOGGER_LEVEL=INFO
    - ROUTER__WEBSERVER__SERVER_PORT="8010"
    - ROUTER_NAME=${ROUTER_NAME:?err}
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

### Configuration File

You will be provided with a prefilled `runtime.env` file containing the following entries:

```
# PREFILLED SECTION, PROVIDED BY CLEARML
PROXY_TAG=
ROUTER_TAG=
CLEARML_API_HOST=https://api.
AUTH_COOKIE_NAME=

# TO BE FILLED BY USER
ROUTER_NAME=main-router
ROUTER_URL=http://<ROUTER-HOST-PUBLIC-IP>:8010
CLEARML_API_ACCESS_KEY=
CLEARML_API_SECRET_KEY=
AUTH_SECURE_ENABLED=true
TCP_ROUTER_ADDRESS=<ROUTER-HOST-PUBLIC-IP>
TCP_PORT_START=
TCP_PORT_END=
```

**Configuration Options:**

* `ROUTER_NAME`: In the case of [multiple routers on the same tenant](#multiple-router-in-the-same-tenant), each router 
   needs to have a unique name.
* `CLEARML_API_ACCESS_KEY, CLEARML_API_SECRET_KEY:` API credentials for Admin user or Service Account with admin privileges 
  created in the ClearML web UI. Make sure to label these credentials clearly, so that they will not be revoked by mistake.  
* `ROUTER_URL`: External address to access the router. This can be the IP address or DNS of the node where the router 
   is running, or the address of a load balancer if the router operates behind a proxy/load balancer. This URL is used 
   to access AI workload applications (e.g. remote IDE, model deployment, etc.), so it must be reachable and resolvable for them.  
* `TCP_ROUTER_ADDRESS`:  Router external address, can be an IP or the host machine or a load balancer hostname, depends on network configuration.  
* `TCP_PORT_START`: Start port for the TCP Tasks, chosen by the customer. Ensure that ports are open and can be allocated on the host.  
* `TCP_PORT_END`: End port for the TCP Tasks, chosen by the customer. Ensure that ports are open and can be allocated on the host.

### Installation

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