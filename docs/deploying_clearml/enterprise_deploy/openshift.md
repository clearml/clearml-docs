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

### Cluster Application Domain and TLS

Every OpenShift cluster includes a router that provides wildcard DNS and a wildcard TLS certificate for the
cluster's application domain (`*.apps.<CLUSTER_DOMAIN>`). Retrieve the cluster application domain name with:

```bash
oc get ingresses.config/cluster -o jsonpath='{.spec.domain}'
```

Hostnames placed directly under this domain (e.g. `api.apps.<CLUSTER_DOMAIN>`) resolve automatically and are
covered by the router's default certificate, so no DNS records or TLS secrets need to be provided. Hostnames
outside this domain (e.g. a company domain) require you to provide DNS records and a matching certificate
yourself (for example, with `external-dns` and `cert-manager`).

:::note
Set `clearml.cookieDomain` to the common parent domain shared by the three ClearML hostnames (e.g.
`clearml.<YOUR_DOMAIN>` when using `api./app./files.clearml.<YOUR_DOMAIN>`) . Otherwise, login sessions will 
not persist across services.
:::

### ClearML Server

#### Option 1: Using Kubernetes Ingress

The ClearML Helm chart supports Ingress creation out-of-the-box. On OpenShift, Ingress objects are served by the
built-in router, which converts them to Routes automatically. No extra Ingress Controller is needed. Adding the
`route.openshift.io/termination: "edge"` annotation configures the generated Route to terminate TLS at the router. If
the hostnames are under the cluster application domain, the router's default wildcard certificate is used and
`tlsSecretName` can be left empty.

```yaml
# values.yaml
clearml:
  cookieDomain: "clearml.<YOUR_DOMAIN>"

apiserver:
  ingress:
    enabled: true
    ingressClassName: ""  # Specify your ingress class if needed
    hostName: "api.clearml.<YOUR_DOMAIN>"
    tlsSecretName: ""      # Optionally provide a secret for TLS
    annotations:
      # TLS termination at the OpenShift router (uses the cluster wildcard certificate)
      route.openshift.io/termination: "edge"
      # Redirect plain HTTP requests to HTTPS
      haproxy.router.openshift.io/insecure_edge_termination_policy: "Redirect"

fileserver:
  ingress:
    enabled: true
    ingressClassName: ""
    hostName: "files.clearml.<YOUR_DOMAIN>"
    tlsSecretName: ""
    annotations:
      route.openshift.io/termination: "edge"
      haproxy.router.openshift.io/insecure_edge_termination_policy: "Redirect"
      # This translates the NGINX proxy-read-timeout and proxy-send-timeout (large artifact uploads).
      haproxy.router.openshift.io/timeout: 600s

webserver:
  ingress:
    enabled: true
    ingressClassName: ""
    hostName: "app.clearml.<YOUR_DOMAIN>"
    tlsSecretName: ""
    annotations:
      route.openshift.io/termination: "edge"
      haproxy.router.openshift.io/insecure_edge_termination_policy: "Redirect"
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
  host: files.clearml.<YOUR_DOMAIN>
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
  host: app.clearml.<YOUR_DOMAIN>
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

:::important
The OpenShift router rejects wildcard Routes by default (`wildcardPolicy: WildcardsDisallowed`). Enable wildcard
admission on the ingress controller before applying this Route:

```bash
oc -n openshift-ingress-operator patch ingresscontroller/default \
  --type=merge -p '{"spec":{"routeAdmission":{"wildcardPolicy":"WildcardsAllowed"}}}'
```
:::

```yaml
# clearml-enterprise-app-gateway-route.yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: clearml-enterprise-app-gateway
  namespace: clearml-tenant-a
spec:
  host: '*.appgw.clearml.<YOUR_DOMAIN>'
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

### Understanding Admission Warnings and Errors

OpenShift validates pods through two different mechanisms. Understanding the difference helps you identify whether a 
message is informational or indicates a deployment failure.
* **Pod Security Admission warnings** — messages like `Warning: would violate PodSecurity "restricted:latest"`
  printed during `helm install`/`upgrade`. On OpenShift these are **informational only**: admission is decided by
  SCCs, not by the PodSecurity profile, and SCCs mutate pods to inject most of the missing fields
  (`allowPrivilegeEscalation: false`, dropped capabilities, seccomp profile).
