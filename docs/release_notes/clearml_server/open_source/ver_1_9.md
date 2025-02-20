---
title: Version 1.9
---

### ClearML Server 1.9.2

**Bug Fixes**
* Fix "Unable to load image" error in UI experiment debug samples after entering storage credentials ([ClearML Web GitHub issue #46](https://github.com/clearml/clearml-web/issues/46))
* Fix incorrect default project name displayed in UI "Clone Experiment" modal ([ClearML Server GitHub issue #171](https://github.com/clearml/clearml-server/issues/171))
* Fix UI experiment debug sample viewer iteration slider not working
* Fix UI experiment console log jumps backwards unnecessarily on refresh
* Fix UI published report is not expandable
* Fix UI published report's description is not editable
* Fix UI experiment-reset popup displays incorrect experiment count 

### ClearML Server 1.9.1

**New Features and Improvements**
* Add collapsible description panel for UI reports 
* Add in-app markdown guide for UI reports

**Bug Fixes**
* Fix can't generate new pipeline runs from UI ([ClearML Server GitHub issue #169](https://github.com/clearml/clearml-server/issues/169))
* Fix plot legend texts overlap in UI reports
* Fix UI embedded plot colors are sometimes obscure
* Fix `ctrl z` doesn't undo codeblocks in UI reports
* Fix "Getting Started" popup wrongfully showing when enqueuing tasks

### ClearML Server 1.9.0

**New Features and Improvements**
* New ClearML Reports UI: Create and share rich MarkDown documents supporting embeddable online content ([ClearML GitHub issue #839](https://github.com/clearml/clearml/issues/839))
* Add user option to not show example content in the UI ([ClearML GitHub issue #774](https://github.com/clearml/clearml/issues/774))
* Add tag filter to UI Pipeline, Dataset, and Hyper-Dataset pages
* Extend UI experiment comparison up to 100 experiments
* Allow project default output destination S3 URLs to include dots (`.`) and hyphens (`-`)

**Bug Fixes**
* Fix long experiment names break UI experiment comparison scalar plot display ([ClearML GitHub issue #166](https://github.com/clearml/clearml-server/issues/166))
* Fix plot legend definitions set by SDK don't override UI default settings
* Fix comparing experiments with read-only components causes error 
* Fix UI model link doesn't preserve double spaces, breaking the URI
* Fix tasks/models/datasets can't be moved to UI root project
* Fix UI tag color list doesn't display tags 
* Fix UI dashboard search returns results from team's work when "My Work" filter is enabled
* Fix UI experiment console does not display complete text when large text is reported
