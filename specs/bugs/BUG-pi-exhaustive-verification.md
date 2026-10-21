---
type: bug-fix-plan
context: Exhaustive installed-skill verification requested after the initial repair
status: in-progress
---

# Exhaustive research-skill verification

User requested detailed verification and test-before-build repairs.
Keep branch `pi`, all 98 names and directory paths, and Feynman's separate skill.
Do not change personal settings or the model server, install dependencies, download models, train, provision compute, publish, or push.

## Baseline

The previous report covered 12 live scenarios, not every skill.
Baseline commands still pass: 19 Node tests, one optional-demo regression, and inventory validation.
An expanded inspection found:

- DeepSpeed's 141-line entrypoint contains 144,988 bytes, mostly scraped documentation flattened into giant lines.
- Reference-to-reference links were not covered by the original main-file link test.
- At least two reference indexes point to missing `papers.md` files.
- An Unsloth documentation index contains 78 website-relative links that look like local absolute paths.
- Fourteen of 980 Python-tagged entrypoint snippets do not parse. Some are mislabeled shell, YAML, diff, or pseudocode; others contain actual errors.
- Existing live analysis intentionally reports transport completion only. A second layer must check actual successful reads and response contracts.

## Test-before-build sequence

1. Add failing semantic-evidence tests. Reject invented inspection, missing successful read results, wrong identities, malformed output, exceeded length limits, and unapproved tool actions.
2. Implement read-evidence and response-contract checks without calling transport completion or mechanical compliance a semantic correctness verdict.
3. Add a failing bounded-entrypoint regression for DeepSpeed. Replace flattened scrape output with grounded progressive disclosure; preserve source documentation.
4. Add failing all-reference link tests, distinguish website-relative links from local assets, and repair reproduced targets.
5. Add failing syntax tests for Python-tagged examples. Repair executable examples or label deliberate fragments with the correct language.
6. Add and test a complete 98-skill installed-run matrix, including coverage and failure/timeout handling. Run real Pi processes, not mocked model answers.
7. Review every result against its local reference and domain purpose. Reproduce and repair further defects with separate test-only and passing-fix commits.

## Execution limits

Live Pi verification uses read-only tools. Each skill gets a bounded main-file read, a bounded supporting-reference read when available, and an application-specific planning response.
Tiny CPU example tests may use existing PyTorch without pretrained-model loading, optimizer steps, downloads, or external service calls.
Use actual installed configuration without `-e`, replacement settings, or hiding collisions.
A shared empty workspace is permitted for extension-disabled read-only processes, with mutation checks.
Full-extension controls use separate scratch workspaces because initialization can write metadata.
Record per-case deadlines and an overall suite budget. Do not retry failures silently or overwrite earlier attempts.

## Acceptance

- All 98 skills covered by inventory, package, metadata, asset/link, and applicable syntax checks.
- Every skill included in the operational matrix; missing or incomplete cases cannot yield a passing aggregate.
- Model answers checked independently of exit status. Actual read results, identity, and requested output limits recorded.
- Each failure gets its own evidence and classification. Unsupported frameworks and unexecuted training are not certified.
- Current source and accepted tarball pass deterministic tests; historical evidence remains unchanged.

## Checkpoint after repairs

Product/package revision: `4dc40f4f29a633f49d94d713cb987d4410413834`.

- Deterministic checks pass: 34 Node tests, 27 bounded CPU examples, one optional-demo regression, inventory, and 34 tests in the extracted real tarball.
- Package contains 478 files, including 98 skills and 291 references. All 466 category files match checkout bytes. All 51 changed skill directories have version changes; no skill names/paths were changed.
- Twenty-seven isolated red/green scenarios pass across 25 failing-test commits. Historical 51-, 34-, and 128-file checksum manifests remain valid.
- Original full matrix attempted 98/98, but 25 failed its then-current contract. Later stricter/current-source reevaluation and explicit reruns remain separate.
- Focused semantic review finds unsupported facts and prerequisites even among mechanical passes. The fresh GPTQ answer still invents `auto-gptq 0.9+`; retrieved PyPI metadata reports latest `0.7.1`.
- Step 7 and universal behavioral/semantic acceptance remain incomplete. SDK/device/training paths and non-Python fence builds are not certified.

Detailed evidence and current counts: `specs/verifications/pi-exhaustive/REPORT.md`, `RESULTS.json`, `TDD.md`, and `AUDIT.md`. Keep this bug open; successful package tests do not close the remaining acceptance gaps.
