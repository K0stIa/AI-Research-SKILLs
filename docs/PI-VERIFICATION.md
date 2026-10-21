# Pi verification

## Package checks

Run from the installed source checkout:

```bash
npm test
bash scripts/check-inventory.sh
npm pack --dry-run --json
```

The Node suite checks inventory, command identity, inline Markdown references, source gates, precision, CLI validation, event parsing, and response contracts.
It preserves 98 skills across 23 categories. Evidence records the current file and test counts.

Python-tagged examples throughout packaged Markdown are parsed without importing their dependencies.
The fence scanner handles ordinary CommonMark fences, not list or blockquote containers.
Syntax checks do not establish API compatibility, scientific correctness, memory use, or model quality.

Link checks do not certify remote URLs, HTML navigation, or heading anchors.
Archived vendor captures identify local corrections and retain unverified vendor claims.
No check runs training or provisions cloud resources.

For the optional Gemini demo regression, run from a repository checkout with Python 3 available:

```bash
node --test scripts/check-optional-demo.test.mjs
```

This test excludes Python site-packages and checks the missing-SDK error path. It does not call the image-generation API.
The demo and its test are excluded from the Pi package tarball.

## Small CPU numerical checks

From a repository checkout with an existing PyTorch installation:

```bash
CUDA_VISIBLE_DEVICES="" python3 scripts/check-distillation.test.py
```

These tests extract local examples. They check KL direction, causal alignment, masking, gradients, SimPO arithmetic, W&B configuration and control logic, and Wanda pruning with tied scores.
They load no models and take no optimizer steps.

The test is repository-only. It does not install PyTorch, contact W&B, or certify a complete training or pruning pipeline.

## Installed discovery

Do not force the package with `-e` when checking installed-name collisions.
The installed inventory script uses existing personal and project settings without changing them.
Supply the `dist/core` directory from the Pi installation you intend to test:

```bash
node scripts/verify-pi-installed.mjs /absolute/path/to/pi/dist/core /tmp/pi-inventory.json
```

It checks `/tmp`, the checkout's parent directory, and the checkout itself.
It requires all 98 Orchestra definitions to be active and the separate Feynman `autoresearch` to remain selected.
That coexistence assertion is specific to installations that also contain Feynman.
Other users can inspect the evidence JSON without treating absent Feynman as a package defect.

The Orchestra command is `/skill:orchestra-autoresearch`.
The command `/skill:autoresearch` is not an Orchestra alias.

## Real fresh-session checks

The live harness starts an actual Pi process with a prompt, not an SDK mock.
It uses installed skills, an isolated working directory, and a fresh in-memory session.
It does not pass `-e`, `--skill`, or `--no-skills`.
Default deadline is 240 seconds per scenario. The process group is terminated at that deadline.

Choose an already configured model and executable through `PI_LIVE_MODEL` and `PI_BIN` if necessary.
The default model is `local-llamacpp/qwen3.8-35b-a3b-mtp-256k`.

```bash
node scripts/verify-pi-live.mjs /tmp/pi-live orchestra-identity 240
node scripts/verify-pi-live.mjs /tmp/pi-live natural-unsloth 240
node scripts/verify-pi-live.mjs /tmp/pi-live citation 240
```

Run without arguments to list all scenarios. They cover both command identities, fine-tuning, citation handling,
Mamba and vLLM references, bounded research, full-extension operation, and matched control prompts.

Most scenarios disable extensions. The `full-installed`, `full-vllm`, and `control-full` scenarios retain installed extensions.
Extension initialization can create files in the scratch working directory even when model tools are read-only.
These are not mutation-free or extension-isolated controls. Do not run them in a valuable project directory.

Each run saves raw JSONL, stderr, and a result JSON.
A successful transport result requires a final assistant response, agent completion, no model error, and no tool error.
A process exit code of zero is insufficient. Provider failures can exit zero.

Review answer correctness and actual read paths separately. `completed: true` does not mean the answer is correct.
For identity checks, require the requested filesystem read; a claim that a read occurred is not tool evidence.
For citation-only tasks, check that citation guidance was read and templates were not inspected.
For QLoRA, check the frozen-base/trainable-adapter distinction and the cited source.
For controls, compare identical prompts and inspect cache usage before interpreting timing differences.

## All-skill installed matrix

Use a new output path for every attempt:

```bash
node scripts/verify-pi-matrix.mjs /tmp/pi-matrix-NEW 240 1 28800 all
```

Arguments set the per-case deadline, concurrency, total time budget, and selected names.
For a subset, replace `all` with comma-separated skill names. A passing subset is not complete library coverage.
Existing output paths are rejected.

Each fresh Pi process uses installed discovery without forced package precedence.
Extensions are disabled. Only `read` is available. Model and executable overrides use the same environment variables as the scenario harness.

The requested main-file read is exactly 12 lines from offset 1.
A supporting read, when available, must request at most 40 lines from the approved file.
Successful tool results are required; expanded skill text and narrated inspection do not count as reads.

The response must be bare JSON with the requested keys, three prerequisites, field-specific word budgets, and a total limit of 140 whitespace-separated words.
The evaluator checks these mechanical conditions separately from transport completion.

Preserve raw events, failures, timeouts, source hashes, and original results.
If source files or the evaluator change, identify stale evidence and retain any new evaluation separately.
Do not widen deadlines or relax the contract to hide failures.

Compare every accepted answer with its actual excerpts. Mechanical acceptance does not establish technical truth, safe deployment, or framework compatibility.

## Evidence and limits

The repair's test-before-build logs and final review live under `specs/verifications/pi-repair/` in the source repository.
Raw installed-session evidence is retained separately on the verification host.
Do not overwrite historical evidence when rerunning a harness.

The original forced-package smoke did not test installed package ordering and masked an `autoresearch` collision.
That collision was repaired by namespacing Orchestra's command, not by removing Feynman or editing personal settings.
The research entrypoint now loads detailed workflow sections on demand instead of expanding the entire manual for identity checks.

Successful package and fresh-session checks do not validate every framework version, training recipe, or model endpoint.
Timeouts remain incomplete evidence until a comparable run finishes. Larger deadlines alone do not establish a latency fix.
