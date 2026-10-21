---
type: verification-report
context: User-approved TBB repair of two inherited Astra example defects
---

# Adjacent Astra repairs

Both reported examples are repaired and pass direct regressions. Overall behavioral/semantic acceptance remains open. This report is parent verification, not fresh independent Astra approval.

Baseline: `6f562ca371aec89893b0b29e99c30751add426e8`, branch `pi`.
Accepted product: `ee5b3c43412734ff912b796b107345f80b8bf251`.

## Repairs

| Target | Test-only red | Passing fix | Coverage |
|---|---|---|---|
| Main Wanda quick-start | `2e09110` | `63b8f3a` | Eight tests extract the actual main function. Sequence axes, unequal-batch L2 masks, ties, endpoints, invalid sparsity, FP16 statistics, empty calibration and hook cleanup. |
| MiniLLM reference | `5843e11` | `ee5b3c4` | Eight tests extract the reference loss and check identity, direction, entropy-sensitive gradients, teacher detachment, temperature, finite extremes, labels and on-policy scope. |

Both red commits precede their fixes and change only the test file. Isolated committed archives reproduce expected failures and then pass, with eight executed tests per phase. No missing helper script or weakened check is presented as a gate. See [TDD.md](./TDD.md).

Main Wanda now matches the corrected reference function's AST, excluding comments/docstrings. Calibration texts are tokenized before passing input dictionaries. Statistics collapse leading axes and accumulate float32 squared sums; pruning selects stable exact coordinates per output under `no_grad`, with validation and `finally` hook cleanup. Both copies run the same eight behavior tests.

The MiniLLM reference now matches the main guide's reverse-KL function. Forward KL is `KL(Teacher || Student)`; reverse KL is `KL(Student || Teacher)`, including student entropy and teacher detachment. False teacher-only/mean-logit policy-gradient and trainer sketches, unsupported benchmark numbers and universal learning-rate claims were replaced with primary-source on-policy guidance and explicit integration gates. Original reference bytes remain in baseline evidence and Git history. This is not a full MiniLLM implementation.

Versions: model-pruning `1.0.2` to `1.0.3`; knowledge-distillation `1.0.4` to `1.0.5`. All 98 names, directory paths, authors and licenses remain unchanged.

## Final checks

- 35 source Node tests, 52 bounded CPU tests and one optional-demo regression pass.
- Actual offline-built tarball repeats all 35 packaged Node tests.
- Package: 478 files, 98 skills, 23 categories, 291 references, 7,972,763 unpacked bytes. All 466 category files match checkout bytes; eleven standalone JS/Python/JSON files parse.
- Installed discovery from `/tmp`, parent and checkout finds all 98 Orchestra skills active among 330 names, with no missing/shadowed skills or diagnostics. Separate Feynman `autoresearch` remains selected. No forced package precedence.
- Historical integrity recheck: 7 prior portable, 81 prior raw and 139 Astra-rereview artifacts match, 227 total. This is not a recheck of every older historical manifest.
- Scope audit confirms both duplicated function pairs now agree. A limited five-pattern credential scan of the changed implementation/test diff finds no candidates; not a whole-library security certification.
- Initial active LSP probe confirms all four changed source/test paths clean. Later diagnostic details and helper limitations are retained in `RESULTS.json` and raw evidence; no full-library LSP certification.

Tarball: `ai-research-skills-1.0.1.tgz`.
SHA-256: `60547cded1abfbcfbe8238d1d9c94acd536ef6f53129e448bf8ce099f0675c1f`.
The repository-only CPU suite, optional demo, specs and runtime metadata remain excluded.

## Boundaries

No new live Pi sessions or retries were run during these repairs. The prior six-session Astra review remains immutable: GPTQ timeout, distillation no-read/hallucination, pruning semantic concerns, bounded LangChain support, and both identity completions. Changes to both skill sources invalidate prior selected-source currency; no new current-source full-library coverage totals are claimed.

The Wanda sketch remains one-pass, unmasked, ordinary-Linear calibration, not layer-sequential paper reproduction. Evaluation mode persists; extreme values, offload/custom layers, quality and sparse execution need separate validation. The KL helper requires compatible finite logits, positive temperature and externally prepared causal/mask alignment. Its tests do not validate sequence-level on-policy training.

No installs, pretrained models, training, optimizer steps, settings/server changes, publication or push. CPU tests execute trusted checkout snippets, not hostile-code sandboxes. Full SDK/device/quality/throughput and universal behavior remain unverified. The broader exhaustive bug stays open.

Evidence root: `/home/k0stia/code/pi/.pi/verification/ai-research-astra-adjacent-fixes-20261021T132605Z-H68GRi`.
See [EVIDENCE.md](./EVIDENCE.md), [AUDIT.md](./AUDIT.md), and [RESULTS.json](./RESULTS.json).
