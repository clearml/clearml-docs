---
title: LLM UI
---

:::important Enterprise Feature
The LLM UI application is available under the ClearML Enterprise plan.
::: 

Use the ClearML LLM UI application to launch a visual chat interface to a deployed model.

The app instance uses endpoints of models deployed through the ClearML [Model Deployment](apps_model_deployment.md), 
[Llama.cpp Model Deployment](apps_llama_deployment.md), and SGLang Model Deployment apps. In the interface, you must 
first select the model to query. The interface provides controls for adjusting generation parameters such as temperature, 
max tokens, and stop sequences. For detailed usage and customization options, see the
[Open WebUI documentation ](https://docs.openwebui.com/). 

 
:::info Application Gateway
The LLM UI app makes use of the App Gateway Router which implements a secure, authenticated network endpoint for the 
model. If the ClearML Application Gateway is not available, the model endpoint might not be accessible. For more 
information, see [Application Gateway](../../deploying_clearml/enterprise_deploy/appgw.md).
:::

After launching an LLM UI instance, its dashboard displays the following:
* Status indicator
  * <img src="/docs/latest/icons/ico-llm-ui-active.svg" alt="Active instance" className="icon size-md space-sm" /> - App instance is running and is actively in use
  * <img src="/docs/latest/icons/ico-llm-ui-loading.svg" alt="Loading instance" className="icon size-md space-sm" /> - App instance is setting up
  * <img src="/docs/latest/icons/ico-llm-ui-idle.svg" alt="Idle instance" className="icon size-md space-sm" /> - App instance is idle
  * <img src="/docs/latest/icons/ico-llm-ui-stopped.svg" alt="Stopped instance" className="icon size-md space-sm" /> - App instance is stopped
* Idle time – Time since the last user activity
* Restored workspace -  If the session was restored, the previous session's ID is shown
* Current session ID
* Sharable Link – Publicly accessible URL to access the model’s chat interface (available only when the instance is running)
* Chat window (available only when the instance is running) - For detailed usage and customization options, see the
[Open WebUI documentation ](https://docs.openwebui.com/).  
* Console log – Displays setup progress, status changes, error messages, etc.

![LLM UI dashboard](../../img/apps_llm_ui.png#light-mode-only)
![LLM UI dashboard](../../img/apps_llm_ui_dark.png#dark-mode-only)

## LLM UI Instance Configuration

When configuring a new LLM UI instance, you can fill in the required parameters or reuse the 
configuration of a previously launched instance. 

Launch an app instance with the configuration of a previously launched instance using one of the following options:
* Cloning a previously launched app instance will open the instance launch form with the original instance's 
configuration prefilled.
* Importing an app configuration file. You can export the configuration of a previously launched instance as a JSON file 
when viewing its configuration.

The prefilled configuration form can be edited before launching the new app instance.

To configure a new app instance, click `Launch New` <img src="/docs/latest/icons/ico-add.svg" alt="Add new" className="icon size-md space-sm" /> 
to open the app's configuration form.

### Configuration Options

* Instance Name – Name for the LLM UI app instance. This will appear in the instance list
* Service Project (Access Control) – The ClearML project where the app instance is created. Access is determined by 
  project-level permissions (i.e. users with read access can use the app).* Queue: The queue serviced by the ClearML 
  Agent which will execute the application instance.
* RAG Embedding Model: The embedding model is used by the application to create embeddings to facilitate RAG for documents 
  you add to your workspace (See [Knowledge Bases](#using-knowledge-bases-for-rag)). These entries can be edited in the running instance UI.
  * Embedding Model Endpoint URL: The embedding model endpoint URL (See [Embedding Model Deployment app](apps_embed_model_deployment.md)).
  * Model Name: The embedding model's name
* Restore LLM UI ID - Specify a LLM UI ID to be restored
* Idle options: 
  * Idle Time Limit (Hours) - Maximum idle time after which the app instance will shut down
  * Last Action Report Interval (Seconds) - Frequency at which last activity is reported. Prevents idle shutdown while still active.

<div class="max-w-75">

![LLM UI launch form](../../img/apps_llm_ui_wizard.png#light-mode-only)
![LLM UI launch form](../../img/apps_llm_ui_wizard_dark.png#dark-mode-only)

</div>

## Using Knowledge Bases for RAG
You can improve your model’s responses by providing context through **Knowledge Bases**. This allows the LLM to consider 
your uploaded documents as part of the queries.

1. In the model UI, click **Menu > Workspace > Knowledge > + (Create Knowledge Base)**
1. In the `Create Knowledge Base` window:
   * Name and describe the knowledge base. 
   * Click **Create Knowledge**
1. Drag and drop  `.pdf` or `.txt` files
1. Click **New Chat**
1. In the chat, reference a Knowledge Base by typing `#<YourKnowledgeBaseName>`. 

The LLM leverages the referenced knowledge base to retrieve relevant information, then uses that information to generate more accurate and contextually appropriate responses.