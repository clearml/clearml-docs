---
title: Version 2.2
---

### ClearML Server 2.2.0

**New Features and Improvements**

* New UI global search including quick filters ([ClearML Server #1041](https://github.com/allegroai/clearml/issues/1041))
* Add persistent UI plot properties: Plot settings (e.g. logarithmic/linear scale, hover mode) are retained across project tasks
* Add option to hide original graph when smoothing is enabled in UI plot ([ClearML #1400](https://github.com/clearml/clearml/issues/1400))
* Add persistent UI table details view ([ClearML Web #105](https://github.com/clearml/clearml-web/issues/105)) 
* Add search bar to UI Queues table

**Bug Fixes**
* Fix embedded UI task comparison plot legends unnecessarily display task ID suffixes ([ClearML #1344](https://github.com/clearml/clearml/issues/1344))
* Fix UI task dataset alias does not link to dataset page ([ClearML #735](https://github.com/clearml/clearml/issues/735))
* UI task comparison parallel coordinate view 
  * Fix color selector in legend does not display currently assigned color
  * Fix embedded plot does not display plot legend
  * Fix full screen missing legend and title, and displaying all graphs in same color
* UI Plots
  * Fix x-axis units are not updated after selection is modified
  * Fix UI plot "Show closest data" toggle not displaying in Plotly 2D and 3D scatter plots
  * Fix highlight lines for "show closest data" function in UI 3D plot difficult to see in dark mode
  * Fix plotly pointcloud is displayed monochromatically in UI plots ([ClearML #1428](https://github.com/clearml/clearml/issues/1428))
  * Fix embedded plots sometimes fail to display
* Queues
  * Fix UI queue creation modal allows invalid display name input 
  * Fix queue display name is updated after modification in UI Orchestration > Queues page
* Fix project path indicator not displaying in UI project card's 
* Fix refreshing UI Model Endpoints > Loading tab navigates to another tab
* Fix UI Dataset navigation bar sometimes disappears
* Fix UI object table is sometimes not displayed in info panel view
* Fix UI Settings API credential labels sometimes disappear 
* Fix default output destination indicator not displaying in UI project cards 
* Fix "Clear Filters" functionality sometimes does not work in UI task scalar comparison
* Fix UI report preview sometimes does not load
* Fix UI tables' Project column filter does not list all projects
* Fix UI "Create Project" modal sometimes allows for creation of project with invalid date
