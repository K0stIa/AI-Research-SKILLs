---
name: unsloth
description: Provides Unsloth fine-tuning guidance for LoRA, QLoRA, dataset preparation, and adapter validation. Use when configuring Unsloth training or debugging quantized fine-tuning.
version: 1.1.1
author: Orchestra Research
license: MIT
tags: [Fine-Tuning, Unsloth, LoRA, QLoRA, Memory-Efficient, Optimization]
dependencies: [unsloth, torch, transformers, trl, datasets, peft]
---

# Fine-tune with Unsloth

## When to use

Use this skill for Unsloth adapter training, data formatting, checkpoint validation, and export planning.
Use the PEFT skill for framework-independent adapter APIs.
Use LLaMA-Factory for configuration-driven training or its WebUI.

## Source gate

You MUST read `references/qlora-workflow.md` with Pi's `read` tool before explaining quantization or proposing training.
Start with [the bounded QLoRA guide](references/qlora-workflow.md), not the complete scraped documentation.
Read only relevant sections of large references with `offset` and `limit`.
Check installed package versions before giving version-sensitive API calls.
Cite the source and section supporting technical claims.
Mark unsupported API behavior, compatibility, and memory estimates as unverified.
DO NOT infer API support from a model name or marketing description.

## Quantization distinction

Describe standard QLoRA as frozen quantized base weights plus trainable low-rank adapter parameters.
Distinguish base-weight storage precision, computation dtype, adapter dtype, and optimizer-state precision.
DO NOT equate four-bit storage with INT4 or assume tensor dtypes without inspecting the configuration.
DO NOT describe ordinary QLoRA as an 8-bit adapter or repeated adapter re-quantization.
Treat quantization-aware training, model merging, and inference quantization as separate workflows.
DO NOT guarantee speedups, memory savings, or unchanged task quality without matching measurements.

## Plan a bounded run

- [ ] Record task, model revision, tokenizer, chat template, and license constraints.
- [ ] Record Python, PyTorch, CUDA, Unsloth, Transformers, TRL, PEFT, and quantization-backend versions.
- [ ] Inspect a dataset sample, its fields, splits, and intended supervised response tokens.
- [ ] Select compatible target modules, rank, alpha, compute dtype, and sequence length.
- [ ] Separate training and held-out evaluation data.
- [ ] Agree on device, maximum steps, runtime, memory budget, and stopping rules.
- [ ] Ask before downloads, dependency installation, training, paid compute, or publication.

## Validate before scaling

Inspect tokenized examples and loss masks before launching a run.
Verify that expected adapter parameters are trainable and base parameters remain frozen.
After authorization, test a bounded batch and inspect finite loss and adapter gradients.
Check actual trainable-parameter counts rather than assuming every loaded tensor receives updates.
Compare a held-out baseline with the adapted model using the same decoding settings.
Save adapter weights, configuration, tokenizer settings, dependency versions, and evaluation evidence.
Test adapter reload with the original base revision before claiming a checkpoint is reusable.

## Troubleshooting

For memory failures, inspect sequence length, batch size, optimizer state, and activation memory separately.
For poor output, check template compatibility, label masking, truncation, and data quality before increasing rank.
For unchanged behavior, inspect trainable tensors and adapter reload paths before claiming quantization caused failure.
For missing API support, consult the exact installed version and report the remaining uncertainty.

## References

- [QLoRA workflow and sources](references/qlora-workflow.md)
- [Official documentation index](references/llms.md)
- [Scraped documentation archive](references/llms-full.md)

The archive contains historical examples and version-specific claims.
Verify their applicability before copying them into a recipe.
