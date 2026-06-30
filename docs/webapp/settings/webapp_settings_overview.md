---
title: Settings Page
---

Use the **Settings** page to manage your personal ClearML account and workspace settings.

To navigate to the **Settings** page, click the <img src="/docs/latest/icons/ico-me.svg" alt="Profile button" className="icon size-lg space-sm" /> 
button in the top right corner of the web UI screen, then click **Settings**. 

The contents of the Settings page vary by offering:
* Enterprise Server - The Settings page contains personal settings only. Administrator settings are managed separately 
  from the AI Admin view. See [Administrator Settings](../admin_settings.md).
* Hosted Service (Free/Pro) - The Settings page contains both personal settings and [Administrator Settings](../admin_settings.md).
* Open Source Server - The Settings page contains all available settings.

The Settings page consists of the following sections:

* User Settings
  * [Profile](webapp_settings_profile.md#profile) - Your basic user information
  * [Configuration](webapp_settings_profile.md#configuration) - Control general system behavior settings and input storage access credentials
  * [Workspace](webapp_settings_profile.md#workspace)  
      * [ClearML credentials](webapp_settings_profile.md#clearml-api-credentials) - Create client credentials for ClearML and ClearML Agent to use 
      * [Configuration vault](webapp_settings_profile.md#configuration-vault) (ClearML Enterprise Server) - Define global ClearML client settings
        that are applied to all ClearML and ClearML Agent instances (which use the workspace's access 
        credentials)
  * [Storage Cleanup](webapp_settings_storage_credentials.md) (Open Source Server) - Configure storage provider access 
    credentials to enable ClearML to delete artifacts stored in cloud storage when tasks and models 
    are deleted. In the ClearML Hosted and Enterprise plans, Storage Cleanup is managed under Administrator Settings.
* [Administrator Settings](../admin_settings.md) (ClearML Hosted and Enterprise Servers) - Administrative configuration 
  for your ClearML workspace.

  :::note[Administrator Settings]
  Under the ClearML Enterprise plan [role-based UI](../role_based_ui.md), administrator settings are
  managed from the **Settings** sidebar item in the AI Admin view, not from this page. See
  [Administrator Settings](../admin_settings.md).
  :::
