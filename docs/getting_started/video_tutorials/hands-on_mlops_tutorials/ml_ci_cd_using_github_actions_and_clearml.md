---
title: Machine Learning CI/CD using GitHub Actions and ClearML
description: Multiple examples on how to use GitHub Actions CI/CD and ClearML.
keywords: [mlops, components, GitHub Actions, CI/CD]
---


## Video Tutorial

<div class="vid">
<iframe 
        src="https://www.youtube.com/embed/k5e-E5oEFUw?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Details class="panel info">
<summary class="panel-title">Video Transcript</summary>
Hello, welcome back to ClearML my name is Victor and in this video I'll be going through some CI/CD tips and tricks you 
can do with ClearML. For this video, I'm going to assume that you already know about ClearML and CI/CD.
In general, the CI/CD stuff will be relatively easy to understand but if this is your first time working with ClearML, 
you better check out our Getting Started series first.

Now there's three specific CI/CD jobs that I want to talk about in this video that you can accomplish with ClearML.

The first job is about visibility. Imagine I have an experiment that I am tracking in Git somewhere. I open a new PR to 
add a new feature, and now I want to make sure that ClearML has at least one task in its database that has been 
successfully run using this PR code. To make this very visible, I want to automatically add the model metrics from that 
task as a comment on the open PR.

The second job is similar to the first in the sense that I still want to take the task that corresponds to the open PR's 
code, but in this case I want to make sure that the model residing in this task is equal or better than the previous 
best model in ClearML. I can easily keep track of that with tags in the ClearML UI, and in this way I can always 
guarantee that my main branch contains the best model. 

Finally, for the last job, usually I use my local computer and environment to quickly iterate and develop my code, and 
then, only later, I'll send it to a ClearML Agent to be executed remotely and properly trained on some GPUs for example. 
Now to make sure that always works, I want to add a check to my PR that basically checks out this PR code runs it on a 
ClearML Agent, and then listens to it and the moment, that the ClearML Agents starts spitting out iterations, it means 
that the whole setup process was successful, and in this way, I can make sure that every single commit in my main branch 
is remotely runnable right. 

So those were the three jobs that I want to talk about in this video. Let's get started.

So as you can see, I have here my example project with me and there's a few things immediately apparent. So one is we 
have the `.github` folder with workflows. We're using GitHub actions in this specific video. Again, you don't have to use 
GitHub actions if you don't want to. It's just an example for General CI/CD stuff. Then we have a few scripts here, 
and we have our task as well. 

Now, I'll start with the task because that's the thing we're going to run as the experiment you want to keep track of 
in your Git, and in ClearML, and in this case, we'll just take a dummy task. We'll take a very, very simple example 
here, so we just do `from clearml import Task`. If you're familiar with ClearML this will be very familiar to you as
well. It's just the `Task.init`, give it a project, give it a name, and then I basically always set `reuse_last_task_id` 
to `false`, which basically means that it will never override the previous task if it didn't complete properly. It's more
or less a thing of taste. Then I set the random seed to do something completely random. Then for 10 times basically we're 
going to be reporting a scalar, which is called performance metric in series "Series 1" and it will have a random value, 
so in this case it's super, super simple, it's just a dummy task. This report scalar should be your output metric that 
you're trying to check could be F1 score, could be MAP, whatever takes your fancy. 

If I then go to ClearML itself, you'll see the dummy task right here, so we actually take care of the repository here, we 
also have the commit ID, which will come in handy later, and then we also have the script path, and the working 
directory. As you might know, we also keep track of any uncommitted changes, so if you add anything in the code that 
isn't already tracked by Git, we also take care of that. But that will come in handy a little bit later as well. We also 
keep track of installed packages and stuff like that. In this case, of course, we don't really keep track of very much, 
it's only the `Task.init` and then just reporting some scalars. 

