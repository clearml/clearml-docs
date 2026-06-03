---
title: Application Instance Visibility Policy
---

By default, all users can see all application instances in the ClearML UI, but admins can change this policy per 
application or per tenant. 

## Default Visibility (All Applications)
Set the default visibility for all application instances using the `applications.app_instance_access.allowed` field in 
the `services.conf`, or the equivalent environment variable `CLEARML__services__applications__app_instance_access__allowed`. 

The value options are:
* `all` - All users can see application instances (default)
* `owner` - Only the user who launched the application instance can see it
* `group` - Allows the user launching the application instance to select whether to keep the instance private (visible 
  only to them) or allow  specific user groups to see it as well: The launch form will include a **Shared Access** 
  toggle; when enabled, the user can choose the groups to share the instance with. 

For example, to set the default visibility to group on Kubernetes, add the following to clearml-values.override.yaml: 

```
apiserver:
 extraEnvs:
   - name: CLEARML__services__applications__app_instance_access__allowed
     value: "group"
```

## Per-Application Overrides
To override the default visibility behavior for a specific application, use:
```
CLEARML__services__applications__app_instance_access__applications__<app_id>__allowed
```

Where `<app_id>` is the application ID.

:::tip[Finding App ID]
You can find an app ID in the following locations:
* In the application's app.conf file, under the id key. 
* In the application's UI page: 
  1. Click `+` to open the application launch form
  1. Hover over <img src="/docs/latest/icons/ico-info.svg" alt="Info" className="icon size-md space-sm" /> next to 
     **Show Form Spec**. The application ID appears in the tooltip under `App Key`.
:::

Supported values are the same as the global setting (`all`, `owner`, `group`). 

Kubernetes example:
```
apiserver:
  extraEnvs:
    - name: CLEARML__services__applications__app_instance_access__applications__hpo_app__allowed
      value: "owner"
```

## Multi-Tenant Configuration
In multi-tenant environments, you can configure application instance visibility per tenant. 

Use the [`system.update_company_app_instance_access`](../../references/enterprise/system.md#post-systemupdate_company_app_instance_access) 
API endpoint and provide the tenant (company) ID along with the visibility configuration. 

```
curl $APISERVER_URL/system.update_company_app_instance_access \
 -H "Content-Type: application/json" \
 -u $APISERVER_KEY:$APISERVER_SECRET \
 -d '{
   "company": "<company_id>",
   "app_instance_access": {
     "applications": {
       "<app_id>": {
         "allowed": "groups"
       }
     }
   }
 }'
```
