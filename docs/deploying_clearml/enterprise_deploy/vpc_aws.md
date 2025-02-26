---
title: AWS VPC
---

This guide provides step-by-step instructions for installing the ClearML Enterprise Server on AWS using a Virtual Private Cloud (VPC). 

It covers the following:
* Set up security groups and IAM role
* Create EC2 instance with required disks
* Install dependencies and mount disks
* Deploy ClearML version using docker-compose
* Set up load balancer and DNS
* Set up server backup 

## Prerequisites

An AWS account with at least 2 availability zones is required. It is recommended to install on a region with at least 
3 availability zones. Having fewer than 3 availability zones would prevent the use of high-availability setups, if 
needed in the future.

## Instance Setup

:::note 
It is recommended to use a VPC with IPv6 enabled for future usage expansion.
:::

### Create Security Groups for the Server and Load Balancer

1. Create a security group for the load balancer.
  
   It is recommended to configure the security group to allow access, at first, only for a trusted IP address or a set 
   of trusted IP addresses, that will be used for the initial setup of the server.

   * Ingress TCP ports: 80, 443 from trusted IP addresses.  
   * Egress: All addresses and ports.

1. Create a security group for the main server (`clearml-main`):

    * Ingress:
      * TCP port 10000, from the load balancer's security group
      * TCP port 22 from trusted IP addresses.
   * Egress: All addresses and ports

:::important
A company’s security policy may require filtering Egress traffic. However, at the initial stage, one should note that 
some external repositories will be used to install software. 
:::

### Create an IAM Role for the Server

To perform backups to S3, the instance will need a role that allows EC2 access (RW) to a backup bucket.  
An example policy document with the above parameters is provided at `self_installed_policy.json`.

### Create Instance

Instance requirements:

