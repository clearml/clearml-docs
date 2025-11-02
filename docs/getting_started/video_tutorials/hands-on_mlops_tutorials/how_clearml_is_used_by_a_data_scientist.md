---
title: How ClearML is used by a Data Scientist
description: An overview of how you can use ClearML as a data scientist.
keywords: [mlops, components, machine learning, data scientist]
---


## Video Tutorial

<div class="vid">
<iframe 
        src="https://www.youtube.com/embed/quSGXvuK1IM?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>


<Details class="panel info"> 
<summary class="panel-title">Video Transcript</summary>
Welcome to ClearML! In this video, I'll try to walk you through a day in my life where I try to optimize a model, and 
I'll be teaching you how I used to do it before I was working for ClearML, and then now that I'm using ClearML all the 
time, what kind of problems it solved and what, how it made my life easier. So let's get started here. 

You can see the overview of the code, so I'm not going to dive into the code immediately, I'm just going to give you some 
context, and then we'll go deeper from there. 

So the idea is that I'm doing audio classification here. I have a client who I want to give a proof of concept on 
how well it can work, and I'm doing that on the UrbanSound dataset. So the first thing I'll do, and you'll see that 
later is I'll get the data from the UrbanSound servers. I'm using a script called `get_data.py` for that, and then for 
reasons I'll go further into in the video I'm actually putting all of that data into a ClearML dataset which is a special 
kind of dataset task or a special kind of ClearML task that can keep track of your data. Then the `preprocessing.py` 
script will get that data and then convert the WAV files or the audio files to spectrum images. Essentially you're 
turning all your data into image data because the models that do image data are actually very, very easy to work with and 
are pretty good, so you can actually do the classification by classifying an image from your audio instead of classifying 
your audio as a whole. Really cool stuff. 

So that will convert the WAV files into spectrum images and then send it to a 
new version of that same dataset so that I can keep track of where everything is going and then that new data I will use 
to train a model right. And I'm using `training.py` exactly for that. 

So let's go to the code and get a look on how this looks in real life, right? We have here the `get_data.py` script which 
looks like this. We have the `preprocessing.py` which looks like this, and we have the `training.py` which looks like this. 
I've collapsed a lot of the functions here so that it's a lot easier to take a look. The first thing you'll notice when 
I'm going through these files is the `Task.init` command and essentially this is what ClearML uses to keep track of every 
time you run this specific script. So you'll see it in `get_data.py`, you'll see it in `preprocessing.py`, and you'll 
see it in `training.py` as well. And so this line is all you need to get started. It will already start capturing 
everything that you'll need and that the program produces like plots or hyperparameters, you name it. 

So let's take a look in depth first at what `get_data.py` does for me. So getting data is very simple, but what I used 
to do is I would get the data from a remote location. You download a zip file or whatever, and then you extract it 
to your local folder, and then you start working on that. Now the problem with that is it's really difficult to keep 
that thing clean. So, how would I version that right if I add data to it? For example, the preprocessed data we'll see 
later. How can I keep my correct version? How did I? How do I know if the data changes over time? When did I do that? 
Like, can I rerun the models that I trained on previous data on the new data. like just to keep an overview of how all 
of this data is flowing. It's a lot easier to use a ClearML dataset instead. 

So what I'm doing here and this is actually really cool. I'm using a single link to a zip file that I made, which is a 
subset of the complete data, so it only has like 120 samples or something, and then we use that to iterate really quickly. 
We also have the part to the UrbanSounds full dataset, which we then label as `full dataset` and that will give us the 
freedom to switch between subset and full dataset. So I will essentially create two ClearML data versions, one with the 
subset, one with the full dataset, and that will allow me to very quickly change without having the whole thing, with 
different versions on my desk all the time. What I used to do is then have different versions or different 
folders and then probably different folders with different names as well for every time you do it again. but then if you 
don't change the name, you overwrite it. so that's all the thing of the past. Now we have nice and clear. I'll show 
it to you later in the UI, we have a nice and clear overview of all of the different versions. 

I'll add some dataset statistics that's also something you can do and ClearML is just adding some, for example, class 
distribution or other kinds of plots that could be interesting, and then I'm actually building the ClearML dataset here. 
Also, an extra thing that is really, really useful if you use ClearML datasets is you can actually share it as well. 
So not only with colleagues and friends, for example. You can share the data with them, and they can add to the data, and 
always you will always have the latest version, you will always know what happened before that. 

