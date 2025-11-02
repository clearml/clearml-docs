---
title: Pipelines from Tasks
description: Learn more about automation and orchestration of multiple tasks with ClearML.
keywords: [mlops, components, automation, orchestration, pipeline]
---


## Video Tutorial

<div class="vid">
<iframe 
        src="https://www.youtube.com/embed/prZ_eiv_y3c?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Details class="panel info">
<summary class="panel-title">Video Transcript</summary>
Hello and welcome to ClearML. In this video we'll take a look at how pipelines can be created from tasks instead of from code like we saw in the last video.

The tasks themselves are already in the system by using the experiment manager. What's important to note here though is that hyperparameters, scalars, and artifacts should be reported correctly because the pipeline will consider them to be the inputs and outputs of each step. In that way, a step can easily access for example the artifacts from a previous step.

So with the tasks as our steps this time, we really only need to add our control logic. And since we don't have the main function as we had in the last video, we'll put our control logic code in a dedicated `PipelineController` script instead. Let's start with a small example.

Our example pipeline will consist of three distinct tasks. The first task downloads some data and then uploads it to ClearML as an artifact.

In a future video, I'll introduce you to ClearML Data which is actually our preferred way to handle data instead of uploading it as an artifact. So keep watching this getting started playlist if you want to know more.

The next task will preprocess that data. It has some hyperparameters here that configure the way the preprocessing is done. As you can see, the dataset `url` parameter is still empty. When the pipeline is run, these hyperparameters can be overwritten by the output of the previous step. We'll see how that's done a little later in the video. After the preprocessing, we'll upload the resulting training and test data as an artifact again. 

The final task will train a model on the preprocessed data by downloading the train and test artifacts from the previous step. Again, the actual parameter, preprocessing task ID in this case, will be overwritten by the real ID when the pipeline is run. You can see here in my experiment list, that I already have these 3 tasks already logged.

Now comes our control logic. Let's start by making a simple python script. We can create a `PipelineController` object and give it a name and a project, it will become visible in the experiment list under that name because just like anything in ClearML, the controller is just a task, albeit a special type of task in this case.

Next, we can add some pipeline level parameters. These can be easily accessed from within every step of the pipeline. They're basically global variables. In this case we'll add a parameter that will tell the first step where to get the raw data from. This is very useful because we'll see later that we can easily rerun our pipeline with a different URL.

Now we can define our steps. Each step needs a name and some link to the original task. We can either give it the original task's ID or provide the task name and project, in which case the controller will use the most recent task with that name in that project.

For the next step we do the same thing, only now, we want the controller to know that we only want to run this step after the previous one has been completed. We can easily do that by providing the name of the previous steps as a list to the `parents` argument. 

The structure of your pipeline will be derived from looking at this `parents` argument, so you can build your flow by defining the previous steps as parents for each following step in the pipeline.

Now we do the same for the final step. However, remember the empty hyperparameters we saw before? We still have to overwrite these. We can use the `parameter_override` argument to do just that.

For example, we can tell the first step to use the global pipeline parameter raw data url like so. But we can also reference output artifacts from a previous step by using its name, and we can of course also just overwrite a parameter with a normal value. Finally, we can even pass along the unique task ID of a previous step, so you can get the task object based on that ID and access anything and everything within that task.

And that's it! We now have our first pipeline!

Just like in the previous video, we can run the whole pipeline locally first, to debug our flow and make sure everything is working. If everything works as planned, we can then start it normally and everything will be enqueued instead. Your agents listening to the services queue will pick up the pipeline controller, clone the tasks that form your steps, override the necessary parameters and enqueue them into the `default` queue, for your other agents to start working on.

After running the script you can go to the pipeline screen and see the same kind of output as we saw last video: a list of pipeline runs, and when we click it, we get a nice visual representation of the pipeline.

Now we can do all the same things that we could with a pipeline built from code. We can see the overall details of the pipeline itself and the logs of the pipeline controller.

When we select a specific step, we can see its inputs and outputs as well as its logs down here and even the original code.

Finally, we can also clone the whole pipeline and change its parameters by clicking on the **+ New Run** button. This is the most powerful feature of all, as it allows us to really quickly rerun the whole pipeline with different parameters from the UI. The agents will take care of the rest!

In the next video of this Getting Started series, we'll take a look at ClearML Data, for real this time. In the meantime, spin up some pipeline controllers yourself for free at [app.clear.ml](https://app.clear.ml) and don't forget to join our [Slack channel](https://joinslack.clear.ml), if you need any help.
</Details>
