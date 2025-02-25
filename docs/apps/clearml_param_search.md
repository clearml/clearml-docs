---
title: ClearML Parameter Search CLI (HPO)
---

Use the `clearml-param-search` CLI tool to launch ClearML's automated hyperparameter optimization (HPO). This process finds 
the optimal values for your tasks' hyperparameters that yield the best performing models. 

## How Does `clearml-param-search` Work?

1. Execute `clearml-param-search`, specifying the base task whose parameters will be optimized, and a set of parameter 
   values and/or ranges to test. This creates an Optimization Task which manages the whole optimization process.
1. `clearml-param-search` creates multiple clones of the base task: each clone's parameters are set to values from the 
   specified parameter space.
1. Each clone is enqueued for execution by a [ClearML Agent](../clearml_agent.md).

The Optimization Task records and monitors the cloned tasks' configuration and execution details, and returns a summary 
of the optimization results in table and graph forms.

## Execution Configuration

### Command Line Options

<div className="tbl-cmd">

|Name | Description| Mandatory |
|---|----|---|
|`--args`| List of `<argument>=<value>` strings to pass to the remote execution. Currently only argparse/click/hydra/fire arguments are supported. Example: `--args lr=0.003 batch_size=64`|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--compute-time-limit`|The maximum compute time in minutes that a task can consume. If this time limit is exceeded, all jobs are aborted.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--max-iteration-per-job`|The maximum iterations (of the objective metric) per single job. When iteration maximum is exceeded, the job is aborted.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--max-number-of-concurrent-tasks`|The maximum number of concurrent Tasks running at the same time.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--min-iteration-per-job`|The minimum iterations (of the objective metric) per single job.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--local`| If set, run the tasks locally. Notice that no new Python environment will be created. The `--script` parameter must point to a local file entry point and all arguments must be passed with `--args`.| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--objective-metric-series`| Objective metric series to maximize/minimize (e.g. 'loss').|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--objective-metric-sign`| Optimization target, whether to maximize or minimize the value of the objective metric specified. Possible values: "min", "max", "min_global", "max_global". For more information, see [Optimization Objective](#optimization-objective). |<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--objective-metric-title`| Objective metric title to maximize/minimize (e.g. 'validation').|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--optimization-time-limit`|The maximum time (minutes) for the optimization to run. The default is `None`, indicating no time limit.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--optimizer-class`|The optimizer to use. Possible values are: OptimizerOptuna (default), OptimizerBOHB, GridSearch, RandomSearch. For more information, see [Supported Optimizers](../getting_started/hpo.md#supported-optimizers). |<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--params-search`|Parameters space for optimization. See more information in [Specifying the Parameter Space](#specifying-the-parameter-space). |<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--params-override`|Additional parameters of the base task to override for this parameter search. Use the following JSON format for each parameter: `{"name": "param_name", "value": <new_value>}`. Windows users, see [JSON format note](#json_note).|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />| 
|`--pool-period-min`|The time between two consecutive polls (minutes).|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project-name`|Name of the project in which the optimization task will be created. If the project does not exist, it is created. If unspecified, the repository name is used.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--queue`|Queue to enqueue the tasks on.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--save-top-k-tasks-only`| Keep only the top \<k\> performing tasks, and archive the rest of them. Input `-1` to keep all tasks. Default: `10`.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--script`|Script to run the parameter search on. Required unless `--task-id` is specified.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--task-id`|ID of a ClearML task whose hyperparameters will be optimized. Required unless `--script` is specified.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--task-name`|Name of the optimization task. If unspecified, the base Python script's file name is used.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--time-limit-per-job`|Maximum execution time per single job in minutes. When the time limit is exceeded, the job is aborted. Default: no time limit.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--total-max-jobs`|The total maximum jobs for the optimization process. The default value is `None` for unlimited.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

### Specifying the Parameter Space

To configure the parameter values to test in the hyperparameter optimization process, pass through the `--params-search` 
option the parameter search specification as a list of the parameters definitions. 

Use the following JSON format for each parameter:
```python
{
    "name": str,  # Name of the parameter you want to optimize
    "type": Union["LogUniformParameterRange", "UniformParameterRange", "UniformIntegerParameterRange", "DiscreteParameterRange"],
    # Additional fields depending on type - see below
}
```
The following are the parameter type options and their corresponding fields:

- `LogUniformParameterRange` 

    - `"min_value": float` - The minimum exponent sample to use for logarithmic uniform random sampling
    - `"max_value": float` - The maximum exponent sample to use for logarithmic uniform random sampling
    - `"base": Optional[float]` - The base used to raise the sampled exponent. Default: `10`
    - `"step_size": Optional[float]` - Step size (quantization) for value sampling. Default: `None`
    - `"include_max_value": Optional[bool]` - Whether to include the `max_value` in range. Default: `True`
- `UniformParameterRange`
    - `"min_value": float` - The minimum value to use for uniform random sampling
    - `"max_value": float` - The maximum sample to use for uniform random sampling
    - `"step_size": Optional[float]` - Step size (quantization) for value sampling. Default: `None`
    - `"include_max_value": Optional[bool]` - Whether to include the `max_value` in range. Default: `True`
- `UniformIntegerParameterRange`
    - `"min_value": float` - The minimum value to use for uniform random sampling
    - `"max_value": float`- The maximum value sample to use for uniform random sampling
    - `"step_size": Optional[int]` - Default: `1`
    - `"include_max_value": Optional[bool]` - Whether to include the `max_value` in range. Default: `True`
- `DiscreteParameterRange`
    - `"values": List[Any]`- A list of valid parameter values to sample from

For example: to specify a parameter search over uniform ranges of layer_1 and layer_2 sizes between 128 and 512 
(in jumps of 128) with varying batch sizes of 96, 128, and 160, use the following command:

<div className="wb-normal">

```bash
clearml-param-search --script keras_simple.py --params-search '{"type": "UniformIntegerParameterRange", "name": "General/layer_1", "min_value": 128, "max_value": 512, "step_size": 128}' '{"type": "UniformIntegerParameterRange", "name": "General/layer_2", "min_value": 128, "max_value": 512, "step_size": 128}' '{"type": "DiscreteParameterRange", "name": "General/batch_size", "values": [96, 128, 160]}' --params-override '{"name": "epochs", "value": 30}'  --objective-metric-title validation --objective-metric-series epoch_accuracy --objective-metric-sign max --optimizer-class OptimizerOptuna --queue default
```

<a id="json_note"/>

:::important JSON format for Windows Users
Windows users must add escapes (`\`) when using quotation marks (`"`) in JSON format inputs. For example: 

```bash
clearml-param-search --script base_template_keras_simple.py --params-search "{\"type\": \"UniformIntegerParameterRange\", \"name\": \"General/layer_1\", \"min_value\": 128, \"max_value\": 512, \"step_size\": 128}" "{\"type\": \"UniformIntegerParameterRange\", \"name\": \"General/layer_2\", \"min_value\": 128, \"max_value\": 512, \"step_size\": 128}" "{\"type\": \"DiscreteParameterRange\", \"name\": \"General/batch_size\", \"values\": [96, 128, 160]}" --params-override "{\"name\": \"epochs\", \"value\": 30}"  --objective-metric-title validation --objective-metric-series epoch_accuracy --objective-metric-sign max --optimizer-class OptimizerOptuna --max-iteration-per-job 30 --queue default
```
:::

</div>


### Optimization Objective

Use the `--objective-metric-sign` to specify which optimum your optimization process should use. The options are: 
* `min` - Least value of the specified objective metric reported at the end of the task
* `max` - Greatest value of the specified objective metric reported at the end of the task
* `min_global` - Least value of the specified objective metric reported at any time in the task
* `max_global` - Greatest value of the specified objective metric reported at any time in the task

