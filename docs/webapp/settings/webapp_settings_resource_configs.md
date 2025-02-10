---
title: Resource Configuration
---

Administrators can define [Resource Policies](../resource_policies.md) to implement resource quotas and 
reservations for different user groups to prioritize workload usage across available resources. 

Under the **Resource Configuration** section, administrators define the available resources and the way in which they 
will be allocated to different workloads. 

![Resource configuration page](../../img/resource_configuration.png#light-mode-only)
![Resource configuration page](../../img/resource_configuration_dark.png#dark-mode-only)

The Resource Configuration settings page shows the [currently provisioned](#applying-resource-configuration) configuration: 
the defined resource pools, resource profiles, and the resource allocation architecture. 

## Resource Pools
A resource pool is an aggregation of resources available for use, such as a Kubernetes cluster or a GPU superpod. 
Administrators specify the total number of resources available in each pool. The resource policy manager ensures 
workload assignment up to the available number of resources.

Administrators control the execution priority within a pool across the resource profiles making use of it (e.g. if jobs 
of profile A and jobs of profile B currently need to run in a pool, allocate resources for profile A jobs first or vice 
versa).

The resource pool cards are displayed on the top of the Resource Configuration settings page. Each card displays the 
following information: 

<div class="max-w-50">

![Resource pool card](../../img/resource_configuration_pool_card.png#light-mode-only)
![Resource pool card](../../img/resource_configuration_pool_card_dark.png#dark-mode-only)

</div>

* Pool name
* Number of resources currently in use out of the total available resources
* Execution Priority - List of [linked profiles](#connecting-profiles-to-pools) in order of execution priority. 

## Resource Profiles 
Resource profiles represent the resource consumption requirements of jobs, such as the number of GPUs needed. They are 
the interface that administrators use to provide users with access to the available resource pools based on their job 
resource requirements via [Resource Policies](../resource_policies.md).

Administrators can control the resource pool allocation precedence within a profile (e.g. only run jobs on `pool B` if 
`pool A` cannot currently satisfy the profile's resource requirements).

Administrators can control the queuing priority within a profile across resource policies making use of it (e.g. if the 
R&D team and DevOps team both have pending jobs - run the R&D team's jobs first or vice versa).

The resource profile cards are displayed on the bottom of the Resource Configuration settings page. Each card displays 
the following information: 

<div class="max-w-50">

![Resource profile card](../../img/resource_configuration_profile_card.png#light-mode-only)

</div>

<div class="max-w-50">

![Resource profile card](../../img/resource_configuration_profile_card_dark.png#dark-mode-only)

</div>

* Profile name
* <img src="/docs/latest/icons/ico-resource-number.svg" alt="Number of resources" className="icon size-md space-sm" /> - Number
of resources allocated to jobs in this profile
* List of [pool links](#connecting-profiles-to-pools)
* <img src="/docs/latest/icons/ico-queued-jobs.svg" alt="Queued jobs" className="icon size-md space-sm" /> - Number of currently pending jobs
* <img src="/docs/latest/icons/ico-running-jobs.svg" alt="Running jobs" className="icon size-md space-sm" /> - Number of currently running jobs
* Number of resource policies. Click to open resource policy list and to order queuing priority.  

## Example Workflow

You have GPUs spread across a local H100 and additional bare metal servers, as well as on AWS (managed 
by an autoscaler). Assume that currently most of your resources are already assigned to jobs, and only 16 resources are available: 8 in the 
H100 resource pool and 8 in the Bare Metal pool:

![Example resource pools](../../img/resource_example_pools.png#light-mode-only)
![Example resource pools](../../img/resource_example_pools_dark.png#dark-mode-only)

Teams' jobs have varying resource requirements of 0.5, 2, 4, and 8 GPUs. Resource profiles are defined to reflect these:

![Example resource profiles](../../img/resource_example_profile.png#light-mode-only)
![Example resource profiles](../../img/resource_example_profile_dark.png#dark-mode-only)

The different jobs will be routed to different resource pools by connecting the profiles to the resource pools. Jobs 
enqueued through the profiles will be run in the pools where there are available resources in order of their priority. 
For example, the H100 pool will run jobs with the following precedence: 2 GPU jobs first, then 4 GPU ones, then 8 GPU, 
and lastly 0.5 GPU. 

![Example profile priority](../../img/resource_example_profile_priority.png#light-mode-only)
![Example profile priority](../../img/resource_example_profile_priority_dark.png#dark-mode-only)

Resource policies are implemented for two teams:
* Dev team
* Research Team 

Each team has a resource policy configured with 8 reserved resources and a 16 resource limit. Both teams make use of the
4xGPU profile (i.e. each job running through this profile requires 4 resources). 

![Example resource policy](../../img/resource_example_policy.png#light-mode-only)
![Example resource policy](../../img/resource_example_policy_dark.png#dark-mode-only)

The Dev team is prioritized over the Research team by placing it higher in the Resource Profile's Policies Priority list:

<div class="max-w-75">

![Example resource policy priority](../../img/resource_example_policy_priority.png#light-mode-only)
![Example resource policy priority](../../img/resource_example_policy_priority_dark.png#dark-mode-only)

</div>

Both the Dev team and the Research team enqueue four 4-resource jobs each: Dev team jobs will be allocated resources 
first. The `4xGPU` resource profile is connected to two resource pools: `Bare Metal Low END GPUs` (with the 
`4 GPU Low End` link) and `H100 Half a Superpod` (with the `4 GPU H100 link`). 

![Example resource profile-pool connections](../../img/resource_example_profile_pool_links.png#light-mode-only)
![Example resource profile-pool connections](../../img/resource_example_profile_pool_links_dark.png#dark-mode-only)

Resources are assigned from the `Bare Metal` pool first (precedence set on the resource profile card):

<div class="max-w-50">

![Example resource pool precedence](../../img/resource_example_pool_priority.png#light-mode-only)
![Example resource pool precedence](../../img/resource_example_pool_priority_dark.png#dark-mode-only)

</div>

If the first pool cannot currently satisfy the profile’s resource requirements, resources are assigned from the next 
listed pool. Let's look at the first pool in the image below. Notice that the pool has 8 available resources, therefore 
it can run two 4-resource jobs.

<div class="max-w-50">

![Example resource pool card](../../img/resource_example_pool_card.png#light-mode-only)
![Example resource pool card](../../img/resource_example_pool_card_dark.png#dark-mode-only)

</div>

Since the Bare Metal pool does not have any more available resources, additional jobs will be assigned resources from 
the next pool that the Resource Profile is connected to. The H100 pool has 8 available resources. There are still 2 jobs 
pending from the Dev team requiring 8 resources in total, and 4 jobs from the Research team requiring 16 resources in
total. In order to honor the Research team’s resource reservation, its first two jobs will be assigned the required 8
resources from the H100 pool.

All available resources having been assigned - 2 jobs of each team will remain pending until some of the currently 
running jobs finish and resources become available.

## Applying Resource Configuration 
Administrators can globally activate/deactivate resource policy management. To enable the currently provisioned 
configuration, click on the `Enable resource management` toggle. Enabling resource management will service the policy 
queues according to the provisioned resource profile and pool assignments. Disabling the resource management will stop 
serving the policy queues. Tasks on these queues will remain pending until resource policy management is reenabled.

Administrators can add, edit, delete, and connect resource pools and profiles in the Resource Configuration settings 
page.

To make any change (create, delete, or modify a component) to the resource configuration, follow the following steps:
1. Click **Open Editor** to go into Editing mode 
1. After making the desired changes you have the following options:
    * **Save** - Save the changes you made. These changes will not be applied until you click on Provision 
    * **Provision** - Apply the resource policy’s saved changes 
    * **Reset Configuration** - Set the editor to the currently provisioned values. This will delete any unprovisioned 
    changes (both saved and unsaved)
1. Click **Exit** to leave Editor mode. The page will show the provisioned configuration. Unprovisioned saved changes will 
still be available in Editor mode. 

### Resource Pool 

**To create a resource pool:** 
1. Click **+ Add Pool**
1. In the **Create Pool** modal, input:
    * Name - The resource pool’s name. This will appear in the Pool’s information card in the Resource Configuration settings page
    * Number of Resources - Number of resources available in this pool
    * Description - Optional free form text for additional descriptive information
1. Click **Create**

**To modify a resource pool** 
1. Click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> on the relevant 
resource pool card **>** click **Edit**
1. In the **Edit Pool** modal, change the pool’s name, number of resources, or description
1. Click **Save**

You can also change the Execution Priority of the [linked resource profiles](#connecting-profiles-to-pools). Click and 
drag the profile connection anchor <img src="/docs/latest/icons/ico-resource-anchor.svg" alt="Resourch anchor" className="icon size-md space-sm" /> 
to change its position in the order of priority.

### Resource Profile 
**To create a resource profile:** 
1. Click **+ Add Profile**
1. In the **Create Profile** modal, input:
    * Name - The resource profile’s name. This will appear in the profile’s information card in the Resource Configuration settings page
    * Resource Allotment - Number of resources allocated to each job running in this profile
3. Click **Create**

**To modify a resource profile:**
1. Click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> on the relevant 
resource profile card > click **Edit**
1. In the **Edit Profile** modal, change the pool's name, number of resources, or description
1. Click **Save**

To control which pool's resources will be assigned first, click and drag the pool connection anchor <img src="/docs/latest/icons/ico-resource-anchor.svg" alt="connection anchor" className="icon size-md space-sm" /> 
to change its position in order of priority.

You can also change the Execution Priority of the resource policies making use of this profile. Open the policy list, 
then click the policy anchor <img src="/docs/latest/icons/ico-drag-vertical.svg" alt="policy anchor" className="icon size-md space-sm" />
and drag the policy to change its position in order of priority.  

**To delete a resource profile:**
1. Click <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Menu" className="icon size-md space-sm" /> on the relevant resource pool card 
1. Click Delete

### Connecting Profiles to Pools
Connect a resource profile to a resource pool to allow jobs assigned to the profile to make use of the pool’s resources. 

**To connect a profile to a pool:**
1. Click **Open Editor**
1. Drag the <img src="/docs/latest/icons/ico-profile-link.svg" alt="Profile-pool link" className="icon size-md space-sm" /> 
of the relevant profile to the resource pool you want to connect the profile to. This opens the **Connect Profile** modal 
1. In the **Connect Profile** modal, input a name for this connection. This connection name will appear on the profile 
card

The settings page will show a line linking the profile and the pool cards. The linked profile appears on the pool card, 
showing its place in the order of execution. To change the profile's priority placement, drag its connection anchor <img src="/docs/latest/icons/ico-resource-anchor.svg" alt="connection anchor" className="icon size-md space-sm" /> 
to a new position.

**To disconnect a profile from a pool:**
1. Click **Open Editor**
1. On the relevant profile card, hover over connection name and click `X`

Jobs assigned to this resource profile will no longer be able to utilize the pool’s resources.
