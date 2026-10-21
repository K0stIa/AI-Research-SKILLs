# Evidence verification

`SHA256SUMS` covers the portable report, audit, TBB record, results, semantic notes, this guide, and the raw-artifact manifest. It does not hash itself.

`RAW-SHA256SUMS` uses paths relative to the host evidence root. It covers retained logs, run metadata/events, review snapshots, public-source captures, replay scripts/results, and package tarballs. Extracted package trees and Git revision archives are excluded; their source revisions or tarballs identify the inputs. This is an explicit artifact selection, not a claim to hash every temporary file.

```bash
REPO=/home/k0stia/code/pi/AI-Research-SKILLs
EVIDENCE=/home/k0stia/code/pi/.pi/verification/ai-research-exhaustive-20261021T065003Z
(cd "$REPO/specs/verifications/pi-exhaustive" && sha256sum -c SHA256SUMS)
(cd "$EVIDENCE" && sha256sum -c "$REPO/specs/verifications/pi-exhaustive/RAW-SHA256SUMS")
```

The raw host artifacts are not committed or shipped in the npm package. A repository clone alone does not contain those live sessions.

`RESULTS.json` separates original cohorts, final strict/source-current coverage, and incomplete semantic review. `SEMANTIC.json` binds each focused note to its frozen run/name, answer hash, and actual returned read excerpts. A stale historical answer is not approval of a repaired source or a later answer.

To repeat deterministic source checks without installing anything:

```bash
cd "$REPO"
npm test
CUDA_VISIBLE_DEVICES= python3 scripts/check-distillation.test.py
node --test scripts/check-optional-demo.test.mjs
bash scripts/check-inventory.sh
```

These commands require the already available local runtimes; CPU examples additionally require existing PyTorch. The CPU suite and isolated replay tests execute trusted repository code. They are not security sandboxes. Do not run them on untrusted source.

Any new live run must use a new output directory. Do not overwrite old events, summaries, verdicts, or checksum manifests. No passing subset or successful transport event closes the all-skill semantic/behavioral gate.
