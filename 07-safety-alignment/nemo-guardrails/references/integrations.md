# Integrate NeMo Guardrails

Place guardrails at an explicit application boundary: input, retrieval, tool actions, model output, or a combination.
A conversational flow does not replace authorization in the application or tool service.

## Integration checklist

1. Pin the NeMo Guardrails release, Colang version, model provider, and configuration revision.
2. Select an upstream integration example for that exact release.
3. Define which events and messages cross each boundary and who owns conversation state.
4. Validate and authorize tool arguments outside model-generated text.
5. Set timeouts, cancellation behavior, concurrency limits, and an explicit failure policy.
6. Keep credentials in the application's secret store, not in prompts or committed configuration.
7. Test with deterministic mock actions before enabling external calls.

Include fixtures for benign requests, blocked requests, unknown events, tool failures, and malformed model output.
For retrieval, treat retrieved documents as untrusted content rather than instructions that may replace policy.
Evaluate final behavior as well as whether the expected flow activated.

Colang 2 has different runtime capabilities and limitations from Colang 1.
Do not assume that a Colang 1 integration can be migrated by changing only a version field.

## Sources

- Event model and version limitations: https://docs.nvidia.com/nemo/guardrails/configure-guardrails/colang
- Policy evaluation: https://docs.nvidia.com/nemo/guardrails/latest/evaluation/evaluate-configuration

This checklist is integration guidance; it does not claim compatibility with every provider or release.
