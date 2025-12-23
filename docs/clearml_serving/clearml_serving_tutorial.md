---
title: ClearML Serving Quick Start Tutorial 
---

This tutorial shows how to go from setting up `clearml-serving` to a locally deploying and querying a model endpoint: 

1. Install the `clearml-serving` package  
1. Start serving session  
1. Train and serve a model  
1. Query the deployed Endpoint

## Initial Steps

* Clone the `clearml-serving` repository locally:

  ```bash
  ~$ git clone https://github.com/clearml/clearml-serving.git  
  ```
* Install the `clearml-serving` package locally:   

  ```bash
  ~$ pip install -U clearml-serving 
  ``` 
  
* Connect `clearml` SDK to the server, see instructions [here](../clearml_sdk/clearml_sdk_setup.md#install-clearml)

:::note Using Docker Compose V1?
Docker Compose V1 reached end-of-life in July 2023 and is no longer receiving updates.
The commands in this guide use V2 syntax. If you're still on V1:
- Replace `docker compose` with `docker-compose`
- Replace `compose.yaml` with `docker-compose.yml`

We strongly recommend [migrating to Docker Compose V2](https://docs.docker.com/compose/migrate/)
for continued support and new features.
:::

## Run Triton-based Serving Inference Container (Docker Compose)

In the following steps, you will set up the inference container with Triton using Docker compose:

1. Start a serving session:   
   ```bash  
   ~$ clearml-serving create --name "serving example"  
   ```

   This command prints the Serving Service ID:

   ```
   New Serving Service created: id=<serving_service_id>
   ```

   Copy the Serving Service UID, as you will need it in the next steps.

2. Inside the `clearml-serving` repository, edit the `clearml-serving/docker/example.env` file with your `clearml-server` 
   credentials and serving service ID:   
   * `CLEARML_WEB_HOST="<clearml_web_host_address>"`  
   * `CLEARML_API_HOST="<clearml_api_host_address>"`  
   * `CLEARML_FILES_HOST="<clearml_files_host_address>"`  
   * `CLEARML_API_ACCESS_KEY="<access_key>"`
   * `CLEARML_API_SECRET_KEY="<secret_key>"`
   * `CLEARML_SERVING_TASK_ID="<serving_service_id>"`

3. Go to `clearml-serving/docker` and run the following command:
   ```bash
   ~/clearml-serving/docker$ docker compose --env-file example.env -f compose-triton.yaml up
   ```
   This spins up the Triton inference container with all its relevant services. Now we can start serving models. 

## Train a Model

Train a model and add it to your ClearML model repository, so you can later serve it:  

1. Run the following example script:  [https://github.com/clearml/clearml-serving/blob/main/examples/pytorch/train_pytorch_mnist.py](https://github.com/clearml/clearml-serving/blob/main/examples/pytorch/train_pytorch_mnist.py).

   This example creates a ClearML task and trains a model using PyTorch on top of the MNIST dataset. Once the example 
   finishes running, the output model is logged to the task and added to the ClearML model repository.  

2. Navigate to the task's **Artifacts** tab in the ClearML WebApp. Copy the model's UUID, which will be used in the next step.

## Serve the Model 

Now that you have a model in the ClearML model repository, you can serve it through a serving endpoint:

1. Run the following command from the base directory of `clearml-serving`:   
   
   ```bash
   ~/clearml-serving$ clearml-serving --id <service_id> model add --engine triton --endpoint "test_model_pytorch" --preprocess "examples/pytorch/preprocess.py" --model-id <model_id> --input-size 1 28 28 --input-name "INPUT__0" --input-type float32 --output-size-1 10 --output-name "OUTPUT__0" --output-type float32
   ```  
   This will start serving the model. Your endpoint will be: `http://127.0.0.1:8080/serve/test_model_pytorch`.  
2. Access the endpoint with a CURL command:  
   
   ```bash
   $ curl -X POST "http://127.0.0.1:8080/serve/test_model_pytorch" -H "accept: application/json" -H "Content-Type: application/json" -d '{"url": "https://raw.githubusercontent.com/allegroai/clearml-serving/main/examples/pytorch/5.jpg"}'  
   ```

   The `url` parameter points to the payload. You can play around with it now and change the URL to any image from [this dataset](https://www.kaggle.com/datasets/ben519/mnist-as-png). 
