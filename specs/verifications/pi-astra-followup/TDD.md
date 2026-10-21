---
type: tdd-evidence
context: Three Astra follow-up behaviors, each committed red before green
---

# Test-before-build evidence

| Cycle | Red revision | Green revision | Isolated command | Red evidence | Green evidence |
|---|---|---|---|---|---|
| Reference allowance | `c68b82fea8fe43b9945a25c93210d79b7b387bb6` | `8faeeaf9866082b79e341aa8954416981530a84e` | `node --test --test-name-pattern='reference read budget is cumulative' scripts/check-pi-verification.test.mjs` | 1 test, exit 1. Missing budget rejection for two 40-line requests. | 1 test, exit 0. |
| Ignored FP16 loss | `67929eebb073d24f2750ebe49f16b80ec1399064` | `69ff7b46f3ad7a08c788b5b52e22eea0d459488c` | `CUDA_VISIBLE_DEVICES= python3 scripts/check-distillation.test.py CausalDistillationExample` | 6 tests, exit 1. `Ignored finite FP16 logits must not produce NaN`. | 6 tests, exit 0. |
| Full Wanda calibration | `a373ea56085203cbb8ba30da11365b4b8b1014ad` | `00a303d2e141c79f814ab9ee87fba72466c24226` | `CUDA_VISIBLE_DEVICES= python3 scripts/check-distillation.test.py WandaFullPruningExample` | 8 tests, exit 1. Sequence-axis broadcast errors, wrong masks, missing validation/cleanup. | 8 tests, exit 0. |

Each red commit changes only its regression test file. The host replay helper verifies that with `git diff-tree`. Each archive has a positive executed-test count. Red acceptance requires exit 1 and the expected defect signature, not merely any failed command. Full raw red output remains available, including Wanda subtest failures and runtime shape errors.

## Reproduce without changing the checkout

Create a new temporary directory, then extract one listed commit with `git archive COMMIT | tar -x -C NEW_DIRECTORY`. Run its table command from that directory. Python cases need the existing PyTorch environment; no install or model download is part of the procedure.

The host helper `replay.mjs` writes new archive, log, and JSON paths and rejects existing paths. Its six result records include full revisions, commands, test counts, exit statuses, archive hashes, and log hashes. Git archives contain committed files only, excluding the checkout's untracked review metadata.

Repository-specific Bigpowers red-isolation/timing scripts and `CONVENTIONS.md` were absent. They were not run or reported as passing. No stash, reset, force checkout, or history rewrite was needed.

## Final checks

Product `00a303d`: 35 Node, 36 bounded CPU, one optional-demo test, inventory, installed discovery, and 35 extracted-package Node tests pass. The final CPU suite includes the earlier KL, causal, SimPO, W&B, pruning-fragment, GRPO, GPTQ, AutoGPT, and calculator checks alongside these new regressions.

These isolated tests validate the targeted examples and evaluator behavior, not fresh model responses, full framework integration, quality recovery, or GPU performance.
