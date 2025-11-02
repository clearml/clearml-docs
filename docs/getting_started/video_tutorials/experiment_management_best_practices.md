---
title: Experiment Management Best Practices
description: Learn about the ClearML Experiment Manager best practices.
keywords: [mlops, components, Experiment Manager]
---


## Video Tutorial

<div class="vid">
<iframe 
        src="https://www.youtube.com/embed/kyOfwVg05EM?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Details class="panel info">
<summary class="panel-title">Video Transcript</summary>
Welcome to ClearML. In this video, we’ll go deeper into some of the best practices and advanced tricks you can use while working with ClearML experiment management.
<br/>
The first thing to know is that the Task object is the central pillar of both the experiment manager and the orchestration and automation components. This means that if you manage the task well in the experiment phase, it will be much easier to scale to production later down the line. 

So let’s take a look at the task object in more detail. We have inputs called hyperparameters and configuration objects for external config files. Outputs can be anything like we saw in the last video. Things like debug images, plots and console output kind of speak for themselves, so the ones we’ll focus on here are scalars and artifacts.

So let’s start with the inputs: hyperparameters. Hyperparameters are the configuration options of your code, not only your model. Usually people put them in a `config.py` file or a global dictionary for example. Others just use command line parameters for this. 

Let’s take this simple code as an example. First of all, we start the script with the 2 magic lines of code that we covered before. Next to that we have a mix of command line arguments and some additional parameters in a dictionary here. 

The command line arguments will be captured automatically, and for the dict (or really any python object) we can use the `Task.connect()` function, to report our dict values as ClearML hyperparameters. 

As you can see, when we run the script, all hyperparameters are captured and parsed by the server, giving you a clean overview in the UI.

Configuration objects, however, work slightly differently and are mostly used for more complex configurations, like a nested dict or a yaml file for example. They’re logged by using the `Task.connect_configuration()` function instead and will save the configuration as a whole, without parsing it.

We have now logged our task with all of its inputs, but if we wanted to, we could rerun our code with different parameters and this is where the magic happens.

Remember ClearML also stores your code environment, making it reproducible. So when we clone our task here, we’re making a copy of everything in that task, and it will be in draft mode. Now we can edit any of the hyperparameters straight from the interface. We can then enqueue the task, so it will be remotely executed by one of your agents. What’s special about that is that the changed parameters will be injected in your original code! So when your code now addresses the parameter we just changed, it will work with the new value instead. This allows you to very quickly run experiments with different parameters. We can even do this automatically, but that’s a topic for the video on automation.

Back to the overview. One of the output types you can add to your task is what’s called an artifact.

An artifact can be a lot of things, mostly they’re files like model weights or Pandas DataFrames containing preprocessed features for example. Our documentation lists all supported data types.

You can download the artifacts your code produced from the web UI to your local computer if you want to, but artifacts can also be retrieved programmatically.

Let’s say we have a preprocessing task, which produces a set of features as an artifact, and we have a training task.

We can set up our training task to pull the features artifact from our preprocessing task and start training on it. We can either select the preprocessing task by its ID or just by its name, in which case the newest task in the project will be pulled. In that case, if we get new data and rerun our preprocessing task, our training task will automatically pull the newest features the next time it’s executed. You can even go further by using tags for example. No more shuffling around csv files.

Another type of artifact are model files or weight files, but *they* get a special place in the ClearML ecosystem. First of all models that are saved using any of the major machine learning libraries will automatically be captured just like the command line arguments from before.

Next to that, models are not JUST artifacts of their original task, they also exist as a standalone entity, which has 2 major advantages.

First, you don’t have to find the original task and then get the attached model like with other artifacts, you can just pull a model by its ID or tag. They can also be shared individually, without sharing the whole task.

Secondly, you’re organically building up a central model repository while running your experiments, which will be super valuable when later we need to serve the model for example. We can just pull the latest model in a similar way to how we pulled the features from before.

Finally, we have the scalars. These are numeric metrics that reflect the performance of your training runs, such as loss or accuracy for example.

There’s quite some benefits to properly keeping track of your scalars instead of just looking at the console output for example. They are nicely plotted over time and so can be easily compared to other experiment runs like we saw in the last video. Next to that you can add scalars as custom columns in your experiment overview, effectively creating a leaderboard of your best models.

And then we’re not even talking about all the ways to automate tasks using these scalars, artifacts, and hyperparameters. Trust me, in the future, your MLOps engineer will cry of happiness if you do this correctly now, and chances are that engineer is going to be you.

For the next videos we’ll finally cover automation and orchestration as well as ClearML Data, our data versioning tool.

Feel free to check out and test all of these features at [app.clear.ml](https://app.clear.ml), or using our self-hosted server on GitHub and don’t forget to join our [Slack channel](https://joinslack.clear.ml) if you need any help.

</Details>
