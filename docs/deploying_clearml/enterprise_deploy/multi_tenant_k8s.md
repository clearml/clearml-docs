---
title: Multi-Tenant Service on Kubernetes 
---

This guide provides step-by-step instructions for installing a ClearML multi-tenant service on a Kubernetes cluster.

## ClearML Server

To install the ClearML Server, follow the [ClearML Kubernetes Installation guide](k8s.md).

Update the Server's `clearml-values.override.yaml` with the following values:

```yaml
apiserver:
  extraEnvs:
    - name: CLEARML__services__organization__features__user_management_advanced
      value: "true"
    - name: CLEARML__apiserver__company__unique_names
      value: "true"
```


For configuring SSO, see the [SSO (Identity Provider) Setup guide](../../user_management/identity_providers.md).

### Create a Tenant

This section explains how to create a new tenant (company) in the ClearML Server using the ClearML API.

Note that placeholders (`<PLACEHOLDER>`) in the following configuration should be substituted with a valid domain based 
on your installation values.

* **Define variables to use in the next steps:**

   ```bash
   APISERVER_URL="https://api.<BASE_DOMAIN>"
   APISERVER_KEY="<APISERVER_KEY>"
   APISERVER_SECRET="<APISERVER_SECRET>"
   ```

   :::note
   The apiserver key and secret should be the same as those used for installing the ClearML Enterprise Server Chart.
   :::

* **Create a Tenant (company):**

   ```bash
   curl $APISERVER_URL/system.create_company \
     -H "Content-Type: application/json" \
     -u $APISERVER_KEY:$APISERVER_SECRET \
     -d '{"name":"<TENANT_NAME>"}'
   ```

   The result returns the new Company ID (`<COMPANY_ID>`).

   To view existing tenants:

   ```bash
   curl -u $APISERVER_KEY:$APISERVER_SECRET $APISERVER_URL/system.get_companies
   ```

* **Create an Admin User for the Tenant:**

   ```bash
   curl $APISERVER_URL/auth.create_user \
     -H "Content-Type: application/json" \
     -u $APISERVER_KEY:$APISERVER_SECRET \
     -d '{"name":"<ADMIN_USER_NAME>","company":"<COMPANY_ID>","email":"<ADMIN_USER_EMAIL>","role":"admin","internal":"true"}'
   ```

   The result returns the new User ID (`<USER_ID>`).

