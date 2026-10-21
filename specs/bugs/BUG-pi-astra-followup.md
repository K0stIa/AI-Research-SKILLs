---
type: bug-fix-plan
status: verified-with-limits
context: User-approved repair of three independently reviewed Astra P2 findings
---

# Astra follow-up repairs

Baseline: `807fcffb401d8a44033178517092468ac6cc6f5b`, branch `pi`.
Independent review and parent reproductions: host evidence `ai-research-exhaustive-20261021T065003Z/astra-review-validation-01/`.

## Scope and test-before-build plan

1. **Cumulative reference budget.** Add a failing regression through `evaluateSkillRun`: two individually legal reference reads must fail when their requested limits exceed 40 in total. Cover exactly 40 across calls, overlapping/repeated reads, and an unsuccessful earlier request. Then enforce the case-wide requested-line budget without changing response fields, timeouts, or the main-file contract.
2. **All-ignored FP16 loss.** Add a failing extracted-function regression with finite FP16 logits whose ignored-value sum overflows. Require finite zero loss, zero student gradients, and no teacher gradients. Then replace the reduction over ignored values with an empty masked reduction. Bump the skill patch version.
3. **Full Wanda example.** Add failing tiny CPU regressions through the extracted `wanda_prune`, not just the per-output fragment. Require sequence-shaped calibration, feature-wise L2 statistics accumulated across unequal batches, per-output exact coordinate pruning under ties, valid sparsity endpoints, and hook cleanup on calibration failure. Then flatten leading activation dimensions, accumulate squared sums in float32, and use per-output selection consistent with the existing fragment. Remove autograd-unsafe `.data` mutation. Bump the skill patch version. The full example must remain explicitly limited to ordinary linear layers and unmasked, finite calibration inputs; no complete LLM/backend certification.

Each item gets a separate failing-test commit before its fix commit. Replay those revisions from Git archives with expected failure signatures before accepting green. Preserve all previous evidence and original verdicts. Existing Bigpowers timing/red-isolation scripts and `CONVENTIONS.md` are absent; use explicit local commands and archive replays, not claims that missing validators ran.

## Verification

- Focused Node regression and bounded CPU classes for each cycle.
- Full `npm test`, existing-PyTorch CPU suite, optional-demo regression, inventory, and actual extracted-package Node tests.
- Installed discovery uses actual existing settings without forced package selection.
- New evidence directory, source hashes, red/green logs, isolated-replay results, tarball digest, and final report.
- Reevaluate saved live records separately, under the stricter evaluator and final source hashes. Do not overwrite original results or silently rerun the live matrix.

## Verified checkpoint

Product `00a303d2e141c79f814ab9ee87fba72466c24226` repairs all three findings. Three separate red/green pairs replay correctly in isolated archives. Final checks pass: 35 source Node tests, 36 CPU tests, one optional-demo regression, inventory, installed discovery, and 35 extracted-package Node tests.

The same 130 frozen attempts have unchanged mechanical verdicts. After the two skill-source changes, selected-source currency is 96/98 attempted and 71/98 mechanically passing, with 27 current gaps. No live attempts or post-fix Astra re-review occurred.

See `specs/verifications/pi-astra-followup/REPORT.md`, `TDD.md`, and `RESULTS.json`. This scoped bug is verified with limits; the original exhaustive-verification bug remains open.

## Limits

No installs, settings changes, pretrained models, training, optimizer steps, external service calls, publishing, or push. All 98 names and directory paths remain unchanged. CPU tests execute trusted checkout snippets and are not hostile-code sandboxes. Overall all-skill behavioral/semantic acceptance remains open regardless of these targeted fixes.
