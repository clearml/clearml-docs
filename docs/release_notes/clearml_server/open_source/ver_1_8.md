---
title: Version 1.8
---

### ClearML Server 1.8.0

**New Features and Improvements**
* Support `/` delimited project names for on-the-fly nested project creation in UI operations ([ClearML Server GitHub issue #151](https://github.com/clearml/clearml-server/issues/151))
* Add keyboard shortcut iteration navigation in full screen view of debug samples and plots
* Add "Don't show again" option for UI notification when archiving tasks ([ClearML Server GitHub issue #149](https://github.com/clearml/clearml-server/issues/149))
* Add task reset/delete modal automatically closes when no additional information is provided
* Add parent project name in UI dataset and pipeline cards
* Move UI plot legends to bottom of plot

**Bug Fixes**
* Fix task artifacts not deleted from file server when task deleted via UI ([ClearML GitHub issue #801](https://github.com/clearml/clearml/issues/801))
* Fix deleting pipeline projects via UI fails ([ClearML GitHub issue #798](https://github.com/clearml/clearml/issues/798))
* Fix multiple selection with `Shift` key in UI experiment table not working ([ClearML Server GitHub issue #139](https://github.com/clearml/clearml-server/issues/139))
* Fix disappearing user filter in UI "All Experiments" table ([ClearML Web GitHub issue #33](https://github.com/clearml/clearml-web/issues/33))
* Fix UI Dashboard missing My Work / Team Work filter
* Fix navigating to Scalars and Plots tabs in UI experiment comparison freezes browser
* Fix project stats do not exclude dataset and annotation tasks
* Fix subproject with no experiments displayed as "undefined" in parent project page 
* Fix maximizing UI combined scalar plots displays split scalar plots 
* Fix adding description to UI dataset does not work
* Fix empty "parent" field in task cloned in UI
* Fix running UI application instances can be deleted
* Fix queue option list does not open in UI enqueue modal
