# Pi verification

## Package checks

- `npm test`: four tests pass.
- `bash scripts/check-inventory.sh`: 98 skills across 23 categories.
- `npm pack --dry-run --json`: 98 skill files and 267 reference files included.
- Pi package resolver: 98 enabled skills, no extensions.
- Pi skill loader: 98 unique skill names, no skill diagnostics.

These checks do not run upstream training examples or cloud jobs.

## Fresh-session smoke test

Started a new, in-memory Pi process from `/tmp`. No parent conversation was resumed.
Loaded this checkout as a package through `-e`, with discovered skills, extensions, context files, and MCP disabled.
Only the read tool was enabled. Personal settings were not changed.

Command, replacing the checkout path as needed:

```bash
pi --print --mode json --no-session \
  --no-extensions --no-skills --no-context-files \
  --no-prompt-templates --no-mcp --offline --tools read \
  --model local-llamacpp/qwen3.8-35b-a3b-mtp-256k --thinking off \
  -e /absolute/path/to/AI-Research-SKILLs \
  '/skill:autoresearch Smoke test only. Read exactly the first 15 lines of /absolute/path/to/AI-Research-SKILLs/12-inference-serving/vllm/SKILL.md. Then STOP calling tools and answer in under 100 words: vLLM skill name; Pi rules for budgets, stopping, scheduling and delegation; one proposed CPU experiment. Do not execute experiments, write files, schedule tasks, or delegate.'
```

Observed results:

- Process exited with status 0, with no model error and no stderr output.
- `/skill:autoresearch` expanded the package's orchestration instructions.
- Model called `read` once on `12-inference-serving/vllm/SKILL.md`, with `limit: 15`.
- Model identified the skill as `serving-llms-vllm`.
- Model stated that scope, environment, compute budget, and stopping conditions require agreement before execution.
- Model stated that execution stops at the agreed budget or checkpoint.
- Model stated that background loops, cron jobs, and subagents require explicit authorization.
- Model proposed an experiment without executing it. Its suggested 8B-model CPU benchmark was not validated or judged appropriately small.
- No mutating tools, scheduling tools, or delegation tools ran.

Raw event log on the verification host: `/tmp/ai-research-skills-pi-smoke-final.jsonl`.
Temporary logs are not committed and are not needed to use the package.

Earlier attempts were not passes. One local-model run timed out after 180 seconds.
Copilot rejected GPT-5.4 for its configured integration and GPT-4.1 for the Responses API.
Codex rejected GPT-5.4 and GPT-5.5 for the configured ChatGPT account.
The successful run used the configured local model with thinking disabled.

## Workflow diagnostics

Pinned six existing GitHub Actions references to their upstream tag commit IDs.
Wrapped existing long workflow lines without changing authorization conditions.
No workflows were triggered, no package was published, and no branch was pushed.

## Unchanged demo diagnostics

Repository-wide analysis also reported existing problems in
`demos/scientific-plotting-demo/figures/gen_fig_andes_architecture_gemini.py`:

- Pyright reports `"genai" is unknown import symbol` for `from google import genai` at line 28.
- Static analysis reports an unchecked file open at line 21.

This demo is unchanged and excluded from the Pi package tarball.
Its Google Gen AI SDK environment and image-generation API were not tested.
These findings remain unresolved. The verification result covers the Pi package, not a clean whole-repository Python analysis.
