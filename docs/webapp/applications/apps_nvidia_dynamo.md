---
title: Nvidia Dynamo
---

:::important[Enterprise Feature]  
The Nvidia Dynamo App is available under the ClearML Enterprise plan.  
:::

The NVIDIA Dynamo application enables users to deploy and serve multiple LLM models simultaneously over a unified, 
load-balanced endpoint. Built on [NVIDIA's Dynamo](https://github.com/ai-dynamo/dynamo) serving framework, the 
application orchestrates a set of infrastructure services with one or more GPU-backed inference workers to provide 
scalable, multi-model inference serving. 

The application consists of the following components:

* ETCD service - Maintains a lightweight registry of all running models and replicas. Inference workers periodically report their status to this service  
* NATS service - Handles internal communication between the Dynamo Frontend and inference workers.   
* Dynamo Frontend - public-facing gateway for all incoming model requests. Requests are received through a static gateway route and are forwarded to the target inference worker through NATS.   
* Inference workers - GPU-backed workers that run individual models using a selected serving backend. Multiple worker configurations can be deployed simultaneously, allowing different models and serving engines to run within the same application instance. 

When a request is sent to the application endpoint, the Dynamo Frontend receives the request, routes it through the NATS messaging layer, and forwards it to the appropriate inference worker. Worker state and availability are tracked through ETCD. 

The application supports multiple inference backends, including vLLM, SGLang, and TensorRT-LLM. Each inference worker can be configured independently with its own model, serving engine, Docker image, and replica count.

When autoscaling is enabled, the application can automatically increase or decrease the number of inference worker replicas based on configurable CPU, GPU, RAM, VRAM, and disk I/O utilization thresholds. 

:::info[AI Application Gateway]
The Nvidia Dynamo app makes use of the App Gateway Router which implements a secure, authenticated network endpoint for 
the model.

If the ClearML AI Application Gateway is not available, the model endpoint might not be accessible. For more information, see
[AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

Once you start an NVIDIA Dynamo instance, you can view the following information in its dashboard:

* Status indicator  
  * <img src="/docs/latest/icons/ico-dynamo-active.svg" alt="Active server" className="icon size-lg space-sm" /> - App instance is running and is actively in use
  * <img src="/docs/latest/icons/ico-dynamo-loading.svg" alt="Loading server" className="icon size-lg space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-dynamo-idle.svg" alt="Idle server" className="icon size-lg space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-dynamo-stopped.svg" alt="Stopped server" className="icon size-lg space-sm" /> - App instance is stopped
* Idle time  - Time elapsed since last activity   
* Generate Token - Link to the `AI APPLICATION GATEWAY` section of the Settings page, where you can generate a token for authenticating requests to the deployed models  
* Service tasks - Task ID and console log links for each of the three core services:  
  * ETCD Task  
  * NATS Task  
  * Frontend Task  
* Workers - List of inference worker instances, labeled by serving engine and model (e.g., `vllm — Qwen/Qwen3-0.6B [1]`)  
* Command to connect to the deployed model  
  * Select model to generate a curl command for connecting to it  
  * Prompt - Provide a prompt to send to the model. This will be added to the curl command  
  * The generated curl command includes the model's endpoint and prompt. Replace `YOUR_GENERATED_TOKEN` with a valid 
    token generated in the `AI APPLICATION GATEWAY` section of the [Settings](../settings/webapp_settings_profile.md#ai-application-gateway-tokens) page.  
* Node Summary – Overview of all application nodes, including service nodes and inference worker nodes.  
* GPU Worker Status - Number of inference workers in each status category   
* Resource utilization plots over time:  
  * CPU Compute Utilization  
  * GPU Compute Utilization  
  * CPU Memory Utilization  
  * GPU Memory Utilization  
* Console Log – The console log shows the app instance's setup progress, status changes, error messages, etc.

:::tip[Embedding ClearML Visualization]  
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md) and other third-party 
platforms that support embedded content (e.g. Notion). These visualizations are updated live as the app instance(s) 
updates. Hover over the plot and click Embed code to copy the embed code, and navigate to a report to paste the embed 
code.  
:::

## Dynamo App Instance Configuration

When configuring a new Dynamo App instance, you can fill in the required parameters or reuse the 
configuration of a previously launched instance. 

Launch an app instance with the configuration of a previously launched instance using one of the following options:
* Cloning a previously launched app instance will open the instance launch form with the original instance's 
configuration prefilled.
* Importing an app configuration file. You can export the configuration of a previously launched instance as a JSON file 
when viewing its configuration.

The prefilled configuration form can be edited before launching the new app instance.

To configure a new app instance, click `Launch New` <img src="/docs/latest/icons/ico-add.svg" alt="Add new" className="icon size-md space-sm" /> 
to open the app's configuration form.


### Configuration Options

:::note
Administrators can [customize](../../deploying_clearml/enterprise_deploy/app_launch_form_custom.md) the launch form and modify field names and/or available options and defaults.

This section describes the default configuration provided by ClearML.  
:::

* **Import Configuration** - Import an app instance configuration file. This will fill the instance launch form with the values from the file, which can be modified before launching the app instance.  
* **Instance Name** - Name for the app instance. This will appear in the instance list. If not set, defaults to `NVIDIA Dynamo_<timestamp>`.  
* **Service Project - Access Control** - The ClearML project where the app instance is created. App instance network access is determined by project-level permissions (i.e. users with read access can access app endpoints).   
* **ETCD Service**  
  * **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) serviced by the ClearML Agent which will run the ETCD service container.   
  * **Docker Image** - Docker image used to run the ETCD service. Must include `bash` and Python. The `etcd` binary is downloaded at startup via the setup script.  
* **NATS Service**  
  * **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) serviced by the ClearML Agent which will run the NATS container.  
  * **Docker Image** - Docker image used to run the NATS service. Must include `bash` and Python. The `nats-server` binary is downloaded at startup via the setup script.  
