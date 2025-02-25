---
title: ClearML Python Package 
---

This is step-by-step guide for installing the `clearml` Python package and connecting it to the ClearML Server. Once done,
you can integrate `clearml` into your code. 

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
   
   For more information about running tasks inside Docker containers, see [ClearML Agent Deployment](../clearml_agent/clearml_agent_deployment_bare_metal.md)
   and [ClearML Agent Reference](../clearml_agent/clearml_agent_ref.md).
    
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
   
Now you can integrate ClearML into your code! Continue [here](../clearml_sdk/clearml_sdk_setup#auto-log-experiment).

### Jupyter Notebook
To use ClearML with Jupyter Notebook, you need to configure ClearML Server access credentials for your notebook.

1. Get ClearML credentials. Open the ClearML Web UI in a browser. On the [**SETTINGS > WORKSPACE**](https://app.clear.ml/settings/workspace-configuration) 
   page, click **Create new credentials**. The **JUPYTER NOTEBOOK** tab shows the commands required to configure your 
   notebook (a copy to clipboard action is available on hover)
1. Add these commands to your notebook

Now you can use ClearML in your notebook!
