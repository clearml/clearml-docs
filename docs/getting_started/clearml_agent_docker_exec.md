---
title:   Building Executable Task Containers
---

## Exporting a Task into a Standalone Docker Container

### Task Container

Build a Docker container that when launched executes a specific task, or a clone (copy) of that task.

- Build a Docker container that at launch will execute a specific Task:

  ```bash
  clearml-agent build --id <task-id> --docker --target <new-docker-name> --entry-point reuse_task
  ```

- Build a Docker container that at launch will clone a Task specified by Task ID, and will execute the newly cloned Task:

  ```bash
  clearml-agent build --id <task-id> --docker --target <new-docker-name> --entry-point clone_task
  ```

- Run built Docker by executing:

  ```bash
  docker run <new-docker-name>
  ```

Check out [this tutorial](../guides/clearml_agent/executable_exp_containers.md) for building executable task 
containers.
