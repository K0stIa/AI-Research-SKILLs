---
type: evidence-index
context: Immutable follow-up artifacts for the three Astra repairs
---

# Evidence locations

## Portable committed records

- [REPORT.md](./REPORT.md): scoped verdict, revisions, tests, source-currency changes, and limits.
- [TDD.md](./TDD.md): three red/green pairs, exact commands, and isolation procedure.
- [AUDIT.md](./AUDIT.md): parent self-review and unverified areas.
- [RESULTS.json](./RESULTS.json): machine-readable package, replay, identity, historical-integrity, and saved-event results.
- [ASTRA-REVIEW.md](./ASTRA-REVIEW.md): independent pre-fix review, not post-fix approval. Portable export removes only six trailing-space bytes on three Markdown hard-break lines. Original review bytes remain preserved on the host.
- `SHA256SUMS`: hashes the portable records and raw selection manifest.
- `RAW-SHA256SUMS`: selected host artifacts, relative to the host root below.

Verify the portable manifest from this directory:

```bash
sha256sum -c SHA256SUMS
```

## Host root

`/home/k0stia/code/pi/.pi/verification/ai-research-astra-fixes-20261021T104330Z`

- `baseline*.log`, `baseline.json`: original deterministic baseline.
- `reference-budget-*`, `fp16-*`, `wanda-*`: direct red/green checks.
- `replay.mjs`, `isolated-{reference,fp16,wanda}-{red,green}.{json,log}`: six isolated revisions, commands, positive test counts, expected failures, and hashes.
- `package/`: actual tarball, creation/extraction logs, source and extracted tests, CPU/demo/inventory logs, installed discovery JSON, syntax checks, category comparison, and summary.
- `saved-live-reevaluation/`: new evaluator snapshot, 130 frozen-attempt records, source hashes, raw-input hashes, current gaps, and explicit old/new verdict comparison. No new live attempts.
- `audit.mjs`, `audit.json`, `historical-checksums-*.log`: preservation/identity checks and limited diff scan.
- `report-draft-01/`: first sealed portable snapshot, its original manifests, and reproduced whitespace-gate failure. Its seven-file manifest still verifies.
- `report-final-02/`: export-normalization proof, final diagnostic record, expanded raw selection, and final sealing helper. The original 66-file raw selection and metadata remain unchanged; this final selection adds the retained draft and subsequent proof artifacts.

Verify selected raw artifacts from that root:

```bash
sha256sum -c /home/k0stia/code/pi/AI-Research-SKILLs/specs/verifications/pi-astra-followup/RAW-SHA256SUMS
```

The raw selection includes logs, JSON, helper sources, the package tarball, and selection metadata. It excludes extracted package trees and the six Git archive trees/tars. Their revisions and archive hashes remain in replay JSON, and the trees are reproducible with `git archive`. Raw artifacts are not shipped in the npm package.

## Historical inputs retained unchanged

Original matrix/cohorts and `review-03` remain under `ai-research-exhaustive-20261021T065003Z`. The parent Astra review/reproduction is in that root's `astra-review-validation-01/`; its eight-file manifest still verifies. Earlier original/repair manifests and the exhaustive 630-artifact manifest also verify. New files do not replace original answers, verdicts, failures, logs, checksums, or packaged acceptance revisions.

Current reevaluation hashes selected main/reference bytes only. It does not establish whole-library source freeze, prompt-version equivalence, semantic truth, or new framework/device execution. Checksums prove retained-byte integrity, not correctness of the recorded claims.
