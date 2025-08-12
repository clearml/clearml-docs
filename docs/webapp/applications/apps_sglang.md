---
title: SGLang Model Deployment
---

:::important Enterprise Feature
The SGLang Model Deployment App is available under the ClearML Enterprise plan.
:::

The SGLang Model Deployment application enables users to create secure, authenticated LLM endpoints using the SGLang 
serving engine. This application supports various model configurations and customizations to optimize performance and 
resource usage. The SGLang Model Deployment application serves your model on a machine of your choice. Once an app 
instance is running, it serves your model through a secure, publicly accessible network endpoint. 

The app supports multi-model hosting and Universal Memory technology, enabling inactive models to be offloaded to other 
memory options to free GPU resources:
* CPU RAM – via `Automatic CPU Offloading` and configurable` Max CUDA Memory` limits.
* Disk storage – via `Disk Swapping` (requires `Automatic CPU Offloading` to be disabled).

The app monitors endpoint activity and shuts down if the model remains inactive for a specified maximum idle time.

:::info AI Application Gateway
The SGLang Model Deployment app makes use of the App Gateway Router which implements a secure, authenticated 
network endpoint for the model.

If the ClearML AI application Gateway is not available, the model endpoint might not be accessible.
For more information, see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

Once you start a SGLang Model Deployment instance, you can view the following information in its dashboard:
* Status indicator
  * <img src="/docs/latest/icons/ico-sglang-active.svg" alt="Active instance" className="icon size-md space-sm" /> - App instance is running and is actively in use
  * <img src="/docs/latest/icons/ico-sglang-loading.svg" alt="Loading instance" className="icon size-md space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-sglang-idle.svg" alt="Idle instance" className="icon size-md space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-sglang-stopped.svg" alt="Stopped instance" className="icon size-md space-sm" /> - App instance is stopped
* Idle time - Time elapsed since last activity 
* Generate Token - Link to `AI APPLICATION GATEWAY` section of the Settings page, where you can generate a token for accessing your deployed model
* Deployed models table:
  * Model name
  * Endpoint - The publicly accessible URL of the model endpoint. Active model endpoints are also available in the 
    [Model Endpoints](../webapp_model_endpoints.md) table, which allows you to view and compare endpoint details and 
    monitor status over time
* Command to connect to the deployed model
  * Select model to generate a `curl` command for connecting to it
  * Prompt - Provide a prompt to send to the model. This will be added to the `curl` command
  * The generated `curl` command includes the model's endpoint and prompt. Replace `YOUR_GENERATED_TOKEN` with a valid
  token generated in the `AI APPLICATION GATEWAY` section of the [Settings](../settings/webapp_settings_profile.md#ai-application-gateway-tokens) page.
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
* Console log - The console log shows the app instance's console output: setup progress, status changes, error messages,
etc.

![SGLang Model Deployment App](../../img/apps_sglang_dashboard.png#light-mode-only)
![SGLang Model Deployment App](../../img/apps_sglang_dashboard_dark.png#dark-mode-only)

:::tip EMBEDDING CLEARML VISUALIZATION
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md). These visualizations 
are updated live as the app instance(s) updates. The Enterprise Plan supports embedding resources in 
external tools (e.g. Notion). Hover over the plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
to copy the embed code, and navigate to a report to paste the embed code.
:::

## SGLang Model Deployment Instance Configuration

When configuring a new SGLang Model Deployment instance, you can fill in the required parameters or reuse the 
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
* **Import Configuration**: Import an app instance configuration file. This will fill the instance launch form with the 
values from the file, which can be modified before launching the app instance
* **Instance name**:  Name for the app instance. This will appear in the instance list
* **Service Project - Access Control** - The ClearML project where the app instance is created. Access is determined by 
  project-level permissions (i.e. users with read access can use the app).
* **Queue** - The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the SGLang Model Deployment app 
instance task will be enqueued (make sure an agent is assigned to that queue)
* **AI Gateway Route** - Select an available, admin-preconfigured route to use as the service endpoint. If none is selected, an ephemeral endpoint will be created.
* **Model** - A ClearML Model ID or a HuggingFace model name (e.g. `openai-community/gpt2`)
* **Model Configuration**: Configure the behavior and performance of the language model engine. This allows you to 
  customize model selection, parallelism policies, memory management, optimization techniques, and more. See more details 
  about [SGLang configuration options](https://docs.sglang.ai/advanced_features/server_arguments.html#model-and-tokenizer)
  (parameter names appear as their command-line form, e.g., "Max Running Requests" is listed as `--max-running-requests`).
  * CLI - SGLang CLI arguments. If set, these arguments will be passed to SGLang. All other deployment form fields will 
  be ignored, except for the `Model` field.
  * Model - A ClearML Model ID or a HuggingFace model name (e.g. `openai-community/gpt2`)
* **LoRA Configuration** 
  * Enable LoRA - If checked, enable handling of [LoRA adapters](https://huggingface.co/docs/diffusers/en/training/lora#lora).
  * LoRA Modules - LoRA module configurations in the format `name=path`. Multiple modules can be specified.
  * Max LoRAs - Max number of LoRAs in a single batch. 
  * Max LoRA Rank
  * LoRA Extra Vocabulary Size - Maximum size of extra vocabulary that can be present in a LoRA adapter (added to the base model vocabulary).
  * LoRA Dtype - Select the data type for LoRA. Select one of the following:
    * `auto` - If selected, will default to base model data type.
    * `float16`
    * `bfloat16`
    * `float32`    
  * Max CPU LoRAs - Maximum number of LoRAs to store in CPU memory. Must be greater or equal to the 
  `Max Number of Sequences` field in the General section below. Defaults to `Max Number of Sequences`.
* **General**: Runtime, performance, caching, and logging settings for the deployed model, and resource limits and 
  authentication options. See more details about [SGLang configuration options](https://docs.sglang.ai/advanced_features/server_arguments.html#model-and-tokenizer)
  (parameter names appear as their command-line form, e.g., "Watchdog Timeout" is listed as `--watchdog-timeout`)
  * Enable Debug Mode: Run deployment in debug mode
  * Enable Automatic CPU Offloading: Enable multiple models to share GPUs by offloading unused ones to CPU. If `Max CUDA Memory` 
    exceeds GPU capacity, this application will offload the surplus to the CPU RAM, virtually increasing the VRAM
  * Enable Disk Swapping: Load multiple models on the same GPUs by offloading inactive ones to disk (requires `Automatic CPU Offloading` 
    to be disabled). 
  * HuggingFace Token: Token for accessing HuggingFace models that require authentication
  * Max CUDA Memory (GiB): The maximum amount of CUDA memory identified by the system. Can exceed the actual hardware 
  memory. The surplus memory will be offloaded to the CPU memory. Only usable on amd64 machines.
  * CUDA Memory Manager Minimum Threshold: Maximum size (Kb) of the allocated chunks that should not be offloaded to CPU 
  when using automatic CPU offloading. Defaults to `-1` when running on single GPU, and `66000` (64Mib) when running on 
  multiple GPUs.
* **Idle options**: 
  * Idle Time Limit (Hours) - Maximum idle time after which the app instance will shut down
  * Last Action Report Interval (Seconds) - Frequency at which last activity is reported. Prevents idle shutdown while still active.
* **Export Configuration** - Export the app instance configuration as a JSON file, which you can later import to create a 
new instance with the same configuration

<div class="max-w-65">

![SGLang Model Deployment app form](../../img/apps_sglang_form.png#light-mode-only)
![SGLang Model Deployment app form](../../img/apps_sglang_form_dark.png#dark-mode-only)
 
</div>