---
title: TriggerScheduler
---

Use ClearML's [`TriggerScheduler`](../references/sdk/trigger.md) class to trigger task execution automatically in
response to events in your workspace, for example:

* Launching a training task when a dataset is tagged `latest`
* Running an inference task when a model is published
* Retraining a model when its accuracy drops below a threshold

:::tip[No-Code Alternative]
ClearML also provides a no-code [Trigger Manager app](../webapp/applications/apps_trigger_manager.md) (available
under the Enterprise Plan). See [Scheduling and Triggering Task Execution](../getting_started/task_trigger_schedule.md)
for an overview of both options.
:::

## Creating a Scheduler

```python
from clearml.automation import TriggerScheduler

trigger_scheduler = TriggerScheduler(
    pooling_frequency_minutes=3.0,
    sync_frequency_minutes=15,
)
```

The scheduler itself is a `service` task: once started, it continuously polls your workspace for the events you
configure it to watch, and launches a task (or calls a function) whenever one occurs.

If you instantiate a scheduler in a script that already initialized a task (with `Task.init`), that existing task
automatically becomes the scheduler's task. To force the creation of a new task instead, pass `force_create_task_name`
(and optionally `force_create_task_project` to set its project). If there's no existing task context and you don't
force task creation, `TriggerScheduler` creates a new task called `Scheduler` in the `DevOps` project.

A running scheduler picks up added or modified triggers without needing to be restarted: it periodically syncs its
configuration from the task in the ClearML Server (every 15 minutes by default). Independently, it polls your
workspace for events on its own interval (every 3 minutes by default). Use the `sync_frequency_minutes` and
`pooling_frequency_minutes` arguments to change these.

## Defining Triggers

Choose a trigger type based on the kind of resource you want to watch:

* **Dataset** - [`add_dataset_trigger()`](../references/sdk/trigger.md#add_dataset_trigger)
* **Model** - [`add_model_trigger()`](../references/sdk/trigger.md#add_model_trigger)
* **Task** - [`add_task_trigger()`](../references/sdk/trigger.md#add_task_trigger)

Each trigger needs an **execution configuration** (what to run, where, and how) and **trigger conditions** (what to
watch for).

### Execution Configuration

These parameters are shared by all three trigger types, and define the task or function that runs when a trigger
fires, and how it's launched:

* `schedule_task_id` - ID of the ClearML task to execute.
* `schedule_function` - A callable to execute instead of a task. A scheduled function runs on the same machine and in
  the same context as the scheduler itself.
* `schedule_queue` - The [ClearML queue](../fundamentals/agents_and_queues.md#what-is-a-queue) the triggered task is
  pushed to (make sure a [ClearML Agent](../clearml_agent.md) is assigned to it).
* `name` - Name given to the task created when the trigger fires. Always give a trigger a unique, descriptive name:
  it's used to match entries when the scheduler syncs its configuration, and (unless overridden) as the tag applied
  to the triggered task via `add_tag`.

The trigger methods also accept options for the target project, tagging the triggered task, single-instance
execution, task reuse, and parameter/configuration overrides. See the
[TriggerScheduler SDK reference page](../references/sdk/trigger.md#add_task_trigger) for the complete list.

### Trigger Conditions

These parameters define the event that fires the trigger.

Common to all three trigger types:
* `trigger_project` - Only watch resources in this project (not recursive).
* `trigger_name` - Only watch resources whose name matches this regular expression.
* `trigger_on_tags` - Fire when all of the listed tags are present.
* `trigger_required_tags` - Additionally require these tags to be present.

Dataset and model triggers also support:
* `trigger_on_publish` / `trigger_on_archive` - Fire when the resource is published / archived.

Task triggers additionally support:
* `trigger_on_status` - Fire on a task status change, for example `trigger_on_status=['failed', 'published']`.
* `trigger_on_metric` / `trigger_on_variant` / `trigger_on_threshold` / `trigger_on_sign` - Fire when a specific
  metric crosses a threshold. `trigger_on_metric` and `trigger_on_variant` identify the metric's title and variant,
  `trigger_on_threshold` sets the value to compare against, and `trigger_on_sign` (`'max'` or `'min'`) sets whether
  the trigger fires when the metric goes above or below it.
* `trigger_exclude_dev_tasks` - If `True`, only fire for tasks executed by a [`clearml-agent`](../clearml_agent.md),
  skipping manually-run tasks.

### Examples

#### Example: Retrain When a Dataset Is Tagged

This example launches a training task whenever a dataset in `My Project` is tagged `latest`.

```python
trigger_service.add_dataset_trigger(
    name="retrain-on-latest-dataset",
    trigger_project="My Project",
    trigger_on_tags=["latest"],       # trigger when ALL listed tags are present
    schedule_task_id="<training_task_id>",
    schedule_queue="gpu-workers",
)
```

#### Example: Trigger on a Metric Threshold

This example launches a retraining task whenever a monitored task's `accuracy` metric drops below `0.85`.

```python
trigger_service.add_task_trigger(
    name="retrain-on-accuracy-drop",
    trigger_project="My Project",
    trigger_on_metric="performance",
    trigger_on_variant="accuracy",
    trigger_on_threshold=0.85,
    trigger_on_sign="min",             # fire when metric goes BELOW threshold
    schedule_task_id="<training_task_id>",
    schedule_queue="default",
)
```

## Running the Scheduler

Start the scheduler using one of the following:

* [`TriggerScheduler.start()`](../references/sdk/trigger.md#start) - Runs the loop locally.
* [`TriggerScheduler.start_remotely()`](../references/sdk/trigger.md#start_remotely) - Runs the loop remotely, on the
  queue specified by the method's `queue` argument (defaults to `services`). Make sure an agent is assigned to that
  queue.

:::note
The `queue` argument of `start_remotely()` controls where the **scheduler task itself** runs. It's independent of
each trigger's `schedule_queue` argument (see [Execution Configuration](#execution-configuration)), which controls
where the **triggered tasks** are enqueued.
:::

The scheduler periodically saves its internal state (including which objects already triggered it) to its task in
the ClearML Server. If the scheduler task is stopped and later re-enqueued, it restores this state on startup and
resumes from where it left off, without re-triggering on objects it already handled.

## Monitoring the Scheduler

While the scheduler is running, it reports the following tables to its task's
[**PLOTS**](../webapp/webapp_exp_track_visual.md#plots) tab in the WebApp:
* **Triggers Executed** - Tasks the scheduler has already launched, and their start/finish times.
* **Model Triggers** / **Dataset Triggers** / **Task Triggers** - The current configuration of each defined trigger
  (each table only appears once at least one trigger of that type is defined).

## SDK Reference

For detailed information, see the complete [TriggerScheduler SDK reference page](../references/sdk/trigger.md).
