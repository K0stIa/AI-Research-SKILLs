# Mamba performance checks

Separate generation latency, generation throughput, training throughput, and task quality.
A result for one metric does not establish another.

## Reproducible comparison

- Record GPU model, device count, package revisions, precision, model size, and tokenizer.
- Match prompt lengths, generated lengths, batch sizes, and sampling settings across systems.
- Separate compilation and model loading from steady-state timing.
- Synchronize asynchronous device work around timed regions.
- Save individual measurements and report dispersion, not only the best run.
- Evaluate quality on the same tasks before calling a faster configuration equivalent.

The authors provide `benchmarks/benchmark_generation_mamba_simple.py` for generation experiments.
Inspect its current options before running it. Its examples can download model weights.
Get authorization for downloads and compute, and agree on a stopping budget first.

Do not copy throughput ratios from different devices or sequence lengths into a new deployment estimate.
Use the existing [benchmarks.md](benchmarks.md) as historical context, not a measurement of this host.

## Source

Official benchmark entrypoints and evaluation examples: https://github.com/state-spaces/mamba

No performance measurement is claimed by this reference.
