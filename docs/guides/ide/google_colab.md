---
title: ClearML Agent on Google Colab
---

[Google Colab](https://colab.research.google.com) is a common development environment for data scientists. It supports a convenient IDE as well as
compute provided by Google.

Users can transform a Google Colab instance into an available resource in ClearML using [ClearML Agent](../../clearml_agent.md).

This tutorial goes over how to create a ClearML worker node in a Google Colab notebook. Once the worker is up 
and running, users can send Tasks to be executed on Google Colab's hardware.

## Prerequisites
* Be signed up for ClearML (or have a server deployed).
* Have a Google account to access Google Colab.


## Steps 
1. Open up [this Google Colab notebook](https://colab.research.google.com/github/allegroai/clearml/blob/master/examples/clearml_agent/clearml_colab_agent.ipynb).

1. Run the first cell, which installs all the necessary packages:
    ```
    !pip install git+https://github.com/allegroai/clearml
    !pip install clearml-agent
    ```
1. Run the second cell, which exports this environment variable:
   ```
   ! export MPLBACKEND=TkAg
   ```
   This environment variable makes Matplotlib work in headless mode, so it won't output graphs to the screen.
   
1. Create new credentials. Go to your [**Settings**](https://app.clear.ml/settings/workspace-configuration) page > **WORKSPACE** section. 
   Under **App Credentials**, click **+ Create new credentials**, and copy the information that pops up. 
   
1. Set the credentials. In the third cell, enter your own credentials:
   ```python
   from clearml import Task
   
   Task.set_credentials(
        api_host="https://api.clear.ml", 
        web_host="https://app.clear.ml", 
        files_host="https://files.clear.ml", 
        key='6ZHX9UQMYL874A1NE8', 
        secret='=2h6#%@Y&m*tC!VLEXq&JI7QhZPKuJfbaYD4!uUk(t7=9ENv'
   )
   ```
   
   
1. In the fourth cell, launch a `clearml-agent` that will listen to the `default` queue:
   ```
   !clearml-agent daemon --queue default
   ```
   
   For additional options for running `clearml-agent`, see the [clearml-agent reference](../../clearml_agent/clearml_agent_ref.md).  
   
   After executing cell 4, the worker appears in the [**Orchestration**](../../webapp/webapp_workers_queues.md) 
   page of your server. Clone tasks and enqueue them to your hearts content! The `clearml-agent` will fetch 
   tasks and execute them using the Google Colab hardware.
   

