---
title: The Dataview Table
---

The **Dataview table** is a [customizable](#customizing-the-dataview-table) list of Dataviews associated with a project.
Use it to view and create Dataviews, and access their info panels. 

The table lists independent Dataview objects. To see Dataviews logged by a task, go
to the specific task's **DATAVIEWS** tab (see [Task Dataviews](webapp_exp_track_visual.md)).

View the Dataview table in table view <img src="/docs/latest/icons/ico-table-view.svg" alt="Table view" className="icon size-md space-sm" /> 
or in details view <img src="/docs/latest/icons/ico-split-view.svg" alt="Details view" className="icon size-md space-sm" />,
using the buttons on the top left of the page. Use the table view for a comparative view of your Dataviews according to 
columns of interest. Use the details view to access a selected Dataview's details, while keeping the Dataview list in view.
Details view can also be accessed by double-clicking a specific Dataview in the table view to open its details view. 

You can archive Dataviews so the Dataview table doesn't get too cluttered. Click **OPEN ARCHIVE** on the top of the 
table to open the archive and view all archived Dataviews. From the archive, you can restore 
Dataviews to remove them from the archive. You can also permanently delete Dataviews.

You can download the Dataview table as a CSV file by clicking <img src="/docs/latest/icons/ico-download.svg" alt="Download" className="icon size-md space-sm" /> 
and choosing one of these options:
* **Download onscreen items** - Download the values for Dataviews currently visible on screen  
* **Download all items** - Download the values for all Dataviews in this project that match the current active filters  

The downloaded data consists of the currently displayed table columns.

![Dataview table](../../img/hyperdatasets/webapp_dataviews_table.png#light-mode-only)
![Dataview table](../../img/hyperdatasets/webapp_dataviews_table_dark.png#dark-mode-only)

The Dataview table includes the following columns: 

|Column|Description|Type|
|--|--|--|
|**DATAVIEW** | Dataview name | String|
|**USER** | User who created the Dataview | String|
|**STATUS** | The status of the Dataview, which can be *Draft* (editable) or *Published* (read-only)| String| 
|**PROJECT** | Name of the Dataview's project| String|
|**CREATED** | Elapsed time since the Dataview was created| Date-time|
|**DESCRIPTION** | A description of the Dataview | String| 

Dynamically order the columns by dragging a column heading 
to a new position.

## Customizing the Dataview Table

The Dataview table can be customized. Changes are persistent (cached in the browser), and represented in the URL. 
Save customized settings in a browser bookmark, and share the URL with teammates.

Customize the table using any of the following:

* Dynamic column order - Drag a column title to a different position.
* Resize columns - Drag the column separator to change the width of that column. Double-click the column separator for automatic fit.
* Filter by user and/or status - When a filter is applied to a column, its filter icon will appear with a highlighted 
  dot on its top right (<img src="/docs/latest/icons/ico-filter-on.svg" alt="Filter on" className="icon size-md" />). To 
  clear all active filters, click <img src="/docs/latest/icons/ico-filter-reset.svg" alt="Clear filters" className="icon size-md" />
  in the top right corner of the table.
* Sort columns - By task name and/or elapsed time since creation.

:::note
The following Dataviews-table customizations are saved on a **per-project** basis: 
* Column order
* Column width
* Active sort order
* Active filters

If a project has subprojects, the Dataviews can be viewed by their subproject groupings or together with 
all the Dataviews in the project. The customizations of these two views are saved separately. 
:::


## Dataview Actions

The following table describes the actions that can be performed from the Dataview table. 

Access these actions with the context menu in any of the following ways:
* In the Dataview table, right-click a Dataview, or hover over a Dataview and click <img src="/docs/latest/icons/ico-dots-v-menu.svg" alt="Dot menu" className="icon size-md space-sm" />
* In a Dataview info panel, click the menu button <img src="/docs/latest/icons/ico-bars-menu.svg" alt="Bar menu" className="icon size-md space-sm" />

| ClearML Action | Description |
|---|---|
| Details | View Dataview details, including input datasets, label mapping, and iteration control. Can also be accessed by double-clicking a Dataview in the Dataview table. |
| Archive | Move Dataview to the Dataview's archive. | 
| Restore | Action available in the archive. Restore a Dataview to the active Dataview table. |
| Delete | Action available in the archive. Permanently delete a Dataview. |
| Clone | Make an exact copy of a Dataview that is editable. |
| Move to Project | Move a Dataview to another project. |
| Publish |  Publish a Dataview to prevent changes to it. *Published* Dataviews are read-only.|

:::important Enterprise Feature
The ClearML Enterprise Server provides a mechanism to define your own custom actions, which will 
appear in the context menu. Create a custom action by defining an HTTP request to issue when clicking on the context menu
action. For more information see [Custom UI Context Menu Actions](../../deploying_clearml/clearml_server_config.md#custom-ui-context-menu-actions).
:::

Some of the actions mentioned in the chart above can be performed on multiple Dataviews at once.
Select multiple Dataviews, then use either the context menu, or the batch action bar that appears at the bottom of the page, to perform
operations on the selected Dataviews. The context menu shows the number of Dataviews that can be affected by each action. 
The same information can be found in the batch action bar, in a tooltip that appears when hovering over an action icon. 

![Dataview table batch operations](../../img/hyperdatasets/webapp_dataviews_context_menu.png#light-mode-only)
![Dataview table batch operations](../../img/hyperdatasets/webapp_dataviews_context_menu_dark.png#dark-mode-only)

## Creating a Dataview 

Create a Dataview by clicking **+ NEW DATAVIEW**, which opens a 
**NEW DATAVIEW** window. 

![New Dataview window](../../img/hyperdatasets/webapp_dataview_new.png#light-mode-only)
![New Dataview window](../../img/hyperdatasets/webapp_dataview_new_dark.png#dark-mode-only)