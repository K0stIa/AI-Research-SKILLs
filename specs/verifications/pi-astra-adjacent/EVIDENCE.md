---
type: evidence-index
context: Immutable evidence for two adjacent Astra repairs
---

# Evidence locations

Host root:
`/home/k0stia/code/pi/.pi/verification/ai-research-astra-adjacent-fixes-20261021T132605Z-H68GRi`.

- `baseline/`: original MiniLLM reference and main pruning guide, checked against baseline Git bytes.
- `run-check.py`: write-once command logs and result records. Each named command directory contains stdout, stderr and exact command/revision/exit/count metadata.
- `baseline-{node,cpu,demo,inventory}/`: clean pre-repair checks.
- `wanda-main-red/`, `wanda-main-green/`, `wanda-full-cpu/`, `wanda-node/`: first-cycle worktree evidence. Worktree green checks occurred before fix commit; isolated green evidence below binds committed code.
- `minillm-reference-red/`, `minillm-reference-green/`, `minillm-full-cpu/`, `minillm-node/`: second-cycle worktree evidence, likewise distinct from committed replay.
- `replay.py`, `isolated-{wanda-main,minillm-reference}-{red,green}.{json,log,tar}`: committed revision, exact command, archive/log hashes, positive count, defect signature and expected status.
- `package/`: build runner, source and extracted-package tests, actual npm tarball, metadata, syntax logs, byte coverage and installed discovery. Product revision is `ee5b3c43412734ff912b796b107345f80b8bf251`.
- `audit-initial.py`, `audit.json`, original checksum logs: first runtime audit, preserved despite later helper typing corrections.
- `audit.py`, `audit-02/`: narrowed helper and separate successful rerun, without overwriting first audit.
- `diagnostics-history.json`, `diagnostics-final.json`, `diagnostics-metadata.json`: active probe outcomes, fixed helper findings, false-positive/stale-cache dispositions and disclosed incomplete checks.
- `sources.json`: primary-paper identifier/version, authors, metadata endpoint, official URLs, checked sections, bounded paraphrase and retrieval limits. Full fetched HTML/README live in the retrieval cache, not this checksum manifest; metadata is not a hash-bound whole-paper archive.

`SHA256SUMS` covers the portable report files, including the raw manifest, but not itself. `RAW-SHA256SUMS` covers selected host files, including actual source archives and npm tarball. `selection.json` lists their counts and sizes. Extracted archive/package trees are not duplicated in the raw selection; their archive bytes and replay hashes are preserved. This selection is not a claim to hash every tool cache/session file.

Verify portable and raw manifests separately:

```bash
cd /home/k0stia/code/pi/AI-Research-SKILLs/specs/verifications/pi-astra-adjacent
sha256sum -c SHA256SUMS
cd /home/k0stia/code/pi/.pi/verification/ai-research-astra-adjacent-fixes-20261021T132605Z-H68GRi
sha256sum -c /home/k0stia/code/pi/AI-Research-SKILLs/specs/verifications/pi-astra-adjacent/RAW-SHA256SUMS
```

Historical Astra review root:
`/home/k0stia/code/pi/.pi/verification/ai-research-astra-rereview-20261021T120922Z-FrO4Y0`.
Its six fresh sessions, initial repros and BLOCK report remain unchanged. This repair adds no live retry or independent post-fix verdict.
