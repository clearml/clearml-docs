---
title: Halo
---

[Halo](https://github.com/whitecircle/halo) trains language and multimodal models in their native Hugging Face format with faster kernels and lower peak memory. Halo uses the Transformers ClearML callback, so experiment tracking is selected in the same YAML file as the model, training method, distributed setup, and checkpoints.

## Setup

Install Halo by following its [installation guide](https://github.com/whitecircle/halo#installation), then configure the ClearML SDK:

```commandline
clearml-init
```

Set `report_to`, `project_name`, and `run_name` in the Halo training config:

```yaml
model_name_or_path: Qwen/Qwen3-4B-Instruct-2507
dataset:
  - HuggingFaceH4/ultrachat_200k@train_sft
conversation_field: messages
assistant_message_template: "<|im_start|>assistant\n"

output_dir: checkpoints/qwen3-4b-lora
save_strategy: steps
save_steps: 500
save_total_limit: 3

logging_steps: 1
report_to: clearml
project_name: halo-training
run_name: qwen3-4b-lora
enable_efficiency_metrics: true
```

Launch training:

```commandline
halo launch sft train.yaml
```

Halo sets `CLEARML_PROJECT` and `CLEARML_TASK` from the YAML fields. ClearML records the Transformers arguments, model configuration, scalar metrics, console output, package versions, and machine details. Halo's efficiency callback adds tokens per second, step time, and allocated, reserved, and peak GPU memory.

## Log checkpoints

Halo writes Hugging Face checkpoints under `output_dir`. Enable ClearML model logging before launch to upload model files captured by the Transformers integration:

```commandline
export CLEARML_LOG_MODEL=True
halo launch sft train.yaml
```

The checkpoint interval and retention count come from `save_steps` and `save_total_limit` in the YAML file.

## Resume training

To resume from the newest checkpoint under `output_dir`, add:

```yaml
resume_from_checkpoint: true
```

You can also provide a checkpoint directory explicitly:

```yaml
resume_from_checkpoint: checkpoints/qwen3-4b-lora/checkpoint-500
```

Use the same `output_dir` and `run_name` when continuing the same experiment. See the [Halo overview](https://whitecircle.com/halo) for supported training methods and parallelism options.
