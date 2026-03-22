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
Stop your server before backing up or restoring data and configuration.
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

#### v2.4.0

* **af-south-1** : ami-068df71694c6e2a57
* **ap-east-1** : ami-0386dc8305161f9dc
* **ap-east-2** : ami-07ab60bd56e869fcd
* **ap-northeast-1** : ami-0dca6a76f7f0f537c
* **ap-northeast-2** : ami-071fe1b83a0d95e35
* **ap-northeast-3** : ami-0010718f3233b3f24
* **ap-south-1** : ami-03023393db1a30812
* **ap-south-2** : ami-0ff10f98f5da78891
* **ap-southeast-1** : ami-0a80b1d9cbb62bb05
* **ap-southeast-2** : ami-0e321ac44d1c227a7
* **ap-southeast-3** : ami-0c12916ca9c6463af
* **ap-southeast-4** : ami-0ea05a699219c1282
* **ap-southeast-5** : ami-0c92ad7709f425982
* **ap-southeast-6** : ami-029b72488d03cb51d
* **ap-southeast-7** : ami-055ec9c573a5796da
* **ca-central-1** : ami-022df3b49a616f1f3
* **ca-west-1** : ami-04cf544c3e4c470b8
* **eu-central-1** : ami-0aaefdf9e8b8ae137
* **eu-central-2** : ami-095fae5826e9bc3e9
* **eu-north-1** : ami-0863e657bd3f8e330
* **eu-south-1** : ami-006f6255e2209a70c
* **eu-south-2** : ami-0bc09a9106afa2807
* **eu-west-1** : ami-07f0a5d7c5f555d33
* **eu-west-2** : ami-0aae247b8876d3481
* **eu-west-3** : ami-0b3a3e3d3cb3dbc09
* **il-central-1** : ami-0ae2fede32d17c841
* **me-central-1** : ami-0c03f6b9aec7c74cc
* **me-south-1** : ami-0fde762bcd744b263
* **mx-central-1** : ami-094932609fbd2516a
* **sa-east-1** : ami-02467000443969fdd
* **us-east-1** : ami-06f1d4710a674b3d9
* **us-east-2** : ami-0d82549dc6be161af
* **us-west-1** : ami-0ed1379d7da71aa0b
* **us-west-2** : ami-0151c8dffe0da14d9

## Next Step

To keep track of your experiments and/or data, the `clearml` package needs to communicate with your server. 
For instruction to connect the ClearML SDK to the server, see [ClearML Setup](../clearml_sdk/clearml_sdk_setup.md).
