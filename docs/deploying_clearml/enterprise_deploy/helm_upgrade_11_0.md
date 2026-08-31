---
title: Upgrading Helm Chart Deployment to v11.0.0 and Greater
displayed_sidebar: installationSidebar
---

The `clearml-enterprise` Helm chart v11.0.0 (ClearML Server v3.29) introduces a breaking change: all first-party
server containers now run as a non-root user (UID/GID `65532`). The
fileserver's persistent data, previously written as root, must be re-owned to this UID/GID before the upgraded
fileserver pod can read or write it.

:::important
This procedure is required when upgrading the `clearml-enterprise` chart from a 10.x version (server v3.28 or
earlier) to 11.x (server v3.29 or greater). Skipping the fileserver data ownership migration will cause the
fileserver pod to fail to start, or to fail reading and writing existing data.

During the upgrade process, services will be temporarily unavailable, so scheduling a dedicated maintenance window
is recommended.
:::

## Prerequisites

* `kubectl` access to the cluster, with permissions to scale deployments and create, exec into, and delete pods in
  the ClearML namespace
* A backup or snapshot of the fileserver PVC, taken before changing ownership
* The v11.0.0 (or later) `clearml-enterprise` chart and your existing values override file

## Procedure

### Step 1: Identify the Fileserver Resources

The commands in this procedure reference your namespace, release, and fileserver resources by name. Read these
values off the cluster rather than assuming the defaults, since they may have been customized during
installation.

Set your ClearML namespace (the default is `clearml`, but verify your actual namespace):

```
CLEARML_NAMESPACE=clearml
```

Confirm the release name, and that the currently installed chart is a 10.x version:

```
helm list -n $CLEARML_NAMESPACE
```

Find the fileserver's PVC and deployment:

```
kubectl -n $CLEARML_NAMESPACE get pvc | grep fileserver
kubectl -n $CLEARML_NAMESPACE get deploy | grep fileserver
```

Export the returned names. The rest of this procedure uses these variables:

```
CLEARML_RELEASE=<release-name>
FILESERVER_PVC=<pvc-name>
FILESERVER_DEPLOY=<deployment-name>
```

The fileserver's ServiceAccount is `clearml-fileserver`, derived from `<fileserver.serviceAccountName>-fileserver`.
If you overrode `fileserver.serviceAccountName` in your values file, substitute your own value in the pods below.
Naming a ServiceAccount that does not exist prevents the pod from starting.

:::note[PVC Naming]
Unless `fileserver.storage.data.existingPVC` is set in your values file, the PVC name follows the chart's
`fullname` convention: `<release>-clearml-enterprise-fileserver-data`, or `<release>-fileserver-data` when the
release name already contains `clearml-enterprise`. Use the name returned by `kubectl get pvc` rather than
constructing it.
:::

### Step 2: Scale Down the Fileserver

Note the fileserver's current replica count, so you can confirm it is restored after the upgrade:

```
kubectl -n $CLEARML_NAMESPACE get deploy $FILESERVER_DEPLOY -o jsonpath='{.spec.replicas}{"\n"}'
```

Scale the deployment down:

```
kubectl -n $CLEARML_NAMESPACE scale deploy $FILESERVER_DEPLOY --replicas=0
```

### Step 3: Re-own the Fileserver Data

