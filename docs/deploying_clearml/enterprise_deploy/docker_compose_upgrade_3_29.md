---
title: Upgrading Docker Compose Deployment to v3.29 and Greater
displayed_sidebar: installationSidebar
---

ClearML Server v3.29 introduces several updates to the Docker Compose configuration files:

* The `apiserver`, `fileserver`, `apps-agent`, and `services-agent` containers now run as a non-root user
  (UID/GID `65532`). Existing host data and log directories must have their ownership updated.
* The `apps-agent` and `services-agent` containers must be granted membership in the host's docker group so that the 
  non-root user can access the mounted `/var/run/docker.sock`.
* The compose files now use the `CLEARML_ROOT` environment variable to identify host filesystem paths (previously 
  hardcoded as `/opt/allegro/...`).
* A `TASK_ROUTER_TOKEN_SECRET` environment variable is required by the `apiserver` container to sign tokens used by the 
  application gateway.

As a result, existing deployments need to undergo specific reconfiguration as part of the upgrade process to this (or 
newer) versions.

:::important
This procedure is required when upgrading from v3.28 (or earlier) to v3.29 or greater. Skipping any step below will 
cause one or more containers to fail to start.

During the upgrade process, services will be temporarily unavailable, so scheduling a dedicated maintenance window is 
recommended.
:::

## Prerequisites

* SSH access to the ClearML server with `sudo` privileges
* The v3.29 (or later) `docker-compose.yml` and `docker-compose.override.yml` files provided by ClearML

## Procedure

### Step 1: Stop the ClearML Deployment

Stop the existing deployment: 

```
docker compose --env-file constants.env down --remove-orphans
```

The `--remove-orphans` is a safety net that clears any stray containers left over from earlier configurations.

Verify all containers are stopped:

```
docker ps | grep -E 'apiserver|fileserver|apps-agent|services-agent'
```

:::important
Proceed only when no containers are returned.
:::


### Step 2: Replace the Compose Files


Replace your existing `docker-compose.yml` and `docker-compose.override.yml` with the new versions provided by ClearML. 

If you made site-specific changes to the override files (for example, SSO configuration or custom CA mounts), reapply 
those changes to the new file.

:::note[Container names change]
The base compose file now names service containers using the pattern `${CONTAINER_PREFIX:-clearml-}<service>`, which 
unless you explicitly set it to a different value, will default the prefix value to `clearml-`. For example 
`${CONTAINER_PREFIX}-apiserver` will be resolved as `clearml-apiserver`.

If you previously relied on the `allegro-*` names (for example, in external monitoring tools or maintenance scripts), 
either:  
* Set `CONTAINER_PREFIX=allegro-` in your env file to preserve the previous names
* Update your scripts to use the new `clearml-*` names. 
:::

### Step 3: Update the env File

In your env file (commonly `constants.env` or another file passed with `--env-file`), make the following changes:

* **Add the new required environment variables**:
  * `CLEARML_ROOT` - The path to the host directory that holds your existing ClearML data, logs, and configuration, so 
    that no data migration is required. Verify the path your deployment uses: default values for previous versions of 
    ClearML include `/opt/allegro` and `/opt/clearml`. 
  * `TASK_ROUTER_TOKEN_SECRET` - A random 50-character alphanumeric string used by the `apiserver` to sign ClearML 
    application gateway access tokens
  
  For example:
  ```
  CLEARML_ROOT=/opt/allegro
  TASK_ROUTER_TOKEN_SECRET=<random 50-character alphanumeric string>
  ```

* **Update image tags to the values corresponding with your target ClearML version**.

  For example, for v3.29, these would be:

  ```
  ELASTICSEARCH_TAG=8.19.10
  MONGO_TAG=8.0.18
  REDIS_TAG=8.2.3
  APISERVER_TAG=3.29.1-800            # changed
  WEBSERVER_TAG=3.29.1-1888           # changed
  WEBSERVER_CONFIG_TAG=3.25.5-on-prem-128
  APPS_DAEMON_TAG=1.5.0-111           # changed
  APPS_WORKER_TAG=app-1.3.1-82
  ```

  If upgrading from a version older than v3.28, verify that the `ELASTICSEARCH_TAG`, `MONGO_TAG`, and `REDIS_TAG` values 
  match those listed above, since earlier upgrades may have included major version bumps for MongoDB and Redis that your 
  env file hasn't picked up .