* **Create Credentials for the new Admin User:**

   ```bash
   curl $APISERVER_URL/auth.create_credentials \
     -H "Content-Type: application/json" \
     -H "X-Clearml-Impersonate-As: <USER_ID>" \
     -u $APISERVER_KEY:$APISERVER_SECRET
   ```

   The result returns a set of key and secret credentials associated with the new Admin User.

   :::note 
   You can use this set of credentials to set up a [ClearML Agent](../../clearml_agent/clearml_agent_deployment_k8s.md#agent-with-an-enterprise-server) 
   or [App Gateway](appgw.md) for the new Tenant.
   :::

#### Create IDP/SSO Sign-in Rules

You can configure how new users are assigned to tenants upon first signing in to the system using one or more of the 
following methods:

* **Route an email to a tenant based on the email's domain:**

   Automatically assign new users to a tenant based on their email domain.

   :::caution
   Note that providing the same domain name for multiple tenants will result in unstable behavior and should be avoided.
   :::

   ```bash
   curl $APISERVER_URL/login.set_domains \
     -H "Content-Type: application/json" \
     -H "X-Clearml-Act-As: <USER_ID>" \
     -u $APISERVER_KEY:$APISERVER_SECRET \
     -d '{"domains":["<USERS_EMAIL_DOMAIN>"]}'
   ```

   * `<USERS_EMAIL_DOMAIN>` is the email domain set up for users to access through SSO (e.g. `"acme.io"`, `"clear.ml"`).
   * All new users with matching domains will be routed to the associated tenant.

* **Route specific email(s) to a tenant:**

   Assign specific email addresses to a tenant. You can 
   use the `is_admin` property to choose whether these users will be set as admins in this tenant upon login.

   Note that you can create more than one list per tenant (using multiple API calls). This way you can create one list 
   for admin users and another for non-admin users.

   :::caution
   Note that including the same email address in more than a single tenant's list will result in unstable behavior and 
   should be avoided.
   :::

   ```bash
   curl $APISERVER_URL/login.add_whitelist_entries \
     -H "Content-Type: application/json" \
     -H "X-Clearml-Act-As: <USER_ID>" \
     -u $APISERVER_KEY:$APISERVER_SECRET \
     -d '{"emails":["<email1>", "<email2>", ...],"is_admin":false}'
   ```

   To remove an email(s) from these lists, use the following API call. Note that this will not affect a user who has 
   already logged in using one of these email addresses:

   ```bash
   curl $APISERVER_URL/login.remove_whitelist_entries \
     -H "Content-Type: application/json" \
     -H "X-Clearml-Act-As: <USER_ID>" \
     -u $APISERVER_KEY:$APISERVER_SECRET \
     -d '{"emails":["<email1>", "<email2>", ...]}'
   ```

##### View Current Login Routing Rules

To get the current IDP/SSO login rule settings for this tenant:
 
```bash
curl $APISERVER_URL/login.get_settings \
  -H "X-Clearml-Act-As: <USER_ID>" \
  -u $APISERVER_KEY:$APISERVER_SECRET
```

### Feature Control by User Group

The server's `clearml-values.override.yaml` can control the features available to 
some users or groups in the system.

Example: with the following configuration, all users in the `users` group will only have the `applications` feature enabled.

```yaml
apiserver:
  extraEnvs:
    - name: CLEARML__services__auth__default_groups__users__features
      value: "[\"applications\"]"
```

See a list of available features under [Available Features](#available-features).

## Workers

To install and configure the ClearML components that run user workloads, refer to:
* [ClearML Enterprise Agent](../../clearml_agent/clearml_agent_deployment_k8s.md#agent-with-an-enterprise-server)
* [App Gateway](appgw.md).

:::note
Make sure to set up Agent and App Gateway using a Tenant's admin user credentials created with the Tenant creation APIs 
described [above](#create-a-tenant).
:::

### Tenant Separation

In multi-tenant setups, you can separate the tenant workers in different namespaces:

* Create a Kubernetes Namespace for each tenant 
* Deploy a dedicated ClearML Agent and AI Application Gateway in each Namespace.
* Configure a tenant Agent and Gateway with credentials created on the ClearML Server by a user of the same tenant.

Additional network separation can be achieved via Kubernetes Network Policies.

## Additional Configuration

### Override Options for New Tenants

When creating a new tenant company, you can configure the following tenant options:

* `features` - Add features to a company.
* `exclude_features` - Exclude features from a company.
* `allowed_users` - Set the maximum number of users for a company.

```bash
curl $APISERVER_URL/system.create_company \
  -H "Content-Type: application/json" \
  -u $APISERVER_KEY:$APISERVER_SECRET \
  -d '{"name":"<TENANT_NAME>", "defaults": { "allowed_users": "10", "features": ["experiments"], "exclude_features": ["app_management", "applications", "user_management"] }}'
```

### Global Features Limits

The following setting in `clearml-values.override.yaml` defines a global feature whitelist. It overrides all tenant-specific 
configurations, ensuring that only the listed features are available to any user in the system.

Example: Restrict all users to only the `applications` feature:

```yaml
apiserver:
  extraEnvs:
    - name: CLEARML__services__auth__default_groups__users__features
      value: "[\"applications\"]"
```

For the complete list of available features, see [Available Features](#available-features).

### Configuring Groups

ClearML groups are used to control user permissions and access to platform. 
This section describes the types of groups available and how to configure them--especially cross-tenant groups.

#### Group Types

ClearML utilizes several types of groups:
* **Built-in Groups** (default in every ClearML installation):
  * **`users`**: All registered users belong to this group. It defines the baseline set of 
  permissions and features available to everyone.  
  * **`admins`**: Users in this group have administrative privileges.  
  * **`queue_admins`**: Users in this group can manage task execution queues.
* **Tenant-Specific Groups (via UI)** - Additional tenant-specific groups can be created
  directly through the ClearML Web UI (under **Settings > Users & Groups**). Users can be assigned to these groups via 
  the UI. For more information, see [Users & Groups](../../webapp/settings/webapp_settings_users.md).
* **Cross-Tenant Groups (Configuration)** - These groups are defined centrally in the ClearML configuration files 
  (e.g., Helm chart values, docker-compose environment variables). They offer several advantages:
  * Reusable across tenants
  * Fine-grained control over enabled features

#### Configuring Cross-Tenant Groups

Cross-tenant groups are defined using environment variables (e.g., in `apiserver`). The naming convention is: 

```
CLEARML__services__auth__default_groups__<GroupName>__<Property>
```

Replace `<GroupName>` with the desired name for your group (e.g., `my_group_name`, `Data_Scientists`, `MLOps_Engineers`).

##### Configuration Variables

For each group you define in the configuration, you need to specify the following properties:

| Property     | Description                                                                | Variable Name                         | Example Value                   |
| ------------ | -------------------------------------------------------------------------- | ------------------------------------ | ------------------------------- |
| `id`         | A unique identifier for the group. This **must** be a standard UUID (Universally Unique Identifier). You can generate one using various online tools or libraries. | `CLEARML__services__auth__default_groups__<GroupName>__id` | `"abcd-1234-abcd-1234"` |
| `name`       | Display name for the group (should match `<GroupName>` used in the variable path) | `CLEARML__services__auth__default_groups__<GroupName>__name` | `"My Group Name"`, `"MLOps Team"`  |
| `features`   | JSON list of features to enable for this group . For the complete list of available features, see [Available Features](#available-features). Note that the features must be defined for the tenant or for the entire server in order to affect the group. By default, all the features of the tenant are available to all users. | `CLEARML__services__auth__default_groups__<GroupName>__features` | `'["applications", "experiments", "pipelines", "reports", "show_dashboard", "show_projects"]'` (Note the single quotes wrapping the JSON string if setting via YAML/environment variables). |
| `assignable` | Whether admins can assign users to this group from the ClearML Web UI (`true`/`false`). If `false`, group membership is managed externally or implicitly. | `CLEARML__services__auth__default_groups__<GroupName>__assignable` | `"false"`                       |
| `system`     | Always set to `"false"` for custom groups | `CLEARML__services__auth__default_groups__<GroupName>__system` | `"false"`                       |


##### Example Configuration

The following example demonstrates how you would define a group named `my_group_name` with a specific set of features 
that cannot be assigned via the UI:

```yaml
# Example configuration snippet (e.g., in Helm values.yaml or compose.yaml environment section)

# Unique group id for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__id
  value: "abcd-1234-abcd-1234" # Replace with a newly generated UUID

# Group name for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__name
  value: "My Group Name"

# List of features for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__features
  value: '["applications", "experiments", "queues", "pipelines", "reports", "show_dashboard","show_projects"]'

# Prevent assignment via UI for my_group_name
- name: CLEARML__services__auth__default_groups__my_group_name__assignable
  value: "false"

# Always false for custom groups
- name: CLEARML__services__auth__default_groups__my_group_name__system
  value: "false"
```

### Feature Assignment Strategy

ClearML uses a feature-based permission model, where each user’s access is determined by the groups they belong to. 
This section explains how feature assignment works and how to configure it effectively.

#### Combining Features

If a user belongs to multiple groups (e.g., the default `users` group and a custom `my_group_name` group), their 
effective feature set is the **union** (combination) of all features from all groups they belong to.

#### Configuring the Default 'users' Group

Since all users belong to the `users` group, you should configure the `users` group 
appropriately. You generally have two options:

1. **Minimum Shared Features:** Only assign features that every user should always have.  
2. **Empty Feature Set:** Assign an empty list (`[]`) to the `users` group's features. This means users only get features 
   explicitly granted to groups they are members of.

   ```yaml
   - name: CLEARML__services__auth__default_groups__users__features
     value: '[]'
   ```

:::note
For built-in groups like users, you typically only need to define the `features` property. You do not need to redefine 
`id`, `name`, `assignable`, or `system` unless you need to override defaults.
:::


#### Setting Server-Level or Tenant-level Features

To assign a feature to a group, that feature must first be enabled globally (server-level) or per tenant.

##### Enabling Features Globally
To enable a feature for the entire deployment, use: 

```
CLEARML__services__organization__features__<FeatureName>
```

Setting one of these variables to `"true"` enables the feature globally.

**Example: Enabling `user_management_advanced` for the entire organization:**

```yaml
- name: CLEARML__services__organization__features__user_management_advanced
  value: "true"
```

##### Enabling Features Per Tenant 

To enable a feature for a specific tenant, use the following API call:

```bash
curl $APISERVER_URL/system.update_company_settings \                                                  
 -H "Content-Type: application/json" \   
 -u $APISERVER_KEY:$APISERVER_SECRET \
 -d '{                      
   "company": "<company_id>",
   "features": ["sso_management", "user_management_advanced", ...]
}'
```

By default, all users have access to all features. You can restrict this by explicitly setting feature lists per group.

#### Example: Granting All Features for Admins

While the `admins` group has inherent administrative privileges, you might want to explicitly ensure they have access to 
*all* configurable features defined via the `features` list, especially if you've restricted the default `users` group 
significantly. You might also need to enable certain features organization-wide.

```yaml
# Enable advanced user management for the whole organization
- name: CLEARML__services__organization__features__user_management_advanced
  value: "true"

# (Optional but good practice) Explicitly assign all features to the built-in admins group
- name: CLEARML__services__auth__default_groups__admins__features
  value: '["user_management", "user_management_advanced", "permissions", "applications", "app_management", "queues", "queue_management", "data_management", "config_vault", "pipelines", "reports", "resource_dashboard", "sso_management", "service_users", "resource_policy", "model_serving", "show_dashboard", "show_model_view", "show_projects"]' # List all relevant features

# You might still want to define other custom groups with fewer features...
# - name: CLEARML__services__auth__default_groups__my_group_name__id
#   value: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" # Replace with a newly generated UUID
# - name: CLEARML__services__auth__default_groups__my_group_name__name
#   value: "my_group_name"
# - name: CLEARML__services__auth__default_groups__my_group_name__features
#   value: '["some_feature", "another_feature"]'
# - name: CLEARML__services__auth__default_groups__my_group_name__assignable
#   value: "false"
# - name: CLEARML__services__auth__default_groups__my_group_name__system
#   value: "false"
```

By combining configuration-defined groups, careful management of the default users group features, and organization-level 
settings, you can create a flexible and secure permission model tailored to your ClearML deployment. 

:::important
Remember to restart the relevant ClearML services after applying configuration changes.
:::

### Per-Tenant Applications Settings

You may want your users' applications in different tenants to have their own configuration and template on Kubernetes. 
The ClearML Enterprise Server and Agent support different queue modes:

- `global` (default) - A single Apps Agent on the server. The application's controllers will start on the server.
- `per_tenant` - Multiple Apps Agents, one per tenant (will need `agentk8sglue.appsQueue.enabled=true` on Agents). The 
   application's controllers will start on the worker.

Configure the Server's `clearml-values.override.yaml`:

```yaml
clearmlApplications:
  queueMode: "per_tenant"
```

Configure the Agent's `clearml-agent-values.override.yaml`:

```yaml
agentk8sglue:
  appsQueue:
    enabled: true
    # -- Here you can define queueSettings and templateOverrides as for other queues.
    # queueSettings: 
    # templateOverrides: 
```

:::note
This feature requires the Agent to be configured using an internal admin credentials as previously mentioned in the 
"Create an Admin User for the new tenant" section, making sure to pass `"internal":"true"` and using the output
credentials for `clearml.agentk8sglueKey` and `clearml.agentk8sglueSecret` (or `existingAgentk8sglueSecret`).
:::

## Available Features

The following features can be assigned to groups via the `features` configuration variable:

| Feature Name | Description | Notes |
| :---- | :---- | :---- |
| `user_management` | Allows viewing tenant users and groups, and editing group memberships. | Only effective if the group is `assignable`. |
| `user_management_advanced` | Allows direct creation of users (bypassing invites) by admins and system users. | Often also requires enabling at the organization level. |
| `permissions` | Enables editing of Role-Based Access Control (RBAC) rules. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `applications` | Allows users to work with [ClearML Applications](../../webapp/applications/apps_overview.md) (viewing, running). | Excludes management operations (upload/delete). |
| `app_management` | Allows application management operations: upload, delete, enable, disable. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `experiments` | Allows working with experiments. | *Deprecated/Not Used.* All users have access regardless of this flag. |
| `queues` | Allows working with queues. | *Deprecated/Not Used.* All users have access regardless of this flag. |
| `queue_management` | Allows create, update, and delete operations on queues. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `data_management` | Controls access to [Hyper-Datasets](../../hyperdatasets/overview.md). | Access may also depend on `apiserver.services.excluded`. |
| `config_vault` | Enables the [configuration vaults](../../webapp/settings/webapp_settings_profile.md#configuration-vault) feature. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `pipelines` | Enables access to Pipelines (building and running). | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `reports` | Enables access to [Reports](../../webapp/webapp_reports.md). | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `resource_dashboard` | Enables access to the [orchestration dashboard](../../webapp/webapp_orchestration_dash.md) feature. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `sso_management` | Enables the SSO (Single Sign-On) configuration wizard. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `service_users` | Enables support for creating and managing service accounts (API keys). | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `resource_policy` | Enables the [Resource Policies](../../webapp/resource_policies.md) feature. | May default to a trial feature if not explicitly enabled. |
| `model_serving` | Enables access to the [Model Endpoints](../../webapp/webapp_model_endpoints.md) feature. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_dashboard` | Makes the "Dashboard" menu item visible in the UI sidebar. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_model_view` | Makes the "Models" menu item visible in the UI sidebar. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_projects` | Makes the "Projects" menu item visible in the UI sidebar. | <img src="/docs/latest/icons/ico-optional-no.svg" alt="No" className="icon size-md center-md" /> |
| `show_orchestration` | Makes the "Orchestration" menu item visible in the UI sidebar. | Available from apiserver version 3.25 |
| `show_datasets` | Makes the "Datasets" menu item visible in the UI sidebar. | Available from apiserver version 3.25 |