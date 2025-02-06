---
title: Recreating Task Environments 
---

<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/WTVrchczD34?si=2mZoMi4QdGl4MnUe" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

Sometimes, you may need to recreate your task environment on a different machine, but you haven't committed your 
code.

ClearML logs everything needed to reproduce your task and its environment (uncommitted changes, used packages, and 
more), making it easy to reproduce your task's execution environment using ClearML.

You can reproduce the execution environment of any task you've run with ClearML on any workload:

1. Go to the task page of the task you want to reproduce in the [ClearML WebApp](../../webapp/webapp_overview.md)

   :::tip
   Use the UI's [filtering and sorting](../../webapp/webapp_exp_table.md#filtering-columns) to find the best performing tasks.  
   ::: 

1. Copy the task's ID
1. Use the ClearML Agent's [`build`](../../clearml_agent/clearml_agent_ref.md#build) command to rebuild the task's
   execution environment. Input the task's ID and the target local folder, where the environment will be created: 

   ```commandline
   clearml-agent build --id <task_id> --target <target_folder>
   ```
   After running this command, the target folder will contain that task's original code with uncommitted changes applied, 
   as well as a complete recreated virtual environment 
2. Activate the virtual environment using the activation script. Once done, you'll find all of your environment's packages 
   already installed in the environment 

And that's it! Your task's environment and your code has been reproduced! 