* **Dynamo Frontend**  
  * **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) serviced by the ClearML Agent which will run the Dynamo Frontend container.  
  * **Docker Image** - Docker image used to run the Dynamo Frontend service. Must contain the Python `dynamo.frontend` module (e.g. `sglang-runtime` or `vllm-runtime`). The `dynamo-frontend` image is K8s-only and not compatible with this app.  
* **Inference Workers -** Configure the inference workers to deploy. Multiple worker configurations can be added to serve different models simultaneously.  
  * **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) serviced by the ClearML Agent which will run the inference worker. The agent must have GPU access and the NVIDIA Dynamo runtime image available.  
  * **Deployment Type** - Select inference backend to use (e.g. vLLM, SGLang, TensorRT-LLM).   
  * **Model** - HuggingFace model name  (e.g. `Qwen/Qwen3-0.6B`). The model will be downloaded to `/models` inside the worker container.  
  * **Docker Image** - Docker image for the inference worker. Leave blank to use the default image for the selected deployment type.  
  * **Replicas** - Number of identical worker instances to deploy. All replicas share the same queue and configuration.  
  * **HuggingFace Token** - Token for accessing HuggingFace models that require authentication  
  * **Add item** - Add additional inference worker   
* **Autoscaling**  
  * **Enable Autoscaling** - Automatically scale worker replicas up or down based on resource utilization thresholds.   
  * **Minimum Workers** - Minimum number of worker instances to maintain at all times.  
  * **Maximum Workers** - Maximum number of worker instances allowed when scaling up.  
  * **Scale-Up Step** - Number of worker instances to add per scale-up event  
  * **Scale-Up Timeout (seconds)** - Time resource utilization must remain above the configured scale-up thresholds before additional worker replicas are added.  
  * **Scale-Down Timeout (seconds)** - Time resource utilization must remain below the configured scale-down thresholds before worker replicas are removed.  
  * **CPU Max %** - CPU utilization upper threshold to trigger scale-up.  
  * **CPU Min %** - CPU utilization lower threshold to trigger scale-down.  
  * **RAM Max %** - RAM utilization upper threshold to trigger scale-up.  
  * **RAM Min %** - RAM utilization lower threshold to trigger scale-down.  
  * **GPU Max %** - GPU utilization upper threshold to trigger scale-up.  
  * **GPU Min %** - GPU utilization lower threshold to trigger scale-down.  
  * **VRAM Max %** - VRAM utilization upper threshold to trigger scale-up.  
  * **VRAM Min %** - VRAM utilization lower threshold to trigger scale-down.  
  * **Disk Read Max (MB/s)** - Disk read speed upper threshold to trigger scale-up.  
  * **Disk Read Min (MB/s)** - Disk read speed lower threshold to trigger scale-down.  
  * **Disk Write Max (MB/s)** - Disk write speed upper threshold to trigger scale-up.  
  * **Disk Write Min (MB/s)** - Disk write speed lower threshold to trigger scale-down.  
* **Idle Options**  
  * **Idle Time Limit (Hours)** - Max idle time before shutdown. 'None' means no shutdown.  
  * **Last Action Report Interval (Seconds)** - Frequency at which last activity is reported. Prevents idle shutdown while still active.  
* **Export Configuration** - Export the current configuration as a JSON file for later reuse.