Run a one-off pod that mounts the fileserver PVC and re-owns its contents to `65532:65532`. Create a YAML file
(e.g., `fileserver-chown.yaml`) with the following definition, replacing `<FILESERVER_PVC>` with the PVC name
from [Step 1](#step-1-identify-the-fileserver-resources):

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: fileserver-chown
spec:
  restartPolicy: Never
  serviceAccountName: clearml-fileserver
  securityContext:
    runAsUser: 0
    runAsGroup: 0
  containers:
    - name: chown
      image: busybox:1.36
      securityContext:
        runAsUser: 0
        allowPrivilegeEscalation: false
        capabilities:
          add: ["CHOWN", "FOWNER", "DAC_OVERRIDE"]
          drop: ["ALL"]
      command:
        - /bin/sh
        - -ec
        - |
          echo "Re-owning fileserver data to 65532:65532..."
          chown -R 65532:65532 /mnt/fileserver
          chmod -R u+rwX,g+rX /mnt/fileserver
          echo "Done."
      volumeMounts:
        - name: data
          mountPath: /mnt/fileserver
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: <FILESERVER_PVC>
```

Apply the file to your cluster, view the pod's logs, then delete the pod:

```
kubectl -n $CLEARML_NAMESPACE apply -f fileserver-chown.yaml
kubectl -n $CLEARML_NAMESPACE logs -f pod/fileserver-chown
kubectl -n $CLEARML_NAMESPACE delete pod fileserver-chown
```

:::note
On a large fileserver volume, the `chown` can take a while. Run it inside a long-lived pod or a tmux/nohup session, 
not an interactive shell that may disconnect.
:::

:::important
Re-own the fileserver's PVC only. The bundled dependencies (Elasticsearch, MongoDB, and Dragonfly/Redis) run under
their own UIDs, which the chart manages separately. Leave the ownership of their PVCs unchanged.
:::

### Step 4: Verify Ownership

Before deploying the new chart version, confirm that no files remain owned by root. Run a short-lived verification
pod against the same PVC:

```
kubectl -n $CLEARML_NAMESPACE run fileserver-verify --rm -it --restart=Never \
  --image=busybox:1.36 \
  --overrides='{
  "spec": {
    "serviceAccountName": "clearml-fileserver",
    "containers": [
      {
        "name": "fileserver-verify",
        "image": "busybox:1.36",
        "stdin": true,
        "tty": true,
        "command": ["find","/mnt/fileserver","(","!","-user","65532","-o","!","-group","65532",")","-print","-quit"],
        "volumeMounts": [ { "name": "data", "mountPath": "/mnt/fileserver" } ]
      }
    ],
    "volumes": [
      { "name": "data", "persistentVolumeClaim": { "claimName": "'"$FILESERVER_PVC"'" } }
    ]
  }
}'
```

:::note
The `--overrides` value is a single-quoted JSON string, so the quoting around `claimName` is deliberate: it closes
the single-quoted string, expands `$FILESERVER_PVC`, and reopens it. If you prefer, replace the whole expression
with the literal PVC name instead.
:::

An empty output means every file is correctly owned by `65532:65532` and you can proceed. Any path printed means
the `chown` did not finish, often because of a disconnected session on a large volume. Re-run [Step 3](#step-3-re-own-the-fileserver-data)
before continuing.

### Step 5: Deploy the New Chart Version

```
helm upgrade -i -n $CLEARML_NAMESPACE $CLEARML_RELEASE oci://docker.io/clearml/clearml-enterprise --create-namespace -f clearml-values.override.yaml
```

### Step 6: Verify the Deployment

* Confirm the chart and app version were updated:

  ```
  helm list -n $CLEARML_NAMESPACE
  ```

* Confirm all pods are running:

  ```
  kubectl -n $CLEARML_NAMESPACE get pods
  ```

* Confirm the fileserver was restored to the replica count noted in
  [Step 2](#step-2-scale-down-the-fileserver):

  ```
  kubectl -n $CLEARML_NAMESPACE get deploy $FILESERVER_DEPLOY
  ```

  The upgrade redeploys the fileserver at the replica count defined by your values file. If it is still at `0`,
  scale it back manually:

  ```
  kubectl -n $CLEARML_NAMESPACE scale deploy $FILESERVER_DEPLOY --replicas=<count-from-step-2>
  ```

* Confirm no fileserver files remain owned by a user other than `65532:65532`. As in
  [Step 4](#step-4-verify-ownership), empty output means the ownership is correct:

  ```
  kubectl -n $CLEARML_NAMESPACE exec deploy/$FILESERVER_DEPLOY -c clearml-fileserver -- \
    find /mnt/fileserver \( ! -user 65532 -o ! -group 65532 \) -print -quit
  ```
