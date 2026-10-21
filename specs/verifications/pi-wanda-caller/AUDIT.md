---
type: self-review
context: Parent audit of the narrow production Wanda caller repair
---

# Caller audit

This is parent review, not independent Astra approval or formal dual-review completion.

- PASS, correctness. Actual caller now prepares nonblank text rows for the unchanged helper. Four boundary scenarios check forward tensors, masks, truncation, transfer calls, pruning and cleanup. Committed RED reproduces the intended raw-row failure; committed GREEN passes.
- PASS, scope. Implementation changes one branch, one skill patch version and the section's misleading completeness label. Helper and SparseGPT branch ASTs remain unchanged. No framework integration or dataset certification is inferred.
- PASS, bounded performance. Generator keeps preparation lazy; examples truncate at2048. This bounds tokenized batch length, not total model memory or latency. Model context/device support must be checked separately.
- PASS with limits, security. No new dependencies/settings, app-code evaluator, network fixture, model loader, optimizer or credential is introduced. Five-pattern diff credential scan finds no candidates. The regression executes trusted function ASTs; compromised checkout execution is not sandboxed. Semgrep exec/eval warnings are expected audit prompts, not a claim of safe arbitrary-code evaluation.
- PASS, identity/package.98 names, paths, authors/licenses and23 categories retained. Only model-pruning changes1.0.3 to1.0.4. All466 category payload files match the actual tarball;35 packaged Node tests pass.
- PASS, clarity. Section now says integration sketch. External `finetune_dataset`, SparseGPT adapter, context/device compatibility and Trainer/quality/speed validation are explicit prerequisites. Entrypoint stays499 lines.
- PASS, F.I.R.S.T. One CPU test with four independent fresh-fixture subtests; fixed tensors, no sleeps/network/downloads, explicit failures and hand-derived mask. RED test commit precedes implementation. Timing/counts are captured by contiguous terminal runs.
- OPEN, unrelated baseline diagnostics. Four undefined reward names/call sites, five GRPO auxiliary findings and four sibling-repository type errors are real deferred findings. GRPO bytes match baseline. They are logged in `../../bugs/BUG-pi-baseline-python-diagnostics.md`; no inline suppressions or settings changes. Full-workspace clean is not claimed.
- LIMITED, changed-path diagnostics. Six-path probe has no primary errors but twelve auxiliary warnings, three clean outcomes and one timed-out outcome. Only new trusted-AST warning and two numeric-parser warnings received explicit false-positive dispositions. Initial metadata-helper JSON findings were repaired before execution, then made local at both reads for an additional identical-results audit. Python AST predicate check finds2 initial/0 final unprotected calls. Native NAPI attempt lacked Python grammar and is not presented as passing. Active zero-finding LSP rechecks remain inconclusive on push-only server. A later full-workspace refresh no longer reports original JSON errors. Its new regex finding is false-positive because all five credential patterns are authored constants; eleven verifier-helper warnings remain. Production-assert warnings concern this nonproduction verification helper; its ordinary Python invocation does not request optimized execution. No source suppression or all-clean verdict.
- NOT RUN, unavailable gates. No `CONVENTIONS.md`, Bigpowers churn/timing/blind-spot/coverage/red-isolation helpers, story capsule or state ledger exists. Existing long extraction-test file is not forced into unrelated generic file-length/refactoring rules. No fabricated full gate, human UAT, SDK/device certification or independent review.

## Behavioral boundary

Latest independent review at8a9ea6f accepted the prior helper fixes, found this inherited caller defect and blocked its six-case cohort. Source/tests remain deterministic green after this repair, but model compliance is not established. GPTQ timeout, pruning no reads/false activation preservation, distillation scope concern and LangChain planning failures remain preserved. No live retry or whole-library coverage total is added.
