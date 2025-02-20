---
title: ClearML SDK
---

The ClearML Python Package supports the [automatic logging](../fundamentals/logger.md#automatic-reporting) that documents 
tasks for you, and an extensive set of powerful features and functionality you can use to improve experimentation 
and other workflows.

:::tip Installation
For installation instructions, see [Getting Started](../getting_started/ds/ds_first_steps.md#install-clearml). 
:::

The ClearML Python Package collects the scripts' entire execution information, including:
* Git repository (branch, commit ID, and uncommitted changes) 
* Working directory and entry point
* Hyperparameters 
* Initial weights model, model snapshots (checkpoints), output model 
* Artifacts, metrics, logs, other reported data (from libraries and visualization toolkits), and debug samples. 

In conjunction with the ClearML Hosted Service (or self-hosted [ClearML Server](../deploying_clearml/clearml_server.md)) 
and [ClearML Agent](../clearml_agent.md), the ClearML Python Package allows you and your teammates to collaborate 
programmatically and use the [ClearML Web UI](../webapp/webapp_overview.md).

## Classes and Modules

### Task
The `Task` class is the code template for all Task features and functionality including:
* Data collection and storage from scripts
* Automatic bindings with frameworks, libraries, and visualization tools
* A robust set of methods for Task execution (cloning, connecting parameter dictionaries, configurations, and models)
* and more!

See an [overview](task_sdk.md) of `Task`'s pythonic methods or the [Task SDK reference page](task_sdk.md).

### Model 
The `model` module contains three classes that provide support for working with models in ClearML: 
* `Model` - represents an existing model in ClearML that can be loaded and connected to a Task 
* `InputModel` - represents an existing model that you can load into ClearML 
* `OutputModel` - represents the task output model that is always connected to the Task

See an [overview](../clearml_sdk/model_sdk.md) of the Model classes' pythonic methods, or the SDK reference pages for [`Model`](../references/sdk/model_model.md), 
[`InputModel`](../references/sdk/model_inputmodel.md), and [`OutputModel`](../references/sdk/model_outputmodel.md).

### Logger
The `Logger` class is the ClearML console log and metric statistics interface. The class contains methods for: 
* Explicit reporting 
* Setting an upload destination for debug sample storage
* Controlling ClearML's logging of TensorBoard and Matplotlib outputs

See the [Logger SDK reference page](../references/sdk/logger.md).


### Hyperparameter Optimization 

ClearML's `optimization` module includes classes that support hyperparameter optimization (HPO):
* [HyperParameterOptimizer](../references/sdk/hpo_optimization_hyperparameteroptimizer.md) - Hyperparameter search 
  controller class 
* Optimization search strategy classes including [Optuna](../references/sdk/hpo_optuna_optuna_optimizeroptuna.md), [HpBandSter](../references/sdk/hpo_hpbandster_bandster_optimizerbohb.md),
  [GridSearch](../references/sdk/hpo_optimization_gridsearch.md), [RandomSearch](../references/sdk/hpo_optimization_randomsearch.md), 
  and a base [SearchStrategy](https://github.com/clearml/clearml/blob/master/clearml/automation/optimization.py#L310)
  that can be customized
  
See the [HyperParameterOptimizer SDK reference page](../references/sdk/hpo_optimization_hyperparameteroptimizer.md). 
  
### Pipeline

ClearML's `automation` module includes classes that support creating pipelines: 
  * [PipelineController](../pipelines/pipelines_sdk_tasks.md) - A Pythonic interface for 
    defining and configuring a pipeline controller and its steps. The controller and steps can be functions in your 
    python code, or ClearML [tasks](../fundamentals/task.md).
  * [PipelineDecorator](../pipelines/pipelines_sdk_function_decorators.md) - A set 
    of Python decorators which transform your functions into the pipeline controller and steps.
    
### Dataset
The `Dataset` class supports creating, modifying, and managing datasets, 
as well as retrieving them for use in code. 

See [ClearML Data](../clearml_data/clearml_data.md) or the [Dataset SDK reference page](../references/sdk/dataset.md).


### StorageManager  
The `StorageManager` class provides support for downloading and uploading from storage, 
including local folders, S3, Google Cloud Storage, Azure Storage, and http(s).

See [examples](../guides/storage/examples_storagehelper.md) of `StorageManager` usage or the [StorageManager SDK reference page](../references/sdk/storage.md).

### APIClient
The `APIClient` class provides a Pythonic interface to access ClearML's backend REST API.

See an [overview](apiclient_sdk.md) for APIClient usage. 

### ClearmlJob 
Use the ClearmlJob to create and manage jobs based on existing tasks. The class supports changing a job's parameters, 
configurations, and other execution details. 

See [reference page](../references/sdk/automation_job_clearmljob.md).

### AutoScaler
The `AutoScaler` class facilitates implementing resource budgeting. See class methods [here](https://github.com/clearml/clearml/blob/master/clearml/automation/auto_scaler.py).
ClearML also provides a class specifically for AWS autoscaling. See [code](https://github.com/clearml/clearml/blob/master/clearml/automation/aws_auto_scaler.py#L22)
and [example script](https://github.com/clearml/clearml/blob/master/examples/services/aws-autoscaler/aws_autoscaler.py). 

### TaskScheduler
The `TaskScheduler` class supports methods for scheduling periodic execution (like cron jobs). See the [code](https://github.com/clearml/clearml/blob/master/clearml/automation/scheduler.py#L481)
and [example](https://github.com/clearml/clearml/blob/master/examples/scheduler/cron_example.py).

### TriggerScheduler
The `TriggerScheduler` class facilitates triggering task execution in the case that specific events occur in the system 
(such as model publication, dataset creation, task failure). See [code](https://github.com/clearml/clearml/blob/master/clearml/automation/trigger.py#L148)
and [usage example](https://github.com/clearml/clearml/blob/master/examples/scheduler/trigger_example.py).

## Examples 

The `clearml` GitHub repository includes an [examples folder](https://github.com/clearml/clearml/tree/master/examples)
with example scripts demonstrating how to use the various functionalities of the ClearML SDK. 

These examples are preloaded in the [ClearML Hosted Service](https://app.clear.ml), and can be viewed, cloned, 
and edited in the ClearML Web UI's `ClearML Examples` project. Each example is explained in the [examples section](../guides/main.md). 
