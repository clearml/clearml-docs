---
title: Version 1.3
---

### ClearML Server 1.3.1

**Bug Fixes**
* Fix scalar graph smoothing ([ClearML Server GitHub issue #127](https://github.com/allegroai/clearml-server/issues/127))

### ClearML Server 1.3.0

**New Features and Improvements**
* New UI pipelines page:
    * Pipelines statistics dashboard
    * Pipeline run history: View pipeline structure, run configuration and outputs
    * Pipeline control: Abort/Run pipelines from UI
* Add support for exporting UI table plots in CSV formats ([ClearML GitHub issue #400](https://github.com/allegroai/clearml/issues/400))
* Improve UI breadcrumbs use of screen real-estate ([ClearML GitHub issue #529](https://github.com/allegroai/clearml/issues/529))
* Add UI adherence to user specification of plot colors and labels ([ClearML GitHub issue #518](https://github.com/allegroai/clearml/issues/518))
* Add Model metadata to UI model information (Model table and details page)
* Add multi-selection in UI experiment info-panel mode
* Add labels to workspace credentials
* Add UI Queues "Clear" action
* Add "Show/Hide" controls to UI experiments scalars tab.
* Add Previous/Next controls to UI text area search bars

**Bug Fixes**
* Fix UI plots do not display Plotly `imshow texttemplate` ([ClearML GitHub issue #538](https://github.com/allegroai/clearml/issues/538))
* Fix clicking F5 clears storage credentials from UI settings page
* Fix UI plots "Wall time" horizontal axis option is not working
* Fix disappearing UI full-screen scalar plot
* Fix disappearing object names in table info-panel mode
* Fix clicking "group by" menu in UI experiment scalars page opens the incorrect menu
* Fix disappearing scalar plots in UI experiment comparison page
* Fix hidden custom UI table column is not removed from main column list
* Fix UI plot toolbar missing tools
* Fix UI table plot tools only appear when hovering over the end of the plot
* Fix resizing UI table column causes subsequent columns to thin 
* Fix "Tip of the day" window continues appearing after user-requested removal

