---
title: Deployment with Self-Signed Certificates
---

This guide covers how to configure the [AI Application Gateway](../appgw.md) and [ClearML Agent](../../../clearml_agent/clearml_agent_deployment_k8s.md#agent-with-an-enterprise-server) 
to use self-signed or custom SSL certificates. 

## Certificate Configuration

To configure certificates, update the applicable overrides file:
* For AI Application Gateway: `clearml-app-gateway-values.override.yaml` file
* For ClearML Agent: `clearml-agent-values.override.yaml` file

```yaml
# -- Custom certificates
customCertificates:
  # -- Override system crt certificate bundle. Mutual exclusive with extraCerts.
  overrideCaCertificatesCrt:
  # -- Extra certs usable in case of needs of adding more certificates to the standard bundle, Requires root permissions to run update-ca-certificates. Mutual exclusive with overrideCaCertificatesCrt.
  extraCerts:
     - alias: certificateName
       pem: |
         -----BEGIN CERTIFICATE-----
         ###
         -----END CERTIFICATE-----
```

You have two configuration options:

- [**Replace**](#replace-entire-ca-certificatescrt-file) the entire `ca-certificates.crt` file
- [**Append**](#append-extra-certificates-to-the-existing-ca-certificatescrt) extra certificates to the existing `ca-certificates.crt`


### Replace Entire ca-certificates.crt File

To replace the whole ca-bundle, provide a concatenated list of all trusted CA certificates in `pem` format as 
they are stored in a standard `ca-certificates.crt`.

```yaml
# -- Custom certificates
customCertificates:
  # -- Override system crt certificate bundle. Mutual exclusive with extraCerts.
  overrideCaCertificatesCrt: |
    -----BEGIN CERTIFICATE-----
    ### CERT 1
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
    ### CERT 2
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
    ### CERT 3
    -----END CERTIFICATE-----
   ...
```

### Append Extra Certificates to the Existing ca-certificates.crt

You can add certificates to the existing CA bundle. Each certificate must have a unique `alias`.

```yaml
# -- Custom certificates
customCertificates:
  # -- Extra certs usable in case of needs of adding more certificates to the standard bundle, Requires root permissions to run update-ca-certificates. Mutual exclusive with overrideCaCertificatesCrt.
  extraCerts:
     - alias: certificate-name-1
       pem: |
         -----BEGIN CERTIFICATE-----
         ###
         -----END CERTIFICATE-----
     - alias: certificate-name-2
       pem: |
         -----BEGIN CERTIFICATE-----
         ###
         -----END CERTIFICATE-----
```

### ClearML Agent: Add Certificates to Task Pods

If your workloads need access to these certificates (e.g., for HTTPS requests), configure the agent to inject them into pods:

```yaml
customCertificates:
  propagateToTasks: true
```


### Apply Changes

To apply the changes, run the update command:
* For AI Application Gateway:

   ```bash
   helm upgrade -i <RELEASE_NAME> -n <WORKLOAD_NAMESPACE> oci://docker.io/clearml/clearml-enterprise-app-gateway --version <CHART_VERSION> -f clearml-app-gateway-values.override.yaml
   ```

* For ClearML Agent: 

   ```bash
   helm upgrade -i -n <WORKER_NAMESPACE> clearml-enterprise-agent oci://docker.io/clearml/clearml-enterprise-agent -f clearml-agent-values.override.yaml
   ```