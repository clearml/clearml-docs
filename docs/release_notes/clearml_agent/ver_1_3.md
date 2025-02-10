---
title: Version 1.3
---

### ClearML Agent 1.3.0
**New Features and Improvements**
* Support private repos from `requirements.txt` file ([ClearML Agent GitHub PR #107](https://github.com/allegroai/clearml-agent/pull/107))
* Bump PyJWT version due to "*Key confusion through non-blocklisted public key formats*" vulnerability
* Add support for additional command line arguments in k8s glue example
* Add Python 3.10 support

**Bug Fixes**
* Fix git unsafe directory issue (disable check on cached vcs folder)
* Fix dynamic GPUs with "all" GPUs on the same worker
* Fix broken pytorch setuptools incompatibility (force setuptools < 59 if torch is below 1.11)
* Fix setuptools requirement issue by making sure that if we have "setuptools" in the original required packages, we preserve the line in the pip freeze list
* Fix optional priority packaged always compare lower case package name
* Fix potential requirement installation failure by making `pygobject` an optional package (i.e. if installation fails 
  continue the Task package environment setup)
* Fix repository URL contains credentials even when `agent.force_git_ssh_protocol: true`
