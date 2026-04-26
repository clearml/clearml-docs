---
title: Customizing the ClearML Web UI
---

:::important[Enterprise Feature]  
ClearML Web UI customization is available under the ClearML Enterprise plan.  
:::

ClearML enables organizations to offer a custom branded Web UI through a flexible customization mechanism.

These customizations are implemented through container start-time parameters, passed as environment variables when 
launching the ClearML UI container. For example:

```c
docker run -e PARAM_NAME=value ... clearml-ui-image 
```

Customizations can also be configured within Kubernetes deployment manifests or Helm chart values.

## UI Customization Parameters

The following parameters can be used to customize the ClearML UI:

### Login Behavior

* `loginFallback?: 'password-less' | 'error' | 'tenant';`

  * Defines the behavior of the login page especially in multi-tenant setups or when alternative authentication mechanisms are used.  
  * **Possible Values:**  
    * `'password-less'` (Default): Redirects to a password-less authentication method if primary authentication methods fail or are not configured.  
    * `'error'`: Displays an error message on the login page when login fails.  
    * `'tenant'`: Redirects to a tenant-specific login page or flow.

### UI Behavior Options

* `displayTips?: boolean;`  

  * Controls whether helpful tips and suggestions are shown in the UI.  
  * **Possible Values:**  
    * `true`: Display ClearML built-in tips and suggestions in the UI  
    * `false`: Hide tips for a cleaner, more white-label experience.

* `blockUserScript?: boolean;`
  * Controls whether user-provided and third-party scripts are allowed to run in the ClearML Web UI.
  * **Possible Values:**
    * `true`: The Web UI blocks execution of all user and embedded scripts, including:
      * Debug samples
      * Hyper-Dataset frame previews
      * Embedded resources in reports
      
      This behavior is enforced globally and overrides the user-level **Block running user's scripts in the browser** toggle
      in the UI **User Settings**. 
    * `false`: Users can enable/disable script execution using the **Block running user's scripts in the browser** toggle 
      in **User Settings**.

### Theming and Styling

* `forceTheme?: 'light' | 'dark';`  

  * Forces a specific UI theme for all users, overriding user preferences.  
  * **Possible Values:** `'light'`, `'dark'`  
* `defaultTheme?: 'light' | 'dark';`  
  * Sets the default UI theme for new users or users who haven't set a preference. `forceTheme` overrides this parameter.  
  * **Possible Values:** `'light'`, `'dark'`  
* `customStyle?: string;`  
  * URL to a custom CSS file that overrides default ClearML styles. This allows full control over appearance, including 
    fonts, colors, spacing, and element visibility.  
  * For example: `"<https://yourcdn.com/path/to/your-custom-clearml-styles.css>"`.

### User Management

* `externalAddUsers?: boolean;`  

  * Indicates if user addition is managed externally (e.g., via an API or a separate identity provider) or through the 
  ClearML UI.  
  * **Possible Values:**  
    * `true`: User addition is managed externally. The ClearML UI options for adding users are hidden, directing users 
    to the appropriate external system.  
    * `false`: User addition is managed through the ClearML UI

### Tenant and Branding Information

* `tenantTitles?: {provider: string; tenant: string}`

  * Customizes titles displayed in the UI. Useful for multi-tenant deployments or to reflect the service provider and 
  the client company.  
  * **Possible Values:** A JSON-like object string specifying provider and tenant names (e.g., `'{"provider": "Managed MLOps Inc.", "tenant": "Client Corp."}'`).  
* `branding?: { faviconUrl?: string; logo?: string; logoSmall?: string };`  
  * Replaces ClearML's default branding elements with custom ones.  
  * **Possible Values:** A JSON-like object string with URLs to the custom assets:  
    * `faviconUrl`: URL to a custom favicon (e.g., `'{"faviconUrl": "<https://yourcompany.com/favicon.ico>"}'`).  
    * `logo`: URL to the main logo, typically displayed on the login page or main dashboard header. 
    Size: 130x42 (e.g., `'{"logo": "<https://yourcompany.com/main-logo.png>"}'`).  
    * `logoSmall`: URL to a smaller logo, used in condensed UI areas or sidebars. Size: 64X64 (e.g., `'{"logoSmall": "<https://yourcompany.com/small-logo.png>"}'`).

### External Links and Support

* `docsLink?: string;`  

  * Replaces the default link to ClearML's documentation with a custom URL.  
  * For example: `"<https://yourcompany.com/mlops-documentation>"`.  
* `supportEmail?: string;`  
  * Provides a custom support email address.  
  * For example: `"support@yourcompany.com"`  
