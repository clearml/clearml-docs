---
title: NVCR Access
---

To allow ClearML Agents to access NVIDIA's container registry (`nvcr.io`), the machine’s Docker infrastructure must first be configured with valid NGC credentials.
This enables Agents to pull NVIDIA-provided containers, such as those used by the [NVIDIA NIM app](../webapp/applications/apps_nvidia_nim.md). The setup is 
required once per worker node.

Configure Docker access to the `nvcr` repository on [bare-metal/VM](#on-bare-metal--vm) or [Kubernetes](#on-kubernetes). 

## On Bare Metal / VM
   
Execute the following command where the agent that will execute the app instance will be running (replace the password with a valid NGC API key):

```
docker login nvcr.io --username '$oauthtoken' --password 'nvapi-**'
```
Password is provided with your `nvcr` account.

## On Kubernetes
  
To make `nvcr` available to agents running on Kubernetes:
* Create an `nvcr-registry` secret in the same namespace where the agent is running. Replace:
  * `<NAMESPACE>` with the namespace where your ClearML Agent is deployed
  * `<USERNAME>` with your NVIDIA registry username
  * `<PASSWORD>` with your valid NGC API key <br/><br/>
    
  ```
  kubectl create secret docker-registry nvcr-registry -n <NAMESPACE> \
    --docker-server=nvcr.io \
    --docker-username=<USERNAME> \
    --docker-password=<PASSWORD> \
    --docker-email=""
  ```
   
* Configure image pull secrets for the NVIDIA registry.
  In your Agent Helm values override, add:

  ```
  imageCredentials:
    extraImagePullSecrets:
      - name: nvcr-registry
  ```
