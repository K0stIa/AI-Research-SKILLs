# Evaluate guardrails performance

The official configuration-evaluation workflow separates policy compliance, resource usage, and latency impact.
Measure all three. A faster guardrail is not an improvement if it misses required policy checks.

## Evaluation plan

- Version policies and interaction fixtures separately from the application configuration.
- Include allowed, refusal, and ambiguous cases with explicit expected policy outcomes.
- Record model calls, prompt tokens, completion tokens, failures, and retries per interaction.
- Measure end-to-end latency and distinguish cold initialization from steady-state calls.
- Compare equivalent inputs, provider revisions, concurrency, and network conditions.
- Review a sample of model-judge decisions with human reviewers.

The upstream workflow exposes `nemoguardrails eval` commands for running interactions, checking compliance, and viewing results.
Inspect the installed CLI before copying arguments from another release.
An LLM-as-judge can make external model calls and incur costs; obtain authorization before running it.

The evaluation configuration can model expected latency from fixed and per-token costs.
Those modeled latencies are not direct measurements of network or service load.
Report measured and modeled values separately.

## Source

Official evaluation workflow and latency model:
https://docs.nvidia.com/nemo/guardrails/latest/evaluation/evaluate-configuration

No latency, compliance, or cost result is asserted here.
