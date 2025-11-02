---
title: How ClearML is used by an MLOps Engineer
description: An overview of how you can use ClearML as an MLOps Engineer.
keywords: [mlops, components, machine learning, mlops engineer]
---


## Video Tutorial

<div class="vid">
<iframe 
        src="https://www.youtube.com/embed/7aKZGp1YOlo?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Details class="panel info">
<summary class="panel-title">Video Transcript</summary>
Hello again and welcome to ClearML. In this video we'll be going over a workflow of a potential MLOps Engineer. Now an 
MLOps Engineer is a vague term. This might be a specific person in your team that is doing only the Ops part of 
machine learning. So the infrastructure and all of the workers and whatnot. Or it could be you as a data scientist. It 
could be just the data scientist of the team that is most into things like docker and deployments. And that person now 
has the job of a MLOps Engineer. So it really doesn't matter who you are. This video is going to be about what this kind 
of person will be doing and what ClearML can do to make their life a little easier. Just a little. 

So what we're going to do here is take a look or get started at the very least with our Workers and **Queues** tab. So if 
you've followed along with the Getting Started videos, this is actually something you've probably seen before. but I'm 
going to go a little bit more into depth in this video. 

So the **Workers and Queues** tab, what does it do? So we have what we can expect. We have the **Workers** tab, and we have the 
**Queues** tab. Workers in ClearML are actually called agents. So you can see here that we have a bunch of available workers 
which are spun up by using the ClearML Agent. I'll go more in depth in that in a minute. So we have a few available 
workers. We have Beast Zero, One, Two, and Three. I'm the person that called my own computer Beast. So my own computer 
is running a few workers here. And then we also have Apps Agents, and I'll go a little bit more into detail what that 
means later. Essentially, what it means is you have the applications right here and what that's going to do is give you 
a few pre-made applications for automation that you can use straight out of the box. And if you use any of them, in this 
case a GPU scaler, an auto scaler from the cloud, then it will spin up an available worker for you that will just manage 
the orchestration there so that that worker will do nothing else but just tell things where to go and what they should 
do. 

So if we go a little bit more into depth here, we can also see which worker is running which experiment at this moment. 
So we have example: Task 0 1, 2 and 3, programmer terms of course. We see the experiment running time. We see the 
iterations. In this case, it's a classical machine learning model, so we don't really have iterations, but if you have a 
deep learning model, this is where your amount of iterations would come into play. 

If we click on any of these, we can see the worker name, and we can see its utilization over time here as well. All 
right, so we can obviously make this longer. I've only been running this for a few hours or for an hour. So we have the 
worker name right here. We have the update time, so just to know when was the last time that the worker actually 
sent in any new data. We have the current experiment on which we can click through, so I'll do that in a minute, and we 
have the experiment runtime, and experiment iterations here as well. 

We also have the queues, which means that we can actually find out what queues this worker is listening to. I should 
give some more context here. So if we go into the queues, ClearML works with a system of queues as well as workers. So 
this actually comes from the fact that originally people were just giving out SSH keys to everyone to get them to work 
on a remote system. And this is far far far from perfect, right? So you have several people SSHing in, you have several 
people running their own workloads on the same GPUs. They have to share everything. Because of the amount of people that 
are also running their stuff on the GPU, you actually have no idea how long your own task will take, so that's something. 
You can't have any priorities. So if everyone is just running their stuff and actually probably killing your stuff as 
well because it's out of memory, because too many people are using it. So that's just a disaster, right? If you have a 
large GPU machine that you have to share with multiple people, or just want to orchestrate several different tasks 
on, with different priorities, it becomes a real hassle. So that's actually why ClearML has workers and queues to try 
and deal with that a little bit. And this is actually what we're calling orchestration. So if you look at our website, 
you'll see orchestration and automation. Those terms might not mean very much. So this is what I'm going to be talking 
about in this video. 

