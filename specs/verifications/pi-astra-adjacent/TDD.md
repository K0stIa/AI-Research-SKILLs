---
type: tdd-evidence
context: Two separately committed red/green cycles for adjacent Astra defects
---

# Red-first evidence

Planning commit: `e69529565c980db8546060b15e06c12df311d4bf`.
Baseline: 35 Node, 36 CPU, one demo and inventory pass.

| Cycle | Red | Green | Isolated executed tests | Expected red signature |
|---|---|---|---|---|
| Main Wanda | `2e09110f561e96bb5f9e5ec048e5c333fa17be67` | `63b8f3ac3afafabff3ac51ac82b4969c0882e965` | 8 red / 8 green | `The size of tensor a (2) must match the size of tensor b (4)` |
| MiniLLM reference | `5843e112da79d384e3398645d289b3cc70887249` | `ee5b3c43412734ff912b796b107345f80b8bf251` | 8 red / 8 green | `FAIL: test_identical_distributions_have_zero_kl` |

Each red changes only `scripts/check-distillation.test.py`. Each was run before its implementation edit, committed, and rerun from an isolated Git archive before the green transition. Green revisions were independently archived and replayed. Positive executed counts, exit 1 plus the named defect signature for red, and exit 0 for green are asserted by `replay.py`. No stash, reset or history rewrite was needed.

Focused commands:

```bash
CUDA_VISIBLE_DEVICES='' python3 scripts/check-distillation.test.py WandaMainPruningExample
CUDA_VISIBLE_DEVICES='' python3 scripts/check-distillation.test.py MiniLlmReferenceExample
```

Main Wanda's eight inherited scenarios also run independently against the reference. The old tokenizer/model-device boundary is stubbed only to reach the real shape and pruning behavior in RED; no Transformers loader executes. GREEN's function accepts prepared input dictionaries and uses no tokenizer global. A pre-execution fixture annotation issue was corrected before the red test run/commit; no source fix was mixed into a test commit.

MiniLLM's reference has independent extraction rather than relying on the already-correct main loss. Identity and unequal-distribution checks reject forward cross-entropy. A closed-form gradient checks student entropy, not just a scalar value. Main and reference tests separately verify detached teacher gradients and temperature scaling. Text guards cover definitions and reject the known raw-logit/teacher-only recipe contradiction; they do not prove every sentence semantically correct.

Full suite after Wanda: 44 CPU tests. Full final suite after MiniLLM: 52 CPU tests. The final package run records 35 Node, 52 CPU, one demo and 35 extracted-package Node tests.

The repository has no `scripts/verify-tdd-red-commit.sh`, `scripts/bp-timing.sh`, `CONVENTIONS.md`, release capsule or state ledger. Explicit Git archive replay provides this repair's isolation evidence; missing project-specific validators were not claimed to run.

## F.I.R.S.T

- Fast: tiny CPU tensors, no models or optimizer; final 52 tests complete in the recorded subsecond test interval, excluding Python/PyTorch startup.
- Independent: new model/tensors per fixture; no live inference, API or installation dependency beyond existing PyTorch.
- Repeatable: fixed weights, deterministic stable tie ordering, explicit shapes and float64 KL checks.
- Self-validating: numerical/resource assertions and terminal exit codes; replay rejects zero-test results.
- Timely: test-only failing revisions precede each production edit and passing commit.

These checks trust extracted repository code. They are not hostile-code sandboxing, full-paper reproduction or framework integration tests.
