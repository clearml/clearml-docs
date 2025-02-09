---
title: Pipelines from Code
description: Learn more about automation and orchestration of multiple tasks with ClearML.
keywords: [mlops, components, automation, orchestration, pipeline]
---


## Video Tutorial

<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/UVBk337xzZo?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Collapsible type="info" title="Video Transcript">
Hello and welcome to ClearML. In this video we'll take a look at how pipelines can be used as a way to easily automate and orchestrate multiple tasks.

Essentially, pipelines are a way to automate and orchestrate the execution of multiple tasks in a scalable way. Each task in the context of a ClearML pipeline is called a step or component, and it doesn't necessarily have to be an existing ClearML *task*, it can be any code.

A pipeline can be orchestrated using your own control logic. So you could say run task 2 only if task 1 was successful. But you can do more complex control logic too, like if the accuracy of the final model is not high enough, run the pipeline again with different parameters.

Pipelines are highly scalable too. Just like any object in the ClearML ecosystem, a pipeline is a task with inputs and outputs that you can clone just like any other. If you saw our video on HPO, this should ring a bell. It's completely doable to use hyperparameter optimization to optimize a complete pipeline and have all of the steps be run distributed on an auto-scaling cluster of agents. How is that not awesome?

Ok, but how do we make one? In ClearML there are 2 main ways. 

One is you can easily chain existing ClearML tasks together to create a single pipeline. This means each step in the pipeline is a task that you tracked before using the experiment manager. On the other hand, you could go a little deeper and create pipelines straight from your codebase, which is what we'll focus on in this video. But don't worry, the end result is the same in both cases: a ClearML pipeline. 

Let's say we have some functions that we already use to run ETL and another function that trains a model on the preprocessed data. We already have a main function too, that orchestrates when and how these other components should be run.

If we want to make this code into a pipeline, the first thing we have to do is to tell ClearML that these functions are supposed to become steps in our pipeline. We can do that by using a Python decorator! For each function we want as a step, we can decorate it with `PipelineDecorator.component`.

The component call will fully automatically transform this function into a ClearML task, with all the benefits that come with that. It will also make it clear that this task will be part of a larger pipeline.

We can specify what values the function will return and these will become artifacts in the new task. This will allow the following tasks in the pipeline to easily access them. 

We can also cache the function, which means that if the pipeline is rerun, but this function didn't change, we will not execute the function again, which is super handy when loading lots of data that takes a long time for example.

You can go quite far with configuring this component, one can even specify in which docker image this particular step should be executed when it's run by the agent. Check our documentation in the links below for a detailed overview of all the arguments.

The next thing we need is our control logic, the code that binds all other code together. In ClearML this is called a controller. We already have our control logic as code in our main function, so we can add a different decorator on here which is called: `pipeline`. The only arguments you need for the pipeline decorator is a name and a project just like any other task. Easy as pie.

Finally, we can add parameters to the pipeline as a whole. This means we can easily change these parameters later in the UI and rerun the pipeline with the new parameters fully automatically, just like we did with normal tasks in the previous videos.

An important note here is that only if a step uses the output of a previous step, it will wait for that previous step to be completed before starting itself. If not, the steps will be executed in parallel.

At last, we can now run our pipeline! We can choose to run it locally which means both the controller and all the steps will be run as subprocesses on your local machine. This is great for debugging, but if we want the real scaling powers of our pipeline, we can execute it normally and the pipeline and tasks will be queued instead, so they can be executed by our remote agents. The pipeline task itself will be enqueued in a special `services` queue, so when setting up your agents for pipeline execution, take a look at the documentation first.

After running the pipeline, you can see both the controller task and the first step popping up in the experiment view. But it's easier to use the dedicated pipeline UI, which we can find on the left here.

Here, we can find our pipeline project which automatically keeps track of every run we do. If we click on our pipeline here, we can see a nice visual representation of our pipeline steps. 

When no step is selected, we can see our global pipeline info on the right. By clicking on the details button, we get the console output of our pipeline controller, our main function in the example, so we can see which steps were executed when.

If we select a step from our pipeline, we can see much of the same details, but this time for that specific step. On the right we can see any inputs or outputs our step produced and below, we can see the steps console output as well as the original code.

But now comes the most powerful feature of all. Again, a pipeline controller is a task like any other, so… we can clone it like any other. Pressing the **+ New Run** button will allow us to do that from the UI! We can even change our global pipeline parameters here and, just like normal tasks, these will be injected into the original task and overwrite the original parameters. In this way, you can very quickly run many pipelines each with different parameters.

In the next video of this Getting Started series, we'll get a long-overdue look at ClearML Data, our data versioning tool. In the meantime, slap some pipeline decorators on your own functions for free at [app.clear.ml](https://app.clear.ml), and don't forget to join our [Slack channel](https://joinslack.clear.ml), if you need any help.
</Collapsible>