Orchestration in this case, is like a director in an orchestra. You're essentially saying who should do what when, so 
which worker should run which experiment, or which task at what time and in what priority. So this is what the queues 
are all for. Essentially, queues are just what they're called, right. They're queues, but you can have as many of them 
as you want. So in this case, we have the services queue, we have the default queue, GPU queue, and CPU queue. You can 
create new queues by clicking the button here, so it's very simple. I can make a very simple queue, but this is very 
worthless, right? But you can make however many of them you want. I can delete that queue again. We can see for each 
queue how many workers it has. So I'll show you that in a minute when we spin up a new worker. But we can actually 
pretty easily see how many workers are serving a specific queue. So listening to that queue and that actually has an 
effect on the overall waiting time. So for example, here we have four workers that we saw here before, right? So these 
are these four workers. They're all listening to the CPU queue. They're all running a CPU experiment. But then we still 
have a bunch of other experiments in the queue. So this is just a list of the next, like, essentially the order in which 
the next example tasks will be executed. So we see here that the next experiment is task four. We see that it was last 
updated there, and now we see the queue experiment time rising rapidly. Because people are waiting in queue here, there 
are many more tasks to be executed. We also have CPU queued experiments, which is just the amount of queued experiments 
per queue. 

So we also have a GPU queue and in this case, we see that we have zero workers here. Now we'll go a little 
bit more into depth on that later because we don't actually have zero workers there. We actually have an auto scaler 
listening to this. Then we have the default queue, and we have the services queue and I should stop a little bit on the 
services queue because the services queue is relatively special in ClearML. You have all of your custom queues that you 
can create however you want CPU queue, GPU queue, whatever. The services queue is actually meant to host specific, not 
very heavy workloads, but that does this kind of orchestration that I was talking about. So imagine you have a pipeline 
for example, if you don't know what a pipeline does in ClearML, you can look at the Getting Started video that we made 
on pipelines. And if you want to run a pipeline, you will need a pipeline controller. Essentially, it's a very small 
piece of code that tells ClearML now you should run this step, then take that output, give it to the other step, run the 
other step, give that to the output of the next three steps, take those three steps, run them, and so on, and so forth. 
It's essentially the director. It's orchestration, right? And so that's what the services queue is meant for is it's 
usually meant to put in those orchestration tasks, those long-running, not very heavy tasks. So that allows you to 
essentially assign a bunch of not very powerful CPU machines to that queue just to do the orchestration and then 
everything else, like your GPU machines or your heavy CPU machines, can be assigned to the CPU and GPU queues in which 
we can choose to just enqueue tasks or experiments that do simply that. So that's essentially what a services queue is 
when compared to other user-made queues. 

We can see here that we have a bunch of workers, so we have the Beast 0, 1, 2 and 3 that are assigned to this services 
queue. But as we can see if we go and take a look at the CPU queue, we have a whole bunch of tasks here. So there are a 
lot of people waiting for their turn. So actually one thing that we can do is we can already change the priority. So 
imagine we have example Person 19 that has a very, very tight deadline, and they actually need to be first. So we can 
just drag them all the way up, let me scroll there, all the way up and now. There we go, all the way up top. So now we 
can see that example 18, for example task 18 is the first in the queue. So once any of the four workers finish off their 
example 0, 1, 2 or 3, the next one will be example 18. So in this case, you can actually very easily change the priority 
and make sure that the people that have their deadline meet their deadline. So that this could be a common question in 
the day of the life of an MLOps engineer is, please give me priority. Please let my stuff work first. So that's something 
you can do. 

Another thing you can do, which is relatively simple to do, is aborting a task. So a task is essentially just a Python 
script that was cloned or that was already in the system or that was put into the system that can be recreated on a 
different machine. So what we could do is, we could go into the queues here and then say clear, which will clear the 
complete queue. So that's something we don't necessarily want in this case. But in this case, we, for example, want to 
abort task 0. So one way of doing that would be to go to the current experiment, right here. And if I click on that, 
ClearML will actually bring me to the original experiment view, the experiment manager, remember everything is 
integrated here. The experiment manager of that example task. So what I can do here if I look at the console, I have a 
bunch of output here. I can actually abort it as well. And if I abort it, what will happen is this task will stop 
executing. Essentially, it will send a `ctrl c`, so a quit command or a terminate command, to the original task on the
remote machine. So the remote machine will say okay, I'm done here. I will just quit it right here. If, for example, 
your model is not performing very well, or you see like oh, something is definitely wrong here, you can always just 
abort it. And the cool thing is if we go back to the **Workers and Queues**, we'll see that the `Beast 0` has given up working 
on task 0 and has now picked task 18 instead. Which is the task that we put there in terms of priority. So this has the 
next priority. Work has already started on task 18. So this is really, really cool. 

