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
  image: allegroai/task-traffic-router-webserver:${TASK-TRAFFIC-ROUTER-WEBSERVER-TAG}
  ports:
   - "80:8080"
  restart: unless-stopped
  container_name: task_traffic_webserver
  volumes:
   - ./task_traffic_router/config/nginx:/etc/nginx/conf.d:ro
   - ./task_traffic_router/config/lua:/usr/local/openresty/nginx/lua:ro
task_traffic_router:
  image: allegroai/task-traffic-router:${TASK-TRAFFIC-ROUTER-TAG}
  restart: unless-stopped
  container_name: task_traffic_router
  volumes:
   - /var/run/docker.sock:/var/run/docker.sock
   - ./task_traffic_router/config/nginx:/etc/nginx/conf.d:rw
   - ./task_traffic_router/config/lua:/usr/local/openresty/nginx/lua:rw
  environment:
   - LOGGER_LEVEL=INFO
   - CLEARML_API_HOST=${CLEARML_API_HOST:?err}
   - CLEARML_API_ACCESS_KEY=${CLEARML_API_ACCESS_KEY:?err}
   - CLEARML_API_SECRET_KEY=${CLEARML_API_SECRET_KEY:?err}
   - ROUTER_URL=${ROUTER_URL:?err}
   - ROUTER_NAME=${ROUTER_NAME:?err}
   - AUTH_ENABLED=${AUTH_ENABLED:?err}
   - SSL_VERIFY=${SSL_VERIFY:?err}
   - AUTH_COOKIE_NAME=${AUTH_COOKIE_NAME:?err}
   - AUTH_BASE64_JWKS_KEY=${AUTH_BASE64_JWKS_KEY:?err}
   - LISTEN_QUEUE_NAME=${LISTEN_QUEUE_NAME}
   - EXTRA_BASH_COMMAND=${EXTRA_BASH_COMMAND}
   - TCP_ROUTER_ADDRESS=${TCP_ROUTER_ADDRESS}
   - TCP_PORT_START=${TCP_PORT_START}
   - TCP_PORT_END=${TCP_PORT_END}

```

Create a *runtime.env* file containing the following entries:

```
TASK-TRAFFIC-ROUTER-WEBSERVER-TAG=
TASK-TRAFFIC-ROUTER-TAG=
CLEARML_API_HOST=https://api.
CLEARML_API_ACCESS_KEY=
CLEARML_API_SECRET_KEY=
ROUTER_URL=
ROUTER_NAME=main-router
AUTH_ENABLED=true
SSL_VERIFY=true
AUTH_COOKIE_NAME=
AUTH_BASE64_JWKS_KEY=
LISTEN_QUEUE_NAME=
EXTRA_BASH_COMMAND=
TCP_ROUTER_ADDRESS=
TCP_PORT_START=
TCP_PORT_END=
```

Edit it according to the following guidelines:

* `CLEARML_API_HOST`: URL usually starting with `https://api.`  
* `CLEARML_API_ACCESS_KEY`: ClearML server api key  
* `CLEARML_API_SECRET_KEY`: ClearML server secret key  
* `ROUTER_URL`: URL for this router that was previously configured in the load balancer starting with `https://`  
* `ROUTER_NAME`: Unique name for this router  
* `AUTH_ENABLED`: Enable or disable http calls authentication when the router is communicating with the ClearML server  
* `SSL_VERIFY`: Enable or disable SSL certificate validation when the router is communicating with the ClearML server  
* `AUTH_COOKIE_NAME`: Cookie name used by the ClearML server to store the ClearML authentication cookie. This can usually be found in the `value_prefix` key starting with `allegro_token` in `envoy.yaml` file in the ClearML server installation (`/opt/allegro/config/envoy/envoy.yaml`) (see below)  
* `AUTH_SECURE_ENABLED`: Enable the Set-Cookie `secure` parameter  
* `AUTH_BASE64_JWKS_KEY`: Value form `k` key in the `jwks.json` file in the ClearML server installation  
* `LISTEN_QUEUE_NAME`: (optional) name of queue to check for tasks (if none, every task is checked)  
* `EXTRA_BASH_COMMAND`: Command to be launched before starting the router  
* `TCP_ROUTER_ADDRESS`: Router external address, can be an IP or the host machine or a load balancer hostname, depends on network configuration  
* `TCP_PORT_START`: Start port for the TCP Session feature  
* `TCP_PORT_END`: End port for the TCP Session feature

Run the following command to start the router:

```
sudo docker compose --env-file runtime.env up -d
```

:::note How to find my jwkskey

The *JSON Web Key Set* (*JWKS*) is a set of keys containing the public keys used to verify any JSON Web Token (JWT).

In a `docker-compose` server installation, this can be found in the `CLEARML__secure__auth__token_secret` env var in the apiserver server component.

:::


