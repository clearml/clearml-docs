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
   echo "vm.max_map_count=262144" > /tmp/99-allegro.conf
   echo "vm.overcommit_memory=1" >> /tmp/99-allegro.conf
   echo "fs.inotify.max_user_instances=256" >> /tmp/99-allegro.conf
   sudo mv /tmp/99-allegro.conf /etc/sysctl.d/99-allegro.conf
   sudo sysctl -w vm.max_map_count=262144
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
   sudo mkdir -pv /opt/allegro/logs/apiserver
   sudo mkdir -pv /opt/allegro/documentation
   sudo mkdir -pv /opt/allegro/data/fileserver
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
         {username: "support", password: "<enter password here>", admin: true, name: "allegro.ai Support User"},
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
Directly accessing the server using `HTTP` is not recommended. However, if you choose to do so, only the following ports 
should be open to any location where a ClearML client (`clearml-agent`, SDK, or web browser) may operate:
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
The main components that contain data are the databases: 
* MongoDB
* ElasticSearch
* File server

It is recommended to back them periodically.

### Fileserver
It is recommended to back up the entire file server volume.
* Recommended to perform at least a daily backup.
* Recommended backup retention of 2 days at the least.

### ElasticSearch
Please refer to [ElasticSearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html) for creating snapshots.


#### MongoDB
Please refer to [MongoDB’s documentation](https://www.mongodb.com/docs/manual/core/backups/) for backing up / restoring. 

## Monitoring

The following monitoring is recommended:

### Basic Hardware Monitoring

#### CPU

CPU usage varies depending on system usage. We recommend to monitor CPU usage and to alert when the usage is higher 
than normal. Recommended starting alerts would be 5-minute CPU load 
level of 5 and 10, and adjusting according to performance.

#### RAM

Available memory usage also varies depending on system usage. Due to spikes in usage when performing certain tasks, 6-8 GB 
of available RAM is recommended as the standard baseline. Some use cases may require more. Thus, we recommend to have 8 GB 
of available memory on top of the regular system usage. Alert levels should alert if the available memory is below normal.

##### Disk Usage

There are several disks used by the system. We recommend monitoring all of them. Standard alert levels are 20%, 10% and 
5% of free disk space.

### Service Availability

The following services should be monitored periodically for availability and for response time:

* `apiserver` - [http://localhost:10000/api/debug.ping](http://localhost:10000/api/debug.ping) should return HTTP 200  
* `webserver` - [http://localhost:10000](http://localhost:10000/) should return HTTP 200  
* `fileserver` - [http://localhost:10000/files/](http://localhost:10000/files/) should return HTTP 405 ("method not allowed")


### API Server Docker Memory Usage

A usage spike can happen during normal operation. But very high spikes (above 6GB) are not expected. We recommend using 
`docker stats` to get this information.  

For example, the following comment retrieves the API server's information from the Docker server:

```
sudo curl -s --unix-socket /var/run/docker.sock http://localhost/containers/allegro-apiserver/stats?stream=false  
```

We recommend monitoring the API server memory in addition to the system's available RAM. Alerts should be triggered 
when memory usage of the API server exceeds the normal behavior. A starting value can be 6 GB.

### Backup Failures

It is also highly recommended to monitor the backups and to alert if a backup has failed.

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



