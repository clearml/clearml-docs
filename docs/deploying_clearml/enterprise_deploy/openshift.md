---
title: OpenShift
---

This guide provides instructions for installing ClearML Server in an OpenShift environment, focusing on network 
configuration and security contexts.

## Installation

To install ClearML on OpenShift, start with the [ClearML Server Kubernetes Deployment guide](k8s.md). 
After completing the standard installation, extend it with the OpenShift-specific networking and security configurations 
outlined below. 

## Networking Configuration

You can expose the ClearML services using one of the following: 
* Standard Kubernetes Ingress objects 
* OpenShift's native Route resources. 

### ClearML Server

#### Option 1: Using Kubernetes Ingress

The ClearML Helm chart supports Ingress creation out-of-the-box. If your cluster is configured to use a standard Ingress 
Controller, enable it with the following snippet in your `values.yaml` file.

```yaml
# values.yaml
apiserver:
  ingress:
    enabled: true
    ingressClassName: ""  # Specify your ingress class if needed
    hostName: "api.clearml.<YOUR_DOMAIN>"
    tlsSecretName: ""      # Optionally provide a secret for TLS

fileserver:
  ingress:
    enabled: true
    ingressClassName: ""
    hostName: "files.clearml.<YOUR_DOMAIN>"
    tlsSecretName: ""

webserver:
  ingress:
    enabled: true
    ingressClassName: ""
    hostName: "app.clearml.<YOUR_DOMAIN>"
    tlsSecretName: ""
```

#### Option 2: Using OpenShift Routes

To use Routes, you need to disable the default Ingress creation in the Helm chart, and then create the Route objects manually.

##### Step 1: Disable Ingress in Helm Chart

Set `enabled: false` for all ingresses in your `values.yaml` file:

```yaml
# values.yaml
apiserver:
  ingress:
    enabled: false

fileserver:
  ingress:
    enabled: false

webserver:
  ingress:
    enabled: false

```

##### Step 2: Create the Route Objects

Create a YAML file (e.g., `clearml-routes.yaml`) with the following definitions to configure Routes for the ClearML 
services. This single file defines all three required routes.

```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: clearml-enterprise-apiserver
  namespace: clearml
spec:
  host: api.clearml.<YOUR_DOMAIN>
  path: /
  to:
    kind: Service
    name: clearml-clearml-enterprise-apiserver
    weight: 100
  port:
    targetPort: 8008
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect

---

apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: clearml-enterprise-fileserver
  namespace: clearml
  annotations:
    # This translates the NGINX proxy-read-timeout and proxy-send-timeout.
    haproxy.router.openshift.io/timeout: 600s
spec:
  host: files.clearml.127-0-0-1.nip.io
  path: /
  to:
    kind: Service
    name: clearml-clearml-enterprise-fileserver
    weight: 100
  port:
    targetPort: 8081
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect

---

apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: clearml-enterprise-webserver
  namespace: clearml
spec:
  host: app.clearml.127-0-0-1.nip.io
  path: /
  to:
    kind: Service
    name: clearml-clearml-enterprise-webserver
    weight: 100
  port:
    targetPort: 8080
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

Apply the configuration to your cluster: 

```bash
oc apply -f clearml-routes.yaml
```

### ClearML Application Gateway

#### Option 1: Using Kubernetes Ingress

Enable the Ingress for the Application Gateway with the following `values.yaml` snippet. Make sure to replace the example `hostname`
with your desired hostname.

```yaml
# values.yaml
ingress:
  enabled: true
  className: ""
  hostname: "appgw.clearml.<YOUR_DOMAIN>"
  tlsSecretName: "" # Optionally provide a secret for TLS
```

#### Option 2: Using OpenShift Routes

To use Routes, you need to disable the default Ingress creation in the Helm chart, and then create the Route objects manually.

##### Step 1: Disable Ingress in Helm Chart

Set `enabled: false` for all ingresses in your `values.yaml` file:

```yaml
# values.yaml
ingress:
  enabled: false
```

##### Step 2: Create the Route Object

The following Route definition uses a wildcard host, which securely exposes both the primary gateway URL and any
subdomains it requires. Create a file named `clearml-enterprise-app-gateway-route.yaml`. Make sure to replace the example `spec.host`
with the desired hostname. 

```yaml
# clearml-enterprise-app-gateway-route.yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: clearml-enterprise-app-gateway
  namespace: clearml-tenant-a
spec:
  host: '*.appgw.clearml.127-0-0-1.nip.io'
  path: /
  to:
    kind: Service
    name: clearml-enterprise-app-gateway
    weight: 100
  port:
    targetPort: 8080
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

Apply the file to your cluster:
```bash
oc apply -f clearml-enterprise-app-gateway-route.yaml
```

## Security Context Configuration for Restricted Environments

