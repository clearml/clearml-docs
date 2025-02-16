---
title: Group Integration in Active Directory SAML
---

Follow this guide to integrate groups from Active Directory with ClearML.

## Actions in Active Directory
Make sure that the group claims are passed to the ClearML app. 

## Actions in ClearML
### Creating the Groups
* Groups integration is disabled by default
* Groups are not auto-created and need to be created manually in ClearML using the [Users & Groups](../../webapp/settings/webapp_settings_users.md#user-groups) 
  page in the ClearML web UI, or using the ClearML API.
* If a group does not exist in ClearML, the user will be created, but will not be assigned to any group.
* Group claim used by ClearML is `groups` by default
* Group name is taken from the first CN of the full DN path. For example, for the following DN: `CN=test, OU=unit, DU=mycomp`, 
  the group name in ClearML will be `test`
* The group name matching in ClearML is case-sensitive by default

### Configuring ClearML Group Integration

To enable ClearML group integration set the following environment variable:
```
CLEARML__services__login__sso__saml_client__microsoft_ad__groups__enabled=true
```

To configure groups that should automatically become admins in ClearML set the following environment variable:
```
CLEARML__services__login__sso__saml_client__microsoft_ad__groups__admins=[<admin_group_name1>, <admin_group_name2>, ...]
```

To change the the default Group Claim set the following environment variable:
```
CLEARML__services__login__sso__saml_client__microsoft_ad__groups__claim=...
```

To make group matching case insensitive set the following environment variable:
```
CLEARML__services__login__sso__saml_client__microsoft_ad__groups__case_sensitive=false
```

In order to prohibit the users, who do not belong to any of the AD groups created in ClearML from signing up set the following environment variable:
```
CLEARML__services__login__sso__saml_client__microsoft_ad__groups__prohibit_user_signup_if_not_in_group=true
```
