---
name: deepspeed
description: Guides distributed training with DeepSpeed, including ZeRO state partitioning, offload, gradient accumulation, and configuration checks. Use when planning or debugging DeepSpeed training and checkpoint workflows.
version: 1.1.0
author: Orchestra Research
license: MIT
tags: [DeepSpeed, Distributed Training, ZeRO, Mixed Precision, Optimization]
dependencies: [deepspeed, torch]
---

# DeepSpeed distributed training

## Source gate

Before offering a version-specific recipe, MUST read the relevant bounded section of [configuration and overview documentation](references/other.md).
The configuration section starts near line 265 in this snapshot.
Use Pi's `read` tool with `offset` and `limit`; do not load the entire scraped manual.
Read [tutorials](references/tutorials.md) for ZeRO, pipeline parallelism, or offload details, and [the index](references/index.md) to locate other subjects.
Record the installed DeepSpeed, PyTorch, Python, CUDA or ROCm, and accelerator versions.
Compatibility and performance remain unverified until checked in the target environment.

## Choose the parallelism and memory strategy

ZeRO partitions data-parallel training state:

- Stage 1 partitions optimizer states.
- Stage 2 also partitions gradients.
- Stage 3 also partitions model parameters.

ZeRO does not mean every rank stores the full model. Stage 3 can gather parameters when computation requires them.
Offload moves selected state to CPU memory or NVMe; it changes host-memory, bandwidth, and storage requirements.
Do not infer GPU fit from model weight size alone. Include activations, optimizer state, communication buffers, and temporary gathers.

Choose pipeline or tensor parallelism only when the model and integration support the intended topology.
For a PyTorch-native sharding workflow, compare FSDP2 rather than combining sharding engines without supported integration guidance.

## Planning checklist

- [ ] Agree on execution environment, GPU count, budget, and stopping condition.
- [ ] Check framework versions, supported accelerators, and any required extension builds.
- [ ] Confirm the model, dataset schema, sequence length, and held-out evaluation split.
- [ ] Record the data-parallel group size and any tensor/pipeline parallel groups.
- [ ] Set micro-batch size and gradient accumulation; verify the resulting global batch.
- [ ] Select one supported precision configuration for the hardware and framework version.
- [ ] Estimate GPU and host memory, then validate with an authorized small run.
- [ ] Define checkpoint, restart, loss-finiteness, and evaluation checks before scaling.

In ordinary data-parallel training:

```text
global batch = micro-batch per GPU × accumulation steps × data-parallel world size
```

Do not substitute total rank count for the data-parallel group size in a hybrid topology.

## Configuration example

This example illustrates ZeRO stage 2 and batch arithmetic. It is not a complete training command or a memory-fit guarantee.
The global batch depends on the actual data-parallel world size.

```json
{
  "train_micro_batch_size_per_gpu": 1,
  "gradient_accumulation_steps": 8,
  "zero_optimization": {
    "stage": 2
  }
}
```

Supply the model, optimizer, data loading, launcher, and precision configuration through the supported integration.
Check the current [DeepSpeed configuration reference](https://www.deepspeed.ai/docs/config-json/) before adding offload or precision fields.
Do not blindly combine FP16, BF16, and other mixed-precision modes.

## Engine ownership

After supported initialization, use the DeepSpeed engine's backward and step methods.
Do not also step a second optimizer or independently apply incompatible loss scaling.
This fragment assumes an initialized engine and a model output with a `loss` field:

```python
def train_microbatch(engine, batch):
    output = engine(**batch)
    engine.backward(output.loss)
    engine.step()
    return output.loss.detach()
```

Verify the integration's gradient-accumulation behavior before adding manual accumulation or loss division.

## Validation and common failures

- An out-of-memory failure can come from activations or parameter gathers even when optimizer state is sharded.
- A launch hang requires checking rank assignments, process-group initialization, connectivity, and timeout logs.
- Non-finite loss requires checking inputs, learning rate, scaling, precision support, and gradient handling.
- Resume requires compatible model/configuration state and the appropriate distributed checkpoint protocol.
- A ZeRO checkpoint is not automatically a consolidated inference artifact. Check the version-specific export procedure.
- Report missing APIs or unsupported hardware. Do not guess a configuration field or promise a speedup.

Training, package installation, downloads, remote jobs, and paid compute require user authorization.
For planning-only requests, inspect the documentation, state unverified prerequisites, and return control without execution.

## Sources and preserved material

- [Official getting-started guide](https://www.deepspeed.ai/getting-started/)
- [Official ZeRO tutorial](https://www.deepspeed.ai/tutorials/zero/)
- [Official configuration reference](https://www.deepspeed.ai/docs/config-json/)
- Existing local references retain the original documentation snapshots.
- [Archived generated entrypoint](references/legacy-entrypoint.md) preserves the former flattened scrape for provenance, not routine prompt expansion.