* **Remove obsolete variable** (optional). 

  `parameter__resource_policy_enabled` is no longer referenced by the `apiserver` and can be removed from the env file.

* **Set Docker Group ID**.

  Set the ID of the host's docker group (the group that owns `/var/run/docker.sock`):

  1. Determine the Docker group ID on your host:

     ```
     stat -c '%g' /var/run/docker.sock
     ```
  
  2. Add the value to your env file:    

     ```
     DOCKER_GID=<value-from-stat>
     ```
     
  :::tip[Future Proofing Group ID configuration]
  Instead of storing `DOCKER_GID` in the env file, you can specify it as part of the Docker Compose invocation. This 
  avoids relying on a potentially outdated value if the host's docker group GID changes. See [Step 5](#step-5-deploy-new-version). 
  :::


### Step 4: Update Host Directories Ownership

Verify the current ownership of the following ClearML data directories 

```
stat -c '%u' ${CLEARML_ROOT}/config/onprem_poc
stat -c '%u' ${CLEARML_ROOT}/data/fileserver
stat -c '%u' ${CLEARML_ROOT}/data/metrics
stat -c '%u' ${CLEARML_ROOT}/data/services
stat -c '%u' ${CLEARML_ROOT}/data/agent
stat -c '%u' ${CLEARML_ROOT}/logs/apiserver
stat -c '%u' ${CLEARML_ROOT}/logs/fileserver
stat -c '%u' ${CLEARML_ROOT}/logs/async_delete
stat -c '%u' ${CLEARML_ROOT}/logs/task_cleaner
```

If all directories return `65532`, ownership is already correct, skip to the [next step](#step-5-deploy-new-version).

If any directory shows a value different from `65532` (e.g. `0` for root), run the following commands once on the host 
to update ownership of the required directories and all their contents to UID/GID `65532`. 

```
sudo chown -R 65532:65532 ${CLEARML_ROOT}/config/onprem_poc
sudo chown -R 65532:65532 ${CLEARML_ROOT}/logs
sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/fileserver
sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/metrics
sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/services
sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/agent
```

To verify ownership at any point, use:

```
stat -c '%u:%g' <path>
```

A return value of `65532:65532` indicates the directory has been correctly re-owned.

:::note
The `elasticsearch`, `mongo`, and `redis` data directories are not involved in this change. Leave their ownership 
unchanged. Elasticsearch's data directory should remain owned by `1000:1000`.
:::

### Step 5: Deploy New Version

After all the previous modifications have been completed, pull the new ClearML version images and deploy them:

```
docker compose --env-file constants.env pull
docker compose --env-file constants.env up -d
```

:::tip[Future Proofing Group ID configuration]
To avoid any discrepancy with underlying changes to the host OS configuration, you can provide the `DOCKER_GID` value 
dynamically as part of the docker compose invocation instead of setting it statically in the env file: 

```
DOCKER_GID=$(stat -c '%g' /var/run/docker.sock) \
    docker compose --env-file constants.env pull
DOCKER_GID=$(stat -c '%g' /var/run/docker.sock) \
    docker compose --env-file constants.env up -d
```

If you need to use `sudo`, place it BEFORE the variable assignment as `sudo` strips environment variables the variable 
is required by the docker compose command.

```
sudo DOCKER_GID=$(stat -c '%g' /var/run/docker.sock) \
docker compose --env-file constants.env up -d
```
:::

### Step 6: Verify Deployment

* Confirm all containers are running:

  ```
  docker compose --env-file constants.env ps
  ```

* Confirm ClearML's web UI is reachable.
* Inspect the `apps-agent` and `services-agent` logs for any permission-related errors on first start

## Troubleshooting

| Symptom                                                                                      | Likely cause                                                                                  |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `apiserver` / `fileserver` exits at startup with `permission denied` writing to a logs or data path. | One of the directories in Step 4 still owned by `root` (UID `0`). Re-run the `chown` for that path. |
| `docker compose up` fails with `variable is not set` for `DOCKER_GID`.                       | `DOCKER_GID` was not provided. See Step 3.                                                    |
| `apps-agent` / `services-agent` fails to talk to the Docker daemon (`permission denied`).    | `DOCKER_GID` is set but does not match the host's `docker` group. Re-check with `stat -c '%g' /var/run/docker.sock`. |
| `apiserver` errors about a missing `task_router` token secret.                               | `TASK_ROUTER_TOKEN_SECRET` is not set in the env file.                                        |
