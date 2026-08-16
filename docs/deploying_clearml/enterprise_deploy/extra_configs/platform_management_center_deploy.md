---
title: Platform Management Center
---

:::important
The Platform Management Center is available under the ClearML Enterprise plan.
:::

This guide describes how to deploy the [Platform Management Center](../../../webapp/platform_management_center.md) on 
Kubernetes.

This procedure assumes you have already set up the [ClearML control plane](../../../deploying_clearml/enterprise_deploy/k8s.md). 


## Step 1: Add Dedicated Control Plane Access Credentials 

Configure the ClearML Server with credentials that the platform management center will use for secure access. 
If `openssl` is available, you can use the following command to generate suitable key and secret:
```
openssl rand -hex 16
```

Add the following environment variables to your ClearML Enterprise server overrides file (`clearml-values.override.yaml`):

```yaml
apiserver:
  extraEnvs:
    - name: CLEARML__secure__credentials__platform_management__user_key
      value: "<PLATFORM_MANAGEMENT_USER_KEY>"

    - name: CLEARML__secure__credentials__platform_management__user_secret
      value: "<PLATFORM_MANAGEMENT_USER_SECRET>"
```

Then apply the new configuration:

```
helm upgrade -n clearml clearml-enterprise \
  oci://docker.io/clearml/clearml-enterprise \
  -f clearml-values.override.yaml
```

## Step 2: Platform Management Center Setup Configuration
The Platform Management Center needs to:
1. Connect to the ClearML API server
2. Authenticate administrators using it ([SSO or fixed users](../../../user_management/identity_providers.md))

Create an overrides file, for example: 
```
clearml-enterprise-platform-management.override.yaml.
```

### Configure Container Repository Access

Add the following configuration to the overrides file: 
```
global:
  imageCredentials:
    password: "<CLEARML_DOCKERHUB_TOKEN>"
```
Where `<CLEARML_DOCKERHUB_TOKEN>` is the token provided by ClearML for its container repository.

### Configure ClearML Control Plane Connection Parameters

Add the following configuration to the overrides file: 

```
clearml:
  apiServerUrlReference: "<CLEARML_APISERVER_URL>"
  apiKey: "<PLATFORM_MANAGEMENT_USER_KEY>"
  apiSecret: "<PLATFORM_MANAGEMENT_USER_SECRET>"
```
Where
* `<CLEARML_APISERVER_URL>` is the URL for the ClearML control plane API server 
* `<PLATFORM_MANAGEMENT_USER_KEY>` and `<PLATFORM_MANAGEMENT_USER_SECRET>` are the values created in Step 1

### Configure Admin Authentication
To configure how administrators log in to the Platform Management Center, fill in the appropriate identity provider 
information in the overrides file.

For complete information on identity provider options, see the [SSO Setup Guide](../../../user_management/identity_providers.md).


#### Example: OAuth

```
platformManagement:
  extraEnvs:
    - name: CLEARML__secure__login__sso__oauth_client__auth0__client_id
      value: "<AUTH0_AUTH_CLIENT_ID>"
    - name: CLEARML__secure__login__sso__oauth_client__auth0__client_secret
      value: "<AUTH0_AUTH_CLIENT_SECRET>"
    - name: CLEARML__services__login__sso__oauth_client__auth0__base_url
      value: "<AUTH0_TENANT_BASE_URL>"
    - name: CLEARML__services__login__sso__oauth_client__auth0__authorize_url
      value: "<AUTH0_TENANT_AUTHORIZE_URL>"
    - name: CLEARML__services__login__sso__oauth_client__auth0__access_token_url
      value: "<AUTH0_TENANT_ACCESS_TOKEN_URL>"
    - name: CLEARML__services__login__sso__oauth_client__auth0__audience
      value: "<AUTH0_TENANT_AUDIENCE_URL>"

    # Optional: restrict access by email or domain
    - name: CLEARML__services__login__email_filters__allowed
      value: ["example.com", "my-domain.ai"]
```

#### Example: Fixed Users
You can enable fixed users instead of an external identity provider:
```
platformManagement:
  extraEnvs:
    - name: CLEARML__platform_management__auth__fixed_users__enabled
      value: "true"
    - name: CLEARML__platform_management__auth__fixed_users__users
      value: "[{\"username\":\"<USERNAME_PLACEHOLDER>\",\"password\":\"<PASSWORD_PLACEHOLDER>\",\"name\":\"<USER_NAME_PLACEHOLDER>\"}]"
```

## Step 3: Install the Platform Management Center

Install the `clearml-enterprise-platform-management` Helm chart in the same namespace as the ClearML control plane:

```
helm upgrade -i clearml-enterprise-platform-management oci://docker.io/clearml/clearml-enterprise-platform-management -n clearml -f clearml-enterprise-platform-management.override.yaml
```

:::note
This installs the Platform Management Center service and webserver, but does not expose it externally.
:::

## Step 4: Accessing the Platform Management Center UI

By default, the UI is only accessible from inside the cluster using `kubectl port-forward`.

If external access is required, you can expose the webserver using an Ingress resource in your overrides file. For example:
```
platformManagementWebserver:
  ingress:
    enabled: true
    ingressClassName: ""
    annotations: {}
    hostName: "<HOSTNAME_PLACEHOLDER>"
    tlsSecretName: "<TLS_SECRETNAME>"
```
