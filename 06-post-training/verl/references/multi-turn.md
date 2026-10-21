# Multi-turn rollout in verl

Multi-turn rollout combines model responses, tool calls, tool results, and another model response within a trajectory.
Configuration and tool APIs vary across verl releases. Pin the installed revision before writing configuration.

## Plan the rollout

1. Select the rollout engine supported by that revision and its multi-turn example.
2. Define tool schemas, argument validation, timeouts, turn limits, and output-size limits.
3. Decide which tools require per-trajectory state and cleanup.
4. Validate the model's chat template and tool-message serialization on one recorded trajectory.
5. Check which assistant tokens contribute to training and which tool or prompt tokens are masked.
6. Test tool failures and truncated conversations before starting distributed training.

The current upstream guide describes `BaseTool` for stateful tools and `function_tool` for stateless functions.
Do not copy configuration keys between their examples without checking the installed version.
A training trajectory can include reasoning text that the production chat template handles differently.
Treat tokenization consistency checks as correctness gates, not inconvenient warnings to disable.

Run only an agreed, bounded batch. Tool execution must not imply permission to provision infrastructure or access secrets.

## Sources

- Official multi-turn guide: https://verl.readthedocs.io/en/latest/sglang_multiturn/multiturn.html
- Existing local API notes: [api-reference.md](api-reference.md)
- Existing failure guidance: [troubleshooting.md](troubleshooting.md)

No rollout or training job was executed while preparing this reference.