But we can see that in the CPU queue, the amount of tasks is still very, very high. Even though we just aborted one, 
people are waiting. The waiting time is rising. The amount of tasks is very, very high. So what we should do now is 
actually start up a new worker. This could be something that is very much in daily life over an MLOps engineer. It's 
just to add workers to your worker pool. I'll put it on workers so that we can see very clearly when we added it here. 
Go out of full screen, and we're going into a remote machine here. So you could remote in almost any machine, right? 
It doesn't really matter which type of machine it is, if it's a cloud VM, if it's on-premise, if it's your own laptop, 
it could be any remote machine that you want. It's very easy to turn those into a ClearML agent or a worker for the 
ClearML ecosystem. 
The first thing you'll have to do though, is `pip install clearml-agent`. So this will install the 
very thing that is necessary to turn it into a worker and that's actually everything you need. That's all the packages 
you need. It is a Python package, but usually you have Pip3 available. So then the next thing you should do is 
`clearml-init`. Now `clearml-init` will connect this machine to your server, to the actual orchestration server, this 
one that will handle all the workers and queues. So in this case it's [app.clear.ml](https://app.clear.ml) which is the 
hosted version. You can also host your own open source server if you so require. If I run `clearml-init`, you'll see 
that I have already done this of course, but in this case you should be able to just add your credentials from the 
server, and it should connect no problem. If you want more information on that, we have tutorial videos on that as well. 
And then the next thing we should do is `clearml-agent daemon --queue` Now we can decide which queues we want this 
ClearML agent to listen to. So in this case, if we go and take a look at queues, we have a CPU queue, which is by far the 
most requested queue. So in this case, imagine we have an extra machine on hand in the faculty or in the company you're 
working with, and you should just add this machine or its resources to the pool. So in this case we're just going to say 
`CPU Queue` and that's everything. So we just want a simple extra machine for the CPU queue. Then we're going to 
add `--docker` because personally I quite like the fact that the machine would be using docker. So essentially what will 
happen here is that the ClearML agent will pull a new task from the queue, and then we'll spin up a new container 
depending on either the default image that I give here or the image that is attached to the task itself. So people, the 
data scientists that are creating their remote tasks or their experiments, they can also assign a docker file or a 
docker image to that, that it should be running. So if you have very specific package requirements or very specific 
needs, you can, as a data scientist, already say I want to attach this docker image to it, and it will be run like such 
on the ClearML agent. So that gives you a lot of power. But in this case I will just say if the data scientists 
gave no indication of what docker container to use, just use Python 3.7. This is the standard in our company, let's say, 
and this is what we want to use. Okay, so if I run this, it should start up a new ClearML agent. So in this case you can 
see it's running in docker mode, it's using default image Python 3.7, and it's listening to the CPU queue. Now if we go 
back to our **Workers and Queues** tab. We can see that here `any-remote-machine:0`. So we can actually see that we now 
immediately have a new remote worker, and it's actually already started on the next task. So now we're currently running 
five workers on the CPU queue instead of four. So this was very, very easy to handle, very, very easy to set up. So this 
is one part of what an MLOps engineer could be doing. 

Now this is very, very manual to set up and the MLOps engineer is king of the automation after all. So we want some kind 
of way to automate all of this, right? So what we can do here is go to applications. And what we have is AWS 
Autoscaler and GCP Autoscaler in essence. Also, Azure will come later so that will be out soon. So if we go into the 
AWS Autoscaler. What we see here is we have an MLOps GPU scaler and what that means is, we don't always have fixed 
demand for GPU resources, right? So imagine you have a company in this case that has a lot of demand for CPU compute 
in this case, five workers and a lot of tasks. We only have GPU requests only every so often. And it's not very 
economical to buy a few very, very powerful GPUs just for a few minutes every week, for example, or a few hours every 
week. So what is much more economical there is to use the cloud instead, in which you pay for the hours that you use a 
GPU and you don't pay for the hours you don't use it anymore. Of course, what you could be doing is if a data scientist 
needs a GPU machine, you could go to the cloud console, spin up a new VM, SSH into it, and then create a ClearML agent 
for it, to be able to access it from the queue. But that could also be done automatically. And that's essentially what 
an Autoscaler is doing for you. So the Autoscaler will detect if there is a task in the queue, and then will spin up a 
new machine on the cloud, run the ClearML agent there, reconnect it to your own server, and then run that specific task. 
And then if that task is done and the agent and the machine are up for like a minute without doing anything, you can 
choose that minute by the way, if it's up for a while, and it's not doing anything, it will just shut itself down again. 
And that actually makes it very, very economical. Because if you've ever forgotten to close down or to shut off a 
machine, especially a GPU machine on the cloud over the weekend, it's super expensive. So you can actually pay ClearML 
Pro for a year for just the same amount of money as forgetting to shut down a large GPU machine for a single day. So 
just to give an idea of how economical this can be. 

