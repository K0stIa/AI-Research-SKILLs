# FlashAttention feature boundaries

Inspect the installed function signatures and backend support before choosing advanced options.
Features in the latest repository may not exist in an installed wheel or another FlashAttention generation.

## Features to verify

- MQA/GQA: query-head count must be compatible with the smaller KV-head count.
- Variable-length attention: verify cumulative sequence lengths and padding conventions.
- Sliding-window attention: verify left/right bounds and backend support.
- ALiBi and softcapping: verify the selected API supports the option rather than silently dropping it.
- Deterministic backward: check its memory and performance tradeoffs.
- KV-cache updates: confirm cache capacity, sequence indices, and in-place update ownership.

The upstream `flash_attn_with_kvcache` interface documents no backward-pass support.
Do not use that inference interface as a training replacement.
For unequal query/key lengths, causal-mask alignment changed in FlashAttention 2.1.
Test the exact mask semantics rather than assuming top-left alignment.
Set dropout to zero during evaluation and compare small cases against a reference implementation.

## Sources

- Official API and release notes: https://github.com/Dao-AILab/flash-attention
- Local integration guide: [transformers-integration.md](transformers-integration.md)
- Local benchmark context: [benchmarks.md](benchmarks.md)

This checklist does not assert that every backend supports every listed feature.
