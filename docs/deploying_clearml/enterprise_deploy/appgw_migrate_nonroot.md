---
title: Migrating the AI App Gateway to Non-Root Images
displayed_sidebar: installationSidebar
---

:::important[Enterprise Feature]
The AI Application Gateway is available under the ClearML Enterprise plan.
:::

Starting from router `2.16.1` and proxy `1.9.0`, the AI Application Gateway containers run as the unprivileged user
`65532:65532` instead of root, and relocate the OpenResty installation from `/usr/local/openresty` to `/opt/openresty`.
Existing volume mounts, file permissions, and a new runtime directory must be updated before the upgraded Application Gateway can start.

:::important
This procedure is required when upgrading to router `2.16.1` or proxy `1.9.0` (or later) from an earlier version.

During the upgrade process, services will be temporarily unavailable, so scheduling a dedicated maintenance window is recommended.
:::

## Prerequisites

* Root or `sudo` access on the host running the Application Gateway.
* The latest `docker-compose.yaml`.

## Procedure

### 1. Stop the Running Service

```bash
sudo docker compose --env-file runtime.env down
```

### 2. Remove the Previous Configuration Folder

```bash
sudo rm -rf ./application-gateway
# If you are coming from an older release, the folder may instead be named:
sudo rm -rf ./task_traffic_router
```

:::note
Only the configuration tree is removed. Your `docker-compose.yaml` and `runtime.env` files are not affected.
:::

### 3. Update the Docker Compose File

Apply the following changes to `docker-compose.yaml`:
* Update the OpenResty Lua Mount Path

  The Lua folder inside the container has moved from `/usr/local/openresty/nginx/lua` to `/opt/openresty/nginx/lua`. Update
  both services, preserving the existing access mode (`:ro` for the proxy, `:rw` for the router).

  * For `ai-gateway-proxy`, replace:

    ```yaml
    - ./application-gateway/config/lua:/usr/local/openresty/nginx/lua:ro
    ```

    With:

    ```yaml
    - ./application-gateway/config/lua:/opt/openresty/nginx/lua:ro
    ```

  * For `ai-gateway-router`, replace:
        
    ```yaml
    - ./application-gateway/config/lua:/usr/local/openresty/nginx/lua:rw
    ```
      
    With:
      
    ```yaml
    - ./application-gateway/config/lua:/opt/openresty/nginx/lua:rw
    ```

* Add the OpenResty Runtime Volume

  Add the following volume to the `ai-gateway-proxy` service. It is required for the non-root OpenResty process to write
  its runtime files (PID, sockets):

  ```yaml
  - ./application-gateway/var/run/openresty:/var/run/openresty
  ```

* Enable Configuration Auto-Reload

  Add the following line to the `environment` section of both the `ai-gateway-router` and `ai-gateway-proxy`
  services:

  ```yaml
  environment:
  - ROUTER__WEBSERVER__AUTO_RELOAD_CONFIG=true
  ```

  This allows the router to reload the proxy configuration without needing to send signals across the user boundary.

### 4. Start the Application Gateway

```bash
sudo docker compose --env-file runtime.env up -d
```

On first start, the containers recreate the `application-gateway` folder tree on the host. Permission errors at
this stage are expected, and they will be resolved in the next step.

### 5. Update Host Directory Ownership

The non-root images run as UID/GID `65532:65532`. The host folder must be owned by that same user so the containers can
read and write configuration. 

Verify the current ownership of the `application-gateway` folder:

```bash
ls -ld application-gateway
```

If the folder shows a value different from `65532`, update ownership:


```bash
sudo chown -R 65532:65532 application-gateway
```

### 6. Restart the Application Gateway

Restart so both containers pick up the corrected permissions:

```bash
sudo docker compose --env-file runtime.env restart
```

## Verification

Confirm the migration completed successfully:

```bash
# Both containers should be in state "Up"
sudo docker compose ps

# Router logs should show no permission errors and the connection to the ClearML API
sudo docker compose logs ai-gateway-router

# Proxy logs should show OpenResty starting and binding to the configured port
sudo docker compose logs ai-gateway-proxy

# Proxy should be running as a non-root user
sudo docker compose exec ai-gateway-proxy id
# Expected: uid=65532 gid=65532
```
