---
title: Experiment Manager Hands-on
description: Learn more about the ClearML Experiment Manager.
keywords: [mlops, components, Experiment Manager]
---


## Video Tutorial

<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/bjWwZAzDxTY?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Collapsible type="info" title="Video Transcript">
Welcome to ClearML! In this video, you’ll learn how to quickly get started with the experiment manager by adding 2 simple lines of Python code to your existing project.

This is the experiment manager's UI, and every row you can see here, is a single run of your code. So let’s set everything up in the code first, and then we’ll come back to this UI later in the video.

We’re currently in our project folder. As you can see, we have our very basic toy example here that we want to keep track of by using ClearML’s experiment manager.

The first thing to do is to install the `clearml` Python package in our virtual environment. Installing the package itself, will add 3 commands for you. We’ll cover the `clearml-data` and `clearml-task` commands later. For now the one we need is `clearml-init`.

If you paid attention in the first video of this series, you’d remember that we need to connect to a ClearML Server to save all our tracked data. The server is where we saw the list of experiments earlier. This connection is what `clearml-init` will set up for us. When running the command it’ll ask for your server API credentials.

To get those, go to your ClearML server webpage. If you’re using our hosted service, this will be at [app.clear.ml](https://app.clear.ml). if you’re hosting your own, browse to your server's address at port 8080. Go to your settings on the top right and, under workspace, create new credentials. This will pop up a window with your API info, and you can just copy paste it into the `clearml-init` prompt.

The prompt will suggest the server URLs that were in your copied snippet. If they are correct just press Enter, otherwise you can change them here.

Now we’re all set to add the 2 magic lines to our code and start tracking our experiments!

The first line imports the Task object from the `clearml` package and the second line creates a new task in a certain project. That project will be created if it doesn’t exist already. 

Now we can just run the experiment and see it pop up in realtime in our web view! The experiment will also generate a link to your experiment page for easy access. From here we have a lot of cool features at our disposal.

This is our experiment overview, experiments in ClearML are called tasks. If we click on one of our tasks here, we get the detailed overview that we saw earlier.

We can change the task’s name by clicking it here, and add a description or get the task’s ID here. We can also add tags to our task for easy filtering and searching.

First of all, source code is captured. If you’re working in a git repository we’ll save your git information along with any uncommitted changes. If you’re running an unversioned script, `clearml` will save the script instead.

Together with the Python packages your code uses, this will allow you to recreate your experiment on any machine.

Similarly, all of the output the code produces will also be captured.

The 2 magic lines will also automatically hook into most ML/DL libraries when they’re imported by your code. For example when python argparse is used to handle command line arguments, the arguments themselves will be captured by ClearML without any extra code. In the same way, other frameworks such as tensorflow, pytorch, and matplotlib will automatically log hyperparameters, model checkpoints, preview images, and plots for example. 

Next to automatic logging, it is super easy to manually add anything you want to the task with just a single extra line of code. Artifacts are usually meant for reusable files like model weights, while debug samples can show any output type like annotated images or even audio or video clips.

Just take a look at our documentation for more info.

If you want to show colleagues or friends how well your models are performing, you can easily share a task by right-clicking it and choosing share to make it accessible with a link. Anyone visiting that link will get the detail view in fullscreen mode and the task itself will get a tag showing that it’s now shared.

In many cases, we also want to compare multiple versions of our experiments directly, this is easily done by selecting the tasks you’re interested in and clicking on compare in the bottom ribbon.

This will bring up the same information tabs as in our detail view.

Differences are highlighted in red, and you can choose to hide everything that’s the same between tasks for a cleaner comparison.

Scalars such as loss or accuracy will be plotted on the same axes which makes comparing them much more convenient.

Finally, plots such as a confusion matrix and debug samples can be compared too. For those times when you just want to confirm that the new model is better with your own eyes.

Now that you’re ready to start tracking and managing your experiments, we’ll cover some more advanced features and concepts of the experiment manager in the next video. But if you want to get started right now, head over to clear.ml and join our community [Slack channel](https://joinslack.clear.ml) if you need any help.
</Collapsible>
