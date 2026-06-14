---
title: On-Premises on Ubuntu
---

This guide provides step-by-step instruction for installing the ClearML Enterprise Server on a single Linux Ubuntu server.

:::important[Upgrading an Existing Server to v3.29 and Greater]
ClearML Server v3.29 introduces multiple changes to the Docker Compose configuration files.

If you are **upgrading an existing deployment from v3.28 or earlier**, follow the [required upgrade steps](docker_compose_upgrade_3_29.md)
to accommodate these changes before pulling the new images.
:::

## Prerequisites
The following are required for the ClearML on-premises server:

- At least 8 CPUs  
- At least 32 GB RAM  
- OS - Ubuntu 20 or higher  
- 4 Disks  
  - Root  
    - For storing the system and dockers  
    - Recommended at least 30 GB  
    - mounted to `/`  
  - Docker  
    - For storing Docker data  
    - Recommended at least 80GB  
    - mounted to `/var/lib/docker` with permissions 710  
  - Data  
    - For storing Elastic and Mongo databases  
    - Size depends on the usage. Recommended not to start with less than 100 GB  
    - Mounted to `${CLEARML_ROOT}/data`  
  - File Server  
    - For storing `fileserver` files (models and debug samples)  
    - Size depends on usage  
    - Mounted to `${CLEARML_ROOT}/data/fileserver`  
- User for running ClearML services with administrator privileges  
- Ports 8080, 8081, and 8008 available for the ClearML Server services

In addition, make sure you have the following (provided by ClearML):

- Docker hub credentials to access the ClearML images  
- `docker-compose.yml` - The main compose file containing the services definitions  
- `docker-compose.override.yml` - The override file containing additions that are server specific, such as SSO integration  
- `constants.env` - The file contains values for `docker-compose` variables that are unique for 
a specific environment, such as keys and secrets for system users, credentials, and image versions. The constants file 
should be reviewed and modified prior to the server installation. Specifically, make sure `CLEARML_ROOT`, the base directory 
for all ClearML data and configuration files, is defined as expected here (e.g. `grep CLEARML_ROOT constants.env`)



## Installing ClearML Server 
### Preliminary Steps 

1. Install Docker CE:
   
   ``` 
   https://docs.docker.com/install/linux/docker-ce/ubuntu/
   ``` 
1. Verify the Docker CE installation:
   
   ```  
   docker run hello-world
   ``` 
   
   Expected output: 

   ```
   Hello from Docker!
   This message shows that your installation appears to be working correctly.
   To generate this message, Docker took the following steps:

   1. The Docker client contacted the Docker daemon.
   2. The Docker daemon pulled the "hello-world" image from the Docker Hub. (amd64)
   3. The Docker daemon created a new container from that image which runs the executable that produces the output you are currently reading.
   4. The Docker daemon streamed that output to the Docker client, which sent it to your terminal.
   ```
