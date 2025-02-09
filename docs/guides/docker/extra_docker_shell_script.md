---
title: Extra Docker Shell Script
---

When using `clearml-agent`, an agent recreates an entire execution environment, be it by pulling a container or 
installing specified packages, and then executes the code on a remote machine. The Agent takes into account required Python packages, 
but sometimes, when using a Docker container, a user may need to use additional, non-Python tools. 

## Tutorial

In this tutorial, you will learn how to use `extra_docker_shell_script` to reconfigure an Agent to execute 
a shell script when a docker is started, but before a task is run. 

## Prerequisites
* `clearml-agent` downloaded and configured - work on a machine which has access to the configuration file of the Agent
  you want to configure 
* Any code with a ClearML Task. 

## Steps 

1. Open your ClearML configuration file for editing. Depending upon your operating system, it is:
   * Linux - `~/clearml.conf`
   * Mac - `$HOME/clearml.conf`
   * Windows - `\User\<username>\clearml.conf`

1. In the file, go to, `extra_docker_shell_script:`, which is where you will put an extra script. If
it is commented out, make sure to uncomment the line. Use the example script that is already there `["apt-get install -y bindfs", ]`.
   
1. Search for and go to `docker_force_pull` in the document, and make sure that it is set to `true`, so that your docker 
   image will be updated. 
   
1. Run the `clearml-agent` in docker mode: `clearml-agent daemon --docker --queue default`. The agent will use the default 
   Cuda/Nvidia Docker Image. 

1. Enqueue any ClearML Task to the `default` queue, which the Agent is now listening to. The Agent pulls the Task, and then reproduces it, 
   and now it will execute the `extra_docker_shell_script` that was put in the configuration file. Then the code will be
   executed in the updated docker container. If you look at the console output in the web UI, the third entry should start
   with `Executing: ['docker', 'run', '-t', '--gpus...'`, and towards the end of the entry, where the downloaded packages are 
   mentioned, you can see the additional shell-script `apt-get install -y bindfs`. 
   
