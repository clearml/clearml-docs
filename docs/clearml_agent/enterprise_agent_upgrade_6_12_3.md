---
title: Upgrading to Agent Chart v6.12.3 or greater
displayed_sidebar: installationSidebar
---

Starting with `clearml-enterprise-agent` chart version **6.12.3**, the bundled agent image 
(`clearml/clearml-enterprise-agent-k8s-base:1.31-*`, app version 1.31) runs as a non-root user:
* **UID:** `65532` (the standard `nonroot` user)  
* **Home directory:** `/home/nonroot`

This change applies **only** to the main agent pod. Task pods and any configurations under `basePodTemplate` or 
`templateOverrides` are not affected.

**Does this affect you?** 

This upgrade requires action only if your `values.yaml` contains any of the following:

* Volume mounts targeting paths under `/root`  
* Overrides for `runAsUser`, `runAsGroup`, or `fsGroup` in `containerSecurityContext`  
* A pinned agent image tag  
* A custom OpenShift SCC or platform-level UID policy

If none of these apply, the chart defaults take effect automatically and no changes are needed.

## Required Changes

1. **Volume Mounts and `extraVolumeMounts`**

   Update any mount paths that previously targeted `/root` on the main agent pod to the equivalent path under `/home/nonroot`. 
   For example:
    
   | Previous path | Updated path |
   | ----- | ----- |
   | `/root/.ssh` | `/home/nonroot/.ssh` |
   | `/root/.gitconfig` | `/home/nonroot/.gitconfig` |
   | `/root/some.conf` | `/home/nonroot/some.conf` |

2. **`containerSecurityContext` Overrides**

   If you have overridden `runAsUser`, `runAsGroup`, or `fsGroup` parameters, verify those values are compatible with 
   UID `65532`. Remove any `runAsUser: 0` — the agent image will not start as root. 

3. **File Permissions on Mounted Secrets, ConfigMaps, and PVCs**

   Ensure that UID `65532` has read access (and write access where required) to all mounted paths.

4. **Pinned Image Tags**

   Remove any previously pinned agent image tags, or update to `1.31-2.0.10-419`.

## Platform Considerations 

Some platforms enforce or override the UID a pod runs as, which may conflict with the fixed UID `65532`:
* Pod Security Admission with the `restricted` profile  
* Rancher / RKE2  
* VMware Tanzu  
* GKE Autopilot

If you are on one of these platforms, consult the platform's documentation.

### OpenShift

Earlier chart versions commonly ran under a permissive SCC that allowed root or a custom UID range. The rootless image 
will not start as root, and the chart now explicitly declares `runAsUser: 65532`. 

The recommended SCC for this version is `nonroot-v2`, which admits any non-zero UID as long as the pod explicitly 
declares one (which the chart does by default).

* Do **not** reuse `restricted-v2` with a custom UID range   
* Do **not** run the agent under `anyuid` to bypass the check.