If we go and take a look at our configuration here, we can see that we have our AWS credentials and GCP will be 
obviously GCP credentials. We have our Git configuration and this is what the MLOps engineer will be doing. They will be 
configuring this kind of thing. They will be configuring the max idle time, which says how long should the machine be 
doing nothing before we shut it down again. It could be beneficial to keep it up for a little while because if then 
another task comes in like two minutes later, it's immediately launched. You don't have to wait for the machine to boot 
up. You can add prefixes, you can add polling intervals, you can add a base docker image that you can use, but obviously 
you can overwrite that again. And then there are obviously the computer resources. You can have GPU machines of a 
specific type, this obviously depends on which cloud provider that you're using, but it's all basically the same thing. 
You can run it in CPU mode, use Spot instances to have some savings there, availability zones, etc. So this is the kind 
of thing that an MLOps engineer would probably spend a lot of their time tuning and fine-tuning and getting up and 
working. 

Another way next to running your ClearML agent just manually and spinning up an autoscaler to get some extra agents is 
to run them on Kubernetes. So if I go to the ClearML GitHub and go to the ClearML Agent repository, you have two 
different versions of integration of the ClearML agent in Kubernetes. And the really cool thing is, Kubernetes can 
scale. So you can actually use the scaling of Kubernetes to handle the load of your different tasks that are being 
pulled by the ClearML agent. Now, one way of doing this is spinning up a ClearML agent as a long-lasting service pod 
that has access to the docker socket, so it can actually spin up new docker containers as it sees fit. Or you can use 
Kubernetes glue, which is some code that we wrote that allows you to actually map ClearML jobs directly to Kubernetes 
jobs. So that's actually also a really neat way of doing this. Now we would go a little bit too far if we go straight 
into Kubernetes in this video, but if you're interested, let me know in the comments, and we'll make a video about it. 

Now that we have all our agents, let's take a look at the code, and I'll give you some examples on how you can enqueue 
some tasks into these queues and get these workers that we've just spun up working their hardest. So if we go and 
take a look here, what we see is a simple Python file that does some training. This is CPU based training. It's 
essentially using LightGBM to train a model. So this is the kind of thing that a data scientist would give to you that 
you would have made yourself, and now you want to get it into the queue. Now one way of doing that is what we saw before 
you could do a `Task.init` which essentially tracks the run of your code as an experiment in the experiment manager, and 
then you could go and clone the experiment and then enqueue it. This is something that we saw in the Getting Started videos before. 

Now, another way of doing this is to actually use what you can see here, which is `Task.execute_remotely()`. What this line 
specifically will do, is when you run the file right here. Let me just do that real quick. So if we do 
`python setup/example_task_CPU.py` what will happen is ClearML will do the `Task.init` like it would always do, but then 
it would encounter the `Task.execute_remotely()` and what that will tell ClearML is say okay, take all of this code, take 
all of the packages that are installed, take all of the things that you would normally take as part of the experiment 
manager, but stop executing right here and then send the rest, send everything through to a ClearML agent or to the queue 
so that a ClearML agent can start working on it. So one way of doing this is to add a `Task.execute_remotely()` just all
the way at the top and then once you run it, you will see here `clearml WARNING - Terminating local execution process`, 
and so if we're seeing here if we're going to take a look we can see that Model Training currently running, and if we go 
and take a look, at our queues here, we have `any-remote-machine` running Model Training right here. And if we go and 
click on this, we go back to our actual training task, and we just can easily follow along with what is happening here. 

