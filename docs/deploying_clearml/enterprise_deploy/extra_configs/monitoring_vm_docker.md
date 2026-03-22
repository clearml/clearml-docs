---
title: Monitoring (VM / Docker Deployment)
---

The following are general recommendations for monitoring your ClearML deployment on AWS VPC or on-prem Ubuntu. These 
practices help identify performance issues early and maintain system reliability.

## Hardware Monitoring 
### CPU

CPU usage varies depending on system usage. Monitor CPU usage and configure alerts when usage is higher than normal. 

Recommended starting alerts would be 5-minute CPU load level of 5 and 10, and adjusting according to performance.

### RAM

Available memory usage also varies depending on system usage. Due to spikes in usage when performing certain tasks, 6-8 GB 
of available RAM is recommended as the standard baseline. Some use cases may require more. Thus, we recommend having 8 GB 
of available memory on top of the regular system usage. Alert levels should alert if the available memory is below normal.

#### Disk Usage

There are several disks used by the system. We recommend monitoring all of them. Standard alert levels are 20%, 10% and 
5% of free disk space.

## Service Availability

The following services should be monitored periodically for availability and for response time:

* `apiserver` - [http://localhost:10000/api/debug.ping](http://localhost:10000/api/debug.ping) should return HTTP 200  
* `webserver` - [http://localhost:10000](http://localhost:10000/) should return HTTP 200  
* `fileserver` - [http://localhost:10000/files/](http://localhost:10000/files/) should return HTTP 405 ("method not allowed")


## API Server Docker Memory Usage

A usage spike can happen during normal operation. But very high spikes (above 6GB) are not expected. We recommend using 
`docker stats` to get this information.  

For example, the following comment retrieves the API server's information from the Docker server:

```commandline
sudo curl -s --unix-socket /var/run/docker.sock http://localhost/containers/allegro-apiserver/stats?stream=false  
```

We recommend monitoring the API server memory in addition to the system's available RAM. Alerts should be triggered 
when memory usage of the API server exceeds the normal behavior. A starting value can be 6 GB.

## Backup Failures

It is highly recommended to monitor the backups and to alert if a backup has failed.
