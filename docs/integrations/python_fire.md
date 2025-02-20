---
title: Python Fire
---

Python Fire is a Python package for creating command-line interfaces. 
ClearML integrates seamlessly with `fire` and automatically logs its command-line parameters.

All you have to do is add two lines of code:

```python
from clearml import Task

task = Task.init(task_name="<task_name>", project_name="<project_name>")
```

When the code runs, ClearML logs your command-line arguments, which you can view in the [WebApp](../webapp/webapp_overview.md), in the task's 
**Configuration > Hyperparameters > Args** section. 

![Fire integration](../img/integrations_fire_params.png)

In the UI, you can clone the task multiple times and set the clones' parameter values for execution by the [ClearML Agent](../clearml_agent.md).
When the clone is executed, the executing agent will use the new parameter values as if set by the command-line.

See [code examples](https://github.com/clearml/clearml/blob/master/examples/frameworks/fire) demonstrating integrating
ClearML with code that uses `fire`.




