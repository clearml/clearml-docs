---
title: The ClearML Autoscaler
description: Learn more about the ClearML Autoscaler.
keywords: [mlops, components, Autoscaler]
---


## Video Tutorial

<div class="vid">
<iframe 
        src="https://www.youtube.com/embed/j4XVMAaUt3E?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Details class="panel info">
<summary class="panel-title">Video Transcript</summary>
Hello and welcome to ClearML. In this video we'll go a little more advanced and introduce autoscalers, the easiest way to build your very own flock of ClearML Agents.

Data science is inherently very inconsistent in its demand for compute resources. One moment you're just researching papers and need no compute at all, another moment you're making 16 GPUs scream and wishing you had more. Especially when running Hyperparameter Optimization or Pipelines, it can be very handy to have some extra hardware for a short time.

Remote machines are easy to get from any cloud provider, and you only pay for the time you use them… as long as you don't forget to shut them down after you're done. Seriously, I'm pretty sure at least 30% of GPU usage is people forgetting to shut down their remote machines. 

Anyway, that's what an autoscaler takes care of for you: spinning up as many machines as you need, when you need them and automatically shutting them down again when you don't.

Once the autoscaler is deployed, you can just add experiments to a queue as we saw in the previous videos. Once there are experiments detected in the queue, the autoscaler will automatically spin up new remote machines and turn them into ClearML agents that will run them for you. No fiddling with remote SSH, and no docker containers, and no need to worry about shutting down--the Autoscaler does it for you. 

You can also get fancy with queues. Create as many of them as you want, and you can specify which type of remote machine should serve which queues. So imagine you have a CPU queue and a GPU queue, all you have to do is put your experiment in the right queue, and you know exactly what type of machine will be running it.

Obviously, you also configure a maximum budget by limiting the number of machines that can be spun up at one time, so you don't incur unexpected expenses.

Now that the theory is taken care of, let's take a look at how to set up an autoscaler on ClearML.

To launch the autoscaler, go to [app.clear.ml](https://app.clear.ml) and open the Applications page. There you'll find the autoscalers for each of the large cloud providers. To launch the autoscaler this way requires ClearML Pro, but it's cheap enough that forgetting to shut down a remote GPU machine for 3 days costs more than a year of ClearML Pro, so…

We'll go into the AWS wizard in this video, but the other autoscalers have a very similar setup. First are the credentials for your cloud provider of choice, make sure you assign the correct access rights because the autoscaler will use these credentials to launch the machines and shut them down again when they are idle.

Naturally, you want the agent to be able to run your original code, so we need to supply our git credentials as well. This works by using a git application token as password, you can find how to generate such a token in the description below.

If you're running from a notebook, don’t worry! Even notebooks that were tracked using the experiment manager can be reproduced on the remote machine!

The last big, important setting is of course which kind of machines we want to spin up.

The exact details will depend heavily on which cloud platform you end up using, but in general you’ll mainly need to provide what kind of machine type you want to run (so, the amount of CPU cores, RAM and GPUs). Each cloud provider has different options and naming schemes, but there will always be a handy tooltip here that will guide you to the relevant documentation.

Once you have decided the details of your machine, you can also enter which queues you want these kinds of machines to listen to here, like we discussed in the first part of the video. You also have to specify the maximum number of these kinds of machines that are allowed to run at the same time, so you can keep your budget under control.

You can add as many of these machine types as you wish. Finally, there are some more advanced configuration settings that you can read more about in the documentation linked below.

After filling in all these settings, let’s launch the autoscaler now, so we can see how it actually works.

We immediately start in the autoscaler dashboard, and we can see the amount of machines that are running, the amount that are doing nothing, how many machines we have available per queue and all the autoscaler logs. Right now we have no machines running at all because our queues are empty.

So if we go to one of our projects, clone these tasks here, and then enqueue them in the CPU queue and clone this task here as well. We can edit the parameters like we saw before and even change which container it should be run in. We then enqueue it in the GPU queue, and we should now see the autoscaler kicking into action.

The autoscaler has detected the tasks in the queue and has started booting up remote machines to process them. We can follow along with the process in our autoscaler dashboard.

Once the machines are spinned up, the ClearML agents will register as available workers in the **Workers and Queues** tab. From here, they behave just like any other agent we’ve seen before.

Finally, when everything is done and the remote machines are idle, they will be shut down automatically and the workers list will be empty again.

You can see that this functionality is very powerful when combined with for example hyperparameter optimization or pipelines that launch a lot of tasks at once. Obviously, it can be used as the primary way to get access to remote compute, but it can even be used as an extra layer on top of the machines you already have on-premise to spillover in case of large demand spikes for example. You don’t pay when you don’t use it, so there isn’t really a good reason not to have one running at all times.

Get started right now for free at [app.clear.ml](https://app.clear.ml) and start spinning up remote machines with ClearML Pro if you want to save some money and effort by automating the boring stuff. If you run into any issues along the way, join our [Slack channel](https://joinslack.clear.ml), and we’ll help you out.
</Details>
