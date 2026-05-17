---
title: Application Launch Form Customization
slug: app_launch_form_custom
---

:::important[Enterprise Feature]
Applications are available under the ClearML Enterprise plan.
:::

An application instance’s launch form is defined in its [configuration file](app_custom.md).
ClearML supports modifying some of the form's properties without the need to re-package and deploy the application 
through a server configuration file. These overrides include:
* Available dropdown options
* Parameter default values
* Field hints, placeholders, and labels displayed in the application launch form


## Configuration
The launch form overrides are defined in the `services/applications.conf` server configuration file under the `app_wizard_overrides` section.
Each entry follows the format:

```
app_wizard_overrides {
   "<app-id>" {
      "<configuration–parameter>" {
         "<property_1>": "<value>"
         "<property_2>": ["<value_a>", "<value_b>", "<value_c>"]
      }
   }
}
```

* `app-id` - Application ID
* `configuration-parameter` - The application configuration file parameter identifier.
* `property` - The property to override (`options`, `default`, `placeholder`, `hint`, or `info`). See [below](#supported-properties) for more information. 
* `value` - The replacement value for that property.

Refer to the configuration file of a specific application to view the property IDs for use when overriding. 

The `app-id`, configuration-parameter, and property names for a specific app are the same ones used in the `wizard` 
section of its configuration file.

:::important[Kubernetes]
In Kubernetes deployments, the `applications.conf` file needs to be mounted into the ClearML server pod so that the 
`app_wizard_overrides` take effect.  Use the Helm chart `fileMounts` to do this. For example:

```yaml
apiserver:
  fileMounts:
    - name: "applications.conf"
      folderPath: "/etc/opt/seematics/services"
      fileContent: |-
        app_wizard_overrides {
          "jupyter-lab" {
            "container" {
              "default": "python:3.11"
              "options": ["python:3.12", "python:3.11", "python:3.8"]
            }
          }
        }
```
This mounts the configuration file into the expected path inside the server container. After updating the values file, 
upgrade the Helm release for the changes to take effect.
:::


:::tip[Live configuration reference]
Admins can get the required field names for a specific application through a built-in reference in the app’s UI form as follows: 
* Click the `+` to open the app instance launch form
* In the form enable `Show Form Spec` (the application ID is available in the information tooltip for this UI control). 

Hover over <img src="/docs/latest/icons/ico-settings.svg" alt="Setting Gear" className="icon size-md" /> next to a field 
to view the name of that field in the application specification file.
:::

### Supported Properties

* `options` - Accepts an array of strings or mappings in the format of `{"label": "<option label>", "value": "<option value>"}`
  * Strings - Use the same value for both label and stored value. For example:

    ```
    app_wizard_overrides {
       "jupyter-lab" {
         "container" {
           "default": "python:3.11"
           "options": ["python:3.12", "python:3.11", "python:3.8"]
         }
       }
     }
    ```	

  * Objects - Define separate display labels and stored values. For example:

    ```
    app_wizard_overrides {
       "jupyter-lab" {
          "container" {
             "default": "python:3.11"
             "options": [
                {"label": "Python 3.12 Official Image", "value": "python:3.12"},
                {"label": "Python 3.11 Official Image", "value": "python:3.11"},
                {"label": "Python 3.8 Official Image", "value": "python:3.8"}
             ]
          }
       }
    }
    ```

* `default` - Sets the initial value applied to the property when the form is presented to the user.
* `placeholder` - Text displayed inside an input field when it does not contain any value, usually used to suggest the expected format or type of input. 
* `hint` -  A short informative message displayed below the input field to provide additional instructions to the user.
* `info` - Text that appears in a property's tooltip.