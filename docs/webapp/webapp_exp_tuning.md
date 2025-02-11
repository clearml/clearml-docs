---
title: Tuning Tasks
---

Tune tasks and edit their execution details, then execute the tuned tasks on local or remote machines.

## To Tune a Task and Execute it Remotely:

1. Locate the task. Open the task's Project page from the Dashboard or the main Projects page.

    * On the Dashboard,
      * Click on a task from RECENT TASKS
      * In RECENT PROJECTS **>** click on a project card **>** click task
      * In RECENT PROJECTS **>** click **VIEW ALL** **>** click the project card **>** click task
    * On the Projects page, click project card, or the **All projects** card **>** click task

1. Clone the task. In the task table:

    1. Click **Clone**, and a **Clone task** box will pop up.
    1. In the **Project** textbox, select or create a project. To search for another project, start typing the project name.
       To create a new project, type new task name and click **Create New**.
    1. Enter an optional description.
    1. Click **CLONE**.

    The cloned task's status is now *Draft*.

1. Edit the task. See [modifying tasks](#modifying-tasks).

1. Enqueue the task for execution. Right-click the task **>** **Enqueue** **>** Select a queue **>**
   **ENQUEUE**.

    The task's status becomes *Pending*. When the worker assigned to the queue fetches the task, its
   status becomes *Running*. The task can now be tracked and its results visualized.

## Modifying Tasks

Tasks whose status is *Draft* are editable (see the [user properties](#user-properties) exception). In the **ClearML
Web UI**, edit any of the following

* [Source code](#source-code)
* [Output destination for artifacts](#output-destination)
* [Default container](#default-container)
* [Hyperparameters](#hyperparameters) - Parameters, TensorFlow Definitions, command line options, environment variables, and user-defined properties

:::note
User parameters are editable in any task, except those whose status is *Published* (read-only).
:::

* [Configuration objects](#configuration-objects) - Task model description
* [Initial weight input model](#initial-weights-input-model)
* [Output destination for artifacts storage](#output-destination)

### Execution Details



#### Source Code

Modify code execution by changing any of the following:

* Repository, commit (select by ID, tag name, or choose the last commit in the branch), script, working directory, 
and/or binary.
* The Python packages to be installed and/or their versions - Edit the package list, or clear it to have the ClearML 
Agent either not install any packages or use an existing repo `requirements.txt` file. If the task is based on a 
run in which the packages used were eventually different to the ones originally specified, you can easily or reset the 
packages to originally recorded values ("Original Pip").
* Uncommitted changes - Edit or clear all.

**To modify the source code**, hover over the relevant sections in the **EXECUTION** tab to access Edit, Clear/Discard, 
and/or Reset functions.



#### Default Container
Select a pre-configured container that the [ClearML Agent](../clearml_agent.md) will use to remotely execute this task (see [Building Docker containers](../clearml_agent/clearml_agent_docker.md)).

**To add, change, or delete a default container:**

* In **EXECUTION** **>** **CONTAINER** **>** hover **>** **EDIT** **>**
  Enter the default container image.

:::important 
For a ClearML Agent to execute the task in a container, the agent must be running in 
[Docker Mode](../clearml_agent/clearml_agent_execution_env.md#docker-mode):

```bash
clearml-agent daemon --queue <execution_queue_to_pull_from> --docker [optional default container image to use]
```

:::

#### Output Destination

Set an output destination for model checkpoints (snapshots) and other artifacts. Examples of supported types of destinations
and formats for specifying locations include:

* A shared folder: `/mnt/share/folder`
* S3: `s3://bucket/folder`
* Non-AWS S3-like services (e.g. MinIO): `s3://host_addr:port/bucket`. **Note that port specification is required**. 
* Google Cloud Storage: `gs://bucket-name/folder`
* Azure Storage: `azure://<account name>.blob.core.windows.net/path/to/file`

**To add, change, or delete an artifact output destination:**

* In **EXECUTION** **>** **OUTPUT** > **DESTINATION** **>** hover **>** **EDIT** **>** edit **>** **SAVE**.


:::note Set Output Destination for Artifacts
Also set the output destination for artifacts in code (see the `output_uri` parameter of the
[`Task.init`](../references/sdk/task.md#taskinit)
method), and in the ClearML configuration file 
for all tasks (see [`default_output_uri`](../configs/clearml_conf.md#config_default_output_uri)
on the ClearML Configuration Reference page).
:::

### Configuration



#### Hyperparameters

Add, change, or delete hyperparameters, which are organized in the **ClearML Web UI** in the following sections:

* **Args** - Automatically logged argument parser parameters (e.g. `argparse`, `click`, `hydra`).

* **TF_DEFINE** - TensorFlow definitions (from code, TF_DEFINEs automatic logging).

* **General** - Parameter dictionaries (from code, connected to the Task by calling [`Task.connect()`](../references/sdk/task.md#connect)).

* Environment variables - Tracked if variables were listed in the `CLEARML_LOG_ENVIRONMENT` environment variable 
or the [`sdk.development.log_os_environments`](../configs/clearml_conf.md#log_env_var) field of the `clearml.conf` file (see this [FAQ](../faq.md#track-env-vars)).

* Custom named parameter groups (see the `name` parameter in [`Task.connect`](../references/sdk/task.md#connect)).

**To add, change, or delete hyperparameters:**

* In the **CONFIGURATION** tab **>** **HYPERPARAMETERS** **>** parameter group **>** hover **>** click **EDIT** **>** add, change,
  or delete keys and/or values **>** click **SAVE**.



#### User Properties

User properties allow storing any descriptive information in key-value pair format. They are editable in any task,
except those whose status is *Published* (read-only).

**To add, change, or delete user properties:**

* In **CONFIGURATION** **>** **USER PROPERTIES** **>** **Properties** **>** hover **>** click **EDIT** **>** add, change, or delete
  keys and/or values **>** click **SAVE**.



#### Configuration Objects

**To add, change, or delete the Task model configurations:**

* In **CONFIGURATION** **>** **CONFIGURATION OBJECTS** **>** object name **>** hover **>** **EDIT** or **CLEAR** (if the
  configuration is not empty).

### Artifacts

#### Initial Weights Input Model

Edit model configuration and label enumeration, choose a different initial input weight model for the same project or any
other project, or remove the model.

:::note
The models are editable in the **MODELS** tab, not the **TASKS** tab. Clicking the model name hyperlink shows the
model in the **MODELS** tab.
:::

**To select a different model:**

1. In **ARTIFACTS** **>** **Input Model** **>** Hover and click **EDIT**.
1. If a model is associated with the task, click <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" />.
1. In the **SELECT MODEL** dialog, select a model from the current project or any other project.

**To edit a model's configuration or label enumeration:**

1. Click the model name hyperlink. The model details appear in the **MODELS** tab.
1. Edit the model configuration or label enumeration:

    * Model configuration - In the **NETWORK** tab **>** Hover and click **EDIT**. **>** CLick **EDIT** or **CLEAR** (to
      remove the configuration).

       Users can also search for the configuration (hover over the configuration textbox, the search box appears) and copy the
      configuration to the clipboard (hover and click <img src="/docs/latest/icons/ico-copy-to-clipboard.svg" alt="Copy Clipboard" className="icon size-md" />).

    * Label enumeration - In the **LABELS** tab **>** Hover and click **EDIT** **>** Add, change, or delete label
      enumeration key-value pairs.

**To remove a model from a task:**

* Hover and click **EDIT** **>** Click <img src="/docs/latest/icons/ico-trash.svg" alt="Trash" className="icon size-md" />
