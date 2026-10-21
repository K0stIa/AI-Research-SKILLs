---
type: bug-fix-plan
status: verified-with-limits
context: User-approved TBB repair of two inherited Astra P2 findings
---

# Adjacent Wanda and MiniLLM repairs

Baseline: `6f562ca371aec89893b0b29e99c30751add426e8`, branch `pi`.
Review evidence: `/home/k0stia/code/pi/.pi/verification/ai-research-astra-rereview-20261021T120922Z-FrO4Y0`.
New repair evidence: `/home/k0stia/code/pi/.pi/verification/ai-research-astra-adjacent-fixes-20261021T132605Z-H68GRi`.

## Approved scope

1. Execute the actual main `model-pruning/SKILL.md` Wanda function in CPU regressions. Cover sequence axes, unequal batches and L2-sensitive masks, ties, sparsity endpoints, invalid sparsity, FP16 statistics, empty calibration and hook cleanup. Commit failing tests before changing the example. Align it with the corrected reference algorithm and tokenize calibration texts before passing input dictionaries. Keep both examples tested. Increment model-pruning patch version.
2. Execute `knowledge-distillation/references/minillm.md`'s actual `reverse_kl_loss` in identity, direction, temperature and gradient regressions. Guard the reference's mathematical labels and adjacent policy-gradient claims. Commit failing tests before repair. Reconcile forward `KL(Teacher || Student)` and reverse `KL(Student || Teacher)`, including student entropy and teacher detachment. Replace the false teacher-sampled policy-gradient/trainer recipe with a source-grounded on-policy explanation and explicit integration gates, not an invented complete trainer. Remove unsupported benchmark and hyperparameter guarantees. Preserve useful guidance and the reference path; retain original content in baseline evidence and Git history. Increment knowledge-distillation patch version.

Each item has its own test-only red commit and passing fix commit. Replay committed revisions in isolated Git archives with positive test counts and expected failure signatures. Missing Bigpowers timing/isolation helpers and `CONVENTIONS.md` are not available gates. Do not manufacture their output or weaken existing checks.

## Verification

- Baseline and final: Node suite, existing-PyTorch bounded CPU suite, optional-demo regression and 98-skill/23-category inventory.
- Focused classes, test-only commit scope checks, isolated red/green replay, active changed-path diagnostics.
- Offline actual npm package build, extracted-package Node suite, byte coverage, existing installed discovery without forced package precedence.
- Preserve historical evidence and verdicts. Record source revisions, version changes, package digest, exact counts and new artifact hashes.

## Boundaries

No source names/paths removed, dependency installs, pretrained models, optimizer steps, training, model/server/settings changes, live-session retries, push or publication. Existing CPU tests execute trusted checkout snippets, not hostile-code sandboxes. Prior six live sessions and full-library acceptance gaps remain historical and open. These two repairs do not establish full MiniLLM/Wanda reproduction, framework/device compatibility, retained quality or speed, or fresh Astra approval.

## Verified checkpoint

Product `ee5b3c43412734ff912b796b107345f80b8bf251` repairs both findings. Main Wanda RED `2e09110` precedes GREEN `63b8f3a`; MiniLLM-reference RED `5843e11` precedes GREEN `ee5b3c4`. All four committed archive replays execute eight tests and give the expected red exit 1 / green exit 0.

Final checks pass: 35 Node, 52 bounded CPU, one optional-demo regression, inventory, installed discovery and 35 extracted-package Node tests. Both corresponding function ASTs now agree. Skill patch versions are model-pruning `1.0.3` and knowledge-distillation `1.0.5`; all 98 identities/paths remain unchanged. Selected historical integrity checks match 227 hashes.

See `specs/verifications/pi-astra-adjacent/REPORT.md`, `TDD.md`, `AUDIT.md` and `RESULTS.json`. No new live runs or independent post-fix approval. The original exhaustive-verification bug remains open.
