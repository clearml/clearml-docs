---
title: Kubernetes Deployment
---

:::important Enterprise Feature
The Application Gateway is available under the ClearML Enterprise plan.
:::

This guide details the installation of the ClearML App Gateway.
The App Gateway enables access to your AI workload applications (e.g. remote IDEs like VSCode and Jupyter, model API interface, etc.).
It acts as a proxy, identifying ClearML Tasks running within its [K8s namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) 
and making them available for network access.

:::important 
The App Gateway must be installed in the same K8s namespace as a dedicated ClearML Agent.
It can only configure access for ClearML Tasks within its own namespace.
:::


## Requirements

* Kubernetes cluster: `>= 1.21.0-0 < 1.32.0-0`  
* Helm installed and configured  
* Helm token to access `clearml` helm-chart repo  
* Credentials for `clearml` docker repo
* A valid ClearML Server installation

## Optional for HTTPS

* A valid DNS entry for the new App Gateway instance  
* A valid SSL certificate

## Helm

### Login

```bash
helm repo add clearml-enterprise https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages --username <GITHUB_TOKEN> --password <GITHUB_TOKEN>
```

Replace `<GITHUB_TOKEN>` with your valid GitHub token that has access to the ClearML Enterprise Helm charts repository.

### Prepare Values

Before installing the App Gateway, create a Helm override `clearml-app-gateway-values.override.yaml` file:

```yaml
imageCredentials:
  password: ""
clearml:
  apiKey: ""
  apiSecret: ""
  apiServerUrlReference: ""
  authCookieName: ""
ingress:
  enabled: true
  hostName: ""
tcpSession:
  routerAddress: ""
  service:
    type: LoadBalancer
  portRange:
    start: 
    end:
```

**Configuration options:**

* `imageCredentials.password`: ClearML DockerHub Access Token.
* `clearml.apiKey` and `clearml.apiSecret`: [API credentials](../../webapp/settings/webapp_settings_profile.md#clearml-api-credentials) created in the ClearML web UI by an Admin user or Service 
  Account with admin privileges. Make sure to label these credentials clearly, so that they will not be revoked by mistake.
* `clearml.apiServerUrlReference`: ClearML API server URL starting with `https://api.`.  
* `clearml.authCookieName`: Cookie used by the ClearML server to store the ClearML authentication cookie.
* `ingress.hostName`: Hostname of App Gateway used by the ingress controller to access it.  
* `tcpSession.routerAddress`: The external App Gateway address (can be an IP, hostname, or load balancer address) depending on your network setup. Ensure this address is accessible for TCP connections.
* `tcpSession.service.type`: Service type used to expose TCP functionality, default is `NodePort`.
* `tcpSession.portRange.start`: Start port for the TCP Session feature.  
* `tcpSession.portRange.end`: End port for the TCP Session feature.


The full list of supported configuration is available with the command:

```bash
helm show readme clearml-enterprise/clearml-enterprise-app-gateway
```

### Install

To install the App Gateway component via Helm use the following command:

```bash
helm upgrade --install <RELEASE_NAME> -n <WORKLOAD_NAMESPACE> clearml-enterprise/clearml-enterprise-app-gateway --version <CHART_VERSION> -f clearml-app-gateway-values.override.yaml
```

Replace the placeholders with the following values:

* `<RELEASE_NAME>` - Unique name for the App Gateway within the K8s namespace. This is a required parameter in 
  Helm, which identifies a specific installation of the chart. The release name also defines the App Gateway's name and 
  appears in the UI within AI workload application URLs (e.g. Remote IDE URLs). This can be customized to support multiple installations within the same 
  namespace by assigning different release names.
* `<WORKLOAD_NAMESPACE>` - [Kubernetes Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) 
  where workloads will be executed. This namespace must be shared between a dedicated ClearML Agent and an App 
  Gateway. The agent is responsible for monitoring its assigned task queues and spawning workloads within this 
  namespace. The App Gateway monitors the same namespace for AI workloads (e.g. remote IDE applications). The App Gateway has a 
  namespace-limited scope, meaning it can only detect and manage tasks within its 
  assigned namespace.
* `<CHART_VERSION>` - Version recommended by the ClearML Support Team.

## Monitoring and Testing the Gateway

Once your gateway is deployed, you can monitor its status, view routed tasks, and run connectivity tests in 
ClearML WebApp, under **Settings > Application Gateway**.

![App Gateway Test](../../img/settings_app_gateway_test.png#light-mode-only)
![App Gateway Test](../../img/settings_app_gateway_test_dark.png#dark-mode-only)