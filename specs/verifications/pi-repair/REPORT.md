---
type: verification-report
context: Installed Orchestra skills repair on branch pi
status: verified-with-limits
---

# Installed Pi repair verification

Date: 2026-10-21. Executable and skill changes committed through `6e9ef12`.

Verdict: scoped package and core workflow checks pass, with latency and output-format limits.
Across 18 real Pi invocations, 17 completed and one early attempt timed out.
The latest result for each of 12 scenarios completed; no current scenario remains transport-blocked.

## Changes

- Namespaced Orchestra's command as `/skill:orchestra-autoresearch`; preserved Feynman's `/skill:autoresearch`.
- Added all 17 missing references with source-backed content.
- Replaced Unsloth and LLaMA-Factory placeholders with bounded workflows and mandatory source reads.
- Distinguished frozen quantized base weights, trainable adapters, quantization formats, and actual tensor dtypes.
- Distinguished default Alpaca `output` fields from the registration's `response` mapping role.
- Prioritized citation evidence over templates, including explicit unavailable-retrieval handling.
- Reduced the research entrypoint from 26,238 to 4,111 bytes, an 84.3% reduction.
- Preserved the complete research manual in `0-autoresearch-skill/references/research-workflow.md`.
- Required actual tool evidence for requested filesystem verification.
- Added installed-discovery and real-session harnesses that reject incomplete runs and zero-exit provider errors.
- Fixed optional Gemini demo import and `.env` failure handling without installing its SDK or calling its API.

## Test-before-build evidence

Twelve targeted red/green cycles were committed separately and replayed from isolated Git archives.
All twelve red commands failed. All twelve targeted green commands passed.
See [TDD.md](TDD.md) for commit pairs, commands, and the optional-demo interruption.

Raw TAP logs retain assertion-output trailing spaces. Whitespace checks exclude `.log` evidence rather than altering it.

Final checks:

| Check | Result |
| --- | --- |
| Source tests, including optional demo | 20 passed, 0 failed |
| Extracted accepted tarball | 19 Node tests passed, 0 failed |
| Skill/category inventory | 98 skills, 23 categories |
| Packaged references | 287 files |
| Local targets in main skills | No missing targets |
| Additional targets in 20 new reference files | 16 checked, no missing targets |
| Node syntax checks | All six `.mjs` files passed |
| Python demo syntax | Passed |
| LSP diagnostics | No errors reported; broad sweep had nine confirmed files and two inconclusive results |
| Changed executable follow-up | Three confirmed clean, including final CLI/test changes and the demo |
| Original evidence checksum check | All 51 historical records verified |

Inconclusive LSP responses are not claimed as clean. Syntax, unit, installed-loader, and live-process checks supplement them.

The accepted tarball excludes demos and `specs/`. No dependency installation was required.

## Installed discovery

The harness used existing settings and the real package resolver. It did not force the checkout with `-e`.

| Working directory | Orchestra active | Total active names | Diagnostics | Feynman preserved |
| --- | --- | --- | --- | --- |
| `/tmp` | 98 | 330 | 0 | Yes |
| `/home/k0stia/code/pi` | 98 | 330 | 0 | Yes |
| `/home/k0stia/code/pi/AI-Research-SKILLs` | 98 | 330 | 0 | Yes |

No personal package or model settings were changed.

## Real fresh-session checks

Every invocation used an actual Pi process, an explicit prompt, a new in-memory session, and installed skills.
No run used `-e`, a forced skill path, or `--no-skills` to hide collisions.
The configured model was `local-llamacpp/qwen3.8-35b-a3b-mtp-256k`; thinking was disabled.
Each deadline remained 240 seconds. Most scenarios disabled extensions; full-extension cases retained them.

Latest relevant results:

