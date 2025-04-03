---
title: Multi-Tenant Service on Kubernetes 
---

This guide provides step-by-step instructions for installing a ClearML multi-tenant service on a Kubernetes cluster.

It covers the installation and configuration steps necessary to set up ClearML in a cloud environment, including 
enabling specific features and setting up necessary components.

## Prerequisites

* A Kubernetes cluster  
* Credentials for the ClearML Enterprise Helm chart repository  
* Credentials for the ClearML Enterprise DockerHub repository  
* Credentials for the ClearML billing DockerHub repository  
* URL for downloading the ClearML Enterprise applications configuration  
* ClearML Billing server Helm chart

## Setting up ClearML Helm Repository

You need to add the ClearML Enterprise Helm repository to your local Helm setup. This repository contains the Helm 
charts required for deploying the ClearML Server and its components.

To add the ClearML Enterprise repository using the following command. Replace `<TOKEN>` with the private tokens sent to 
you by ClearML:

```
helm repo add allegroai-enterprise <https://raw.githubusercontent.com/allegroai/clearml-enterprise-helm-charts/gh-pages> --username <TOKEN> --password <TOKEN>
```

## Enabling Dynamic MIG GPUs

Allocating GPU fractions dynamically make use of the NVIDIA GPU operator.

1. Add the NVIDIA Helm repository:

   ```
   helm repo add nvidia <https://nvidia.github.io/gpu-operator>
   helm repo update
   ```

2. Install the NVIDIA GPU operator with the following configuration:

   ```
   helm install -n gpu-operator \\
     gpu-operator \\
     nvidia/gpu-operator \\
     --create-namespace \\
     --set migManager.enabled=false \\
     --set mig.strategy=mixed
   ```

## Install CDMO Chart

The ClearML Dynamic MIG Operator (CDMO) enables running AI workloads on k8s with optimized hardware utilization and 
workload performance by facilitating MIG GPUs partitioning.

1. Prepare the `overrides.yaml` file so it will contain the following content. Replace `<allegroaienterprise_DockerHub_TOKEN>` 
   with the private token provided by ClearML:

   ```
   imageCredentials:
     password: "<allegroaienterprise_DockerHub_TOKEN>"
   ```

2. Install the CDMO chart:

   ```
   helm install -n cdmo-operator \\
        cdmo \\
        allegroai-enterprise/clearml-dynamic-mig-operator \\
        --create-namespace \\
        -f overrides.yaml
   ```

### Enable MIG support

1. Enable dynamic MIG support on your cluster by running the following command on **all nodes used for training** (run 
   for **each GPU** ID in your cluster):

   ```
   nvidia-smi -i <gpu_id> -mig 1
   ```

   This command can be issued from inside the `nvidia-device-plugin-daemonset` pod on the related node.

   If the result of the previous command indicates that a node reboot is necessary, perform the reboot.

2. After enabling MIG support, label the MIG GPU nodes accordingly. This labeling helps in identifying nodes configured 
   with MIG support for resource management and scheduling:

   ```
   kubectl label nodes <node-name> "cdmo.clear.ml/gpu-partitioning=mig"
   ```

## Install ClearML Chart

Install the ClearML chart with the required configuration:

1. Prepare the `overrides.yaml` file and input the following content. Make sure to replace `<BASE_DOMAIN>` and `<SSO_*>` 
   with a valid domain that will have records pointing to the ingress controller accordingly.   
   The credentials specified in `<SUPERVISOR_USER_KEY>` and `<SUPERVISOR_USER_SECRET>` can be used to log in as the 
   supervisor user in the web UI.

   Note that the `<SUPERVISOR_USER_EMAIL>` value must be explicitly quoted. To do so, put `\\"` around the quoted value. 
   For example `"\\"email@example.com\\””`.

   ```
   imageCredentials:
     password: "<allegroaienterprise_DockerHub_TOKEN>"
   clearml:
     cookieDomain: "<BASE_DOMAIN>"
   apiserver:
     image:
       tag: "3.21.6-1443"
     ingress:
       enabled: true
       hostName: "api.<BASE_DOMAIN>"
     service:
       type: ClusterIP
     extraEnvs:
       - name: CLEARML__billing__enabled:
         value: "true"
       - name: CLEARML__HOSTS__KAFKA__BILLING__HOST
         value: "[clearml-billing-kafka.clearml-billing:9092]"
       - name: CLEARML__HOSTS__REDIS__BILLING__HOST
         value: clearml-billing-redis-master.clearml-billing
       - name: CLEARML__HOSTS__REDIS__BILLING__DB
         value: "2"
       - name: CLEARML__SECURE__KAFKA__BILLING__security_protocol
         value: SASL_PLAINTEXT
       - name: CLEARML__SECURE__KAFKA__BILLING__sasl_mechanism
         value: SCRAM-SHA-512
       - name: CLEARML__SECURE__KAFKA__BILLING__sasl_plain_username
         value: billing
       - name: CLEARML__SECURE__KAFKA__BILLING__sasl_plain_password
         value: "jdhfKmsd1"
       - name: CLEARML__secure__login__sso__oauth_client__auth0__client_id
         value: "<SSO_CLIENT_ID>"
       - name: CLEARML__secure__login__sso__oauth_client__auth0__client_secret
         value: "<SSO_CLIENT_SECRET>"
       - name: CLEARML__services__login__sso__oauth_client__auth0__base_url
         value: "<SSO_CLIENT_URL>"
       - name: CLEARML__services__login__sso__oauth_client__auth0__authorize_url
         value: "<SSO_CLIENT_AUTHORIZE_URL>"
       - name: CLEARML__services__login__sso__oauth_client__auth0__access_token_url
         value: "<SSO_CLIENT_ACCESS_TOKEN_URL>"
       - name: CLEARML__services__login__sso__oauth_client__auth0__audience
         value: "<SSO_CLIENT_AUDIENCE>"
       - name: CLEARML__services__organization__features__user_management_advanced
         value: "true"
       - name: CLEARML__services__auth__ui_features_per_role__user__show_datasets
         value: "false"
       - name: CLEARML__services__auth__ui_features_per_role__user__show_orchestration
         value: "false"
       - name: CLEARML__services__applications__max_running_apps_per_company
         value: "3"
       - name: CLEARML__services__auth__default_groups__users__features
         value: "[\\"applications\\"]"
       - name: CLEARML__services__auth__default_groups__admins__features
         value: "[\\"config_vault\\", \\"experiments\\", \\"queues\\", \\"show_projects\\", \\"resource_dashboard\\", \\"user_management\\", \\"user_management_advanced\\", \\"app_management\\", \\"sso_management\\", \\"service_users\\", \\"resource_policy\\"]"
           - name: CLEARML__services__workers__resource_usages__supervisor_company
         value: "d1bd92a3b039400cbafc60a7a5b1e52b" # Default company
       - name: CLEARML__secure__credentials__supervisor__role
         value: "system"
       - name: CLEARML__secure__credentials__supervisor__allow_login
         value: "true"
       - name: CLEARML__secure__credentials__supervisor__user_key
         value: "<SUPERVISOR_USER_KEY>"
       - name: CLEARML__secure__credentials__supervisor__user_secret
         value: "<SUPERVISOR_USER_SECRET>"
       - name: CLEARML__secure__credentials__supervisor__sec_groups
         value: "[\\"users\\", \\"admins\\", \\"queue_admins\\"]"
       - name: CLEARML__secure__credentials__supervisor__email
         value: "\\"<SUPERVISOR_USER_EMAIL>\\""
       - name: CLEARML__apiserver__company__unique_names
         value: "true"
   fileserver:
     ingress:
       enabled: true
       hostName: "file.<BASE_DOMAIN>"
     service:
       type: ClusterIP
   webserver:
     image:
       tag: "3.21.3-1657"
     ingress:
       enabled: true
       hostName: "app.<BASE_DOMAIN>"
     service:
       type: ClusterIP
   clearmlApplications:
     enabled: true
   ```

2. Install ClearML:

   ```
   helm install -n clearml \\
        clearml \\
        allegroai-enterprise/clearml-enterprise \\
        --create-namespace \\
        -f overrides.yaml
   ```

## Shared Redis installation

Set up a shared Redis instance that multiple components of your ClearML deployment can use:

1. lf not there already, add Bitnami repository:

   ```
   helm repo add bitnami <https://charts.bitnami.com/bitnami>
   ```