There's also the possibility of using the data on a different machine, which is really, really useful because this machine isn't the most 
powerful of them all. And I want to train on the full dataset on a different machine that has a GPU, and then I can just 
point it to the ID of the dataset, and it will just grab the latest version, and we're good to go. So that's a lot easier 
than trying to keep the dataset versions in sync over two machines, which is one of the main things that ClearML Data 
tries to solve. So that's what the dataset or the `get_data.py` does for you. 

Then we have the `preprocessing.py` which is relatively simple. Essentially, what I'm doing is, I'll get the data from 
the `get_data.py` So the previous dataset version. I'll get that data and then each line by line. So each, every, each 
and every sample in that dataset will then be preprocessed using the preprocessing class, which will just calculate a 
mel spectrogram if you're into that kind of thing. but I won't go into depth about it here. Essentially, we'll create 
a mel spectrogram for each sample that will give us an image, and then we take that image and put it into a different 
dataset, which now has the same structure as the previous dataset, but now also with images there. And because the WAV 
files, or the audio files, are already in the previous dataset, this new version will only upload the images that we 
just produced. It won't duplicate the data because it knows it's already in a previous version. It will just reuse that 
instead. So that also saves a bit of disk space, if you're trying to put it on the cloud as well. 

Now how I used to do this before ClearML is actually creating a new folder with a unique name for that specific run and 
then putting all of the images in there. But that's just a huge mess, right? We've all done this. But then you 
forget to change the name, and then you overwrite your previous samples. But you also don't know if you're just running 
through it. You don't know what kind of code or like what the code was that created your previous versions right? So 
they're not saved together which is a huge mess. It gets out of hand really quickly. You end up with a huge folder full 
of different names and versions, but the original code isn't attached. The original plots aren't attached so that's 
really annoying. And that is what ClearML Data does for you is it will keep track of this, but it will also keep track 
of which run of your code actually produced this, and that allows you to always go back and see if you made any mistakes. 
You can always go back, which allows you to iterate a lot faster. 

And then finally we have the training script. If I go to the training script, you also again see the `Task.init`, so we 
want to capture every single time that we run this code, and then you can also see that I made a huge configuration dict. 
So essentially every parameter that I use in my code is in this dictionary, and then I connect it to the task. and we'll 
see later why that is really, really useful. But for now at the very least what it will do is it will keep track of all 
of these parameters, so I can very easily verify in the UI that we'll see later where those parameters came from, what 
they're doing, in which case which parameters were used. It just keeps track of everything which is really, really nice. 
I just read set to random seeds, I put it on a CUDA device if it's available and then there is a TensorBoard writer. So 
I like to use Tensorboard which is like the industry standard to keep track of my logs and outputs. And what is really 
cool about ClearML is it will automatically detect that you're using TensorBoard and you don't have to manually log 
everything to ClearML as well. ClearML will just say oh, you log this to Tensorboard, I'll take it, and I'll log it to 
ClearML as well. Really nice. 

And then I just prepare the data. I get my model, which is dependent on the different parameters that I just showed you. 
Then I plot the signal train, eval, and model. And if I plot things with MathPlotLib for example, that's also 
automatically captured by ClearML. So that's again something that I don't have to think about. But the plots are all 
saved together with my code together with those hyperparameters you just saw together with the output, which is really 
handy. 

But then there is one last thing that I want to focus on. And that is the model files. So again, before I used ClearML, 
the model files, I would essentially create one long name for the file with just underscores and all of the different 
parameters in there, so that in every model file, I could easily see what the parameters were that I used over time to 
create those model files. But that's just a huge mess because the amount of parameters that you use changes over time, 
you add more parameters, you just destroy some, and then it gets a huge mess because you can't go back to the code that 
actually used those parameters. And if you're looking like this, a configuration dict is quite long. Look at those 
parameters. What if I want to include those classes? It's a huge parameter. I can't just add it to the file size or to 
the file name and not have it become a mess. 

So to be able to connect these parameters to the model files that they output, to the plots that it produced to the 
original code that produced all of this. We need ClearML or you need some kind of experiment manager at the very least. 
And this is what ClearML is doing for me. 

So now that you've seen all of my code, let's take a look at the ClearML UI where all of this code actually gets tracked, 
and you have this nice overview of your experiments. So if I go to the dashboard, you will see my recent projects and my 
recent experiments. 

