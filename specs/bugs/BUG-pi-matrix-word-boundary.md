---
type: bug-fix-plan
context: Approved matrix-boundary TBB repair
status: verified-with-limits
base-revision: 8b9268ecacaafc60a2d3072302a52e1f627f22a7
---

# Matrix total-word boundary

## Reason for existence

Match the matrix word check to its original prompt.
Preserve that prompt and all historical verdicts.
The operator approved this separate TBB repair. A live baseline remains unapproved.

## Defect at baseline

At the base revision, `buildSkillMatrix` in `scripts/verify-pi-matrix.mjs` set `maxWords: 140`.
The unchanged prompt requires the entire JSON to stay "under 140" whitespace-separated words, including keys and paths.
`evaluateSkillRun` rejects only counts greater than the inclusive `contract.maxWords`.
A valid 140-word answer passed that matrix contract in the RED regression.
This mismatch is not an established explanation for the historical model failures.

## Scope and impact

Change the matrix-specific inclusive maximum to 139. Preserve the shared evaluator's inclusive maximum semantics for other callers.
Production caller: `runCase` passes the matrix item to `evaluateSkillRun` without changing that limit.
Tests and host-local evidence scripts also consume matrix items. Old serialized contracts and sealed verdicts remain historical artifacts.

Risk is low. The change tightens one integer boundary for future mechanical evaluations across the 98 matrix items.
Do not change field caps, read budgets, prompts, deadlines, inventory, skill versions or command identities.
No skill content changes, so no skill patch-version increment applies. No package publication or version change is planned.

## TBB sequence

1. Add one regression through the real matrix builder and response evaluator. Use a temporary local skill fixture and synthetic successful read/completion events.
2. Exercise valid bare JSON with exactly 139, 140 and 141 words. Keep every other field/read contract valid. Require 139 to pass and 140/141 to fail only with `word-cap-exceeded`.
3. Prove the intended assertion failure, then commit only the test. Replay it from a committed Git archive with unchanged production source before implementation.
4. Change only the matrix maximum to 139. Run the identical regression and existing deterministic suites. Commit the implementation separately.
5. Replay identical test bytes against committed RED and GREEN archives. Audit and save native counts, signatures, source hashes and retained limits.

Spaces in valid absolute fixture paths consume the prompt's total budget. They do not consume a prose field budget.
The path spaces make the response reach the total boundary.
Each field stays within its budget. The JSON stays valid.
Synthetic events are unit-test inputs, not claims of real Pi sessions or model behavior.

## Verification

```bash
node --test --test-name-pattern='matrix word boundary rejects exactly 140 words' scripts/check-pi-verification.test.mjs
npm test
CUDA_VISIBLE_DEVICES="" python3 scripts/check-distillation.test.py
node --test scripts/check-optional-demo.test.mjs
bash scripts/check-inventory.sh
```

Run packaging checks offline with lifecycle scripts disabled. Run packed Node tests without real Pi fallback.
Use native archive replay because the repository has no `verify-tdd-red-commit.sh` helper.
Absent timing, conventions, release/story, churn and coverage helpers are not claimed as executed gates.
No independent reviewer is authorized for this repair.

## Evidence and limits

Host-local evidence root:

```text
/home/k0stia/code/pi/.pi/verification/ai-research-matrix-word-boundary-20261022T211806Z
```

Preflight passed all 35 existing Node tests with zero skips and failures.
Preserve the separate untracked acceptance draft unchanged. It is a pre-repair proposal, not execution approval.
The repair report supersedes that draft's pre-repair description of the evaluator-boundary mismatch.
No live baseline, generation request, backend operation, private settings read, installation, training, further delegation or push is authorized.
A passing deterministic oracle regression cannot establish improved generated answers or whole-library semantic acceptance.

## Verified outcome

RED `e22fbc4a763eccac5ea08f8da3171f80b9009488` contains only the regression.
GREEN `a32238435c6ec11a70037bc844133474503b7a2d` changes only the matrix maximum to 139.
Identical test bytes expose the intended 140-word defect in the RED archive.
They pass in the GREEN archive.
The one regression covers three boundary cases, not three separate tests.

All 36 Node tests, 53 CPU tests, one optional-demo test and 36 packed Node tests pass. Full suites have no skips.
The inventory remains 98 skills across 23 categories. All 466 category payload files match the source.
All 98 rebuilt contracts now use 139. Every other contract field remains unchanged.

See the [repair report](../verifications/pi-matrix-word-boundary/REPORT.md) for native counts, hashes, audit and exclusions.
No post-change live behavior result follows. The live baseline and whole-library semantic acceptance remain open.
