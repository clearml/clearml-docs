---
title: Model Registry 
---


<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/lAiw2HqHlWo?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

ClearML provides a model registry to catalog and share models with full traceability and provenance. The ClearML model 
registry lets you track and document model changes, view and trace model lineage, enabling easy reproducibility with any 
connected orchestration solution.

You can use the model catalog to trigger CI/CD pipelines based on changes (e.g. registering models, adding tags, or 
publishing models).

The ClearML SDK makes it easy for colleagues to access others' work and always fetch models based on the model catalog 
or the task that created the model.

The ClearML web UI visualizes the model catalog for complete observability and lineage of the model lifecycle, providing 
governance at scale.

Create a visual web interface and interactively demo your models using the [Gradio](webapp/applications/apps_gradio.md) 
and [Streamlit](webapp/applications/apps_streamlit.md) launcher apps (available under the ClearML Enterprise plan).

[ClearML Serving](clearml_serving/clearml_serving.md) lets you deploy your models, and continue updating them as you 
continue to train and test new model versions.

## Registering Models 
ClearML supports automatic and manual registration of models to the model catalog. 

### Automatic Logging
ClearML automatically logs models created/loaded through popular frameworks like TensorFlow or scikit-learn; all you 
need to do is [instantiate a ClearML Task](clearml_sdk/task_sdk.md#task-creation) in your code. ClearML stores the 
framework's training results as output models.

Automatic logging is supported for the following frameworks:
* [TensorFlow](integrations/tensorflow.md)
* [Keras](integrations/keras.md)
* [PyTorch](integrations/pytorch.md)
* [AutoKeras](integrations/autokeras.md)
* [CatBoost](integrations/catboost.md)
* [Fast.ai](integrations/fastai.md)
* [LightGBM](integrations/lightgbm.md)
* [MegEngine](integrations/megengine.md)
* [MONAI](integrations/monai.md)
* [scikit-learn](integrations/scikit_learn.md) (only using joblib)
* [XGBoost](integrations/xgboost.md) (only using joblib)
* [YOLOv8](integrations/yolov8.md)
* [YOLOv5](integrations/yolov5.md)

You may want more control over which models are logged. Use the `auto_connect_framework` parameter of [`Task.init()`](references/sdk/task.md#taskinit) 
to control automatic logging of frameworks. 

You can specify to log only models with certain names. For example, the task below will log only the PyTorch models with 
names that start with `final`.  

```python
from clearml import Task

task = Task.init(
	project_name="My Project",
	task_name="My Task",
	auto_connect_frameworks={'pytorch': 'final*.pt',}
)
```

See [Automatic Logging](clearml_sdk/task_sdk.md#automatic-logging) for more information about controlling model logging. 

### Manual Logging

You can explicitly specify a task’s models using ClearML `InputModel` and `OutputModel` classes. 

#### InputModel

Use the [`InputModel`](references/sdk/model_inputmodel.md) class to load either a model that is already registered in 
ClearML or to import a pre-trained model from an external resource. 

```python
# Create an input model using the ClearML ID of a model already registered in the ClearML platform
input_model_1 = InputModel(model_id="fd8b402e874549d6944eebd49e37eb7b")

# Import an existing model 
input_model_2 = InputModel.import_model(
   # Name for model in ClearML
   name='Input Model with Network Design',
   # Import the model using a URL
   weights_url='https://s3/models/model.pth',
   # Set label enumeration values
   label_enumeration={'person' : 1, 'car' : 2, 'truck' : 3, 'bus' : 4,
                      'motorcycle' : 5, 'bicycle' : 6, 'ignore': -1},
   framework='PyTorch'
)
```

After instantiating an InputModel instance, you can connect it to a task object, so the model can be traced to n 
task. 

```python
# Connect the input model to the task
task.connect(input_model)
```

#### OutputModel
 
Use the [`OutputModel`](references/sdk/model_outputmodel.md) class to log your task outputs. An OutputModel object 
is instantiated with a task object as an argument (see [`task`](references/sdk/model_outputmodel.md) parameter), so it's 
registered as the task's output model. Since OutputModel objects are connected to tasks, the models are traceable in 
tasks. 

```python
from clearml import OutputModel, Task

# Instantiate a Task
task = Task.init(project_name="myProject", task_name="myTask")

# Create an output model for the PyTorch framework
output_model = OutputModel(task=task, framework="PyTorch")
```

Periodic snapshots of manually registered output models aren't automatically captured, but they can be updated manually 
with [`Task.update_output_model()`](references/sdk/task.md#update_output_model) or [`OutputModel.update_weights()`](references/sdk/model_outputmodel.md#update_weights).

```python
# Through Task object
task.update_output_model(model_path='path/to/model')

# Through OutputModel object
output_model.update_weights(weights_filename='models/model.pth')
```

## Analyzing Models 
While experimenting, you build up your model catalog. In the ClearML's web UI, model information can be located through 
a project's Model Table or through the model's associated task.

Models associated with a task appear in the task's **ARTIFACTS** tab. To see further model details, including design, 
label enumeration, and general information, click the model name, which is a hyperlink to the [model's detail page](webapp/webapp_model_viewing.md).

Models can also be accessed through their associated project's [Model Table](webapp/webapp_model_table.md), where all 
the models associated with a project are listed. This table can be customized with columns for specific metadata and 
metric values, and supports filtering and sorting to quickly find the desired models.

You can [compare models](webapp/webapp_model_comparing.md) through the web UI, allowing you to easily identify, 
visualize, and analyze model differences.

Once you are satisfied with a model, you can publish it in order to maintain its contents. 

## Working with Models 
ClearML models are independent entities facilitating their use in many use cases.

You can modify your models’ details via the UI: add metadata, change names, reconfigure, and add/edit label enumeration. 
Modified models can be used as input models in your ClearML Tasks.  

You can modify the models that a task trains:
1. Clone a task
1. Go to the task's **Artifacts** tab
1. Hover over an input model's `Model name` field and click **Edit**. Then click <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" />. 
This will open up a window with a model table, where you can select any model from the model catalog.  

This can be useful in transfer learning or fine-tuning a model. 

### Querying Models 
The ClearML model catalog can be accessed directly with a model object (from the `InputModel` or `Model` classes) 
or indirectly via their associated task.

Retrieve a list of model objects by querying the catalog by model names, projects, tags, metadata, and more.

```python
model_list = Model.query_models(
   # Only models from `examples` project
   project_name='examples',
   # Only models with input name
   model_name=None,
   # Only models with `demo` tag or models without `TF` tag
   tags=['demo', '-TF'],
   # If `True`, only published models
   only_published=False,
   # If `True`, include archived models
   include_archived=True,
   # Maximum number of models returned
   max_results=5,
   # Only models with matching metadata
   metadata={"key":"value"}
)
```

See [Querying Models](clearml_sdk/model_sdk.md#querying-models) for more information and examples. 

### SDK Interface
Once you have retrieved a model object, you can work with it programmatically. 

See the [Model SDK interface](clearml_sdk/model_sdk.md) for an overview of model classes' Pythonic methods. See a 
detailed list of all available methods in the [Model](references/sdk/model_model.md), [OutputModel](references/sdk/model_outputmodel.md), 
and [InputModel](references/sdk/model_inputmodel.md) reference pages.

## Creating Visual Web Interface

:::important Enterprise Feature
The Streamlit and Gradio launcher apps are available under the ClearML Enterprise plan.
:::

Create a visual web interface and interactively demo your models using the [Gradio](webapp/applications/apps_gradio.md) 
and [Streamlit](webapp/applications/apps_streamlit.md) launcher apps.

The launcher applications spin up a Gradio or Streamlit execution environment and serve your respective app on a machine 
of your choice. Once you start a launcher instance, you will be provided with an externally accessible link to 
your Gradio or Streamlit app, where you can make use of your models.

## Serving Models 
[ClearML Serving](clearml_serving/clearml_serving.md) provides a command line utility for model deployment and 
orchestration. It enables model deployment including serving and preprocessing code to a Kubernetes cluster or custom 
container based solution.

After you have set up `clearml-serving`, you can create endpoints for models in your ClearML model catalog.

```commandline
clearml-serving --id <service_id> model add --engine sklearn --endpoint "test_model_sklearn" --preprocess "examples/sklearn/preprocess.py" --model-id <newly_created_model_id_here>
```

The ClearML Serving Service supports automatic model deployment and upgrades from the ClearML model catalog. 
When auto-deploy is configured, new model versions will be automatically deployed when you publish or tag a new model 
in the ClearML model catalog.

See [ClearML Serving](clearml_serving/clearml_serving.md) for more information.