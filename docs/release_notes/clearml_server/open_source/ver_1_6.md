---
title: Version 1.6
---

### ClearML Server 1.6.0
**New Features and Improvements**
* New ClearML Datasets UI pages for tracking dataset versions and exploring version lineage and contents
* Add history navigation to experiments plots UI page ([ClearML GitHub issues #81](https://github.com/allegroai/clearml/issues/81) and [#255](https://github.com/allegroai/clearml/issues/255)): 
  * Plots page shows last reported plot for each metric/variation combination
  * Single plot view provides history navigation slider
* Add single value scalar reporting: Single value scalars are aggregated into a summary table in the experiment's scalars 
  UI page ([ClearML GitHub issue #400](https://github.com/allegroai/clearml/issues/400))
* Add "show hidden projects" control ([ClearML GitHub issue #694](https://github.com/allegroai/clearml/issues/694))
* Improve UI projects page setting persistence - User's last chosen settings for recent/name sorting and team/personal 
  filter is saved ([ClearML GitHub issue #353](https://github.com/allegroai/clearml/issues/353))
* Improve UI presentation for object IDs:
  * Display shortened ID next to task name 
  * Display full ID in tooltip  
  * Copy-to-clipboard on click
* Add "Clear all active filters" button to Projects and Pipelines details view
* Add notification for UI session expiration
* Add ID columns to UI object tables (experiments, models, etc.) 
* Add "Info" section to "Details" tab of UI experiment comparison
* Add "loading" indicator for HTML debug samples
* Improve UI text editor behavior: when applicable, cursor returns to most recent edit, otherwise, cursor goes to start of text
* Maintain UI viewing mode when restoring archived items

**Bug Fixes**
* Fix experiment selection with 'Shift' key in UI experiment table not working ([ClearML Server GitHub issue #139](https://github.com/allegroai/clearml-server/issues/139))
* Fix UI search error message interferes with inputting search query ([ClearML Server GitHub issue #138](https://github.com/allegroai/clearml-server/issues/138))
* Fix refresh breaks UI breadcrumbs ClearML Server ([ClearML Server GitHub issue #142](https://github.com/allegroai/clearml-server/issues/142))
* Fix UI Workers and Queues page displays incorrect queue metrics
* Fix failure to publish models whose generating task was reset
* Fix listed models in UI pipeline run info panel doesn't link to model 
* Fix "Load more" button disappears from UI experiment page 	
* Fix breadcrumb link to parent project does not navigate to the parent's project page
* Fix spaces deleted while typing query in UI search bars
* Fix UI plots not loading in experiments 
* Fix UI experiment debug sample full screen failing to display multiple metrics
* Fix using search in UI tables removes custom columns
* Fix experiment debug samples remain in file server after experiment deletion
* Fix UI pipeline page sorting not working 
* Fix UI scalar comparison does not display task tags
* Fix smoothed UI plots obscured by original graphs
* Fix broken task name links in UI scalar and hyperparameter comparison pages 
* Fix "My work" filter not filtering out sub-projects 
* Fix generic project link navigates to a blank page
* Fix UI experiment's model link inefficient use of screen real estate
* Fix network error causes UI models and experiments auto-refresh to stop working
* Fix Empty path menu appearing in UI breadcrumbs when there are no intermediary projects
* Fix long loading time in UI experiment comparison
* Fix slow performance of UI experiment plots and scalars in Chrome
* Fix Delete action not appearing in bottom bar of UI pipeline runs table archive
* Fix UI experiments not displaying dataset tasks created with `clearml` version lower than 1.6 
* Fix UI projects with dataset tasks created with `clearml` version lower than 1.6 display incorrect statistics 
* Fix maximizing image-plot chart in UI causes CORS error
* Fix UI experiment's "Select A Public Model" modal missing "Updated" and "Description" column data
* Fix UI experiments table's project filter displays duplicates
* Fix UI projects display incorrect statistics
* Fix clicking project with only hidden sub-projects doesn't navigate to the project's UI page
* Fix passing empty string parameter name to `Task.set_parameters` causes a 500 error
* Fix UI model page General tab's layout
* Fix using UI experiment plot navigation menu pushes WebApp's top navigation bar
* Fix example pipeline project created with "Generate Example" is empty
* Fix example pipeline created with "Generate Example" is not displayed in project dashboard when "Show hidden projects" is enabled
* Fix UI table/info-panel toggle doesn't update when switching viewing modes
