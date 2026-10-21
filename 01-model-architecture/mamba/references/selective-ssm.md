# Selective state-space models

Mamba uses an input-dependent selective state-space layer instead of a dense attention matrix.
The selective scan is a component inside a larger Mamba block, not a complete language model.

## Inspection workflow

1. Record the checkpoint architecture and installed `mamba-ssm` version.
2. Inspect `mamba_ssm/ops/selective_scan_interface.py` for the scan interface in that version.
3. Inspect `mamba_ssm/modules/mamba_simple.py` for the surrounding Mamba block.
4. Check batch, sequence, hidden-state, dtype, and device assumptions before adapting an example.
5. Compare outputs and gradients on a small deterministic input before measuring performance.

Do not infer Transformer attention masks or KV-cache behavior from the Mamba API.
A fixed recurrent state is not evidence that long-range retrieval quality matches an attention model.
Do not promise a speedup without measurements on the target hardware and sequence lengths.

## Sources

- Official implementation and component descriptions: https://github.com/state-spaces/mamba
- Mamba paper linked by the authors: https://arxiv.org/abs/2312.00752
- Existing local architecture guide: [architecture-details.md](architecture-details.md)

The workflow above is an integration checklist, not a new benchmark result.
