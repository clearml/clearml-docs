---
title: vLLM Model Deployment
---

:::important Enterprise Feature
The vLLM Model Deployment App is available under the ClearML Enterprise plan.
:::

The vLLM Model Deployment application enables users to quickly deploy LLMs as networking services over a secure 
endpoint. This application supports various model configurations and customizations to optimize performance and resource 
usage. The vLLM Model Deployment application serves your model(s) on a machine of your choice. Once an app instance is running, 
it serves your model through a secure, publicly accessible network endpoint. 

The app supports multi-model hosting and Universal Memory technology, enabling inactive models to be offloaded to other memory options to free GPU resources:
* CPU RAM – via `Automatic CPU Offloading`, `CPU Offload GiB`, and configurable `Max CUDA Memory` limits.
* Disk storage – via `Swap Space` and `Disk Swapping` (when `Automatic CPU Offloading` is disabled).

The app monitors endpoint activity and shuts down if the model remains inactive over a specified maximum idle time.

:::info AI Application Gateway
The vLLM Model Deployment app makes use of the App Gateway Router which implements a secure, authenticated 
network endpoint for the model.

If the ClearML AI Application Gateway is not available, the model endpoint might not be accessible.
For more information, see [AI Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

Once you start a vLLM Model Deployment instance, you can view the following information in its dashboard:
* Status indicator
  * <img src="/docs/latest/icons/ico-model-active.svg" alt="Active instance" className="icon size-lg space-sm" /> - App instance is running and is actively in use
  * <img src="/docs/latest/icons/ico-model-loading.svg" alt="Loading instance" className="icon size-lg space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-model-idle.svg" alt="Idle instance" className="icon size-lg space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-model-stopped.svg" alt="Stopped instance" className="icon size-lg space-sm" /> - App instance is stopped
* Idle time - Time elapsed since last activity 
* Generate Token - Link to your workspace Settings page, where you can generate a token for accessing your deployed model in the `AI APPLICATION GATEWAY` section
* Deployed models table:
  * Model name
  * Endpoint - The publicly accessible URL of the model endpoint. Active model endpoints are also available in the 
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
* Console log - The console log shows the app instance's console output: setup progress, status changes, error messages,
etc.

![vLLM Model Deployment App](../../img/apps_model_deployment.png#light-mode-only)
![vLLM Model Deployment App](../../img/apps_model_deployment_dark.png#dark-mode-only)

:::tip EMBEDDING CLEARML VISUALIZATION
You can embed plots from the app instance dashboard into [ClearML Reports](../webapp_reports.md) and other third-party platforms that support embedded content
(e.g. Notion). These visualizations are updated live as the app instance(s) updates. Hover over the plot and click <img src="/docs/latest/icons/ico-plotly-embed-code.svg" alt="Embed code" className="icon size-md space-sm" /> 
to copy the embed code, and navigate to a report to paste the embed code.
:::

## vLLM Model Deployment Instance Configuration

When configuring a new vLLM Model Deployment instance, you can fill in the required parameters or reuse the 
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
Administrators can [customize](../../deploying_clearml/enterprise_deploy/app_launch_form_custom.md) the launch form and 
modify field names and/or available options and defaults. 

This section describes the default configuration provided by ClearML.
:::

* **Import Configuration**: Import an app instance configuration file. This will fill the instance launch form with the 
values from the file, which can be modified before launching the app instance
* **Instance name**: Name for the vLLM Model Deployment instance. This will appear in the instance list
* **Service Project (Access Control)**: The ClearML project where the app instance is created. Access is determined by 
  project-level permissions (i.e. users with read access can use the app).
* **Queue**: The [ClearML Queue](../../fundamentals/agents_and_queues.md#what-is-a-queue) to which the vLLM Model Deployment app 
instance task will be enqueued. Make sure an agent is assigned to that queue.

  :::tip Multi-GPU inference
  To run multi-GPU inference, ensure the queue's pod specification (from the base template and/or `templateOverrides`) defines multiple GPUs. See [GPU Queues with Shared Memory](../../clearml_agent/clearml_agent_custom_workload.md#example-gpu-queues-with-shared-memory)
  for an example configuration of a queue that allocates multiple GPUs and shared memory.
  :::

* **AI Gateway Route**: Select an available, admin-preconfigured route to use as the service endpoint. If none is selected, an ephemeral endpoint will be created.
* **Model Configuration**: Configure the behavior and performance of the model engine.
  * Trust Remote Code: Select to set Hugging Face [`trust_remote_code`](https://huggingface.co/docs/text-generation-inference/main/en/reference/launcher#trustremotecode) 
  to `true`.
  * CLI: vLLM CLI arguments. If set, these arguments will be passed to vLLM and all following entries will be ignored, 
  except for the `Model` field.
  * Enforce Eager: Forces PyTorch [eager mode](https://pytorch.org/executorch/stable/concepts.html#eager-mode) for execution.
  If not selected, a hybrid of eager mode and CUDA graph will be used for maximal performance and flexibility.
  * Enable Automatic Prefix Caching: Caches key-value pairs for shared prefixes across requests. This reduces 
  computational overhead and memory usage by reusing cached KV pairs for subsequent requests with the same prefix. For 
  more information, see [Automatic Prefix Caching](https://docs.vllm.ai/en/v0.9.2/features/automatic_prefix_caching.html).
  * Disable Sliding Window: Prevents the model from using a sliding window for input processing. Instead, it caps the 
  input length to the sliding window size and processes the entire sequence as a whole.
  * Enable Reasoning: Enables model to generate [reasoning content](https://docs.vllm.ai/en/latest/features/reasoning_outputs.html).
  * Enable Auto Tool Choice: When set, vLLM will automatically choose between supported tool-call parsers. Requires to select parser backend in `Tool Call Parser`
  * Model: A ClearML Model ID or a HuggingFace model name (e.g. `openai-community/gpt2`)
  * Model Endpoint Name: The name to be used for API access.  
  * Multimedia Limit per Prompt: Set limits on the number of multi-modal inputs allowed for each prompt. Input a comma-separated 
  list of items, e.g., `image=16,video=2` allows a maximum of 16 images and 2 videos per prompt. Defaults to 1 for each modality  
  * Max Context Length: Maximum model context length. If unspecified, it will be derived from the model config.  
  * Max Number of Sequences per iteration: Maximum number of sequences that can be processed together in a single iteration  
  * Speculative Draft Tensor Parallel Size: Maximum sequence length covered by CUDA graphs. Longer sequences fall back to eager mode.  
  * Tool Call Parser: Select which tool-call parser to use when `Enable Auto Tool Choice` is enabled. These parsers 
  convert model output into OpenAI API–compatible tool calls. For more information about the parsers, see [vLLM documentation](https://docs.vllm.ai/en/stable/features/tool_calling.html).   
  * Tool Parser plugin: Name of a registered parser plugin for custom tool-call parsing. If set, this plugin can be 
  referenced by the parser selected in the `Tool Call Parser` field.  
  * Max Num Batched Tokens: Maximum number of batched tokens per iteration  
  * Reasoning Parser: Select the reasoning parser depending on the model that you're using. This is used to parse the 
  reasoning content into OpenAI API format. Required if `Reasoning` is enabled. For more information about reasoning parser, 
  see [vLLM documentation](https://docs.vllm.ai/en/v0.9.1/features/reasoning_outputs.html).  
  * Model Implementation: Which implementation of the model to use:   
    * No selection (default): Use the vLLM implementation if it exists and fall back to the Transformers implementation 
    if no vLLM implementation is available.   
    * `vllm`: Use the vLLM model implementation.  
    * `transformers`: Use the Transformers model implementation  
  * GPU Memory Utilization: The fraction of GPU memory to be used for the model executor, which can range from 0 to 1. 
  Default: 0.9.
  * GPUs (Tensor Parallel Size): Number of GPUs used to load the model. Defaults to the number of GPUs detected on the machine  
  * Swap Space: CPU swap space size (GiB) per GPU  
  * CPU Offload GiB: Space in GiB to offload to CPU per GPU. Default 0, which means no offloading. This allows for a 
  virtual increase in GPU memory size (e.g., for a 24 GB GPU with 10 GiB set, it appears as 34 GB). Requires fast 
  CPU-GPU interconnect during model operations.  
  * Quantization: Method used to quantize the weights. If None, we first check the `quantization_config` attribute in 
  the model config file. If that is `None`, we assume the model weights are not quantized and use `dtype` to determine 
  the data type of the weights.   
  * Dtype: Data type for model weights and activations. Select one of the following:  
    * `auto`: If selected, will use base model data type.  
    * `float16`  
    * `bfloat16`  
    * `float32`  
  * KV Cache Dtype: Data type for KV cache storage. Select one of the following:   
    * `auto`: If selected, will use the model data type.   
    * `fp8`  
    * `ffp8_e5m2`  
    * `fp8_e4m3`  
  * Pipeline Parallel Size: Number of pipeline stages  
  * Token Block Size: Block size for contiguous chunks of tokens. Ignored on neuron devices.  
  * Random Seed   
  * Max Logprobs: Max number of log probabilities to return if requested.  
  * Max Concurrent Requests: The maximum number of concurrent requests for this particular deployment. Having a low 
  limit will deny client requests instead of having them wait for too long  
  * RoPE Theta: Use with `RoPE Scaling`. In some cases, changing the theta improves the performance of the scaled model.  
  * RoPE Scaling: RoPE scaling configuration in JSON. For example, `{"rope_type":"dynamic","factor":2.0}`.  
  * Revision: The specific Hugging Face version of the model (i.e. weights) you want to use. You can use a specific commit 
  ID or a branch like `refs/pr/2`.  
  * Code Revision: The specific revision to use for the model code on HuggingFace Hub. It can be a branch name, a tag 
  name, or a commit ID. If unspecified, will use the default version.  
  * Tokenizer: A ClearML Model ID or a Hugging Face tokenizer  
  * Tokenizer Revision: The specific tokenizer Hugging Face version to use. It can be a branch name, a tag name, or a 
  commit ID. If unspecified, will use the default version.  
  * Tokenizer Mode: Select the tokenizer mode:  
    * `auto`: Uses the fast tokenizer if available  
    * `slow`: Uses the slow tokenizer.  
  * Speculative decoding: The speculative decoding technique improves inter-token latency in memory-bound LLM inference. 
  For more information, see the [vLLM documentation](https://docs.vllm.ai/en/v0.5.5/models/spec_decode.html).  
    * Speculative model: Draft model name for speculative decoding.  
    * Speculative Disable MQA Scorer: Disable [MQA scorer](https://data.europa.eu/mqa/methodology?locale=en) in speculative decoding.  
    * Speculative Decoding Acceptance Method: Select the acceptance method to use during draft token verification:   
      * `RejectionSampler`: Does not allow changing the acceptance rate of draft tokens  
      * `TypicalAcceptanceSampler`: Allows for a higher acceptance rate at the cost of lower quality, and vice versa.  
    * Num Speculative Tokens: Number of speculative tokens to sample.  
    * Speculative Disable By Batch Size: Disable speculative decoding for new incoming requests if the number of enqueue 
    requests exceeds this value.  
    * Speculative Draft Tensor Parallel Size: Tensor parallel replicas for the draft model.  
    * Speculative Max Model Len: Maximum sequence length for the draft model. Sequences over this length will skip 
    speculation.  
    * Speculative Model Quantization: Choose the quantization method for the speculative model. If set to `None`, the app 
    checks the `quantization_config` in the model's configuration file. If that is also `None`, the app assumes the model 
    weights are not quantized and uses the dtype to determine the data type.  
  * Num Lookahead Slots: Experimental scheduling config necessary for speculative decoding.  
  * Model Overrides: Add to or override this model's configuration. The model options have to correspond to 
  [vLLM options](https://docs.vllm.ai/en/stable/configuration/engine_args/). For example, `pipeline_parallel_size` 
  corresponds to the `--pipeline-parallel-size` option in vLLM. To set a flag, pass `flag: true`, for example, `enforce_eager: true` 
  corresponds to the `--enforce-eager` flag
* **LoRA Configuration** 
  * Enable LoRA: If checked, enable handling of [LoRA adapters](https://huggingface.co/docs/diffusers/en/training/lora#lora).
  * LoRA Modules: LoRA module configurations in the format `name=path`. Multiple modules can be specified.
  * Max LoRAs: Max number of LoRAs in a single batch. 
  * Long LoRA Scaling Factors: Specify multiple scaling factors to allow for multiple LoRA adapters trained with those 
    scaling factors to be used at the same time.
  * Max LoRA Rank
  * LoRA Extra Vocabulary Size: Maximum size of extra vocabulary that can be present in a LoRA adapter (added to the base model vocabulary).
  * LoRA Dtype: Select the data type for LoRA. Select one of the following:
    * `auto`: If selected, will default to base model data type.
    * `float16`
    * `bfloat16`
    * `float32`    
  * Max CPU LoRAs: Maximum number of LoRAs to store in CPU memory. Must be greater or equal to the 
  `Max Number of Sequences` field in the General section below. Defaults to `Max Number of Sequences`.
  * Enable LoRA Bias: Enable bias for LoRA adapters
  * Fully Sharded LoRAs: Use fully-sharded LoRA layers. By default, half of the LoRA computation is sharded with tensor 
  parallelism. Fully-sharded LoRAs uses tensor parallelism to shard the entire LoRA computation. 
* General  
  * Enable Debug Mode: Run deployment in debug mode  
  * Use V1 Engine: Use the vLLM V1 engine, vastly improving performance. Read more about it [here](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html).  
  * Trust Remote Code: Select to set Hugging Face [`trust_remote_code`](https://huggingface.co/docs/text-generation-inference/main/en/reference/launcher#trustremotecode) to `true`.  
  * Disable log requests: Disable logging requests  
  * Disable Async Output Processing: Disable async output processing, which may result in lower performance  
  * HuggingFace Token: Token for accessing HuggingFace models that require authentication  
  * Max CUDA Memory (GiB): The maximum amount of CUDA memory identified by the system. Can exceed the actual hardware memory, and the surplus memory will be offloaded to the CPU memory. Only usable on amd64 machines.  
  *  CUDA Memory Manager Minimum Threshold: Maximum size (Kb) of the allocated chunks that should not be offloaded to CPU when using automatic CPU offloading. Defaults to `-1` when running on a single GPU, and `66000` (64Mib) when running on multiple GPUs  
  * Max Log Length: Max number of prompt characters or prompt ID numbers being printed in log. Default: unlimited.  
  * Device: Device type for vLLM execution.  
  * Guided Decoding Backend: Select engine for decoding `config.json` files:  
    * `[outlines](https://github.com/outlines-dev/outlines)`  
    * `[lm-format-enforcer](https://github.com/noamgat/lm-format-enforcer)`  
  * Distributed Executor Backend: Select backend for distributed model workers.  
    * `mp`  
    * `ray`  
  * Config Overrides: Extra configuration overrides (JSON).  
  * Uvicorn Log Level: Log level for uvicorn  
  * vLLM Log Level: Log level for vLLM.  
  * Load Format: Select the model weights format to load:  
    * `auto`: Load the weights in the safetensors format and fall back to the pytorch bin format if safetensors format 
    is not available.  
    * `pt`: Load the weights in the pytorch bin format.  
    * `safetensors`: Load the weights in the safetensors format.  
    * `npcache`: Load the weights in pytorch format and store a numpy cache to speed up the loading.  
    * `Dummy`: Initialize the weights with random values. Mainly used for profiling.  
* **Advanced**  
  * Skip Tokenizer Init: Skip initialization of tokenizer and detokenizer  
  * Disable Custom All Reduce: Disable the custom all-reduce kernel and fall back to NCCL.
  * Enable Chunk Prefill: Prefill requests can be chunked.  
  * Disable Logprobs During Spec Decoding: Do not return token log probabilities during speculative decoding.  
  * Enable Prompt Adapter: Enable handling of PromptAdapters.  
  * Enable Prompt Tokens Details: Enable `prompt_tokens_details` in usage. This allows the model to return detailed 
  information about each token in the input prompt.  
  * Ray Workers Use Nsight: Use [nsight](https://developer.nvidia.com/nsight-systems) to profile Ray workers.  
  * Enable Automatic CPU Offloading: Enable multiple models to share GPUs by offloading unused ones to CPU. 
  If `Max CUDA Memory` exceeds GPU capacity, this application will offload the surplus to the CPU RAM, virtually 
  increasing the VRAM  
  * Enable Disk Swapping: Load multiple models on the same GPUs by offloading inactive ones to disk (requires 
  `Automatic CPU Offloading` to be disabled).  
  * Model Loader Extra Config: Extra config for model loader (JSON)  
  * Max Prompt Adapter Token: Max tokens for PromptAdapters.  
  * HF Overrides: Extra arguments for HuggingFace config (JSON).  
  * Ignore Patterns: Patterns to ignore when loading the model.  
  * Guided Decoding Backend: Select engine for decoding `config.json` files:  
    * `[outlines](https://github.com/outlines-dev/outlines)`  
    * `[lm-format-enforcer](https://github.com/noamgat/lm-format-enforcer)`  
  * Ngram Prompt Lookup Max: Max window size for ngram prompt lookup.  
  * Ngram Prompt Lookup Min: Min window size for ngram prompt lookup.  
  * Num GPU Blocks Override: Override GPU profiling with fixed GPU blocks.  
  * Num Scheduler Steps: Max forward steps per scheduler call.  
  * Override Pooler Config: Override pooling method in embedding model (JSON).  
  * Preemption Mode: Handle preemption by recompute or swap.  
  * Return Tokens As Token IDs: Represent tokens as `token_id:{id}` if `Max Logprobs` is used.  
  * Scheduler Delay Factor: Apply a delay factor to scheduling next prompt (Applied delay is `delay factor * previous prompt latency`)  
  * Scheduling Policy: Select one of the following:  
    * `fcfs`: Requests are handled first come, first served (in order of arrival)  
    * `priority`:  Requests are handled based on given priority (lower value means earlier handling) and time of arrival 
    deciding any ties  
  * Task: Task to use the model for. Select one of the following:   
    * auto: When the model only supports one task, "auto" can be used to select it. Otherwise, you must specify 
    explicitly which task to use.  
    * generate  
    * embedding   
  * Tokenizer Pool Extra Config: Extra config for tokenizer pool (JSON). Ignored if `Tokenizer Pool Size` is `0`.  
  * Tokenizer Pool Size: Size of tokenizer pool to use for asynchronous tokenization.  
  * Tokenizer Pool Type: Type of tokenizer pool to use for asynchronous tokenization.  
  * Typical Acceptance Sampler Posterior Threshold: Lower bound threshold for the posterior probability of a token to be accepted  
* **vLLM Version**: If set, the vLLM version specified in this field will be installed. Otherwise, use the preinstalled 0.7.2 version  
* **Idle options**   
  * Idle Time Limit (Hours): Maximum idle time after which the app instance will shut down  
  * Last Action Report Interval (Seconds): Frequency at which last activity is reported. Prevents idle shutdown while still active.  


<div class="max-w-65">

![vLLM Model Deployment app form](../../img/apps_model_deployment_form.png#light-mode-only)
![vLLM Model Deployment app form](../../img/apps_model_deployment_form_dark.png#dark-mode-only)
 
</div>