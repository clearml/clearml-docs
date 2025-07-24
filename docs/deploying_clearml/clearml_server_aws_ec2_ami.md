---
title: AWS EC2 AMIs
---

Deployment of ClearML Server on AWS is easily performed using AWS AMIs, which are available in the AWS community AMI catalog.
The [ClearML Server community AMIs](#clearml-server-aws-community-amis) are configured by default without authentication
to allow quick access and onboarding.

After deploying the AMI, configure the ClearML Server instance to provide the authentication scheme that 
best matches the workflow.

For information about upgrading a ClearML Server in an AWS instance, see [here](upgrade_server_aws_ec2_ami.md).

:::important
If ClearML Server is being reinstalled, clearing browser cookies for ClearML Server is recommended. For example, 
for Firefox, go to Developer Tools > Storage > Cookies, and for Chrome, go to Developer Tools > Application > Cookies,
and delete all cookies under the ClearML Server URL.
:::

## Launching

:::warning
By default, ClearML Server deploys as an open network. To restrict ClearML Server access, follow the instructions 
in the [Security](clearml_server_security.md) page.
:::

The minimum recommended amount of RAM is 8 GB. For example, a `t3.large` or `t3a.large` EC2 instance type would accommodate the recommended RAM size.

**To launch a ClearML Server AWS community AMI**, use one of the [ClearML Server AWS community AMIs](#clearml-server-aws-community-amis) 
and see:

* The AWS Knowledge Center page, [How do I launch an EC2 instance from a custom Amazon Machine Image (AMI)?](https://aws.amazon.com/premiumsupport/knowledge-center/launch-instance-custom-ami/)
* Detailed instructions in the AWS Documentation for [Launching an Instance Using the Launch Instance Wizard](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/launching-instance.html).

## Accessing ClearML Server

Once deployed, ClearML Server exposes the following services:

* Web server on `TCP port 8080`
* API server on `TCP port 8008`
* File Server on `TCP port 8081`

**To locate ClearML Server address:**

1. Go to AWS EC2 Console.
1. In the **Details** tab, **Public DNS (IPv4)** shows the ClearML Server address.

**To access ClearML Server WebApp (UI):**

* Direct browser to its web server URL: `http://<Server Address>:8080`

**To SSH into ClearML Server:**

* Log into the AWS AMI using the default username `ec2-user`. Control the SSH credentials from the AWS management console.

### Logging in to the WebApp (UI)

Enter any name to log in to the ClearML WebApp (UI). If needed, modify the default login behavior to match workflow policy, 
see [Configuring Web Login Authentication](clearml_server_config.md#web-login-authentication) 
on the "Configuring Your Own ClearML Server" page.

## Storage Configuration

The pre-built ClearML Server storage configuration is the following:

* MongoDB: `/opt/clearml/data/mongo_4/`
* Elasticsearch: `/opt/clearml/data/elastic_7/`
* File Server: `/opt/clearml/data/fileserver/`


## Backing Up and Restoring Data and Configuration

:::warning
Stop your server before backing up or restoring data and configuration
:::

:::note
If data is being moved between a **Trains Server** and a **ClearML Server** installation, make sure to use the correct paths 
for backup and restore (`/opt/trains` and `/opt/clearml` respectively).
:::

The commands in this section are examples for backing up and restoring data and configuration.

If data and configuration folders are in `/opt/clearml`, then archive all data into `~/clearml_backup_data.tgz`, and 
configuration into `~/clearml_backup_config.tgz`:

```bash
sudo tar czvf ~/clearml_backup_data.tgz -C /opt/clearml/data .
sudo tar czvf ~/clearml_backup_config.tgz -C /opt/clearml/config .
```

**If data and configuration need to be restored**:

1. Verify you have the backup files.
1. Replace any existing data with the backup data:

   ```bash
   sudo rm -fR /opt/clearml/data/* /opt/clearml/config/*
   sudo tar -xzf ~/clearml_backup_data.tgz -C /opt/clearml/data
   sudo tar -xzf ~/clearml_backup_config.tgz -C /opt/clearml/config
   ```
1. Grant access to the data:

   ```bash
   sudo chown -R 1000:1000 /opt/clearml
   ```
        

## ClearML Server AWS Community AMIs

The following section contains a list of AMI Image IDs per-region for the latest ClearML Server version.



### Latest Version

#### v2.2.0

* **af-south-1** : ami-03a3f6bba34d66afb
* **ap-east-1** : ami-05d186d5c2c532982
* **ap-east-2** : ami-01fe5d540e1c120e6
* **ap-northeast-1** : ami-0a7bba8094cf81ec7
* **ap-northeast-2** : ami-0226be74ac338cda9
* **ap-northeast-3** : ami-04d3125b373b1e7ef
* **ap-south-1** : ami-08b1bee6277ab9e58
* **ap-south-2** : ami-0708562cd28b5870a
* **ap-southeast-1** : ami-09421584e82293fab
* **ap-southeast-2** : ami-01d4b9c441af90717
* **ap-southeast-3** : ami-0230a71f80db95d4c
* **ap-southeast-4** : ami-0df70b18cf99cdd62
* **ap-southeast-5** : ami-067976784a8d1fb43
* **ap-southeast-7** : ami-0b5716576af7afaf9
* **ca-central-1** : ami-08e00243bb80b8b69
* **ca-west-1** : ami-07f5b0f0dbc25306b
* **eu-central-1** : ami-0b8c1eb540385a918
* **eu-central-2** : ami-08a33f45c4ac15f00
* **eu-north-1** : ami-065784bb8d0969f07
* **eu-south-1** : ami-010e01c581aff1fd2
* **eu-south-2** : ami-0719e8a3585d52d39
* **eu-west-1** : ami-01932e303a62efc60
* **eu-west-2** : ami-0b39c35368a2337ff
* **eu-west-3** : ami-06bffed9e67a60a10
* **il-central-1** : ami-004894aac5b5e533d
* **me-central-1** : ami-0a53818d3c5878508
* **me-south-1** : ami-0a67e56de30d09beb
* **mx-central-1** : ami-0b4a243b583269062
* **sa-east-1** : ami-0c8d28c530bfb1785
* **us-east-1** : ami-01307a001efc5e7ae
* **us-east-2** : ami-060bb2f035c07e7da
* **us-west-1** : ami-0e958c8108e045a52
* **us-west-2** : ami-034d31fa981c38537

## Next Step

To keep track of your experiments and/or data, the `clearml` package needs to communicate with your server. 
For instruction to connect the ClearML SDK to the server, see [ClearML Setup](../clearml_sdk/clearml_sdk_setup.md).
