---
title: Dynamic Task Pod Templates
---

:::important Enterprise Feature
Dynamic task Pod templates are only supported by a ClearML Enterprise Server.
:::

ClearML Agent allows you to inject custom Python code to dynamically modify the Kubernetes Pod template before applying it. 


## Agent Configuration

The `CLEARML_K8S_GLUE_TEMPLATE_MODULE` environment variable defines the Python module and function inside that 
module to be invoked by the agent before applying a task pod template. 

The agent will run this code in its own context, pass arguments (including the actual template) to the function, and use 
the returned template to create the final Task Pod in Kubernetes.

Arguments passed to the function include:

* `queue` (string) - ID of the queue from which the task was pulled.
* `queue_name` (string) - Name of the queue from which the task was pulled.
* `template` (Python dictionary) - Base Pod template created from the agent's configuration and any queue-specific overrides.
* `task_data` (object) - [Task object](../references/sdk/task.md) (as returned by the `tasks.get_by_id` API call). For example, use `task_data.project` to get the task's project ID.
* `task_dict` (dictionary) - Dictionary representation of a [Task object](../references/sdk/task.md). Access fields with dictionary keys. For example: `task_dict['id']`
* `providers_info` (dictionary) - [Identity provider](../user_management/identity_providers.md) info containing optional information collected for the user running this task 
  when the user logged into the system (requires additional server configuration).
* `task_config` (`clearml_agent.backend_config.Config` object) - Task configuration containing configuration vaults applicable 
  for the user running this task, and other configuration. Use `task_config.get("...")` to get specific configuration values.
* `worker` - The agent Python object in case custom calls might be required.

### Usage

Update `clearml-agent-values.override.yaml` to include:

```yaml
agentk8sglue:
  extraEnvs:
   - name: CLEARML_K8S_GLUE_TEMPLATE_MODULE
     value: "custom_code:update_template"
  fileMounts:
    - name: "custom_code.py"
      folderPath: "/root"
      fileContent: |-
        import json
        from pprint import pformat 
        
        def update_template(queue, task_data, task_dict, providers_info, template, task_config, worker, queue_name, *args, **kwargs):
          print(pformat(template))
          
          my_var_name = "foo"
          my_var_value = "bar"
          
          try:
              template["spec"]["containers"][0]["env"][0]["name"] = str(my_var_name)
              template["spec"]["containers"][0]["env"][0]["value"] = str(my_var_value)
          except KeyError as ex:
              raise Exception("Failed modifying template: {}".format(ex))

          return {"template": template}
```

:::note notes
* Always include `*args, **kwargs` at the end of the function's argument list and only use keyword arguments. 
  This is needed to maintain backward compatibility.

* Custom code modules can be included as a file in the pod's container, and the environment variable can be used to
  point to the file and entry point.

* When defining a custom code module, by default the agent will start watching pods in all namespaces 
  across the cluster. If you do not intend to give a `ClusterRole` permission, make sure to set the 
  `CLEARML_K8S_GLUE_MONITOR_ALL_NAMESPACES` env to `"0"` to prevent the Agent from trying to list pods in all namespaces. 
  Instead, set it to `"1"` if namespace-related changes are needed in the code.

  ```yaml
  agentk8sglue:
    extraEnvs:
      - name: CLEARML_K8S_GLUE_MONITOR_ALL_NAMESPACES
        value: "0"
  ```

* To customize the bash startup scripts instead of the pod spec, use:

  ```yaml
  agentk8sglue:
    # -- Custom Bash script for the Agent pod ran by Glue Agent
    customBashScript: ""
    # -- Custom Bash script for the Task Pods ran by Glue Agent
    containerCustomBashScript: ""
  ```
:::


## Examples

### Example: Edit Template Based on ENV Var

```yaml
agentk8sglue:
  extraEnvs:
   - name: CLEARML_K8S_GLUE_TEMPLATE_MODULE
     value: "custom_code:update_template"
  fileMounts:
    - name: "custom_code.py"
      folderPath: "/root"
      fileContent: |-
        import json
        from pprint import pformat 
        def update_template(queue, task_data, task_dict, providers_info, template, task_config, worker, queue_name, *args, **kwargs):
          print(pformat(template))
          
          my_var = "some_var"
          
          try:
              template["spec"]["initContainers"][0]["command"][-1] = \
                  template["spec"]["initContainers"][0]["command"][-1].replace("MY_VAR", str(my_var))
              template["spec"]["containers"][0]["volumeMounts"][0]["subPath"] = str(my_var)
          except KeyError as ex:
              raise Exception("Failed modifying template with MY_VAR: {}".format(ex))

          return {"template": template}
  basePodTemplate:
    initContainers:
      - name: myInitContainer
        image: docker/ubuntu:18.04
        command:
          - /bin/bash
          - -c
          - >
            echo MY_VAR;
        volumeMounts:
        - name: myTemplatedMount
          mountPath: MY_VAR
    volumes:
      - name: myTemplatedMount
        emptyDir: {}
```

### Example: Inject NFS Mount Path

