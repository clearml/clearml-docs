---
title: Kubernetes Deployment
---

:::important Enterprise Feature
The AI Application Gateway is available under the ClearML Enterprise plan.
:::

This guide details the installation of the ClearML AI App Gateway Router.
The AI App Gateway Router enables access to session-based applications like VSCode and Jupyter.
It acts as a proxy, discovering ClearML Tasks running within its namespace and configuring them for user access.

:::important 
The AI App Gateway Router must be installed in the same namespace as a dedicated ClearML Agent.
It can only discover ClearML Tasks within its own namespace.
:::


## Requirements

* Kubernetes cluster: `>= 1.21.0-0 < 1.32.0-0`  
* Helm installed and configured  
* Helm token to access `clearml` helm-chart repo  
* Credentials for `clearml` docker repo
* A valid ClearML Server installation

## Optional for HTTPS

* A valid DNS entry for the new TTR instance  
* A valid SSL certificate

## Helm

### Login

```
helm repo add clearml-enterprise \
https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages \
--username <GITHUB_TOKEN> \
--password <GITHUB_TOKEN>
```

Replace `<GITHUB_TOKEN>` with your valid GitHub token that has access to the ClearML Enterprise Helm charts repository.

### Prepare Values

Before installing the AI App Gateway Router, create a Helm override file:

```
imageCredentials:
  password: ""
clearml:
  apiServerKey: ""
  apiServerSecret: ""
  apiServerUrlReference: ""
  authCookieName: ""
  sslVerify: true
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

Edit it according to these guidelines:

* `imageCredentials.password`: ClearML DockerHub Access Token.
* `clearml.apiServerKey`: ClearML server API key.  
* `clearml.apiServerSecret`: ClearML server secret key.  
* `clearml.apiServerUrlReference`: ClearML API server URL usually starting with `https://api.`.  
* `clearml.authCookieName`: Cookie name used by the ClearML server to store the ClearML authentication cookie.
* `clearml.sslVerify`: Enable or disable SSL certificate validation on `apiserver` calls check.  
* `ingress.hostName`: Hostname of router used by the ingress controller to access it.  
* `tcpSession.routerAddress`: The external router address (can be an IP, hostname, or load balancer address) depending on your network setup. Ensure this address is accessible for TCP connections.
* `tcpSession.service.type`: Service type used to expose TCP functionality, default is `NodePort`.
* `tcpSession.portRange.start`: Start port for the TCP Session feature.  
* `tcpSession.portRange.end`: End port for the TCP Session feature.


The whole list of supported configuration is available with the command:

```
helm show readme allegroai-enterprise/clearml-enterprise-task-traffic-router
```

### Install

To install the TTR component via Helm use the following command:

```
helm upgrade --install \
<RELEASE_NAME> \
-n <WORKLOAD_NAMESPACE> \
allegroai-enterprise/clearml-enterprise-task-traffic-router \
--version <CHART_VERSION> \
-f override.yaml
```

Replace the placeholders with the following values:

* `<RELEASE_NAME>` - Unique name for the AI App Gateway Router within the namespace. This name will appear in the UI and be used for the redirection URL.
* `<WORKLOAD_NAMESPACE>` - Namespace that will be shared with a dedicated ClearML Agent.
* `<CHART_VERSION>` - Version recommended by the ClearML Support Team.