So okay let's take a look at how you can do this differently as well. So there is a specific different kind of way of 
doing this. And let me take the example task GPU here. So this is a lot larger in terms of what it does. But essentially 
it just trains a model. So you have trained tests and main. And what you can see here is, we have the `Task.init` in main. 
It's just a global scope so that's all fine. Then we parse a bunch of arguments and then something very interesting 
happens. So we create our train loader and our test loader right here. But then what we can also do is say okay for epoch 
in all our epochs, so for in the epoch range, what we can say is if the epoch is larger than one, it doesn't execute
remotely in the GPU queue, and so what this will do is it will train the model for one epoch locally. Which means that 
you can test that it works and if you get a single epoch it usually means it's working. And then if we get to that point 
and start epoch number two, we actually just run it remotely and then ClearML will take this whole bunch and start 
working on it remotely instead. Which means that you can very easily locally debug and see if everything works and once 
everything does work, it will just immediately send it to a remote machine that will do the actual heavy lifting instead 
of you having to do it on your laptop or computer. So if we actually run this, it will be GPU right here. Then it's very 
interesting to see this happen. I really like this workflow because you have this local debugging first. So as you can 
see here, let's wait a little bit, so as you can see it's completed it's training. And we can also see that it's only 
been for one epoch so in this case it only went for one epoch and then once it reached that point as we saw in the code 
it will say `clearml WARNING - Terminating local execution process`, so in this case it's already sent it to the remote 
machine. Now if we're going to take a look at the remote machine, we can see that we have our Model Training GPU in 
`pending` state and remember we had no workers at all in our GPU queue. We have zero workers and the next experiment is 
our Model Training GPU. But remember again that we also have the autoscaler. So if I go to Applications and go to 
autoscaler, you'll see here that we indeed have one task in the GPU queue. And we also see that the `GPU_machines` 
Running Instances is one as well. So we can follow along with the logs here. And it actually detected that there is a 
task in a GPU queue, and it's now spinning up a new machine, a new GPU machine to be running that specific task, and then 
it will shut that back down again when it's done. So this is just one example of how you can use `Task.execute_remotely()` 
to very efficiently get your tasks into the queue. Actually, it could also be the first time. So if you don't want to 
use the experiment manager for example, you don't actually have to use a task that is already in the system, you can 
just say it does not execute remotely, and it will just put it into the system for you and immediately launch it remotely. 
You don't ever have to run anything locally if you don't want to. 

So this is essentially what we're talking about when 
I'm talking about orchestration. So the autoscaler, the workers, the queues, the ClearML agent, everything here is 
what we call orchestration. It's essentially saying you should run this then there and everything is managed for you. 
That's the idea here. 

But there's also something else that we usually talk about quite a lot. And that is Automations. 
And Automations is specifically trying to automate a lot of manual stuff that you probably would be doing, but without 
actually noticing that it could be automated. So let me tell you what I mean with that. 

Let's go into automation here 
and get for example, the task Scheduler. And the task Scheduler, it's very, very intuitive to know what it does right? 
So a task scheduler will essentially take a specific task, and it will schedule it to run every X amount of time. So in 
this case, for example, the MLOps engineer gets called in by Project Team NASA. So Project Team NASA, which is really cool, 
they're actually creating a model here that is meant to detect if asteroids are going to be hazardous for earth or not. 
So they come in, they have a specific project of their own. So if I go into Project Team NASA here, you see that they 
have a bunch of tasks here. For example, getting the data, they will pour that into a real asteroid dataset that will 
preprocess the data and actually put that preprocessed data in another dataset version which is preprocessed asteroid 
dataset. And then you have a bunch of model training that they do on top of it in which they have scalars with test and 
train. You all know the drill. This is the kind of thing they're doing. So they actually have their feature importances, 
which is really cool. 

So they call you in as an MLOps engineer, or you are part of the team, and you're the MLOps engineer, the designated 
developers engineer and you essentially, what you want to do is, if we go to get data here, and we go into configuration, 
you see that there is a query date and if we go into the code of this query date. What we'll see here, this is the 
original repository of the NASA Team. We'll see that they actually query a database with a specific query and the 
specific query is select everything from asteroids which is their data, where the date is smaller than the data given. 
So they have an actual end date and everything before that given date is the data they want to work with. So if we're 
going to take a look, the query date here is a specific date, but that's not today. So essentially what they 
want to do is rerun this, get data every single day or week or month depending on how quickly they can get their data 
labeled. 

So this could be done manually relatively easily. You could just do every week, click, go here, and it will just put a 
new entry in the experiment list, or you could of course automate it. And that's essentially what we're going to do with 
the task scheduler. So you just get the task scheduler object from the automation module. You say the amount of sync 
frequency. So this is essentially just when you change something in the configuration of the task scheduler, it will 
poll every minute to get that. So this can be very low or very high depending on what you want. I want the scheduler 
itself, which again, everything in ClearML is a task. So I want the scheduler itself a scheduled task, to be in the 
Project MLOps because this is the actual scheduler. I want to be taking care of that and then the actual task will be in 
the original NASA project. Also, I want to call it NASA Scheduler because it just sounds cool. Then what we could do is 
get a task from the Project Team NASA project folder, and then the `get data` task. But there is something else that we 
can do. You could easily just clone a task. This is essentially what the task scheduler is doing. If you watch the 
Getting Started videos, you know that we can actually clone any of the experiments that are in the system and then 
change the parameters and rerun it. So we could get the data or clone the `get data` and then do a task parameter 
override of the query date with the current date today. That's very valid, but the NASA team actually made something 
really cool. 

