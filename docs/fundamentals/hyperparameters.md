---
title: Hyperparameters
---

Hyperparameters are a script's configuration options. Since hyperparameters can have substantial impact on
model performance, it is crucial to efficiently track and manage them.

ClearML supports tracking and managing hyperparameters in each task and provides a dedicated [hyperparameter 
optimization module](hpo.md). With ClearML's logging and tracking capabilities, tasks can be reproduced, and their 
hyperparameters and results can be saved and compared, which is key to understanding model behavior.

ClearML lets you easily try out different hyperparameter values without changing your original code. ClearML's [execution
agent](../clearml_agent.md) will override the original values with any new ones you specify through the web UI (see 
[Configuration](../webapp/webapp_exp_tuning.md#configuration) in the Tuning Tasks page). You can also
programmatically set task parameters.

## Tracking Hyperparameters 
Hyperparameters can be added from anywhere in your code, and ClearML provides multiple ways to obtain them! ClearML logs 
and tracks hyperparameters of various types, supporting automatic logging and explicit reporting. 

### Automatic Logging
Once a ClearML Task has been [initialized](../references/sdk/task.md#taskinit) in a script, ClearML automatically captures and tracks 
the following types of parameters:
* Command line parsing - command line parameters passed when invoking code that uses standard Python packages, including:
  * [click](../integrations/click.md)
  * [argparse](../guides/reporting/hyper_parameters.md#argparse-command-line-options)
  * [Python Fire](../integrations/python_fire.md)
  * [LightningCLI](../integrations/pytorch_lightning.md)
* TensorFlow Definitions (`absl-py`). See examples of ClearML's automatic logging of TF Defines:
    * [TensorFlow MNIST](../guides/frameworks/tensorflow/tensorflow_mnist.md)
    * [TensorBoard PR Curve](../guides/frameworks/tensorflow/tensorboard_pr_curve.md)
* [Hydra](../integrations/hydra.md) - ClearML logs the `OmegaConf` which holds all the configuration files, 
  as well as values overridden during runtime.

:::tip Disabling Automatic Logging
Automatic logging can be disabled. See [Control Automatic Logging](../clearml_sdk/task_sdk.md#control-automatic-logging).
:::

### Environment Variables

:::important Task Reproducibility
Relying on environment variables makes a task not fully reproducible, since ClearML Agent can't reproduce them at 
runtime.
:::

Environment variables can be logged to a task by specifying the variables in the `sdk.development.log_os_environments` 
field of the [`clearml.conf`](../configs/clearml_conf.md) file:

```editorconfig
log_os_environments: ["AWS_*", "CUDA_VERSION"]
```

You can also specify environment variables using the `CLEARML_LOG_ENVIRONMENT` environment variable:
* All environment variables:
   ```
   export CLEARML_LOG_ENVIRONMENT=*
   ```
   
* Specific environment variables. For example, log `PWD` and `PYTHONPATH`:
   ```
   export CLEARML_LOG_ENVIRONMENT=PWD,PYTHONPATH 
   ```
  
* No environment variables:
   ```
   export CLEARML_LOG_ENVIRONMENT=
   ```
  
:::note Overriding clearml.conf
The `CLEARML_LOG_ENVIRONMENT` variable always overrides the `clearml.conf` file. 
:::

When a script that has integrated ClearML is executed, the environment variables listed in the `clearml.conf` or specified by 
the `CLEARML_LOG_ENVIRONMENT` variable are logged by ClearML.

### Explicit Logging 

To augment its automatic logging, ClearML supports explicitly logging parameters. ClearML provides methods to directly 
connect Python objects and configuration objects, as well as manually set and update task parameters.  

#### Connecting Python Objects 
Users can directly connect Python objects, such as dictionaries and custom classes, to tasks, using the 
[`Task.connect`](../references/sdk/task.md#connect) method. Once objects are connected to a task, all object elements 
(e.g. class members, dictionary key-values pairs) are automatically logged by ClearML. Additionally, ClearML tracks these 
values as they change through your code.

When connecting objects to ClearML, users can directly access and modify an object's elements (e.g. a specific key-value 
pair in a parameter dictionary).

#### Connecting Configuration Objects
Configuration objects are dictionaries or configuration files connected to the task using 
[`Task.connect_configuration()`](../references/sdk/task.md#connect_configuration). With this method, configuration 
objects are saved as blobs i.e. ClearML is not aware of their internal structure.

#### Setting and Updating Parameters
ClearML provides methods to set and update task parameters manually. Use [`Task.set_parameters()`](../references/sdk/task.md#set_parameters) 
to define parameters manually. To update the parameters in a task, use [`Task.set_parameters_as_dict()`](../references/sdk/task.md#set_parameters_as_dict). 
The `set_parameters_as_dict` method updates parameters while the `set_parameters` method overrides the parameters.

ClearML does not automatically track changes to explicitly set parameters.

### User Properties
User properties do not impact task execution and can be modified at any stage. They are convenient for setting 
helpful values which are displayed in the [task table](../webapp/webapp_exp_table.md) (i.e. customize columns), 
making it easier to search / filter tasks. Add user properties to a task with the 
[`Task.set_user_properties`](../references/sdk/task.md#set_user_properties) method.

### Accessing Parameters

ClearML provides methods to directly access a task's logged parameters.

To get all of a task's parameters and properties (hyperparameters, configuration objects, and user properties), use 
[`Task.get_parameters()`](../references/sdk/task.md#get_parameters), which will return a dictionary with the parameters, 
including their subsections (see [WebApp sections](#webapp-interface) below). 

## WebApp Interface

Configurations can be viewed in web UI task pages, in the **CONFIGURATION** tab. 

The configuration panel is split into three sections according to type:
- **User Properties** - Modifiable section that can be edited post-execution
- **Hyperparameters** - Individual parameters for configuration
- **Configuration Objects** - Usually configuration files (JSON / YAML) or Python objects
  
These sections are further broken down into subsections based on how the parameters were logged (General / Args / TF_Define / Environment).

![Task hyperparameters sections](../img/hyperparameters_sections.png#light-mode-only)
![Task hyperparameters sections](../img/hyperparameters_sections_dark.png#dark-mode-only)


## SDK Interface

See the [Configuration section](../clearml_sdk/task_sdk.md#configuration) of the Task SDK page for an overview of basic Pythonic 
methods for working with hyperparameters.