What we do have is some scalars, so this is what it would look like, and we'll be using this one later down the line. 
Right, so if I go back here to my code you can also see we have a GitHub folder with the workflow subfolder in there. 
This basically tells GitHub that whatever you do--a push or commit or whatever--it will check this `yaml` file to see 
if it has to do any kind of checks. In this case, we'll call it ClearML checks, and we'll set it on to pull requests. 
Now, most of the time that you're using ClearML, it's going to be interesting to do checks on a pull request because it 
can take some time. It's machine learning after all, but it highly depends on what you want to do, of course. Now, 
I'll be setting it to pull requests specifically to branch `main`. So if I want to do a pull request to my `main` 
branch, I will want those checks being fired, and then I want them to be added to several different actions there, 
specifically the edited and opened are the ones that I'm interested in. So, every time I open a PR, but also every 
time I update a PR, like send a new commit to it, it will trigger, and then what do we actually want to trigger. So this is 
the meat of the story; this is the jobs. 

In this video, we're going to run three specific jobs. One is `task-stats-to-comment`, the other one is `compare-models`, 
and the third one is `test-remote-runnable`. 

Now, the first one task starts to come to comment basically wants to take a task that corresponds to the code you're 
trying to merge, and then add a comment on the PR with the different performance metrics from ClearML, so that it's 
kind of neat; you can easily see what the task is doing, how good it is, stuff like that. So that's what we're going 
to do first. 

Now, how is this built up? I'll run down this and I will go into the code later in a second, but then to start with we 
have the environment variables. Now, to be sure that the GitHub action worker or the gitlab runner or whatever you're 
going to run these actions on has access to ClearML, you have to give it the ClearML credentials. You can do that with 
the environment variable `CLEARML_API_ACCESS_KEY` and `CLEARML_API_SECRET_KEY`, these are the keys you get when you 
create new credentials in the main UI. In this case I'll get them from the secrets; I've added them to GitHub as a
secret, and we can gather them from there. Same thing with the ClearML API host. In our case it will just be 
`app.clear.ml`, which is the free tier version of ClearML. You also want a GitHub token because we want to actually
add a comment to a PR, so we also need a GitHub token, which is very easy to generate. I'll put a link for that down 
in the description. Then we also have the comment commit ID. So, specifically we want the pull request headshot, which 
is the latest commit in the pull request. We're going to do some things with that. 

We'll run this job basically on Ubuntu, and then we have some steps here. So, first we want to check out our code which 
is just the PR. Then, we want to set up python with 3.10, which depends on whatever you might be running with, and then 
also install ClearML. So we have some packages here that we want to install in order to be able to run our code. Now 
most of the time I like to just have a very simple job like this that just uses a Python script that does the
actual logic, because command line logic is not very handy to work with, so it's usually easier to just use a Python 
file, like this, so we'll be doing `python_task_stats_to comment.py`, which we'll check out right away.

I'll collapse some of these functions for you because they're not actually that interesting. Most of the code here 
is not related to ClearML specifically, it's mainly related to getting the comment out to the PR, but in this
case we'll just walk through the `if __name__=='__main__'` and we'll go from there. 

So first off, this is running on a PR right, so we want to say we're running on the commit hash with the commit hash 
just so we know, and then we already have our first interesting function. So the first step that we want to do is to 
make sure that we already have a task present in ClearML that basically runs the code that wants to be committed
right now, so we have to check that the two are the same right. We have a PR opened right now, we have a commit hash.
We want to check if that commit hash is in any of the tasks in ClearML, so we can say like this is the code in ClearML, 
that we want to track right, so we know where to get the statistics basically. I'll check this open so this is the 
first cool--querying. A lot of people don't know that you can actually use the ClearML SDK to just query the database 
in ClearML. So in this case I'll want to query all of our tasks with the task filter, basically order it by the latest 
first, then set the script version number and the script version number tag. The key here actually corresponds here to 
the commit ID, so we'll basically get this, and I wanted to fit the commit ID that we get from the PR. So now we've
opened the PR, we get the commit ID that is the latest. In this case you'll see actually here it's this one so the
commit ID is the one that we set here as the pull request head. We get that from the environment here and pass it 
through this function, and if we go to this function, this commit ID we basically want to check if this committed ID is 
already in a task in ClearML. I also want the task to be completed. I don't want any failed tasks here. We just want to 
make sure that the code can run, that it all has already run in ClearML, and I also want the script diff which is the 
uncommitted changes as well. We'll check that in just a sec. So basically this query will just return all the tasks 
that fit these descriptions; basically every single task that was run on this code base essentially.

