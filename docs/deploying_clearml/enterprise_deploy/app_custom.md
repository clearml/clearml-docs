---
title: Custom Applications
---

The following is a guide for creating and installing custom ClearML applications on ClearML on-premises Enterprise servers.
ClearML applications are Python programs that are run as ClearML tasks whose UI--input form and output dashboard--is 
defined in an attached configuration file.

This guide will follow the `simple-app` application as an example. The application can be found on [GitHub](https://github.com/clearml/clearml-apps/tree/main/demo_apps/simple-app).

An application will generally consist of the following:
* Configuration file: File that describes the content of the application, such as: 
  * The task to run and from where to run it
  * The structure of the input form for launching an application instance
  * The information to display in the application instances dashboard.
* Assets: Optional images and artifacts for the application, such as icons and HTML placeholders.
* Task: Python code that is run when the application is launched. Should be in a Git repository.

## Configuration File
The configuration file describes the application. The file is a hocon file, typically named: `<app-name>.app.conf`. It 
contains the following sections:
* General: The root section, describing the application’s general information such as name, ID, version, icon, and queue
* Task: Information about the task to execute, such as repository info and hyperparameters
* Wizard: Fields for the application instance launch form, and where to store the input provided by the user
* Dashboard: Information section displayed for the running application instances 

### General
The `General` section is the root-level section of the configuration file, and contains the configuration options:
* `id` - A unique id for the application
* `name` - The name to display in the web application
* `version` - The version of the application implementation. Recommended to have three numbers and to bump up when updating applications, so that older running instances can still be displayed
* `provider` - The person/team/group who is the owner of the application. This will appears in the UI 
* `description` - Short description of the application to be displayed in the ClearML Web UI
* `icon` (*Optional*) - Small image to display in the ClearML web UI as an icon for the application. Can be a public web url or an image in the application’s assets directory (described below)
* `no_info_html` (*Optional*) - HTML content to display as a placeholder for the dashboard when no instance is available. Can be a public web url or a file in the application’s assets directory (described below)
* `default-queue` - The queue to which application instance will be sent when launching a new instance. This queue should have an appropriate agent servicing it. See details in the Custom Apps Agent section below.
* `badges` (*Optional*) - List of strings to display as a bacge/label in the UI
* `resumable` - Boolean indication whether a running application instance can be restarted if required. Default is false.
* `category` (*Optional*) - Way to separate apps into different tabs in the ClearML web UI
* `featured` (*Optional*) - Value affecting the order of applications. Lower values are displayed first. Defaults to 500

#### Example
The root section in the simple application example:
```
id: "simple-app"
version: "1.0.0"
name: "Simple example application"
provider: "ClearML"
description: "A simple example of an application"
icon: "${ASSET:app-simple-app@2x.png}"
badges: []
details_page: "task"
no_info_html: "${ASSET:index.html}"
default_queue: "custom_apps_queue"
```

### Task
The `task` section describes the task to run, containing the following fields:
* `script` - Contains information about what task code to run:
  * `repository` - The git repository. Note that credentials must be described in the Custom Apps Agent’s configuration. See details below.
  * `branch` - The branch to use
  * `entry_point` - The python file to run
  * `working_dir` - The directory to run it from
* `hyperparams` (*Optional*) - A list of the task’s hyper-parameters used by the application, with their default values. There is no need to specify all the parameters here, but it enables summarizing of the parameters that will be targeted by the wizard entries described below, and allows to specify default values to optional parameters appearing in the wizard.

#### Example
The `task` section in the simple application example:
```
task {
 script {
   repository: "https://bitbucket.org/seematics/clearml_apps.git"
   entry_point: "main.py"
   working_dir: "demo_apps/simple-app"
   branch: "master"
 }
 hyperparams {
   General {
     a_number: 30.0
     a_string: "testing 1, 2, 3"
     a_boolean: False
     a_project_id: ""
   },
 }
}
```

### Wizard
The `wizard` section defines the entries to display in the application instance’s UI launch form. Each entry may contain the following fields:
* `name` - Field name
* `title` - Title to display in the wizard above the field
* `info` - Optional information hint to the user
* `type` - Can be one of the following: 
  * Basic types:
    * `string`
    * `integer`
    * `float` 
    * `dropdown`
    * `checkbox`
    * `multiline_text`
  * Complex types:
    * `group` - Fields grouped together in a joint section. Fields of the group are defined within a list called 
    `item_template`
    * `list` - A field or group of fields that can be inserted more than once. Target should be specified for the entire 
    list. Fields of the list are defined within a list called `item_template`
* `required` - Boolean indication whether the user must fill the field. Default is `false`
* `default` - Default value for the field
* `placeholder` - Text to show in the field before typing
* `collapsible` - Boolean indicates if the group can be collapsed. Default is `false`
* `collapsibleTitleTemplate` - Optional title for collapsible fields. You can use `${field name}` to reference a field. 
  Useful for lists.
* `conditional` - Allows setting a condition for the displaying of a field. Specify a list of entries, each containing 
  the name of a field that appears earlier and its expected value. The field will be displayed only if the referenced 
  previous fields were filled with the matching value. See example below.
* `default_conditional_on` - allows setting a field whose default value depends on the value of a previous field in the wizard. 
  Need to specify the `name` of the previous field and a `value` dictionary, in which each key is a potential value of the previous field and each value is the default value for the default_conditional_field. 
* `choices` - for dropdown - Can be either an array of hard-coded options, for example: `["Option 1","Option 2"]`, or a ClearML object, such as task, project, queue to choose from. The following should be specified:
  * `source` - The source object. One of following:
    * `project`
    * `task`
    * `model`
    * `queue`
    * `dataset_version`
  * `display_field` - The field of the source object to display in the list. Usually “name”
  * `value_field` - The field of the source object to use for configuring the app instance. Usually “id”
  * `filter` - Allows to limit the choices list by setting a filter on one or more of the object’s fields. See Project Selection example below
* `target` - Where in the application instance’s task the values will be set. Contains the following:
  * `field` - Either `configuration` or `hyperparams`
  * `section` - For hyperparams - the section within the field
  * `name` - Key in which to store the value
  * `format` - The format of the value to store. `str` By default. Use `json` for lists.
* `item_template` -  list of items for `group` or for `list` fields.

#### Example
The example is based on the `simple-app` application `wizard` section:

* Wizard Section:

  ```
  wizard {
     entries: [
        …
     ]
  }
  ```

* Boolean Field: A simple boolean field stored in the `General` hyperparameters section:
    
  ```
  {
     name: boolean_field
     title: A boolean choice
     default: false
     type: checkbox
     required: false
     target {
         field: hyperparams
         section: General
         name: a_bool
     }
  }
  ```

  This will look like this:

  ![Bool choice](../../img/app_bool_choice.png#light-mode-only) 
  ![Bool choice](../../img/app_bool_choice_dark.png#dark-mode-only)

* Conditional String Field: A string field presented only if the boolean field was checked:

   ```
   {
      name: string_field
      title: A String
      info: "Select a sting to be passed to the application"
      type: string
      placeholder: "a string..."
      conditional: {
          entries: [
              {
                  name: boolean_field
                  value: True
              }
          ]
      }
      target {
          field: hyperparams
          section: General
          name: a_string
      }
   }
   ```
   
   This will look like this:

   ![Conditional string field](../../img/app_cond_str.png#light-mode-only)
   ![Conditional string field](../../img/app_cond_str_dark.png#dark-mode-only)

* Project Selection: Choices field for a projects selection, containing all projects whose names does not begin with `example`:

   ```
   {
      name: a_project_field
      title: Choose a Project
      info: "The app will count the tasks in this project"
      type: dropdown
      required: true
      autocomplete: true
      choices {
          source: project
          value_field: id
          display_field: name
          filter {
              fields {
                 name: "^(?i)(?!example).*$"
              }
          }
      }
      target {
          field: hyperparams
          section: General
          name: a_project_id
      }
   }
   ```

   This will look like this:

   ![Project selection](../../img/app_proj_selection.png#light-mode-only)
   ![Project selection](../../img/app_proj_selection_dark.png#dark-mode-only)

* Group: Group with single field option:

   ```
   {
      type: group
      name: more_options_group
      title: More options
      collapsible: true
      item_template: [
          {
              name: a_text_field
              title: Some Text
              info: "Contains some text"
              type: multiline_text
              required: false
              target: {
                  field: configuration
                  name: text_blob
              }
          }
      ]
   }
   ```

   This will look like this:

   ![Group with single field](../../img/app_group.png#light-mode-only)
   ![Group with single field](../../img/app_group_dark.png#dark-mode-only)


### Dashboard
The Dashboard section of the configuration file describes the fields that will appear in the instance's dashboard display. 
The dashboard elements are organized into lines.

The section contains the following information:
* `lines` - The array of line elements, each containing:
  * `style` - CSS definitions for the line e.g setting the line height
  * `contents` - An array of dashboard elements to display in a given line. Each element may have several fields:
    * `title` - Text to display at the top of the field
    * `type` - one of the following:
      * scalar-histogram
      * plot
      * debug-images
      * log
      * scalar
      * hyperparameter
      * configuration
      * html
    * `text` - For HTML. You can refer to task elements such as hyper-parameters by using  `${hyperparams.<section>.<parameter name>.value}`
    * `metric` - For plot, scalar-histogram, debug-images, scalar - Name of the metric
    * `variant` - For plot, scalar-histogram, debug-images, scalar - List of variants to display
    * `key` - For histograms, one of the following: `iter`, `timestamp` or, `iso_time`
    * `hide_legend` - Whether to hide the legend

#### Example
The example is based on the `simple-app` application `Dashboard` section:
* Dashboard Section 

   ```
   dashboard {
    lines: [
     …
    ]
   }
   ```

* Html Elements: Header with two HTML elements based on the user's input:

   ```
   {
      style {
          height: "initial"
      }
      contents: [
          {
              title: "HTML box with the string selected by the user"
              type: html
              text: "<h2>The string is ${hyperparams.General.a_string.value}</h2>"
          },
          {
              title: "HTML box with the count of tasks"
              type: html
              text: "<h2>Project ${hyperparams.General.project_name.value} contains ${hyperparams.General.tasks_count.value} tasks</h2>"
          }
      ]
   }
   ```

   This will look like this:

   ![HTML elements](../../img/app_html_elements.png#light-mode-only)
   ![HTML elements](../../img/app_html_elements_dark.png#dark-mode-only)

* Plot

   ```
   {
      contents: [
          {
              title: "A random plot"
              type: plot
              metric: "Plots"
              variant: "plot"
          }
      ]
   }
   ```

   This will look like this:

   ![Plot](../../img/app_plot.png#light-mode-only)
   ![Plot](../../img/app_plot_dark.png#dark-mode-only)

* Log

   ```
   {
      contents: [
          {
              title: "Logs"
              type: log
          }
      ]
   }
   ```
  
   This will look like this:

   ![Log](../../img/app_log.png#light-mode-only)
   ![Log](../../img/app_log_dark.png#dark-mode-only)

### Assets
Assets are optional elements used by the application configuration, to allow customization of the application display in 
the ClearML web UI. They typically contain icons, empty-state HTML, and any other object required. Assets are stored in 
a directory called `assets`.

To access assets from the application configuration file, use `${ASSET:<asset file name>}`. For example:
```
icon: "${ASSET:app-simple-app@2x.png}"
```

### Python Code
The code of the task that handles the application logic must be stored in a Git repository.
It is referenced by the script entry in the configuration file. For example:

```
script {
   repository: "https://bitbucket.org/seematics/clearml_apps.git"
   entry_point: "main.py"
   working_dir: "demo_apps/simple-app"
   branch: "master"
}
```

The task is run by a [Custom Applications Agent](#custom-apps-agent) within a Docker. Any packages used should be 
described in a `requirements.txt` file in the working directory.

The task can read input from configuration and from the `hyperparams` section, as defined in the configuration file of 
the application, and it's the task's responsibility to update any element displayed in the dashboard.

## Deploying Custom Applications
### Custom Apps Agent
Custom applications require a separate agent then the ClearML built-in applications since their code is downloaded from 
a different Git repository.

To define a custom-apps agent, add the following to the `docker-compose.yml` or to the `docker-compose.override.yml`:
* In the `apiserver` service section, add the following lines in the environment to create a user for handling the custom-apps:
  ```
  - CLEARML__secure__credentials__custom_apps_agent__user_key="${CUSTOM_APPS_AGENT_USER_KEY}"
  - CLEARML__secure__credentials__custom_apps_agent__user_secret="${CUSTOM_APPS_AGENT_USER_SECRET}"
  - CLEARML__secure__credentials__custom_apps_agent__role="admin"
  ```

* Add the custom-apps-agent service:

  ```custom-apps-agent:
  container_name: custom-apps-agent
  image: ${APPS_DAEMON_DOCKER_IMAGE}
  restart: unless-stopped
  privileged: true
  environment:
    - CLEARML_API_HOST=https://app.${SERVER_URL}/api
    - CLEARML_FILES_HOST=https://files.${SERVER_URL}
    - CLEARML_WEB_HOST=https://app.${SERVER_URL}
    - CLEARML_API_ACCESS_KEY=${CUSTOM_APPS_AGENT_USER_KEY}
    - CLEARML_API_SECRET_KEY=${CUSTOM_APPS_AGENT_USER_SECRET}
    - CLEARML_AGENT_GIT_USER=${CUSTOM_APPS_AGENT_GIT_USER}
    - CLEARML_AGENT_GIT_PASS=${CUSTOM_APPS_AGENT_GIT_PASSWORD}
    - CLEARML_AGENT_DEFAULT_BASE_DOCKER=${APPS_WORKER_DOCKER_IMAGE}
    - CLEARML_WORKER_ID=custom-apps-agent
    - CLEARML_NO_DEFAULT_SERVER=true
    - CLEARML_AGENT_DOCKER_HOST_MOUNT=/opt/allegro/data/agent/custom-app-agent:/root/.clearml
    - CLEARML_AGENT_DAEMON_OPTIONS=--foreground --create-queue --use-owner-token --child-report-tags application --services-mode=${APPS_AGENT_INSTANCES:?err}
    - CLEARML_AGENT_QUEUES=custom_apps_queue
    - CLEARML_AGENT_NO_UPDATE: 1
    - CLEARML_AGENT_SKIP_PIP_VENV_INSTALL=/root/venv/bin/python3
    # Disable Vault so that the apps will be downloaded with git credentials provided above, and not take any user's git credentials from the Vault.
    - CLEARML_AGENT_EXTRA_DOCKER_ARGS=-e CLEARML_AGENT_DISABLE_VAULT_SUPPORT=1
    - CLEARML_AGENT_SERVICES_DOCKER_RESTART=on-failure;application.resumable=True
    - CLEARML_AGENT_DISABLE_SSH_MOUNT=1
    - CLEARML_AGENT__AGENT__DOCKER_CONTAINER_NAME_FORMAT="custom-app-{task_id}-{rand_string:.8}"
    - CLEARML_AGENT_EXTRA_DOCKER_LABELS="allegro-type=application subtype=custom"
  labels:
    ai.allegro.devops.allegro-software-type: "custom-apps-agent"
  networks:
    - backend
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - /opt/allegro/data/agent/custom-app-agent:/root/.clearml
    - /opt/allegro/data/agent/custom-app-agent-v2/tmp:/tmp
  depends_on:
    - apiserver
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
  ```
  
  * Make sure to define the following variables in the `constants.env` or `runtime_created.env` configuration files:
    * `CUSTOM_APPS_AGENT_USER_KEY` - A unique key for the user - any random string can be used
    * `CUSTOM_APPS_AGENT_USER_SECRET` - A unique secret for the user - random UUID
    * `CUSTOM_APPS_AGENT_GIT_USER` - The user for the Git repository
    * `CUSTOM_APPS_AGENT_GIT_PASSWORD` - The password/app-password/token for the Git repository
    
### Deploying Apps
#### Packaging an App
Create a zip file with the configuration, and with the assets, if applicable.

```
zip -r simple-app.zip simple-app.app.conf assets/
```

#### Installing an App
Run the `upload_apps.py` script to upload the applications. You will need to provide credentials for an admin user in the system

```
upload_apps.py --host <apiserver url> --user <admin_user_key> --password <admin_user_secret> --files simple-app.zip
```

* `<apiserver url>` can be something like `https://api.my-server.allegro.ai` or `http://localhost:8008` if running on the server.
* `--user` and `--password` are key/secret credentials of any ClearML admin user. These can be generated in the ClearML web UI.

#### Removing an App
Applications can be uninstalled by running the `manage_apps.py` script as follows:

```
manage_apps.py delete --host <apiserver url> --user <admin_user_key> --password <admin_user_secret>  -app <application id>
```
