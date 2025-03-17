---
title: Kubernetes
---

This guide provides step-by-step instructions for installing the ClearML Enterprise setup in a Kubernetes cluster.

## Prerequisites

* A Kubernetes cluster  
* An ingress controller (e.g. `nginx-ingress`) and the ability to create LoadBalancer services (e.g. MetalLB) if needed 
  to expose ClearML  
* Credentials for ClearML Enterprise GitHub Helm chart repository 
* Credentials for ClearML Enterprise DockerHub repository  
* URL for downloading the ClearML Enterprise applications configuration

## Control Plane Installation

The following steps cover installing the control plane (server and required charts) and will 
require some or all of the tokens/deliverables mentioned above.

### Requirements

* Add the ClearML Enterprise repository:

  ```
  helm repo add clearml-enterprise https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages --username <clearmlenterprise_GitHub_TOKEN> --password <clearmlenterprise_GitHub_TOKEN>
  ```

* Update the repository locally:

  ```
  helm repo update
  ```

### Install ClearML Enterprise Chart

#### Configuration 

The Helm Chart must be installed with an `overrides.yaml` overriding values as follows:

:::note
In the following configuration, replace `<BASE_DOMAIN>` with a valid domain 
that will have records pointing to the cluster’s ingress controller (see ingress details in the values below).
:::

```
imageCredentials:
  password: "<allegroaienterprise_DockerHub_TOKEN>"

clearml:
  cookieDomain: "<BASE_DOMAIN>"
  # Following are the default secret values. Replace them for improved security.
  apiserverKey: "GGS9F4M6XB2DXJ5AFT9F"
  apiserverSecret: "2oGujVFhPfaozhpuz2GzQfA5OyxmMsR3WVJpsCR5hrgHFs20PO"
  fileserverKey: "XXCRJ123CEE2KSQ068WO"
  fileserverSecret: "YIy8EVAC7QCT4FtgitxAQGyW7xRHDZ4jpYlTE7HKiscpORl1hG"
  secureAuthTokenSecret: "ymLh1ok5k5xNUQfS944Xdx9xjf0wueokqKM2dMZfHuH9ayItG2"
  testUserKey: "ENP39EQM4SLACGD5FXB7"
  testUserSecret: "lPcm0imbcBZ8mwgO7tpadutiS3gnJD05x9j7afwXPS35IKbpiQ"

apiserver:
  ingress:
    enabled: true
    hostName: "api.<BASE_DOMAIN>"
  service:
    type: ClusterIP
  extraEnvs:
    - name: CLEARML__services__organization__features__user_management_advanced
      value: "true"
    - name: CLEARML__services__auth__ui_features_per_role__user__show_datasets
      value: "false"
    - name: CLEARML__services__auth__ui_features_per_role__user__show_orchestration
      value: "false"
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
      value: "[\"users\", \"admins\", \"queue_admins\"]"
    - name: CLEARML__secure__credentials__supervisor__email
      value: "\"<SUPERVISOR_USER_EMAIL>\""
    - name: CLEARML__apiserver__company__unique_names
      value: "true"

fileserver:
  ingress:
    enabled: true
    hostName: "file.<BASE_DOMAIN>"
  service:
    type: ClusterIP

webserver:
  ingress:
    enabled: true
    hostName: "app.<BASE_DOMAIN>"
  service:
    type: ClusterIP

clearmlApplications:
  enabled: true
```

The credentials specified in `<SUPERVISOR_USER_KEY>` and `<SUPERVISOR_USER_SECRET>` can be used to login as the 
supervisor user from the ClearML Web UI accessible using the URL `app.<BASE_DOMAIN>`.

Note that the `<SUPERVISOR_USER_EMAIL>` value must be explicitly quoted. To do so, put `\"` around the quoted value. 
For example `"\"email@example.com\""`.

#### Additional Configuration Options
##### Fixed Users (Simple Login)

Enable static login with username and password in `overrides.yaml`.

This is an optional step in case SSO (Identity provider) configuration will not be performed.

