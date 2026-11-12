---
title: Version 4.0
---

### ClearML Agent 4.0.17

**New Features and Bug Fixes**

* Add SNUG, an opt-in LLM usage metering module (`agent.snug.enabled`, disabled by default):
  * Meter Anthropic, OpenAI, and Gemini calls made by tasks, with exact token counts (estimated when the response does 
    not include usage data)
  * Report prompt-cache read/write tokens, per-model usage, tool calls, and per-chat scalars (tokens, latency, requests) 
    to the task's **SCALARS** tab
  * Report usage events to the AI usage dashboard (Enterprise server required)
  * Support HTTP/2 and gzip/zstd-compressed traffic
  * Add app mode for metering desktop and CLI AI apps through a local forward proxy (Claude Desktop, Codex, OpenCode, 
    Kiro CLI, Hermes, and generic CLI apps via `wrap_bins` / `wrap_kind`)
  * Add a configurable host whitelist, header injection, and optional call-history capture (credentials are redacted)
* Report container CPU/memory usage via cgroups when running inside a container, instead of host machine metrics
* Fail the task with a visible reason when `--use-owner-token` cannot impersonate the task owner (Enterprise server required)
* Mask secret-looking environment variables (containing `KEY`, `SECRET`, `TOKEN`, `PASS`, or `CREDENTIAL`) in printed 
  Docker commands and configuration
* Add `agent.vcs_cache.lock_timeout_sec`, `agent.vcs_cache.temp_cache_on_lock_timeout`, `agent.vcs_cache.cleanup_orphans`, 
  and `agent.vcs_cache.orphan_min_age_sec` configuration options. On VCS cache lock timeout, the agent now clones directly 
  into the task folder instead of leaving duplicate cache folders
* Add `agent.crash_backoff` configuration option / `CLEARML_AGENT_CRASH_BACKOFF` environment variable for exponential 
  backoff of the daemon crash loop
* Fix `--dynamic-gpus` issues (Enterprise server required):
  * Over-pulling tasks onto the same GPU
  * Reporting fractional slots as full GPUs
  * Crashing when no `available_gpus` property exists
  * Getting stuck after a transient server error
* Fix explicitly empty `--entrypoint ""` being stripped by `agent.forbidden_docker_args`
* Fix conda `update_envs` regression
* Fix slow startup when the fileserver is disabled (skip external IP lookup when the API host is set)
* Fix compiled bootstrap Python provisioning in air-gapped environments, and when `CLEARML_AGENT_SKIP_PYTHON_ENV_INSTALL` 
  is set but the image has no Python
* Document `CLEARML_BOOTSTRAP_UV_EXEC` (#270)
* Use `ssl_minimum_version` with `urllib3` v2+ (removes deprecation warning)
* Bump `urllib3>=2.8.0` (Python 3.10+), `virtualenv>=21.14.13` (Python 3.9+), and `pyjwt>=2.13.0` for security fixes
* Kubernetes glue
  * Report running tasks as pending again when their pod is replaced
  * Re-enqueue tasks rejected by a namespace ResourceQuota instead of failing them
  * Abort tasks whose running pod was deleted, and clean up pods of tasks stopped before they started running 
    (Enterprise server required)
  * Add opt-in node capacity check before launching a task (`CLEARML_K8S_GLUE_CHECK_NODE_RESOURCES`) (Enterprise server required)
  * Add per-task extra containers (sidecars) (Enterprise server required)
  * Tear down multi-node tasks whose pods cannot all be scheduled together (Enterprise server required)
  * Add `clearml-task-id` pod label
  * Redact auth tokens and secrets from `kubectl` output shown in the task log
  * Fix GPU fractions not reported when the pod has CPU/memory limits (Enterprise server required)
  * Fix crash on non-ASCII init scripts
  * Fix `!!str` YAML tag leaking into template values
