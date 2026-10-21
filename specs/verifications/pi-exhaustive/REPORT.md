# Orchestra Pi verification: detailed checkpoint

## Verdict

**Deterministic package checks pass. All-skill behavioral and semantic acceptance remains open.**

All 98 skills were attempted in fresh installed Pi sessions. This does not establish that every recipe, response, or framework works. Do not substitute the package verdict for the behavioral verdict.

Product/package revision: `4dc40f4f29a633f49d94d713cb987d4410413834`, branch `pi`. Later report-only commits do not change the accepted package contents.

## Confirmed results

| Check | Result |
|---|---|
| Inventory | 98 skills, 23 categories; names/paths preserved |
| Installed discovery | All 98 active from three working directories; Feynman preserved |
| Source Node suite | 34 passed |
| Bounded CPU examples | 27 passed, existing PyTorch 2.5.1+cu121, CUDA hidden |
| Optional demo regression | One passed; missing-SDK path only, no API call |
| Extracted real tarball | 34 packaged Node tests passed |
| Package contents | 478 files, 291 references, 7,968,586 unpacked bytes |
| Category preservation | All 466 category files byte-identical to checkout; no removed/renamed category paths |
| Python Markdown checks | 3,892 blocks parsed across 396 category Markdown files |
| Fence scanner | 7,019 ordinary fences, zero unclosed blocks; container parsing excluded |
| Standalone syntax | Eleven packaged JS/Python/JSON files passed |
| YAML | 98 frontmatters and one standalone config parsed |
| TBB replay | 27 isolated red/green scenarios passed; 25 separate failing-test commits |
| Version coverage | All 51 changed skill directories have version changes |
| Historical checksums | 51, 34, and 128-file manifests reverified without mismatches |

The final package SHA-256 is `61fecff4eb23af8ce1aef940378485495c8ef8ab8d8032d283d4d9ca1ca7c875`.
Demo code, CPU tests, and verification reports remain outside the package tarball.

## Repairs made

- Bound DeepSpeed's entrypoint and preserve its original manual as a reference.
- Repair nested local links, two missing paper references, and Unsloth's website-relative index destinations.
- Parse ordinary Markdown fences correctly; repair intended Python and accurately label shell, notation, notebook fragments, and expected failures.
- Correct forward/reverse KL direction, teacher detachment, next-token alignment, masking, and all-ignored behavior.
- Correct SimPO arithmetic, W&B value-space bounds/stopping/GPU addressing, and Wanda tied-score/autograd handling.
- Correct AutoGPT's async-generator annotation, GRPO loss/variance interpretation, and GPTQ module-map keys.
- Separate DSPy runtime adapter validation from factual guarantees; remove or qualify unmeasured FAISS/GPTQ promises.
- Separate QLoRA's raw weight payload from training memory, rank-dependent adapter storage, and measured quality. The old fixed 20 MB claim conflicts with its own illustrative parameter count.
- Replace two LangChain model-input evaluation sinks with bounded arithmetic and explicit helper-copy instructions.
- Enforce actual successful reads, exact main-file read scope, supporting-read caps, exact JSON fields, field budgets, and complete immutable matrix coverage.
- Repair README inventory omissions. Preserve every skill name and directory path.

See [TBB evidence](./TDD.md) and the [focused calculator review](../../security/pi-calculator-review.md).

## Live evidence: not all green

Final strict snapshot: **130 explicit attempts, all 98 skills attempted against current selected sources, 72/98 with a current-source mechanical pass, 26 without one**. Latest-current and any-current pass counts both equal 72. This remains a pooled multi-cohort result, not an all-pass or first-pass reliability claim. Semantic review is incomplete.

The original full matrix attempted 98/98. Its then-current evaluator reported 73 contract passes and 25 failures, with 94 transport completions and three timeouts. No scratch-workspace mutation was detected.

That is a historical cohort result, not current-source acceptance: repairs/version changes overlapped execution, and its cached evaluator did not enforce every later field/read rule.
Raw events are reevaluated separately with the final strict evaluator and current source hashes. `RESULTS.json` distinguishes any current-source mechanical pass, the latest current attempt, stale-only coverage, and incomplete semantic review. A collection of successful retries is not a first-pass reliability rate.

The six fresh affected-skill reruns completed after the main matrix: four mechanical passes, one AutoGPT timeout, and a LangChain missing-read failure. The nine stale-only skills were rerun with the same 240-second case deadline: seven mechanical passes and two missing-read failures. Original failures remain intact. The final one-case bitsandbytes rerun passes its mechanical contract; its new answer has not received semantic acceptance.

Focused manual notes cover 36 historical cases plus four affected-skill responses, spanning 36 distinct names, not every skill or every passing case. Examples of remaining problems:

- ARA research-manager's asserted reference fact is absent from its actual returned excerpt.
- Some answers conflate action chunk length with control frequency, or pruning with preserved network activations.
- Some repeat unsupported throughput/quality figures or assume conference rules without checking venue and year.
- GPTQ's fresh answer still invents `auto-gptq 0.9+`. Official PyPI metadata retrieved on 2026-10-21 reports latest `0.7.1` and no `0.9`/`0.9.0` release. This is a remaining response defect, not a verified prerequisite.
- Missing tool reads, malformed answers, exceeded caps, and timeouts remain failures even when surrounding prose looks plausible.

No further source repair is inferred solely from a model's failure. Correcting documentation does not guarantee that the configured model follows it.

## Limits and next gates

Python AST parsing does not establish imports, execution context, API compatibility, or mathematical correctness. Selected tiny tests do not certify complete methods. Non-Python fences, TeX/BibTeX compilation, full PDF rendering, dataset availability/license/schema, SDK integrations, model execution, and device performance remain outside completed validation.

Large Unsloth archives were not fully LSP-checked. The latest targeted probe reports eleven changed paths clean; this is not a whole-repository diagnostic or security certificate. Review remains self-review.

No dependencies, models, compute, or personal/model-server settings were changed. No training, optimizer steps, paid provisioning, publication, or push occurred. Future runtime work needs an explicitly authorized environment and task-specific versions/data/resources.

Keep the bug open until current-source behavioral gaps and the full required semantic review are resolved. Do not declare all 98 skills working from this checkpoint.

## Evidence

Host root:
`/home/k0stia/code/pi/.pi/verification/ai-research-exhaustive-20261021T065003Z`

- `package-final-03/`: actual tarball, extracted tests, installed inventory, syntax/YAML/fence/byte checks.
- `matrix-main/`, `task-contract-recheck/`, `recheck-after-repairs/`, `stale-source-recheck/`, `bitsandbytes-recheck/`: immutable session events, stderr, results, progress, summaries.
- `canary/`, `canary-budget/`: retained failed and revised bounded probes.
- `review-01/`, `review-02/`, `review-03/`: separate strict reevaluation and focused manual notes; original verdicts untouched.
- `tdd-isolation/`, `tdd-isolation-extra/`, `tdd-isolation-final/`, `tdd-isolation-bitsandbytes/`: red/green Git archives and raw logs.
- `official-dspy/`, `official-trl/`, `official-autogptq-package.json`: pinned source or registry evidence.
- `version-deltas-final-02.json`, `version-owner-coverage.json`, `path-preservation.json`, checksum revalidation records.

Portable summary: [results](RESULTS.json), [bound semantic notes](SEMANTIC.json), [self-audit](./AUDIT.md), [TBB record](./TDD.md). Host raw evidence is not bundled into the npm package.
