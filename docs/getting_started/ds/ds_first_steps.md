---
title: First Steps
---


## Install ClearML


First, [sign up for free](https://app.clear.ml).

Install the `clearml` Python package:
```bash
pip install clearml
```

## Connect ClearML SDK to the Server 

### Local Python
1. Execute the following command to run the ClearML setup wizard:

   ```bash
   clearml-init
   ```
   
   :::note 
   The wizard does not edit or overwrite existing configuration files, so the above command will not work if a `clearml.conf`
   file already exists.
   :::

   <Collapsible type="info" title="Learn about creating multiple ClearML configuration files">

   Additional ClearML configuration files can be created, for example, to use inside Docker containers when executing 
   a Task.
   
   Use the `--file` option for `clearml-init`.

   ```
   clearml-init --file MyOtherClearML.conf
   ```
   
   and then specify it using the ``CLEARML_CONFIG_FILE`` environment variable inside the container:
        
   ```
   CLEARML_CONFIG_FILE = MyOtherClearML.conf
   ```
   
   For more information about running tasks inside Docker containers, see [ClearML Agent Deployment](../../clearml_agent/clearml_agent_deployment.md)
   and [ClearML Agent Reference](../../clearml_agent/clearml_agent_ref.md).
    
   </Collapsible>
   
1. The setup wizard prompts for ClearML credentials.

   ```console
   Please create new clearml credentials through the settings page in your `clearml-server` web app (e.g. http://localhost:8080//settings/workspace-configuration), 
   or create a free account at https://app.clear.ml/settings/workspace-configuration
   
   In the settings page, press "Create new credentials", then press "Copy to clipboard".
   
   Paste copied configuration here:
   ```
      
1. Get ClearML credentials. Open the ClearML Web UI in a browser. On the [**SETTINGS > WORKSPACE**](https://app.clear.ml/settings/workspace-configuration) 
   page, click **Create new credentials**.
   
   The **LOCAL PYTHON** tab shows the data required by the setup wizard (a copy to clipboard action is available on 
   hover).
    
1. At the command prompt `Paste copied configuration here:`, copy and paste the ClearML credentials.
   The setup wizard verifies the credentials. 
   ```console
   Detected credentials key="********************" secret="*******"

   CLEARML Hosts configuration:
   Web App: https://app.<your-domain>
   API: https://api.<your-domain>
   File Store: https://files.<your-domain>
            
   Verifying credentials ...
   Credentials verified!
    
   New configuration stored in /home/<username>/clearml.conf
   CLEARML setup completed successfully.
   ```
   
Now you can integrate ClearML into your code! Continue [here](#auto-log-experiment).

### Jupyter Notebook
To use ClearML with Jupyter Notebook, you need to configure ClearML Server access credentials for your notebook.

1. Get ClearML credentials. Open the ClearML Web UI in a browser. On the [**SETTINGS > WORKSPACE**](https://app.clear.ml/settings/workspace-configuration) 
   page, click **Create new credentials**. The **JUPYTER NOTEBOOK** tab shows the commands required to configure your 
   notebook (a copy to clipboard action is available on hover)
1. Add these commands to your notebook

Now you can use ClearML in your notebook!

## Auto-log Experiment

In ClearML, experiments are organized as [Tasks](../../fundamentals/task.md).

ClearML automatically logs your task and code, including outputs and parameters from popular ML frameworks,
once you integrate the ClearML [SDK](../../clearml_sdk/clearml_sdk.md) with your code. To control what ClearML automatically logs, see this [FAQ](../../faq.md#controlling_logging).

At the beginning of your code, import the `clearml` package:

```python
from clearml import Task
```

:::tip Full Automatic Logging
To ensure full automatic logging, it is recommended to import the `clearml` package at the top of your entry script.
:::

Then initialize the Task object in your `main()` function, or the beginning of the script.

```python
task = Task.init(project_name='great project', task_name='best task')
```

If the project does not already exist, a new one is created automatically.

The console should display the following output:

```
ClearML Task: created new task id=1ca59ef1f86d44bd81cb517d529d9e5a
2021-07-25 13:59:09
ClearML results page: https://app.clear.ml/projects/4043a1657f374e9298649c6ba72ad233/experiments/1ca59ef1f86d44bd81cb517d529d9e5a/output/log
2021-07-25 13:59:16
```

**That's it!** You are done integrating ClearML with your code :)

Now, [command-line arguments](../../fundamentals/hyperparameters.md#tracking-hyperparameters), [console output](../../fundamentals/logger.md#types-of-logged-results) as well as Tensorboard and Matplotlib will automatically be logged in the UI under the created Task.

Sit back, relax, and watch your models converge :) or continue to see what else can be done with ClearML [here](ds_second_steps.md).

## YouTube Playlist

Or watch the **Getting Started** playlist on ClearML's YouTube Channel!

[![Watch the video](https://img.youtube.com/vi/bjWwZAzDxTY/hqdefault.jpg)](https://www.youtube.com/watch?v=bjWwZAzDxTY&list=PLMdIlCuMqSTnoC45ME5_JnsJX0zWqDdlO&index=2)
