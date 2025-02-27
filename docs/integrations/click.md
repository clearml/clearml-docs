---
title: Click
---

:::tip
If you are not already using ClearML, see [ClearML Setup](../clearml_sdk/clearml_sdk_setup) for setup 
instructions.
:::

[`click`](https://click.palletsprojects.com) is a Python package for creating command-line interfaces. ClearML integrates 
seamlessly with `click` and automatically logs its command-line parameters. 

All you have to do is add two lines of code:

```python
from clearml import Task

task = Task.init(task_name="<task_name>", project_name="<project_name>")
```

For example: 

```python
import click
from clearml import Task

@click.command()
@click.option('--count', default=1, help='Number of greetings.')
@click.option('--name', prompt='Your name', help='The person to greet.')

def hello(count, name):
    task = Task.init(project_name='examples', task_name='Click single command')

    for x in range(count):
        click.echo("Hello {}!".format(name))


if __name__ == '__main__':
    hello()
```

When this code is executed, ClearML logs your command-line arguments, which you can view in the 
[WebApp](../webapp/webapp_overview.md), in the task's **Configuration > Hyperparameters > Args** section. 

![click configuration](../img/integrations_click_configs.png)

In the UI, you can clone the task multiple times and set the clones' parameter values for execution by the [ClearML Agent](../clearml_agent.md).
When the clone is executed, the executing agent will use the new parameter values as if set by the command-line.

See [code examples](https://github.com/clearml/clearml/blob/master/examples/frameworks/click) demonstrating integrating
ClearML with code that uses `click`.