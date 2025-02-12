---
title: Docker Compose Installation
---

Use docker-compose to deploy the Task Traffic Router. 

## Requirements

* Linux OS (x86) machine  
* Root access  
* Credentials for the ClearML Docker repository  
* Valid ClearML Server installation

## Host Configuration

1. Install Docker (procedure may vary depending on your operating system). The code below is an example for Amazon Linux:

   ```
   sudo dnf -y install docker
   DOCKER_CONFIG="/usr/local/lib/docker"
   sudo mkdir -p $DOCKER_CONFIG/cli-plugins
   sudo curl -SL https://github.com/docker/compose/releases/download/v2.17.3/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
   sudo chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

1. Log in with credentials for the ClearML Docker Hub repository:  

   ```  
   sudo docker login  
   ```

## Docker Compose Configuration


1. Create a `docker-compose.yml` file. For example:  

   ```  
   version: '3.5'  
   services:`  
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

1. Create a `runtime.env` file with the following entries:  

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

   Edit the runtime.env file:
   * `CLEARML_API_HOST`: The URL of your ClearML API Server (i.e. starting with `https://api`).  
   * `CLEARML_API_ACCESS_KEY`: ClearML server API key  
   * `CLEARML_API_SECRET_KEY`: ClearML server API secret  
   * `ROUTER_URL`: The URL users will use to access the router, starting with `https://`  
   * `ROUTER_NAME`: The name for the router. Must be unique across the ClearML control plane scope  
   * `AUTH_ENABLED`: Whether to enable http calls authentication when the router is communicating with the ClearML Server  
   * `SSL_VERIFY`: Whether to enable SSL certificate validation when the router is communicating with the ClearML Server  
   * `AUTH_COOKIE_NAME`: The cookie used by the ClearML server to store the ClearML authentication token. This can 
   usually be found in the `value_prefix` key starting with `allegro_token` in the `envoy.yaml` file in the ClearML 
   Server installation (`/opt/allegro/config/envoy/envoy.yaml`)   
   * `AUTH_SECURE_ENABLED`: Enable the Set-Cookie `secure` parameter  
   * `AUTH_BASE64_JWKS_KEY`: Value form `k` key in the `jwks.json` file in the ClearML server installation (see [JWKS key](#jwks-key))  
   * `LISTEN_QUEUE_NAME`: The ClearML Server queue whose tasks the router will service (useful for setting up more than 
   one router in the same deployment, facilitating directing different routers to different tasks). Use `none` to have 
   the router service all tasks.   
   * `EXTRA_BASH_COMMAND`: Command to be launched before starting router  
   * `TCP_ROUTER_ADDRESS`: The network  address users will use for TCP connections to the router: IP address or hostname 
   (for the machine or a load balancer configured in front of it).  
   * `TCP_PORT_START` and `TCP_PORT_END`:  The range of ports available for TCP connections to the router. Ensure that 
   the chosen range is open and accessible in your network configuration to allow proper routing.    

1. Start the router:  

   ```  
   sudo docker compose --env-file runtime.env up -d  
   ```

## JWKS Key


The **JSON Web Key Set** (JWKS) is a set of keys containing the public keys used to verify any JSON Web Token (JWT).

For the `docker-compose` installation, the JWKS key is the value of the `CLEARML__secure__auth__token_secret` environment 
variable in the API server component   

