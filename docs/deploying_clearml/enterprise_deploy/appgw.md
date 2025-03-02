---
title: AI Application Gateway
---

:::important Enterprise Feature
The AI Application Gateway is available under the ClearML Enterprise plan.
:::

Services running through a cluster orchestrator such as Kubernetes or cloud hyperscaler require meticulous configuration 
to make them available as these environments do not expose their networks to external users.

The ClearML AI Application Gateway facilitates setting up secure, authenticated access to jobs running on your compute 
nodes from external networks.

Using the AI Application Gateway, services are allocated externally accessible, SSL secure network routes which provide 
access in adherence to ClearML RBAC privileges. The AI Application Gateway supports HTTP/S as well as raw TCP routing.

The following ClearML UI applications make use of the AI Application Gateway to provide authenticated HTTPS access to 
their instances: 

* GPUaaS   
  * [JupyterLab](../../webapp/applications/apps_jupyter_lab.md)  
  * [VScode](../../webapp/applications/apps_vscode.md)  
  * [SSH Session](../../webapp/applications/apps_ssh_session.md)   
* UI Dev  
  * [Gradio launcher](../../webapp/applications/apps_gradio.md)  
  * [Streamlit launcher](../../webapp/applications/apps_streamlit.md)   
* Deploy  
  * [vLLM Deployment](../../webapp/applications/apps_model_deployment.md)  
  * [Embedding Model Deployment](../../webapp/applications/apps_embed_model_deployment.md)  
  * [Llama.cpp Model Deployment](../../webapp/applications/apps_llama_deployment.md)

The AI Application Gateway is provided through an additional component to the ClearML Server deployment: The ClearML Task Traffic Router.  
If your ClearML Deployment does not have the Task Traffic Router properly installed, these application instances may not be accessible. 

#### Installation 

The Task Traffic Router supports two deployment options:

* [Docker Compose](appgw_install_compose.md)  
* [Kubernetes](appgw_install_k8s.md)

The deployment configuration specifies the external and internal address and port mappings for routing requests.