2. Prepare the `overrides.yaml` with the following content:

   ```
   auth:
     password: "sdkWoq23"
   ```

3. Install Redis:

   ```
   helm install -n redis-shared \\
        redis \\
        bitnami/redis \\
        --create-namespace \\
        --version=17.8.3 \\
        -f overrides.yaml
   ```

## Install Billing Chart

The billing chart is not available as part of the ClearML private Helm repo. `clearml-billing-1.1.0.tgz` is directly 
provided by the ClearML team.

1. Prepare `values.override.yaml` - Create the file with the following content, replacing `<billing_DockerHub_TOKEN>` 
  with the appropriate value:

   ```
   imageCredentials:
     username: dockerhubcustpocbillingaccess
     password: "<billing_DockerHub_TOKEN>"
   ```

1. Install the billing chart:

   ```
   helm install -n clearml-billing \\
        clearml-billing \\
        clearml-billing-1.0.0.tgz \\
        --create-namespace \\
        -f overrides.yaml
   ```

## Namespace Isolation using Network Policies

For enhanced security, isolate namespaces using the following NetworkPolicies:

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: clearml
spec:
  podSelector: {}
  policyTypes:
   - Ingress
  ingress:
    - from:
      - podSelector: {}
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-clearml-ingress
  namespace: clearml
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: clearml-clearml-enterprise
  policyTypes:
    - Ingress
  ingress:
    - from:
      - ipBlock:
          cidr: 0.0.0.0/0
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-clearml-ingress
  namespace: clearml-billing
