# TBB evidence

## Committed RED

Commit `e22fbc4a763eccac5ea08f8da3171f80b9009488` changes only `scripts/check-pi-verification.test.mjs`.
Production source in its archive matches the baseline SHA256 `c2f5e7bbf07619cc47f0587026aa0053d52d2f052b4c3e6d9b32151eab917648`.
Native targeted execution reports one test, one failure, zero skips, exit 1.

Intended signature:

```text
Matrix prompt says under 140 words; exactly 140 must fail.
```

The RED results were 139 accepted, 140 incorrectly accepted and 141 rejected. No unrelated contract error caused the failure.

## Committed GREEN

Commit `a32238435c6ec11a70037bc844133474503b7a2d` changes only `scripts/verify-pi-matrix.mjs`.
Its parent is the RED commit. Its production diff is the matrix maximum 140 to 139.
The regression file is byte-identical in both archives.
Native targeted execution reports one test, one pass, zero skips, exit 0.
Both working-tree and committed-archive full Node suites report 36 passes and zero skips.

The regression evaluates three boundary cases through real exported interfaces. It does not count those cases as three native tests.
The valid path-space fixture avoids exceeding the individual prose budgets. The JSON, exact paths, three prerequisites and bounded successful read evidence stay mechanically valid.

Run the same targeted command from either committed archive:

```bash
node --test --test-name-pattern='matrix word boundary rejects exactly 140 words' scripts/check-pi-verification.test.mjs
```

RED is expected to exit 1. GREEN is expected to exit 0. The archive files and their hashes remain in host-local evidence.
The repository lacks the standard RED-isolation helper. Native `git archive` plus terminal-verdict execution provides the recorded substitute.
No hypothetical fixture result is presented as a live generated answer.
