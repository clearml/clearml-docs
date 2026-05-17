---
title: Slurm User Impersonation
---

:::important[Enterprise Feature]
Slurm Glue is available under the ClearML Enterprise plan.
:::

By default, the ClearML Agent Slurm Glue submits jobs to Slurm as the Linux user running the glue process.

User impersonation allows the agent to submit each job as the Linux user that corresponds to the ClearML user who 
enqueued the task.

This is configured by mapping ClearML user IDs to Linux usernames.

## Configuration

Add a `user_map` section under `agent.slurm` in your `clearml.conf`:

```yaml
agent {
  slurm {
    user_map {
      "9848dbd7715a4ecba0ef232cd2e3dca3" = "alice"
      "b3f1c2d4e5a6789012345678abcdef01" = "bob"
      "default" = "defaultlinuxuser"
    }
  }
}
```

* Each key is a ClearML user ID. To find a ClearML user's ID, go to the ClearML WebApp under **Settings > Users**.
* Each value is a Linux username on the cluster.
* The `"default"` key defines a fallback for any ClearML user not explicitly listed.

### Behavior

* If `user_map` is empty or not provided, no impersonation occurs. Jobs are submitted as the agent process user.
* If a ClearML user ID is not in the map and no `"default"` is defined, the task is **rejected and not submitted to slurm**.
* If a task has no associated ClearML user ID, the `"default"` entry is used. If a `default` was not provided, the task 
  is rejected.

## Vault Override

You can define `agent.slurm.user_map` in a [Configuration Vault](../webapp/settings/webapp_settings_admin_vaults.md).

A vault’s `user_map` takes precedence over a `clearml.conf` map, including an empty vault map. An empty vault map 
disables impersonation even if `clearml.conf` has a non-empty map. This lets you update user mappings without restarting 
the glue process, and enables per-user overrides by configuring individual personal vaults.