spec:
  podSelector: {}
  policyTypes:
    - Ingress
  ingress:
  - from:
    - podSelector: {}
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: clearml
```

## Application Installation

To install ClearML GUI applications: 

1. Get the apps to install and the installation script by downloading and extracting the archive provided by ClearML

   ```
   wget -O apps.zip "<ClearML enterprise applications configuration download url>"
   unzip apps.zip
   ```

2. Install the apps:

   ```
   python upload_apps.py \\ --host $APISERVER_ADDRESS \\ --user $APISERVER_USER --password $APISERVER_PASSWORD \\ --dir apps -ml
   ```

## Tenant Configuration

Create tenants and corresponding admin users, and set up an SSO domain whitelist for secure access. To configure tenants, 
follow these steps (all requests must be authenticated by root or admin). Note that placeholders like `<PLACEHOLDER>`
must be substituted with valid domain names or values from responses. 

1. Define the following variables:

   ```
   APISERVER_URL="https://api.<BASE_DOMAIN>"
   APISERVER_KEY="<APISERVER_KEY>"
   APISERVER_SECRET="<APISERVER_SECRET>"
   ```

2. Create a **Tenant** (company):

   ```
   curl $APISERVER_URL/system.create_company \\
   -H "Content-Type: application/json" \\
   -u $APISERVER_KEY:$APISERVER_SECRET \\
   -d '{"name":"<TENANT_NAME>"}'
   ```

 	This returns the new Company ID (`<COMPANY_ID>`). If needed, you can list all companies with the following command:

   ```
   curl -u $APISERVER_KEY:$APISERVER_SECRET $APISERVER_URL/system.get_companies
   ```

3. Create an **Admin User**:

   ```
   curl $APISERVER_URL/auth.create_user \\
   -H "Content-Type: application/json" \\
   -u $APISERVER_KEY:$APISERVER_SECRET \\
   -d '{"name":"<ADMIN_USER_NAME>","company":"<COMPANY_ID>","email":"<ADMIN_USER_EMAIL>","role":"admin"}'
   ```

   This returns the new User ID (`<USER_ID>`).

4. Generate **Credentials** for the new Admin User:

   ```
   curl $APISERVER_URL/auth.create_credentials \\
   -H "Content-Type: application/json" \\
   -H "X-Clearml-Impersonate-As: <USER_ID>" \\
   -u $APISERVER_KEY:$APISERVER_SECRET
   ```

   This returns a set of key and secret credentials associated with the new Admin User.

5. Create an SSO Domain **Whitelist**. The `<USERS_EMAIL_DOMAIN>` is the email domain setup for users to access through SSO.

   ```
   curl $APISERVER_URL/login.set_domains \\
   -H "Content-Type: application/json" \\
   -H "X-Clearml-Act-As: <USER_ID>" \\
   -u $APISERVER_KEY:$APISERVER_SECRET \\
   -d '{"domains":["<USERS_EMAIL_DOMAIN>"]}'
   ```

### Install ClearML Agent Chart

To install the ClearML Agent Chart, follow these steps: 

1. Prepare the `overrides.yaml` file with the following content. Make sure to replace placeholders like 
   `<allegroaienterprise_DockerHub_TOKEN>`, `<BASE_DOMAIN>`, and `<TENANT_NAMESPACE>` with the appropriate values: 

   ```
   imageCredentials:
     password: "<allegroaienterprise_DockerHub_TOKEN>"
   clearml:
     agentk8sglueKey: "-" # TODO --> Generate credentials from API in the new tenant
     agentk8sglueSecret: "-" # TODO --> Generate credentials from API in the new tenant
   agentk8sglue:
     extraEnvs:
       - name: CLEARML_K8S_SUPPORT_SUSPENSION
         value: "1"
       - name: CLEARML_K8S_PORTS_MODE_ON_REQUEST_ONLY
         value: "1"
       - name: CLEARML_AGENT_REDIS_HOST
         value: "redis-master.redis-shared"
       - name: CLEARML_AGENT_REDIS_PORT
         value: "6379"
       - name: CLEARML_AGENT_REDIS_DB
         value: "0"
       - name: CLEARML_AGENT_REDIS_PASSWORD
         value: "sdkWoq23"
     image:
       tag: 1.24-1.8.1rc99-159
     monitoredResources:
       maxResources: 3
       minResourcesFieldName: "metadata|labels|required-resources"
       maxResourcesFieldName: "metadata|labels|required-resources"
     apiServerUrlReference: "https://api.<BASE_DOMAIN>"
     fileServerUrlReference: "https://file.<BASE_DOMAIN>"
     webServerUrlReference: "https://app.<BASE_DOMAIN>"
     defaultContainerImage: "python:3.9"
     debugMode: true
     createQueues: true
     queues:
       default:
         templateOverrides:
           labels:
             required-resources: "0.5"
             billing-monitored: "true"
         queueSettings:
           maxPods: 10
       gpu-fraction-1_00:
         templateOverrides:
           labels:
             required-resources: "1"
             billing-monitored: "true"
           resources:
             limits:
               nvidia.com/mig-7g.40gb: 1
               clear.ml/fraction-1: "1"
         queueSettings:
           maxPods: 10
       gpu-fraction-0_50:
         templateOverrides:
           labels:
             required-resources: "0.5"
             billing-monitored: "true"
           resources:
             limits:
               nvidia.com/mig-3g.20gb: 1
               clear.ml/fraction-1: "0.5"
         queueSettings:
           maxPods: 10
       gpu-fraction-0_25:
         templateOverrides:
           labels:
             required-resources: "0.25"
             billing-monitored: "true"
           resources:
             limits:
               nvidia.com/mig-2g.10gb: 1
               clear.ml/fraction-1: "0.25"
         queueSettings:
           maxPods: 10
   sessions:
     portModeEnabled: false  # set to true when using TCP ports mode
     agentID: "<TENANT_NAMESPACE>"
     externalIP: 0.0.0.0  # IP of one of the workers
     startingPort: 31010  # be careful to not overlap other tenants (startingPort + maxServices)
     maxServices: 10
   ```

2. Install the ClearML Agent Chart in the specified tenant namespace:

   ```
   helm install -n <TENANT_NAMESPACE> \\
        clearml-agent \\
        allegroai-enterprise/clearml-enterprise-agent \\
        --create-namespace \\
        -f overrides.yaml
   ```

3. Create a queue via the API:

   ```
   curl $APISERVER_URL/queues.create \\
   -H "Content-Type: application/json" \\
   -H "X-Clearml-Impersonate-As: 75557e2ab172405bbe153705e91d1782" \\
   -u $APISERVER_KEY:$APISERVER_SECRET \\
   -d '{"name":"default"}'
   ```

### Tenant Namespace Isolation with NetworkPolicies

To ensure network isolation for each tenant, you need to create a `NetworkPolicy` in the tenant namespace. This way 
the entire namespace/tenant will not accept any connection from other namespaces. 

Create a `NetworkPolicy` in the tenant namespace with the following configuration:

   ```
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: default-deny-ingress
   spec:
     podSelector: {}
     policyTypes:
       - Ingress
     ingress:
       - from:
         - podSelector: {}
   ```

### Install the App Gateway Router Chart

Install the App Gateway Router in your Kubernetes cluster, allowing it to manage and route tasks:

1. Prepare the `overrides.yaml` file with the following content:

   ```
   imageCredentials:
     password: "<clearmlenterprise_DockerHub_TOKEN>"
   clearml:
     apiServerUrlReference: "<http://clearml-enterprise-apiserver.clearml:8008>"
     apiserverKey: "<TENANT_KEY>"
     apiserverSecret: "<TENANT_SECRET>"
   ingress:
     enabled: true
     hostName: "<unique url in same domain as apiserver/webserver>"
   ```

2. Install App Gateway Router in the specified tenant namespace:

   ```
   helm install -n <TENANT_NAMESPACE> \\
        clearml-ttr \\
        clearml-enterprise/clearml-task-traffic-router \\
        --create-namespace \\
        -f overrides.yaml
   ```

## Configuring Options per Tenant

### Override Options When Creating a New Tenant

When creating a new tenant company, you can specify several tenant options. These include:

* `features` - Add features to a company  
* `exclude_features` - Exclude features from a company.  
* `allowed_users` - Set the maximum number of users for a company.

#### Example: Create a New Tenant with a Specific Feature Set

```
curl $APISERVER_URL/system.create_company \
-H "Content-Type: application/json" \
-u $APISERVER_KEY:$APISERVER_SECRET \
-d '{"name":"<TENANT_NAME>", "defaults": { "allowed_users": "10", "features": ["experiments"], "exclude_features": ["app_management", "applications", "user_management"] }}'
```

**Note**: make sure to replace the `<TENANT_NAME>` placeholder.

### Limit Features for all Users

This Helm Chart value in the `overrides.yaml` will have priority over all tenants, and will limit the features 
available to any user in the system. This means that even if the feature is enabled for the tenant, if it's not in this 
list, the user will not see it.

Example: all users will only have the `applications` feature enabled.

```
apiserver:
  extraEnvs:
    - name: CLEARML__services__auth__default_groups__users__features
      value: "[\"applications\"]"
