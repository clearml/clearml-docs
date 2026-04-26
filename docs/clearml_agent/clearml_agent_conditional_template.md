---
title: Conditional Templates
---

:::important[Enterprise Feature]
Conditional Templates are only supported by a ClearML Enterprise Server.
:::

Conditional Templates let you apply Kubernetes pod template overrides only when a specified Task field condition is met. 
When the condition matches the Task being created, the override is applied.

Conditional templates are configured through the `CLEARML_K8S_GLUE_COND_CUST_TEMPLATE` environment variable, whose value must be in
`condition|template` format:

- **Condition** — Field in the Task object that is created.  
- **Template** — [HOCON](https://github.com/lightbend/config/blob/main/HOCON.md) snippet that defines Pod template fields.  
- **Separator** — Condition and template are separated by a pipe (`|`).  

:::note
Conditional Templates do not support overriding list fields such as `spec.containers[0]`.
:::

## Example Configuration

```yaml
agentk8sglue:
  extraEnvs:
    - name: CLEARML_K8S_GLUE_COND_CUST_TEMPLATE
      value: 'run_by_app.category="AI dev"|{metadata.annotations:{"clearml-app-category":"AI dev"},spec.serviceAccountName:"my-service-account"}'
```

In this example:
* The condition is `run_by_app.category="AI dev"`. 
* When a Task with the `run_by_app.category` field with the value `"AI dev"` is created, the template is applied:
  * Adds an annotation `clearml-app-category: AI dev`
  * Sets the pod's `serviceAccountName` to `my-service-account`



