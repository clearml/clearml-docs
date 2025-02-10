---
title: ClearML Task CLI
---

Using only the command line and **zero** additional lines of code, easily track your work and integrate ClearML with your 
existing code.

`clearml-task` automatically imports any script or Python repository into ClearML. `clearml-task` lets
you enqueue your code for execution by an available [ClearML Agent](../clearml_agent.md). You can even provide command 
line arguments, Python module dependencies, and a requirements.txt file!

## What Is ClearML Task For?
* Launching off-the-shelf code on a remote machine with dedicated resources (e.g. GPU)
* Running [hyperparameter optimization](../fundamentals/hpo.md) on a codebase that is still not in ClearML
* Creating a pipeline from an assortment of scripts, that you need to turn into ClearML tasks
* Running some code on a remote machine, either using an on-prem cluster or on the cloud

## How Does ClearML Task Work?

1. Execute `clearml-task`, specifying the ClearML target project and task name, along with your script (and repository / commit / branch). 
   Optionally, specify an execution queue and Docker image to use.
1. `clearml-task` does its magic! It creates a new [ClearML Task](../fundamentals/task.md), 
   and, if so directed, enqueues it for execution by a ClearML Agent.
1. While the Task is running on the remote machine, all its console outputs are logged in real-time, alongside your 
   TensorBoard and matplotlib. You can track your script's progress and results in the [ClearML Web UI](../webapp/webapp_overview.md) 
   (a link to your task details page in the ClearML Web UI is printed as ClearML Task creates the task).
   
## Execution Configuration
### Docker
Specify a Docker container to run the code in with the `--docker <docker_image>` option.
The ClearML Agent pulls it from Docker Hub or a Docker artifactory automatically.

### Package Dependencies
`clearml-task` automatically finds the `requirements.txt` file in remote repositories. 

If a local script requires certain packages, or the remote repository doesn't have a `requirements.txt` file,
manually specify the required Python packages using `--packages "<package_name>"`, for example `--packages "keras" "tensorflow>2.2"`.

### Queue
Tasks are passed to ClearML Agents via [Queues](../fundamentals/agents_and_queues.md). Specify a queue in which to enqueue 
the task. If you don't input a queue, the task is created in *draft* status, and you can enqueue it at a later point. 

### Branch and Working Directory
To specify your code's branch and commit ID, pass the `--branch <branch_name> --commit <commit_id>` options.
If unspecified, `clearml-task` will use the latest commit from the 'master' branch.

:::note Github Default Branch
For GitHub repositories, it is recommended to explicitly specify your default branch (e.g. `--branch main`) to avoid
errors in identifying the correct default branch.
:::

### Command Line Options

<div className="tbl-cmd">

|Name | Description| Mandatory |
|---|----|---|
| `--args` | Arguments to pass to the remote task, list of `<argument>=<value>` strings. Currently only argparse arguments are supported | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--base-task-id` | Use a pre-existing task in the system, instead of a local repo / script. Essentially clones an existing task and overrides arguments / requirements | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--binary` | Binary executable used to launch the entry point. For example: `--binary python3`, `--binary /bin/bash`. By default, the binary will be auto-detected | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--branch` | Select repository branch / tag. By default, latest commit from the master branch | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--commit` | Select commit ID to use. By default, latest commit, or local commit ID when using local repository | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--cwd` | Working directory to launch the script from. Relative to repo root or local `--folder` | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--docker` | Select the Docker image to use in the remote task | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--docker_bash_setup_script` | Add a bash script to be executed inside the Docker before setting up the task's environment | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--docker_args` | Add Docker arguments. Pass a single string in the following format: `--docker_args "<argument_string>"`. For example: `--docker_args "-v some_dir_1:other_dir_1 -v some_dir_2:other_dir_2"` | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--folder` | Execute the code from a local folder. Notice, it assumes a git repository already exists. Current state of the repo (commit ID and uncommitted changes) is logged and replicated on the remote machine | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> | 
| `--import-offline-session`| Specify the path to the offline session you want to import.| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--name` | Set a target name for the new task | <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
| `--output-uri` | Set the task `output_uri`, upload destination for task models and artifacts | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--packages` | Manually specify a list of required packages. Example: `--packages "tqdm>=2.1" "scikit-learn"` | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--project`| Set the project name for the task (required, unless using `--base-task-id`). If the named project does not exist, it is created on-the-fly | <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
| `--queue` | Select a task's execution queue. If not provided, a task is created but not launched | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--repo` | URL of remote repository. Example: `--repo https://github.com/allegroai/clearml.git` | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--requirements` | Specify `requirements.txt` file to install when setting the session. By default, the` requirements.txt` from the repository will be used | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--script` | Entry point script for the remote execution. When used with `--repo`, input the script's relative path inside the repository. For example: `--script source/train.py`. When used with `--folder`, it supports a direct path to a file inside the local repository itself, for example: `--script ~/project/source/train.py` | <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
| `--skip-task-init` | If set, `Task.init()` call is not added to the entry point, and is assumed to be called within the script | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--tags` | Add tags to the newly created task. For example: `--tags "base" "job"` | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--task-type` | Set the task type. Optional values: training, testing, inference, data_processing, application, monitor, controller, optimizer, service, qc, custom | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `--version` | Display the `clearml-task` utility version | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |

</div>

## Usage
These commands demonstrate a few useful use cases for `clearml-task`.

### Executing Code from a Remote Repository 

```bash
clearml-task --project examples --name remote_test --repo https://github.com/allegroai/events.git --branch master --script /webinar-0620/keras_mnist.py --args batch_size=64 epochs=1 --queue default
```

The `keras_mnist.py` script from the [events](https://github.com/allegroai/events) GitHub repository is imported as a 
ClearML task named `remote_test` in the `examples` project. Its command line arguments `batch_size` and `epochs` values 
are set, and the task is enqueued for execution on the `default` queue.

### Executing a Local Script
Using `clearml-task` to execute a local script is very similar to using it with a [remote repo](#executing-code-from-a-remote-repository).

```bash
clearml-task --project examples --name local_test --script keras_mnist.py --branch master --requirements requirements.txt --args epochs=1 --queue default
```  

The `keras_mnist.py` script on the user's local machine is imported as a ClearML task named `local_test` in the `examples` project.

Its Python requirements are taken from the local `requiremnts.txt` file, and its `epochs` command line argument value is set.

The task is enqueued for execution on the `default` queue. 


### Pushing a Script to the Server 

```bash
clearml-task --project examples --name no_execute --script keras_mnist.py --branch master --requirements requirements.txt --args epochs=1 
```  

The `keras_mnist.py` script on the user's local machine is imported as a ClearML task named `no_execute` in the `examples` project.

Its Python requirements are taken from the local `requiremnts.txt` file, and its `epochs` command line argument value is set.
The task is created in a *draft* status (i.e. can be modified in the [WebApp UI](../webapp/webapp_overview.md) and later be enqueued). 
