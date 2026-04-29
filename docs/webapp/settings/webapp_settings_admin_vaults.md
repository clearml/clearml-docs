---
title: Administrator Vaults
---

:::important[Enterprise Feature]
Administrator vaults are available under the ClearML Enterprise plan.
:::

Administrators can define multiple [configuration vaults](webapp_settings_profile.md#configuration-vault) which will each be applied to designated 
[user groups](webapp_settings_users.md). There are three types of vaults: 
* [Client configuration (Agent/SDK/CLI)](#client-configuration-agentsdkcli)
* [UI storage credentials](#ui-storage-credentials)   
* [SSH server](#ssh-server)

To apply its contents, a vault should be enabled in the [Administrator Vault Table](#administrator-vault-table). 

## Client Configuration (Agent/SDK/CLI)
Client configuration vaults extend and/or override entries in the local ClearML [configuration file](../../configs/clearml_conf.md)
where a task is executed. Vault values will be applied to tasks run by members of the designated user groups. 

New entries will extend the configuration in the local ClearML [configuration file](../../configs/clearml_conf.md). 
Most existing configuration file entries will be overridden by the vault values.

:::note 
The following configuration values are machine and/or agent specific, so they can't be set in a configuration vault:
* `agent.cuda_version`
* `agent.cudnn_version`
* `agent.default_python`
* `agent.worker_id` 
* `agent.worker_name`
* `agent.debug`
:::

**To create a Client configuration vault:**
1. Click **+ Add Vault**
1. Fill in vault details:
   1. Vault name - Name that appears in the Administrator Vaults table
   1. User Group - Specify the User Group that the vault affects
   1. Target - Vault type. Select `Client (Agent/SDK/UI)`
   1. Format - Specify the configuration format: HOCON / JSON / YAML. 
   1. Fill in the configuration values (click <img src="/docs/latest/icons/ico-info.svg" alt="Info" className="icon size-md space-sm" /> 
   to view configuration file reference). To import an existing configuration file, click <img src="/docs/latest/icons/ico-import.svg" alt="Import" className="icon size-md space-sm" />. 
1. Click **Save** 

## UI Storage Credentials   
UI storage credential vaults configure UI access to cloud storage credentials for a designated group of users. 

**To create a vault:**

1. Click **+ Add Vault**
1. Fill in vault details:
   1. Vault name - Name that appears in the Administrator Vaults table
   1. User Group - Specify the User Group that the vault affects
   1. Target - Vault type. Select `UI storage credentials` 
   1. \+ Add access keys - Enter storage credentials (see [Browser Cloud Storage Access](webapp_settings_profile.md#browser-cloud-storage-access))
1. Click **Save**

## SSH Server
SSH Server Vaults configure SSH keys for SSH sessions spun up through the [SSH Session application](../applications/apps_ssh_session.md) 
or [ClearML Session](../../apps/clearml_session.md) by users in the user groups assigned to the vaults. 

* The private keys (`ssh_host_*_key`) are stored in the vault.
* The corresponding public keys (`ssh_host_*_key__pub`) are installed on the SSH server to allow clients to verify the 
  server’s identity.

**To create an SSH server vault:**
1. Click + Add Vault
1. Fill in vault details:
   * Vault name - Name that appears in the Administrator Vaults table
   * User Group - Specify the User Group that the vault affects
   * Target - Vault type. Select `SSH Server`
   * Add SSH keys. For example: <br/><br/>
    ```
    {
      "ssh_host_ecdsa_key": "-----BEGIN EC PRIVATE KEY----- …. -----END EC PRIVATE KEY-----\n",
      "ssh_host_ed25519_key": "-----BEGIN OPENSSH PRIVATE KEY----- …. -----END OPENSSH PRIVATE KEY-----\n",
      "ssh_host_rsa_key": "-----BEGIN RSA PRIVATE KEY----- … -----END RSA PRIVATE KEY-----\n",
      "ssh_host_rsa_key__pub": "ssh-rsa …",
      "ssh_host_ecdsa_key__pub": "ecdsa-sha2-nistp256 …",
      "ssh_host_ed25519_key__pub": "ssh-ed25519 …"
    }
    ```
1. Click Save

## Administrator Vault Table

The **Administrator Vaults** table lists all currently defined vaults, and the following details:
* Active - Toggle to enable / disable the vault
* Name - Vault name
* Target - Type of vault: `Client (Agent/SDK/CLI)`, `UI storage credentials`, or `SSH server` 
* Group - User groups to apply this vault to 
* ID - Vault ID (click to copy)
* Vault Content - Vault content summary
* Update - Last update time

Hover over a vault in the table and click <img src="/docs/latest/icons/ico-dots-v-menu.svg" alt="Dot menu" className="icon size-md space-sm" />
to access vault actions:
* Download
* Edit
* Delete
* View log - View a history of vault activity: vault action (e.g. activate, deactivate, edit, etc.), acting user, and action time.  

![Admin vaults](../../img/settings_admin_vaults.png#light-mode-only)
![Admin vaults](../../img/settings_admin_vaults_dark.png#dark-mode-only)

## Activity Log 

The activity log displays a detailed history of activity across all admin vaults:
* Vault name
* Action: Operation performed on the vault
  * Create / Delete
  * Activate / Deactivate
  * Edit 
* Action time
* User who performed the action.

Use the column filters <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" /> to 
filter the log by vault name, action, time range, or acting user.

![Admin vaults](../../img/settings_admin_vaults_log.png#light-mode-only)
![Admin vaults](../../img/settings_admin_vaults_log_dark.png#dark-mode-only)

