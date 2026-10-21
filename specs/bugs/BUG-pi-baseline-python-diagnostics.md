---
type: bug-report
context: Preexisting unrelated Python diagnostics surfaced during the approved Wanda caller repair
status: open
---

# Baseline Python diagnostics outside caller scope

Active LSP probe found real preexisting diagnostics. They are deferred, not fixed, suppressed or called false positives. No changes to these source files are included in the production Wanda repair. Separate triage requires authorization.

## Orchestra GRPO example

File: `06-post-training/grpo-rl-training/examples/reward_functions_library.py`.

- Pyright `reportUndefinedVariable`: `code_block_format_reward` at lines315 and376; `no_syntax_error_reward` at317 and378.
- Auxiliary ast-grep `no-mutable-default`: line144.
- Auxiliary ast-grep `no-bare-except`: lines71,92,139,361.

The file is byte-identical to baseline `8a9ea6f9180016317f7212aaa2a8fc062e1369c5`. SHA256 `aa2104ebb7bb38df0bd06752998cd9822e47126cf8515f57c1c19545da6364cc`. It is not imported by the edited CPU test. Existing Node/CPU/demo checks pass but do not validate these GRPO call sites. A Python compile check only validates syntax and cannot establish that names resolve at runtime.

## Sibling repository

File: `/home/k0stia/code/pi/Understand-Anything/understand-anything-plugin/skills/understand-knowledge/parse-knowledge-base.py`.

Pyright `reportArgumentType` at89,90,95,98: a dictionary inferred with boolean values receives `int`, `str`, `Literal['karpathy']` and `Literal['unknown']` values. This source is outside the current repository, untouched and not imported by the edited CPU test. No claim of independent sibling Git-baseline verification is made.

## Disposition

All thirteen reported identities were marked `defer` for this session with scope/baseline reasons. No inline ignores or settings changes were made. Automated cascade reminders may continue to show these unresolved findings. This report records them persistently; it does not satisfy a full-workspace clean-diagnostics gate. User-approved caller repair is verified separately, and broad library acceptance remains open.
