---
title: Configuring ClearML
---

ClearML can be tailored to your requirements by setting configurations in a variety of methods. All ClearML and ClearML 
Agent configurations can be set in the `clearml.conf` file, which serves as the baseline configuration of both packages. 
For detailed information about the configurable options in ClearML and ClearML Agent, see the 
[Configuration File](clearml_conf.md) reference page. 

ClearML supports reading configuration values from environment variables. Configuration entries specified
in this manner override values specified in the `clearml.conf` file. See [Environment Variables](env_vars.md) for parameter
specification.

Enterprise users can insert configuration snippets into the configuration vault. When enabled, configuration entries 
from the vault are applied on top of the configuration specified in `clearml.conf`. New definitions will extend the
`clearml.conf` configurations, and existing definitions will be overridden. For more information, see [Configuration Vault](../webapp/settings/webapp_settings_profile.md#configuration-vault).

The different ClearML configuration methods take precedence as summarized in the following list (higher ordered methods 
override the lower ones):
1. Command-line arguments (e.g. [clearml-task](../apps/clearml_task.md#command-line-options), [clearml-agent](../clearml_agent/clearml_agent_ref.md), 
   [clearml-session](../apps/clearml_session.md#command-line-options), [clearml-data](../clearml_data/clearml_data_cli.md) 
   arguments) 
1. Environment variables
1. Configuration vault
1. Configuration file
