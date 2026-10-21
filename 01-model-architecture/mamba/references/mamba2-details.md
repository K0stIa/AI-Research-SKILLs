# Mamba-2 and structured state-space duality

Mamba-2 is a distinct block implementation based on structured state-space duality, abbreviated SSD.
Do not treat a Mamba-1 checkpoint as a Mamba-2 checkpoint by changing an import.

## Locate the implementation

The authors' repository exposes `Mamba2` from `mamba_ssm`.
Its implementations include `mamba_ssm/modules/mamba2.py` and `mamba2_simple.py`.
The minimal SSD implementation is `mamba_ssm/modules/ssd_minimal.py`.

Record the model configuration, state size, head dimensions, dtype, package version, and checkpoint family.
Use the constructor and state dictionary for that exact version.
Before training, compare one small forward pass and a backward pass against the intended implementation.
Before generation, check the checkpoint's tokenizer and recurrent-state handling.

The repository supplies separate Mamba-2 checkpoint names and evaluation examples.
Do not invent checkpoint names or claim compatibility from a similar parameter count.

## Sources

- Author-maintained usage and source paths: https://github.com/state-spaces/mamba
- Mamba-2 paper linked by the authors: https://arxiv.org/abs/2405.21060

These notes describe the upstream interface. No model execution was performed while authoring this reference.
