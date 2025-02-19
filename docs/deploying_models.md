---
title: Model Deployment
---

Model deployment is a critical step in the machine learning lifecycle, enabling trained models to be accessible for 
real-world applications. ClearML provides a comprehensive suite of tools for seamless model deployment, which supports
features including:
* Version control
* Automatic updates 
* Performance monitoring

ClearML's offerings optimize the deployment process 
while ensuring scalability and security. The solutions include: 
* **Model Deployment UI Applications** (available under the Enterprise Plan) - The UI applications simplify deploying models 
  as network services through secure endpoints, providing an interface for managing deployments--no code required. 
  See more information about the following applications: 
  * [vLLM Deployment](webapp/applications/apps_model_deployment.md) 
  * [Embedding Model Deployment](webapp/applications/apps_embed_model_deployment.md) 
  * [Llama.cpp Model Deployment](webapp/applications/apps_llama_deployment.md)
* **Command-line Interface** - `clearml-serving` is a CLI for model deployment and orchestration. 
  It supports integration with Kubernetes clusters or custom container-based 
  solutions, offering flexibility for diverse infrastructure setups. 
  For more information, see [ClearML Serving](clearml_serving/clearml_serving.md).

## Model Endpoint Monitoring 
All deployed models are displayed in a unified **Model Endpoints** list in the UI. This 
allows users to monitor endpoint activity and manage deployments from a single location.

For more information, see [Model Endpoints](webapp/webapp_model_endpoints.md).

![Model Endpoints](img/webapp_model_endpoints_monitor.png#light-mode-only)
![Model Endpoints](img/webapp_model_endpoints_monitor_dark.png#dark-mode-only)