```

**Available Features**:

* `applications` - Viewing and running applications  
* `data_management` - Working with hyper-datasets and dataviews  
* `experiments` - Viewing experiment table and launching experiments  
* `queues` - Viewing the queues screen  
* `queue_management` - Creating and deleting queues   
* `pipelines` - Viewing/managing pipelines in the system  
* `reports` - Viewing and managing reports in the system  
* `show_dashboard` - Show the dashboard screen  
* `show_projects` - Show the projects menu option  
* `resource_dashboard` - Display the resource dashboard in the orchestration page


## Configuring Groups

Groups in ClearML are used to manage user permissions and control access to specific features within the platform. 
The following section explains the different types of groups and how to configure them, with a focus on configuration-based, 
cross-tenant groups.

### Types of Groups

ClearML utilizes several types of groups:
* **Built-in Groups** - These groups exist by default in every ClearML installation:
  * **`users`**: All registered users automatically belong to this group. It typically defines the baseline set of 
  permissions and features available to everyone.  
  * **`admins`**: Users in this group have administrative privileges.  
  * **`queue_admins`**: Users in this group have specific permissions to manage execution queues.
* **Tenant-Specific Groups (UI)** - Additional groups can be created specific to a tenant (organization workspace) 
  directly through the ClearML Web UI (under **Settings > Users & Groups**). Users can be assigned to these groups via 
  the UI. These groups are managed *within* a specific tenant. For more information, see [Users & Groups](../../webapp/settings/webapp_settings_users.md).
* **Cross-Tenant Groups (Configuration)** - These groups are defined centrally in the ClearML configuration files 
  (e.g., Helm chart values, docker-compose environment variables). They offer several advantages:
  * **Cross-Tenant Definition:** Defined once in the configuration, applicable across the deployment.  
  * **Fine-Grained Feature Control:** Allows precise assignment of specific ClearML features to groups.  
  * **Automation:** Suitable for infrastructure-as-code and automated deployment setups.



### Configuring Cross-Tenant Groups

To define a cross-tenant group, you need to set specific configuration variables. These are typically set as environment 
variables for the relevant ClearML services (like `apiserver`). The naming convention follows this
pattern: `CLEARML__services__auth__default_groups__<GroupName>__<Property>`.

Replace `<GroupName>` with the desired name for your group (e.g., `my_group_name`, `Data_Scientists`, `MLOps_Engineers`).

#### Configuration Variables

For each group you define in the configuration, you need to specify the following properties:

* **`id`**: A unique identifier for the group. This **must** be a standard UUID (Universally Unique Identifier). You can 
 generate one using various online tools or libraries.  
    
  * Variable Name: `CLEARML__services__auth__default_groups__<GroupName>__id`  
  * Example Value: `"abcd-1234-abcd-1234"`

* **`name`**: The display name of the group. This should match the `<GroupName>` used in the variable path.  
    
  * Variable Name: `CLEARML__services__auth__default_groups__<GroupName>__name`  
  * Example Value: `"My Group Name"`

* **`features`**: A JSON-formatted list of strings, where each string is a feature name to be enabled for this group. See 
  [Available Features](#available-features) for a list of valid feature names. Note that the features must be defined 
  for the tenant or for the entire server in order to affect the group. By default, all the features of the tenant are 
  available to all users.  
    
  * Variable Name: `CLEARML__services__auth__default_groups__<GroupName>__features`  
  * Example Value: `'["applications", "experiments", "pipelines", "reports", "show_dashboard", "show_projects"]'` (Note 
  the single quotes wrapping the JSON string if setting via YAML/environment variables).

* **`assignable`**: A boolean (`"true"` or `"false"`) indicating whether administrators can add users to this group via 
  the ClearML Web UI. If `false`, group membership is managed externally or implicitly. Configuration-defined groups 
  often have this set to `false`.  
    
  * Variable Name: `CLEARML__services__auth__default_groups__<GroupName>__assignable`  
  * Example Value: `"false"`

* **`system`**: A boolean flag. This should **always be set to `"false"`** for custom-defined groups.  
    
  * Variable Name: `CLEARML__services__auth__default_groups__<GroupName>__system`  
  * Example Value: `"false"`

#### Example Configuration

The following example demonstrates how you would define a group named `my_group_name` with a specific set of features 
that cannot be assigned via the UI:

```
# Example configuration snippet (e.g., in Helm values.yaml or docker-compose.yml environment section)

