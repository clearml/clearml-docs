---
title: Text Reporting
---

The [text_reporting.py](https://github.com/allegroai/clearml/blob/master/examples/reporting/text_reporting.py) script 
demonstrates reporting explicit text by calling [`Logger.report_text()`](../../references/sdk/logger.md#report_text). 

ClearML reports the text in the **ClearML Web UI**, in the task's **CONSOLE** tab. 

When the script runs, it creates a task named `text reporting` in the `examples` project.

```python
# report text
Logger.current_logger().report_text("hello, this is plain text")
```

![image](../../img/examples_reporting_text.png)