* **SCC errors** — events like `pods "..." is forbidden: unable to validate against any security context
  constraint` on a Deployment/StatefulSet/ReplicaSet. These are **real failures**: the pod was rejected and will
  not be created. The event lists, per SCC provider, the exact field that failed (e.g.
  `.containers[0].runAsUser: Invalid value: 65532: must be in the ranges: [1000840000, 1000849999]`).

The ClearML server images (`apiserver`, `fileserver`, `webserver`, `clearmlApplications`, `usageAggregator`) run
with a fixed non-root UID (`65532`), and their internal filesystem permissions are built for that user — they
are **not** designed to run with an arbitrary UID. The default `restricted-v2` SCC only accepts UIDs from the
namespace's assigned range, so these pods are rejected. The resolution differs by component type:

#### ClearML server components: grant the `nonroot-v2` SCC

`nonroot-v2` keeps all `restricted-v2` guarantees (no root, no privilege escalation, dropped capabilities) but
accepts any explicit non-root UID, letting the ClearML images keep the UID they were built for:

```bash
oc adm policy add-scc-to-group nonroot-v2 system:serviceaccounts:<NAMESPACE>
```

This grant also covers pods created by operators (e.g. the MongoDB operator) that cannot be adjusted through
Helm values. Do **not** instead unset the ClearML components' `runAsUser` in values: the pod would pass admission
with a random namespace-range UID, but the process would then fail at runtime on the image's internal file
permissions. Avoid granting `anyuid` unless a workload genuinely requires running as root: it also allows UID 0
and, having a higher SCC priority, silently takes over admission for every pod in the namespace.

#### Bundled dependencies: unset the pinned UIDs in `values.yaml`

The bundled dependency images (Dragonfly, Elasticsearch) support running with an arbitrary UID, so for them the
pinned UID/fsGroup can be set to `null`. OpenShift then assigns values from the namespace range and the pods
pass the default `restricted-v2` SCC without any grant. This is shown in the comprehensive example below.
(Setting a key to `null` in your values actively *deletes* the chart's default for that key — omitting the
section would keep the pinned default instead.)

MongoDB is managed by the MongoDB Controllers for Kubernetes operator (`mongodb.enabled: false` +
`mckMongodb.enabled: true`): its pods are created by the operator and are not configurable through chart
values — the `nonroot-v2` grant covers them.

:::note
`clearml-enterprise` chart versions up to 10.x bundled Redis (`redis` values key) and a MongoDB dependency chart
(`mongodb`) instead of Dragonfly and the operator. On those versions, apply the same `null` pattern to
`redis.master.podSecurityContext.fsGroup` / `redis.master.containerSecurityContext.runAsUser` and
`mongodb.podSecurityContext.fsGroup` / `mongodb.containerSecurityContext.runAsUser`.
:::

### ClearML Server Components

This is a comprehensive example configuration for the core ClearML Server services. It includes
* Disabling the default ingresses
* Setting the correct external URLs
* Applying the necessary security contexts for ClearML components, Dragonfly, and Elasticsearch to run in a non-root environment.

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

mongodb:
  enabled: false

mckMongodb:
  enabled: true
  migrated: true

dragonfly:
  podSecurityContext:
    fsGroup: null
  securityContext:
    runAsNonRoot: true
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
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

:::warning
The MongoDB settings above (`mongodb.enabled: false` + `mckMongodb.enabled: true` + `mckMongodb.migrated: true`) 
apply to a **fresh installation**, or to an environment where the migration from the Bitnami MongoDB chart to the 
MongoDB Controllers for Kubernetes operator has **already been completed**. Do not apply them to a running 
environment that has not been migrated yet: the apiserver would be pointed at a new, empty operator-managed 
MongoDB and the deployment would come up without its existing data. For an existing installation, first follow 
the [MCK MongoDB migration guide](k8s_mckmongo_migration.md).
:::

### Elasticsearch Notes

#### Disabled sysctl init container and `vm.max_map_count`