But, we don't just want the commit ID to match, we also want to make sure that there weren't any uncommitted changes. 
So, we make very, very sure that the task in ClearML has the exact same code as the PR we're looking at right now.
So we basically check if any tasks were returned, then we can go through them. If no task was found, we basically
want to raise a value error saying you at least have to run it once in ClearML with this code base before you can
actually merge it into `main`. Seems like a reasonable request. If we actually do find a task, we go for each task in 
the task, there could be multiple, but again they're sorted on last update, so we just can take the first one, and
then if not `task[script.diff]`, basically if there's not any uncommitted changes, we know the exact code that was 
used there then we can just return the task, and that's it. 

So now we have our task object. We know for sure that it was run with the same code as was done in the PR, and we also know 
that it was completed successfully. So we want to add a tag for example `main_branch`, just in your ClearML, you will be 
able to see a tag there `main_branch`.

Then, we also want to get the statistics, because we still want to log it to the PR as part of a comment. So if I go 
there and open it up, we first get the status of the task, just to be sure. Remember we queried it on `completed`, but
something else might have happened in the meantime. If the status is not `completed`, we want to say this is the 
status, it isn't completed this should not happen but. If it is completed, we are going to create a table with these
functions that I won't go deeper into. Basically, they format the dictionary of the state of the task scalars into
markdown that we can actually use. Let me just go into this though one quick time. So we can basically do `Task.get_last_scalar_metrics()`, 
and this function is built into ClearML, which basically gives you a dictionary with all the metrics on your task. 
We'll just get that formatted into a table, make it into a Pandas DataFrame, and then tabulate it with this cool package 
that turns it into MarkDown. So now that we have marked down in the table, we then want to return results table. You can 
view the full task. This is basically the comment content we want to be in the comment that will later end up in the PR. 
If something else went wrong, we want to log it here. It will also end up in a comment, by the way, so then we know that 
something went wrong from the PR itself.

So this is what `get_task_stats` returns. So basically, in stats now we have our MarkDown that can be used to
create a GitHub comment, and then we have `create_stats_comment`, which just uses the GitHub API to essentially get the 
repository, get the full name, take your token, and then get the pull request and create the
comment using the project stats that we gave here. Now to check if everything is working, we can open a new PR. For 
example, I'm here on the branch `video_example`, I'll just add a small change here just so we know that there is a 
change, and then we'll add a PR. So "add PR for video example," there we go, let's do that. Publish the branch, and 
then I can create a pull request straight from VS Code, because it's an awesome tool. Created, and now if I go to our 
PR here, which we can go into in GitHub here, you can actually see that there's a little bubble here. It's
already checking everything that it should, so you can see here we have the "add PR for video example," and you can see 
all the checks here. So `task-stats-to-comment` is the one that we're interested in right now. It will basically set up
everything, install ClearML, and then run the task. Now no task based on this code was found in ClearML, because we
just changed the code, it has an uncommitted change, remember? So there is no task in ClearML yet with the change that 
we just made. So in order to get that running, we have to go into the task, run this first with this new PR, and now we 
actually get a new task right here with the exact commits in branch `video_example`, without any uncommitted changes, 
and if we now rerun our pipeline we should be good to go. So let me just go there. It is almost done here. Yep, it's done 
so this should now be completed. And if I go back to our tests here, we can see that some of them have failed, so let's 
rerun the failed jobs. Now, in this case we should actually find a task in ClearML that has all our 
code changes, and it should work just nicely.

Right, we're back. This actually worked totally fine this time. So it actually only took 25 or 35 seconds, depending on 
which of the tasks you run, but `task_stats_to_comment` was successful, so this means that if we now go to the pull 
request, we see our little checkbox here that all the checks worked out perfectly fine, and if I go in
here, you can see that the actual performance metric of series 1 is right there, so that's really, really cool. We
just changed it and there's already an example there. So that was actually the first one, `task_stats_to_comment`, which 
is really handy. You can just slap it on any task, and you'll always get the output there. If you add a new commit to 
your PR, you'll just get a new comment from these checks just to be sure that it's always up-to-date.

