---
title: Hyperparameter Optimization
description: Learn more about hyperparameter optimization.
keywords: [mlops, components, hyperparameter optimization, hyperparameter]
---


## Video Tutorial

<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/dLkP7y4USFg?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Collapsible type="info" title="Video Transcript">
Hello and welcome to ClearML. In this video we'll take a look at one cool way of using the agent other than rerunning a task remotely: hyperparameter optimization (HPO).

By now, we know that ClearML can easily capture our hyperparameters and scalars as part of the experiment tracking. We also know we can clone any task and change its hyperparameters, so they'll be injected into the original code at runtime. In the last video, we learnt how to make a remote machine execute this task automatically by using the agent. 

Soooo… Can we just clone a task like 100 times, inject different hyperparameters in every clone, run the clones on 10 agents and then sort the results based on a specific scalar?

Yeah, yeah we can, it's called hyperparameter optimization. And we can do all of this automatically too! No way you were going to clone and edit those 100 tasks yourself, right?

If you don't know what Hyperparameter Optimization is yet, you can find a link to our blog post on the topic in the description below. But in its most basic form, hyperparameter optimization tries to optimize a certain output by changing a set of inputs. 

Let's say we've been working on this model here, and we were tracking our experiments with it anyway. We can see we have some hyperparameters to work with in the **Hyperparameters** tab of the web UI. They are logged by using the `Task.connect` function in our code. These are our inputs. We also have a scaler called `validation/epoch_accuracy`, that we want to get as high as possible. This is our output. We could also select to minimize the `epoch_loss` for example, that is something you can decide yourself.

We can see that no code was used to log the scalar. It's done automatically because we are using TensorBoard.

We are using a training script as our task in our example here, but the optimizer doesn’t actually care what’s in our task, it just wants inputs and outputs. So you can optimize basically anything you want.

The only thing we have to do to start optimizing this model is to write a small Python file detailing what exactly we want our optimizer to do.

When you’re a ClearML Pro user, you can just start the optimizer straight from the UI, but more on that later.

First of all, everything in ClearML is a task. The optimizer itself is one too, so we let the server know that, by using the `task_type` argument.

Next, we choose which task we want to optimize by providing its ID.

Now the optimizer needs its inputs and outputs. For the inputs, we can tell it to choose a parameter either from a discrete list of options, or within certain boundaries. The name of the hyperparameter consists of the section it’s reported to, followed by a slash and then its name.

For the outputs, we tell the optimizer what the scalar is that we want to optimize. You can find the necessary information in your original task, under scalars. The metric title is the title of the plot, the metric series is the trace, and the sign is whether we want to minimize or maximize this scalar.

There are many more parameters that you can tune, but if you want to go deeper, check out our other HPO blogpost on the website and in the description.

That’s it! With just a few lines of code, we can optimize a task. If we take a look now at the experiment list, we can see that both our optimizer task and our different clones are showing up here. Each clone is using the same code as the original task, but with different hyperparameters injected.

And that’s really cool! Instead of inserting the HPO process in our original code, like you would do with most optimization libraries, we’ve now put it on top of it instead. So we can keep our code completely separate from the optimization process. Which, again, means we can optimize anything we want.

We can now follow the progress of our optimization process by looking at the optimizer task under the **Plots** section. Here we can see several interesting things happening.

Every point in this graph is a task, or a single run of your code using a specific hyperparameter configuration. It will give you a quick glimpse into how all tasks are performing.

The next graph is a really cool one, designed to give you some intuition on what parameters ranges are good and which parameters have the most impact on the final outcome. For example here we can clearly see that the adam optimizer is much better for our task than the sgd optimizer.

Then we have the table, which is a sorted list of all tasks with their objective value, parameter combinations and current status.

As we saw earlier, if you’re a ClearML pro user, you can even launch your optimizer straight from the UI, no optimizer script required, and you get a nicer overview dashboard included. This means you can optimize your tasks literally in a minute.

And don’t forget about autoscaling! You can run it for free using code of course, but with ClearML Pro you can set it up in the UI as well. Which means that, starting from scratch, you can have an autoscaling cluster of cloud VMs running hyperparameter optimization on your experiment tasks in just a few minutes. How cool is that? 

In the next video, we’ll take a look at another example of automation goodness: pipelines. In the meantime, why not try and optimize one of your existing models for free at [app.clear.ml](https://app.clear.ml), and don’t forget to join our [Slack channel](https://joinslack.clear.ml), if you need any help.
</Collapsible>
