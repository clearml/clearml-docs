---
title: Version 1.2
---

### ClearML Server 1.2.0

**New Features and Improvements**
* Add functionality to "Abort all children" UI action for controller and optimizer tasks
* Add parameter search to task configuration UI section ([ClearML GitHub issue #467](https://github.com/allegroai/clearml/issues/467))
* Add tag exclusion filters in UI experiment and model tables
* Add "Clear Filters" functionality button to UI table filters
* Improve full screen scalar graph to display all data points
* Add UI experiment table option for mass selection of out-of-screen items
* Improve experiment comparison UI: 
    * New experiment addition modal with table filtering and sorting 
    * Fix scalar selection being reset upon comparison contents change
    * Add Task ID suffix to debug samples with same-name experiments
    * Add task ID suffix to experiment name for same-experiment-name series in scalar experiment comparison
* New Settings pages
    * User profile
    * Webapp configuration
    * Workspace settings
* Add "Updated" column to models table 
* Add refresh button to full screen scalar display
* Improve display of float values in UI experiment and model tables. Tables will display rounded up float values 
  according to space allotted to a column. View precise value by hovering over value. 
* Add capability to edit username in UI profile page
* Add build number to version information in UI Settings page

**Bug Fixes**

* Fix UI debug sample viewer ignoring metric filter on auto-refresh ([ClearML GitHub issue #512](https://github.com/allegroai/clearml/issues/512))
* Fix "Wall time" x-axis option in UI plots slowing down web app ([ClearML GitHub issue #441](https://github.com/allegroai/clearml/issues/441))
* Fix UI table plot titles don't display their iteration number ([ClearML GitHub issue #474](https://github.com/allegroai/clearml/issues/474))
* Fix auto-refresh resets vertical scroll in UI debug samples ([ClearML GitHub issue #474](https://github.com/allegroai/clearml/issues/474))
* Fix manually run experiments cannot be edited in UI after being reset ([ClearML GitHub issue #449](https://github.com/allegroai/clearml/issues/449)) 
* Fix UI Workers & Queues and Experiment Table pages display mismatching experiment runtime values ([ClearML Server GitHub issue #100](https://github.com/allegroai/clearml-server/issues/100))
* Fix UI plots sometimes disappear after task execution completion
* Fix UI experiment plots don't display some plots on a http server
* Fix failure to add Azure credentials through UI Settings page by new users 
* Fix UI experiment table failing to clear selection of off-screen experiments 
* Fix UI experiment table column resizing malfunctioning
* Fix UI table filters being reset after page is refreshed
* Fix failure to create a sub-project on-the-fly when cloning an experiment through the UI
* Fix UI project overview editing enabled when project is public
* Fix model deletion from UI "All Experiments" page navigates to model project's experiment table
* Fix missing "Project" custom column in "All Experiments" views of non-root projects
* Fix UI project cards' task enumeration summaries displaying negative number 
* Fix experiment bar graph colors cannot be changed sometimes
* Fix fail to filter experiments on tags beginning with "-" 
* Fix tag list order in UI experiment table filter after tag selection
* Fix long hyperparameter names are obscured in UI comparison screen
* Fix add tag context menu operation fails when experiment selection includes a system example
* Fix size of low value points in UI metric snapshot plot
* Fix long queue names obscures copy button in UI queue list and Worker & Queue page plot titles 
* Fix UI breadcrumb menus missing values
* Fix UI scalar plot titles are unreadable
* Fix UI buttons not working after closing "Add Experiment" modal in UI experiment comparison page
* Fix underscores disappear while editing UI text blocks on Chromium
* Fix UI Workers & Queues page's queue panel does not display experiment information
* Fix long queue names obscure copy button in UI queue list
* Fix UI debug image viewer momentarily displays previously viewed image
* Fix "Load More" button in UI experiment table presents duplicates of already displayed experiments
