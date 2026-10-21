---
type: evidence-index
context: New immutable evidence for the production Wanda caller repair
---

# Evidence index

Host root:

```text
/home/k0stia/code/pi/.pi/verification/ai-research-wanda-caller-fix-20261021T153515Z-CQJG7G
```

- `run-check.py`, `baseline-{node,cpu,demo,inventory}/`: exact commands, captured stdout/stderr and terminal results before regression/implementation.
- `caller-{red,green}/`: focused actual caller/helper runs and positive counts.
- `final-{node,cpu,demo,inventory}/`: full current-source verification runs.
- `replay.py`, `isolated-{red,green}.{tar,json,stdout.log,stderr.log}`: committed revisions, test-only RED check, archive/log hashes, expected exit/count/signature evidence. Extracted archive trees remain on host but are excluded from selected raw manifest.
- `package/{run.mjs,summary.json,category-coverage.json,installed-inventory.json,*.log,ai-research-skills-1.0.1.tgz}`: actual offline package,35 extracted Node tests,466 byte-matching category files, eleven syntax checks and real installed discovery. Extracted package tree is excluded from manifest selection, tarball bytes retained.
- `audit.py`, `audit-run/`, `audit-final-run/`, `audit.json`, `audit-final.json`: metadata/AST/source/credential/historical checks. The final helper recheck reproduces original audit values exactly. `audit-initial.py.txt` preserves the initial helper and `audit-executed-helper.py.txt` preserves the first corrected version. `audit-json-handling-proof.json` records2 initial/0 final unprotected named calls via Python AST predicates; a native NAPI attempt failed because Python grammar was unavailable, not a native-rule pass.
- `historical-*.log`:6+93+97 selected historical hashes match in initial and corrected-helper checks. Count196 unique selected entries, not392 coverage claims. Other older historical manifests were not rerun.
- `diagnostics.json`: parent transcription of actual probe outcomes, stale/false-positive/deferred dispositions and incomplete coverage, not raw LSP protocol evidence.
- `selection.json`: selected raw paths/bytes generated at sealing. `RAW-SHA256SUMS` binds selected host artifacts. Selection excludes extracted trees, mutable caches, itself and post-seal verification outputs.
- `RESULTS.json`: portable machine-readable revisions, test counts, isolation records, package summary, scoped audit and residual limits.

Portable `SHA256SUMS` includes report/TDD/audit/index/results and `RAW-SHA256SUMS`, excluding itself. Hashes bind selected bytes, not every host file, runtime dependency or entire repository history.

Verify:

```bash
cd /home/k0stia/code/pi/AI-Research-SKILLs/specs/verifications/pi-wanda-caller
sha256sum -c SHA256SUMS
cd /home/k0stia/code/pi/.pi/verification/ai-research-wanda-caller-fix-20261021T153515Z-CQJG7G
sha256sum -c /home/k0stia/code/pi/AI-Research-SKILLs/specs/verifications/pi-wanda-caller/RAW-SHA256SUMS
```

No new live sessions or independent post-fix review. Existing prior six-session raw evidence and BLOCK verdict remain unchanged. Source changes invalidate old selected-source currency; no new full-library live coverage totals are claimed.
