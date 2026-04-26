---
title: Identity Providers
---

:::important[Enterprise Feature]
Identity provider integration is available under the ClearML Enterprise plan.
:::

Administrators can seamlessly connect ClearML with their identity service providers to easily implement single sign-on 
(SSO). Once an identity provider connection is configured and enabled, the option appears in your server login page.

In addition to authentication, ClearML can also retrieve user profile data and group membership details—facilitating user 
provisioning and role assignment.

ClearML supports standard protocols and popular providers:

* OAuth
  * [Amazon Cognito](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_amazon_cognito_oauth.md) 
  * [Azure AD](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_azure_ad_oauth.md)
  * [Google](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_google_oauth.md)  
  * [Keycloak](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_keycloak_oauth.md) 
  * [Microsoft AD](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_microsoft_ad_oauth.md)
  * [Ping Identity](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_ping_id_oauth.md) 
  * [Okta](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_okta_oauth.md)
* SAML
  * [Duo](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_duo_saml.md) 
  * [Google](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_google_saml.md) 
  * [Microsoft AD and Azure AD](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_microsoft_ad_saml.md)
* [LDAP](../deploying_clearml/enterprise_deploy/extra_configs/sso/sso_ldap.md)

For a complete list of supported providers, see [Identity Providers](../webapp/settings/webapp_settings_id_providers.md).