* `whiteLabelLink?: {logo: string; tooltip: string; link: string};`  
  * Adds a custom branded link in the main sidebar of the UI.  
  * **Possible Values:** A JSON-like object string specifying:  
    * `logo`: URL to an icon or small logo for the link.  
    * `tooltip`: Text to display when a user hovers over the logo/link.  
    * `link`: The destination URL for the link.  
    * For example: `'{"logo": "<https://yourcompany.com/whitelabel-icon.png>", "tooltip": "Powered by YourCompany", "link": "<https://yourcompany.com>"}'`)

### Notices and Communication

* `loginNotice?: string;`  

  * Displays a custom message on the login page. Useful for announcements, disclaimers, or providing specific login instructions to users.  
  * **Possible Values:** A string of text or HTML (ensure proper escaping if using HTML).  
  * For example: `"Welcome to Our Custom MLOps Platform. Please use your company credentials to log in."`

## Applying Parameters

These parameters are passed as environment variables when launching the ClearML UI Docker container.

Use one of the following deployment configuration options:

* [Docker Compose](#docker-compose)  
* [Kubernetes (Pod Environment Variables)](#kubernetes-pod-environment-variables)

#### Docker Compose

```
services:
  clearml-webserver: # Name of your ClearML UI service
    image: your-clearml-ui-image-name:latest # Replace with your actual ClearML UI image
    container_name: clearml_ui_white_labeled
    environment:
      - WEBSERVER__loginFallback=tenant
      - WEBSERVER__displayTips=false
      - WEBSERVER__blockUserScript=false # Or true, depending on your needs
      - WEBSERVER__forceTheme=light
      - WEBSERVER__defaultTheme=light
      - WEBSERVER__customStyle=https://yourcdn.com/path/to/your-custom-clearml-styles.css
      - WEBSERVER__externalAddUsers=false # Or true, if user management is external
      - WEBSERVER__tenantTitles={"provider": "Managed MLOps Inc.", "tenant": "Client Corp."}
      - WEBSERVER__branding={"faviconUrl": "https://yourcompany.com/favicon.ico", "logo": "https://yourcompany.com/main-logo.png", "logoSmall": "https://yourcompany.com/small-logo.png"}
      - WEBSERVER__docsLink=https://yourcompany.com/mlops-documentation
      - WEBSERVER__supportEmail=support@yourcompany.com
      - WEBSERVER__whiteLabelLink={"logo": "https://yourcompany.com/whitelabel-icon.png", "tooltip": "Powered by YourCompany", "link": "https://yourcompany.com"}
      - WEBSERVER__loginNotice=Welcome! Please use your assigned credentials.
```

#### Kubernetes (Pod Environment Variables)

When deploying on Kubernetes via Helm chart, these parameters are configured on the webserver’s values overrides:

```
webserver:
  extraEnvs:
    - name: WEBSERVER__loginFallback
      value: "\"tenant\""
    - name: WEBSERVER__displayTips
      value: "false"
    - name: WEBSERVER__blockUserScript
      value: "true"      
    - name: WEBSERVER__forceTheme
      value: "light"
    - name: WEBSERVER__defaultTheme
      value: "light"
    - name: WEBSERVER__customStyle
      value: "https://yourcdn.com/path/to/your-custom-clearml-styles.css"
    - name: WEBSERVER__externalAddUsers
      value: "false"
    - name: WEBSERVER__tenantTitles__provider
      value: "\"Managed MLOps Inc.\""
    - name: WEBSERVER__tenantTitles__tenant
      value: "\"Client Corp.\""
    - name: WEBSERVER__branding__faviconUrl
      value: "\"https://example.com/favicon.ico\""
    - name: WEBSERVER__branding__logo
      value: "\"https://example.com/logo.png\""
    - name: WEBSERVER__branding__logoSmall
      value: "\"https://example.com/logoSmall.png\""
    - name: WEBSERVER__docsLink
      value: "\"https://docs.example.com\""
    - name: WEBSERVER__supportEmail
      value: "\"tech-support@example.com\""
    - name: WEBSERVER__whiteLabelLink__logo
      value: "\"https://example.com/small-logo.png\""
    - name: WEBSERVER__whiteLabelLink__tooltip
      value: "\"Provided by ExampleCorp\""
    - name: WEBSERVER__whiteLabelLink__link
      value: "\"https://example.com\""
    - name: WEBSERVER__loginNotice
      value: "System maintenance scheduled for Sunday at 2 AM."

   # ... other environment variables
```

