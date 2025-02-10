---
title: Best Practices
---

In short - **automate everything** :)
From training models to data processing to deploying to production.

## Development - Preparing for Automation
Basically, track everything. There is nothing that is not worth having visibility to.
If you are afraid of clutter, use the archive option, and set up your own [cleanup service](../../guides/services/cleanup_service.md).

- Track the code base. There is no reason not to add metrics to any process in your workflow, even if it is not directly ML. Visibility is key to iterative improvement of your code / workflow.
- Create per-project [leaderboards](../../guides/ui/building_leader_board.md) based on custom columns 
  (hyperparameters and performance accuracy), and bookmark them (full URL will always reproduce the same view and table).
- Share tasks with your colleagues and team-leaders. 
  Invite more people to see how your project is progressing, and suggest they add metric reporting for their own.
  These metrics can later be part of your own in-house monitoring solution, don't let good data go to waste :)

## Clone Tasks
Define a ClearML Task with one of the following options:
- Run the actual code with the `Task.init()` call. This will create and auto-populate the Task in CleaML (including Git Repo / Python Packages / Command line etc.).
- Register local / remote code repository with `clearml-task`. See [details](../../apps/clearml_task.md).

Once you have a Task in ClearML, you can clone and edit its definitions in the UI, then launch it on one of your nodes with [ClearML Agent](../../clearml_agent.md).

## Advanced Automation
- Create daily / weekly cron jobs for retraining best performing models on.
- Create data monitoring & scheduling and launch inference jobs to test performance on any new coming dataset.
- Once there are two or more tasks that run after another, group them together into a [pipeline](../../pipelines/pipelines.md).

## Manage Your Data
Use [ClearML Data](../../clearml_data/clearml_data.md) to version your data, then link it to running tasks for easy reproduction.
Make datasets machine agnostic (i.e. store original dataset in a shared storage location, e.g. shared-folder / S3 / Gs / Azure).
ClearML Data supports efficient Dataset storage and caching, differentiable and compressed.

## Scale Your Work
Use [ClearML Agent](../../clearml_agent.md) to scale work. Install the agent machines (remote or local) and manage
training workload with it. 

Improve team collaboration by transparent resource monitoring, always know what is running where.
