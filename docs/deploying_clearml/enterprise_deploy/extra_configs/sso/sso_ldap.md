---
title: LDAP
---

This guide explains how to connect ClearML to authenticate a user using existing customer's LDAP.

1. ClearML is configured with the customer’s LDAP server address and admin credentials.  
2. When a user attempts to log in through the ClearML login screen, they enter their LDAP username and password in the 
   ClearML login screen.  
3. ClearML then connects to the LDAP system using the admin credentials to verify the user's credentials. If 
   authentication is successful, it retrieves the user’s details such as name, email, and any additional attributes specified in the ClearML configuration.

## Configure ClearML Server

Set the following environment variables for the `apiserver`:
* `CLEARML__apiserver__auth__fixed_users__enabled=true`
* `CLEARML__apiserver__auth__fixed_users__provider=ldap` 
* `CLEARML__apiserver__auth__fixed_user_providers__ldap__server="<ldap server address. For example: ipa.demo1.freeipa.org>"`
* `CLEARML__apiserver__auth__fixed_user_providers__ldap__base_dn="<base dn searching users under. For example: dc=demo1,dc=freeipa,dc=org>"`
* `CLEARML__apiserver__auth__fixed_user_providers__ldap__default_company=<clearml company id>`
* `CLEARML__secure__fixed_user_providers__ldap__dn="<admin dn>"`
* `CLEARML__secure__fixed_user_providers__ldap__password="<admin pwd>"`

To locate a user record in LDAP by user ID, ClearML uses a search filter. The default configuration shipped with the 
product is designed to work with open-source LDAP implementations.

If you're using Microsoft LDAP (Active Directory), you'll need to override this by setting the following configuration:

```
CLEARML__apiserver__auth__fixed_user_providers__ldap__search_filter: "(&(objectclass=user)(sAMAccountName={0}))"
```

### LDAP Secure Transport (TLS / LDAPS)

If the LDAP server URL starts with `ldaps://`, the connection is secure by default.

If you are using `ldap://`, you can enable TLS by setting the following environment variable in the apiserver container:

```
CLEARML__apiserver__auth__fixed_user_providers__ldap__use_tls=true
```

#### Server Certificate Validation

By default, ClearML verifies the LDAP server certificate.

If the LDAP server uses a private CA or self-signed certificate, you can provide the CA certificate chain to the API server: 
1. Copy the certificate file to a folder on the host (for example: `/opt/allegro/config/onprem_poc`).
1. Set the path to the certificate so the apiserver can find it:

   ``` 
   CLEARML__apiserver__auth__fixed_user_providers__ldap__tls__ca_certs=/opt/allegro/config/onprem_poc/<certificate_file>
   ```
  
   You can skip certificate validation by setting the following variable:

   ```
   CLEARML__apiserver__auth__fixed_user_providers__ldap__tls__validate_cert=false 
   ```


#### Client Certificates

If your LDAP server requires client certificates, add the client certificate and private key files to the server, and 
provide their locations using the following environment variables:

```
CLEARML__apiserver__auth__fixed_user_providers__ldap__tls__client_cert=/opt/allegro/config/onprem_poc/<client_certificate_file>
CLEARML__apiserver__auth__fixed_user_providers__ldap__tls__client_key=/opt/allegro/config/onprem_poc/<client_private_key_file>
```

### Retrieving Email and Display Name
The user’s email and name are pulled from the LDAP "email" and "displayName" attributes by default. If needed, you 
can configure the system to use different attributes, like this:

```
CLEARML__apiserver__auth__fixed_user_providers__ldap__attributes__name=<user name attribute>
CLEARML__apiserver__auth__fixed_user_providers__ldap__mail=<user email attribute>
CLEARML__apiserver__auth__fixed_user_providers__ldap__<some_custom_attrib>=<custom attribute name in ldap>
```

### Configuring a User as a ClearML Admin
To set certain users as ClearML admins provide their LDAP IDs like this:

```
CLEARML__apiserver__auth__fixed_user_providers__ldap__admin_users=["user1_id","user2_id"]
```

### User or Domain Whitelisting

ClearML supports restricting access so that only approved users or email domains can register and log into the system.

The whitelist is managed through API calls, which require the following parameters:
* `APISERVER_URL` – the ClearML API Server URL
* `APISERVER_KEY` / `APISERVER_SECRET` – admin user credentials

#### Adding Users to the Whitelist

You can add users to the whitelist via the UI or API.

**To add via the UI:** 
* Open the [User management](../../../../webapp/settings/webapp_settings_users.md) admin UI page
* Click "Add User" and specify the user's email address.

**To add one or more users using the API,** run the following API call:

```bash
curl $APISERVER_URL/login.add_whitelist_entries \
     -H "Content-Type: application/json" \
     -u $APISERVER_KEY:$APISERVER_SECRET \
     -d '{"emails":["<email1>", "<email2>", ...],"is_admin":false}'
```

#### Whitelisting Domains
To allow all users from a specific email domain to log in, run the following API call:

```bash
curl $APISERVER_URL/login.set_domains \
  -H "Content-Type: application/json" \
  -u $APISERVER_KEY:$APISERVER_SECRET \
  -d '{"domains":["<USERS_EMAIL_DOMAIN>"]}
```

#### Enabling Whitelisting

:::important
Once whitelisting is enabled, only such users will be able to log in (or register), so before turning it on, make sure 
you have added at least one admin user to the whitelist.

If whitelisting is enabled without any approved users or domains, no one (including administrators) will be able to log 
in.
:::

To enable whitelisting (restricting access to approved users or domains only), ensure the following server variable is 
**NOT** set:

```
CLEARML__apiserver__auth__fixed_user_providers__ldap__default_company
```

Once this variable is unset, only users or domains explicitly added to the whitelist can register or log into ClearML.
