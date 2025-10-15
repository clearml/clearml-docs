---
title: Custom Pod Manifests with String Templates
---

:::important Enterprise Feature
Customizing pod manifests with string templates is only supported by a ClearML Enterprise Server.
:::

When launching a Kubernetes Pod to execute a ClearML Task, the ClearML Agent supports string templates. Templates can reference
ClearML system objects and runtime configuration values, using the following format: `${CLEARML_<variable-specifier>:<default-value>}`.

For example, `"${CLEARML_TASK.project}"` will be replaced with the Task's project ID.

## Single-value Variables

These variables resolve to a single value. You can use them directly in a template, without specifying any path.

For example `"${CLEARML_QUEUE_NAME}"` will be replaced with the name of the queue from which the task was pulled.

Available single-value variables:
- `QUEUE_NAME` - Name of the queue from which the task is pulled
- `QUEUE_ID` - ID of the queue from which the task is pulled
- `WORKER_ID` - ID of the agent running the task

## Compound Variables (Path-Based)

These variables represent compound objects (mappings) for which you must specify a property path. Variable specifier is 
in the format `VARIABLE.path.to.property`. 

The following compound variables are supported:

- `TASK` - Represents the ClearML Task object `data` property (see [`Task.get_task()`](../references/sdk/task.md#taskget_task) 
  on how to get a task object in the SDK)
- `USER` - Represents the user data of the task's owner. In the ClearML SDK, use the following 
  command to get user data:
  ```  
  task.session.send_request("users", "get_current_user").json()['data']['user']`
  ```  
- `CONFIG` - Represents the task’s configuration, as loaded from local configuration and associated 
  user vaults. To get a section of the configuration object in the ClearML SDK, use `task.session.config.get("<section-name>")` 
  where `section-name` can be `sdk`, `agent`, or any other existing configuration section. You can also use custom fields 
  that you added to your vaults.
- `USER_VAULTS` - Similar to `CONFIG`, but only includes configuration loaded 
  from vaults applied for the user who’s the task owner.
- `PROVIDERS_INFO` - Contains user data retrieved from the identity provider (SSO), if configured on the ClearML Server.

## Examples

```
${CLEARML_TASK.name}
${CLEARML_TASK.id}
${CLEARML_TASK.project}
${CLEARML_TASK.hyperparams.properties.user_key.value}
```

## Default Fallback

Use a colon (`:`) to define a default fallback string for when the variable does not have a value.

For example:

```
${CLEARML_TASK.hyperparams.properties.user_key.value:myDefault}
```

If `user_key` is not set, the string will resolve to `myDefault`.


## Filter Operators

Templates also support filter operators that can modify the resulting value strings.

Filter operators are applied using a pipe (`|`) followed by the function name, in the format 
`"${CLEARML_<variable-specifier>...|op1|op2|op3(x)}"`. This is also compatible with default fallbacks.

### Available Operators

- `strip(chars)` - Remove the listed characters. For example, `strip(abcd)` removes `a`, `b`, `c` or `d`. Empty argument 
  will strip white-spaces.
- `capitalize` - Capitalize the string
- `lower` - Convert string to lowercase
- `remove_newlines` - Remove newlines
- `raw` - Keep newlines

When no filter operators are specified, `remove_newlines` operator is applied by default.

## Using Templates in ClearML Agent Helm Chart

String templates customization is supported under the `basePodTemplate` and `templateOverrides` properties of the ClearML 
Agent values.

For example:

```yaml
agentk8sglue:
  basePodTemplate:
    labels:
      myTaskName: "${CLEARML_TASK.name}"
      myProjectId: "${CLEARML_TASK.project}"
  queues:
    myQueueName:
      templateOverrides:
        labels:
          team: "green"
        env:
          - name: "userKey"
            value: "${CLEARML_USER_VAULTS.my_section.userKey:undefined_user_key}"
```