# Unique group id for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__id
  value: "abcd-1234-abcd-1234" # Replace with a newly generated UUID

# Group name for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__name
  value: "My Group Name"

# List of features for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__features
  value: '["applications", "experiments", "queues", "pipelines", "reports", "show_dashboard","show_projects"]'

# Prevent assignment via UI for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__assignable
  value: "false"

# Always false for custom groups
- name: CLEARML__services__auth__default_groups__my_group_name__system
  value: "false"
```

### Available Features

The following features can be assigned to groups via the `features` configuration variable:

| Feature Name | Description | Notes |
| :---- | :---- | :---- |
| `user_management` | Allows viewing company users and groups, and editing group memberships. | Only effective if the group is `assignable`. |
| `user_management_advanced` | Allows direct creation of users (bypassing invites) by admins and system users. | Often requires enabling at the organization level too. |
| `permissions` | Enables editing of Role-Based Access Control (RBAC) rules. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `applications` | Allows users to work with ClearML Applications (viewing, running). | Excludes management operations (upload/delete). |
| `app_management` | Allows application management operations: upload, delete, enable, disable. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `experiments` | Allows working with experiments. | *Deprecated/Not Used.* All users have access regardless of this flag. |
| `queues` | Allows working with queues. | *Deprecated/Not Used.* All users have access regardless of this flag. |
| `queue_management` | Allows create, update, and delete operations on queues. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `data_management` | Controls access to Hyper-Datasets. | Actual access might also depend on `apiserver.services.excluded`. |
| `config_vault` | Enables the configuration vaults feature. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `pipelines` | Enables access to Pipelines (building and running). | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `reports` | Enables access to Reports. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `resource_dashboard` | Enables access to the compute resource dashboard feature. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `sso_management` | Enables the SSO (Single Sign-On) configuration wizard. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `service_users` | Enables support for creating and managing service users (API keys). | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `resource_policy` | Enables the resource policy feature. | May default to a trial feature if not explicitly enabled. |
| `model_serving` | Enables access to the model serving endpoints feature. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_dashboard` | Makes the "Dashboard" menu item visible in the UI sidebar. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_model_view` | Makes the "Models" menu item visible in the UI sidebar. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_projects` | Makes the "Projects" menu item visible in the UI sidebar. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_orchestration` | Makes the "Orchestration" menu item visible in the UI sidebar. | Available from apiserver version 3.25 |
| `show_datasets` | Makes the "Datasets" menu item visible in the UI sidebar. | Available from apiserver version 3.25 |

### Feature Assignment Strategy

#### Combining Features

If a user belongs to multiple groups (e.g., the default `users` group and a custom `my_group_name` group), their 
effective feature set is the **union** (combination) of all features from all groups they belong to.

#### Configuring the Default 'users' Group

Because all users belong to the `users` group, and features are combined, it's crucial to configure the `users` group 
appropriately. You generally have two options:

1. **Minimum Shared Features:** Assign only the absolute minimum set of features that *every single user* should have to 
   the `users` group.  
2. **Empty Feature Set:** Assign an empty list (`[]`) to the `users` group's features. This means users only get features 
  explicitly granted by other groups they are members of. This is often the cleanest approach when using multiple custom groups.

**Example: Disabling all features by default for the `users` group:**

```
- name: CLEARML__services__auth__default_groups__users__features
  value: '[]'

