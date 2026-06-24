---
title: Administrator Settings
---


**Administrator Settings** contains the administrative configuration for your ClearML workspace.

:::note
Personal settings (profile, configuration, and workspace credentials) are accessed from the user menu. See 
[Settings](settings/webapp_settings_profile.md).
:::

## Enterprise 

In the Enterprise UI, **Administrator Settings** is a sidebar item in the [AI Admin view](role_based_ui.md#ai-admin).

The admin settings page includes the following sections:
* [Administrator Vaults](settings/webapp_settings_admin_vaults.md) - Manage user-group level configuration vaults to apply ClearML client settings to all 
  members of the user groups 
* [Users & Groups](settings/webapp_settings_users.md) - Manage the users that have access to the
  tenant.
* [Access Rules](settings/webapp_settings_access_rules.md) - Manage per-resource access privileges 
* [Identity Providers](settings/webapp_settings_id_providers.md) - Manage server identity providers 
* [Resource Configuration](settings/webapp_settings_resource_configs.md) - Define the available resources and the way in which they will be allocated to 
  different workloads 
* [Application Gateway](settings/webapp_settings_app_gw.md) - Monitor all active application gateways, and verify gateway functionality
* [Storage Volumes](settings/webapp_settings_storage_volumes.md) - Define and manage storage configurations that can be assigned to projects
* [Storage Cleanup](settings/webapp_settings_storage_credentials.md) - Configure storage provider access credentials to enable ClearML to delete artifacts stored in 
  cloud storage when tasks and
  models are deleted.
* [UI Customization](settings/webapp_settings_ui_customization.md) - Configure default naming templates for cloned tasks and new Hyper-Dataset versions

## Hosted Service (Free/Pro)

In the hosted service, administrator settings are part of the main **Settings** page alongside 
personal settings.

To access **Administrator Settings**, click the <img src="/docs/latest/icons/ico-me.svg" alt="Profile button" className="icon size-lg space-sm" /> 
button in the top right corner of the web UI screen, then click **Settings**. 

The Admin Settings include the following sections:
* [Users](settings/webapp_settings_users.md) - Manage the users that have access to the workspace.
* [Billing & Usage](settings/webapp_settings_usage_billing.md) - View current billing details and usage information
* [Storage Cleanup](settings/webapp_settings_storage_credentials.md) - Configure storage provider
  access credentials to enable ClearML to delete artifacts stored in cloud storage when tasks and
  models are deleted.

## Open Source 

In the open source server, all users have administrator privileges, so there is no separate 
**Administrator Settings** page. All available settings are accessible from the main **Settings** page. See 
[Settings](settings/webapp_settings_profile.md).