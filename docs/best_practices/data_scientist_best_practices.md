---
title: Best Practices
---

This section talks about what made us design ClearML the way we did and how it reflects on AI workflows.
While ClearML was designed to fit into any workflow, the practices described below brings a lot of advantages from organizing one's workflow
to preparing it to scale in the long term.

:::important
The following is only an opinion. ClearML is designed to accommodate any workflow whether it conforms to our way or not!
:::

## Develop Locally

**Work on a machine that is easily manageable!** 

During early stages of model development, while code is still being modified heavily, this is the usual setup we'd expect to see used by data scientists:

  - **Local development machine**, usually a laptop (and usually using only CPU) with a fraction of the dataset for faster 
    iterations. Use a local machine for writing, training, and debugging pipeline code. 
  - **Workstation with a GPU**, usually with a limited amount of memory for small batch-sizes. Use this workstation to train 
    the model and ensure that you choose a model that makes sense, and the training procedure works. Can be used to provide initial models for testing. 

These setups can be folded into each other and that's great! If you have a GPU machine for each researcher, that's awesome! 
The goal of this phase is to get a code, dataset, and environment set up, so you can start digging to find the best model!

- [ClearML SDK](../clearml_sdk/clearml_sdk.md) should be integrated into your code (check out [ClearML Setup](../clearml_sdk/clearml_sdk_setup.md)). 
  This helps visualizing the results and tracking progress.
- [ClearML Agent](../clearml_agent.md) helps moving your work to other machines without the hassle of rebuilding the environment every time, 
  while also creating an easy queue interface that easily lets you drop your tasks to be executed one by one
  (great for ensuring that the GPUs are churning during the weekend).
- [ClearML Session](../apps/clearml_session.md) helps with developing on remote machines, in the same way that you'd develop on your local laptop!

## Train Remotely

In this phase, you scale your training efforts, and try to come up with the best code / parameter / data combination that 
yields the best performing model for your task!

  - The real training (usually) should **not** be executed on your development machine.
  - Training sessions should be launched and monitored from a web UI.
  - You should continue coding while tasks are being executed without interrupting them.
  - Stop optimizing your code because your machine struggles, and run it on a beefier machine (cloud / on-prem).

Visualization and comparison dashboards keep your sanity at bay! At this stage you usually have a docker container with all the binaries 
that you need. 
- [ClearML SDK](../clearml_sdk/clearml_sdk.md) ensures that all the metrics, parameters and Models are automatically logged and can later be 
  accessed, [compared](../webapp/webapp_exp_comparing.md) and [tracked](../webapp/webapp_exp_track_visual.md).
- [ClearML Agent](../clearml_agent.md) does the heavy lifting. It reproduces the execution environment, clones your code, 
  applies code patches, manages parameters (including overriding them on the fly), executes the code, and queues multiple tasks.
  It can even [build](../../clearml_agent/clearml_agent_docker_exec#exporting-a-task-into-a-standalone-docker-container) the docker container for you!  
- [ClearML Pipelines](../pipelines/pipelines.md) ensure that steps run in the same order, 
  programmatically chaining tasks together, while giving an overview of the execution pipeline's status.

**Your entire environment should magically be able to run on any machine, without you working hard.** 

## Track EVERYTHING

Track everything--from obscure parameters to weird metrics, it's impossible to know what will end up
improving your results later on!

- Make sure tasks are reproducible! ClearML logs code, parameters, and environment in a single, easily searchable place. 
- Development is not linear. Configuration / Parameters should not be stored in your git, as
  they are temporary and constantly changing. They still need to be logged because who knows, one day...
- Uncommitted changes to your code should be stored for later forensics in case that magic number actually saved the day. Not every line change should be committed.
- Mark potentially good tasks, make them the new baseline for comparison.

## Visibility Matters

While you can track tasks with one tool, and pipeline them with another, having 
everything under the same roof has its benefits! 

Being able to track task progress and compare tasks, and, based on that, send tasks to execution on remote
machines (that also build the environment themselves) has tremendous benefits in terms of visibility and ease of integration.

Being able to have visibility in your pipeline, while using tasks already defined in the platform, 
enables users to have a clearer picture of the pipeline's status 
and makes it easier to start using pipelines earlier in the process by simplifying chaining tasks.

Managing datasets with the same tools and APIs that manage the tasks also lowers the barrier of entry into 
task and data provenance.
