---
title: Building Pipelines
---


Pipelines are a way to streamline and connect multiple processes, plugging the output of one process as the input of another.

ClearML Pipelines are implemented by a Controller Task that holds the logic of the pipeline steps' interactions. The 
execution logic controls which step to launch based on parent steps completing their execution. Depending on the 
specifications laid out in the controller task, a step's parameters can be overridden, enabling users to leverage other 
steps' execution products such as artifacts and parameters.

When run, the controller will sequentially launch the pipeline steps. Pipelines can be executed locally or 
on any machine using the [clearml-agent](../clearml_agent.md).

ClearML pipelines are created from code using one of the following:
* [PipelineController class](../pipelines/pipelines_sdk_tasks.md) - A pythonic interface for defining and configuring the 
  pipeline controller and its steps. The controller and steps can be functions in your Python code or existing ClearML tasks.
* [PipelineDecorator class](../pipelines/pipelines_sdk_function_decorators.md) - A set of Python decorators which transform 
  your functions into the pipeline controller and steps

For more information, see [ClearML Pipelines](../pipelines/pipelines.md).

![Pipeline DAG](../img/webapp_pipeline_DAG.png#light-mode-only)
![Pipeline DAG](../img/webapp_pipeline_DAG_dark.png#dark-mode-only)