```

:::note
You typically don't need to define the id, name, assignable, or system properties for built-in groups like users unless 
you need to override default behavior, but you do configure their features.
:::


### Setting Server-Level or Tenant-level Features

Features must be enabled for the entire server or for the tenant in order to allow setting it for specific groups. 
Setting server wide feature is done using a different configuration pattern: `CLEARML__services__organization__features__<FeatureName>`.

Setting one of these variables to `"true"` enables the feature globally.

**Example: Enabling `user_management_advanced` for the entire organization:**

```
- name: CLEARML__services__organization__features__user_management_advanced
  value: "true"
```

To enable a feature for a specific tenant, use the following API call:

```
curl $APISERVER_URL/system.update_company_settings \                                                  
 -H "Content-Type: application/json" \   
 -u $APISERVER_KEY:$APISERVER_SECRET \
 -d '{                      
   "company": "<company_id>",
   "features": ["sso_management", "user_management_advanced", ...]
}'
```

By default, all users have access to all features, but this can be changed by setting specific features set per group as described above.

### Example: Defining Full Features for Admins

While the `admins` group has inherent administrative privileges, you might want to explicitly ensure they have access to 
*all* configurable features defined via the `features` list, especially if you've restricted the default `users` group 
significantly. You might also need to enable certain features organization-wide.

```
# Enable advanced user management for the whole organization
- name: CLEARML__services__organization__features__user_management_advanced
  value: "true"

# (Optional but good practice) Explicitly assign all features to the built-in admins group
- name: CLEARML__services__auth__default_groups__admins__features
  value: '["user_management", "user_management_advanced", "permissions", "applications", "app_management", "queues", "queue_management", "data_management", "config_vault", "pipelines", "reports", "resource_dashboard", "sso_management", "service_users", "resource_policy", "model_serving", "show_dashboard", "show_model_view", "show_projects"]' # List all relevant features

# You might still want to define other custom groups with fewer features...
# - name: CLEARML__services__auth__default_groups__my_group_name__id
#   value: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" # Replace with a newly generated UUID
# - name: CLEARML__services__auth__default_groups__my_group_name__name
#   value: "my_group_name"
# - name: CLEARML__services__auth__default_groups__my_group_name__features
#   value: '["some_feature", "another_feature"]'
# - name: CLEARML__services__auth__default_groups__my_group_name__assignable
#   value: "false"
# - name: CLEARML__services__auth__default_groups__my_group_name__system
#   value: "false"
```

By combining configuration-defined groups, careful management of the default users group features, and organization-level 
settings, you can create a flexible and secure permission model tailored to your ClearML deployment. Remember to 
restart the relevant ClearML services after applying configuration changes.  
