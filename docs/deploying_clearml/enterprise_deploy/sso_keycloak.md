---
title: KeyCloak IdP Configuration
---

This procedure is a step-by-step guide of the configuration process for the ClearML Enterprise Server with the KeyCloak IdP.

In the following sections, the term "publicly accessible" does not have to mean open to the entire world or publicly 
accessible from the Internet, it simply means accessible to your users from their workstations (typically when using a 
browser).

In the following sections, you will be instructed to set up different environment variables for the ClearML Server. If 
using a `docker-compose` deployment, these should be defined in your `docker-compose.override.yaml` file, under the 
`apiserver` service’ environment variables, as follows:

```
services:
  ...
  apiserver:
    ...
    environment:
      <name>=<value>
      ...
```

If using a Kubernetes deployment, these should be set in the ClearML Enterprise server chart values override file, under 
the `.Values.apiserver.extraEnvs` array section, as follows:

```
...
apiserver:
  extraEnvs:
    - name: <name>
      value: "<value>"
    - ...

```

All examples below are provided in the Kubernetes format.

## Prerequisites

* An existing ClearML Enterprise server / control-plane installation (using `docker-compose` or Kubernetes), which is 
set up with a publicly accessible endpoint fo the ClearML WebApp  
* A KeyCloak IdP installed with a publicly accessible endpoint, with you as admin having access to the KeyCloak administration UI.

## Configuration 

### Basic Setup

#### KeyCloak Configuration

In the KeyCloak administration UI:

1. Register a new ClearML app with the callback url: `<ClearML_webapp_address>/callback_keycloak`  
2. Make sure that the claims representing `user_id`, `email` and `user name` are returned  
3. Make a note of the `client_id`, `client_secret`, `Auth url` and `Access token url` for configuration in the ClearML Server.

#### ClearML Server Configuration

In the ClearML Server deployment, set the environment variables specified below.

##### KeyCloak Base URL

Use the start of the token or authorization endpoint, usually the part just before `protocol/openid-connect/...`

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__base_url
  value: "<base url>"
```

##### KeyCloak Authorization Endpoint

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__authorize_url
  value: "<authorization endpoint>"
```

##### KeyCloak Access Token Endpoint

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__access_token_url
  value: "<token endpoint>"
```

##### KeyCloak Client ID 

The client ID is obtained when creating the KeyCloak ClearML App.

```
- name: CLEARML__secure__login__sso__oauth_client__keycloak__client_id
  value: "<clinet_id>"
```

##### KeyCloak Client Secret

The client secret is obtained when creating the KeyCloak ClearML App.

```
- name: CLEARML__secure__login__sso__oauth_client__keycloak__client_secret
  value: "<client_secret>"
```

##### Automatic User Creation Support

Usually, when using IdPs in ClearML, the ClearML Server will map users signing in to the server into tenants (companies) 
using predefined whitelists and specific invitations (users explicitly added by admins).  

To support automatic user creation in a trusted environment, where all users signing in using this IdP are automatically 
added to the same tenant (company), the following environment variable should be set:

```
- name: CLEARML__secure__login__sso__oauth_client__keycloak__default_company
  value: "<company_id>"
```

### User Groups Integration

This option allows automatically synchronizing group membership from KeyCloak into existing ClearML User Groups when 
logging in users (this is done on every user login, not just on user sign-in).  

Make sure a ClearML User Group exists for each potential KeyCloak group that should be synchronized to 
prevent an uncontrolled proliferation of user groups. The ClearML server will not automatically create user groups in 
this mode.

#### Keycloak Configuration

* When configuring the Open ID client for ClearML:  
  * Navigate to the `Client Scopes` tab  
  * Click on the first row `<clearml client>-dedicated`  
  * Click `Add Mapper → By configuration` and then select the `Group membership` option  
  * In the opened dialog enter the name `groups` and Token claim name `groups`  
  * Uncheck the `Full group path` option and save the mapper  
* To validate yourself:  
  * Return to the `Client Details → Client` scope tab  
  * Go to the `Evaluate` sub-tab and select a user that has any group memberships  
  * On the right side navigate to `Generated ID` token and then to `Generated User Info`  
  * Inspect that in both cases you can see the groups claim in the displayed user data

#### ClearML Server Configuration

Set the following environment variables for the `apiserver` service:

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__groups__enabled
  value: "true"
- name: CLEARML__services__login__sso__oauth_client__keycloak__groups__claim
  value: "groups"
- name: CLEARML__services__login__sso__oauth_client__keycloak__claims__name
  value: "preferred_username"
```

##### Setting Administrators by Group Association

In case you would like the members of the particular KeyCloak group to be set as administrators in ClearML, set the 
following environment variable. Note that in this case, the KeyCloak group(s) do not have to be present in the ClearML Server.

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__groups__admins
  value: "[\"<the name of admin group from Keycloak>\"]"
```

##### Restrict User Signup

To prevent sign in for users who do not have a matching group(s) found using the above-mentioned configuration, set the 
following environment variable.

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__groups__prohibit_user_signup_if_not_in_group
  value: "true"
```

### Administrator User Role Association

For integration of an admin user role from KeyCloak into the ClearML service, do the following.

#### KeyCloak Configuration

1. For each administrator user, assign the admin role to that user in KeyCloak  
2. In the `Client Scopes` tab, make sure that the `roles` claim is returned in the access token or userinfo token 
(this depends on the configuration in step 1)

#### ClearML Server Configuration

By default, the ClearML Server will use the admin claim to identify administrator users. To use a different group name 
for designating the admin role, set the following environment variable:

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__admin_role
  value: "<admin claim name>"
```

#### Disabling Admin Role Association

To disable the automatic administrator claim and manage administrators solely from inside the ClearML WebApp, make sure 
that user roles are not returned by KeyCloak in the auth token or the `userinfo` endpoint, and/or set the following 
ClearML Server environment variable:

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__admin_role
  value: ""
```

### Additional ClearML Server Configurations

#### KeyCloak Session Logout

To automatically log out the user from the KeyCloak provider when the user logs out of the ClearMK service, set the 
following environment variable. This will make sure that the KeyCloak session is not maintained in the browser so that 
when the user tries to log into the ClearML service, the KeyCloak login page will be used again and not skipped.

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__idp_logout
  value: "true"
```

#### User Info Source

By default, the user info is taken from the KeyCloak access token. If you prefer to use the user info available through 
the OAuth’s protocol `userinfo` endpoint, set the following environment variable:

```
- name: CLEARML__services__login__sso__oauth_client__keycloak__get_info_from_access_token
  value: "false"
```