Setting `sysctlInitContainer.enabled: false` is required on OpenShift — that init container runs privileged as
root to raise `vm.max_map_count` on the node, which no default SCC allows. Without it, if the node's
`vm.max_map_count` is too low, Elasticsearch fails its bootstrap check with
`max virtual memory areas vm.max_map_count [65530] is too low` and crash-loops. In that case, configure
Elasticsearch to avoid mmap entirely by adding `node.store.allow_mmap: "false"` to `elasticsearch.extraEnvs`
(see the warning below), or raise the sysctl at the node level with a tuning configuration.

#### Overriding `elasticsearch.extraEnvs`

:::warning
Helm **replaces** list values instead of merging them. The chart's default `elasticsearch.extraEnvs` includes
`xpack.security.enabled: "false"`; if you provide your own `extraEnvs` without it, the chart considers
Elasticsearch security enabled and injects `CLEARML_ELASTIC_SERVICE_USERNAME`/`CLEARML_ELASTIC_SERVICE_PASSWORD`
into the apiserver — which then fails on startup with `MissingPasswordForElasticUser` (unless
`elasticsearch.secret.password` is set). Always copy the full default list from the chart's `values.yaml` and
append your entries, for example:
:::

```yaml
elasticsearch:
  extraEnvs:
    # Default entries from the chart's values.yaml — keep them when adding your own:
    - name: bootstrap.memory_lock
      value: "false"
    - name: cluster.routing.allocation.node_initial_primaries_recoveries
      value: "500"
    - name: cluster.routing.allocation.disk.watermark.low
      value: "500mb"
    - name: cluster.routing.allocation.disk.watermark.high
      value: "500mb"
    - name: cluster.routing.allocation.disk.watermark.flood_stage
      value: "500mb"
    - name: http.compression_level
      value: "7"
    - name: reindex.remote.whitelist
      value: '"*.*"'
    - name: xpack.security.enabled
      value: "false"
    # Additional entry for OpenShift, when vm.max_map_count cannot be raised on the node:
    - name: node.store.allow_mmap
      value: "false"
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

## Troubleshooting

### `Warning: would violate PodSecurity "restricted:latest"` during install

Informational only on OpenShift (see [Understanding Admission Warnings and Errors](#understanding-admission-warnings-and-errors)).
No action needed unless pods actually fail to start.

### `unable to validate against any security context constraint`

Found in namespace events (`oc get events`) or on the owning Deployment/StatefulSet. The pod was rejected by SCC
admission. Read the `restricted-v2` entries in the error message to identify the field that caused admission to fail:

* `runAsUser: Invalid value: <UID>: must be in the ranges: [...]` — a fixed non-root UID. For ClearML server
  components, grant `nonroot-v2` (the images must keep their built-in UID); for the bundled dependencies,
  `runAsUser: null` in values also works.
* `.initContainers[0].privileged: Invalid value: true` on the Elasticsearch pod — the sysctl init container is
  still enabled; set `elasticsearch.sysctlInitContainer.enabled: false`. Note that StatefulSets do not update
  retroactively: verify the change reached the cluster with
  `oc get sts <name> -o jsonpath='{.spec.template.spec.initContainers[*].name}'` and confirm the Helm release
  actually received your values (`helm get values <release>`).
* `.spec.securityContext.fsGroup: Invalid value` — set the component's `fsGroup: null` so OpenShift assigns it.

### Elasticsearch crash-loops with `vm.max_map_count [65530] is too low`

See [Disabled sysctl init container and `vm.max_map_count`](#disabled-sysctl-init-container-and-vmmax_map_count):
add `node.store.allow_mmap: "false"` to `elasticsearch.extraEnvs` (keeping the chart's default entries).

### Apiserver fails on startup with `MissingPasswordForElasticUser`

A custom `elasticsearch.extraEnvs` replaced the chart defaults and dropped `xpack.security.enabled: "false"`.
Restore the full default list (see [Overriding `elasticsearch.extraEnvs`](#overriding-elasticsearchextraenvs)),
or set `elasticsearch.secret.password` if you intend to run Elasticsearch with security enabled.

### Web UI loads but cannot reach the API after enabling TLS

Verify the following:
* Check `webserver.displayedServerURLs` and, if applications are enabled, the
  `clearmlApplications.*UrlReferenceOverride` values: they must use `https://` and the externally resolvable
  hostnames once TLS termination is in place.
* Confirm `clearml.cookieDomain` matches the parent domain of the
  hostnames, otherwise the login session cookie is not stored.