If we go to pipelines here, you see that there is a NASA pipeline as well and the NASA pipeline is actually 
the exact steps that we saw before, but they train three different models with three different parameters and then pick 
the best model from there. And what we see is that the query date is actually a parameter of the pipeline as well. And 
if you remember correctly, pipelines are also tasks in ClearML, everything is a task, so that means that you can use 
this the task scheduler also to schedule a complete pipeline run. And then overwrite the parameters of the pipeline run 
just as easily as you could do with any other task. So if I go into the full details of this task here, you will see 
that this is actually the pipeline itself. The pipeline has just as any other task, these different tabs with info, 
consoles, scalars, etc. and it has an ID as well. And this ID, if we copy it, we can actually use that instead. So let 
me paste it, it's already there. 

So the task to schedule is in fact the pipeline that we want to schedule. And then if I 
do `scheduler.add_task`, I take the ID of the task to schedule, which is the pipeline in this case, I want to enqueue it 
in the CPU queue. I want it to be at the hour 08:30 every Friday. So every week at 08:30, this will be run. So the 
pipeline will be cloned and run using this parameter override. And the parameter override says essentially, take the 
query date, but set it to the date of the day instead of whatever was before and then started remotely. So if I run 
this, we have automation and then task scheduler. So if I run this, it will create a new scheduler task in the Project 
MLOps folder, and then it will start. Because I said here, execute immediately, it will immediately clone and recreate a 
pipeline already, right now. And then we'll start doing this every other week on Friday 08:30. So if we're looking at 
our projects here, we see that we have Project MLOps. We have the NASA scheduler, and the NASA scheduler is of course 
`pending` because it itself is a task that needs to be grabbed by one of the agents. And so in this case, we can 
probably see that our agents are still busy on the different tasks. So let's just abort one so that we can easily take 
over what we should do. Let's abort all of the example tasks just so we can get going here. Oh, actually, you can do 
that with multiple at the same time. So you have abort here. If you selected two, that will all work quite well. 

So we have our CPU queue here, we have our GPU queue here. There are all our workers. And now we see that the NASA 
scheduler is actually scheduled on Beast 1, so it's currently running. If we go to Project MLOps, we see that our 
scheduler is in fact running. And then if we go to our console, we can follow along with its setup. And then if we go 
into our pipelines, we should be able to see that a new pipeline is being started up by the scheduler. Now there we go. 
It says here: Launching Jobs, Schedule Job, Base Task ID, Base Function, Blah blah blah. Essentially, it's saying I've 
launched the pipeline. So if we go into the NASA pipeline, we should see that in fact, there is now NASA Pipeline 2 that 
is currently running that is using the exact date of today instead of the previous version, which is using the date of 
before. So this is a very easy way of automating or scheduling essentially, just tasks, pipelines, datasets, whatever 
you want in the ClearML ecosystem, you can schedule it. 

Then there is a second type of automation that we can do. So we have the trigger scheduler as well. And the trigger 
scheduler is something relatively similar to a task scheduler. Only the difference is that instead of with a task 
scheduler, you create a task, or you clone a task and run it and then queue it based on a specific schedule. With a 
trigger is based on a trigger. So a trigger could be any event in the ClearML ecosystem. In this case, it could be a 
successful dataset, a tagging of a dataset, or any other kind of event that the ClearML ecosystem can produce, you can 
use as a base to launch a new kind of task. 

So if we're going to take a look here, we actually want to create a trigger scheduler for something called Alice Bob. 
And I'm going to explain what that means. So if we're going into our Alice project here, Alice is a data scientist on 
our team, and she essentially asked me to help her. So she has a bunch of model training tasks here. She actually uses 
the stable tag as well. We'll come back to that later. And essentially what she's doing is just training a model based 
on the dataset of another data scientist in another project. So if we're going to take a look at that other project, 
it's called Bob. So Bob is the other data scientist which is in charge of producing the dataset that is required. 
So essentially, he uses the production tag to tell Alice this is the kind of dataset that you want. This is the dataset 
that you want to use. This is the best so far. He has more recent datasets, but hasn't tagged them as production yet 
because he says they're not ready. So he can just keep continuing to experiment, and do all the kinds of things that he 
wants while Alice is still firmly using production. So what Alice is doing is she's essentially querying on the dataset 
of production. But it's annoying because they're in a different time zone, for example. And when Bob publishes a new 
dataset, Alice has to be notified by using a chat application or whatever. And then Alice has to re-run everything 
remotely so that her training is using the latest version. So this is not ideal, we can automate all of this. And this 
is essentially what the task trigger is trying to do. 

