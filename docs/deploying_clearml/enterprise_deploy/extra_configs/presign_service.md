---
title: ClearML S3 Presign Service
---

:::info Enterprise Feature
The S3 presign service is available under the ClearML Enterprise plan.
:::

The ClearML Presign Service is a secure service that generates and redirects pre-signed storage URLs for authenticated 
users, enabling direct access to S3 data without exposing credentials.

When configured, the ClearML WebApp automatically redirects requests for matching storage URLs (like `s3://...`) to the 
Presign Service. The service:

* Authenticates the user with ClearML.
* Generates a temporary, secure (pre-signed) S3 URL.
* Redirects the user's browser to the URL for direct access.

This setup ensures secure access to S3-hosted data.

## Prerequisites

- A ClearML Enterprise Server is up and running.
- API credentials (`<ACCESS_KEY>` and `<SECRET_KEY>`) generated via 
  the ClearML UI (**Settings > Workspace > API Credentials > Create new credentials**). For more information, see [ClearML API Credentials](../../../webapp/settings/webapp_settings_profile.md#clearml-api-credentials).

  :::note
  Make sure these credentials belong to an admin user or a service account with admin privileges.
  :::
 
- The worker environment must be able to access the ClearML Server over the same network.
- Token to access `clearml-enterprise` Helm chart repo

## Installation

### Add the Helm Repo Locally

Add the ClearML Helm repository:
```bash
helm repo add clearml-enterprise https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages --username <HELM_REPO_TOKEN> --password <HELM_REPO_TOKEN>
```

Update the local repository:
```bash
helm repo update
```

### Prepare Configuration

Create a `presign-service.override.yaml` file (make sure to replace the placeholders):

```yaml
imageCredentials:
  password: "<CLEARML_DOCKERHUB_TOKEN>"
clearml:
  apiServerUrlReference: "<CLEARML_API_SERVER_URL>"
  apiKey: "<ACCESS_KEY>"
  apiSecret: "<SECRET_KEY>"
ingress:
  enabled: true
  hostName: "<PRESIGN_SERVICE_URL>"
```

### Deploy the Helm Chart

Install the `clearml-presign-service` Helm chart in the same namespace as the ClearML Enterprise server:

```bash
helm install -n clearml clearml-presign-service clearml-enterprise/clearml-presign-service -f presign-service.override.yaml
```

### Update ClearML Enterprise Server Configuration

Enable the ClearML Server to use the Presign Service by editing your `clearml-values.override.yaml` file. 
Add the following to the `apiserver.extraEnvs` section (make sure to replace `<PRESIGN_SERVICE_URL>`). 

```yaml
apiserver:
  extraEnvs:
    - name: CLEARML__SERVICES__SYSTEM__COMPANY__DEFAULT__SERVICES
      value: "[{\"type\":\"presign\",\"url\":\"https://<PRESIGN_SERVICE_URL>\",\"use_fallback\":\"false\",\"match_sets\":[{\"rules\":[{\"field\":\"\",\"obj_type\":\"\",\"regex\":\"^s3://\"}]}]}]"
```

Apply the changes with a Helm upgrade.

