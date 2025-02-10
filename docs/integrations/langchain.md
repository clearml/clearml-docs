---
title: LangChain
---

:::tip
If you are not already using ClearML, see [Getting Started](../getting_started/ds/ds_first_steps.md) for setup 
instructions.
:::

[LangChain](https://github.com/langchain-ai/langchain) is a popular framework for developing applications powered by 
language models. You can integrate ClearML into your LangChain code using the built-in `ClearMLCallbackHandler`. This 
class is used to create a ClearML Task to log LangChain assets and metrics. 

Integrate ClearML with the following steps:
1. Set up the `ClearMLCallbackHandler`. The following code creates a [ClearML Task](../fundamentals/task.md) called 
   `llm` in the `langchain_callback_demo` project, which captures your script's information, including Git details, 
   uncommitted code, and Python environment: 
   ```python
   from langchain.callbacks import ClearMLCallbackHandler
   from langchain_openai import OpenAI

   # Set up and use the ClearML Callback
   clearml_callback = ClearMLCallbackHandler(
      task_type="inference",
      project_name="langchain_callback_demo",
      task_name="llm",
      tags=["test"],
      # Change the following parameters based on the amount of detail you want tracked
      visualize=True,
      complexity_metrics=True,
      stream_logs=True,
   )

   llm = OpenAI(temperature=0, callbacks=[clearml_callback])
   ```
   You can also pass the following parameters to the `ClearMLCallbackHandler` object:
   * `task_type` – The type of ClearML task to create (see [task types](../fundamentals/task.md#task-types))
   * `tags` – A list of tags to add to the task
   * `visualize` - Set to `True` for ClearML to capture the run's Dependencies and Entities plots to the ClearML task
   * `complexity_metrics` - Set to `True` to log complexity metrics
   * `stream_logs` - Set to `True` to stream callback actions to ClearML Parameters.
1. Use `ClearMLCallbackHandler.flush_tracker()` after each model request to make sure all outputs, including metrics and
   prompts, are logged to ClearML:

   ```python
   llm_result = llm.generate(["Tell me a joke", "Tell me a poem"] * 3)

   clearml_callback.flush_tracker(langchain_asset=llm, name="simple_sequential")
   ```   

   Specify the following parameters: 
   * `name` - A string identifying a context for the logged information (Tip: Use different names to log different model 
      conversations).
   * `langchain_asset` - The LangChain asset to save. This can also be a LangChain agent, and ClearML will track its results.
   * `finish` - Set to `True` to close the ClearML task after logging. If set to `True`, the Callback cannot be used anymore.

## Additional Logging Options
To augment its automatic logging, ClearML also provides an explicit logging interface.

See more information about explicitly logging information to a ClearML Task:
* [Models](../clearml_sdk/model_sdk.md#manually-logging-models)
* [Configuration](../clearml_sdk/task_sdk.md#configuration) (e.g. parameters, configuration files)
* [Artifacts](../clearml_sdk/task_sdk.md#artifacts) (e.g. output files or Python objects created by a task)
* [Scalars](../clearml_sdk/task_sdk.md#scalars) 
* [Text/Plots/Debug Samples](../fundamentals/logger.md#manual-reporting)

See [Explicit Reporting Tutorial](../guides/reporting/explicit_reporting.md).
