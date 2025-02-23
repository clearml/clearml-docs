---
title: Building Task Execution Environments in Docker
---

### Base Docker Container

Build a Docker container according to the execution environment of a specific task.

```bash
clearml-agent build --id <task-id> --docker --target <new-docker-name>
```

You can add the Docker container as the base Docker image to a task, using one of the following methods:

- Using the **ClearML Web UI** - See [Default Container](../webapp/webapp_exp_tuning.md#default-container).
- In the ClearML configuration file - Use the ClearML configuration file [`agent.default_docker`](../configs/clearml_conf.md#agentdefault_docker)
  options.

Check out [this tutorial](../guides/clearml_agent/exp_environment_containers.md) for building a Docker container 
replicating the execution environment of an existing task.