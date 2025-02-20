---
title: Access Rules
---

:::important Enterprise Feature 
This feature is available under the ClearML Enterprise plan.
:::

Workspace administrators can use the **Access Rules** page to manage workspace permissions, by specifying which users,
service accounts, and/or user groups have access permissions to the following workspace resources:
 
* [Projects](../../fundamentals/projects.md)
* [Tasks](../../fundamentals/task.md) 
* [Models](../../fundamentals/models.md)
* [Dataviews](../../hyperdatasets/dataviews.md) 
* [Datasets](../../hyperdatasets/dataset.md)
* [Queues](../../fundamentals/agents_and_queues.md#what-is-a-queue) 

By default, all users have **READ & MODIFY** access to all resources.

## Creating Access Rules
Access privileges can be viewed, defined, and edited in the **Access Rules** table. 

1. Click **+ ADD RULES** to access the rule creation dialog
1. Select the resource to grant privileges to. To select a specific resource object (e.g. a 
   specific project or task), click the input box, and select the object from the list that appears. Filter the 
   list by typing part of the desired object name
1. Select the permission type - **Read Only** or **Read & Modify**
1. Assign users, [service accounts](webapp_settings_users.md#service-accounts), and/or [user groups](webapp_settings_users.md#user-groups) 
   to be given access. Click the 
   desired input box, and select the users / service accounts / groups from the list that appears. Filter the list by 
   typing part of the desired object name. To revoke 
   access, hover over a user's, service account's, or group's row and click the <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" /> 
   button
1. Click **SAVE**

<div class="max-w-50">

![Access rule creation dialog](../../img/settings_access_rules.png#light-mode-only)
![Access rule creation dialog](../../img/settings_access_rules_dark.png#dark-mode-only)

</div> 

Access is inherited according to resource hierarchy. For example, if a user is given access to a project, the user will 
also have access to the project's contents (tasks, models, etc.). A user who is granted access to a specific task will 
not have access to another task in the project, unless explicitly granted.  

## Editing Access Rules
1. Hover over the access rule's row on the table
1. Click the <img src="/docs/latest/icons/ico-edit.svg" alt="Edit Pencil" className="icon size-md" /> button
1. Change the resource, resource object, and permission type as desired
1. Edit access rule users / service accounts / groups (see details [here](#creating-access-rules))
1. Click **SAVE**

## Deleting Access Rules
1. Hover over the access rule's row on the **Access Rules** table
1. Click the <img src="/docs/latest/icons/ico-trash.svg" alt="Trash can" className="icon size-md" /> button

All users, service accounts, and user groups who had been assigned to the deleted access rule, will lose the access privileges granted by
that rule (unless otherwise provided by a different rule).

## Filtering Access Rules Table

The access rules table can be filtered by resource type and by target resource and users / groups. 
* **To filter by resource**, click the **View** dropdown menu and select the desired resource
* **To filter by target resource or users / groups / service accounts**, click <img src="/docs/latest/icons/ico-filter-off.svg" alt="Filter" className="icon size-md" />
on the respective column and select the users / groups / service accounts to view from the list that appears. 