1. Install the Docker Compose V2 plugin following the [official Docker Compose installation
   instructions](https://docs.docker.com/compose/install/) for your distribution, then verify:

   ```
   docker compose version
   ```

1. Increase `vm.max_map_count` for Elasticsearch in Docker: 

   ```
   echo "vm.max_map_count=524288" > /tmp/99-allegro.conf
   echo "vm.overcommit_memory=1" >> /tmp/99-allegro.conf
   echo "fs.inotify.max_user_instances=256" >> /tmp/99-allegro.conf
   sudo mv /tmp/99-allegro.conf /etc/sysctl.d/99-allegro.conf
   sudo sysctl -w vm.max_map_count=524288
   sudo service docker restart
   ```

1. Disable THP. Create the `/etc/systemd/system/disable-thp.service` service file with the following content:

   :::important
   The `ExecStart` string (Under `[Service]) should be a single line.
   :::

   ```
   [Unit]
   Description=Disable Transparent Huge Pages (THP)

   [Service]
   Type=simple
   ExecStart=/bin/sh -c "echo 'never' > /sys/kernel/mm/transparent_hugepage/enabled && echo 'never' > /sys/kernel/mm/transparent_hugepage/defrag"

   [Install]
   WantedBy=multi-user.target
   ```

1. Enable the online service:

   ```
   sudo systemctl daemon-reload
   sudo systemctl enable disable-thp
   ``` 

1. Restart the machine.

### Installing the Server  
1. Remove any previous installation of ClearML Server:

   ```
   sudo rm -R /opt/clearml/
   sudo rm -R /opt/allegro/
   [ -n "${CLEARML_ROOT}" ] && sudo rm -R "${CLEARML_ROOT}"
   ```
   
1. Create local directories for the databases and storage:

   ```
   sudo mkdir -pv ${CLEARML_ROOT}/data/elastic7plus
   sudo chown 1000:1000 ${CLEARML_ROOT}/data/elastic7plus
   sudo mkdir -pv ${CLEARML_ROOT}/data/mongo_4/configdb
   sudo mkdir -pv ${CLEARML_ROOT}/data/mongo_4/db
   sudo mkdir -pv ${CLEARML_ROOT}/data/redis
   sudo mkdir -pv ${CLEARML_ROOT}/data/fileserver
   sudo mkdir -pv ${CLEARML_ROOT}/data/fileserver/tmp
   sudo mkdir -pv ${CLEARML_ROOT}/data/metrics
   sudo mkdir -pv ${CLEARML_ROOT}/data/services/services-agent/cache
   sudo mkdir -pv ${CLEARML_ROOT}/data/agent/app-agent
   sudo mkdir -pv ${CLEARML_ROOT}/logs/apiserver
   sudo mkdir -pv ${CLEARML_ROOT}/logs/async_delete
   sudo mkdir -pv ${CLEARML_ROOT}/logs/task_cleaner
   sudo mkdir -pv ${CLEARML_ROOT}/documentation
   sudo mkdir -pv ${CLEARML_ROOT}/logs/fileserver
   sudo mkdir -pv ${CLEARML_ROOT}/logs/fileserver-proxy
   sudo mkdir -pv ${CLEARML_ROOT}/data/fluentd/buffer
   sudo mkdir -pv ${CLEARML_ROOT}/config/webserver_external_files
   sudo mkdir -pv ${CLEARML_ROOT}/config/onprem_poc
   ```

1. Update ownership of the required directories: 

   ```
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/logs/apiserver
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/logs/async_delete
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/logs/task_cleaner
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/logs/fileserver
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/config/onprem_poc
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/fileserver
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/metrics
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/agent/app-agent
   sudo chown -R 65532:65532 ${CLEARML_ROOT}/data/services/services-agent
   ```

1. Copy the following ClearML configuration files to `${CLEARML_ROOT}`:
   * `constants.env`
   * `docker-compose.override.yml`
   * `docker-compose.yml`

1. Create an initial ClearML configuration file `${CLEARML_ROOT}/config/onprem_poc/apiserver.conf` with a fixed user:

   ``` 
   auth {
     fixed_users {
       enabled: true,
       users: [
         {username: "support", password: "<enter password here>", admin: true, name: "ClearML Support User"},
       ]
     } 
   }
   ```

1. Log into the Docker Hub repository using the username and password provided by ClearML:

   ```
   sudo docker login -u=$DOCKERHUB_USER -p=$DOCKERHUB_PASSWORD
   ```

1. Set the ID of the host's docker group (the group that owns `/var/run/docker.sock`):

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
   avoids relying on a potentially outdated value if the host's docker group GID changes. 
   :::

1. Start the deployment: 

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

1. Verify web access by browsing to your URL (IP address) and port 8080:

   ```
   http://<server_ip_here>:8080
   ```

## Security
To ensure the server's security, it's crucial to open only the necessary ports.

### Working with HTTP
Accessing the server via `HTTP` is disabled by default. While we strongly recommend using HTTPS for security, you can enable insecure connections by modifying your docker-compose.yaml as follows:

```
services:
  apiserver:
    environment:
      - CLEARML__apiserver__auth__cookies__secure=false
```

Only the following ports should be open to any location where a ClearML client (`clearml-agent`, SDK, or web browser) may operate:
* Port 8080 for accessing the WebApp
* Port 8008 for accessing the API server
* Port 8081 for accessing the file server

### Working with TLS / HTTPS
TLS termination through an external mechanism, such as a load balancer, is supported and recommended. For such a setup, 
the following subdomains should be forwarded to the corresponding ports on the server:
* `https://api.<domain>` should be forwarded to port 8008
* `https://app.<domain>` should be forwarded to port 8080
* `https://files.<domain>` should be forwarded to port 8081


:::warning
**Critical: Ensure no other ports are open to maintain the highest level of security.**
:::

Additionally, ensure that the following URLs are correctly configured in the server's environment file:

```
WEBSERVER_URL_FOR_EXTERNAL_WORKERS=https://app.<your-domain>
APISERVER_URL_FOR_EXTERNAL_WORKERS=https://api.<your-domain>
FILESERVER_URL_FOR_EXTERNAL_WORKERS=https://files.<your-domain>
```

:::note
If you prefer to use URLs that do not begin with `app`, `api`, or `files`, you must also add the following configuration 
for the web server in your `docker-compose.override.yml` file:

```
webserver:
    environment:
      - WEBSERVER__displayedServerUrls={"apiServer":"$APISERVER_URL_FOR_EXTERNAL_WORKERS","filesServer":"$FILESERVER_URL_FOR_EXTERNAL_WORKERS"}
```
:::

## Backups

To ensure data consistency and prevent corruption during a restore, it is recommended to regularly back up the storage 
components where ClearML saves its data. See [Backups](extra_configs/backups.md) for more information.


## Monitoring

Monitoring your ClearML deployment is recommended to ensure service availability and detect performance or resource 
issues early. For monitoring guidelines and recommended metrics, see [Monitoring](extra_configs/monitoring_vm_docker.md).

## Troubleshooting

In normal operation mode, all services should be up, and a call to `sudo docker ps` should yield the list of services.  

If a service fails, it is usually due to one of the following:

* Lack of required resources such as storage or memory  
* Incorrect configuration  
* Software anomaly

When a service fails, it should automatically restart. However, if the cause of the failure is persistent, the service 
will fail again. If a service fails, do the following:

### Check the Log

Run:

```
sudo docker <container name or ID> logs -n 1000 
```

See if there is an error message in the log that can explain the failure.

### Check the Server's Environment

The system should be constantly monitored, however it is important to check the following:

* **Storage space**: run `sudo du -hs /`   
* **RAM**:  
  * Run `vmstat -s` to check available RAM  
  * Run: `top` to check the processes.  
    
    :::note
    Some operations, such as complex queries, may cause a spike in memory usage. Therefore, it is recommended to have at least 8GB of free RAM available.
    :::

* **Network**: Make sure that there is external access to the services  
* **CPU**: The best indicator of the need of additional compute resources is high CPU usage of the `apiserver` and `apiserver-es` services.  
  * Examine the usage of each service using `sudo docker stats`  
  * If there is a need to add additional CPUs after updating the server, increase the number of workers on the `apiserver` 
  service by changing the value of `APISERVER_WORKERS_NUMBER` in the `constants.env` file (up to one additional worker per additional core).

### API Server

In case of failures in the `clearml-apiserver` container, or in cases in which the web application gets unexpected errors, 
and the browser's developer tools (F12) network tab shows error codes being returned by the server, also check the log 
of the `apiserver` which is written to `${CLEARML_ROOT}/logs/apiserver/apiserver.log`.  
Additionally, you can check the server availability using:

```
curl http://localhost:8008/api/debug.ping 
```

This should return HTTP 200.

### Web Server

Check the webserver availability by running the following:

```
curl http://<server’s IP address>:8080/configuration.json |
```