Let's dive into the recent projects that I'm working on currently, which is "The Day in the Life of" video and that's 
exactly what we're working on right now. And as you can see, it's a mix between the training which is `training.py` that 
we just saw, downloading data which is `get_data.py` that we just saw and preprocessing which is `preprocessing.py` that 
we just saw. We also have tags, which is really, really handy because every time I run a specific script on either the 
subset or the full dataset, I can tag it as such and in that way I can easily filter for example, on saying hey, I only 
want to see my tasks that have been run on the subset for now. Which is really, really nice to get started with. 

And then there's also of course usually a huge mess right? So what I start to do as well is you have a status of your 
task, and I tend to only show everything that is not _failed_ or _aborted_ just to get enough just to get all of these 
models or training runs that I did that failed or that I made a code mistake or whatever. Just get them out of there. 
They just clutter the whole thing. You can do whatever you want of course, but this is my preference. 

And then there is the option to sort as well. So in any of these columns you can just sort on that property and in this 
case I'm going to sort by name, and then a quick tip for you. If you use shift click you can sort secondarily on that 
column as well. So right now I'm sorted by name first and then all of the experiments that have the same name are 
secondarily sorted by their started time, which will give me the most recent one of each batch. And then you can see 
here the last training that I did was 18 hours ago and if I scroll down a while ago I did some preprocessing. I did 
some downloading of the data and that is also sorted quite nicely. You can also see on the tag that this is specifically 
dataset, and then you can also see if I go to this dataset which is really cool. 

As I said before, if we go to the 
diagram we have `preprocessing.py` creates a new version of the original dataset, so if we're going to look at the plots 
here, we can actually see this. This is an overview of your dataset, genealogy or lineage, and it will keep track of 
every single time you created a new version and where that data came from. So you can always go back and see what the 
original data was, what the original task was that made it. And here you get a summary of what all the things were that 
were added. So in the preprocessed dataset, we created 109 new images that we added to the 111 WAV files that were 
already there, which actually immediately tells you there might be something wrong there because we missed two audio 
files that we didn't convert into image files. So it can actually help for debugging as well. 

Now if we go back to the experiment table here, we can take a little bit of a deeper look into the training runs that 
I've been doing recently just to get my bearings before I start making a new model. I can click this button or right 
click and press details to get more in-depth on this specific training run. So what you can see here is: I've tracked my 
repository. I've tracked every uncommitted change as well, which will allow you to always go back to the original code 
if you needed to. It installed every package or all the installed packages are tracked as well so that we can later 
reproduce this thing on another machine, but we'll go more into that in a later part of the video. 

There's also configuration, so these are the configuration dict values that I showed you before in the training script, 
right? So you can see everything here, and it gives you a nice and clean overview of everything that is going on. 

There's artifacts, so this is the model that I was talking about that is being tracked and saved as well. 

Then there is info on which machine it was run and stuff like that. 

And then there is a console output or the results of everything that is basically outputted by your code. So the results 
here are either a console output which is how the training looked and essentially what has been printed to my console 
back then. 

There's scalars, which is something that is of value in the training of your model. So in this case, it would be the 
F1 score or the performance of my model over time or over the iterations. And I also have a training loss, which looks 
very weird here, but we can figure out where that came from because we can analyze it right now. It will also monitor 
your machine usage and your GPU usage and stuff like that, and then the learning rate for example as well. So this will 
give you a really, really quick overview of the most important metrics that you're trying to solve. And keep in mind 
this F1 score because this is the thing that we're trying to optimize here. 

Then plots. I can, for example, plot a confusion matrix every X iterations. So in this case, for example, after a few 
iterations, I plot the confusion matrix again just so I can see over time how well the model starts performing. So as 
you can see here, a perfect confusion matrix will be a diagonal line because every true label will be combined with the 
exact same predicted label. And in this case, it's horribly wrong. But then over time it starts getting closer and 
closer to this diagonal shape that we're trying to get to. So this is showing me that at least in this point it's 
learning something, it's doing something, so that actually is very interesting. 

And then you have debug samples as well, which you can use to show actually whatever kind of media you need. So these 
are for example, the images that I generated that are the mel spectrogram's so that the preprocessing outputs, and you 
can just show them here with the name of what the label was and what to predict it was. So I can just have a very quick 
overview of how this is working, and then I can actually even do it with audio samples as well. So I can for example here 
say this is labeled "dog", and it is predicted as "children playing". So then I can listen to it and get an idea on, is 
this correct? Is it not correct? In this case, obviously it's not correct, but then I can go further into the iterations 
and then hopefully it will get better and better over time. But this is a quick way that I can just validate that what 
I'm seeing here, what the model is doing is actually translatable into: Yes, this is correct. This is a correct assumption 
of the audio here. 

