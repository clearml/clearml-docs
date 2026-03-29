---
title: On-Premises on Ubuntu
---

This guide provides step-by-step instruction for installing the ClearML Enterprise Server on a single Linux Ubuntu server.

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
    - Mounted to `/opt/allegro/data`  
  - File Server  
    - For storing `fileserver` files (models and debug samples)  
    - Size depends on usage  
    - Mounted to `/opt/allegro/data/fileserver`  
- User for running ClearML services with administrator privileges  
- Ports 8080, 8081, and 8008 available for the ClearML Server services

In addition, make sure you have the following (provided by ClearML):

- Docker hub credentials to access the ClearML images  
- `docker-compose.yml` - The main compose file containing the services definitions  
- `docker-compose.override.yml` - The override file containing additions that are server specific, such as SSO integration  
- `constants.env` - The `env` file contains values of items in the `docker-compose` that are unique for 
a specific environment, such as keys and secrets for system users, credentials, and image versions. The constant file 
should be reviewed and modified prior to the server installation


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
1. Install `docker-compose`:

   ```
   sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ``` 

   :::note 
   You might need to downgrade urlib3 by running `sudo pip3 install urllib3==1.26.2`
   :::

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
   ```
   
1. Create local directories for the databases and storage:

   ```
   sudo mkdir -pv /opt/allegro/data/elastic7plus
   sudo chown 1000:1000 /opt/allegro/data/elastic7plus
   sudo mkdir -pv /opt/allegro/data/mongo_4/configdb
   sudo mkdir -pv /opt/allegro/data/mongo_4/db
   sudo mkdir -pv /opt/allegro/data/redis
   sudo mkdir -pv /opt/allegro/data/fileserver
   sudo mkdir -pv /opt/allegro/data/fileserver/tmp
   sudo mkdir -pv /opt/allegro/logs/apiserver
   sudo mkdir -pv /opt/allegro/documentation
   sudo mkdir -pv /opt/allegro/logs/fileserver
   sudo mkdir -pv /opt/allegro/logs/fileserver-proxy
   sudo mkdir -pv /opt/allegro/data/fluentd/buffer
   sudo mkdir -pv /opt/allegro/config/webserver_external_files
   sudo mkdir -pv /opt/allegro/config/onprem_poc
   ```

1. Copy the following ClearML configuration files to `/opt/allegro`:
   * `constants.env`
   * `docker-compose.override.yml`
   * `docker-compose.yml`

1. Create an initial ClearML configuration file `/opt/allegro/config/onprem_poc/apiserver.conf` with a fixed user:

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
   
1. Start the `docker-compose`  by changing directories to the directory containing the `docker-compose` files and running the following command:
   
   ```
   sudo docker-compose --env-file constants.env up -d
   ```
   
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

## Private CA Certificate Configuration

When using TLS termination with a private Certificate Authority (CA), the `clearml-apps-agent` and
`clearml-services-agent` containers need to trust the CA certificate. This section describes how to configure
the agents and their spawned child containers to work with private CA certificates.

### Architecture Overview

The two agents have different network connectivity patterns:

| Agent | API Connection                                      | Files/Web Connection |
|-------|-----------------------------------------------------|----------------------|
| `clearml-apps-agent` | External HTTPS (needs CA)                           | External HTTPS (needs CA) |
| `clearml-services-agent` | Internal HTTP via the docker network (no CA needed) | External HTTPS (needs CA) |


### Installing the CA Certificate

Create a directory for the CA certificate and build a combined certificate bundle:

```bash
# Create directory
sudo mkdir -p /opt/allegro/config/ca-certificates

# Copy your private CA certificate (adjust source path as needed)
sudo cp /path/to/private-ca.crt /opt/allegro/config/ca-certificates/
```

:::note
If your IT department provides a complete CA bundle (containing both system CAs and your private CA), you can
skip the combination step below and copy the provided bundle directly to
`/opt/allegro/config/ca-certificates/ca-certificates.crt`.
:::

Create a combined bundle that includes both the system CAs and your private CA:

```bash
sudo cat /etc/ssl/certs/ca-certificates.crt /opt/allegro/config/ca-certificates/private-ca.crt \
  | sudo tee /opt/allegro/config/ca-certificates/ca-certificates.crt > /dev/null
