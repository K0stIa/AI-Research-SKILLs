---
type: bug-plan
context: User-approved TBB repair of the inherited production Wanda caller
status: planned
---

# Production Wanda calibration boundary

Baseline: `8a9ea6f9180016317f7212aaa2a8fc062e1369c5`, branch `pi`.

Astra's independent review found that `production_pruning_pipeline` in `19-emerging-techniques/model-pruning/SKILL.md` passes WikiText dictionaries containing `text` directly to `wanda_prune`. The helper requires tokenized model inputs. The saved toy repro raises `TypeError: ToyCausalModel.forward() got an unexpected keyword argument 'text'`. The caller was already invalid before the approved helper repairs; no new helper regression was established.

Review evidence: `/home/k0stia/code/pi/.pi/verification/ai-research-astra-adjacent-review-20261021T141109Z-NjF7sl`.
New repair evidence: `/home/k0stia/code/pi/.pi/verification/ai-research-wanda-caller-fix-20261021T153515Z-CQJG7G`.

## Approved scope

- Add one regression that extracts both actual guide functions and executes their calibration connection with CPU fixtures. Stub model/tokenizer/dataset loading, then deliberately stop before Trainer configuration. Do not load an SDK/model, train, save a checkpoint, or run an optimizer.
- Exercise mixed nonempty and whitespace-only rows, unequal sequence lengths, bounded truncation, empty input and blank-only input. Check tokenizer arguments/device movement, observed forward tensors, actual per-output pruning and hook cleanup.
- Commit the intended failing test separately before changing the guide.
- Tokenize row `text` in the Wanda branch, skip blank strings, truncate to an explicitly illustrative limit and move prepared dictionaries onto the model device. Keep preparation lazy. Do not change the shared pruning algorithm or SparseGPT path.
- Mark the surrounding production example as an integration sketch with explicit external training/SparseGPT/context/device prerequisites, not a certified end-to-end pipeline. Increment only model-pruning's patch version.
- Replay committed red/green archives with a positive focused test count and expected failure signature. Run full Node/CPU/demo/inventory checks, actual offline package tests and installed discovery. Preserve prior reports and their six-session failures.

## Acceptance and limits

The raw-text forwarding failure must disappear in the actual caller path. Existing 52 CPU tests must still pass. Keep all 98 names, paths, authors and licenses across 23 categories. No package/runtime dependencies or settings change.

Baseline passes: 35 Node tests, 52 bounded CPU tests, one optional-demo regression, inventory98/23. No new live sessions or independent review are authorized by this repair request. Full Trainer/SparseGPT/model access, actual dataset schema/availability, device/offload, scientific quality and throughput remain unverified. Toy fixtures model the guide's stated raw-row schema only.

`CONVENTIONS.md`, Bigpowers timing/red-isolation helpers, release capsule and state ledger are absent. Use explicit committed-archive replay instead; do not claim unavailable gates ran. No install, pretrained-model download, training, optimizer step, publication or push.
