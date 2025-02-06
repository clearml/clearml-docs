---
title: User Settings
---

In the **User Settings** section, manage your personal account details, configure system behavior, and set up 
credentials for ClearML services.

## Profile 
The profile tab presents user information.

**To edit the username:**
1. Hover over the username
1. Click <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" /> 
1. Change the name
1. Click <img src="/docs/latest/icons/ico-save.svg" alt="Check Mark" className="icon size-md" /> button

## Configuration
### Customizing UI Behavior

Under **USER PREFERENCES**, users can set a few web UI options:
* **Show Hidden Projects** - Show ClearML infrastructure projects alongside your own projects. Disabled by default. When 
enabled, these projects are labeled with <img src="/docs/latest/icons/ico-ghost.svg" alt="Hidden project" className="icon size-md space-sm" />.
* **Don't show ClearML examples** - Hide the preloaded ClearML example content (project, pipeline, dataset, etc.). 
* **Disable HiDPI browser scale override** - ClearML dynamically sets the browser scaling factor for an optimal page layout. 
Disable for default desktop scale. 
* **Don't show pro tips periodically** - Stop showing ClearML usage tips on login. Disabled by default.
* **Block running user's scripts in the browser** - Block any user and 3rd party scripts from running anywhere in the 
WebApp. Note that if enabled, the WebApp will not display debug samples, [Hyper-Dataset frame previews](../../hyperdatasets/previews.md), 
and embedded resources in [reports](../webapp_reports.md).
* **Hide specific container arguments** - Specify which Docker environment variable values should be hidden in logs. 
When printed, the variable values are replaced with `********`. By default, `CLEARML_API_SECRET_KEY`, `CLEARML_AGENT_GIT_PASS`,
`AWS_SECRET_ACCESS_KEY`, and `AZURE_STORAGE_KEY` values are redacted. To modify the hidden container argument list, click **Edit**.

:::info Self-hosted ClearML Server 
The self-hosted ClearML Server has an additional option to enable sharing anonymous telemetry data with the ClearML 
engineering team.
:::

### Browser Cloud Storage Access
Provide cloud storage access, so the browser will be able to display your cloud stored data, such as debug samples.

In the **Web App Cloud Access** section, enter the following credentials:
* **Bucket** - The name of a Cloud bucket.
* **Key** - The access key.
* **Secret / SAS** - The secret key or shared access signature if required.
* **Token** - For S3 services, session key for temporary credentials (if applicable).
* **AWS Region** - The region for AWS S3.
* **Host (Endpoint)** - The host for non-AWS S3 servers.

## Workspace

### Multiple Workspaces

:::info ClearML Hosted Service Feature
Multiple workspaces is only available on the ClearML Hosted Service
:::

ClearML Hosted Service users can be members of multiple workspaces, which are listed under **WORKSPACE**. 

To switch to another workspace, click on the **SWITCH TO WORKSPACE** button next to the name of the workspace you want 
to switch to. 
 
![Workspace configuration page](../../img/settings_workspace_configuration.png#light-mode-only)
![Workspace configuration page](../../img/settings_workspace_configuration_dark.png#dark-mode-only)

### ClearML App Credentials

Generate ClearML credentials, made up of an access and secret key pair, and insert them into your [configuration file](../../configs/clearml_conf.md) 
or Jupyter Notebook to grant the ClearML SDK and the ClearML Agent API access to the server. 

You can create credentials for any workspace that you are a member of. 

**To create ClearML credentials:**

1. In **WORKSPACE**, expand the desired workspace's panel (self-deployed ClearML Server users have one workspace)

1. In **App Credentials**, click **+ Create new credentials**

1. In the dialog that pops up, you can input a label for the new credentials 

The dialog displays new credentials, formatted as a ready-to-copy configuration file section (including server configuration 
information).

<div class="max-w-75">

![ClearML credentials](../../img/settings_configuration_creation.png#light-mode-only)
![ClearML credentials](../../img/settings_configuration_creation_dark.png#dark-mode-only)

</div>

You can edit the labels of credentials in your own workspace, or credentials that you created in other workspaces.

**To edit the credentials label:** hover over the desired credentials, and click <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" /> 

You can revoke any credentials in your own workspace, or credentials that you created in other workspaces. Once revoked, 
these credentials cannot be recovered.

**To revoke ClearML credentials:** hover over the desired credentials, and click <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" />

### AI Application Gateway Tokens 

:::important Enterprise Feature
This feature is available under the ClearML Enterprise plan.
:::

The AI Application Gateway enables external access to ClearML tasks and applications. The gateway is configured with an 
endpoint or external address (ingress), accessible from outside ClearML.

Generate tokens providing API access to the AI Application Gateway endpoints:

1. Click **Generate a Token**
1. Under `Expiration`, enter the number of days the token should remain valid 
1. Click `Generate`, which creates a token and copies it to your clipboard 

### Changing Your Workspace Name
To change the name of your own workspace, click **Edit workspace name**  <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" /> 
(under App credentials) **>** modify the name **>** click <img src="/docs/latest/icons/ico-save.svg" alt="Check Mark" className="icon size-md" />. 

### Adding Users to Your Workspace

To invite a user to your workspace, in the **MEMBERS** section: 
1. Press the **INVITE USERS** button 
1. Input the email in the dialog that pops up
1. Click **ADD** 

A dialog box will appear with an invitation link to send to the invited users. Existing members will receive an in-app 
notification informing them that they can join your workspace. 

After inviting users, the page will redirect to the [Users & Groups](webapp_settings_users.md) section, where the
pending invitations are displayed. 

### Leaving a Workspace

You can leave any workspace you've previously joined (except your personal workspace).

When leaving a workspace, you lose access to its resources (tasks, models, etc.) and your previously created access 
credentials to that workspace are revoked. Tasks and associated artifacts that you logged to that workspace will remain 
in that workspace. You can rejoin the workspace only if you are re-invited.

**To leave a workspace:**

1. In **WORKSPACE**, expand the desired workspace's panel 
1. In **Members** **>** Click **LEAVE WORKSPACE**.


### Configuration Vault

:::info Enterprise Feature
This feature is available under the ClearML Enterprise plan.
:::

Use the configuration vault to store global ClearML configuration entries that can extend the ClearML [configuration file](../../configs/clearml_conf.md) 
of any ClearML Agents or the ClearML SDK running with your credentials. Productivity tip: Keep the vault disabled while 
you edit your configuration, and enable it when the configuration is ready.

Vault entries will extend the configuration in the ClearML [configuration file](../../configs/clearml_conf.md) if they don't
exist, and override values for those already present in the file.

Fill in values using any of ClearML supported configuration formats: HOCON / JSON / YAML.

**To edit vault contents:**
1. Click **EDIT** or double-click the vault box
1. Insert / edit the configurations in the vault 
1. Press **OK**

**To apply vault contents:**
* Click the toggle atop the vault to enable / disable the configurations
* Once enabled, the configurations will be merged to the configuration file during ClearML and ClearML Agent usage 

![Configuration vault](../../img/settings_configuration_vault.png#light-mode-only)
![Configuration vault](../../img/settings_configuration_vault_dark.png#dark-mode-only)
