---
title: Llama.cpp Model Deployment 
---

:::important Enterprise Feature
The llama.cpp Model Deployment App is available under the ClearML Enterprise plan.
:::

The llama.cpp Model Deployment app enables users to quickly deploy LLMs in GGUF format using [`llama.cpp`](https://github.com/ggerganov/llama.cpp). 
The llama.cpp Model Deployment application serves your model on a machine of your choice. Once an app instance is 
running, it serves your model through a secure, publicly accessible network endpoint. 

The app supports multi-model hosting and Universal Memory technology, enabling inactive models to be offloaded to other
memory options to free GPU resources:

* CPU RAM – via `Automatic CPU Offloading` and configurable `Max CUDA Memory` limits.  
* Disk storage – via `Disk Swapping` (requires `Automatic CPU Offloading` to be disabled).

The app monitors endpoint activity and shuts down if the model remains inactive over a specified maximum idle time.
:::important AI Application Gateway
The llama.cpp Model Deployment app makes use of the App Gateway Router which implements a secure, authenticated 
network endpoint for the model. 

If the ClearML AI Application Gateway is not available, the model endpoint might not be accessible.
For more information, see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

After starting a llama.cpp Model Deployment instance, you can view the following information in its dashboard:
* Status indicator
  * <img src="/docs/latest/icons/ico-llama-active.svg" alt="Active server" className="icon size-lg space-sm" /> - App instance is running and is actively in use
  * <img src="/docs/latest/icons/ico-llama-loading.svg" alt="Loading server" className="icon size-lg space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-llama-idle.svg" alt="Idle server" className="icon size-lg space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-llama-stopped.svg" alt="Stopped server" className="icon size-lg space-sm" /> - App instance is stopped
* Idle time - Time elapsed since last activity
* Generate Token - Link to your workspace Settings page, where you can generate a token for accessing your deployed model 
in the `AI APPLICATION GATEWAY` section  
* Deployed models table:  
  * Model name  
  * Endpoint - The publicly accessible URL of the model endpoint. Active model endpoints are also listed in the 
  [Model Endpoints](https://clear.ml/docs/latest/docs/webapp/webapp_model_endpoints) table, which allows you to view and 
  compare endpoint details and monitor their status over time  
* Model access command line example  
  * Select model the command should access  
  *  Prompt - Provide a prompt to send to the model.  
  * The `curl` command line to send your prompt to the selected model’s endpoint. Replace `YOUR_GENERATED_TOKEN` with a 
  valid token generated in the `AI APPLICATION GATEWAY` section of the [Settings](http://settings) page.
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

![llama deployment dashboard](../../img/apps_llama_dashboard.png#light-mode-only)
![llama deployment dashboard](../../img/apps_llama_dashboard_dark.png#dark-mode-only)

:::tip EMBEDDING CLEARML VISUALIZATION
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md) and other third-party platforms that support embedded content
(e.g. Notion). These visualizations are updated live as the app instance(s) updates. Hover over the plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
to copy the embed code, and navigate to a report to paste the embed code.
:::

### Llama.cpp Model Deployment Instance Configuration

When configuring a new llama.cpp Model Deployment instance, you can fill in the required parameters or reuse the 
configuration of a previously launched instance.

Launch an app instance with the configuration of a previously launched instance using one of the following options:
* Cloning a previously launched app instance will open the instance launch form with the original instance's configuration prefilled.
* Importing an app configuration file. You can export the configuration of a previously launched instance as a JSON file when viewing its configuration.

The prefilled configuration form can be edited before launching the new app instance.

To configure a new app instance, click `Launch New` <img src="/docs/latest/icons/ico-add.svg" alt="Add new" className="icon size-md space-sm" /> 
to open the app's configuration form.

## Configuration Options

:::note
Administrators can [customize](../../deploying_clearml/enterprise_deploy/app_launch_form_custom.md) the launch form and 
modify field names and/or available options and defaults. 

This section describes the default configuration provided by ClearML.
:::

* **Import Configuration**: Import an app instance configuration file. This will fill the configuration form with the 
values from the file, which can be modified before launching the app instance
* **Instance name**: Name for the Llama.cpp Model Deployment instance. This will appear in the instance list
* **Service Project (Access Control)**: The ClearML project where the app instance is created. Access is determined by 
  project-level permissions (i.e. users with read access can use the app instance).
* **Queue**: The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the 
  llama.cpp Model Deployment app instance task will be enqueued. Make sure an agent is assigned to that queue. 

  :::tip Multi-GPU inference
  To run multi-GPU inference, ensure the queue's pod specification (from the base template and/or `templateOverrides`) defines multiple GPUs. See [GPU Queues with Shared Memory](../../clearml_agent/clearml_agent_custom_workload.md#example-gpu-queues-with-shared-memory)
  for an example configuration of a queue that allocates multiple GPUs and shared memory.
  :::

* **AI Gateway Route**: Select an available, admin-preconfigured route to use as the service endpoint. If none is selected, an ephemeral endpoint will be created.
* **Model Configuration**: Configure the behavior and performance of the model serving engine.   
  * CLI: Llama.cpp CLI arguments. If set, these arguments will be passed to Llama.cpp and all following entries will be 
  ignored, except for the `Model` field.  
  * Verbose: Enable detailed logging   
  * No MMAP: Disable memory-mapping of model files. May improve performance on some systems but increases memory usage.  
  * Continuous Batching: Enable continuous batching for processing multiple requests efficiently. Improves throughput for 
  multiple concurrent requests.  
  * Embedding: Generate embeddings instead of text. Useful for semantic search and text similarity tasks.  
  * Model: A ClearML Model ID or a Hugging Face model. The model must be in GGUF format. If you are using a HuggingFace model, 
  make sure to pass the path to the GGUF file. For example: `provider/repo/path/to/model.gguf`  
  * Model Endpoint Name: The name to be used for API access.  
  * Number of GPU Layers: Number of layers to store in VRAM instead of system RAM (CPU). `9999` loads all layers into VRAM.  
  * Repeat Penalty: Penalty factor to apply due to repeat sequence of tokens. To disable, set to `1.0`.  
  * Temperature: Controls randomness in text generation. The higher the temperature results in lower probability, or more 
  "creative" outputs, while lower temperature results in higher probability, or more predictable outputs.   
  * Top-K: How many of the highest-probability tokens are considered for text generation  
  * Top-P: Nucleus sampling threshold. Instead of a fixed number of tokens, selects tokens whose cumulative probability 
  adds up to P. Lower values produce more focused text, higher values more diverse text.  
  * Min-P: Minimum probability threshold for a token to be considered. Tokens below this probability are excluded 
  regardless of Top-K or Top-P.  
  * XTC Probability: (Experimental Token Control) Probability of applying the XTC token selection strategy during generation.  
  * XTC Threshold – The probability threshold used by the XTC strategy to determine whether a token is included in the candidate set.  
  * Typlical: Locally typical sampling (typical-P)  
  * Repeat Last N: Last N tokens to consider for penalize  
  * Context Size: Maximum number of tokens the LLM can process at once when generating a response.  
  * RoPE Frequency Base: Base frequency for RoPE. Affects how position information is encoded in the model. Default
  is `10000.0`.   
  * RoPE Scaling: Scale factor for Rotary Position Embeddings (RoPE). Affects the model's ability to handle longer 
  sequences beyond its training length.  
  * RoPE Frequency Scale: Frequency scaling factor for Rotary Position Embedding. Adjusts position encoding scale. Used 
  in conjunction with `RoPE Frequency Base` to fine-tune position embeddings.  
  * YaRN configuration: [YaRN (**Y**et **a**nother **R**oPE extensio**N** method)](https://github.com/jquesnelle/yarn) is
  a compute-efficient method to extend the context window of llama models, requiring less tokens and training steps.  
    * YaRN Extrapolation Mix Factor: Controls context length extension. Default is 1.0. To disable YaRN, set to `-1.0`.  
    * YaRN Attention Factor: YaRN attention scaling factor. Affects attention computation in extended context. Higher 
    values increase attention to distant tokens. Default is `1.0`.  
    * YaRN Beta Fast: YaRN fast-path beta parameter. Controls the scaling behavior for nearby token relationships in 
    extended context. Default is `32.0`.  
    * YaRN Beta Slow: YaRN slow-path beta parameter. Controls the scaling behavior for distant token relationships in 
    extended context. Default is `1.0`.   
  * Threads: Number of CPU threads for parallel processing. Higher values can improve performance on multi-core systems 
  but may increase CPU usage.  
  * Threads Batch: Number of threads for batch processing (separate from main processing threads). Optimizes handling of 
  multiple requests.  
  * Tensor Split: How split tensors should be distributed across GPUs. Input a comma-separated list of proportions for 
  splitting tensors across GPUs. For example, `3,2` will assign 60% of the data to GPU 0 and 40% to GPU 1  
  * Parallel: Number of slots for process requests  
  * Max Concurrent Requests: The maximum number of concurrent requests for this particular deployment. Having a low limit 
  will deny client requests instead of having them wait for too long  
  * NUMA: Select the NUMA (non-uniform memory access) optimization mode:  
    * `distributed`: Splits across nodes   
    * `isolate`: Runs on a single node  
    * `numactl`: Uses system NUMA policy.  
  * Split Mode: Split mode determines how the model is distributed across multiple GPUs. Select model splitting mode:   
    * `none`: Uses single GPU for the entire model  
    * `Layer`: Splits the model by layers across multiple GPUs (default)  
    * `row`: Splits the model’s weight matrices row-wise  
  * Main GPU: Index of the primary GPU to use (e.g., '0'). When using multiple GPUs, this GPU will handle the main computation load.  
* General  
  * Enable Debug Mode: Run deployment in debug mode  
  * Disable Logs  
  * Enable Automatic CPU Offloading: Enable multiple models to share GPUs by offloading idle models to CPU. If `Max CUDA Memory` 
  exceeds GPU capacity, this application will offload the surplus to the CPU RAM, virtually increasing the VRAM  
  * Enable Disk Swapping: Load multiple models on the same GPUs by offloading idle models to disk (requires 
  `Automatic CPU Offloading` to be disabled).  
  * Hugging Face Token: Token for accessing Hugging Face models that require authentication  
  *  Max CUDA Memory (GiB): The maximum amount of CUDA memory identified by the system. Can exceed the actual hardware 
  memory. The surplus memory will be offloaded to the CPU memory. Only usable on amd64 machines.  
  *  CUDA Memory Manager Minimum Threshold: Maximum size (Kb) of the allocated chunks that should not be offloaded to 
  CPU when using automatic CPU offloading. Defaults to `-1` when running on a single GPU, and `66000` (64Mib) when running on multiple GPUs  
* Idle Options   
  * Idle Time Limit (Hours): Maximum idle time after which the app instance will shut down  
  * Last Action Report Interval (Seconds): The frequency at which the last activity made by the application is reported. 
  Used to stop the application from entering an idle state when the machine metrics are low but the application is actually still running  


<div class="max-w-65">

![llama deployment app form](../../img/apps_llama_form.png#light-mode-only)
![llama deployment app form](../../img/apps_llama_form_dark.png#dark-mode-only)

</div>