So again, we make a scheduler just like we did with task scheduler. Polling frequency in minutes is again to poll the 
configuration as well as sync frequency minutes. We put again the scheduler itself. We put it in the Project MLOps. 
We call it Alice-Bob Trigger instead of the scheduler before. And then we get the task that we want to actually trigger. 
So not the task that triggers, but the task that we want to create when the trigger is triggered, if that makes sense. So 
the actual task that we want to make is, we want Project Alice, so we want the training job for from Alice. Actually, 
so we use the project name, Project Alice and or Project Alice I think. Let me just check real quick. Project Alice Not 
Project Alice. There was a little mistake there. So we have task name Model Training. So we want any of the Model 
Training and Alice actually uses a stable tag. Like I said before, she uses a stable tag to say, this is actually my 
latest good version of an experiment. So if there is a new dataset I want to retrain a clone and enqueue and retrain 
this specific version of my experiment. This also allows Alice to experiment and continue experimenting without the 
dread of having a new dataset come in and then be it being retrained on code that is not stable yet. So we can use the 
tag for that purpose. But if I go back to the task trigger, essentially what we're going to get here is a task from the 
project Project Alice with the name Model Training but also crucially with the tag stable. And then if there's multiple 
tasks that fit this description, it will just take the latest one. So it will take the latest task that has a tag stable 
from this project. 

Now we have to add a trigger. And you can add a dataset trigger, you can add a task trigger, you can add any kind of 
trigger that you wish. In this case it will be a dataset trigger. If we have a different dataset, a new kind of dataset 
that fits this description, we want to trigger this task. So essentially the scheduled task ID is the task that we want 
to run if the trigger is triggered, which is in this case `training_task.id` is the Project Alice task, the Model Training 
task. We have the schedule queue, so we want to obviously schedule it in any of the queues. We can use the CPU queue in 
this case, and then we can give it a name as well. And just to make it clear that this training is not actually training 
from Alice herself, but it's training on the new data of Bob. It's an automated training. We can give it a specific name 
so that Alice knows this was triggered automatically, and then we can use `trigger_on_tags` where we should look to 
actually trigger the trigger. Damn this is a lot of trigger. 

So what happens here is we look in the Project Bob folder and then if a new tag production is found that wasn't there 
before we trigger, and in this case, this means we create a new task project Alice. So if we're going to run this 
automation, not task scheduler but task trigger, this will again create a new specific let's call it orchestration task 
or automation task. And these are the kind of tasks that you want in the services queue. These are the tasks that 
essentially just keep track of, is there a new data set version or not and it's very light to do so. This is typically 
something you want in the services queue. 

So we have terminating local process, so it should now be in Project MLOps right here. So we see that our NASA scheduler 
is running, but the Alice-Bob Trigger is still pending because obviously we have our pipeline running and our workers 
need to first work on that, and then they can go on. So if we take a look at the queues, we're actually now using the 
tools that we need. So we see that in the services queue the Alice-Bob Trigger was the next experiment, and it's just 
been picked up. So we should see here that indeed, one of the beasts workers here has picked up Alice-Bob Trigger which 
is essentially what the queues are meant for. We're pushing too much into the system, so they're just waiting a little bit 
before the next thing has finished. If we take a look at our NASA pipeline, we see that it's actually going very well here. 
So these are the kind of tasks that our workers were busy with before they picked up the Alice-Bob Trigger.

So now we see that the Alice-Bob Trigger is in fact running. We can take a look at the console, and it can tell you that 
okay, everything is installed. It gives you a few error messages, which is usually a good thing because it says that 
it's actually doing something. It's sleeping until the next poll in one minute. So it's polling every minute. So now we 
should be able to go into Bob's project. And if we say okay, I want to add a tag here, production. And in this case, 
what I just did is I created a new dataset version with this specific tag. I said okay, this example dataset. I've 
tested it. I've checked it. I'm Bob in this case. So I've tested it. I've checked it. Everything seems to be in order. 
So I'm going to tag this as production and this should technically trigger the task trigger or the trigger task to pick 
that up and to then spin up a new Model Training run for Alice. And Alice will then pull the latest version that fits 
the production tag. So essentially she will pull this one and then end up with a new version or like with the new task 
that is running. So if we're going to take a look, it's sleeping for a while. Technically it won't be in Alice yet. So 
we should wait just a little bit before the Alice-Bob Trigger picks it up. But it shouldn't take very long. 

