---
title: Version 2.1
---

### ClearML Server 2.1.0

**New Features**
* New UI task creation options
  * Support bash as well as Python scripts
  * Support file upload
* Add per-project UI scalar view configuration ([ClearML #1377](https://github.com/clearml/clearml/issues/1377))
* Add support for custom x-axis label in UI Task scalars
* Add global search bar to all UI pages
* Add filter to UI Model Endpoints table 
* Add clicking UI breadcrumbs project name of full-screen task opens the project's task table ([ClearML #1376](https://github.com/clearml/clearml/issues/1376))
* Improve UI task debug sample viewer:
  * Zoom setting persists when navigating between samples ([ClearML #1390](https://github.com/clearml/clearml/issues/1390))
  * Zoom focuses on cursor position

**Bug Fixes**
* Fix EMA smoothing in UI scalars is incorrect in first data point ([ClearML Web #101](https://github.com/clearml/clearml-web/issues/101))
* Improve UI scalar smoothing algorithms (ClearML [#101](https://github.com/clearml/clearml-web/issues/101), 
  [#102](https://github.com/clearml/clearml-web/issues/102), [#103](https://github.com/clearml/clearml-web/issues/103))
* Fix UI Plots does not respect plotly `aspectmode` ([ClearML #1389](https://github.com/clearml/clearml/issues/1389))
* Fix ctrl-f does not open a search bar in UI editor modals ([ClearML Web #99](https://github.com/clearml/clearml-web/issues/99))
* Fix UI original series of smoothed plots barely visible in dark mode ([ClearML Server #270](https://github.com/clearml/clearml-server/issues/270))
* Fix webserver configuration environment variables don't load with single-quoted strings ([ClearML Server #271](https://github.com/clearml/clearml-server/issues/271))
* Fix next/previous function not working in UI model plots in full-screen
* Fix UI pipeline "Preview" tab sometimes displays "Failed to get plot charts" error
* Fix image plots sometimes not rendered in UI
* Fix UI plot legend state is not persistent
* Fix parameter graph color is not persistent between plots in UI Model Endpoint 
* Fix UI Pipeline Stage Info modal displays broken link
* Fix UI Model table tag filter displaying unnecessary artifacts after excluding tag
* Fix "All" tag filter not working in UI model selection modal in comparison pages
* Fix UI task table displaying incorrect footer sometimes
* Fix task status not updating in UI task comparison page
* Fix manual refresh function sometimes does not work in UI task full screen view
* Fix recently modified reports not displayed in UI "Recent Reports"
* Fix UI task plot zoom not maintained between full screen and regular view ([ClearML Web #106](https://github.com/clearml/clearml-web/issues/106))
* Fix UI scalar graph colors sometimes difficult to see in light mode ([ClearML Web #104](https://github.com/clearml/clearml-web/issues/104))
* Fix UI task comparison's metric search bar in Scalars tab is case-sensitive
* Fix UI task configuration long loading time
* Fix embedded UI task comparison parallel coordinates plot does not display plot legend
* Fix UI embedded plot colors do not change upon UI theme change
* Fix deleting a parameter in the UI task creation modal incorrectly removes another parameter
* Add support for comparing tasks from specific project in UI Reports customized embed queries 
* Fix clicking "Details" view causes UI Model data to disappear
* Fix UI scalars hide/show function sometimes doesn't work for single-variant metrics
* Fix maximizing UI scalar plot raises an error
* Fix clicking on task in UI Model lineage navigates to incorrect page
* Fix UI breadcrumbs sometimes does not display project name
