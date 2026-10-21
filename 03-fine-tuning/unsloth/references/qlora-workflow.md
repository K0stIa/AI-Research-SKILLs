# QLoRA workflow and precision boundaries

Read this bounded guide before the scraped documentation archives.

## What receives updates

Standard QLoRA keeps the pretrained base weights frozen and quantized to 4-bit storage.
Gradients pass through the frozen model into trainable low-rank adapters.
The original QLoRA paper states this explicitly in its abstract.
Adapter parameters, compute dtype, and optimizer states are separate from base-weight storage precision.
An 8-bit optimizer does not make an adapter an "8-bit LoRA adapter".
Do not describe QLoRA as repeatedly re-quantizing updated adapters.

Quantization-aware training and quantized inference exports are separate procedures.
A merge or export requires its own compatibility checks and quality evaluation.

## Recipe inputs

Record the base model and revision, tokenizer and template, task, data schema, and held-out split.
Record the device and versions of Unsloth, PyTorch, Transformers, TRL, PEFT, and quantization backend.
Choose supported target modules, adapter rank and alpha, compute dtype, sequence length, and loss mask.
Do not copy target-module names across architectures without inspecting them.

The Unsloth hyperparameter guide discusses rank, alpha, target modules, and completion-only training.
Use its values as starting hypotheses, not guarantees for another dataset or model.
The PEFT quantization guide documents a Transformers/bitsandbytes workflow.
Do not mix its preparation calls into Unsloth code without checking the exact Unsloth release.

## Validation gates

1. Inspect one rendered and tokenized conversation, including labels and truncation.
2. Inspect trainable parameter names and counts. Confirm that base weights remain frozen.
3. After authorization, run a bounded smoke batch and check finite loss and adapter gradients.
4. Verify saved adapters reload with the original base revision and tokenizer.
5. Compare held-out task quality with the unadapted baseline under matched decoding settings.

Stop on unknown API behavior or unsupported combinations. Mark them unverified.
Do not install packages, download weights, train, or publish without authorization.
Report actual memory and throughput measurements instead of promising a fixed reduction.

## Sources

- Dettmers, Pagnoni, Holtzman, and Zettlemoyer, *QLoRA: Efficient Finetuning of Quantized LLMs*, arXiv:2305.14314v1: https://arxiv.org/abs/2305.14314v1
- Unsloth hyperparameters and LoRA/QLoRA distinctions: https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/lora-hyperparameters-guide
- PEFT quantization workflow: https://huggingface.co/docs/peft/developer_guides/quantization

No training was executed to prepare these instructions.
