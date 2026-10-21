---
type: verification-report
context: User-approved TBB repair of three Astra P2 findings
---

# Astra follow-up verification

**The three reported defects are repaired and pass targeted regressions. Overall library acceptance remains open.**

Baseline: `807fcffb401d8a44033178517092468ac6cc6f5b`.
Accepted product revision: `00a303d2e141c79f814ab9ee87fba72466c24226`, branch `pi`.
No fresh Astra approval is claimed. The retained independent review was source-only and returned BLOCK; the subsequent reproductions, repairs, and checks here are parent work.

## Repairs

| Finding | Test-only red | Passing fix | Verified behavior |
|---|---|---|---|
| Cumulative reference allowance | `c68b82f` | `8faeeaf` | At most 40 requested supporting lines per case. Failed, repeated, and overlapping requests consume the allowance. Two 40-line calls fail; two 20-line calls pass. |
| FP16 all-ignored loss | `67929ee` | `69ff7b4` | Empty masked sum returns finite zero for ignored finite FP16 logits whose ordinary sum overflows. Backward gives zero student gradients and no teacher gradients. |
| Full Wanda sequence calibration | `a373ea5` | `00a303d` | Collapse leading activation axes, accumulate feature squared sums across batches in float32, then take L2 norms. Prune exact coordinates per output with stable tie handling under `no_grad`; clean up hooks on failure. |

Wanda tests also cover unequal batches, 2D/3D/4D input, zero/full sparsity, invalid sparsity, empty calibration, FP16 activation accumulation, and non-finite statistics. The example remains a one-pass teaching sketch, not the paper's layer-sequential pipeline. It leaves the model in evaluation mode, does not mask padding, and does not certify offload, sparse kernels, score range for arbitrary extreme float32 values, quality, or speed.

Skill versions: knowledge-distillation `1.0.3` to `1.0.4`; model-pruning `1.0.1` to `1.0.2`. All 98 names and paths remain unchanged.

## Deterministic results

- 35 source Node tests, 36 bounded CPU tests, and one optional-demo regression pass.
- All three red revisions fail in isolated Git archives with the expected defect signatures and positive executed-test counts. Their corresponding green revisions pass. See [TDD.md](./TDD.md).
- Actual tarball repeats all 35 packaged Node tests. It contains 478 files, 98 skills, 23 categories, and 291 reference files. All 466 category files match checkout bytes. Eleven standalone JS/Python/JSON files parse.
- Installed discovery from `/tmp`, the checkout parent, and the checkout finds all 98 Orchestra skills active among 330 names, without missing/shadowed skills or discovery diagnostics. Feynman's separate `autoresearch` remains selected. No forced `-e` selection.
- Final active LSP probe confirms all 17 changed source/report paths clean, with zero findings. An earlier eight-path probe had five confirmed clean and three inconclusive; that limitation is retained in `RESULTS.json`. Neither result establishes full LSP coverage of unchanged large vendor archives.
- Rechecked historical manifests covering 7 portable, 630 raw, 34 earlier portable, 128 earlier host, 51 original host, and 8 Astra-parent artifacts. All 858 hashes match.

Tarball `ai-research-skills-1.0.1.tgz`: 7,972,542 unpacked bytes.
SHA-256: `0fc3e029cc84dc7215f6b5a4fd9275c732be32c88b822b7f870626cb9db33635`.
The repository-only CPU suite, optional demo, review runtime metadata, and these reports are excluded from that tarball.

## Saved live evidence, not new live execution

Reevaluated the same 130 frozen attempts under the stricter evaluator. **No mechanical verdict changed.** No retained case had exceeded the cumulative reference budget.

Final selected-source currency is now **96/98 attempted and 71/98 mechanically passing**, with 27 current mechanical gaps. Two changed skills, knowledge-distillation and model-pruning, lack fresh selected-source attempts. Only model-pruning had a passing eligible case before these source changes, so the prior 72 becomes 71. The original 98-current-attempted, 72-passing checkpoint remains immutable and valid for its own source revision.

These pooled counts are not a first-pass reliability rate. The prompt wording also changed and has not been live-rerun. Current source currency compares selected main/reference bytes, not every library file. Prior semantic notes and SDK/device limits remain historical, not renewed certification.

## Scope and evidence

Host evidence: `/home/k0stia/code/pi/.pi/verification/ai-research-astra-fixes-20261021T104330Z`.
See [EVIDENCE.md](./EVIDENCE.md), [RESULTS.json](./RESULTS.json), and [AUDIT.md](./AUDIT.md).

No installs, personal/model-server setting changes, pretrained models, optimizer steps, external API calls, live matrix reruns, publication, or push. Tiny CPU tests execute trusted repository snippets and are not hostile-code sandboxes. Overall behavioral/semantic acceptance remains open under `specs/bugs/BUG-pi-exhaustive-verification.md`.
