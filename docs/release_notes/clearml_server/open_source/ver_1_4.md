---
title: Version 1.4
---

### ClearML Server 1.4.0

**New Features and Improvements**

- Allow serving with a URL path prefix ([ClearML Server GitHub issue #119](https://github.com/allegroai/clearml-server/issues/119))
- Allow overriding clearml web git url on build ([ClearML Server GitHub Pull Request #122](https://github.com/allegroai/clearml-server/pull/122))
- Ensure agent-services waits for API server to be ready ([ClearML Server GitHub issue #113](https://github.com/allegroai/clearml-server/issues/113))
- Add filter to UI experiment table "Project" column ([ClearML GitHub issue #529](https://github.com/allegroai/clearml/issues/529))
- Add filters to UI model table custom metadata columns
- Improve UI table object selection. Add buttons and context menu actions to switch between table and info panel mode
- Add task detail header to UI experiment comparison debug image section addressed in ([ClearML GitHub issue #81](https://github.com/allegroai/clearml/issues/81) ([comment](https://github.com/allegroai/clearml/issues/81#issuecomment-996841658)))
- Improve series name truncation behavior in UI scalar plots ([ClearML GitHub issue #562](https://github.com/allegroai/clearml/issues/562))

**Bug Fixes**

- Fix server limiting image and artifact upload size ([ClearML GitHub issue #606](https://github.com/allegroai/clearml/issues/606))
- Fix server unnecessarily displays deletion error message ([ClearML Server GitHub issue #112](https://github.com/allegroai/clearml-server/issues/112))
- Fix UI experiment comparison sections overly wide for many tag experiments ([ClearML GitHub issue #594](https://github.com/allegroai/clearml/issues/594))
- Fix model name display in UI pipeline run info panel 
- Fix UI pipeline run info panel missing artifacts and models sections
- Fix UI pipeline run info panel displays unneeded resource utilization metrics 
- Fix UI project cards missing task summary values
- Fix pipeline tag colors can't be changed in UI pipeline page
- Fix pipeline run UI page not displaying pipeline steps ([ClearML GitHub issue #618](https://github.com/allegroai/clearml/issues/618))
- Fix breadcrumb links don't navigate anywhere
- Fix horizontal scroll in UI experiment table causes column headers to jump
- Fix removing UI table column creates a blank column
- Fix internal server error (500) on `events.get_scalar_metrics_and_variants` ([ClearML Server GitHub issue #120](https://github.com/allegroai/clearml-server/issues/120))

