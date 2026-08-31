---
title: TaskScheduler
---

Use ClearML's [`TaskScheduler`](../references/sdk/scheduler.md) class to schedule tasks for one-off or recurring
execution at specified times and intervals. It's useful for automating routine operations like backups, report
generation, and periodic data or model updates.

:::tip[No-Code Alternative]
ClearML also provides a no-code [Task Scheduler app](../webapp/applications/apps_task_scheduler.md) (available under
the Enterprise Plan). See [Scheduling and Triggering Task Execution](../getting_started/task_trigger_schedule.md) for
an overview of both options.
:::

## Creating a Scheduler

```python
from clearml.automation import TaskScheduler

scheduler = TaskScheduler()
```

The scheduler itself is a `service` task: once started, it runs continuously, managing scheduled entries and
triggering them at the appropriate times.

If you instantiate a scheduler in a script that already initialized a task (with `Task.init`), that existing task
automatically becomes the scheduler's task. To force the creation of a new task instead, pass `force_create_task_name`
(and optionally `force_create_task_project` to set its project). If there's no existing task context and you don't
force task creation, `TaskScheduler` creates a new task called `Scheduler` in the `DevOps` project.

A running scheduler picks up added or modified scheduled entries without needing to be restarted: it periodically
syncs its configuration from the task in the ClearML Server (every 15 minutes by default). Use the
`sync_frequency_minutes` argument to change how often it syncs.

## Scheduling Tasks

Add entries to a `TaskScheduler` using [`add_task()`](../references/sdk/scheduler.md#add_task):

```python
scheduler.add_task(
    name="example schedule job",
    schedule_task_id="<TASK_ID>",
    queue="default",
    target_project=None,
    minute=30,
    hour=12,
    day=15,
    weekdays=None,
    month=1,
    year=None,
    limit_execution_time=None,
    single_instance=False,
    recurring=True,
    execute_immediately=False,
    reuse_task=False,
    task_parameters=None,
    task_overrides=None,
)
```

Each entry needs an **execution configuration** (what to run, where, and how) and **time parameters** (when to run
it).

### Execution Configuration

* `schedule_task_id` - ID of the ClearML task to execute.
* `schedule_function` - A callable to execute instead of a task. A scheduled function runs on the same machine and in
  the same context as the scheduler itself. Mutually exclusive with `schedule_task_id`; a `name` is required when
  scheduling a function.
* `queue` - The [ClearML queue](../fundamentals/agents_and_queues.md#what-is-a-queue) the scheduled task is pushed to
  (make sure a [ClearML Agent](../clearml_agent.md) is assigned to it).
* `name` - Name given to the task created at execution time. Use a unique, descriptive name if you're scheduling
  multiple entries, so they're easy to tell apart later. If not provided, the task ID is used. A name is required if
  you're scheduling a function.

`add_task()` also accepts options for controlling recurrence, task reuse, single-instance execution, execution time
limits, and parameter/configuration overrides for the launched task. See the
[TaskScheduler SDK reference page](../references/sdk/scheduler.md#add_task) for the complete list.

### Time Parameters

The time parameters (`minute`, `hour`, `day`, `month`, `year`, `weekdays`) follow these general guidelines:

* **One parameter alone** sets the interval between launches (with exceptions for `weekdays` and `year`, see below).
* **Multiple parameters together**: the longest unit sets the interval, and the shorter ones pin down the specific
  time within it. For example, `minute=30, hour=1` runs every hour, on the half hour.
* **Unspecified parameters** default to their lowest value for the scale being set. For example, `month=1, day=5`
  runs once a month, on the 5th, at 00:00 UTC, since `hour` and `minute` are left unspecified.

The `weekdays` parameter behaves differently: it takes a list of weekday names (e.g. `['monday', 'friday']`) and
schedules a weekly launch on those days. When `weekdays` is combined with `hour`:

* If `day=0`, `hour` sets a specific time of day on the given weekday(s).
* If `day` is omitted, `hour` sets the interval between launches on the given weekday(s).

`year` also has two modes:

* A value ≤ 100 is treated as an interval (in years).
* A value ≥ the current year is treated as a specific year.

:::note[Time Zone]
The TaskScheduler's time zone is always UTC.
:::

### Examples

* Launch every 30 minutes:
  ```python
  scheduler.add_task(schedule_task_id='1235', queue='default', minute=30)
  ```

* Launch every 1 hour:
  ```python
  scheduler.add_task(schedule_task_id='1235', queue='default', hour=1)
  ```

* Launch every 1 hour at hour:30 minutes (i.e. 1:30, 2:30 etc.):
  ```python
  scheduler.add_task(schedule_task_id='1235', queue='default', hour=1, minute=30)
  ```

* Launch every day at 22:30:
  ```python
  scheduler.add_task(schedule_task_id='1235', queue='default', minute=30, hour=22, day=1)
  ```

* Launch every other day at 7:30:
  ```python
  scheduler.add_task(schedule_task_id='1235', queue='default', minute=30, hour=7, day=2)
  ```

* Launch every Saturday at 8:30am (notice `day=0`):
  ```python
  scheduler.add_task(
      schedule_task_id='1235', queue='default', minute=30, hour=8, day=0, weekdays=['saturday']
  )
  ```

* Launch every 2 hours on the weekends Saturday/Sunday (notice `day` is omitted):
  ```python
  scheduler.add_task(
      schedule_task_id='1235', queue='default', hour=2, weekdays=['saturday', 'sunday']
  )
  ```

* Launch once a month, on the 5th of each month:
  ```python
  scheduler.add_task(schedule_task_id='1235', queue='default', month=1, day=5)
  ```

* Launch once a year, on March 4th:
  ```python
  scheduler.add_task(schedule_task_id='1235', queue='default', year=1, month=3, day=4)
  ```

## Running the Scheduler

Start the scheduler using one of the following:

* [`TaskScheduler.start()`](../references/sdk/scheduler.md#start) - Runs the loop locally.
* [`TaskScheduler.start_remotely()`](../references/sdk/scheduler.md#start_remotely) - Runs the loop remotely, on the
  queue specified by the method's `queue` argument (defaults to `services`). Make sure an agent is assigned to that
  queue.

:::note
The `queue` argument of `start_remotely()` controls where the **scheduler task itself** runs. It's independent of
each entry's `queue` argument in [`add_task()`](#execution-configuration), which controls where the **scheduled
tasks** it launches are enqueued.
:::

The scheduler periodically saves its internal state (such as each entry's last run time) to its task in the ClearML
Server. If the scheduler task is stopped and later re-enqueued, it restores this state on startup and resumes
scheduling from where it left off, without losing or re-triggering previously scheduled entries.

## Monitoring the Scheduler

While the scheduler is running, it reports two tables to its task's [**PLOTS**](../webapp/webapp_exp_track_visual.md#plots)
tab in the WebApp:
* **Schedule Tasks** - The current scheduling configuration, including each entry's next run time.
* **Executed Tasks** - Tasks the scheduler has already launched, and their start/finish times.

## SDK Reference

For detailed information, see the complete [TaskScheduler SDK reference page](../references/sdk/scheduler.md).
