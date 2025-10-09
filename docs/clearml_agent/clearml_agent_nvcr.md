---
title: NVCR Access
---

To allow ClearML Agents to access NVIDIA's container registry (`nvcr.io`), they must first be authenticated with valid NGC credentials.
This enables Agents to pull NVIDIA-provided containers, such as those used by the [NVIDIA NIM app](../webapp/applications/apps_nvidia_nim.md).

Configure `nvcr` access on [bare-metal/VM](#on-bare-metal--vm) or [Kubernetes](#on-kubernetes). 

## On Bare Metal / VM
   
Execute the following command on the agent that will run the app instance (replace the password with a valid NGC API key):

```
docker login nvcr.io --username '$oauthtoken' --password 'nvapi-**'
```
Password is provided with your NVCR account.

Note: The login is required only once per worker node, not every time you run the app.

## On Kubernetes
  
If you are running ClearML Agents on Kubernetes:
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
