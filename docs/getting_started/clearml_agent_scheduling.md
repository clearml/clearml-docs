---
title: Managing Agent Work Schedules
---

:::important Enterprise Feature
This feature is available under the ClearML Enterprise plan.
:::

The Agent scheduler enables scheduling working hours for each Agent. During working hours, a worker will actively poll 
queues for Tasks, fetch and execute them. Outside working hours, a worker will be idle.

Schedule workers by:

* Setting configuration file options
* Running `clearml-agent` from the command line (overrides configuration file options)

Override worker schedules by:

* Setting runtime properties to force a worker on or off
* Tagging a queue on or off

## Running clearml-agent with a Schedule (Command Line)

Set a schedule for a worker from the command line when running `clearml-agent`. Two properties enable setting working hours:

:::warning
Use only one of these properties
:::

* `uptime` - Time span during which a worker will actively poll a queue(s) for Tasks, and execute them. Outside this 
  time span, the worker will be idle.
* `downtime` - Time span during which a worker will be idle. Outside this time span, the worker will actively poll and 
  execute Tasks.

Define `uptime` or `downtime` as `"<hours> <days>"`, where:

* `<hours>` - A span of hours (`00-23`) or a single hour. A single hour defines a span from that hour to midnight. 
* `<days>` - A span of days (`SUN-SAT`) or a single day.

Use `-` for a span, and `,` to separate individual values. To span before midnight to after midnight, use two spans.

For example:

* `"20-23 SUN"` - 8 PM to 11 PM on Sundays.
* `"20-23 SUN,TUE"` - 8 PM to 11 PM on Sundays and Tuesdays.
* `"20-23 SUN-TUE"` - 8 PM to 11 PM on Sundays, Mondays, and Tuesdays.
* `"20 SUN"` - 8 PM to midnight on Sundays.
* `"20-00,00-08 SUN"` - 8 PM to midnight and midnight to 8 AM on Sundays
* `"20-00 SUN", "00-08 MON"` - 8 PM on Sundays to 8 AM on Mondays (spans from before midnight to after midnight).

## Setting Worker Schedules in the Configuration File

Set a schedule for a worker using configuration file options. The options are:

:::warning
Use only one of these properties
:::

* ``agent.uptime``
* ``agent.downtime``

Use the same time span format for days and hours as is used in the command line.

For example, set a worker's schedule from 5 PM to 8 PM on Sunday through Tuesday, and 1 PM to 10 PM on Wednesday.

```
agent.uptime: ["17-20 SUN-TUE", "13-22 WED"]
```

## Overriding Worker Schedules Using Runtime Properties

Runtime properties override the command line uptime / downtime properties. The runtime properties are:

:::warning
Use only one of these properties
:::

* `force:on` - Pull and execute Tasks until the property expires.
* `force:off` - Prevent pulling and execution of Tasks until the property expires.

Currently, these runtime properties can only be set using an ClearML REST API call to the `workers.set_runtime_properties`
endpoint, as follows: 

* The body of the request must contain the `worker-id`, and the runtime property to add.
* An expiry date is optional. Use the format `"expiry":<time>`. For example,  `"expiry":86400` will set an expiry of 24 hours.
* To delete the property, set the expiry date to zero, `"expiry":0`.

For example, to force a worker on for 24 hours:

```
curl --user <key>:<secret> --header "Content-Type: application/json" --data '{"worker":"<worker_id>","runtime_properties":[{"key": "force", "value": "on", "expiry": 86400}]}' http://<api-server-hostname-or-ip>:8008/workers.set_runtime_properties
```

## Overriding Worker Schedules Using Queue Tags

Queue tags override command line and runtime properties. The queue tags are the following:

:::warning
Use only one of these properties
:::

* ``force_workers:on`` - Any worker listening to the queue will keep pulling Tasks from the queue.
* ``force_workers:off`` - Prevent all workers listening to the queue from pulling Tasks from the queue.

Currently, you can set queue tags using an ClearML REST API call to the ``queues.update`` endpoint, or the 
APIClient. The body of the call must contain the ``queue-id`` and the tags to add.

For example, force workers on for a queue using the APIClient:

```python
from clearml.backend_api.session.client import APIClient

client = APIClient()
client.queues.update(queue="<queue_id>", tags=["force_workers:on"])
```

Or, force workers on for a queue using the REST API:

```bash
curl --user <key>:<secret> --header "Content-Type: application/json" --data '{"queue":"<queue_id>","tags":["force_workers:on"]}' http://<api-server-hostname-or-ip>:8008/queues.update
```