So as we can see the scheduling job, Alice-Bob, new training data or new data, training has been scheduled on the CPU 
queue, so it has essentially figured out that Okay, we actually do have a new tag now, so it is being scheduled. If 
we're going to take a look at Project Alice now, you can see that in fact, Model Training is running currently, so it's
been enqueued, it's running, and it's been tagged as Alice-Bob New Data Training. So Alice actually knows that this time 
this model is automated. 

Finally, there are some things that I want to show you that might make your life easier. Yet again, that is the name of 
the game in this video, but they're just a little bit smaller. So one of the things that I want to show you is the 
monitor. It's the ClearML monitor. It's essentially an object that you can implement that you can override, and it 
allows you to take a look into the depths of the ClearML ecosystem, what happens there? So it can give you an idea of 
when tasks failed, when tasks succeeded, all of the types of events that ClearML can generate for you. So one of the 
things you can do with it, and this is part of the example, it's also in the example repository, is create a Slack bot 
for it. So essentially we've just used a bunch of Slack APIs around this monitor, which is just a Slack monitor that we 
created ourselves and that will essentially just give you a message whenever a task succeeds, fails, whatever you want 
to do. So in this case, it's fully equipped. We added a lot of arguments there so that you can just use it as a 
command line tool, but you can create your own script based on your own requirements. Now what it will do is, let me 
show you, is in this case, I'll make it a little bit bigger. You can see that there is a ClearML Alert Bot that you can 
just add to your Slack if you want it, and it will essentially just tell you what kind of projects, what kind of tasks 
are succeeded or failed. You can set, I want only alerts from this project, I want only alerts that are failed, only 
alerts that are completed, will give you a bunch of output as well, which is really, really useful to see, etc. So this 
is just a very small extra thing that you can take a look at to have some monitoring as well so that you don't even have
to wait or take a look yourself when your tasks are finished. 

Another thing that I want to show you is a cool way to just get a little bit more of that juicy GPU power. One way you 
can add agents next to Kubernetes spinning up themselves, spinning up a ClearML agent on your own machines or the auto 
scaler is Colab. So the runtime was just connected here, but Colab is something we all know, we all love. It's an easy way 
to get notebooks on a GPU machine very easily, but it's also very easy to get a ClearML agent running on this. So this 
is really, really cool. I personally really like it. So I can say `!clearml-agent daemon --queue "GPU Queue"` and if I 
run this, essentially we get a free GPU worker. So it is currently doing the ClearML agent thing. This is the output of 
the ClearML agent and if we go into our project here. We can now see we have a GPU all worker that is essentially just 
Google Colab. So you can spin up a bunch of Google Colabs, run all of your agents on here. And the only downside is that 
you can't use the docker mode. So this will mean that every single task that is being run by this Colab instance is 
actually going to be run in the environment of the Colab instance. So if the Colab instance has a different Python 
version than you, it's a bit annoying, you can't spin up a different container. But that's really only the only 
downside. So this is just a quick way. The actual notebook you can find on our GitHub. But this is just a really cool 
way to get some extra GPU power as well. 

Now, all of these agents are one thing. You have the queues now, finally. Now, thank you for making it through this far. 
We haven't actually even covered everything that ClearML can automate for you. There is HPO, which is hyperparameter 
optimization. There are pipelines as well that can chain everything together. You saw a little bit when I showed you the 
NASA project, but yeah, we're not there yet. There's also even a ClearML Session that you can use to run on a specific 
machine, on a remote machine, and it will give you a remote interactive Jupyter Notebook instance or even a VS code 
instance so that you can always code already on the remote machine. So that's also really, really cool. It's something 
we're going to cover soon, but I think the video is already long enough. So thank you very, very much for watching. 
Thank you very, very much for your attention. Let me know in the comments: if you want to see videos of these 
hyperparameters, and pipelines, and sessions, and don't forget to join our [Slack channel](https://joinslack.clear.ml) if you need any help.
</Details>