```
apiserver:
  additionalConfigs:
    apiserver.conf: |
      auth {
        fixed_users {
          enabled: true
          pass_hashed: false
          users: [
            {
              username: "my_user"
              password: "my_password"
              name: "My User"
              admin: true
            },
          ]
        }
      }
```

##### SSO (Identity Provider)

The following examples (Auth0 and Keycloak) show how to configure an identity provider on the ClearML server.

Add the following values configuring `extraEnvs` for `apiserver` in the `clearml-enterprise` values `override.yaml` file.

Substitute all `<PLACEHOLDER>`s with the correct value for your configuration.

##### Auth0 Identity Provider 

```
apiserver:
  extraEnvs:
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
```

##### Keycloak Identity Provider

```
apiserver:
  extraEnvs:
    - name: CLEARML__secure__login__sso__oauth_client__keycloak__client_id
      value: "<KC_CLIENT_ID>"
    - name: CLEARML__secure__login__sso__oauth_client__keycloak__client_secret
      value: "<KC_SECRET_ID>"
    - name: CLEARML__services__login__sso__oauth_client__keycloak__base_url
      value: "<KC_URL>/realms/<REALM_NAME>/"
    - name: CLEARML__services__login__sso__oauth_client__keycloak__authorize_url
      value: "<KC_URL>/realms/<REALM_NAME>/protocol/openid-connect/auth"
    - name: CLEARML__services__login__sso__oauth_client__keycloak__access_token_url
      value: "<KC_URL>/realms/<REALM_NAME>/protocol/openid-connect/token"
    - name: CLEARML__services__login__sso__oauth_client__keycloak__idp_logout
      value: "true"

```

#### Installing the Chart

```
helm install -n clearml \
     clearml \
     clearml-enterprise/clearml-enterprise \
     --create-namespace \
     -f overrides.yaml
```

### Install ClearML Agent Chart

#### Configuration

