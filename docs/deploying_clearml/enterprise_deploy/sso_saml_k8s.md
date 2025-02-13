---
title: Microsoft AD SAML
---

This document describes the configuration required for connecting a ClearML Kubernetes server to allow authenticating 
users with Microsoft AD using SAML.

Configuration requires two steps:
* Configuration of the application in the active directory
* Configuration in the ClearML server side

## Active Directory Configuration
1. Register the ClearML app with the callback url: `<clearml_webapp_address>/callback_microsoft_ad`
1. Make sure that SSO binding is set to HTTP-Redirect
1. Make sure that the following user claims are returned to the ClearML app:

   ```
   emailaddress   - user.mail
   displayname    - user.displayname
   Unique user identifier - user.principalname
   ``` 

1. Generate the IdP metadata file and save the file and entity ID

## ClearML Server Side Configuration
The following should be configured in the override file:

```
apiserver:
  additionalConfigs:
    metadata.xml: |
      <?xml version="1.0"?>
      <test>
        <rule id="tst">
          <test_name>test</test_name>
        </rule>
      </test>
  extraEnvs:
     - name: "ALLEGRO__secure__login__sso__saml_client__microsoft_ad__entity_id"
       value: "<app_entity_id>"
     - name: "ALLEGRO__secure__login__sso__saml_client__microsoft_ad__idp_metadata_file"
       value: "/opt/clearml/config/default/metadata.xml"
     - name: "ALLEGRO__secure__login__sso__saml_client__microsoft_ad__default_company"
       value: "<company_id>"
     - name: "CLEARML__services__login__sso__saml_client__microsoft_ad__claims__object_id"
       value: "http://schemas.microsoft.com/identity/claims/objectidentifier"
     - name: "CLEARML__services__login__sso__saml_client__microsoft_ad__claims__name"
       value: "http://schemas.microsoft.com/identity/claims/displayname"
     - name: "CLEARML__services__login__sso__saml_client__microsoft_ad__claims__email"
       value: "emailAddress"
     - name: "CLEARML__services__login__sso__saml_client__microsoft_ad__claims__given_name"
       value: "givenName"
     - name: "CLEARML__services__login__sso__saml_client__microsoft_ad__claims__surname"
       value: "surname"
     - name: "CLEARML__services__login__sso__saml_client__microsoft_ad__claims__email"
       value: "emailAddress"
     - name: "CLEARML__services__login__sso__saml_client__microsoft_ad__claims__email"
       value: "emailAddress"
```

