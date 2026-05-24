---
title: ClearML Agent Bootstrap
---

:::important[Agent version 3.0.0 required]
Bootstrap is supported in ClearML Agent version `3.0.0` or newer.
:::

## Overview

The `clearml-agent-bootstrap` package provides a self-contained initialization system used by ClearML Agent when 
launching tasks in containers. The package includes precompiled binaries for  **Python**, **Git**, **ClearML Agent**, 
and essential utilities, ensuring a reliable and efficient setup on containers that don’t have these tools pre-installed.

When a ClearML Agent launches a containerized task, the bootstrap script runs before task execution. It detects the 
container's architecture and distribution, sets up a working Python environment, ensures Git is available, then starts 
ClearML Agent inside the container to execute the task.

Bootstrap can be used on:
* [Bare metal / VM](#installation-on-bare-metal)
* [Kubernetes](#kubernetes) (*Enterprise only*) - via the ClearML Enterprise Server Helm chart.

### Why Use Bootstrap

- **Faster cold starts** - Avoids installing dependencies at task runtime. 
- **Broader container compatibility** - Supports base images without Python or Git. 
- **Consistent environments** - Standardizes tooling across executions. 
- **Offline support** - Required binaries are bundled in advance. 

### Supported Platforms

Bootstrap supports the following CPU architecture 
* `x86_64`
* `aarch64` (ARM64) architectures

Bootstrap is tested on the following Linux distributions: 
* Ubuntu
* Debian
* CentOS
* RHEL
* Fedora
* Rocky Linux
* Alpine Linux

Bootstrap also works on any Linux distribution that provides `apt-get`, `dnf`, `yum`, or `apk`. 

### Core Components

| Component | Description |
|---|---|
| **ClearML Agent** | Pre-compiled agent binary (available variants for each architecture). |
| **Python** | Uses an existing Python 3.6+ and package manager if available in the container. If none is found, `uv` is used to bootstrap a self-contained interpreter. |
| **Git** | Uses an existing git executable when available in a container. If git is not installed, use a statically linked binary with Git LFS support. |
| **uv** | Fast Python package manager used to install Python interpreters and pip packages. |
| **Dropbear** | Lightweight SSH server for interactive sessions. |


## Installation on Bare Metal

Install bootstrap in one of the following ways:
* [Using clearml-agent install-bootstrap](#using-clearml-agent-install-bootstrap) (recommended)
* [Manually](#manual-installation) via a local `.whl` file 

### Using clearml-agent install-bootstrap

1. Install ClearML Agent (version 3.0.0 and newer):

   ```bash
   pip install clearml-agent
   ```

1. Install the bootstrap package:

   ```bash
   clearml-agent install-bootstrap
   ```

This downloads and installs the latest available `clearml-agent-bootstrap` wheel. 

**This command does not require a ClearML server connection** and can be run before `clearml-agent init`.

#### Command Options

| Flag | Description |
|---|---|
| `--check` | Preview the actions that would be performed without making changes. |
| `--force` | Force reinstall even if the same version is already installed. |
| `--version TAG` | Install a specific release version (e.g., `v1.0.0`). |
| `--from-file PATH` | Install from a local `.whl` file instead of downloading from the official GitHub Releases. |

#### Examples

```bash
# Check what's available without installing
clearml-agent install-bootstrap --check

# Install a specific version
clearml-agent install-bootstrap --version v1.0.0

# Install from a local wheel
clearml-agent install-bootstrap --from-file ./clearml_agent_bootstrap-1.0.0-py3-none-any.whl

# Force reinstall
clearml-agent install-bootstrap --force
```

### Manual Installation

Download the `.whl` file from the official [GitHub Releases](https://github.com/clearml/clearml-agent-bootstrap/releases) and install it locally:

```bash
pip install clearml_agent_bootstrap-<version>-py3-none-any.whl
```

## Kubernetes

:::important[Enterprise Feature]
Bootstrap support for Kubernetes is available only in the ClearML Enterprise Server Helm chart.
:::

When bootstrap is enabled, bootstrap is deployed with each task pod, injecting binaries into the main container using a 
pre-configured init container.

### Helm Chart Configuration

Enable bootstrap by setting the following in your `clearml-agent-values.override.yaml`:

```yaml
bootstrap:
  enabled: true
```

View additional bootstrap configuration options in the Helm chart values.

### Resources Server

When bootstrap is enabled, the Helm chart also deploys a lightweight HTTP server: `clearml/bootstrap-resources-server`. 
This server hosts pre-built binaries and packages (e.g. VSCode and plugins), so task pods can fetch them locally without 
accessing the internet. 

The resources server is configured automatically. Additional settings are available in the Helm chart values. 
