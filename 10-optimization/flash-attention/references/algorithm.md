# FlashAttention algorithm and correctness

FlashAttention computes scaled dot-product attention without materializing the full attention matrix in high-bandwidth memory.
Tiling and online softmax reduce memory traffic while preserving the mathematical attention operation.
Floating-point outputs need tolerance-based comparison, not an assumption of bitwise equality.

Dense FlashAttention is not sparse attention and does not make dense attention's arithmetic linear in sequence length.
Reduced intermediate memory is distinct from reduced arithmetic complexity.

## Validate an integration

1. Record the FlashAttention implementation, package version, GPU architecture, dtype, and tensor layout.
2. Compare forward outputs against a reference attention implementation on small inputs.
3. Compare gradients when training is required.
4. Test causal masks, unequal query/key lengths, padding, and any grouped-query configuration.
5. Set evaluation dropout to zero and use matching scales and masks in both implementations.
6. Benchmark only after correctness passes, including warmup and synchronized timing.

Different FlashAttention generations and hardware backends have different support constraints.
Do not infer feature support or speed from the algorithm name alone.

## Sources

- Official implementation, numerical tests, and feature support: https://github.com/Dao-AILab/flash-attention
- Existing integration notes: [transformers-integration.md](transformers-integration.md)

No kernel benchmark was performed while preparing this reference.