So let's get to the second part. So we had our `task_stats_to_comment`, what else might you want to do with GitHub CI/CD? 
Another thing you might want to do is compare models, basically compare the output of the model or the last metric 
that we just pulled from the current task, which is the task connected to the PR that we want to open, or that we've 
just opened, and compare its performance to the performance of the best model before it. So we can always know that it's 
either equal or better performance than the last commit. 

So if we go to `compare-models` here, and we have our 
environments again, so this is all the same thing. We run again on Ubuntu 20.04, we check out the code we set up in Python, 
we install our packages, and then we run `compare_models.py`. `compare_models.py` is very, very similar. It is very 
simple. So here we print "running on Commit hash" which we get from the environment variable that we just gave to 
GitHub, and then we run `compare_and_tag_task`. So what we want to do is basically compare and then if it's better, tag 
it as such. So if I do now `current_task` is `get_clearml_task_from_current_commit`, which is basically the same thing 
that we used before in the last check. Basically, it goes to ClearML to check if there's already a task that has been 
run with this exact same code as in the PR. So we get a task from there, which is the current task, and then we want to 
get the best task as well. So in this case it's very simple to get it, so you just run `get_task`, give the project name 
to the project that we want to run in right now, give the task name which will be the same probably as the one that 
we're running now, but also with the tag `Best Performance`. And then if I go into our ClearML overview here, what 
you'll get is the best performance here because our checks already run, so you solve the three checks right before we 
open the PR, so basically the dummy task here was found to be the best performance, and it has been tagged but that 
means that every single time I open a PR or I update a PR, it will search ClearML, and get this dummy task. It will get 
this one, and then we say if we find the best task, if not we'll just add the best performance anyway because you're the 
first task in the list, you'll always be getting the best performance, but if you're not then we'll get the best latest 
metric. For example `get_reported_scalars().get('Performance Metric').get('Series 1').get('y')`, so the `y` value there 
so this could basically be the best or the highest map from a task or the highest F1 score from a task, or any some 
such. Then you have the best metric. We do the same thing for the current task as well, and then it's fairly easy. We 
just say hey if the current metric is larger or equal than the best metric, then this means we're better or equal, we're 
good to go `current_task.add_tags("Best Performance")`. If not, this means the current metric is worse and the PR you're 
trying to merge actually has worse performance than what was there before. We at least want to say that, but you could 
also easily say I want to raise a value error, for example, that says that it must be better and then the pipeline will 
fail, which can allow you to block the PR until it actually is equal or better. 

So now it's time for the third check, and the last one as well. This is a little more complicated so that's why I 
kept it for last, but it's a really cool one as well. Specifically, we're going to be using the remote execution 
capabilities of ClearML next to the CI/CD. So we'll basically test if whatever you want to add to the `main` branch, so 
whatever is in your PR, we want to check if that code is even remotely runnable using a ClearML Agent, because most of 
the time what you want to be doing is you want to be running stuff locally and testing locally and iterating very, very 
fast, and then whenever your code is good to go, you want to check if that actually runs on a remote machine because 
that's where you want to end up doing the real heavy lifting, the real training. So, the only thing we want to check is 
if there's anything missing from the requirements, if there's anything else that might break if it's going to run on the 
remote machine. The cool thing about that is that you know for sure that every commit on the `main` branch is also 
runnable on a remote machine, just to be sure. 

So how can we do that? We can add again our environment variables so that our runner has access to ClearML. We run on 
Ubuntu 20.04, we check out specifically to the branch, because sometimes the agent might have issues with that, so we 
want to make sure that we're actually in the headshot, and then we set up our Python environments again, we 
pip install ClearML, and we also add some `ripgrep` function that we'll just use in just a second. Now, the first thing 
we want to do in this whole pipeline is we want to start the task remotely, we want to make sure that it doesn't fail, 
and then we actually want to pull every so often to capture if it starts its iterations. If only one iteration is 
already reported, it means that the loop, the main training loop, will probably work just fine, and we can quit it there. 
So that's exactly what we're going to do. 

