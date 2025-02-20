---
title: Kubernetes
---

To upgrade an existing ClearML Server Kubernetes deployment, see [here](upgrade_server_kubernetes_helm.md).

:::info
If ClearML Server is being reinstalled, clearing browser cookies for ClearML Server is recommended. For example, 
for Firefox, go to Developer Tools > Storage > Cookies, and for Chrome, go to Developer Tools > Application > Cookies,
and delete all cookies under the ClearML Server URL.
:::

## Prerequisites

* Set up a Kubernetes cluster - For setting up Kubernetes on various platforms refer to the Kubernetes [getting started guide](https://kubernetes.io/docs/setup).
* Set up a single node LOCAL Kubernetes on laptop / desktop - For setting up Kubernetes on your laptop/desktop, [kind](https://kind.sigs.k8s.io) is recommended.
* Install `helm` - Helm is a tool for managing Kubernetes charts. Charts are packages of pre-configured Kubernetes resources.
To install Helm, refer to the [Helm installation guide](https://helm.sh/docs/using_helm.html#installing-helm) in the Helm documentation.
Ensure that the `helm` binary is in the PATH of your shell.

## Deployment

You will create a multi-node Kubernetes cluster using Helm, and then install ClearML in your cluster. For deployment 
instructions with up-to-date Helms charts, see the [clearml-helm-charts repository](https://github.com/clearml/clearml-helm-charts/tree/main/charts/clearml#local-environment).

:::warning Server Access
By default, ClearML Server launches with unrestricted access. To restrict ClearML Server access, follow the 
instructions in the [Security](clearml_server_security.md) page.
:::


## Next Step

To keep track of your experiments and/or data, the `clearml` package needs to communicate with your server. 
For instruction to connect the ClearML SDK to the server, see [Getting Started: First Steps](../getting_started/ds/ds_first_steps.md).