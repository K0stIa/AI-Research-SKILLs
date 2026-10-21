---
type: tdd-evidence
context: Actual production Wanda caller-to-helper regression
---

# Caller TBB cycle

| Phase | Revision | Changed files | Focused result |
|---|---|---|---|
| Plan | `f2495ff` | Bug plan and impact only | Baseline35 Node/52 CPU/1 demo/inventory pass |
| RED | `3f05354e070033e2e101b997e1499d199f1a97cc` | Only `scripts/check-distillation.test.py` | One test, four scenarios; exit1, three raw-row failures |
| GREEN | `a15455b1ad5dc0976023cec3342f7aba827423ca` | Only model-pruning `SKILL.md` | Same test/scenarios; exit0 |

The regression executes the actual `production_pruning_pipeline` and `wanda_prune` functions extracted from Python fences. Model, tokenizer and dataset loaders are external-I/O fixtures. A sentinel raises at `TrainingArguments` construction, before Trainer setup, training or checkpoint save. The rest of the production sketch is not certified.

Mixed rows exercise two unequal-length token batches and a whitespace-only row. The expected numerical mask removes feature0 in the first output and feature1 in the second. A2050-token fixture must truncate to2048. Empty and blank-only datasets produce no forward calls and preserve weights. Tokenizer arguments, actual token IDs/masks, `.to(model.device)` calls, gradients and hook cleanup are checked.

## Intended RED

```text
Production Wanda calibration forwarded raw rows:
...CpuCausalModel.forward() got an unexpected keyword argument 'text'
Ran 1 test in ...
FAILED (failures=3)
```

This is the reported interface defect, not a missing SDK/global or syntax failure. Empty input already passed before repair. Three failing subtests do not mean three separately counted unittest tests.

## Committed isolation

`replay.py` first checks RED's `git diff-tree` contains only the CPU test file. It exports each committed revision with `git archive`, extracts into a new tree and executes:

```bash
CUDA_VISIBLE_DEVICES="" python3 scripts/check-distillation.test.py WandaProductionCallerExample
```

`isolated-red.json` records exit1/count1 and the exact raw-row signature; `isolated-green.json` records exit0/count1 and `OK`. Archives and complete stdout/stderr hashes are retained. RED replay happened before guide implementation; GREEN replay happened after fix commit. No stash/reset/history rewrite or dependency installation.

The repository lacks `verify-tdd-red-commit.sh`, Bigpowers timing/state helpers and a release task ledger. These unavailable gates were not run or impersonated. The explicit archive checks above provide bounded red isolation.

Final full CPU suite executes53 tests, compared with52 at baseline. Source and extracted-package Node suites each execute35; optional demo executes1. All pass. Tests execute trusted checkout code, not hostile-code sandboxes.