To configure the agent you will need to choose a Redis password and use that when setting up Redis as well 
(see [Shared Redis installation](multi_tenant_k8s.md#shared-redis-installation)).

The Helm Chart must be installed with `overrides.yaml`:

```
imageCredentials:
  password: "<CLEARML_DOCKERHUB_TOKEN>"
clearml:
  agentk8sglueKey: "<ACCESS_KEY>"
  agentk8sglueSecret: "<SECRET_KEY>"
agentk8sglue:
  apiServerUrlReference: "https://api.<BASE_DOMAIN>"
  fileServerUrlReference: "https://files.<BASE_DOMAIN>"
  webServerUrlReference: "https://app.<BASE_DOMAIN>"
  defaultContainerImage: "python:3.9"
```

#### Installing the Chart

```
helm install -n <WORKLOAD_NAMESPACE> \
     clearml-agent \
     clearml-enterprise/clearml-enterprise-agent \
     --create-namespace \
     -f overrides.yaml
```

To create a queue by API:

```
curl $APISERVER_URL/queues.create \
-H "Content-Type: application/json" \
-H "X-Clearml-Impersonate-As:<USER_ID>" \
-u $APISERVER_KEY:$APISERVER_SECRET \
-d '{"name":"default"}'
```

## ClearML AI Application Gateway Installation

### Configuring Chart

`<APISERVER_TOKEN_SECRET>` should have the same value as `clearml.secureAuthTokenSecret` in the ClearML Enterprise Server overrides.

The Helm Chart must be installed with `overrides.yaml`:

```
imageCredentials:
  password: "<allegroaienterprise_DockerHub_TOKEN>"
clearml:
  apiServerKey: "<ACCESS_KEY>"
  apiServerSecret: "<SECRET_KEY>"
  apiServerUrlReference: "https://api.<BASE_DOMAIN>"
  jwksKey: "<APISERVER_TOKEN_SECRET>"
  authCookieName: "<CLEARML_COOKIE_NAME>"
ingress:
  enabled: true
  hostName: "ttr.<BASE_DOMAIN>"
tcpSession:
  routerAddress: "<NODE_IP OR EXTERNAL_NAME>"
  portRange:
    start: <START_PORT>
    end: <END_PORT>
```

Edit it according to these guidelines:

* **`clearml.apiServerUrlReference`:** URL usually starting with `https://api.`  
* **`clearml.apiServerKey`:** ClearML server API key  
* **`clearml.apiServerSecret`:** ClearML server secret key  
* **`ingress.hostName`:** URL of the router we configured previously for load balancer starting with `https://`  
* **`clearml.authCookieName`:** Value from `value_prefix` key starting with `allegro_token` in `envoy.yaml` file in ClearML server installation.  
* **`clearml.jwksKey`:** Value form `k` key in `jwks.json` file in ClearML  server installation.  
* **`tcpSession.routerAddress`**: Router's external address can be an IP the host machine or a load-balancer hostname, depending on the network configuration  
* **`tcpSession.portRange.start`**: Start port for the TCP Session feature  
* **`tcpSession.portRange.end`**: End port for the TCP Session feature

### Installing the Chart

```
helm install -n <WORKLOAD_NAMESPACE> \
     clearml-ttr \
     clearml-enterprise/clearml-enterprise-task-traffic-router \
     --create-namespace \
     -f overrides.yaml
```


## Applications Installation

To install the ClearML Applications on the newly installed ClearML Enterprise control-plane, download the applications 
package using the URL provided by the ClearML staff.


### Download and Extract

```
wget -O apps.zip "<ClearML enterprise applications configuration download url>"
unzip apps.zip
```

### Adjust Application Docker Images Location  (Air-Gapped Systems)

ClearML applications use pre-built docker images provided by ClearML on the ClearML DockerHub 
repository. If you are using an air-gapped system, these images must be available as part of your internal docker 
registry, and the correct docker images location must be specified before installing the applications.  

Use the following script to adjust the applications packages accordingly before installing the applications:

```
python convert_image_registry.py \
  --apps-dir /path/to/apps/ \
  --repo local_registry/clearml-apps
```

The script will change the application zip files to point to the new registry, and will output the list of containers 
that need to be copied to the local registry. For example:

```
make sure allegroai/clearml-apps:hpo-1.10.0-1062 was added to local_registry/clearml-apps
```

### Install Applications

Use the `upload_apps.py` script to upload the application packages to the ClearML server:

```
python upload_apps.py \
  --host $APISERVER_ADDRESS \
  --user $APISERVER_USER --password $APISERVER_PASSWORD \
  --dir apps -ml
```

## Configuring Shared Memory for Large Model Deployment

Deploying large models may fail due to shared memory size limitations. This issue commonly arises when the allocated 
`/dev/shm` space is insufficient.:

```
> 3d3e22c3066f:168:168 [0] misc/shmutils.cc:72 NCCL WARN Error: failed to extend /dev/shm/nccl-UbzKZ9 to 9637892 bytes
> 3d3e22c3066f:168:168 [0] misc/shmutils.cc:113 NCCL WARN Error while creating shared memory segment /dev/shm/nccl-UbzKZ9 (size 9637888)
> 3d3e22c3066f:168:168 [0] NCCL INFO transport/shm.cc:114 -> 2
> 3d3e22c3066f:168:168 [0] NCCL INFO transport.cc:33 -> 2
> 3d3e22c3066f:168:168 [0] NCCL INFO transport.cc:113 -> 2
> 3d3e22c3066f:168:168 [0] NCCL INFO init.cc:1263 -> 2
> 3d3e22c3066f:168:168 [0] NCCL INFO init.cc:1548 -> 2
> 3d3e22c3066f:168:168 [0] NCCL INFO init.cc:1799 -> 2
```

To configure a proper SHM size you can use the following configuration in the agent `overrides.yaml`.

Replace `<SIZE>` with the desired memory allocation in GiB, based on your model requirements.

This example configures a specific queue, but you can include this setting in the `basePodTemplate` if you need to 
apply it to all tasks.

```
agentk8sglue:  
  queues:
    GPUshm:
      templateOverrides:
        env:
          - name: VLLM_SKIP_P2P_CHECK
            value: "1"
        volumeMounts:
          - name: dshm
            mountPath: /dev/shm
        volumes:
          - name: dshm
            emptyDir:
              medium: Memory
              sizeLimit: <SIZE>Gi
```