1. The instance must be created in a VPC with at least two public subnets to allow for AWS load balancer setup.  
2. `x86_64` based instance  
3. [Amazon Linux 2 OS](https://aws.amazon.com/amazon-linux-2/?amazon-linux-whats-new.sort-by=item.additionalFields.postDateTime&amazon-linux-whats-new.sort-order=desc) 
4. Disks:  
   1. Root disk: 50GB `gp3` disk, or one with higher volume/performance.  
   2. Data disk:  
      1. Used for databases (ElasticSearch and Mongo DB) in which meta-data and events are saved  
      2. Device: `/dev/sdf`  
      3. Recommended initial size: 100GB  
      4. Type: `gp3` or a higher random access performance one.  
   3. Fileserver disk:  
      1. Used for storing files such as debug images and models   
      2. Device: `/dev/sdg`  
      3. Recommended initial size: Should be estimated by users of the system.  
      4. Type: Depending on usage, but `gp3` or `st1` are usually the best options: 
         1. For a large amount of data, used by a small number of users/experiments, use `st1` (minimum `st1` disk size: 500GB).  
         2. For all other scenarios, use SSD disks (e.g. `gp3`).  
         3. The disk type can be changed after creation.  
         4. Very large number of users and/or experiments may require higher than the default `gp3` disk performance.  
   4. Docker data disk:  
      1. Used for Docker data.  
      2. Device: `/dev/sdh`  
      3. Recommended initial size: 30GB  
      4. Type: `gp3`  
5. Use the `clearml-main` security group and the IAM role created in the previous step.

## Configuration and Software Deployment

### Install Dependencies

1. Copy the following files to `/home/ec2-user` directory on the server:  
   1. `envoy.yaml`  
   2. `self_installed_VPC_EC2_amazon_linux_2_install.sh`  
2. Run `self_installed_VPC_EC2_amazon_linux_2_install.sh` from the `/home/ec2-user` directory.  
3. Verify the disks were mounted successfully (using: `df -h`) to:  
   1. `/opt/allegro/data`  
   2. `/opt/allegro/data/fileserver`  
   3. `/var/lib/docker`  
4. Reboot server.

### Version Deployment

1. Copy the following files to `/home/ec2-user` directory on the server:  
   * `constants.env`  
   * `docker-compose.yml`  
   * `docker-compose.override.yml`  
2. Log in to Dockerhub:

   ```
   source constants.env  
   sudo docker login -u=$DOCKERHUB_USER -p=$DOCKERHUB_PASSWORD
   ```   
3. Start the dockers:  

   ```
   sudo docker-compose --env-file constants.env up -d
   ```
   
## Load Balancer

1. Create a TLS certificate:  
   1. Choose a domain name to be used with the server. The main URL that will be used by the system’s users will be app.\<domain\>  
   2. Create a certificate, with the following DNS names:  
      1. \<domain name\>  
      2. \*.\<domain name\>

2. Create the `envoy` target group for the server:  
   1. Port: 10000  
   2. Protocol: HTTP  
   3. Target type: instance  
   4. Attach the server instance as the single target.  
   5. Health check:  
      1. Match HTTP response code 200  
      2. Path: `/api/debug.ping` 
      3. timeout: 10 seconds  
      4. Healthy threshold: 1  
      5. Unhealthy threshold: 2

3. Create an Application Load Balancer, with the following parameters:  
   1. Security group: As defined [above](#create-security-groups-for-the-server-and-load-balancer) for the load balancer  
   2. Subnets: Two subnets on the VPC. It is recommended to have at least one of two on the same subnet as the instance.  
   3. Idle timeout: 300 seconds  
   4. Enable deletion protection: True  
   5. IP address type: If possible, dualstack. Otherwise, IPv4.  
   6. Listeners:  
      1. HTTP:  
         1. Port: 80  
         2. protocol: HTTP  
         3. redirect (HTTP 301\) to the same address, with HTTPS  
      2. HTTPS:  
         1. port 443  
         2. Protocol: HTTPS  
         3. Certificate: As defined above.  
         4. SSL policy:
            1. Based on your company's security policy 
         
            2. Currently recommended: `ELBSecurityPolicy-TLS13-1-2-Res-2021-06` 
      
        :::note
        After setting up the listener, we recommend changing the rules created automatically: Set a default HTTP 404 
        response, and forwarding to the target group only if the HTTP header matches `<domain>` or `*.<domain>`
        :::

4. Define DNS rules  
   1. Use your DNS provider of choice to forward traffic to the load balancer.  
   2. If using Route53, the use of A record aliases is recommended.  
   3. The following domains should point to the load balancer:  
      1. `<domain name>`  
      2. `*.<domain name>`

You can now change the load balancers security group to allow Internet access

## Backups

### File Server

Identify the file server's EBS volume ID on the AWS console.  

On the AWS backup service:

1. Create a backup vault.  
2. Create a backup plan for the EBS volume into the vault.  
   1. Recommended to perform at least a daily backup.  
   2. Recommended backups expiration of 2 days at the least.

### Elastic

#### Create the Backup Repo

1. Copy `create_elastic_backup_repo.sh` file to `/home/ec2-user` directory on the server  
2. Run:  

   ``` 
   create_elastic_backup_repo.sh <bucket_name>
   ```

#### Backing Up

Backup is done by running the `elastic_backup.py` Python script periodically.

1. Copy `elastic_backup.py` to the `/home/ec2-user` directory on the server  
2. Install the required packages:  
   
   ``` 
   pip3 install “elasticsearch\>=6.0.0,\<=7.17.7”  
   pip3 install boto3  
   ```
   
3. For daily backups, run:  
   
   ```
   /home/ec2-user/elastic_backup.py --host-address localhost --snapshot-name-prefix clearml --backup-repo daily --delete-backups-older-than-days 7
   ```  
   
4. For hourly backups run:  
  
   ```
   /home/ec2-user/elastic_backup.py --host-address localhost --snapshot-name-prefix clearml --backup-repo hourly --delete-backups-older-than-days 1 

5. Recommended to add these to the crontab

### MongoDB

Backup is done by running the `mongo_backup.sh` script periodically.

1. Copy `mongo_backup.sh` to `/home/ec2-user` directory on the server  
2. Run:   

   ```
   mongo_backup.sh <bucket name>/<prefix> (ex: mongo_backup.sh mybucket/path/in/bucket)
   ```  

3. Recommended to add this to the crontab

:::note
The MongoDB script does not deal with deletion of old backups. It's recommended to create an S3 lifecycle rule for 
deletion beyond the company's required retention period.
:::

## Monitoring
### Hardware Monitoring

#### CPU

CPU usage varies depending on system usage. We recommend to monitor CPU usage and to alert when the usage is higher 
than normal. Recommended starting alerts would be 5-minute CPU load 
level of 5 and 10, and adjusting according to performance.

#### RAM

Available memory usage also varies depending on system usage. Due to spikes in usage when performing certain tasks, 6-8 GB 
of available RAM is recommended as the standard baseline. Some use cases may require more. Thus, we recommend to have 8 GB 
of available memory on top of the regular system usage. Alert levels should alert if the available memory is below normal.

#### Disk Usage

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

All scripts provided use exit code 0 when successfully completing the backups. Other exit codes indicate problems. The 
log would usually indicate the reason for the failure.

## Maintenance

### Removing app containers

To remove old application containers, add the following to the cron:

```
0 0 * * * root docker container prune --force --filter "until=96h"
```
