---
title: ClearML Data
description: Learn about ClearML data.
keywords: [mlops, components, ClearML data]
---


## Video Tutorial

<div class="vid" >
<iframe style={{position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%'}} 
        src="https://www.youtube.com/embed/S2pz9jn26uI?rel=0" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
        allowfullscreen>
</iframe>
</div>

<br/>

<Collapsible type="info" title="Video Transcript">
Hello and welcome to ClearML. In this video we'll take a look at both the command line and Python interfaces of our data versioning tool called `clearml-data`. 

In the world of machine learning, you are very likely dealing with large amounts of data that you need to put into a dataset. ClearML Data solves 2 important challenges that occur in this situation:

One is accessibility, making sure the data can be accessed from every machine you use. And two is versioning, linking which dataset version was used in which task. This helps to make experiments more reproducible. Moreover, versioning systems like git were never really designed for the size and number of files in machine learning datasets. We're going to need something else.

ClearML Data comes built-in with the `clearml` Python package and has both a command line interface for easy and quick operations and a Python interface if you want more flexibility. Both interfaces are quite similar, so we'll address both of them in the video.

Let's start with an example. Say I have some files here that I want to put into a dataset and start to keep track of.

First, we need to actually create an initial dataset version. The easiest way to do this is with the command line interface. Use the command `clearml-data create` and then give it a name and a project, just like with a ClearML task. It will return the dataset ID, which we will copy for later. The dataset is now initialized, but is still empty because we haven't added any files yet.

We can do that by using the `clearml-data add` command and providing the path to the files we want to add. This will recursively add all files in that path to the Dataset.

Now we need to tell the server that we're done here. We can call `clearml-data close` to upload the files and change the dataset status to done, which finalizes this version of the dataset.

The process of doing this with the Python interface is very similar.

You can create a new Dataset by importing the Dataset object from the `clearml` pip package and calling its `create` method. Now we have to give the dataset a name and a project just like with the command line tool. The create method returns a dataset instance which we will use to do all of our operations on.

To add some files to this newly created dataset version, call the `add_files` method on the dataset object and provide a path to a local file or folder. Bear in mind that nothing is uploaded just yet, we're simply instructing the dataset object what it should do when we eventually *do* want to upload.

A really useful thing we can do with the Python interface is adding some interesting statistics about the dataset itself, such as a plot for example. Here we simply report a histogram on the amount of files in the train and test folders. You can add anything to a dataset that you can add to a ClearML task, so go nuts!

Finally, upload the dataset and then finalize it, or just set `auto_upload` to `true` to make it a one-liner.

In the web UI, we can now see the details of our dataset version by clicking on the Dataset button on the left. When we click on our newly created dataset here, we get an overview of our latest version, of course we have only one for now.

At a glance you can see things like the dataset ID, its size, and which files have been changed in this particular version. If you click on details, you'll get a list of those files in the **Content** tab. Let's make the view a little larger with this button, so it's easier to see. When we switch to the preview tab, we can see the histogram we made before as well as an automatically generated preview of some of the files in our dataset version. Feel free to add anything you want in here! Finally, you can check out the original console logs that can be handy for debugging.

Now imagine we're on a different machine. Maybe one from a team member, a classmate, or just one of your remote agents, and you want to get the dataset to do something cool with it.

Using the command line tool, you can download a dataset version locally by using the `clearml-data get` command and providing its unique ID. You can find a dataset's ID in the UI here, or alternatively, you can search for a specific dataset by providing the dataset name, its project, some tags attached to the dataset or any combination of the three. Running the command will give you the system path where the data was downloaded.

That path will be a local cached folder, which means that if you try to get the same dataset again, or any other dataset that's based on this one, it will check which files are already on your system, and it will not download these again.

The Python interface is similar, with one major difference. You can also get a dataset using any combination of name, project, ID or tags, but _getting_ the dataset does not mean it is downloaded, we simply got all of the metadata, which we can now access from the dataset object. This is important, as it means you don't have to download the dataset to make changes to it, or to add files. More on that in just a moment.

If you do want to download a local copy of the dataset, it has to be done explicitly, by calling `get_local_copy` which will return the path to which the data was downloaded for you.

This is a good approach for when you want to just download and use the data. But it *is* a read-only copy, so if we want to add or remove some data to create a new version, we'll have to get a mutable copy instead, which we can do by using `get_local_mutable_copy` instead. We can give it a local path, and it will download the dataset into that path, but this time, we have full control over the contents.

We can do this with the command line tool too, by simply adding a `--copy` flag to the command

Now that we have this mutable copy, let's try to change our dataset and create a new version. 

Let's say we found an issue with the hamburgers here, so we remove them from the folder. Then we add new pictures of chocolate cake. Essentially, we have now removed 3 files and added 4 new ones.

Now we can tell ClearML that the changes we made to this folder should become a new version of the previous dataset. We start by creating a new dataset just like we saw before, but now, we add the previous dataset ID as a parent. This tells ClearML that this new dataset version we're creating is based on the previous one and so our dataset object here will already contain all the files that the parent contained.

Now we can manually remove and add the files that we want, even without actually downloading the dataset. It will just change the metadata inside the Python object and sync everything when it's finalized.

That said, we do have a local copy of the dataset in this case, so we have a better option.

Using the python SDK, we can call the `sync_folder` method. This method will essentially compare the dataset object metadata with the content of a `local_path` that you supply. So when we now call `finalize` and upload, it will only upload or remove the files that changed.

The command line interface doesn't have the python object for metadata, so it can only work with local data using the sync command. But it bunches this whole process together in one single command. Call `clearml-data sync`, provide it with the dataset name and project for the new version and maybe add some parent datasets too if applicable. This single call will create a new dataset version, sync it and then upload the changes all in 1 go. Neat, right?

Now we can take a look again at the dataset UI. We'll see our original dataset as well as the new version we made just now that’s based on it.

When we click on our newest version in the lineage view, we can see that we indeed added 4 files and removed 3.

If we now click on details again to look at the content, we can see that our chocolate cakes have been added correctly. You’ll also notice that when we go to the **Preview** tab, we only see chocolate cakes. This is because a dataset version only stores the differences between itself and its parents. So in this case, only chocolate cakes were added.

In this video, we’ve covered the most important uses of ClearML Data, so hopefully you have a good intuition into what’s possible now and how valuable it can be. Building and updating your dataset versions from code is the best way to keep everything updated and make sure no data is ever lost. You’re highly encouraged to explore ways to automate as much of this process as possible, take a look at our documentation to find the full range of possibilities.

So what are you waiting for? Start tracking your datasets with `clearml-data` and don’t forget to join our [Slack channel](https://joinslack.clear.ml) if you need any help.

</Collapsible>
