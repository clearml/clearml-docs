---
title: UI Customization
---

:::important[Enterprise Feature]
The UI Customization admin settings page is available under the ClearML Enterprise plan.
:::

## Task Clone Name Template

Control the template used to provide default suggestions for [cloning tasks](../webapp_exp_reproducing.md) e.g. `"Clone Of <Original task name>"`. 

The template supports dynamic variable references that are filled in when a task is cloned:
* `${name}` - The original task’s name
* `${date}` – The time the clone was created (e.g. `21/3/2025 12:45:15`)

## Hyper-Dataset New Version Name Template
Control the default name assigned to a new Hyper-Dataset version when it is created.

The template supports dynamic variables that are filled when a version is created:
* `${dataset}` - The dataset name
* `${version}` - The parent version name
* `${date}` - The version creation time (e.g., `21/3/2025 12:45:15`)
