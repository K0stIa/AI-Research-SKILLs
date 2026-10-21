---
type: verification-evidence
context: Test-before-build repair cycles replayed from isolated Git archives
---

# Red/green replay

Every listed red commit failed its verification command. Every listed green commit passed it.
Replays used isolated Git archives, not the current working tree with selected changes reverted.

| Behavior | Red commit | Green commit | Command |
| --- | --- | --- | --- |
| Namespaced research command | `e358bbf` | `3e0fe99` | `npm test` |
| Missing local references | `e260bb5` | `b7f19c7` | `npm test` |
| Unsloth source gate | `6f33afa` | `75f123d` | `npm test` |
| Optional Gemini SDK failure | `0c800da` | `edaa1bf` | `node --test scripts/check-optional-demo.test.mjs` |
| LLaMA-Factory source gate | `6cadd97` | `6d0ea3d` | `npm test` |
| Citation-first verification | `a474a95` | `77b5da8` | `npm test` |
| Strict event completion | `dddf68c` | `c481d7c` | `node --test scripts/check-pi-verification.test.mjs` |
| Bit width versus format and dtype | `417b515` | `0a67ab6` | `npm test` |
| Bounded research entrypoint | `79edca0` | `f2f253c` | `npm test` |
| Actual file-read provenance | `19b3137` | `fd0d1d3` | `npm test` |
| Alpaca fields versus mapping roles | `df6fef6` | `38f32d0` | `npm test` |
| CLI scenario-name validation | `b82fbff` | `6e9ef12` | `node --test scripts/check-pi-verification.test.mjs` |

The optional-demo cycle interrupted the Unsloth cycle after an explicit diagnostic-gate instruction.
Its green result refers to the targeted demo command, not the then-pending Unsloth contract.
The final source suite covers both repairs together.

## Evidence

Local red/green logs are committed beside this document.
Independent replay logs and snapshots are retained on the verification host under:

```text
/home/k0stia/code/pi/.pi/verification/ai-research-repair-20261021/tdd-isolation/
```

The repository does not contain Bigpowers' `verify-tdd-red-commit.sh`.
The archive replays supply the available mechanical isolation evidence without claiming that missing validator ran.