The last thing I want to show you is how you can customize this table, so it's quite easy to just say okay, I don't want, 
for example, the name of who ran it or whatever. But you can also do this really cool thing which is called adding 
custom columns and I use this all the time in my daily life. It makes everything so much easier because I can add a metric 
as well which is one of the scalars that we saw before. So if I use the F1 score here and take the maximum of 
that, I can see the max F1 score of every single training run in this list, and then I can sort on that to just get a 
leaderboard essentially which will give me a nice overview of the best models that I have, and then I can just dive in 
deeper to figure out why they were so good. 

But now it's time to actually start changing some stuff. So this is the beginning of my day. I've just gotten my 
bearings, I know what the latest models were, and the score to beat here is 0.571429, and that's the F1 score we're 
trying to beat on the subset and if the moment that we find a combination of parameters or a change of the code that 
does better than this or that is in the general ballpark of this, we can actually then run it on the full dataset as 
well. But I'll tell you more about that later. 

So the first thing we're going to do is go back to training the `training.py` script. I might want to change several 
parameters here, but what I've read something that I've been interested in and while getting the model, I see that here 
I still use the optimizer stochastic gradient descent, and it could be really interesting to see how it compares if I 
change this to atom. Now the atom optimizer is a really, really good one, so maybe it can give me an edge here. Of 
course, Atom doesn't have the same parameters as SGD has, so I'm removing the momentum here because the atom optimizer 
doesn't really care about momentum. It's not using that. So all that I have to do now is just run my training run and 
all will be well. So you can see here that ClearML created a new task, and it's starting to train the model. So it's 
using a specific dataset ID which you can find in the configuration dict. I set it to this dataset tag, use the latest 
dataset using a subset tag so in that case it will get the latest data that is only in the subset. So that's what we're 
training on here. You can see I have 102 samples in the training set, only seven in the test set. This is why it's 
subset, and now you can see that its training in the app box and if I go to the experiment overview and I take a look 
at what is here, I can see that the training run, here, I'll sort it on started up front so that we have it up top. 
I can see that the training run here is in status running, which means it's essentially reporting to ClearML which is 
exactly what we want. And if I go to the **Details** tab, I can go to Results and see the console output being logged 
here in real time and the causal output might not be this interesting to keep staring at, but what is interesting to 
keep staring at is the scalars. So here you can see the F1 score and the training loss go up or down before your eyes 
and that's really cool because then I can keep track of it or like have it as a dashboard somewhere just so that I know 
what is happening out there. So I'm going to fast-forward this a little bit until it's completely done and I will go 
into more in-depth analysis of this whole thing. 

So right now we see that it's completed and if we go back to what we had before and I sort again by the F1 score, we see 
that the newest training run that we just did two minutes ago, and it was updated a few seconds ago is actually better 
than what we had before. So it seems that the atom optimizer in fact does have a big effect on what we're doing. And 
just to make sure that we didn't overlook anything, what I can do is I can select both my new model, my new best model, 
and the previous model that I had and then compare them. So it's what I have right here and everything that you just saw 
that was tracked, be it hyperparameters or plots or whatever, can all be compared between different training runs. So 
what we can see here if we click on **Execution**, we have some uncommitted changes that are obviously different, and then 
if we scroll down, what we can see is that for example, here the atom optimizer was added and the optimizer SGD was 
removed. So this already gives us the idea of okay, this is what changed. This is really interesting and we can always 
also use these differences to then go back to the original code. 

Of course, hyperparameters. There weren't any differences. We didn't actually change any of the hyperparameters here, 
but if we did, that would also be highlighted in red in this section. So if we're going to look at the scalars, this is 
where it gets really interesting because now the plots are overlaid on top of each other, and you can change the color 
if you don't if you don't like the color. I think green is a bit ugly. So let's take red for example. We can just 
change that here. And then we have a quick overview of two different compared experiments and then how their scalars did 
over time. And because they have the same X-axis as the iterations, we can actually compare them immediately to each other, 
which is really, really cool. We can actually even see how the GPU memory usage or the GPU utilization has fared over 
time, which is really interesting. And then things come up like for example, in this case, the higher F1 score which is 
in our case, the atom optimizer, had a higher loss as well, which is really interesting and we might want to take a look 
at that. Also, the spikes are still there. Why are they there? So this is really handy if you want to dive deep into the 
analysis of your model. 