```yaml
agentk8sglue:
  extraEnvs:
   - name: CLEARML_K8S_GLUE_TEMPLATE_MODULE
     value: "custom_code:update_template"
  fileMounts:
    - name: "custom_code.py"
      folderPath: "/root"
      fileContent: |-
        import json
        from pprint import pformat
        def update_template(queue, task_data, task_dict, providers_info, template, task_config, worker, queue_name, *args, **kwargs):
            nfs = task_config.get("nfs")
            # ad_role = providers_info.get("ad-role")
            if nfs: # and ad_role == "some-value"
                print(pformat(template))
        
                try:
                    template["spec"]["containers"][0]["volumeMounts"].append(
                      {"name": "custom-mount", "mountPath": nfs.get("mountPath")}
                    )
                    template["spec"]["containers"][0]["volumes"].append(
                      {"name": "custom-mount", "nfs": {"server": nfs.get("server.ip"), "path": nfs.get("server.path")}}
                    )
                except KeyError as ex:
                    raise Exception("Failed modifying template: {}".format(ex))
        
            return {"template": template}
```

### Example: Bind PVC Resource to Task Pod

In this example, a PVC is created and attached to every pod created from a dedicated queue, then it is deleted.

Key points:

* `CLEARML_K8S_GLUE_POD_PRE_APPLY_CMD` and `CLEARML_K8S_GLUE_POD_POST_DELETE_CMD` env vars let you define custom bash 
  code hooks to be executed around the main apply command by the Agent, such as creating and deleting a PVC object.

* `CLEARML_K8S_GLUE_TEMPLATE_MODULE` env var and a file mount let you define custom Python code in a specific context, 
  useful to dynamically update the main Pod template before the Agent applies it.

* This example uses a queue named `pvc-test`, make sure to replace all occurrences of it.

* `CLEARML_K8S_GLUE_POD_PRE_APPLY_CMD` can reference templated vars such as `{queue_name}, {pod_name}, {namespace}` that will 
  be replaced with the actual values by the agent at execution time.

```yaml
agentk8sglue:
  # Bind a pre-defined custom 'custom-agent-role' Role with the ability to handle 'persistentvolumeclaims'
  additionalRoleBindings:
    - custom-agent-role
  extraEnvs:
    # Need this or permissions to list all namespaces
    - name: CLEARML_K8S_GLUE_MONITOR_ALL_NAMESPACES
      value: "0"
    # Executed before applying the Task Pod. Replace the $PVC_NAME placeholder in the manifest template with the Pod name and apply it, only in a specific queue.
    - name: CLEARML_K8S_GLUE_POD_PRE_APPLY_CMD
      value: "[[ {queue_name} == 'pvc-test' ]] && sed 's/\\$PVC_NAME/{pod_name}/g' /mnt/yaml-manifests/pvc.yaml | kubectl apply -n {namespace} -f - || echo 'Skipping PRE_APPLY PVC creation...'"
    # Executed after deleting the Task Pod. Delete the PVC.
    - name: CLEARML_K8S_GLUE_POD_POST_DELETE_CMD
      value: "kubectl delete pvc {pod_name} -n {namespace} || echo 'Skipping POST_DELETE PVC deletion...'"
    # Define a custom code module for updating the Pod template
    - name: CLEARML_K8S_GLUE_TEMPLATE_MODULE
      value: "custom_code:update_template"
  fileMounts:
    # Mount a PVC manifest file with a templated $PVC_NAME name
    - name: "pvc.yaml"
      folderPath: "/mnt/yaml-manifests"
      fileContent: |
        apiVersion: v1
        kind: PersistentVolumeClaim
        metadata:
          name: $PVC_NAME
        spec:
          resources:
            requests:
              storage: 5Gi
          volumeMode: Filesystem
          storageClassName: standard
          accessModes:
            - ReadWriteOnce
    # Custom code module for updating the Pod template
    - name: "custom_code.py"
      folderPath: "/root"
      fileContent: |-
        import json
        from pprint import pformat 
        def update_template(queue, task_data, task_dict, providers_info, template, task_config, worker, queue_name, *args, **kwargs):
          if queue_name == "pvc-test":
            # Set PVC_NAME as the name of the Pod
            PVC_NAME = f"clearml-id-{task_data.id}"
            try:
              # Replace the claimName placeholder with a dynamic value
              template["spec"]["volumes"][0]["persistentVolumeClaim"]["claimName"] = str(PVC_NAME)
            except KeyError as ex:
              raise Exception("Failed modifying template with PVC_NAME: {}".format(ex))
          # Return the edited template
          return {"template": template}
  createQueues: true
  queues:
    # Define a queue with an override `volumes` and `volumeMounts` section for binding a PVC
    pvc-test:
      templateOverrides:
        volumes:
          - name: task-pvc
            persistentVolumeClaim:
              # PVC_NAME placeholder. This will get replaced in the custom code module.
              claimName: PVC_NAME
        volumeMounts:
          - mountPath: "/tmp/task/"
            name: task-pvc
```

* The following is an example of `custom-agent-role` Role with permissions to handle `persistentvolumeclaims`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: custom-agent-role
rules:
- apiGroups:
  - ""
  resources:
  - persistentvolumeclaims
  verbs:
  - get
  - list
  - watch
  - create
  - patch
  - delete
```

