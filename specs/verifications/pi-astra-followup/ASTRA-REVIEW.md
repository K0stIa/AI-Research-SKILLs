# Independent Astra review

**Verdict: BLOCK.** Three P2 findings below. No fixes made.

Branch `pi`; HEAD confirmed from `.git/refs/heads/pi`: `807fcffb401d8a44033178517092468ac6cc6f5b`. Accepted product revision recorded as `4dc40f4f29a633f49d94d713cb987d4410413834`.

## 1. Verified claims

- **Supported:** 130 pooled attempts, 98 current-source attempts, 72 mechanically passing skills, 26 gaps. Cohort arithmetic: `2+2+98+12+6+9+1=130`. Inspected complete `review-03/coverage.json`, aggregation implementation, and sampled records. Aggregation correctly separates source currency, any-current pass, and latest-current pass. **Hashes and all event streams not independently recomputed.**
- **Supported:** semantic/SDK acceptance explicitly incomplete. Reports consistently distinguish mechanical passes from technical correctness; no all-skills-working claim.
- **Supported by retained logs:** 34 source Node tests, 34 extracted-package tests, 27 CPU tests passed. These are historical results, not reruns performed during this review.
- **Supported, bounded scope:** calculator helper removes Python evaluation, restricts AST operations, and bounds input/tree/numeric size. Inspected both example imports and isolated red/green logs. No concrete injection defect found in repaired helper.

## 2. Contradicted claims / concrete findings

### P2-1 — Reference read budget enforced per call, not per case

**Location:** `scripts/pi-verification-events.mjs:79–85`
**Status:** supported defect; high confidence. **Introduced verifier gap**, not pre-existing guide behavior.

**Evidence:** evaluator rejects individual reference reads exceeding 40 lines, but maintains no cumulative allowance. Matrix prompt says “read at most 40 lines” from selected reference.

**Source-derived repro, not executed:** extend existing valid fixture with another successful reference read using new tool-call ID, `offset: 41, limit: 40`. Original read covers lines 1–40; added read covers 41–80. Every evaluator check still passes.

**Impact:** cases exceeding requested supporting-read scope can receive mechanical acceptance. Existing tests cover one 41-line call, not multiple legal-sized calls. No inspected historical case established count inflation.

**Smallest fix:** track cumulative reference-line requests per case; reject totals above 40.

**Regression:** valid main read plus two disjoint 40-line reference reads must fail; one bounded reference read must pass.

### P2-2 — “All ignored” loss repair can still return NaN with finite FP16 logits

**Location:** `19-emerging-techniques/knowledge-distillation/SKILL.md:86–87`
**Status:** supported defect; high confidence. **Incomplete repair**, not newly introduced all-ignored failure.

**Evidence:** added guard returns `student.sum() * 0.0`. Default example loads FP16 models. Existing all-ignored regression uses small float64 tensors.

**Source-derived repro, not executed:** student logits `torch.full((1, 3, 2), 40000.0, dtype=torch.float16, requires_grad=True)`; matching teacher; all labels `-100`. Shifted student contains four finite values. Sum exceeds FP16 maximum, becomes infinity; multiplication by zero produces NaN.

Archived `tdd-isolation/c4890f8/.../SKILL.md` confirms old implementation already mishandled all-ignored targets. New guard fixes tested values but leaves overflow route.

**Impact:** ostensibly empty supervision batch can emit non-finite loss despite documented repair.

**Smallest fix:** sum empty masked tensor, e.g. `student[valid].sum()`, preserving differentiability without reducing ignored values.

**Regression:** FP16 overflowing-sum fixture must return finite zero; backward must produce zero student gradients and no teacher gradients.

### P2-3 — Wanda full pruning example retains broken sequence-axis handling

**Location:** `19-emerging-techniques/model-pruning/references/wanda.md:83`, `:114`
**Status:** supported defect; high confidence. **Pre-existing guide defect**, unchanged by focused per-output repair.

**Evidence:** hook computes `X.abs().mean(dim=0)` while comment claims averaging batch/sequence. For activation shape `[1,4,3]`, result remains `[4,3]`. Multiplying its unsqueezed `[1,4,3]` form by linear weights `[2,3]` fails broadcasting. Same code exists in archived `tdd-isolation/27b1c88/.../wanda.md`.

**Impact:** ordinary sequence-shaped calibration cannot reach pruning. Current regression extracts only repaired “Per-Output Pruning” fragment; it does not exercise `wanda_prune`.

**Smallest fix:** flatten leading activation dimensions and accumulate per-input squared sums across calibration batches; take square root before importance calculation.

**Regression:** tiny CPU wrapper containing `Linear(3,2)`, input `[1,4,3]`; calibration must produce three activation norms and complete without shape errors. No model download or optimizer needed.

## 3. Weak / unclear / unsupported claims

- **Unclear independently:** complete 27-scenario TBB certification. Inspected replay implementations and selected actual logs; not every pair.
- First replay batch accepts any nonzero red exit with positive test count. Later batches require expected markers. Report acknowledges distinction; sampled numerical/calculator failures were substantive.
- SDK integration, full recipe execution, and semantic correctness remain acknowledged unvalidated behavior—not additional findings.

## 4. Material source-quality concerns

Retained scripts, archived source, and logs provide stronger evidence than report assertions. However, summaries share common derivation; agreement between them is not independent corroboration. Checksums were read, not recalculated.

## 5. Missing evidence

**Commands actually run: none.** Available tools exposed file reads, not shell/runtime execution. Consequently no `git diff`, `npm test`, checksum verification, or proposed repro execution occurred. Historical source comparisons used retained Git-archive trees.

Read requested reports, verifier/tests, calculator source, and selected numerical/configuration examples. `CONVENTIONS.md` absent. No network, installs, live matrix reruns, or mutations performed.

## 6. Material contradictions

- Per-call read checks do not establish case-wide read-budget compliance.
- Float64 all-ignored regression does not establish FP16 finite-zero behavior.
- No contradiction found in reported **130 / 98 / 72 / 26** arithmetic or explicit incomplete-semantic verdict.

## 7. Implications for original conclusion

Keep behavioral/semantic acceptance open. Historical package passes remain valid evidence of those tests, not correctness certification. Address verifier budget gap and incomplete numerical repair before accepting those specific repair claims; track Wanda defect separately as pre-existing.