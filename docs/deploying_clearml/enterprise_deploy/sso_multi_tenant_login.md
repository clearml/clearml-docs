---
title: Multi-Tenant Login Mode
---

In a multi-tenant setup, each external tenant can be represented by an SSO client defined in the customer Identity provider 
(Keycloak). Each ClearML tenant can be associated with a particular external tenant. Currently, only one 
ClearML tenant can be associated with a particular external tenant

## Setup IdP/SSO Client in Identity Provider

1. Add the following URL to "Valid redirect URIs": `<clearml_webapp_address>/callback_<client_id>`  
2. Add the following URLs to "Valid post logout redirect URIs": 

   ```
   <clearml_webapp_address>/login
   <clearml_webapp_address>/login/<external tenant ID>
   ```
3. Make sure the external tenant ID and groups are returned as claims for a each user

## Configure ClearML to use Multi-Tenant Mode

Set the following environment variables in the ClearML enterprise helm chart under the `apiserver` section:  
* To turn on the multi-tenant login mode:

  ```
  - name: CLEARML__services__login__sso__tenant_login
    value: "true"
  ```
* To hide any global IdP/SSO configuration that's not associated with a specific ClearML tenant:  

  ```
  - name: CLEARML__services__login__sso__allow_settings_providers
    value: "false"
  ```
  
Enable `onlyPasswordLogin` by setting the following environment variable in the helm chart under the `webserver` section:

``` 
- name: WEBSERVER__onlyPasswordLogin`  
  value: “true”`
```

## Setup IdP for a ClearML Tenant

To set an IdP client for a ClearML tenant, you’ll need to set the ClearML tenant settings and define an identity provider:

1. Call the following API to set the ClearML tenant settings:

   ```
   curl $APISERVER_URL/system.update_company_sso_config -H "Content-Type: application/json" -u $APISERVER_KEY:$APISERVER_SECRET -d'{  
     "company": "<company_id>",  
     "sso": {  
       "tenant": "<external tenant ID>",  
       "group_mapping": {  
         "IDP group name1": "Clearml group name1",  
         "IDP group name2": "Clearml group name2"  
       },  
       "admin_groups": ["IDP admin group name1", "IDP admin group name2"]  
     }}'  
   ```
2. Call the following API to define the ClearML tenant identity provider:

   ```
   curl $APISERVER_URL/sso.save_provider_configuration -H "Content-Type: application/json" -u $APISERVER_KEY:$APISERVER_SECRET -d'{  
     "provider": "keycloak", 
     "company": "<company_id>",  
     "configuration": {  
       "id": "<some unique id here, you can use company_id>",  
       "display_name": "<The text that you want to see on the login button>",  
       "client_id": "<client_id from IDP>",  
       "client_secret": "<client secret from IDP>",  
       "authorization_endpoint": "<authorization_endpoint from IDP OpenID configuration>",  
       "token_endpoint": "<token_endpoint from IDP OpenID configuration>",  
       "revocation_endpoint": "<revocation_endpoint from IDP OpenID configuration>",  
       "end_session_endpoint": "<end_session_endpoint from IDP OpenID configuration>",  
       "logout_from_provider": true,  
       "claim_tenant": "tenant_key",  
       "claim_name": "name",  
       "group_enabled": true,  
       "claim_groups": "ad_groups_trusted",  
       "group_prohibit_user_login_if_not_in_group": true  
     }}'  
   ```
   The above configuration assumes the following:  
   * On logout from ClearML, the user is also logged out from the Identity Provider  
   * External tenant ID for the user is returned under the `tenant_key` claim  
   * User display name is returned under the `name` claim  
   * User groups list is returned under the `ad_groups_trusted` claim  
   * Group integration is turned on and a user will be allowed to log in if any of the groups s/he belongs to in the 
     IdP exists under the corresponding ClearML tenant (this is after group name translation is done according to the ClearML tenant settings)

## Webapp Login

When running in multi-tenant login mode, a user belonging to some external tenant should use the following link to log in:  

```
<clearml_webapp_address>/login/<external tenant ID>
```