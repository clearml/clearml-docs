---
title: Resource Policies
---

:::important ENTERPRISE FEATURE
Resource Policies are available under the ClearML Enterprise plan.
::: 


Resource policies let administrators define user group resource quotas and reservations to enable workload prioritization 
across available resources. 

Administrators make the allocated resources available to users through designated execution queues, each matching a 
specific resource consumption profile (i.e. the amount of resources allocated to jobs run through the queue).

Workspace administrators can use the resource policy manager to create, modify or delete resource policies:
Set resource reservation and limits for user groups

* Connect resource profiles to a policy, making them available to its user group via ClearML queues
* Non-administrator users can see the resource policies currently applied to them.

![Resource Policy dashboard](../img/resource_policies_dashboard.png#light-mode-only)
![Resource Policy dashboard](../img/resource_policies_dashboard_dark.png#dark-mode-only)

## Create a Policy

**To create a policy:**
1. Click `+` 
1. In the **Create Resource Policy** modal, fill in the following:
   * Name - Resource policy name. This name will appear on the Policies list
   * Reservation - The number of resources guaranteed to be available for the policy’s users 
   * Limit -  The maximum amount of resources that jobs run through this policy’s queues can concurrently use. 
   * User Group - The [User groups](settings/webapp_settings_users.md#user-groups) to which the policy applies 
   * Description - Optional free form text for additional descriptive information
1. Click **Add**

Once the policy is defined, you can connect profiles to it (Resource profiles are defined in the [Resource Configuration](settings/webapp_settings_resource_configs.md) 
settings page, available to administrators). Resource profiles serve as an interface for resource policies to provide 
users with access to the available resource pools based on their job resource requirements (i.e. a job running through a 
profile is allocated the profile’s defined amount of resources). 

**To connect a resource profile to a policy:**
1. In the policy’s details panel, click **Edit**
1. Click **Connect Profile**
1. In the **Connect Profile** modal, input the following information:
    * Queue name - The name for the ClearML queue the policy’s users will use to enqueue jobs using this resource 
    profile. Jobs enqueued to this queue will be allocated the number of resources defined for its profile
    * Profile - select the resource profile. 
1. Click **Connect**

:::note Available Profiles
Only profiles that are part of the currently provisioned [resource configuration](settings/webapp_settings_resource_configs.md) 
are available for selection (Profiles that are part of a configuration that has been saved but not yet provisioned 
will not appear in the list).

Profiles whose resource requirement exceeds the policy's resource limit will appear in the list but are not available 
for selection.
:::

## Policy Details 
The policy details panel displays: 
* Policy quota and reservation
* Resource profiles associated with the policy
* Queues the policy makes available
* Number of current jobs in each profile (pending or running) 

The top card displays the policy information:
* Policy name
* Current usage - The number of resources currently in use (i.e. by currently running jobs)
* Reserved resources
* Resource limit
* User group that the policy applies to - click to show list of users in the group

![Resource policy card](../img/resource_policies_policy_card.png#light-mode-only)
![Resource policy card](../img/resource_policies_policy_card_dark.png#dark-mode-only)

The cards below the policy card display the profiles that are connected to the policy:
* Resource profile name
* <img src="/docs/latest/icons/ico-resource-number.svg" alt="Number of resources" className="icon size-md space-sm" /> - Number
of resources consumed by each job enqueued through this profile's queue
* <img src="/docs/latest/icons/ico-queued-jobs.svg" alt="Queued jobs" className="icon size-md space-sm" /> - Currently queued jobs
* <img src="/docs/latest/icons/ico-running-jobs.svg" alt="Running jobs" className="icon size-md space-sm" /> - Currently running jobs 

![Resource profile card non-admin view](../img/resource_policies_profile_card_non_admin.png#light-mode-only)
![Resource profile card non-admin view](../img/resource_policies_profile_card_non_admin_dark.png#dark-mode-only)

Administrators can also see each resource profile’s resource pool links listed in order of routing priority.

![Resource profile card admin view](../img/resource_policies_profile_card_admin.png#light-mode-only)
![Resource profile card admin view](../img/resource_policies_profile_card_admin_dark.png#dark-mode-only)

The arrow connecting the policy card with a profile card is labeled with the name of the queue the policy’s users should 
use to run tasks through that resource profile.

## Modify Policy

To modify a resource policy, click **Edit** to open the details panel in editor mode.

### To Modify Policy Parameters

1. On the resource policy card, click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> **> Edit**
1. In the Edit Resource Policy modal, you can modify the policy’s name, number of reserved resources, resource limit, 
and description
1. Click **Save**

### To Add a Resource Profile to a Policy
1. Click **Connect Profile**
1. In the **Connect Profile** modal, input the following information:
    * Queue name - The name for the ClearML queue the policy’s users will use to enqueue jobs using this resource 
    profile. Jobs enqueued to this queue will be allocated the number of resources defined for its profile
    * Profile - select the resource profile. Note that you will only be able to connect profiles that have not already 
    been connected to the policy 
1. Click **Connect**

### To Remove a Resource Profile

**To remove a resource profile:** On the relevant resource profile box, click `X`.

![Remove resource profile](../img/resource_policies_remove_profile.png#light-mode-only)
![Remove resource profile](../img/resource_policies_remove_profile_dark.png#dark-mode-only)

Removing a profile from a policy will also delete the queue which made this profile available to the policy’s users. 
Any tasks enqueued on this queue will be set to `draft` status.

Click **Exit** to close editor mode

## Delete Policy

**To delete a resource policy**
1. Click **Edit** to open the details panel in editor mode
1. On the resource policy box, click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> 
2. Click **Delete**

Deleting a policy also deletes its queues (i.e. the queues to access the resource profiles). Additionally, any pending 
tasks will be dequeued. 