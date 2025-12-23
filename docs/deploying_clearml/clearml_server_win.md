---
title: Windows 10
---

For Windows, launching the pre-built Docker image on a Linux virtual machine is recommended (see [Deploying ClearML Server: Linux or macOS](clearml_server_linux_mac.md)). 
However, ClearML Server can be launched on Windows 10, using Docker Desktop for Windows (see the Docker [System Requirements](https://docs.docker.com/docker-for-windows/install/#system-requirements)).

For information about upgrading ClearML Server on Windows, see [here](upgrade_server_win.md).

:::important
If ClearML Server is being reinstalled, clearing browser cookies for ClearML Server is recommended. For example, 
for Firefox, go to Developer Tools > Storage > Cookies, and for Chrome, go to Developer Tools > Application > Cookies,
and delete all cookies under the ClearML Server URL.
:::

## Deploying

:::warning
By default, ClearML Server launches with unrestricted access. To restrict ClearML Server access, follow the instructions in the [Security](clearml_server_security.md) page.
:::

:::info Memory Requirement
Deploying the server requires a minimum of 8 GB of memory, 16 GB is recommended.
:::

:::note Using Docker Compose V1?
Docker Compose V1 reached end-of-life in July 2023 and is no longer receiving updates.
The commands in this guide use V2 syntax. If you're still on V1:
- Replace `docker compose` with `docker-compose`
- Replace `compose.yaml` with `docker-compose.yml`

We strongly recommend [migrating to Docker Compose V2](https://docs.docker.com/compose/migrate/)
for continued support and new features.
:::

**To deploy ClearML Server on Windows 10:**

1. Install the Docker Desktop for Windows application by either:

    * Following the [Install Docker Desktop on Windows](https://docs.docker.com/docker-for-windows/install/) instructions.
    * Running the Docker installation [wizard](https://hub.docker.com/?overlay=onboarding).

1. Increase the memory allocation in Docker Desktop to `4GB`.

    1. In the Windows notification area (system tray), right-click the Docker icon.

    1. Click **Settings** **>** **Advanced**, and then set the memory to at least `4096`.
   
    1. Click **Apply**.
    
1. Remove any previous installation of ClearML Server.

    **This clears all existing ClearML SDK databases.**

    ``` 
    rmdir c:\opt\clearml /s
    ```
   
1. Create local directories for data and logs. Open PowerShell and execute the following commands:

   ```
   cd c:
   mkdir c:\opt\clearml\data
   mkdir c:\opt\clearml\logs
   ```

1. Download the ClearML Server Compose file.

   ```
   curl https://raw.githubusercontent.com/clearml/clearml-server/master/docker/compose-win10.yaml -o c:\opt\clearml\compose-win10.yaml
   ```

1. Run Docker Compose. In PowerShell, execute the following commands:

   ```
   docker compose -f c:\opt\clearml\compose-win10.yaml up
   ```
   The server is now running on [http://localhost:8080](http://localhost:8080).
 
## Port Mapping

After deploying ClearML Server, the services expose the following node ports:

* Web server on port `8080`
* API server on port `8008`
* File server on port `8081`

## Restarting

**To restart ClearML Server Docker deployment:**

* Stop and then restart the Docker containers by executing the following commands:

   ```
   docker compose -f c:\opt\clearml\compose-win10.yaml down
   docker compose -f c:\opt\clearml\compose-win10.yaml up -d
   ```

## Next Step

To keep track of your experiments and/or data, the `clearml` package needs to communicate with your server. 
For instruction to connect the ClearML SDK to the server, see [ClearML Setup](../clearml_sdk/clearml_sdk_setup.md).