---
title: Volumes
---

:::important[Enterprise Feature] 
Volume templates and managed volumes are available under the ClearML Enterprise plan.
:::

Volumes are storage configurations that can be assigned to projects to be applied by users to the workloads running in 
those projects.

Tenant administrators create volumes using templates assigned to the tenant by platform administrators. These templates 
can provide custom variables for the tenant administrators to further customize the storage configuration. 

The **Volumes** table lists all currently defined storage volumes:
* Name 
* Description
* Volume template
* Projects - The projects the volume can be applied to

The table also includes columns for the custom template variables in use by the existing volumes.

Hover over a volume in the table to **Edit** or **Delete** a volume.

Deleting a volume will remove all project storage configurations making use of the volume 

## Create a Volume
1. Click `+ Add Volume`
1. Input following information:	
   * Name
   * Description
   * Availability - Define which projects can use this volume: 
     * All Projects -  Available across all projects 
     * Selected Projects - Specify one or more projects. The volume will also be available to all subprojects of the selected projects
   * Volume template - Select a volume template. 

     :::note
     Available templates are predefined by the platform administrator
     :::

   * Template Parameters - Additional parameters may be available depending on the selected template. Click **Available System Variables** 
     for available built-in variables which can be used in volume configuration.
1. Click **Add**

    <div class="max-w-75">
    
    ![Volume settings](../../img/settings_volume.png#light-mode-only)
    ![Volume settings](../../img/settings_volume_dark.png#dark-mode-only)
    
    </div>