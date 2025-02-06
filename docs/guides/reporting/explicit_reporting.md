---
title: Explicit Reporting Tutorial
---

In this tutorial, learn how to extend ClearML automagical capturing of inputs and outputs with explicit reporting. 

In this example, you will add the following to the [pytorch_mnist.py](https://github.com/allegroai/clearml/blob/master/examples/frameworks/pytorch/pytorch_mnist.py) 
example script from ClearML's GitHub repo:

* Setting an output destination for model checkpoints (snapshots).
* Explicitly logging a scalar, other (non-scalar) data, and logging text.
* Registering an artifact, which is uploaded to [ClearML Server](../../deploying_clearml/clearml_server.md), and ClearML logs changes to it.
* Uploading an artifact, which is uploaded, but changes to it are not logged.

## Prerequisites

* The [clearml](https://github.com/allegroai/clearml) repository is cloned.
* The `clearml` package is installed.
  
## Before Starting

Make a copy of [pytorch_mnist.py](https://github.com/allegroai/clearml/blob/master/examples/frameworks/pytorch/pytorch_mnist.py) 
to add explicit reporting to it.

```bash
cp pytorch_mnist.py pytorch_mnist_tutorial.py
```

## Step 1: Setting an Output Destination for Model Checkpoints

Specify a default output location, which is where model checkpoints (snapshots) and artifacts will be stored when the 
task runs. Some possible destinations include: 
* Local destination 
* Shared folder 
* Cloud storage: 
  * S3 EC2
  * Google Cloud Storage
  * Azure Storage. 
    
Specify the output location in the `output_uri` parameter of [`Task.init()`](../../references/sdk/task.md#taskinit). 
In this tutorial, specify a local folder destination.

In `pytorch_mnist_tutorial.py`, change the code from:

```python
task = Task.init(project_name='examples', task_name='pytorch mnist train')
```

to:

```python
model_snapshots_path = '/mnt/clearml'
if not os.path.exists(model_snapshots_path):
    os.makedirs(model_snapshots_path)

task = Task.init(
  project_name='examples', 
  task_name='extending automagical ClearML example', 
  output_uri=model_snapshots_path
)
```

When the script runs, ClearML creates the following directory structure:

```
+ - <output destination name>
|   +-- <project name>
|       +-- <task name>.<Task Id>
|           +-- models
|           +-- artifacts
```
and puts the model checkpoints (snapshots) and artifacts in that folder.

For example, if the Task ID is `9ed78536b91a44fbb3cc7a006128c1b0`, then the directory structure will be:
```
+ - model_snapshots
|   +-- examples
|       +-- extending automagical ClearML example.9ed78536b91a44fbb3cc7a006128c1b0
|           +-- models
|           +-- artifacts
```

## Step 2: Logger Class Reporting Methods

In addition to ClearML automagical logging, the `clearml` Python
package contains methods for explicit reporting of plots, log text, media, and tables. These methods include:

* [`Logger.report_histogram`](../../references/sdk/logger.md#report_histogram)
* [`Logger.report_confusion_matrix`](../../references/sdk/logger.md#report_confusion_matrix)
* [`Logger.report_scatter2d`](../../references/sdk/logger.md#report_scatter2d)
* [`Logger.report_scatter3d`](../../references/sdk/logger.md#report_scatter3d)
* [`Logger.report_surface`](../../references/sdk/logger.md#report_surface) 
  (surface diagrams)
* [`Logger.report_image`](../../references/sdk/logger.md#report_image) - Report an image and upload its contents.
* [`Logger.report_table`](../../references/sdk/logger.md#report_table) - Report a table as a Pandas DataFrame, CSV file, 
  or URL for a CSV file.
* [`Logger.report_media`](../../references/sdk/logger.md#report_media) - Report media including images, audio, and video.
* [`Logger.get_default_upload_destination`](../../references/sdk/logger.md#get_default_upload_destination) - Retrieve the destination that is set for uploaded media.

### Get a Logger

First, create a logger for the Task using [`Task.get_logger()`](../../references/sdk/task.md#get_logger):

```python
logger = task.get_logger()
```

### Plot Scalar Metrics

Add scalar metrics using [`Logger.report_scalar()`](../../references/sdk/logger.md#report_scalar) 
to report loss metrics.

```python
def train(args, model, device, train_loader, optimizer, epoch):
    
    save_loss = []
    
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()
        output = model(data)
        loss = F.nll_loss(output, target)
        loss.backward()
    
        save_loss.append(loss)
    
        optimizer.step()
        if batch_idx % args.log_interval == 0:
            print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
                epoch, batch_idx * len(data), len(train_loader.dataset),
                        100. * batch_idx / len(train_loader), loss.item()))
            # Add manual scalar reporting for loss metrics
            logger.report_scalar(title='Scalar example {} - epoch'.format(epoch), 
                series='Loss', value=loss.item(), iteration=batch_idx)
```

### Plot Other (Not Scalar) Data

The script contains a function named `test`, which determines loss and correct for the trained model. Add a histogram 
and confusion matrix to log them.

```python
def test(args, model, device, test_loader):
    
    save_test_loss = []
    save_correct = []
    
    model.eval()
    test_loss = 0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            # sum up batch loss
            test_loss += F.nll_loss(output, target, reduction='sum').item()
            # get the index of the max log-probability
            pred = output.argmax(dim=1, keepdim=True)
            correct += pred.eq(target.view_as(pred)).sum().item()
    
            save_test_loss.append(test_loss)
            save_correct.append(correct)
    
    test_loss /= len(test_loader.dataset)
    
    print('\nTest set: Average loss: {:.4f}, Accuracy: {}/{} ({:.0f}%)\n'.format(
        test_loss, correct, len(test_loader.dataset),
        100. * correct / len(test_loader.dataset)))
    
    logger.report_histogram(
      title='Histogram example', 
      series='correct',
      iteration=1, 
      values=save_correct, 
      xaxis='Test', 
      yaxis='Correct'
    )
    
    # Manually report test loss and correct as a confusion matrix
    matrix = np.array([save_test_loss, save_correct])
    logger.report_confusion_matrix(
      title='Confusion matrix example', 
      series='Test loss / correct', 
      matrix=matrix, 
      iteration=1
    )
```

### Log Text

Extend ClearML by explicitly logging text, including errors, warnings, and debugging statements. Use [`Logger.report_text()`](../../references/sdk/logger.md#report_text) 
and its `level` argument to report a debugging message.

```python
logger.report_text(
  'The default output destination for model snapshots and artifacts is: {}'.format(
    model_snapshots_path
  ), 
  level=logging.DEBUG
)
```


## Step 3: Registering Artifacts

Registering an artifact uploads it to ClearML Server, and if it changes, the change is logged in ClearML Server. 
Currently, ClearML supports Pandas DataFrames as registered artifacts.

### Register the Artifact

In the tutorial script, `test` function, you can assign the test loss and correct data to a Pandas DataFrame object and register 
that Pandas DataFrame using [`Task.register_artifact()`](../../references/sdk/task.md#register_artifact).

```python
# Create the Pandas DataFrame
test_loss_correct = {
        'test lost': save_test_loss,
        'correct': save_correct
}
df = pd.DataFrame(test_loss_correct, columns=['test lost','correct'])
    
# Register the test loss and correct as a Pandas DataFrame artifact
task.register_artifact(
  'Test_Loss_Correct', 
  df, 
  metadata={
    'metadata string': 'apple', 
    'metadata int': 100, 
    'metadata dict': {'dict string': 'pear', 'dict int': 200}
  }
)
```
    
### Reference the Registered Artifact

Once an artifact is registered, it can be referenced and utilized in the Python task script.

In the tutorial script, add [`Task.current_task()`](../../references/sdk/task.md#taskcurrent_task) and 
[`Task.get_registered_artifacts()`](../../references/sdk/task.md#get_registered_artifacts) 
to take a sample.

```python
# Once the artifact is registered, we can get it and work with it. Here, we sample it.
sample = Task.current_task().get_registered_artifacts()['Test_Loss_Correct'].sample(
  frac=0.5, 
  replace=True, 
  random_state=1
)
``` 
    
## Step 4: Uploading Artifacts

Artifact can be uploaded to the ClearML Server, but changes are not logged.

Supported artifacts include: 
* Pandas DataFrames
* Files of any type, including image files
* Folders - stored as ZIP files 
* Images - stored as PNG files
* Dictionaries - stored as JSONs
* Numpy arrays - stored as NPZ files

In the tutorial script, upload the loss data as an artifact using [`Task.upload_artifact()`](../../references/sdk/task.md#upload_artifact) 
with metadata specified in the `metadata` parameter.

```python
# Upload test loss as an artifact. Here, the artifact is numpy array
task.upload_artifact(
  'Predictions',
  artifact_object=np.array(save_test_loss),
  metadata={
    'metadata string': 'banana', 
    'metadata integer': 300,
    'metadata dictionary': {'dict string': 'orange', 'dict int': 400}
  }
)
```

## Additional Information

After extending the Python task script, run it and view the results in the **ClearML Web UI**.

```bash
python pytorch_mnist_tutorial.py
```

**To view the task results:**

1. In the **ClearML Web UI**, on the Projects page, click the examples project.
1. In the task table, click the **Extending automagical ClearML example** task.
1. In the **ARTIFACTS** tab, **DATA AUDIT** section, click **Test_Loss_Correct**. The registered Pandas DataFrame appears, 
   including the file path, size, hash, metadata, and a preview.
1. In the **OTHER** section, click **Loss**. The uploaded numpy array appears, including its related information.
1. Click the **CONSOLE** tab, and see the debugging message showing the Pandas DataFrame sample.
1. Click the **SCALARS** tab, and see the scalar plots for epoch logging loss.
1. Click the **PLOTS** tab, and see the confusion matrix and histogram.

## Next Steps

* See the [User Interface](../../webapp/webapp_overview.md) section to learn about its features.
* See the [ClearML Python Package Reference](../../clearml_sdk/clearml_sdk.md) to learn about 
  all the available classes and methods.