```

Set the appropriate permissions:
```bash
sudo chmod 644 /opt/allegro/config/ca-certificates/ca-certificates.crt
```

### Configuring clearml-apps-agent

The `clearml-apps-agent` uses external HTTPS for all connections (API, Files, Web), so it requires full CA
configuration for both the agent container and its spawned child containers.

Add the following configuration to your `docker-compose.override.yml`:

```yaml
apps-agent:
  environment:
    # CA certificate environment variables for apps-agent container
    - REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
    - SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
    - CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
    # CA configuration for child containers (add the above environment variables to the existing CLEARML_AGENT_EXTRA_DOCKER_ARGS)
    - CLEARML_AGENT_EXTRA_DOCKER_ARGS=-e CLEARML_DISABLE_VAULT_SUPPORT=1 -e CLEARML_AGENT_DISABLE_VAULT_SUPPORT=1 -e REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt -e SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt -e CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt -v /opt/allegro/config/ca-certificates/ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro --log-driver json-file --log-opt max-size=10m --log-opt max-file=3
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - /opt/allegro/data/agent/app-agent:/root/.clearml
    - /opt/allegro/data/agent/app-agent_tmp:/tmp
    # CA certificate bundle mount
    - /opt/allegro/config/ca-certificates/ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro
```

:::important
The `CLEARML_AGENT_EXTRA_DOCKER_ARGS` value shown above includes the CA configuration appended to typical
existing arguments. Adjust according to your current configuration.
:::

### Configuring clearml-services-agent

The `clearml-services-agent` uses internal HTTP for API communication (`http://allegro-envoy:10000/api`), so
the agent container itself does not need CA configuration. However, the spawned child containers may access
the external fileserver URL, so they need the CA configuration.

Add the following to your `docker-compose.override.yml`:

```yaml
services-agent:
  environment:
    - CLEARML_API_HOST=http://allegro-envoy:10000/api
    - CLEARML_FILES_HOST=https://files.${SERVER_URL}
    - CLEARML_WEB_HOST=https://app.${SERVER_URL}
    # CA configuration for child service containers only
    - CLEARML_AGENT_EXTRA_DOCKER_ARGS=--memory=1024m -e REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt -e SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt -e CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt -v /opt/allegro/config/ca-certificates/ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro --log-driver json-file --log-opt max-size=10m --log-opt max-file=3
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - /opt/allegro/data/services/services-agent/cache:/root/.clearml
    - /opt/allegro/data/services/services-agent/tmp:/tmp
```

:::important
The `CLEARML_AGENT_EXTRA_DOCKER_ARGS` value shown above includes the CA configuration appended to typical
existing arguments. Adjust according to your current configuration.
:::

:::note
The `services-agent` container itself does NOT need the CA volume mount or environment variables since it
communicates with the API server internally. Only the spawned child containers need the CA configuration
(configured via `CLEARML_AGENT_EXTRA_DOCKER_ARGS`).
:::

### Applying Changes

After updating the configuration, restart the services:

```bash
sudo docker compose --env-file constants.env down
sudo docker compose --env-file constants.env up -d
```

### Configuration Summary

| Component | CA Volume Mount | CA Environment Variables | EXTRA_DOCKER_ARGS CA Config |
|-----------|-----------------|--------------------------|----------------------------|
| apps-agent container | Yes | Yes | - |
| apps-agent child containers | - | - | Yes |
| services-agent container | No | No | - |
| services-agent child containers | - | - | Yes |

### ClearML SDK Configuration

Users running the ClearML SDK directly (experiments, scripts, or notebooks) also need to configure their
environment to trust the private CA.

**Option 1: Environment Variable (Recommended)**

Set the `REQUESTS_CA_BUNDLE` environment variable before running Python:

Example:
```bash
export REQUESTS_CA_BUNDLE="/path/to/your/custom_ca_bundle.pem"
python my_clearml_script.py
```

**Option 2: In Python Code**

Add the following at the beginning of your script, before any ClearML imports:

```python
import os
os.environ['REQUESTS_CA_BUNDLE'] = "/path/to/your/custom_ca_bundle.pem"

from clearml import Task
# ... rest of your code
```

:::note
Your IT department may provide either:
- **A complete CA bundle** - Contains both your organization's private CA and system CA certificates. Use this file directly.
- **Only the private CA certificate** - You will need to combine it with system CA certificates to create a bundle:
  ```bash
  cat /etc/ssl/certs/ca-certificates.crt /path/to/private-ca.crt > custom_ca_bundle.pem
  ```
:::

### Additional Considerations

**RHEL-based child images:** If spawned containers use RHEL-based images, also add the following volume mount
to `CLEARML_AGENT_EXTRA_DOCKER_ARGS`:
```
-v /opt/allegro/config/ca-certificates/ca-certificates.crt:/etc/pki/tls/certs/ca-bundle.crt:ro
```

**When services-agent CA is needed:** The services-agent child containers only need CA configuration if
service tasks download or upload artifacts via the external fileserver URL. If services only poll for work
and report status via the internal API, they may function without CA setup.

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

In case of failures in the `allegro-apiserver` container, or in cases in which the web application gets unexpected errors, 
and the browser's developer tools (F12) network tab shows error codes being returned by the server, also check the log 
of the `apiserver` which is written to `/opt/allegro/logs/apiserver/apiserver.log`.  
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



