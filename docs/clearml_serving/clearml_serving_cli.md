---
title: ClearML Serving CLI 
--- 

The `clearml-serving` utility is a CLI tool for model deployment and orchestration. 

The following page provides a reference for `clearml-serving`'s CLI commands:
* [list](#list) - List running Serving Services
* [create](#create) - Create a new Serving Service
* [metrics](#metrics) - Configure inference metrics Service
* [config](#config) - Configure a new Serving Service
* [model](#model) - Configure model endpoints for a running Service

## Global Parameters

```bash
clearml-serving [-h] [--debug] [--yes] [--id ID] {list,create,metrics,config,model} 
```

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--id`|Serving Service (Control plane) Task ID to configure (if not provided, automatically detect the running control plane Task) | <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
|`--debug` |  Print debug messages | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
|`--yes` |Always answer YES on interactive inputs| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |

</div>

:::info Service ID
The Serving Service's ID (`--id`) is required to execute the `metrics`, `config`, and `model` commands.
:::

## list

List running Serving Services. 

```bash
clearml-serving list [-h]
```

## create

Create a new Serving Service.

```bash
clearml-serving create [-h] [--name NAME] [--tags TAGS [TAGS ...]] [--project PROJECT]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--name` |Serving service's name. Default: `Serving-Service`| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
|`--project`|Serving service's project. Default: `DevOps`| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" /> |
|`--tags` |Serving service's user tags. The serving service can be labeled, which can be useful for organizing | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

## metrics

Configure inference metrics Service.

```bash
clearml-serving metrics [-h] {add,remove,list}
```

### add 

Add/modify metric for a specific endpoint.

```bash
clearml-serving metrics add [-h] --endpoint ENDPOINT [--log-freq LOG_FREQ]
                            [--variable-scalar VARIABLE_SCALAR [VARIABLE_SCALAR ...]]
                            [--variable-enum VARIABLE_ENUM [VARIABLE_ENUM ...]]
                            [--variable-value VARIABLE_VALUE [VARIABLE_VALUE ...]]
```
**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--endpoint`|Metric endpoint name including version (e.g. `"model/1"` or a prefix `"model/*"`). Notice: it will override any previous endpoint logged metrics| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--log-freq`|Logging request frequency, between 0.0 to 1.0. Example: 1.0 means all requests are logged, 0.5 means half of the requests are logged if not specified. To use global logging frequency, see [`config --metric-log-freq`](#config)| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--variable-scalar`|Add float (scalar) argument to the metric logger, `<name>=<histogram>`. Example: with specific buckets: `"x1=0,0.2,0.4,0.6,0.8,1"` or with min/max/num_buckets `"x1=0.0/1.0/5"`. Notice: In cases where 1000s of requests per second reach the serving, it makes no sense to display every datapoint. So scalars can be divided in buckets, and for each minute for example. Then it's possible to calculate what % of the total traffic fell in bucket 1, bucket 2, bucket 3 etc. The Y axis represents the buckets, color is the value in % of traffic in that bucket, and X is time. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--variable-enum`|Add enum (string) argument to the metric logger, `<name>=<optional_values>`. Example: `"detect=cat,dog,sheep"` |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--variable-value`|Add non-samples scalar argument to the metric logger, `<name>`. Example: `"latency"` |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

### remove

Remove metric from a specific endpoint.

```bash
clearml-serving metrics remove [-h] [--endpoint ENDPOINT]
                               [--variable VARIABLE [VARIABLE ...]]
```
**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--endpoint`| Metric endpoint name including version (e.g. `"model/1"` or a prefix `"model/*"`) |<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--variable`| Remove (scalar/enum) argument from the metric logger, `<name>` example: `"x1"` |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

### list

List metrics logged on all endpoints.

```bash
clearml-serving metrics list [-h]
```

<br/>

## config

Configure a new Serving Service. 

```bash
clearml-serving config [-h] [--base-serving-url BASE_SERVING_URL]
                       [--triton-grpc-server TRITON_GRPC_SERVER]
                       [--kafka-metric-server KAFKA_METRIC_SERVER]
                       [--metric-log-freq METRIC_LOG_FREQ]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--base-serving-url`|External base serving service url. Example: `http://127.0.0.1:8080/serve`|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--triton-grpc-server`|External ClearML-Triton serving container gRPC address. Example: `127.0.0.1:9001`|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--kafka-metric-server`|External Kafka service url. Example: `127.0.0.1:9092`|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--metric-log-freq`|Set default metric logging frequency between 0.0 to 1.0. 1.0 means that 100% of all requests are logged|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

<br/>

## model

Configure model endpoints for an already running Service.

```bash
clearml-serving model [-h] {list,remove,upload,canary,auto-update,add}
```

### list 

List current models.

```bash
clearml-serving model list [-h]
```

### remove 

Remove model by its endpoint name.

```bash
clearml-serving model remove [-h] [--endpoint ENDPOINT]
```

**Parameter**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--endpoint` | Model endpoint name | <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|

</div>

### upload 
Upload and register model files/folder.

```bash
clearml-serving model upload [-h] --name NAME [--tags TAGS [TAGS ...]] --project PROJECT
                             [--framework {tensorflow,tensorflowjs,tensorflowlite,pytorch,torchscript,caffe,caffe2,onnx,keras,mknet,cntk,torch,darknet,paddlepaddle,scikitlearn,xgboost,lightgbm,parquet,megengine,catboost,tensorrt,openvino,custom}]
                             [--publish] [--path PATH] [--url URL]
                             [--destination DESTINATION]
```
**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--name`|Specifying the model name to be registered in| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--tags`| Add tags to the newly created model| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project`| Specify the project for the model to be registered in| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--framework`| Specify the model framework. Options are: 'tensorflow', 'tensorflowjs', 'tensorflowlite', 'pytorch', 'torchscript', 'caffe', 'caffe2', 'onnx', 'keras', 'mknet', 'cntk', 'torch', 'darknet', 'paddlepaddle', 'scikitlearn', 'xgboost', 'lightgbm', 'parquet', 'megengine', 'catboost', 'tensorrt', 'openvino', 'custom' | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--publish`| Publish the newly created model (change model state to "published" (i.e. locked and ready to deploy)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--path`|Specify a model file/folder to be uploaded and registered| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--url`| Specify an already uploaded model url (e.g. `s3://bucket/model.bin`, `gs://bucket/model.bin`)|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--destination`|Specify the target destination for the model to be uploaded. For example: <ul><li>S3: `s3://bucket/folder`</li><li>Non-AWS S3-like services (such as MinIO): `s3://host_addr:port/bucket`. **Note that port specification is required**.</li><li>Google Cloud Storage: `gs://bucket-name/folder`</li><li>Azure Storage: `azure://<account name>.blob.core.windows.net/path/to/file`</li></ul>|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>


### canary 

Add model Canary/A/B endpoint.

```bash
clearml-serving model canary [-h] [--endpoint ENDPOINT] [--weights WEIGHTS [WEIGHTS ...]]
                             [--input-endpoints INPUT_ENDPOINTS [INPUT_ENDPOINTS ...]]
                             [--input-endpoint-prefix INPUT_ENDPOINT_PREFIX]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--endpoint`| Model canary serving endpoint name (e.g. `my_model/latest`)| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--weights`| Model canary weights (order matching model ep), (e.g. 0.2 0.8) |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-endpoints`|Model endpoint prefixes, can also include version (e.g. `my_model`, `my_model/v1`)| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-endpoint-prefix`| Model endpoint prefix, lexicographic order or by version `<int>` (e.g. `my_model/1`, `my_model/v1`), where the first weight matches the last version.|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|


</div>

### auto-update 

Add/Modify model auto-update service.

```bash
clearml-serving model auto-update [-h] [--endpoint ENDPOINT] --engine ENGINE
                                  [--max-versions MAX_VERSIONS] [--name NAME]
                                  [--tags TAGS [TAGS ...]] [--project PROJECT]
                                  [--published] [--preprocess PREPROCESS]
                                  [--input-size INPUT_SIZE [INPUT_SIZE ...]]
                                  [--input-type INPUT_TYPE] [--input-name INPUT_NAME]
                                  [--output-size OUTPUT_SIZE [OUTPUT_SIZE ...]]
                                  [--output_type OUTPUT_TYPE] [--output-name OUTPUT_NAME]
                                  [--aux-config AUX_CONFIG [AUX_CONFIG ...]]
```
**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--endpoint`|   Base model endpoint (must be unique)| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--engine`| Model endpoint serving engine (triton, sklearn, xgboost, lightgbm)| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--max-versions`|Max versions to store (and create endpoints) for the model. Highest number is the latest version | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--name`| Specify model name to be selected and auto-updated (notice regexp selection use `"$name^"` for exact match) | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--tags`|Specify tags to be selected and auto-updated |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project`|Specify model project to be selected and auto-updated | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--published`| Only select published model for auto-update |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--preprocess` |Specify Pre/Post processing code to be used with the model (point to local file / folder) - this should hold for all the models |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-size`| Specify the model matrix input size [Rows x Columns X Channels etc ...] | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-type`| Specify the model matrix input type. Examples: uint8, float32, int16, float16 etc. |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-name`|Specify the model layer pushing input into. Example: layer_0 | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--output-size`|Specify the model matrix output size [Rows x Columns X Channels etc ...]|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--output_type`| Specify the model matrix output type. Examples: uint8, float32, int16, float16 etc. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />| 
|`--output-name`|Specify the model layer pulling results from. Examples: layer_99| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--aux-config`| Specify additional engine specific auxiliary configuration in the form of key=value. Example: `platform=onnxruntime_onnx response_cache.enable=true max_batch_size=8`. Notice: you can also pass a full configuration file (e.g. Triton "config.pbtxt")|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

### add

Add/Update model.

```bash
clearml-serving model add [-h] --engine ENGINE --endpoint ENDPOINT [--version VERSION]
                          [--model-id MODEL_ID] [--preprocess PREPROCESS]
                          [--input-size INPUT_SIZE [INPUT_SIZE ...]]
                          [--input-type INPUT_TYPE] [--input-name INPUT_NAME]
                          [--output-size OUTPUT_SIZE [OUTPUT_SIZE ...]]
                          [--output-type OUTPUT_TYPE] [--output-name OUTPUT_NAME]
                          [--aux-config AUX_CONFIG [AUX_CONFIG ...]] [--name NAME]
                          [--tags TAGS [TAGS ...]] [--project PROJECT] [--published]
```

**Parameters**

<div className="tbl-cmd">

|Name|Description|Mandatory|
|---|---|---|
|`--engine`| Model endpoint serving engine (triton, sklearn, xgboost, lightgbm)| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--endpoint`| Base model endpoint (must be unique)| <img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--version`|Model endpoint version (default: None) | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--model-id`|Specify a model ID to be served|<img src="/docs/latest/icons/ico-optional-yes.svg" alt="Yes" className="icon size-md center-md" />|
|`--preprocess` |Specify Pre/Post processing code to be used with the model (point to local file / folder) - this should hold for all the models |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-size`| Specify the model matrix input size [Rows x Columns X Channels etc ...] | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-type`| Specify the model matrix input type. Examples: uint8, float32, int16, float16 etc. |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--input-name`|Specify the model layer pushing input into. Example: layer_0 | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--output-size`|Specify the model matrix output size [Rows x Columns X Channels etc ...]|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--output_type`| Specify the model matrix output type. Examples: uint8, float32, int16, float16 etc. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />| 
|`--output-name`|Specify the model layer pulling results from. Examples: layer_99| <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--aux-config`| Specify additional engine specific auxiliary configuration in the form of key=value. Example: `platform=onnxruntime_onnx response_cache.enable=true max_batch_size=8`. Notice: you can also pass a full configuration file (e.g. Triton "config.pbtxt")|<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--name`| Instead of specifying `--model-id` select based on model name | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--tags`|Specify tags to be selected and auto-updated |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--project`|Instead of specifying `--model-id` select based on model project | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|
|`--published`| Instead of specifying `--model-id` select based on model published |<img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" />|

</div>

