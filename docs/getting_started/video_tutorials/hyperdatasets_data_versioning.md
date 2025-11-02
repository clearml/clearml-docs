---
title: Hyper-Datasets Data Versioning
description: Learn more about the Hyper-Datasets, a supercharged version of ClearML Data.
keywords: [mlops, components, hyperdatasets]
---


## Video Tutorial

<div class="vid">
<iframe 
        src="https://www.youtube.com/embed/1VliYRexeLU?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Details class="panel info">
<summary class="panel-title">Video Transcript</summary>
Hello and welcome to ClearML. In this video, we're taking a closer look at Hyper-Datasets, a supercharged version of ClearML Data.

Hyper-Datasets is a data management system that’s designed for unstructured data like text, audio, or visual data. It is part of the ClearML paid offering, which means it brings along quite a bit of upgrades over the open source `clearml-data`.

The main conceptual difference between the two is that Hyper-Datasets decouple the metadata from the raw data files. This allows you to manipulate the metadata in all kinds of ways while abstracting away the logistics of having to deal with large amounts of data. 

Manipulating the metadata is done through queries and parameters, both of which can then be tracked using the experiment manager. 

This means it’s easy to not only trace back which data was used at the time of training, but also clone the experiment and rerun it using different data manipulations without changing a single line of code! Combine this with the `clearml-agent` and autoscalers and you can start to see the potential.

The data manipulations themselves become part of the experiment, we call it a dataview. A machine learning engineer can create the model training code and then a data engineer or QA engineer can experiment with different dataset configurations without any coding. In essence the data access is completely abstracted.

By contrast, in ClearML Data, just like many other data versioning tools, the data and the metadata are entangled. Take this example where the label of the image is defined by which folder it is in, a common dataset structure. What if I want to train only on donuts? Or what if I have a large class imbalance? I still have to download the whole dataset even though I might only be using a small part of it. Then I have to change my code to only grab the donut images or to rebalance my classes by over or under sampling them. If later I want to add waffles to the mix, I have to change my code again. 

Let’s take a look at an example that will show you how to use Hyper-Datasets to debug an underperforming model. But first, we start where any good data science projects starts: data exploration.

When you open Hyper-Datasets to explore a dataset, you can find the version history of that dataset here. Datasets can have multiple versions, which in turn can have multiple child versions. Each of the child versions will inherit the contents of their parents.

By default, a dataset version will be in draft mode, meaning it can still be modified. You can press the **Publish** button to essentially lock it to make sure it will not change anymore. If you want to make changes to a published dataset version, make a new version that’s based on it.

You’ll find automatically generated label statistics here, that give you a quick overview of the label distribution in your dataset as well as some version metadata and other version information. 

Over here you can actually see the contents of the dataset itself. In this case, we’re storing images, but it could also be video, audio, text, or even a reference to a file that’s stored somewhere else, such as in an S3 bucket.

When you click on one of the samples, you can see the image itself as well as any bounding boxes, keypoints, or masks the image may have been annotated with. In fact, over here you can see a list of all the annotations in the image, including classification labels for the image itself. After going back to the main screen, you can also view your samples as a table instead of a preview grid, which can be handy for audio or text for example.

Above the table, you can try out the querying functionality by switching to advanced filters here. As an example, you could create a query that only includes donuts with a certainty of at least 75 percent. You can query on basically any metadata or annotation, so go nuts!

The goal of these queries is not to simply serve as a neat filter for data exploration, we want to use these queries as part of our machine learning experiments!

Enter the dataviews that I introduced in the beginning of this video. Dataviews can use sophisticated queries to connect specific data from one or more datasets to an experiment in the experiment manager. Essentially it creates and manages local views of remote Datasets.

As an example, imagine you have created an experiment that tries to train a model based on a specific subset of data using Hyper-Datasets.

To get the data you need to train on, you can easily create a dataview from code like so. Then you can add all sorts of constraints, like class filters, metadata filters, and class weights which will over or under sample the data as is required.

After running the task, we can see it in the experiment manager. The model is reporting scalars and training as we would expect. When using Hyper-Datasets, there is also a **Dataviews** tab with all of the possibilities at your disposal. You can see which input datasets and versions that you used and can see the querying system that is used to subset them. This will already give you a nice, clean way to train your models on a very specific subset of the data, but there is more!

If you want to remap labels, or enumerate them to integers on-the-fly, ClearML will keep track of all the transformations that are done and make sure they are reproducible. There is, of course, more still, so if you’re interested check out our documentation on Hyper-Datasets.

ClearML veterans already know what’s coming next. Cloning.

Imagine the scenario that the machine learning engineer has created the model training code that we saw before and integrated a dataview as the data source.

Now, a QA engineer or data analyst has spotted that the data distribution is not very balanced and that’s throwing the model off.

Without changing anything to the underlying code, someone can clone the existing experiment. This allows them to change any of the queries or parameters in the dataview itself. In this example, we’ll change the class weight to something else, modifying the data distribution in the process. You can then enqueue this experiment for a remote ClearML agent to start working on. The exact same model will be retraining on a different data distribution running on a remote machine in just a few clicks, no code change required.

After the remote machine has executed the experiment on the new dataview, we can easily compare the 2 experiments to further help us with our analysis. This is a very fast and efficient way to iterate and get rid of so much unnecessary work.

If you’ve been following along with the other Getting Started videos, you should already start to see the potential this approach can have. For example: we could now run hyperparameter optimization on the data itself, because all of the filters and settings previously shown are just parameters on a task. The whole process could be running in parallel on a cloud autoscaler for example. Imagine finding the best training data confidence threshold for each class to optimize the model performance.

If you’re interested in using Hyper-Datasets for your team, then contact us using our website, and we’ll get you going in no time. In the meantime, you can enjoy the power of the open source components at [app.clear.ml](https://app.clear.ml), and don’t forget to join our [Slack channel](https://joinslack.clear.ml), if you need any help!

</Details>
