---
title: Version 1.0
---

### ClearML Server 1.0.2

**Bug Fixes**

- Fix Task container does not accept `null` values ([Slack Channel](https://clearml.slack.com/archives/CTK20V944/p1622119047293300) [ClearML GitHub issue 365](https://github.com/clearml/clearml/issues/365))
- Fix debug images exception in Results page
- Fix a typo in Worker Setup help popup

### ClearML Server 1.0.1

**Bug Fixes**

- Fix clearing experiment requirements causes "empty" requirements (as opposed to "no requirements")
- Fix logout fails with `endpoint not found` error ([ClearML GitHub issue 349](https://github.com/clearml/clearml/issues/349))
- Fix hamburger side menu `Manage Queues` does nothing and returns console error ([Slack Channel](https://clearml.slack.com/archives/CTK20V944/p1620308724418100))
- Fix broken config dir backwards compatibility (`/opt/trains/config` should also be supported)

### ClearML Server 1.0.0

**Features**

* Add Multi-level project hierarchy - Projects can now contain sub-projects
* Add markdown editor for project overview
* Add support for multiple models per experiment
* Add Context menu batch operations ([ClearML GitHub issue 286](https://github.com/clearml/clearml/issues/286))
* Add global search regex support ([ClearML GitHub issue 81](https://github.com/clearml/clearml/issues/81#issuecomment-735003956))
* Add support for extended container (docker) configuration and init script
* Add special character support ("." (dot) and "$") in Hyperparameters
* Add new context menu icons
* Add deleting experiments and models through UI (ClearML GitHub issues [53](https://github.com/clearml/clearml-server/issues/53), [61](https://github.com/clearml/clearml-server/issues/61), and [81](https://github.com/clearml/clearml/issues/81#issuecomment-706907718))
* Improve Project deletion: deletes project's experiments and models.
* Add experiment description access from info title
* Improve experiment table columns 
  * Add filter by user
  * Add filters time columns
  * Add filters for custom columns (metrics and hyperparameters)
  * Add secondary nested sorting
* Add `worker<->queue` clickable reference in workers and queues tables
* Add presenting all metric debug samples concurrently
* Add Full project name display in project cards ([ClearML GitHub issue 81](https://github.com/clearml/clearml/issues/81#issuecomment-823303842))
* Add option for continuing aborted tasks

**Bug Fixes**

* Fix UI storage credentials input missing for HTML artifacts
* Fix sorting custom metric columns sort treats empty fields as zeroes
* Fix UI experiments table redundant rendering on auto refresh
* Fix missing URL encoding for hyperparameters key names
* Fix UI experiment section edit opens outside viewable screen
* Fix UI missing default selection of artifacts in full screen view
* Fix UI variant name not shown in plots
* Fix UI missing tooltip for truncated column headers
* Fix UI custom columns choice does not persist per project ([ClearML GitHub issue 314](https://github.com/clearml/clearml/issues/314))
* Fix API plot_str not returned for compressed plots
* Fix UI plots color picker consistency
* Fix API ```Tasks.reset``` marking parent id as 'deleted' in its children
* Fix UI missing queue selection on queue delete
* Fix UI debug image history slider not shown when there's only a single iteration
* Fix UI X-axis labels are being cut in plots ([ClearML GitHub issue 264](https://github.com/clearml/clearml/issues/264))
* Fix UI scalar color choice dialog toggles between screen positions every time you open it
* Fix UI hovering on legend clears parallel coordinates graph filters ([ClearML GitHub issue 259](https://github.com/clearml/clearml/issues/259))
* Fix UI experiment comparison 'hide identical fields' button disable doesn't work
* Fix UI auto refresh removes model ID in model panel
* Fix UI debug samples download image opens new tab instead of downloading
* Fix UI experiment/model tables: Right most column is not fixed to right edge of screen
* Fix UI 'Add experiment' modal in compare scalar comparison intertwines with comparison display
* Fix UI experiment configurations showing redundant "General" section
