---
title: Version 1.1
---

### ClearML Server 1.1.0 

**New Features and Improvements**

- Add metric snapshot plot to project overview UI - Show an aggregated view of all project experiments value for a leading metric
- Add logical `AND` option to UI experiment table tag filter
- Add Task runtime properties to experiment INFO UI tab 
- Add full screen view for any experiment result plot
- Add extended version information to UI profile page
- Stop using special characters in secrets
- Allow setting status_message in `tasks.update`
- Improve UI table view configuration persistence - User table-view configuration is saved per project:
    - Visible columns 
    - Column order
    - Column width
    - Active sort
    - Active filters

**Bug Fixes**

- Fix experiment details UI failure opening hyperparameter sections beginning with `#` ([ClearML Server GitHub issue #79](https://github.com/allegroai/clearml-server/issues/79))
- Fix performance issues with UI comparison of large experiments ([Slack Channel](https://clearml.slack.com/archives/CTK20V944/p1621698235159800))
- Fix filtering on hyperparameters ([ClearML GitHub issue #385](https://github.com/allegroai/clearml/issues/385) [Slack Channel](https://clearml.slack.com/archives/CTK20V944/p1626600582284700))
- Fix profile page user options toggle control area of effect
- Fix browser resizing affecting plot zoom
- Fix UI dataview filter resetting version on filter addition
- Fix UI project overview:
  - Fix links in project overview not working  
  - Allow editing empty overview for legacy projects
- Fix Table plots using fraction of available space 
- Fix scalars color assignment broken by `.` in scalar name
- Fix tasks cannot be moved between queues
- Fix UI Docker argument input - Force arguments in designated field
- Fix extraneous "tag" string prefixing Commit ID in Task execution information UI
- Fix missing 'no value' option in hyperparameters table filters
- Fix queued task is not dequeued on `tasks.stop`
- General aesthetic fixes:
    - Fix input title alignment in UI clone experiment window
    - Fix UI empty experiment table message alignment
    - Fix UI table filter menu proportions
    - Fix debug sample dropdown menu coloring
    - Fix dashboard card alignment
    - Fix redundant separator in plot control when maximized
