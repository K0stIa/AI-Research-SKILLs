---
type: impact-analysis
context: Installed Orchestra skills repair on branch pi
---

# Installed-skills repair impact

## Target

The research command identity, seven sets of local references, fine-tuning guidance, and citation task routing.

## Dependents

- Pi package manifest exposes 98 definitions across 23 category directories.
- `README.md` and `docs/PI.md` advertise the research command.
- Research routing references link to category paths, which remain unchanged.
- Existing package tests cover names, categories, inventory, and bounded research instructions.
- Feynman's installed `autoresearch` must remain available and unchanged.
- Other agents also read the shared frontmatter; the namespaced orchestration name changes their explicit skill invocation.

## Coverage gaps

Missing tests for installed-name collisions, reference existence, evidence requirements, and useful live-test verdicts.
The previous `-e` smoke test bypassed installed discovery ordering.

## Risk: Medium

The command is a shared user-facing interface. Preserve directory paths and supporting files; document the new explicit name.
Do not create a competing alias for `autoresearch`.
Fix missing reference content from official sources, not placeholder files or silent removal of useful guidance.

## Boundaries

No personal settings changes, model-server tuning, dependency installation, cloud jobs, or pushes.
Keep historical failed verification evidence intact and write a new verification record.

A later diagnostic-gate instruction expanded scope to the optional Gemini demo.
The narrow repair handles a missing SDK and unreadable `.env` without installing dependencies or calling the API.
Its regression test runs Python with site-packages disabled. The demo remains excluded from the Pi tarball.

## Exhaustive-verification follow-up

The coverage gaps above describe the earlier baseline. The follow-up adds all-entrypoint budgets, nested Markdown links, ordinary fence parsing, Python AST checks, strict installed-response evidence, and an immutable 98-skill matrix.

Shared changes affect 51 skill directories; all 51 receive version changes. Names, directory paths, 98-skill inventory, and 23 categories remain unchanged.
The final tarball adds a bounded arithmetic helper under LangChain references; its examples require users to copy that helper beside their application.
The helper replaces a confirmed model-input-to-code-evaluation sink, but does not change Pi or framework permissions.

Selected mathematical/configuration repairs cover KL direction and causal masking, SimPO arithmetic, W&B controls, tied-score pruning, GRPO metric interpretation, and exact GPTQ module paths.
Large vendor captures remain preserved; their Python fences were parsed, not SDK-executed or fully LSP-validated.

Fresh installed sessions use existing discovery without forced package precedence. Original verdicts and raw failures remain immutable; stricter reevaluation is separate.
Source changes invalidate earlier live evidence. All 98 skills were attempted, but passing static checks and transport completion do not establish all-skill behavioral or semantic acceptance.

See `verifications/pi-exhaustive/REPORT.md`, `TDD.md`, and `AUDIT.md`. Full framework/device validation and the remaining live/semantic acceptance gaps stay open under the unchanged execution limits.

## Astra three-finding follow-up

Targets: `evaluateSkillRun` in `scripts/pi-verification-events.mjs`, the extracted `distillation_loss`, and the full `wanda_prune` reference example.

Dependents and coverage:

- `scripts/verify-pi-matrix.mjs` and `scripts/check-pi-verification.test.mjs` call the shared response evaluator. Host snapshot scripts also import it. New tests cover cumulative requested reference lines, not just the existing per-call cap. Transport analysis remains unchanged.
- `scripts/check-distillation.test.py` extracts the numerical examples. Existing all-ignored coverage uses float64; add a finite-input FP16 overflow case and gradient assertions.
- Existing Wanda coverage extracts only the per-output fragment. Add full-function toy CPU calibration with sequence axes, unequal batches, L2-sensitive mask selection, exact per-output sparsity, and hook cleanup. Fix the full example consistently rather than leaving its global threshold and `.data` writes inconsistent with that fragment.
- The knowledge-distillation and model-pruning skills receive patch-version increments. Names, paths, and package categories remain unchanged.

Risk: Medium. Tightening the evaluator affects historical reevaluations; the numerical examples can change copied application behavior. Preserve old records and write new source-current evaluations separately. No release/story capsule exists for this repair. User approved the three-finding plan in `bugs/BUG-pi-astra-followup.md`. No new runtime dependencies or live matrix calls are required.

## Astra adjacent-example follow-up

Targets: duplicate `wanda_prune` in model-pruning's main entrypoint and `reverse_kl_loss` plus contradictory MiniLLM explanations in knowledge-distillation's selected reference. Both defects predate the previous three-fix diff.

Dependents: users copy both guides; the CPU suite currently exercises only the corrected Wanda reference and reverse-KL main entrypoint. Add actual duplicate/main and reference extraction coverage before repair. Keep the primary text-to-tokenized-batches wiring explicit, and exercise both Wanda functions under the same eight numerical/resource-cleanup scenarios. Check the MiniLLM reference's formula, labels, identity, direction, entropy-sensitive gradients and adjacent on-policy guidance. No Python SDK/model loader executes during these tests.

Risk: Medium. Two skill patch versions and selected-source hashes change. Keep all 98 names, category paths and supporting reference paths. Remove unsupported MiniLLM training/benchmark assertions rather than recertifying a false trainer; preserve original reference bytes in new baseline evidence and Git history. No release/story capsule exists. User approved both fixes; plan is `bugs/BUG-pi-astra-adjacent.md`. No dependencies, live-session retries, settings changes or publication are required.

## Production Wanda caller follow-up

Target: the `production_pruning_pipeline` Wanda branch in `19-emerging-techniques/model-pruning/SKILL.md`. The actual helper is correct, but this caller still forwards raw WikiText `text` dictionaries. Add actual caller-to-helper calibration coverage, not another isolated helper-only check. Tokenize nonblank row text lazily, bound sequence length and transfer model inputs onto the model device. Keep the helper and SparseGPT path unchanged. Mark the broader example as an unvalidated integration sketch with explicit external prerequisites.

Dependents: copied production examples, the existing CPU extraction suite, package content hashes and installed model-pruning guidance. One skill patch version changes. All names, paths, author/license fields and categories remain fixed. No release/story capsule exists. Plan and user approval are recorded in `bugs/BUG-pi-wanda-caller.md`.

Risk: Medium. A raw-text/tokenized-dictionary boundary changes in one caller; tests must exercise actual forward tensors and pruning while stopping before training. Existing tests cover the helper, not this caller. No end-to-end Trainer, SparseGPT, dataset or device certification follows from the toy CPU regression. No new dependency, live session, settings change or publication is required.