If your OpenShift cluster enforces a restrictive security context (requiring containers to run as non-root users) with 
randomized UID, you must add specific security configurations to your `values.yaml`.

### ClearML Server Components

This is a comprehensive example configuration for the core ClearML Server services. It includes 
* Disabling the default ingresses
* Setting the correct external URLs
* Applying the necessary security contexts for ClearML components, Redis, MongoDB, and Elasticsearch to run in a non-root environment.

```yaml
apiserver:
  ingress:
    enabled: false

fileserver:
  ingress:
    enabled: false

webserver:
  ingress:
    enabled: false
  displayedServerURLs:
    apiserver: "https://api.clearml.<YOUR_DOMAIN>"
    fileserver: "https://files.clearml.<YOUR_DOMAIN>"

clearmlApplications:
  enabled: true
  maxPods: 20
  webServerUrlReferenceOverride: "http://clearml-enterprise-webserver:8080"
  fileServerUrlReferenceOverride: "http://clearml-enterprise-fileserver:8081"
  apiServerUrlReferenceOverride: "http://clearml-enterprise-apiserver:8008"
  containerSecurityContext:
    runAsNonRoot: true
    allowPrivilegeEscalation: false
    capabilities:
      drop: ["ALL"]
    seccompProfile:
      type: RuntimeDefault
  containerCustomBashScript: |
    export HOME=/tmp
    declare LOCAL_PYTHON
    [ ! -z $LOCAL_PYTHON ] || for i in {{20..5}}; do (which python3.$i 2> /dev/null || command -v python3.$i) && python3.$i -m pip --version && export LOCAL_PYTHON=$(which python3.$i 2> /dev/null || command -v python3.$i) && break ; done
    [ ! -z $LOCAL_PYTHON ] || export LOCAL_PYTHON=python3
    {extra_bash_init_cmd}
    [ ! -z $CLEARML_AGENT_NO_UPDATE ] || $LOCAL_PYTHON -m pip install clearml-agent{agent_install_args}
    {extra_docker_bash_script}
    $LOCAL_PYTHON -m clearml_agent execute {default_execution_agent_args} --id {task_id}
  extraEnvs:
    - name: CLEARML_K8S_GLUE_START_AGENT_SCRIPT_PATH
      value: /tmp/__start_agent__.sh
    - name: HOME
      value: /tmp

redis:
  master:
    podSecurityContext:
      fsGroup: null
    containerSecurityContext:
      runAsUser: null
      runAsNonRoot: true
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
      seccompProfile:
        type: RuntimeDefault

mongodb:
  podSecurityContext:
    fsGroup: null
  containerSecurityContext:
    enabled: true
    runAsUser: null
    runAsNonRoot: true
    allowPrivilegeEscalation: false
    capabilities:
      drop: ["ALL"]
    seccompProfile:
      type: RuntimeDefault

elasticsearch:
  sysctlInitContainer:
    enabled: false
  podSecurityContext:
    fsGroup: null
    runAsUser: null
  securityContext:
    runAsNonRoot: true
    allowPrivilegeEscalation: false
    capabilities:
      drop: ["ALL"]
    seccompProfile:
      type: RuntimeDefault
    runAsUser: null
```

### ClearML Kubernetes Agent

To install the ClearML Kubernetes Agent (`agent-k8s-glue`), you must apply a restrictive security context to both 
the agent's controller pod and the task pods it creates:

```yaml
agentk8sglue:
  containerSecurityContext:
    runAsNonRoot: true
    allowPrivilegeEscalation: false
    capabilities:
      drop: ["ALL"]
    seccompProfile:
      type: RuntimeDefault
  containerCustomBashScript: |
    export HOME=/tmp
    declare LOCAL_PYTHON
    [ ! -z $LOCAL_PYTHON ] || for i in {{20..5}}; do (which python3.$i 2> /dev/null || command -v python3.$i) && python3.$i -m pip --version && export LOCAL_PYTHON=$(which python3.$i 2> /dev/null || command -v python3.$i) && break ; done
    [ ! -z $LOCAL_PYTHON ] || export LOCAL_PYTHON=python3
    {extra_bash_init_cmd}
    [ ! -z $CLEARML_AGENT_NO_UPDATE ] || $LOCAL_PYTHON -m pip install clearml-agent{agent_install_args}
    {extra_docker_bash_script}
    $LOCAL_PYTHON -m clearml_agent execute {default_execution_agent_args} --id {task_id}
  extraEnvs:
    - name: CLEARML_K8S_GLUE_START_AGENT_SCRIPT_PATH
      value: /tmp/__start_agent__.sh

  basePodTemplate:
    env:
      - name: HOME
        value: /tmp
    containerSecurityContext:
      runAsNonRoot: true
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
      seccompProfile:
        type: RuntimeDefault
```

