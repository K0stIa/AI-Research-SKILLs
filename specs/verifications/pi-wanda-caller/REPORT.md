---
type: verification-report
context: User-approved production Wanda caller TBB repair
---

# Production Wanda caller repair

The raw-text forwarding defect is repaired. This is parent verification of the calibration connection, not fresh independent review or end-to-end production certification.

Baseline: `8a9ea6f9180016317f7212aaa2a8fc062e1369c5`, branch `pi`.
Product: `a15455b1ad5dc0976023cec3342f7aba827423ca`.

## Repair and TBB

Test-only RED `3f05354e070033e2e101b997e1499d199f1a97cc` precedes GREEN `a15455b1ad5dc0976023cec3342f7aba827423ca`. RED changes only `scripts/check-distillation.test.py`; GREEN changes only model-pruning's entrypoint. Both committed Git archives independently execute the focused regression: one test with four scenarios, expected exit1/signature in RED and exit0 in GREEN.

The actual caller now lazily tokenizes nonblank row `text`, uses `return_tensors="pt"`, truncates at2048 tokens, transfers prepared dictionaries to `model.device`, then passes them to the actual Wanda helper. The numerical helper and SparseGPT branch ASTs are unchanged. Model-pruning version moves from1.0.3 to1.0.4; all98 skill identities and author/license fields remain fixed. Entrypoint remains499 lines.

The regression extracts both actual functions. External model/tokenizer/dataset loaders are CPU fixtures; execution deliberately stops at Trainer configuration. Mixed rows, unequal lengths,2048-token truncation, empty input and blank-only input check actual forward tensors, masks, device-transfer calls, hand-derived pruning coordinates, empty-input weight preservation, absent gradients and hook cleanup. RED has three intended raw-row failures; empty input already passes. No SDK/model loader, training or optimizer runs.

The broader section is now explicitly an integration sketch. A compatible `finetune_dataset`, version-checked SparseGPT adapter, model context/device compatibility and independent Trainer/evaluation validation are prerequisites. This repair does not make every remaining line a runnable production pipeline.

## Executed checks

- Baseline:35 Node tests,52 CPU tests,one optional-demo regression and inventory98/23 pass.
- Final:35 Node tests,53 bounded CPU tests,one optional-demo regression and inventory98/23 pass.
- Actual offline-built npm tarball repeats35 Node tests. All466 category files match checkout; eleven standalone JS/Python/JSON files parse.
- Package retains478 files,98 skills,23 categories and291 references;7,973,345 unpacked bytes. CPU suite, optional demo, specs and runtime metadata remain excluded.
- Installed discovery from `/tmp`, parent and checkout retains98 active Orchestra skills among330 names, no missing/shadowed definitions or discovery diagnostics, and separate Feynman `autoresearch`.
- Selected historical integrity:6 prior portable,93 prior repair raw and97 Astra-review entries match,196 total. Older manifests outside this selection were not rechecked.
- Scoped five-pattern credential scan finds no candidates in the changed guide/test diff. Not whole-library security certification.

Tarball `ai-research-skills-1.0.1.tgz`, SHA256 `94ed4c479fb991e600cc7a03e1bfd549c2946e36348a7235f43fddae16e9502c`.

## Limits and open findings

The latest prior Astra review accepted both earlier helper repairs but blocked its six-case live cohort: GPTQ timed out, pruning omitted reads, and distillation/LangChain retained semantic or planning concerns. Both identities completed. Those immutable attempts are not rerun here or relabeled success. This skill source changed again, so its old selected-source evidence is not current.

LSP is not universally clean. The six-path changed-work probe reports no primary errors, three clean outcomes, two auxiliary-warning outcomes and one timed-out check. Trusted-checkout `exec`/`eval` test warnings are not a hostile-code sandbox guarantee. Two initial metadata-helper parse findings were corrected with local handlers. Final helper recheck reproduces audit values; a Python AST check finds2 initial/0 final unprotected named calls. Native NAPI Python grammar was unavailable, so this is not native-rule certification. Active LSP rechecks have zero findings but push-only coverage is inconclusive. A later full-workspace analyzer refresh no longer reports the original JSON errors; its constant-pattern regex finding was classified false-positive and eleven verifier-helper warnings remain. No complete clean-diagnostics verdict follows. Thirteen unrelated baseline errors remain deferred and logged in `../../bugs/BUG-pi-baseline-python-diagnostics.md`, without source suppression or settings changes. See `AUDIT.md` and raw `diagnostics.json`.

No new live sessions, independent post-fix Astra approval, installs, pretrained models, training, optimizer steps, settings/server changes, publication or push. Actual dataset availability/schema, full Trainer/SparseGPT/backend/device paths, scientific quality and throughput remain unverified. The broader exhaustive bug stays open.

Evidence root: `/home/k0stia/code/pi/.pi/verification/ai-research-wanda-caller-fix-20261021T153515Z-CQJG7G`.
See [TDD.md](./TDD.md), [AUDIT.md](./AUDIT.md), [EVIDENCE.md](./EVIDENCE.md) and [RESULTS.json](./RESULTS.json).
