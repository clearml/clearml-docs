---
title: Users & Groups  
---

ClearML Hosted Service users can add users to their workspace.

Additionally, administrators on the ClearML Enterprise plan can define [user groups](#user-groups) to control access 
privileges, and create [service accounts](#service-accounts) for automations. 

:::info Hosted Service Feature
Inviting new teammates is only available on the ClearML Hosted Service.
:::

## Users
The **USERS** table lists workspace members and shows whether the maximum number of members has been reached. 
Each row of the table includes: 
* Username 
* User status (`Active` or `Pending`) 
* If the user's invitation is pending, the date the user was added
* [User groups](#user-groups) (ClearML Enterprise feature)

Use the search bar <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-md" />
to find a specific user by their name, email, or user ID. 

![Users table](../../img/settings_user_table.png#light-mode-only)
![Users table](../../img/settings_user_table_dark.png#dark-mode-only)

### Inviting New Teammates

To invite a user to your workspace, press the **+ INVITE USER** button, and input the email in the dialog that pops up.
Once invited, the added users can immediately access your workspace. 

### Removing Teammates
To remove a user from a workspace:
1. Hover over the user's row on the table
1. Click the <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" /> button

Removed users lose access to your workspace's resources (tasks, models, etc.) and their existing access credentials are 
revoked. Tasks and associated artifacts logged to your workspace by a removed user will remain in your workspace. The 
user can only rejoin your workspace when you re-invite them. 

## Service Accounts

:::important Enterprise Feature
This feature is available under the ClearML Enterprise plan.
:::

Service accounts are ClearML users that provide services with access to the ClearML API, but not the 
UI. Administrators can create access credentials for service accounts to use them for different ClearML Agents, 
automations, and more. 

A service account has all the privileges of a normal user in ClearML, with the following limitations:
* Service accounts cannot be used to access the UI
* Service accounts can be used to facilitate running tasks under the identity of each task's owner ("Impersonation"). 
  * Used to run an agent using the command-line, this will allow you to specify the `--use-owner-token` option.
  * Used to run the ClearML Agent Helm Chart, this will allow you to specify `values.agentk8s.useOwnerToken: true` option.
  * Used to run an Autoscaler application, this will allow you to make use of the `Apply Task Owner Vault Configuration`
  option.

:::info Access Rules 
When [access controls](webapp_settings_access_rules.md) are provisioned, they apply to service accounts the same as for ClearML users.
Therefore, in order to use a service account to run an agent in daemon mode, the service account must have access to the 
queue the agent will service.
:::

The **SERVICE ACCOUNTS** table lists workspace service accounts. 
Each row of the table includes: 
* Name - Service account name 
* [User groups](#user-groups)
* User ID
* Credentials - Number of credentials currently available to the account
* Last active time

Use the search bar <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-md" /> 
to find a specific service account by its name or ID.

Hover over a service account in the table to **Edit** or **Delete** it.

![Service accounts](../../img/settings_service_accounts.png#light-mode-only)
![Service accounts](../../img/settings_service_accounts_dark.png#dark-mode-only)

### Creating a Service Account

To create a service account:
1. Click **+ ADD SERVICE ACCOUNT**
2. In the **ADD SERVICE ACCOUNT** modal input a name for the new account. Select `Allow impersonation` to allow the 
   service account to assume the identity of a task owner 
4. Click **Save**

:::info Impersonation 
Service accounts are members of the `Users` group, meaning they can access the resources available to all users. When 
impersonation is enabled, a task run by the service account (i.e. by an agent or autoscaler using the service accounts' 
credentials) is executed as if by the owner of the task, meaning it will have access to the task owner's configuration 
vaults and to the resources that the task owner has access to. Impersonating an admin user does not mean the task's code 
will have admin privileges.

In case impersonation is not enabled: 
* If you run an agent with `--use_owner_token` then the agent will fail. 
* If you run an agent without `--use_owner_token`, the task will run with the service account's access rules, so make 
  sure the account uses resources it has access to
:::

When a service account is created, an initial set of credentials is automatically generated. The dialog displays new 
credentials, formatted as a ready-to-copy configuration file section.

### Service Account Credentials 

To generate new credentials for a service account:
1. Hover over the account's row on the table
2. Click the <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" /> button, which
   opens the editing panel
3. Click **Create new credentials**

The dialog displays new credentials, formatted as a ready-to-copy configuration file section.

To revoke a set of credentials:
1. In the editing panel, hover of the relevant credential's row
2. Click the <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" /> button

### Service Account Configuration Vault
Use a service account’s configuration vault to store ClearML configuration entries that can extend the ClearML 
[configuration file](../../configs/clearml_conf.md) of any ClearML Agents or ClearML SDK running with the service account's 
credentials. 

Vault entries will extend the configuration in the ClearML [configuration file](../../configs/clearml_conf.md) if they 
don't yet exist, and override values for those already present in the file.

Fill in values using any of ClearML supported configuration formats: HOCON / JSON / YAML.

To edit vault contents:
1. Click on the relevant service account to open its details panel 
2. Click **EDIT** on the configuration vault 
3. Insert / edit the configurations in the vault
4. Press **OK**

To apply vault contents:
* Click the toggle atop the vault to enable / disable the configurations
* Once enabled, the configurations will be merged to the configuration file during ClearML and ClearML Agent usage

In addition to the service account-specific configuration vault, [administrator vaults](#administrator-vaults) can also 
be applied to service accounts. See all the vaults applied to the account in the **Applied administrator vaults** below 
the configuration vault.   

![Service Account Config Vault](../../img/settings_service_account_config_vault.png#light-mode-only)
![Service Account Config Vault](../../img/settings_service_account_config_vault_dark.png#dark-mode-only)

### Deleting Service Account
Deleting a service account will revoke its credentials, causing agents using the account's credentials to fail. 
Tasks and associated artifacts logged to your workspace by a service account will remain in your workspace.

To delete a service account:
1. Hover over the account's row on the table
1. Click the <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" /> button

## User Groups

:::important Enterprise Feature
This feature is available under the ClearML Enterprise plan, as part of the [Access Rules](webapp_settings_access_rules.md) 
feature.
:::

Administrators can define user groups, which can be used for access privilege management. Users can be assigned to 
multiple user groups.

The system includes three pre-configured groups that can't be removed: 
* `Users` - All users (including [service accounts](#service-accounts)). Can't be modified
* `Admins` - Have RW access to all resources (except queue modification), and can grant users / user groups access 
  permissions to workspace resources
* `Queue admins` - Can create / delete / rename queues

The user group table lists all the active user groups. Each row includes a group's name, description, member list, and ID. 
Use the search bar <img src="/docs/latest/icons/ico-search.svg" alt="Magnifying glass" className="icon size-md space-md" /> 
to find a specific user group by its name, description, or ID.

![User Management Page](../../img/settings_user_management_table.png#light-mode-only)
![User Management Page](../../img/settings_user_management_table_dark.png#dark-mode-only)

### Creating a User Group

**To create a user group**:
1. Click **+ ADD GROUP**
1. In the dialog, add a group name and description
1. Add members to the group. When clicking the input box, a list of workspace members appears, from which group members 
   can be selected. Filter the list by typing part of the username. To remove a member, hover over a user's row and click 
   the <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" /> button
1. Click **SAVE**

<div class="max-w-50">

![User group creation dialog](../../img/settings_user_group.png#light-mode-only)
![User group creation dialog](../../img/settings_user_group_dark.png#dark-mode-only)

</div>

### Editing a User Group

**To edit a user group**:
1. Hover over the user group's row on the table
1. Click the <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" /> button
1. Edit the group's name and/or description
1. Edit group members (see details [here](webapp_settings_users.md#creating-a-user-group))
1. Click **Save**

### Deleting a User Group

**To delete a user group**:
1. Hover over the user group's row on the table
1. Click the <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" /> button

When a user group is deleted, its members will lose the access privileges that had been granted to the group (unless 
otherwise provided individually or to another group they are members of). 