First step: launching the task. So we want to start a task here. We'll give it an ID so that we can actually use the 
output of that process and then there is this small tool that not a lot of people know about, but it's actually `clearml-task` 
as a command line utility, and the cool thing about that is `clearml-task` allows you to basically run any kind of 
GitHub repository remotely from the get-go. So you don't have to add anything to the code to begin with. So in this case, 
this is perfect because we've just checked out our code, and the only thing we want to do is throw that to a remote 
machine and make sure that it works. So what we're going to do, I'll open my command line here, so what I'll do is I'll 
put it into a queue that is non-existent so that it will fail, but then we'll see the output just to be sure, and then 
I'll keep make sure that the branch is gone here because it's an interpolated value that we don't have in this case. So 
if I run this in my GitHub actions example repository here, what it will do is it will launch the task on a 
remote machine using a ClearML Agent, so it will set up the requirements, it will set up everything, and it says new 
task created with this ID. Of course, we can't actually queue it because the queue is non-existent, but what we want to 
do here is use this command to actually launch the ClearML task, and then we use `ripgrep` to basically get this task ID 
out of the console output. We'll store that into a value GitHub output that we can access here, so we'll give this task 
ID that we just started on the remote machine to this Python file, which we'll check out right now. So it's again very 
simple, so we check the task status of the first argument which again will be the task ID, we'll check the task status, 
we'll get the task itself which is a task object from ClearML, we'll start a timer, and then we'll say that 
if the task exists, we check for a timeout for a while. So what we want to do is a `while` loop where you say that 
whenever the time that I've been checking has not been longer than a certain timeout, I want to be pulling the task 
and making sure that it's still running, so I get the task status which hopefully should be either queued `pending`, 
`in progress`, or whatever, hopefully not `failed` of course, but that can always happen. So we get a task status, we 
print some stuff, and then if the task status is skewed, which means that there are tasks in the queue before it, and it 
can't actually be run yet because all the agents are currently working, we actually just want to reset the timer, so 
we reset the start time to be `time.time`, which basically will not allow this timeout to be triggered. This is kind of 
nice because we don't want the timer to be triggered because it's waiting in the queue, like there's nothing happening 
to it, so we only want the timer to be started whenever it's actually being executed by ClearML agent. So we've reset 
the timer. At some point the task status will change from `queued` to anything else. If this task status is `failed` or 
`stopped`, it means we did have an error which is not ideal which is exactly what we want to catch in this case, so 
we'll raise a value error saying "Task did not return correctly, check the logs in the web UI." You'll probably see in 
ClearML that the task will actually have failed, and then you can check and debug there. Also raising a value error 
will actually fail the pipeline as well, which is exactly what we want. We don't want this PR to go through if the 
pipeline fails, because of a task that can't be run remotely, this is exactly what we want to catch. 

But, if the task status is in progress, we go into a next loop, in which we say, if the task `get_last_iteration` is larger than zero, 
basically if we get only one iteration, it means that the whole setups process was successful, the model is training, 
and we're good to go. So in that case, we just clean up, we've just checked everything is good, so we set the task as 
`mark_stopped`, we set the task as `set_archived`, and we return `true`, which basically says get the task out of the 
way, it shouldn't be in the project anymore. We just checked everything works. Get it out of my sight! 

So that was the last of the three checks that I wanted to cover today. I hope you found this interesting. I mean, if we 
go back to the PR here, it's really nice to see all of these checks coming back green. It's very easy to just use the 
ClearML API and even ClearML task for example to launch stuff remotely. It's not that far of a fetch either to just 
think why not use ClearML agent as for example a test bed for GPU tests. So you could very easily add things to the 
queue for the agent to work on and then just pull its performance in this way or pull its status in this very way. So 
you could actually run tests that are supposed to be run on GPU machines this way because GitHub doesn't automatically 
or out-of-the-box allow you to run on GPU workers. 

So it's just one of the very many ways that you can use ClearML to do 
these kinds of things and I hope you learned something valuable today. All of the code that you saw in this example 
will be available in the link in the description, and if you need any help, join our [Slack channel](https://joinslack.clear.ml), we're always there, 
always happy to help and thank you for watching.

</Details>
