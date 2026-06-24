---
title: Template Variables
---

Platform administrators can define platform-level variables for use in configuration templates such as volume templates. 

These variables let administrators define their values once in a central location and use them across multiple templates.  

## Creating a Platform Variable

1. In the Platform Management Center, go to **Template Variables**
1. Click **Create Variable**.
1. Configure the variable:
   * Variable Name - Variable name used in template specifications (e.g. `TMP_PATH`)
   * Value - The default value assigned to the variable 
1. Click **Create**

Hover over a variable's row in the **Template Variables** table to Delete or Edit it, 

## Variable Overrides
Platform administrators can define tenant-specific overrides to the global variable values for cases when specific 
tenants require custom values for the same variables. For more information, see [Variable Overrides](pmc_tenants.md#variable-overrides).
