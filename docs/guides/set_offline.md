---
title: Storing Task Data Offline
---

If your computer is offline, or you do not want a Task's data and logs stored in the ClearML Server, use
the **Offline Mode** option. In this mode, all the data and logs that the Task captures from the code are stored in a 
local session folder, which can be later uploaded to the [ClearML Server](../deploying_clearml/clearml_server.md).

## Setting Task to Offline Mode

You can enable offline mode in one of the following ways:
* Before initializing a task, use the [`Task.set_offline`](../references/sdk/task.md#taskset_offline) class method and set 
the `offline_mode` argument to `True`

  ```python
  from clearml import Task
  
  # Use the set_offline class method before initializing a Task
  Task.set_offline(offline_mode=True)
  # Initialize a Task 
  task = Task.init(project_name="examples", task_name="my_task")
  ```

* Before running a task, set `CLEARML_OFFLINE_MODE=1`

:::warning 
Offline mode only works with tasks created using [`Task.init()`](../references/sdk/task.md#taskinit) and not with those created 
using [`Task.create()`](../references/sdk/task.md#taskcreate). 
:::


All the information captured by the Task is saved locally. Once the task script finishes execution, it's zipped. The 
session's zip folder's location is `~/.clearml/cache/offline/<task_id>.zip`.

The task's console output displays the task ID and a path to the folder with the session's captured information:

```console
ClearML Task: created new task id=offline-372657bb04444c25a31bc6af86552cc9
...
...
ClearML Task: Offline session stored in /home/user/.clearml/cache/offline/b786845decb14eecadf2be24affc7418.zip
```


## Uploading Session Data

Upload the session's execution data that the Task captured offline to the ClearML Server using one of the following:


* `clearml-task` CLI
    
  ```bash
  clearml-task --import-offline-session "/home/user/.clearml/cache/offline/b786845decb14eecadf2be24affc7418.zip"
  ```

  Pass the path to the zip folder containing the session with the `--import-offline-session` parameter.
  
* [`Task.import_offline_session`](../references/sdk/task.md#taskimport_offline_session) method. 

  ```python
  from clearml import Task

  Task.import_offline_session(
      session_folder_zip="/home/user/.clearml/cache/offline/b786845decb14eecadf2be24affc7418.zip"
  )
  ```

  In the `session_folder_zip` argument, insert the path to the zip folder containing the session.
  
  To upload the session from the same script that created it, first close the task then disable offline mode: 
  
  ```python
  Task.set_offline(offline_mode=True)
  task = Task.init(project_name="examples", task_name="my_task")
  # task code
  task.close()
  Task.set_offline(False)
  Task.import_offline_session(task.get_offline_mode_folder())
  ```
    
  You can also use the offline task to update the execution of an existing previously executed task by providing the 
  previously executed task's ID. To avoid overwriting metrics, you can specify the initial iteration offset with 
  `iteration_offset`.   
  
  ```python
  Task.import_offline_session(
    session_folder_zip="path/to/session/.clearml/cache/offline/b786845decb14eecadf2be24affc7418.zip", 
    previous_task_id="12345679", 
    iteration_offset=1500
  )
  ```
  
Both options will upload the Task's full execution details and outputs and return a link to the Task's results page on 
the ClearML Server:

```console
ClearML: Importing offline session from /home/user/.clearml/cache/offline/b786845decb14eecadf2be24affc7418.zip
ClearML results page: https://app.clear.ml/projects/4043a1657f374e9298649c6ba72ad233/experiments/bb8b0f6fa0f94536a0d27fb55f02d3a5/output/log
```

The session details can be viewed in the ClearML WebApp, in the "my_task" task of the "examples" 
project, as specified when initializing the Task.