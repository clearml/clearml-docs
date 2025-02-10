---
title: Version 1.5
---

### ClearML Server 1.5.0

**New Features and Improvements**
* Redesign UI tables info panel:
    * Redesign experiment status banner
    * Display all experiment tabs in single line
    * Move experiment action buttons to the top right
* Add UI adherence to user specified plot dimensions ([ClearML GitHub issue #587](https://github.com/allegroai/clearml/issues/587))
* Add row highlight to experiment textual comparison UI ([ClearML GitHub issue #581](https://github.com/allegroai/clearml/issues/581))
* Add UI "Delete" action for Pipelines
* Add UI indicator for task and pipeline progress
* Add UI API credentials label "Edit" action
* Add option to create queues on-the-fly when enqueuing tasks in UI
* Add "Number of Workers" column to UI queues table
* Add pipeline results to UI dashboard search

**Bug Fixes**
* Fix UI experiment debug samples disappearing after refresh ([ClearML Server GitHub issue #136](https://github.com/allegroai/clearml-server/issues/136))
* Fix deleting tasks sometimes raises errors ([ClearML GitHub issue #632](https://github.com/allegroai/clearml/issues/632))
* Fix only partial task log shown when running on ES with multiple shards
* Fix move task to trash is not thread-safe
* Fix UI Project overview metric snapshot not showing
* Fix no progress indicator when performing off-screen selection in UI experiments table
* Fix removing long pipeline tags doesn't work
* Fix UI experiment scalar comparison graph titles are cropped with no available tooltips
* Fix UI model table status column filters incorrectly when multiple statuses are selected. 
* Fix unreadable plot data causes UI to crash
* Fix UI project cards displaying incorrect task counts
* Fix hover over system tags doesn't display full tag name
* Fix `.txt` file debug sample previews are unreadable
* Fix UI table/info-panel toggle doesn't update when clicking project breadcrumbs
* Fix UI experiment debug samples leave artifacts when empty 
