---
title: Securing ClearML Server
---

:::important
This documentation page applies to deploying your own open source ClearML Server. It does not apply to ClearML Hosted Service users.
:::

To ensure deployment is properly secure, follow the following best practices.

## Network Security

If the deployment is in an open network that allows public access, only allow access to the specific ports used by 
ClearML Server (see [ClearML Server configurations](clearml_server_config.md#clearml-server-deployment-configuration)).

If HTTPS access is configured for the instance, allow access to port `443`. 

For improved security, the ports for ClearML Server Elasticsearch, MongoDB, and Redis servers are not exposed by 
default; they are only open internally in the docker network.

## User Access Security

Configure ClearML Server to use Web Login authentication, which requires a username and password for user access 
(see [Web Login Authentication](clearml_server_config.md#web-login-authentication)).

## File Server Security

Starting with v1.16.0, the ClearML file server uses token authentication. To disable, set `auth.enabled` to `false` in 
`fileserver.conf` or set `CLEARML__fileserver__auth__enabled=false`. 

For ClearML Server versions older than v1.16.0, the file server is not secured, even if [Web Login Authentication](clearml_server_config.md#web-login-authentication)
has been configured. It is recommended to use an [object storage solution](../integrations/storage.md) with built-in security.

## Server Credentials and Secrets

By default, ClearML Server comes with default values that are designed to allow to set it up quickly and to start working 
with the ClearML SDK.

However, this also means that the **server must be secured** by either preventing any external access, or by changing 
defaults so that the server's credentials are not publicly known.

The ClearML Server default secrets can be found [here](https://github.com/clearml/clearml-server/blob/master/apiserver/config/default/secure.conf), and can be changed using the `secure.conf` configuration file or using environment variables
(see [ClearML Server Feature Configurations](clearml_server_config.md#clearml-server-feature-configurations)).

Specifically, the relevant settings are:
* `secure.http.session_secret.apiserver`
* `secure.auth.token_secret`
* `secure.credentials.apiserver.user_key`
* `secure.credentials.apiserver.user_secret`
* `secure.credentials.fileserver.user_key`
* `secure.credentials.fileserver.user_secret`
* `secure.credentials.webserver.user_key` (automatically revoked by the server if using [Web Login Authentication](clearml_server_config.md#web-login-authentication))
* `secure.credentials.webserver.user_secret` (automatically revoked by the server if using [Web Login Authentication](./clearml_server_config.md#web-login-authentication))
* `secure.credentials.tests.user_key`
* `secure.credentials.tests.user_secret`


:::note
Securing the ClearML Server means also using [Web Login Authentication](clearml_server_config.md#web-login-authentication), 
since the default "free access" login is inherently unsecure (and will not work once ``secure.credentials.webserver.user_key`` 
and ``secure.credentials.webserver.user_secret`` values are changed) 
:::


### Example: Using Environment Variables 

To set new values for these settings, use the following environment variables:

* `CLEARML__SECURE__HTTP__SESSION_SECRET__APISERVER="new-secret-string"`
* `CLEARML__SECURE__AUTH__TOKEN_SECRET="new-secret-string"`
* `CLEARML__SECURE__CREDENTIALS__APISERVER__USER_KEY="new-key-string"`
* `CLEARML__SECURE__CREDENTIALS__APISERVER__USER_SECRET="new-secret-string"`
* `CLEARML__SECURE__CREDENTIALS__FILESERVER__USER_KEY="new-key-string"`
* `CLEARML__SECURE__CREDENTIALS__FILESERVER__USER_SECRET="new-secret-string"`
* `CLEARML__SECURE__CREDENTIALS__WEBSERVER__USER_KEY="new-key-string"`
* `CLEARML__SECURE__CREDENTIALS__WEBSERVER__USER_SECRET="new-secret-string"`
* `CLEARML__SECURE__CREDENTIALS__TESTS__USER_KEY="new-key-string"`
* `CLEARML__SECURE__CREDENTIALS__TESTS__USER_SECRET="new-secret-string"`

### Example: Using Docker Compose

If used in `docker-compose.yml`, these variables should be specified for the `apiserver` service, under the `environment` section as follows:
```yaml
version: "3.6"
services:
  apiserver:
    ...
    environment:
      ...
      CLEARML__SECURE__HTTP__SESSION_SECRET__APISERVER: "new-secret-string"
      CLEARML__SECURE__AUTH__TOKEN_SECRET: "new-secret-string"
      CLEARML__SECURE__CREDENTIALS__APISERVER__USER_KEY: "new-key-string"
      CLEARML__SECURE__CREDENTIALS__APISERVER__USER_SECRET: "new-secret-string"
      CLEARML__SECURE__CREDENTIALS__WEBSERVER__USER_KEY: "new-key-string"
      CLEARML__SECURE__CREDENTIALS__WEBSERVER__USER_SECRET: "new-secret-string"
      CLEARML__SECURE__CREDENTIALS__TESTS__USER_KEY: "new-key-string"
      CLEARML__SECURE__CREDENTIALS__TESTS__USER_SECRET: "new-secret-string"
  ...
```


:::important
When generating new user keys and secrets, make sure to use sufficiently long strings (we use 30 chars for keys and 50-60 
chars for secrets). See [here](https://github.com/clearml/clearml-server/blob/master/apiserver/service_repo/auth/utils.py)
for Python example code to generate these strings.
:::