Then we also have plots. For example, we can compare the confusion matrix between the SGD optimizer and the atom 
optimizer. So again, very useful and the same thing happens with our debug samples. So if we want to see the same audio 
samples be compared between the different experiments, that makes it very, very easy. So now we can look at the label 
dog barked and see how both experiments predicted it. 

But now we're going to start with a very interesting part. Remember, I had a subset and a full dataset. Now the subset 
is very easy to iterate on quickly and to run for example, on CPU. But now we have a model. If we go back to our 
overview. Now we have a model that's very, very good, even on the subset. So the first thing I want to do now is run the 
same thing on the full dataset instead, and I don't want to do this on my current machine because it's too small, and it 
doesn't have a GPU and whatnot, so we can clone the experiment and then run it on a different machine straight from the 
UI. So strap in. I'm going to show you how. So what you're going to do is right-click the experiment that you're 
interested in, and then go to clone. You'll get a clone experiment dialog. I want it on the same project of course, and 
then I want to keep running. Keep calling it training - it's my preference, but you can call it whatever you want - and 
then I'm going to clone it. Now it's in draft mode. What draft mode allows you to do is remember all of the 
hyperparameters that we had before. So all of these hyperparameters are now editable, so I can go into these 
hyperparameters that were tracked from our code before. I can show you these are the same parameters here. And then I 
can change whatever I want here. So essentially I can change the dataset tag to full dataset so that it will grab the 
latest dataset version with the full dataset tag and not the subset tag. And then because the data is so big, I can 
change the batch sizes to be a little bit higher, so I can change it to let's say 64 and 64. Let's keep the seed and the 
number of epochs and everything the same as it was, and then I save it. So now I've edited these hyperparameters and 
gotten the script the whole thing ready for deployment. So now what I want to do is, I can right-click or go to 
these bars there and then say enqueue and what that will do is it will put that experiment into the queue and I have a 
stronger machine, a machine with a GPU as a ClearML Agent. And that agent is currently listening to a queue, and it will 
grab experiments that are enqueued and start running them. And because we tracked everything, the code, the 
hyperparameters, the original packages. The agent, the different machine, has no issues with completely reproducing my 
experiment, but just on a different dataset. And so now I can click on **Enqueue**. I just want to enqueue it in the default 
queue because my agent is listening to the default queue, and it is currently pending. As we can see here. 

If I now go to **Workers and Queues**, what you can see is that I have my available worker here, and it is currently running 
my training experiment. So if I click on the training experiment, it will get me back to the experiment that we just 
edited. So if I go to the configuration we see that the batch sizes and the full dataset is right here. And it's 
currently running, but it's not running on this machine. It's running on a different machine that is hosting the 
ClearML agent, and it was listening to the queue. If we go to the results and the console, what you'll see here is that 
the output of this agent is essentially right now, just showing that it's trying to reproduce the environment that I 
had before. So now the agent is installing all the packages and is installing the whole environment to be able to run 
your code without any issues on its own. And then we'll be able to follow along with the scalars as well and the plots 
just as we would on any other task. How cool is that? That's awesome. So I'm going to let this run for a while, and 
we'll come back. We'll keep it on the **Scalars** tab so that you can see the progress being made, and then we can see the 
whole loss and F1 score grow and go down over time, but on the full dataset this time, and then I'll come back when 
it's done. 

All right, we're back. It finally trained. We can see the F1 score over time. We can see the training loss over time. 
So this is already a big difference with the subset that we saw before. And now if we go to projects and then little 
video, which is the current project, we can now change our filter for our tag sort to full dataset. And this will give 
us the full range of experiments that we trained this way on the full dataset, and you can clearly see that even though 
it got the most or the highest F1 score on the subset, we don't actually have the highest score on the full dataset yet. 
However, even though it is not the best model, it might be interesting to get a colleague or a friend to take a look at 
it and see what we could do better or just show off the new model that you made. So the last thing I want to show you is 
that you can now easily click it, right-click, and then go to share, and you can share it publicly. If you create a 
link, you can send this link to your friend, colleague, whatever, and they will be able to see the complete details of 
the whole experiment, of everything you did, you can see the graphs, they can see the hyperparameters, and I can help 
you find the best ways forward for your own models. 

So I hope this kind of inspired you a little bit to try out ClearML. It's free to try at [app.clear.ml](https://app.clear.ml), 
or you can even host your own open source server with the interface that you can see right now. So why not have a go at 
it? And thank you for watching.
</Details>
