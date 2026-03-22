---
title: SSH Session
---

### 1.17.1
* Fix app instance fails when non-admin users leave `Interactive Session Project` configuration option blank in launch form

### 1.17.0
* Improve security

### 1.16.0

**New Feature**
* Add support for exposing an additional internal HTTP(S) port to enable externally managed HTTPS endpoint

**Bug Fix**
* Fix application instance continues to run after SSH server setup failure


### 1.15.2  

**New features and Improvements**
* Add support for user-defined SSH password
* Ensure tasks created by SDK from SSH sessions by default use the same Docker image as the running environment.

### 1.15.0

**Bug Fix**
* Fix input Git repository being left in detached HEAD state


### 1.14.3
**New Feature**
* Add debug logging to app instance

### 1.14.1

**Bug Fix**
* Fix app does not generate SSH credentials and remains in loading state  

### 1.14.0

**Bug Fix**
* Fix app dashboard displays incorrect SSH port 

### 1.13.0

**New Feature**
* Add session workspace backup: clone an app instance and continue with the same session workspace

**Bug Fix**
* Fix `Project` field is missing from instance launch form
