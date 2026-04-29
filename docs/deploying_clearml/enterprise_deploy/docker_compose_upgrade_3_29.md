---
title: Upgrading Docker Compose Deployment to v3.29 and Greater
displayed_sidebar: installationSidebar
---

Starting from ClearML Server version 3.29, the `apiserver` and `fileserver` containers run as a non-root user 
(specifically, UID `65532`) instead of root. Existing host data and log directories must have their ownership updated 
before upgrading.

:::important
If this step is not completed, the `apiserver` and fileserver containers will fail to start due to permission errors.
:::

## Prerequisites
* SSH access to the ClearML server with sudo privileges
* A scheduled maintenance window (services will be temporarily unavailable)

## Procedure
1. Verify directory ownership:

   ```
   stat -c '%u' /opt/allegro/logs/apiserver
   stat -c '%u' /opt/allegro/config/onprem_poc
   stat -c '%u' /opt/allegro/logs/fileserver
   stat -c '%u' /opt/allegro/data/fileserver
   stat -c '%u' /opt/allegro/logs/apiserver-es
   stat -c '%u' /opt/allegro/logs/async_delete
   stat -c '%u' /opt/allegro/logs/task_cleaner
   stat -c '%u' /opt/allegro/data/metrics
   ```

   * If all directories return `65532`, no action is required. Proceed with the upgrade.
   * If any directory returns a different UID (e.g., `0` for root) - continue with the procedure below.

1. Stop all ClearML containers

   ```
   cd /opt/allegro/
   sudo docker-compose -p ec2-user --env-file ./runtime_created.env down --remove-orphans
   ```
   
   Verify all containers are stopped:

   ```
   sudo docker ps | grep -E 'apiserver|fileserver'
   ```

   :::important
   Proceed only when no containers are returned.
   :::

1. Update directory ownership:

   ```
   sudo chown -R 65532:65532 /opt/allegro/logs/apiserver
   sudo chown -R 65532:65532 /opt/allegro/config/onprem_poc
   sudo chown -R 65532:65532 /opt/allegro/logs/fileserver
   sudo chown -R 65532:65532 /opt/allegro/data/fileserver
   sudo chown -R 65532:65532 /opt/allegro/logs/apiserver-es
   sudo chown -R 65532:65532 /opt/allegro/logs/async_delete
   sudo chown -R 65532:65532 /opt/allegro/logs/task_cleaner
   sudo chown -R 65532:65532 /opt/allegro/data/metrics
   sudo chown -R 65532:65532 /opt/allegro/data/services/services-agent/cache
   sudo chown -R 65532:65532 /opt/allegro/data/agent/app-agent
   ```
   
1. Set the `DOCKER_GID` environment variable. Get Docker Group ID with following command:

   ```
   $(stat -c '%g' /var/run/docker.sock)
   ```
   
   In `runtime_created.env` set the value for `DOCKER_GID` accordingly.

1. Upgrade ClearML Server to `>= 3.29`  using your standard upgrade process (update image tags, pull new images, etc.).

1. Start containers:

   ```
   sudo docker-compose -p ec2-user --env-file ./runtime_created.env up -d
   ```
   Verify the ClearML web UI is accessible and functional.

