---
title: Embedding Model Deployment
---

:::important Enterprise Feature
The Embedding Model Deployment App is available under the ClearML Enterprise plan.
:::

The Embedding Model Deployment app enables users to quickly deploy embedding models as networking services over a secure
endpoint. This application supports various model configurations and customizations, addressing a range of embedding use
cases. The Embedding Model Deployment application serves your model on a machine of your choice. Once an app instance is
running, it serves your embedding model through a secure, publicly accessible network endpoint. 

The app supports multi-model hosting and Universal Memory technology, enabling inactive models to be offloaded to other
memory options to free GPU resources:

* CPU RAM – via `Automatic CPU Offloading` and configurable `Max CUDA Memory` limits.  
* Disk storage – via `Disk Swapping` (requires `Automatic CPU Offloading` to be disabled).

The app monitors endpoint activity and shuts down if the model remains inactive for a specified maximum idle time.

:::info AI Application Gateway
The Embedding Model Deployment app makes use of the App Gateway Router which implements a secure, authenticated 
network endpoint for the model.

If the ClearML AI application Gateway is not available, the model endpoint might not be accessible. 
For more information, see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

After starting an Embedding Model Deployment instance, you can view the following information in its dashboard:
* Status indicator
  * <img src="/docs/latest/icons/ico-embedding-model-active.svg" alt="Active instance" className="icon size-md space-sm" /> - App instance is running and is actively in use
  * <img src="/docs/latest/icons/ico-embedding-model-loading.svg" alt="Loading instance" className="icon size-md space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-embedding-model-idle.svg" alt="Idle instance" className="icon size-md space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-embedding-model-stopped.svg" alt="Stopped instance" className="icon size-md space-sm" /> - App instance is stopped
* Idle time - Time elapsed since last activity 
* Generate Token - Link to your workspace Settings page, where you can generate a token for accessing your deployed model in the `AI APPLICATION GATEWAY` section
* Current session ID
* Deployed models table:
  * Model name
  * Endpoint - The publicly accessible URL of the model endpoint. Active model endpoints are also listed in the 
    [Model Endpoints](../webapp_model_endpoints.md) table, which allows you to view and compare endpoint details and 
    monitor status over time
* Model access command line example
  * Select model the command should access
  * Prompt - Provide a prompt to send to the model
  * The `curl` command line to send your prompt to the selected model’s endpoint. Replace `YOUR_GENERATED_TOKEN` with a 
    valid token generated in the `AI APPLICATION GATEWAY` section of the [Settings](../settings/webapp_settings_profile.md#ai-application-gateway-tokens) 
    page.
* Total Number of Requests - Number of requests over time
* Tokens per Second - Number of tokens processed over time
* Latency - Request response time (ms) over time
* Endpoint resource monitoring metrics over time
  * CPU usage 
  * Network throughput 
  * Disk performance 
  * Memory performance 
  * GPU utilization 
  * GPU memory usage 
  * GPU temperature
* Console log - The console log shows the app instance's console output: setup progress, status changes, error messages, etc.

![Embedding Model Deployment app](../../img/apps_embedding_model_deployment.png#light-mode-only)
![Embedding Model Deployment app](../../img/apps_embedding_model_deployment_dark.png#dark-mode-only)

:::tip EMBEDDING CLEARML VISUALIZATION
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md). These visualizations 
are updated live as the app instance(s) updates. The Enterprise Plan supports embedding resources in 
external tools (e.g. Notion). Hover over the plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
to copy the embed code, and navigate to a report to paste the embed code.
:::

## Embedding Model Deployment Instance Configuration

When configuring a new Embedding Model Deployment instance, you can fill in the required parameters or reuse the 
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
* **Import Configuration** - Import an app instance configuration file. This will fill the configuration form with the 
values from the file, which can be modified before launching the app instance
* **Instance name** - Name for the Embedding Model Deployment instance. This will appear in the instance list
* **Service Project** - ClearML Project where your Embedding Model Deployment app instance will be stored
* **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the Embedding Model 
Deployment app instance task will be enqueued (make sure an agent is assigned to it)
* **AI Gateway Route** - Select an available, admin-preconfigured route to use as the service endpoint. If none is selected, an ephemeral endpoint will be created.
* **Model Configuration**
  * Model - A ClearML Model ID or a Hugging Face model name (e.g. `openai-community/gpt2`)
  * Revision - The specific Hugging Face version of the model you want to use. You can use a specific commit ID or a 
  branch like `refs/pr/2`
  * Tokenization Workers - Number of tokenizer workers used for payload tokenization, validation, and truncation. 
  Defaults to the number of CPU cores on the machine
  * Dtype - The data type enforced on the model
  * Pooling - Model pooling method. If `pooling` is not set, the pooling configuration will be parsed from the model 
  `1_Pooling/config.json` configuration. If `pooling` is set, it will override the model pooling configuration. Possible 
  values: 
    * `cls`: Use CLS token
    * `mean`: Apply Mean pooling 
    * `splade`: Apply SPLADE (Sparse Lexical and Expansion) pooling. This option is only available for `ForMaskedLM` 
    Transformer models
  * Max Concurrent Requests - The maximum number of concurrent requests for this instance. Having a low limit will deny 
  client requests instead of having them wait for too long. 
  * Max Batch Tokens - The total number of tokens allowed within a batch. If the `Max Batch Tokens` is 1000, you could 
  fit 10 queries of 100 tokens or a single query of 1000 tokens. Generally, this number should be as large as possible 
  until the model becomes compute bound. 
  * Max Batch Requests - Set the maximum number of individual requests that can be combined in a batch 
  * Max Client Batch Size - Set the maximum number of inputs a client can send in a single request 
  * Payload Limit  - Payload size limit in bytes. Default is 2MB
  * \+ Add item - Add another model endpoint. Each model will be accessible through the same base URL, with the model 
  name appended to the URL. 
* **General** 
  * Enable Debug Mode: Run deployment in debug mode  
  * Enable Automatic CPU Offloading: Enable multiple models to share GPUs by offloading idle models to CPU. If `Max CUDA Memory` 
  exceeds GPU capacity, this application will offload the surplus to the CPU RAM, virtually increasing the VRAM  
  * Enable Disk Swapping: Load multiple models on the same GPUs by offloading idle models to disk (requires 
  `Automatic CPU Offloading` to be disabled).  
  * Hugging Face Token: Token for accessing Hugging Face models that require authentication  
  * Log Level of the application logs
  * Max CUDA Memory (GiB): The maximum amount of CUDA memory identified by the system. Can exceed the actual hardware 
  memory. The surplus memory will be offloaded to the CPU memory. Only usable on amd64 machines.  
  * CUDA Memory Manager Minimum Threshold: Maximum size (Kb) of the allocated chunks that should not be offloaded to 
  CPU when using automatic CPU offloading. Defaults to `-1` when running on single GPU, and `66000` (64Mib) when running on multiple GPUs
* **Environment Variables** - Additional environment variable to set inside the container before launching the application
* **Advanced Options**
  * Idle Time Limit (Hours) - Maximum idle time after which the app instance will shut down
  * Last Action Report Interval (Seconds): Frequency at which last activity is reported. Prevents idle shutdown while still active.
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create a 
new instance with the same configuration

<div class="max-w-65">

![Embedding Model Deployment form](../../img/apps_embedding_model_deployment_form.png#light-mode-only)
![Embedding Model Deployment form](../../img/apps_embedding_model_deployment_form_dark.png#dark-mode-only)

</div>