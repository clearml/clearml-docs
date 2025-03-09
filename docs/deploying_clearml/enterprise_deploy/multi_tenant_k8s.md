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
   For example `"\\"email@example.com\\””`

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

2. Install ClearML

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

2. Create a *Tenant* (company):

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

3. Create an *Admin User*:

   ```
   curl $APISERVER_URL/auth.create_user \\
   -H "Content-Type: application/json" \\
   -u $APISERVER_KEY:$APISERVER_SECRET \\
   -d '{"name":"<ADMIN_USER_NAME>","company":"<COMPANY_ID>","email":"<ADMIN_USER_EMAIL>","role":"admin"}'
   ```

   This returns the new User ID (`<USER_ID>`).

4. Generate *Credentials* for the new Admin User:

   ```
   curl $APISERVER_URL/auth.create_credentials \\
   -H "Content-Type: application/json" \\
   -H "X-Clearml-Impersonate-As: <USER_ID>" \\
   -u $APISERVER_KEY:$APISERVER_SECRET
   ```

   This returns a set of key and secret credentials associated with the new Admin User.

5. Create an SSO Domain *Whitelist*. The `<USERS_EMAIL_DOMAIN>` is the email domain setup for users to access through SSO.

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

### Install Task Traffic Router Chart

Install the [Task Traffic Router](appgw.md) in your Kubernetes cluster, allowing it to manage and route tasks:

1. Prepare the `overrides.yaml` file with the following content:

   ```
   imageCredentials:
     password: "<allegroaienterprise_DockerHub_TOKEN>"
   clearml:
     apiServerUrlReference: "<http://clearml-enterprise-apiserver.clearml:8008>"
     apiserverKey: "<TENANT_KEY>"
     apiserverSecret: "<TENANT_SECRET>"
     jwksKey: "<JWKS_KEY>"
   ingress:
     enabled: true
     hostName: "<unique url in same domain as apiserver/webserver>"
   ```

2. Install Task Traffic Router in the specified tenant namespace:

   ```
   helm install -n <TENANT_NAMESPACE> \\
        clearml-ttr \\
        allegroai-enterprise/clearml-task-traffic-router \\
        --create-namespace \\
        -f overrides.yaml
   ```

