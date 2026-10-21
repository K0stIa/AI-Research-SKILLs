---
type: self-audit
context: Parent audit of two user-approved adjacent Astra repairs
---

# Scope audit

This is parent self-review, not a new independent review or dual-review approval.

| Area | Result | Evidence and limits |
|---|---|---|
| Correctness | PASS within tested scope | Actual main Wanda and reference KL functions run new regressions. Their ASTs match the corrected counterparts, excluding docstrings/comments. Both committed red/green pairs replay with eight tests per phase. |
| Tests | PASS | 35 Node, 52 CPU, one demo and 35 extracted-package Node tests. Both source copies remain independently exercised. F.I.R.S.T criteria are recorded in TDD.md. |
| Metadata/assets | PASS | All 98 names/paths/authors/licenses retained. Exactly two patch-version changes; all 466 packaged category files match checkout. |
| Security | PASS, scoped | No dependency/auth/network/runtime-permission change. Five credential patterns find no candidates in the implementation/test diff. Trusted AST extraction executes checkout code and is not a sandbox. No whole-library security claim. |
| Performance | PASS, scoped | Tiny CPU regressions only. Main Wanda uses the already-tested one-pass float32 statistics and per-row stable selection. No quality, memory-capacity, GPU/backend or inference-speed benchmark. |
| Clarity/provenance | PASS | Correct KL labels and entropy term; on-policy procedure linked to versioned arXiv primary source. False complete-trainer and unsupported metric/default claims removed. Source retrieval is not Context7 or installed-SDK validation. |
| Historical integrity | PASS | 227 selected prior hashes match. New output paths and write-once logs; originals retained. |
| Diagnostics | Limited | Initial four source paths confirmed clean. Helper's three optional-subscript diagnostics fixed by explicit match assertion; initial helper/results preserved. Recheck had zero findings but one push-only inconclusive result. Final probe details are separate. |
| Full acceptance | OPEN | No new live sessions, independent Astra re-review, full method reproduction, SDK/device/training run or universal behavioral/semantic approval. |

## Design choices and smells

Duplicated Code exists in standalone main/reference teaching examples. Both copies remain self-contained, now share equivalent function ASTs and the same behavioral fixtures. No package-relative import trap or runtime code loader was added to examples merely to remove documentation duplication. Numerical assertions, not AST equality alone, provide behavioral coverage; the additional AST audit detects drift across the repaired pair.

The MiniLLM reference was rewritten rather than retaining a demonstrably false trainer under a runnable label. The previous bytes are preserved in baseline evidence and Git history. Other guides and unsupported library-wide claims were not silently rewritten during this two-finding repair.

No `CONVENTIONS.md`, Bigpowers compliance/churn scripts or repository coverage threshold exists here. Their canonical gates were not run or called passing. Existing inventory, parser, package and regression gates were preserved. The audit adds no suppressions, ignored tests or relaxed budgets.
