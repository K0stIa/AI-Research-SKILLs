# Versioned LLaMA-Factory SFT workflow

## Establish the version

Record `llamafactory-cli version` when an installed CLI is available.
Use its matching tagged examples rather than assuming that upstream `main` preserves old paths.
This reference uses the official v0.9.3 examples as an explicit, versioned illustration.
It does not claim that those configurations work unchanged with another release.

## Validate data

Inspect the data preparation section of the bundled getting-started archive.
Register local data in `dataset_info.json` with explicit file paths and column mappings.
For Alpaca-style SFT, check instruction, optional input, and response columns.
For conversation data, check the registered format, message roles, and chat template.
For preference training, verify chosen/rejected fields instead of treating SFT responses as preference pairs.
Keep held-out evaluation records separate from training.

## Configuration landmarks

The v0.9.3 on-the-fly QLoRA example uses these fields:

```yaml
# Partial illustration, not a runnable training configuration.
quantization_bit: 4
quantization_method: bnb
stage: sft
finetuning_type: lora
lora_rank: 8
lora_target: all
```

Specify a compatible model, dataset, template, output path, and training budget before any execution.
Inspect the full tagged example and the installed argument definitions before adapting fields.
Do not copy `trust_remote_code: true` or output-overwrite settings without an explicit reason and authorization.

Standard QLoRA trains adapter parameters while keeping quantized base weights frozen.
A 4-bit base does not mean the adapters or optimizer states are also 4-bit.
An export or merge is a separate compatibility and quality-validation step.

## Authorized smoke run

Check tokenized examples and trainable parameters first.
Then run a bounded batch, inspect finite loss, save the adapter, and test reload.
Evaluate against a baseline with matched prompts and decoding settings.
Do not start training, downloads, installations, paid services, or a publicly exposed WebUI without authorization.

## Sources

- Official tagged LoRA example: https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.3/examples/train_lora/llama3_lora_sft.yaml
- Official tagged QLoRA example: https://github.com/hiyouga/LLaMA-Factory/blob/v0.9.3/examples/train_qlora/llama3_lora_sft_otfq.yaml
- Data preparation: https://llamafactory.readthedocs.io/en/latest/getting_started/data_preparation.html
- SFT guide: https://llamafactory.readthedocs.io/en/latest/getting_started/sft.html
- QLoRA precision semantics: https://arxiv.org/abs/2305.14314v1

No model was downloaded or trained while preparing this reference. Unknown compatibility remains unverified.
