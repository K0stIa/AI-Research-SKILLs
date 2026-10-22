---
type: verification-report
context: Approved deterministic matrix word-boundary TBB repair on branch pi
---

# Strict matrix word-boundary repair

## Result

The deterministic boundary defect is fixed. A live baseline was not authorized or run.
The original prompt still requires the complete JSON to stay under 140 whitespace-separated words.
The matrix now supplies the inclusive maximum 139. The shared evaluator retains its existing inclusive semantics.

RED: `e22fbc4a763eccac5ea08f8da3171f80b9009488`, test-only.
GREEN product: `a32238435c6ec11a70037bc844133474503b7a2d`, implementation-only.
Base: `8b9268ecacaafc60a2d3072302a52e1f627f22a7`.

The production change is one integer in `scripts/verify-pi-matrix.mjs`.
No skill content, versions, names, paths, assets, authors or licenses changed.
No package version or publication command ran. The `fix(verification)` message ordinarily implies a patch under standard semantic-release rules.

## Native verification

| Check | Observed result |
| --- | --- |
| Preflight Node suite | 35 passed, zero skipped |
| Intended RED, working tree and committed archive | One test failed in each, exactly 140 incorrectly accepted |
| Identical GREEN regression, working tree and committed archive | One test passed in each, three boundary cases |
| Full Node suite, working tree and committed GREEN archive | 36 passed in each, zero skipped |
| CPU extraction/numerical suite | 53 passed |
| Optional missing-SDK demo test | One passed, no API call |
| Packed Node suite | 36 passed, zero skipped |
| Inventory | 98 skills, 23 categories |
| Rebuilt matrix comparison | All 98 maxima are 139; every other contract field unchanged |
| Packed category payload comparison | All 466 files byte-matched to source |

The regression uses a real temporary manifest and exported builder/evaluator. Synthetic read and completion events are unit inputs, not Pi-session evidence.
Valid JSON with 139 words passes. Answers with 140 or 141 words fail only with `word-cap-exceeded`.
The identical regression file SHA256 is `fda50fe3d728bf23bf2b9f3a12df29b6162ba6360d1520b53ed2b0aa45e36c30`.

## Package

Offline packaging disabled lifecycle scripts. The tarball contains 478 files and 7,975,780 unpacked bytes.
The optional demo and all specs remain excluded.
Tarball SHA256: `69b6c5a19b556d22fb49cf89a4bda80e8997b8e0d3aeea985b5c40b98787ac6a`.
The local package version remains 1.0.1. Nothing was published.

## Evidence and limits

`TDD.md`, `AUDIT.md`, `checks.json` and the native logs document the repair.
Host-local archives, package and original fingerprints remain under:

```text
/home/k0stia/code/pi/.pi/verification/ai-research-matrix-word-boundary-20261022T211806Z
```

The prior acceptance draft remains unchanged as a pre-repair proposal.
This report supersedes its boundary-mismatch description, not its separate execution gates.
Original prompts, sealed historical verdicts and the previous draft/review evidence remain unchanged.
No explanation of historical model omissions, unsupported claims or timeouts follows from this oracle repair.

No live Pi/model behavior test, backend operation, private settings access, installation, training, further delegation, push or publication occurred.
The diagnostic scope is changed paths, not workspace cleanliness. The 13 previously deferred identities remain outside scope.
An earlier active probe confirmed both changed JavaScript files clean. The final eight-path probe confirmed seven clean and timed out on one.
The timed-out check remains inconclusive. Zero reported findings does not certify that eighth path.
No independent review, complete user UAT, GPU/framework certification or whole-library semantic acceptance is claimed.
Baseline execution still requires separate concrete approval and its original resource/time limits.
