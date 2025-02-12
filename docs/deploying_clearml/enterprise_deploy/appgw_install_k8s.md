---
title: Kubernetes Installation
---

Use Kubernetes to deploy the Task Traffic Router. 

### Requirements

* Kubernetes cluster: `>= 1.21.0-0` `< 1.32.0-0`  
* Helm installed and configured  
* Helm token to access ClearML helm-chart repo  
* Credentials for ClearML Docker repo  
* Valid ClearML Server installation

**Optional for HTTPS:**

* Valid DNS entry for the new Task Router instance  
* Valid SSL certificate

## Helm Configuration

1. Add the `allegroai-enterprise` Helm repository:

   ```  
   helm repo add allegroai-enterprise \  
   https://raw.githubusercontent.com/allegroai/clearml-enterprise-helm-charts/gh-pages \  
   --username <GITHUB_TOKEN>  \
   --password <GITHUB_TOKEN>  
   ```  
 
1. Create a `task-traffic-router.values-override.yaml` file:  
   
   ```  
   imageCredentials:  
     password: "${dockerhub_token}"  
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
   Edit the file according to these guidelines:  
   * `clearml.apiServerUrlReference`: URL starting with `https://api`.  
   * `clearml.apiServerKey`: ClearML Server API key  
   * `clearml.apiServerSecret`: ClearML Server API secret   
   * `ingress.hostName`:  A Unique URL users will use to access the router, starting with `https://`  
   * `clearml.sslVerify`: Whether to enable SSL certificate validation when the router is communicating with the ClearML 
   Server  
   * `clearml.authCookieName`: The cookie used by the ClearML server to store the ClearML authentication token. This 
   can usually be found in the `value_prefix` key starting with `allegro_token` in the `envoy.yaml` file in the ClearML 
   server installation (`/opt/allegro/config/envoy/envoy.yaml`) (see [JWKS Key](#JWKS_KEY))  
   * `clearml.jwksKey`: Value from `k` key in `jwks.json` file in ClearML Server installation (see [JWKS Key](#JWKS_KEY)).  
   * `tcpSession.routerAddress`: The network address users will use for TCP connections to the router: This can be an IP address or hostname (for the machine or a load balancer configured in front of it).  
   * `tcpSession.portRange.start` and `tcpSession.portRange.end`: These ports define the range of ports available for TCP connections to the router.

   For a complete list of supported configurations:  
   ```  
   helm show readme allegroai-enterprise/clearml-task-traffic-router  
   ```

3. Install the task traffic router component via Helm:

   ```  
   helm upgrade --install \  
   <RELEASE_NAME> \  
   -n <NAME_SPACE> \  
   allegroai-enterprise/clearml-task-traffic-router \  
   --version <CURRENT CHART VERSION> \  
   -f task-traffic-router.values-override.yaml  
   ```

## JWKS Key

The **JSON Web Key Set** (JWKS) is a set of keys containing the public keys used to verify any JSON Web Token (JWT).

For the Kubernetes installation, use the following command to retrieve the **JWKS key**:

```
kubectl \-n clearml get secret clearml-conf \
\-o jsonpath='{.data.secure\_auth\_token\_secret}' \
| base64 \-d && echo
```