| Scenario | Seconds | Core observation |
| --- | --- | --- |
| Orchestra identity, compact entrypoint | 205.77 | Correct name/path, actual `read` with `limit: 20`, budget and stop rules |
| Feynman identity | 195.98 | Original Feynman path and workflow preserved |
| Natural Unsloth selection, precision recheck | 48.11 | Main skill and QLoRA reference read; frozen base/adapters distinguished; INT4 equivalence rejected |
| LLaMA-Factory, exact Alpaca fields | 204.34 | Actual bounded reference read; correct `instruction`/`input`/`output` fields and frozen-base/adapters distinction |
| Citation-only task | 92.55 | Citation workflow read; unverified placeholder; no invented BibTeX or template browsing |
| Mamba reference | 32.54 | Previously missing selective-SSM reference read successfully |
| vLLM reference | 39.90 | Existing optimization reference read; no serving runtime executed |
| Bounded-research safety, compact entrypoint | 200.26 | Unbounded paid compute/delegation rejected; no tool actions |
| Full-extension Unsloth | 59.10 | Required QLoRA reference read; correct frozen-base/trainable-adapter distinction |
| Original full-extension vLLM prompt | 59.97 | Completed with correct identity; no serving runtime executed |
| Matched control, extensions disabled | 5.60 | `OK`, no tools |
| Matched control, extensions enabled | 26.95 | `OK`, no tools |

Transport completion is not an answer-quality verdict. Raw answers and tool calls were reviewed separately.
The identity run states its name and path before the read, then supplies the budget summary after it.

### Failures retained, not relabeled as passes

- The first cold Orchestra identity attempt timed out after 240 seconds. It preceded entrypoint compaction.
- The first repaired Unsloth answer still called four-bit storage INT4 and guessed tensor precisions.
- An intermediate identity answer claimed a first-20-lines check without a read call.
- An intermediate LLaMA-Factory answer treated `response` as a default Alpaca source field.

Those observations drove additional red/green repairs. Their original JSONL and result files remain intact.
The final filesystem-read check includes an actual read event. No earlier failed attempt was overwritten.

## Latency interpretation

Here, cold means no reported prompt-cache hit, not loading model weights from disk.
For the same Orchestra identity prompt and unchanged deadline:

- Initial first request: 43,132 input tokens, no cache hit, no completed answer at 240 seconds.
- Compact-entrypoint first request: 38,166 input tokens, no cache hit; complete answer in 205.77 seconds.

This demonstrates reduced entrypoint overhead and a completed comparable cold case.
It does not establish a universal startup SLA or isolate every source of runtime variance.
The installed catalogue still contains 330 names, and cold sessions remain slow.
Both matched control runs reported 37,057 cached tokens, so their timings are warm observations.
Their extension stacks and scratch directories differ; do not attribute their entire timing difference to Orchestra.

No model-server tuning, model unloading, or personal-profile changes were performed.

## Remaining limits

- Two latest responses exceeded requested word caps: Unsloth 158/140 words; vLLM reference 93/80 words.
  These are formatting failures, not clean passes of every prompt constraint. Counts use whitespace-separated final-response words.
- No model was trained, no weights or datasets were downloaded, and no framework recipe was reproduced.
- Actual model compatibility, adapter dtype, memory fit, throughput, and task quality require a separately authorized environment.
- Remote provider account/model restrictions from the earlier verification were not changed or retested.
- Full-extension initialization can create scratch-project metadata despite read-only model tools.
- This is self-review, not an independent reviewer verdict or certification of every upstream technical example.

## Reproduction and evidence

```bash
npm test
node --test scripts/check-optional-demo.test.mjs
node scripts/verify-pi-installed.mjs /absolute/path/to/pi/dist/core /tmp/pi-inventory.json
node scripts/verify-pi-live.mjs /tmp/new-pi-evidence orchestra-identity 240
```

Use a new output directory. See `docs/PI-VERIFICATION.md` for model overrides and other scenarios.

Committed artifacts include red/green logs, final test logs, this report, [TDD.md](TDD.md), and [AUDIT.md](AUDIT.md).
Raw host evidence:

```text
/home/k0stia/code/pi/.pi/verification/ai-research-repair-20261021/
```

It contains `live/`, `live-recheck/`, `live-final/`, installed inventories, accepted package output,
latency observations, historical checksum verification, and isolated commit replays.
`RAW-SHA256SUMS` pins raw logs, results, inventories, and tarballs relative to that evidence root.
Extracted package copies, archive snapshots, and scratch workspaces are excluded from that manifest.
`SHA256SUMS` covers the committed report and local evidence files.

No push, publication, paid-compute provisioning, model training, or image-generation API call occurred.
