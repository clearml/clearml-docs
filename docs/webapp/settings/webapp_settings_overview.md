---
title: Settings Page
---

Use the **Settings** page to manage your ClearML account and configure your workspace settings.

To navigate to the Settings page, click the <img src="/docs/latest/icons/ico-me.svg" alt="Profile button" className="icon size-lg space-sm" /> 
button in the top right corner of the web UI screen, then click **Settings**. 

The Settings page consists of the following sections:
* [User Settings](webapp_settings_profile.md):
  * [Profile](webapp_settings_profile.md#profile) - You basic user information
  * [Configuration](webapp_settings_profile.md#configuration) - Control general system behavior settings and input storage access credentials
  * [Workspace](webapp_settings_profile.md#workspace)  
      * [ClearML credentials](webapp_settings_profile.md#clearml-credentials) - Create client credentials for ClearML and ClearML Agent to use 
      * [Configuration vault](webapp_settings_profile.md#configuration-vault) (ClearML Enterprise Server) - Define global ClearML client settings
        that are applied to all ClearML and ClearML Agent instances (which use the workspace's access 
        credentials)
* Administrator Settings:
  * [Administrator Vaults](webapp_settings_admin_vaults.md) (ClearML Enterprise Server) - Manage user-group level configuration 
    vaults to apply ClearML client settings to all members of the user groups
  * [Users & Groups](webapp_settings_users.md) - Manage the users that have access to a workspace
  * [Access Rules](webapp_settings_access_rules.md) (ClearML Enterprise Server) - Manage per-resource access privileges 
  * [Identity Providers](webapp_settings_id_providers.md) (ClearML Enterprise Server) - Manage server identity providers
  * [Resource Configuration](webapp_settings_resource_configs.md) (ClearML Enterprise Server) - Define the available resources and the way in which they 
  will be allocated to different workloads 
  * [Billing & Usage](webapp_settings_usage_billing.md) (ClearML Hosted Service) - View current billing details and usage information 
  * [Storage Cleanup](webapp_settings_storage_credentials.md) (ClearML Enterprise Server) - Configure storage provider access credentials to 
  enable ClearML to delete artifacts stored in cloud storage when tasks and models are deleted