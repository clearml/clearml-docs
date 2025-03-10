---
title: Kubernetes Deployment
---

:::important Enterprise Feature
The Application Gateway is available under the ClearML Enterprise plan.
:::

This guide details the installation of the ClearML AI Application Gateway, specifically the ClearML Task Router Component.

## Requirements

* Kubernetes cluster: `>= 1.21.0-0 < 1.32.0-0`  
* Helm installed and configured  
* Helm token to access `allegroai` helm-chart repo  
* Credentials for `allegroai` docker repo  
* A valid ClearML Server installation

## Optional for HTTPS

* A valid DNS entry for the new TTR instance  
* A valid SSL certificate

## Helm

### Login

```
helm repo add allegroai-enterprise \
https://raw.githubusercontent.com/clearml/clearml-enterprise-helm-charts/gh-pages \
--username <GITHUB_TOKEN> \
--password <GITHUB_TOKEN>
```

### Prepare Values

Before installing the TTR create an helm-override files named `task-traffic-router.values-override.yaml`:

```
imageCredentials:
 password: "<DOCKERHUB_TOKEN>"
clearml:
 apiServerKey: ""
 apiServerSecret: ""
 apiServerUrlReference: "https://api."
 jwksKey: ""
 authCookieName: ""
ingress:
 enabled: true
 hostName: "task-router.dev"
tcpSession:
 routerAddress: ""
 portRange:
   start: 
   end:
```

Edit it accordingly to this guidelines:

* `clearml.apiServerUrlReference`: url usually starting with `https://api.`  
* `clearml.apiServerKey`: ClearML server api key  
* `clearml.apiServerSecret`: ClearML server secret key  
* `ingress.hostName`: url of router we configured previously for loadbalancer starting with `https://`  
* `clearml.sslVerify`: enable or disable SSL certificate validation on apiserver calls check  
* `clearml.authCookieName`: value from `value_prefix` key starting with `allegro_token` in `envoy.yaml` file in ClearML server installation.  
* `clearml.jwksKey`: value form `k` key in `jwks.json` file in ClearML server installation (see below)  
* `tcpSession.routerAddress`: router external address can be an IP or the host machine or a loadbalancer hostname, depends on the network configuration  
* `tcpSession.portRange.start`: start port for the TCP Session feature  
* `tcpSession.portRange.end`: end port port for the TCP Session feature

:::note How to find my jwkskey

The *JSON Web Key Set* (*JWKS*) is a set of keys containing the public keys used to verify any JSON Web Token (JWT).

```
kubectl -n clearml get secret clearml-conf \
-o jsonpath='{.data.secure_auth_token_secret}' \
| base64 -d && echo
```

:::


The whole list of supported configuration is available with the command:

```
helm show readme allegroai-enterprise/clearml-enterprise-task-traffic-router
```

### Install

To install the TTR component via Helm use the following command:

```
helm upgrade --install \
<RELEASE_NAME> \
-n <NAME_SPACE> \
allegroai-enterprise/clearml-enterprise-task-traffic-router \
--version <CURRENT CHART VERSION> \
-f task-traffic-router.values-override.yaml
```

