---
title: Accurate Vulnerability Scanning of ClearML Images
---

If you scan ClearML images with a third-party vulnerability scanner, the report may include
critical or high-severity CVEs that do not apply to the hardened image. This can occur when scanners rely 
solely on package names and versions from generic CVE databases without accounting for hardening already applied to the 
base image.

## Recommended Scanning Procedure

To get results that more accurately reflect the image's security posture:

* Scan the image using [Docker Scout](https://docs.docker.com/scout/).
* If you use a different vulnerability scanner (for example Trivy, or an internal corporate equivalent),
  see [Scan Docker Hardened Images](https://docs.docker.com/dhi/how-to/scan/).
  This guide explains how to configure common scanners to consume the SBOM and VEX metadata
  shipped with the image. Using this metadata helps identify non-applicable vulnerabilities and reduces false-positive
  CVE findings.
