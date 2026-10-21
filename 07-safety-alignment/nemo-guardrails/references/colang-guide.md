# Select the Colang language version

Colang is an event-driven language interpreted by NeMo Guardrails.
Colang 1 and Colang 2 have different syntax and runtime behavior. Do not mix examples between them.
The current upstream guide describes Colang 1 as the default and Colang 2 as beta.
Check the documentation for the installed NeMo Guardrails release rather than assuming that the newest syntax is enabled.

## Colang 2 event example

The official language reference uses this minimal flow:

```text
flow main
    match InputEvent
    send HelloWorld
```

This waits for `InputEvent` and emits `HelloWorld`; it is not a content-safety policy.
A chatbot flow also needs the appropriate conversation events, actions, and model configuration.

## Validation workflow

Record the library and language versions. Start with a matching upstream example.
Validate parsing, expected events, unmatched inputs, and action failures before adding an LLM.
Then test allowed and blocked conversations against explicit policy expectations.
Do not interpret a flow that parses successfully as evidence that its safety policy is effective.

## Sources

- Version distinctions: https://docs.nvidia.com/nemo/guardrails/configure-guardrails/colang
- Example: https://docs.nvidia.com/nemo/guardrails/configure-guardrails/colang/colang-2/language-reference/introduction
