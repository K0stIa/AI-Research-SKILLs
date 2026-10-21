---
type: self-audit
context: Bounded review of three Astra repairs, not independent reapproval
---

# Repair self-audit

## Correctness and tests

- PASS: cumulative allowance is enforced independently of successful-read evidence. Legal split requests totaling 40 pass; over-budget, repeated, overlapping, and failed-request cases cannot evade the budget. Existing main-file, response, transport, and per-call checks still pass.
- PASS: the ignored-label branch reduces an empty masked tensor, not ignored FP16 values. The overflow regression checks forward finiteness and exact zero student gradients separately from teacher detachment.
- PASS: the full Wanda function uses feature L2 norms over all observed leading dimensions and batches. A hand-computed mask fixture distinguishes this from L1, per-batch means, summed per-batch norms, and global pruning. Ties/endpoints, empty calibration, FP16 accumulation, invalid/non-finite statistics, and cleanup are covered.
- PASS: each red commit changes only tests and reproduces the intended defect in an isolated archive. Each corresponding fix passes. Full source and real-tarball tests pass.

## F.I.R.S.T

| Criterion | Evidence |
|---|---|
| Fast | Synthetic events and tiny CPU tensors/modules; no pretrained models, optimizer steps, or service execution. |
| Independent | Each fixture creates its own inputs/model. Archives exclude untracked checkout state. |
| Repeatable | Explicit weights, inputs, masks, and expected failure signatures. Random Linear initialization is overwritten before use. |
| Self-validating | Assertions produce terminal exit codes; replay requires positive test counts. |
| Timely | Three separate red commits precede their implementation commits. |

Tests use exported evaluator behavior and actual extracted guide functions. The hook-cleanup check additionally inspects PyTorch's resource registry, a deliberate host-framework-specific check rather than an assertion about guide-local variables. That check is not a promise about every PyTorch version. The existing repository-only CPU test file grew within its established extraction pattern; no unrelated whole-file refactor was mixed into these bug fixes.

## Security, performance, and clarity

- No dependencies, permissions, external API integrations, workflow files, or settings changed. No slopcheck/dependency installation was needed or run.
- Five credential-pattern scans of the scoped diff found zero candidates. This is not whole-library secrets/security certification.
- New `exec` in the CPU regression extracts a function from trusted checkout AST. It is not fed model/user expressions and is explicitly not a hostile-code sandbox. Repaired calculator helper remains unchanged.
- Float32 calibration storage avoids the tested FP16 accumulation overflow. Row-wise stable sorting avoids a full weight-matrix sort allocation. No memory-fit, latency, retained-quality, or GPU/backend performance guarantee follows.
- Full Wanda example now discloses evaluation-mode persistence, padding, one-pass versus layer-sequential behavior, extreme score-range limits, and unsupported custom/offloaded layers.
- Names, paths, author/license fields, 98 skills, 23 categories, and Feynman's separate command remain intact. Only the two affected skill versions change.

## Tooling and verdict limits

No `CONVENTIONS.md`, Bigpowers timing/red-isolation helpers, release-story capsule, build/lint/typecheck npm script, or full pipeline/device acceptance exists for this scoped repair. Do not interpret their absence as a successful run. Used explicit tests, archive replays, package parsing, whitespace checks, and active LSP probes instead.

The earlier eight-path active LSP result had zero findings, five confirmed clean and three inconclusive. A final probe confirms all 17 changed source/report paths clean. Unchanged large vendor archives remain outside full LSP coverage, and auxiliary-tool availability is not a security certification. Historical review-probe ModuleType cache findings were contradicted by fresh LSP hover showing both values callable, then marked stale false positives using their exact reported identities. No inline suppression, settings change, or checksum-bound historical edit was used.

The targeted repairs pass parent verification. Astra has not independently re-reviewed the fixes. Whole-library semantic/SDK/device acceptance remains open; stricter saved-event reevaluation is not a fresh live-model run.
