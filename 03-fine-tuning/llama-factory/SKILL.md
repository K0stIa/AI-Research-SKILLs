---
name: llama-factory
description: Provides LLaMA-Factory guidance for configuration-driven SFT, LoRA, QLoRA, dataset registration, and checkpoint validation. Use when preparing training configurations or debugging the CLI or WebUI.
version: 1.1.1
author: Orchestra Research
license: MIT
tags: [Fine-Tuning, LLaMA Factory, LoRA, QLoRA, WebUI, HuggingFace]
dependencies: [llamafactory, torch, transformers, datasets, peft, accelerate, gradio]
---

# Fine-tune with LLaMA-Factory

## When to use

Use this skill for LLaMA-Factory training configuration, dataset registration, CLI usage, and WebUI workflows.
Use Unsloth for Unsloth-specific adapter APIs.
Use PEFT for framework-independent adapter configuration.

## Source gate

You MUST read `references/sft-workflow.md` with Pi's `read` tool before proposing SFT configuration.
Start with [the bounded SFT guide](references/sft-workflow.md).
Read relevant source sections with `offset` and `limit`; avoid loading entire archives unnecessarily.
Record the installed LLaMA-Factory version before copying YAML fields or CLI commands.
Cite the source and section supporting version-sensitive instructions.
Mark compatibility, undocumented options, and memory estimates as unverified.
DO NOT infer supported quantization methods from an advertised list of bit widths.

## Data and template gate

Register custom data in `dataset_info.json` using the schema supported by the installed release.
Inspect a sample before choosing Alpaca, ShareGPT, preference, or multimodal formatting.
Match the model, tokenizer, chat template, dataset columns, and supervised response tokens.
Check role ordering, special tokens, truncation, and train/evaluation separation.
DO NOT reuse an instruction dataset as preference data without checking its required fields.

## Precision distinction

Describe standard QLoRA as frozen quantized base weights plus trainable low-rank adapter parameters.
Distinguish quantization storage, computation dtype, adapter dtype, and optimizer-state precision.
DO NOT equate four-bit storage with INT4 or assume tensor dtypes without inspecting the configuration.
Treat adapter training, merging, and quantized inference export as different operations.
DO NOT promise that every listed backend supports every model, device, and bit width.

## Plan a bounded run

- [ ] Record the task, model revision, license, hardware, and dependency versions.
- [ ] Verify dataset registration and tokenized examples.
- [ ] Select a version-matched SFT example and supported template.
- [ ] Set target modules, rank, precision, sequence length, and batch settings explicitly.
- [ ] Select a fresh output directory and held-out evaluation data.
- [ ] Agree on maximum steps, device allocation, runtime, budget, and stopping rules.
- [ ] Ask before installing packages, downloading weights, training, or starting a public WebUI.

## Validation

After authorization, test one bounded batch before scaling.
Verify trainable parameter names, finite loss, expected labels, and checkpoint creation.
Test checkpoint reload with the same base model and tokenizer revision.
Compare held-out task quality against a baseline with matched decoding settings.
Record configuration, dataset revision, metrics, and failure status.
DO NOT enable remote code or overwrite existing outputs merely because an upstream example does so.

## Troubleshooting

For missing dataset errors, inspect registration paths and column mappings.
For unexpected output, inspect the chat template and label masks before changing hyperparameters.
For precision failures, check the backend, GPU capability, and installed package versions separately.
For rejected CLI options, inspect the installed command help rather than guessing replacements.

## References

- [Versioned SFT workflow and sources](references/sft-workflow.md)
- [Installation, data, SFT, merge, and evaluation archive](references/getting_started.md)
- [Arguments, quantization, adapters, and distributed-training archive](references/advanced.md)

Treat scraped examples as historical source material, not verified commands for every release.
