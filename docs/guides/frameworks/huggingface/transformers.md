---
title: Transformers
---

The [Hugging Face Transformers example](https://github.com/allegroai/clearml/blob/master/examples/frameworks/huggingface/transformers.ipynb)
demonstrates how to integrate ClearML into your Transformer's [Trainer](https://huggingface.co/docs/transformers/v4.34.1/en/main_classes/trainer) 
code. The Hugging Face Trainer automatically uses the built-in [`ClearMLCallback`](https://huggingface.co/docs/transformers/v4.34.1/en/main_classes/callback#transformers.integrations.ClearMLCallback)
if the `clearml` package is already installed, to log Transformers models, parameters, scalars, and more. 

In the example, ClearML is installed and set up in the training environment. This way ClearML can log models, parameters, 
scalars, and more.

When the example runs, it creates a ClearML task called `Trainer` in the `HuggingFace Transformers` project. To change 
the task's name or project, use the `CLEARML_PROJECT` and `CLEARML_TASK` environment variables respectively.

For more information about integrating ClearML into your Transformers code, see [Hugging Face Transformers](../../../integrations/transformers.md).

## WebApp

### Hyperparameters

ClearML automatically captures all the Trainer [parameters](https://huggingface.co/docs/transformers/v4.34.1/en/main_classes/trainer#transformers.TrainingArguments). 
Notice in the code example that only a few of the `TrainingArguments` are explicitly set:

```python
training_args = TrainingArguments(
     output_dir="path/to/save/folder/",
     learning_rate=2e-5,
     per_device_train_batch_size=8,
     per_device_eval_batch_size=8,
     num_train_epochs=2,
)
```

ClearML captures all of the `TrainingArguments` passed to the Trainer. 

View these parameters in the task's **CONFIGURATION** tab **> Hyperparameters** section.

![Transformers params](../../../img/examples_transformers_params.png)


### Models 

In order for ClearML to log the models created during training in this example, the `CLEARML_LOG_MODEL` environment 
variable is set to `True`. 

ClearML automatically captures the model snapshots created by the Trainer, and saves them as artifacts. View the snapshots in the 
task's **ARTIFACTS** tab.

![Transformers models](../../../img/examples_transformers_artifacts.png)

### Scalars

ClearML automatically captures the Trainer's scalars, which can be viewed in the task's **Scalars** tab.

![Transformers scalars](../../../img/integrations_transformers_scalars.png)
