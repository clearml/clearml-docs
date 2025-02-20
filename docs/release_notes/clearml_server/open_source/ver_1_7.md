---
title: Version 1.7
---

### ClearML Server 1.7.0
**New Features and Improvements**
* Add “Sync comparison” to UI experiment debug samples comparison: Control metric/iteration for all compared experiments ([ClearML GitHub issue #691](https://github.com/clearml/clearml/issues/691))
* Support serving UI from a non-root path of the ClearML Server ([ClearML Helm Charts issue #101](https://github.com/clearml/clearml-helm-charts/issues/101) and [ClearML Server issue #135](https://github.com/clearml/clearml-server/issues/135))
* Add UI option for hiding “secret” experiment container arguments ([ClearML Server GitHub issue #146](https://github.com/clearml/clearml-server/issues/146))
* Add UI tables switch to detail mode through double-click ([ClearML Server GitHub issue #134](https://github.com/clearml/clearml-server/issues/134))
* Add customizable user activity timeout for UI logout
* Add UI navigation from experiment comparison back to originating experiment table
* Improve UI scalar comparison graph configuration - Persist user's choice for viewing graph data.
* Add model IDs display in UI experiment artifact tab
* Add dataset description to UI dataset information display

**Bug Fixes**
* Fix UI experiment Hyperparameter tab's inefficient use of screen real estate ([ClearML GitHub issue #705](https://github.com/clearml/clearml/issues/705))
* Fix navigating to an archived experiment's configuration causes UI to return to non-archived view ([ClearML Server GitHub issue #148](https://github.com/clearml/clearml-server/issues/148))
* Fix metric storage failure when large amount of metrics logged
* Fix UI plots downloaded as PNGs don't contain legends
* Fix UI plot colors can't be changed when colors are specified in code
* Fix experiment table hyperparameter column sorting fails when hyperparameter includes "."
* Fix artifacts aren't deleted when experiment is reset
* Fix UI project cards displaying incorrect task counts when "Show Hidden Projects" is enabled
* Fix changing UI filter to "My Work" within a project page causes main project to become undefined
* Fix clicking project with only hidden sub-projects doesn't navigate to the project's UI page
* Fix multiple UI projects can have same name
* Fix UI experiment plot legends disappear when plots take up whole row
* Fix cloning an experiment into a different project does not navigate to the new project
* Fix queue menu automatically opens when UI enqueue modal is opened
* Fix can't dequeue experiments from deleted queue.
* Fix UI Dataset content previews displays "No preview" message while previews are loading
