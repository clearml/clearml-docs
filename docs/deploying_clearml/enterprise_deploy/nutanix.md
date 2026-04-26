---
title: Deploying ClearML in Nutanix Kubernetes Platform (NKP)
---

This guide outlines how to deploy the ClearML control plane within the Nutanix Enterprise Cloud environment and 
integrate it with Nutanix object storage for efficient experiment tracking and artifact management. The process includes 
the following steps:
1. Deploy the ClearML control plane on a Kubernetes cluster 
1. Set up your Nutanix storage 
1. Configure ClearML to access your Nutanix storage 

## ClearML Control Plane Setup

To deploy the ClearML control plane on Nutanix:
1. **Provision Kubernetes Cluster**: Set up a Kubernetes cluster within your Nutanix environment.
1. **Install ClearML Platform**: Deploy the ClearML control plane components onto the provisioned Kubernetes cluster 
using Helm. This includes configuring the ClearML servers, execution agents, and application gateway

For detailed instructions on installing ClearML on a Kubernetes cluster, see [Kubernetes deployment](k8s.md). 

Once the ClearML control plane is running, the next step is to configure dedicated Nutanix object storage for storing 
experiment artifacts and outputs.

## Set Up Nutanix Storage

To leverage Nutanix object storage with ClearML, you need to create and configure an S3-compatible storage bucket. See 
detailed instructions in the [Nutanix documentation](https://portal.nutanix.com/page/documents/details?targetId=Objects-v5_1:top-create-configure-buckets-t.html).

Next, configure the access credentials to this bucket in ClearML to enable storage access for storing workload outputs. 

## Configure ClearML Access to Nutanix Storage

To have ClearML make use of the dedicated Nutanix S3 bucket, specify the following parameters:
* [Bucket location (Output URL)](#configure-storage-destination)
* [Access credentials](#configure-access-credentials)

### Configure Storage Destination

To set the storage destination for all task outputs, set the `sdk.development.default_output_uri` configuration value in 
any of the following:
* The [`clearml.conf`](../../configs/clearml_conf.md) in your workload environment. 
* A [configuration vault](../../webapp/settings/webapp_settings_profile.md#configuration-vault) 

For either option, specify the storage location using the following format: `s3://host_addr:port/bucket`. 
**Note that port specification is required** for non-AWS S3 endpoint access. The configuration should look something like 
the following:

```
sdk {
    development {
      default_output_uri: "s3.nutanix.acme.com:443/clearml-experiments"
       } 
    }
}
```

:::note[Configuration Vaults]
Configuration can be applied by users in their personal configuration vault, or centrally by an administrator through an 
[admin vault](../../webapp/settings/webapp_settings_admin_vaults.md).
::: 

A specific task can override the global setting by explicitly specifying a storage location in the following ways:
* **During Task Initialization**: When initializing a task using [`Task.init()`](../../references/sdk/task.md#taskinit), 
  set the `output_uri` parameter:

  ```
  task = Task.init(
      project_name='ChatBot',
      task_name='ChatBot training',
      output_uri='s3://host_addr:port/bucket'
  )
  ```

* **Using the UI**: You can set the output URI of tasks in `draft` status in the ClearML UI. For more details, see [Tuning Tasks](../../webapp/webapp_exp_tuning.md).

### Configure Access Credentials
Configure the access credentials to your Nutanix S3 bucket in either the workload environment clearml.conf file or in a 
[Configuration Vault](../../webapp/settings/webapp_settings_profile.md#configuration-vault).

The configuration for both options should look something like the following:

:::important
Port specification is mandatory whenever you specify non-AWS S3 endpoint access. Use the following URI format: `s3://<hostname>:<port>/<bucket-name>/path`.
::: 

```
sdk {
  aws {
    s3 {
      # default, used for any bucket not specified below
      key: ""
      secret: ""
      region: ""
    
      credentials: [
        {
          # This will apply to all buckets in this host (unless key/value is specifically provided for a given bucket)
         host: "s3.nutanix.acme.com:443"
         key: "NUTANIX_ACCESS_KEY"
         secret: "NUTANIX_SECRET_KEY"
         secure: true
         verify: true 
                    
         }
       ]
     } 
   }
}
```

