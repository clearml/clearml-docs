---
title: YOLOv8
---

<div class="vid">
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/iLcC7m3bCes" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

Ultralytics' [YOLOv8](https://github.com/ultralytics/ultralytics) is a top modeling repository for object detection, 
segmentation, and classification. Get the most out of YOLOv8 with ClearML:
* Track every YOLOv8 training run in ClearML
* Remotely train and monitor your YOLOv8 training runs using [ClearML Agent](../clearml_agent.md)
* Turn your newly trained YOLOv8 model into an API with just a few commands using [ClearML Serving](../clearml_serving/clearml_serving.md)

## Setup

1. Install the `clearml` Python package:

   ```commandline
   pip install clearml
   ``` 
   
1. To keep track of your tasks and/or data, ClearML needs to communicate to a server. You have 2 server options:
    * Sign up for free to the [ClearML Hosted Service](https://app.clear.ml/) 
    * Set up your own server, see [here](../deploying_clearml/clearml_server.md).  
1. Connect the ClearML SDK to the server by creating credentials (go to the top right in the UI to **Settings > Workspace > Create new credentials**), 
   then execute the command below and follow the instructions:

   ```commandline
   clearml-init
   ```
    
That's it! Now, whenever you train a model using YOLOv8, the run will be captured and tracked by ClearML – no additional 
code necessary. 
 
## Training YOLOv8 with ClearML 

To enable ClearML task tracking, simply install the `clearml` pip package in your execution environment.

```commandline
pip install clearml>=1.2.0
```

This will enable integration with the YOLOv8 training script. In every training run from now on, the ClearML task 
manager will capture:
* Source code and uncommitted changes
* Installed packages
* [Hyperparameters](../fundamentals/hyperparameters.md)
* Model files (use [`--save-period n`](https://docs.ultralytics.com/usage/cfg/#modes) to save a checkpoint every `n` epochs)
* Console output
* Scalars (e.g. mAP_0.5, mAP_0.5:0.95, precision, recall, losses)
* General information such as machine details, runtime, creation date etc.
* All produced plots such as label correlogram and confusion matrix
* Mosaic per epoch
* Validation images per epoch
* And more

All of this is captured into a [ClearML Task](../fundamentals/task.md): a task with your training script's name 
created in a `YOLOv8` ClearML project. To change the task's name or project, pass the `name` and `project` arguments in one of 
the following ways:
* Via the SDK: 
   
  ```python
  from ultralytics import YOLO

   # Initialize YOLO object, load/create YOLOv8 model
   model = YOLO()

   # Run MODE mode using the custom arguments ARGS
   model.MODE(name="<new_task_name>", project="<new_project_name>")
  ``` 

* Via the `yolo` CLI: 
  
   ```commandline
   yolo TASK MODE project=new_project name=new_task_name
  ```

:::tip project names 
ClearML uses `/` as a delimiter for subprojects: using `example/sample` as a name will create the `sample` 
task within the `example` project. 
:::

You can see all the captured data in the task's page of the ClearML [WebApp](../webapp/webapp_exp_track_visual.md). 
Additionally, you can view all of your YOLOv8 runs tracked by ClearML in the [Task Table](../webapp/webapp_model_table.md). 
Add custom columns to the table, such as mAP values, so you can easily sort and see what is the best performing model. 
You can also select multiple tasks and directly [compare](../webapp/webapp_exp_comparing.md) them.   

## Remote Execution
ClearML logs all the information required to reproduce a task on a different machine (installed packages, 
uncommitted changes etc.). The [ClearML Agent](../clearml_agent.md) listens to designated queues and when a task is 
enqueued, the agent pulls it, recreates its execution environment, and runs it, reporting its scalars, plots, etc. to the 
task manager.

Deploy a ClearML Agent onto any machine (e.g. a cloud VM, a local GPU machine, your own laptop) by simply running 
the following command on it:

```commandline
clearml-agent daemon --queue <queues_to_listen_to> [--docker]
```

Use the ClearML [Autoscalers](../cloud_autoscaling/autoscaling_overview.md) to help you manage cloud workloads in the 
cloud of your choice (AWS, GCP, Azure) and automatically deploy ClearML agents: the autoscaler automatically spins up and 
shuts down instances as needed, according to a resource budget that you set.


### Cloning, Editing, and Enqueuing

ClearML logs all the information required to reproduce a task, but you may also want to change a few parameters 
and task details when you re-run it, which you can do through ClearML's UI.

In order to be able to override parameters via the UI, 
you have to run your code to [create a ClearML Task](../clearml_sdk/task_sdk.md#task-creation), which will log all the 
execution parameters before using the YOLO model. When ClearML re-runs the task remotely, ClearML will override these 
parameters before YOLO comes into play. 

For example: 

```python
from clearml import Task
from ultralytics import YOLO 

# Create a ClearML Task
task = Task.init(
    project_name="my project",
    task_name="my yolo task"
)

# Load a model
model_variant = "yolov8n"
# Log "model_variant" parameter to task
task.set_parameter(name="model_variant", value=model_variant)

# Load the YOLOv8 model
model = YOLO(f'{model_variant}.pt') 

# Put all YOLOv8 arguments in a dictionary and pass it to ClearML
# When the arguments are later changed in UI, they will be overridden here!
args = dict(data="coco128.yaml", epochs=16)
task.connect(args)

# Train the model 
# If running remotely, the arguments may be overridden by ClearML if they were changed in the UI
results = model.train(**args)
```

:::tip
Notice that in the script above only the `data` and `epochs` args are passed to ClearML, so only their values can be 
overridden via the UI. You can add all of YOLO's default parameters to the parameter dictionary, so you'll be able to override
any of them through the UI. 
:::

Use the UI to edit task details, then execute the task 
with the new configuration on a remote machine:
* Clone the task
* Edit the hyperparameters and/or other details 
* Enqueue the task

The ClearML Agent executing the task will use the new values to [override any hard coded values](../clearml_agent.md). 

![Cloning, editing, enqueuing gif](../img/gif/integrations_yolov5.gif)
