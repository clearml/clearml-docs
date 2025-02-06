---
title: Tutorial
---

In this tutorial, you will go over the model lifecycle -- from training to serving -- in the following steps:
* Training a model using the [sklearn example script](https://github.com/allegroai/clearml-serving/blob/main/examples/sklearn/train_model.py) 
* Serving the model using **ClearML Serving**  
* Spinning the inference container

The tutorial also covers the following`clearml-serving` features: 
* Automatic model deployment 
* Canary endpoints
* Model performance monitoring 

## Prerequisite

Before executing the steps below, make sure you have completed `clearml-serving`'s [initial setup](clearml_serving_setup.md#initial-setup).

##  Steps
### Step 1: Train Model

Train a model using the example script. Start from the root directory of your local `clearml-serving` repository.
1. Create a Python virtual environment
1. Install the script requirements: `pip3 install -r examples/sklearn/requirements.txt`
1. Execute the [training script](https://github.com/allegroai/clearml-serving/blob/main/examples/sklearn/train_model.py): `python3 examples/sklearn/train_model.py`. 
  
During execution, ClearML automatically registers the sklearn model and uploads it to the model repository. 
For information about explicit model registration, see [Registering and Deploying New Models Manually](#registering-and-deploying-new-models-manually). 

### Step 2: Register Model

Register the new Model on the Serving Service:

```bash
clearml-serving --id <service_id> model add --engine sklearn --endpoint "test_model_sklearn" --preprocess "examples/sklearn/preprocess.py" --name "train sklearn model - sklearn-model" --project "serving examples"
```

:::info Service ID
Make sure that you have executed `clearml-serving`'s
[initial setup](clearml_serving_setup.md#initial-setup), in which you create a Serving Service. 
The Serving Service's ID is required to register a model, and to execute `clearml-serving`'s `metrics` and `config` commands. 
:::

  
:::note
The preprocessing Python code is packaged and uploaded to the Serving Service, to be used by any inference container, 
and downloaded in real time when updated.
:::

### Step 3: Spin Inference Container

Spin the Inference Container:
1. Customize container [Dockerfile](https://github.com/allegroai/clearml-serving/blob/main/clearml_serving/serving/Dockerfile) if needed
1. Build container:

   ```bash
   docker build --tag clearml-serving-inference:latest -f clearml_serving/serving/Dockerfile .
   ```

1. Spin the inference container: 

   ```bash
   docker run -v ~/clearml.conf:/root/clearml.conf -p 8080:8080 -e CLEARML_SERVING_TASK_ID=<service_id> -e CLEARML_SERVING_POLL_FREQ=5 clearml-serving-inference:latest
   ``` 

1. Test the new model inference endpoint:

   ```bash
   curl -X POST "http://127.0.0.1:8080/serve/test_model_sklearn" -H "accept: application/json" -H "Content-Type: application/json" -d '{"x0": 1, "x1": 2}'
   ```  

Now that you have an inference container running, you can add new model inference endpoints directly with the CLI. The 
inference container will automatically sync every 5 minutes. The first few requests may take longer while the inference container 
downloads the model file and preprocessing Python code. Once 
everything is cached, responses will return almost immediately.

:::note
Review the model repository in the ClearML web UI, under the "serving examples" Project on your ClearML 
account/server ([free hosted](https://app.clear.ml) or [self-deployed](https://github.com/allegroai/clearml-server)).

Inference services status, console outputs and machine metrics are available in the ClearML UI in the Serving Service 
project (default: "DevOps" project).
:::

## Registering and Deploying New Models Manually 

Uploading an existing model file into the model repository can be done via the `clearml` RestAPI, the python interface, 
or with the `clearml-serving` CLI. 

1. Upload the model file to the `clearml-server` file storage and register it. The `--path` parameter is used to input 
   the path to a local model file (local model created in [step 1](#step-1--train-model) located in `./sklearn-model.pkl`).

   ```bash
   clearml-serving --id <service_id> model upload --name "manual sklearn model" --project "serving examples" --framework "scikitlearn" --path ./sklearn-model.pkl
   ```
    
   You now have a new Model named `manual sklearn model` in the `serving examples` project. The CLI output prints 
   the UID of the new model, which you will use to register a new endpoint. 

   In the [ClearML web UI](../webapp/webapp_overview.md), the new model is listed under the **Models** tab of its project. 
   You can also download the model file itself directly from the web UI. 

1. Register a new endpoint with the new model:

   ```bash
   clearml-serving --id <service_id> model add --engine sklearn --endpoint "test_model_sklearn" --preprocess "examples/sklearn/preprocess.py" --model-id <newly_created_model_id_here>
   ```

:::info Model Storage
You can also provide a different storage destination for the model, such as S3/GS/Azure, by using
`--destination`. For example:

* S3: `s3://bucket/folder`
* Non-AWS S3-like services (such as MinIO): `s3://host_addr:port/bucket`. **Note that port specification is required**. 
* Google Cloud Storage: `gs://bucket-name/folder`
* Azure Storage: `azure://<account name>.blob.core.windows.net/path/to/file`

There is no need to provide a unique 
path to the destination argument, the location of the model will be a unique path based on the serving service ID and the 
model name.
:::

## Additional Options 

### Automatic Model Deployment

The ClearML Serving Service supports automatic model deployment and upgrades, which is connected with the model 
repository and API. When the model auto-deploy is configured, new model versions will be automatically deployed when you 
`publish` or `tag` a new model in the ClearML model repository. This automation interface allows for a simpler CI/CD model 
deployment process, as a single API automatically deploys (or removes) a model from the Serving Service.

#### Automatic Model Deployment Example

1. Configure the model auto-update on the Serving Service:
   
   ```bash
   clearml-serving --id <service_id> model auto-update --engine sklearn --endpoint "test_model_sklearn_auto" --preprocess "preprocess.py" --name "train sklearn model" --project "serving examples" --max-versions 2`
   ```
1. Deploy the Inference container (if not already deployed)
1. Publish a new model in the model repository in one of the following ways:
    - Go to the "serving examples" project in the ClearML web UI, click on the Models Tab, search for "train sklearn model" right-click and select "Publish"
    - Use the RestAPI (see [details](https://clear.ml/docs/latest/docs/references/api/models#post-modelspublish_many))
    - Use Python interface:
   
       ```python
       from clearml import Model
       Model(model_id="unique_model_id_here").publish()
       ```
    
1. The new model is available on a new endpoint version (1), test with: 
  
   ```bash
   curl -X POST "http://127.0.0.1:8080/serve/test_model_sklearn_auto/1" -H "accept: application/json" -H "Content-Type: application/json" -d '{"x0": 1, "x1": 2}'
   ```

### Canary Endpoint Setup

Canary endpoint deployment adds a new endpoint where the actual request is sent to a preconfigured set of endpoints with 
pre-provided distribution. For example, let's create a new endpoint "test_model_sklearn_canary", you can provide a list 
of endpoints and probabilities (weights).

```bash
clearml-serving --id <service_id> model canary --endpoint "test_model_sklearn_canary" --weights 0.1 0.9 --input-endpoints test_model_sklearn/2 test_model_sklearn/1
```
This means that any request coming to `/test_model_sklearn_canary/` will be routed with probability of 90% to
`/test_model_sklearn/1/` and with probability of 10% to `/test_model_sklearn/2/`. 

:::note
As with any other Serving Service configuration, you can configure the Canary endpoint while the Inference containers are 
already running and deployed, they will get updated in their next update cycle (default: once every 5 minutes).
:::

You can also prepare a "fixed" canary endpoint, always splitting the load between the last two deployed models:

```bash
clearml-serving --id <service_id> model canary --endpoint "test_model_sklearn_canary" --weights 0.1 0.9 --input-endpoints-prefix test_model_sklearn/
```

This means that you have two model inference endpoints: `/test_model_sklearn/1/` and `/test_model_sklearn/2/`. The 10% 
probability (weight 0.1) will match the last (order by version number) endpoint, i.e. `/test_model_sklearn/2/`, and the
90% will match `/test_model_sklearn/2/`. When you add a new model endpoint version, e.g. `/test_model_sklearn/3/`, the 
canary distribution will automatically match the 90% probability to `/test_model_sklearn/2/` and the 10% to the new 
endpoint `/test_model_sklearn/3/`.  

Example:
1. Add two endpoints:
    
   ```bash
   clearml-serving --id <service_id> model add --engine sklearn --endpoint "test_model_sklearn" --preprocess "examples/sklearn/preprocess.py" --name "train sklearn model" --version 1 --project "serving examples"
   ```
   
   ```bash
   clearml-serving --id <service_id> model add --engine sklearn --endpoint "test_model_sklearn" --preprocess "examples/sklearn/preprocess.py" --name "train sklearn model" --version 2 --project "serving examples"
   ```

1. Add Canary endpoint: 
  
   ```bash
   clearml-serving --id <service_id> model canary --endpoint "test_model_sklearn_canary" --weights 0.1 0.9 --input-endpoints test_model_sklearn/2 test_model_sklearn/1
   ```  

1. Test Canary endpoint:
  
   ```bash
   curl -X POST "http://127.0.0.1:8080/serve/test_model" -H "accept: application/json" -H "Content-Type: application/json" -d '{"x0": 1, "x1": 2}'` 
   ```

### Model Monitoring and Performance Metrics

![Grafana Screenshot](https://github.com/allegroai/clearml-serving/raw/main/docs/grafana_screenshot.png)

ClearML serving instances send serving statistics (count/latency) automatically to Prometheus and Grafana can be used 
to visualize and create live dashboards. 

The default docker-compose installation is preconfigured with Prometheus and Grafana. Notice that by default data/ate 
of both containers is *not* persistent. To add persistence, adding a volume mount is recommended.

You can also add many custom metrics on the input/predictions of your models. Once a model endpoint is registered, 
adding custom metrics can be done using the CLI.

For example, assume the mock scikit-learn model is deployed on endpoint `test_model_sklearn`, you can log the requests 
inputs and outputs (see examples/sklearn/preprocess.py example):

```bash
clearml-serving --id <serving_service_id_here> metrics add --endpoint test_model_sklearn --variable-scalar
x0=0,0.1,0.5,1,10 x1=0,0.1,0.5,1,10 y=0,0.1,0.5,0.75,1
```

This will create a distribution histogram (buckets specified via a list of less-equal values after `=` sign),
that you will be able to visualize on Grafana.

:::info time-series values
You can also log time-series values with `--variable-value x2` or discrete results (e.g. classifications strings) with 
`--variable-enum animal=cat,dog,sheep`. Additional custom variables can be added in the preprocess and postprocess with 
a call to `collect_custom_statistics_fn({'new_var': 1.337})`. See [preprocess_template.py](https://github.com/allegroai/clearml-serving/blob/main/clearml_serving/preprocess/preprocess_template.py).
:::

With the new metrics logged, you can create a visualization dashboard over the latency of the calls, and the output distribution. 

#### Grafana Model Performance Example

1. Browse to `http://localhost:3000`
1. Login with: admin/admin
1. Create a new dashboard
1. Select Prometheus as data source
1. Add a query: `100 * increase(test_model_sklearn:_latency_bucket[1m]) / increase(test_model_sklearn:_latency_sum[1m])`
1. Change type to heatmap, and select on the right hand-side under "Data Format" select "Time series buckets". You now have 
   the latency distribution, over time.
1. Repeat the same process for x0, the query would be `100 * increase(test_model_sklearn:x0_bucket[1m]) / increase(test_model_sklearn:x0_sum[1m])`

:::note
If not specified all serving requests will be logged, which can be changed with the `CLEARML_DEFAULT_METRIC_LOG_FREQ` 
environment variable. For example `CLEARML_DEFAULT_METRIC_LOG_FREQ=0.2` means only 20% of all requests will be logged. 
You can also specify per-endpoint log frequency with the `clearml-serving` CLI. See [clearml-serving metrics](clearml_serving_cli.md#metrics).
:::

## Further Examples

See examples of ClearML Serving with other supported frameworks:

* [scikit-learn](https://github.com/allegroai/clearml-serving/blob/main/examples/sklearn/readme.md) - Random data
* [scikit-learn Model Ensemble](https://github.com/allegroai/clearml-serving/blob/main/examples/ensemble/readme.md) - Random data
* [XGBoost](https://github.com/allegroai/clearml-serving/blob/main/examples/xgboost/readme.md) - Iris dataset
* [LightGBM](https://github.com/allegroai/clearml-serving/blob/main/examples/lightgbm/readme.md) - Iris dataset
* [PyTorch](https://github.com/allegroai/clearml-serving/blob/main/examples/pytorch/readme.md) - MNIST dataset
* [TensorFlow/Keras](https://github.com/allegroai/clearml-serving/blob/main/examples/keras/readme.md) - MNIST dataset
* [Model Pipeline](https://github.com/allegroai/clearml-serving/blob/main/examples/pipeline/readme.md) - Random data
