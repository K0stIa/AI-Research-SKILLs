---
name: model-pruning
description: Reduce LLM size and accelerate inference using pruning techniques like Wanda and SparseGPT. Use when compressing models without retraining, achieving 50% sparsity with minimal accuracy loss, or enabling faster inference on hardware accelerators. Covers unstructured pruning, structured pruning, N:M sparsity, magnitude pruning, and one-shot methods.
version: 1.0.3
author: Orchestra Research
license: MIT
tags: [Emerging Techniques, Model Pruning, Wanda, SparseGPT, Sparsity, Model Compression, N:M Sparsity, One-Shot Pruning, Structured Pruning, Unstructured Pruning, Fast Inference]
dependencies: [transformers, torch]
---

# Model Pruning: Compressing LLMs

## When to Use This Skill

Use Model Pruning when you need to:
- **Reduce model size** by 40-60% with <1% accuracy loss
- **Accelerate inference** using hardware-friendly sparsity (2-4× speedup)
- **Deploy on constrained hardware** (mobile, edge devices)
- **Compress without retraining** using one-shot methods
- **Enable efficient serving** with reduced memory footprint

**Key Techniques**: Wanda (weights × activations), SparseGPT (second-order), structured pruning, N:M sparsity

**Papers**: Wanda ICLR 2024 (arXiv 2306.11695), SparseGPT (arXiv 2301.00774)

## Installation

```bash
# Wanda implementation
git clone https://github.com/locuslab/wanda
cd wanda
pip install -r requirements.txt

# Optional: SparseGPT
git clone https://github.com/IST-DASLab/sparsegpt
cd sparsegpt
pip install -e .

# Dependencies
pip install torch transformers accelerate
```

## Quick Start

### Wanda Pruning (One-Shot, No Retraining)

**Source**: ICLR 2024 (arXiv 2306.11695)

This one-pass teaching example matches the [reference algorithm](./references/wanda.md). It is not the paper's layer-sequential recalibration pipeline. It collects unmasked activation statistics from ordinary Linear layers and leaves the model in evaluation mode. Use finite weights and calibration inputs on compatible devices. Float32 scores can overflow for extreme values; existing zeros can increase final sparsity. Quality, sparse execution, offload, custom layers, and speed require separate validation.

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    torch_dtype=torch.float16,
    device_map="cuda"
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf")

# Calibration data (small dataset for activation statistics)
calib_data = [
    "The quick brown fox jumps over the lazy dog.",
    "Machine learning is transforming the world.",
    "Artificial intelligence powers modern applications.",
]

# Wanda pruning function; calib_data contains tokenized input dictionaries.
def wanda_prune(model, calib_data, sparsity=0.5):
    """Illustrative one-pass calibration and per-output pruning of Linear weights."""
    if not 0.0 <= sparsity <= 1.0:
        raise ValueError("sparsity must be between zero and one")
    squared_sums = {}

    def activation_hook(name):
        def hook(module, input, output):
            X = input[0].detach()
            if X.numel() == 0:
                return
            # Collapse batch/sequence axes; accumulate squared sums, not batch means.
            values = X.reshape(-1, X.shape[-1]).float()
            batch_sums = values.square().sum(dim=0)
            if name in squared_sums:
                squared_sums[name] += batch_sums
            else:
                squared_sums[name] = batch_sums
            if not torch.isfinite(squared_sums[name]).all():
                raise ValueError("Calibration statistics must be finite")
        return hook

    hooks = []
    try:
        for name, module in model.named_modules():
            if isinstance(module, torch.nn.Linear):
                hooks.append(module.register_forward_hook(activation_hook(name)))
        model.eval()
        with torch.no_grad():
            for batch in calib_data:
                model(**batch)
    finally:
        for hook in hooks:
            hook.remove()

    with torch.no_grad():
        for name, module in model.named_modules():
            if isinstance(module, torch.nn.Linear) and name in squared_sums:
                W = module.weight
                activation = squared_sums[name].sqrt()
                number_to_prune = int(sparsity * W.shape[1])
                for row in W:
                    importance = row.float().abs() * activation
                    indices = torch.argsort(importance, stable=True)[:number_to_prune]
                    row[indices] = 0
    return model

# Tokenize before calibration; the pruning function has no tokenizer global.
calib_batches = [tokenizer(text, return_tensors="pt").to(model.device) for text in calib_data]
pruned_model = wanda_prune(model, calib_batches, sparsity=0.5)

# Save
pruned_model.save_pretrained("./llama-2-7b-wanda-50")
```

### SparseGPT (Second-Order Pruning)

**Source**: arXiv 2301.00774

```python
from sparsegpt import SparseGPT

# Load model
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")

# Initialize SparseGPT
pruner = SparseGPT(model)

# Calibration data
calib_data = load_calibration_data()  # ~128 samples

# Prune (one-shot, layer-wise reconstruction)
pruned_model = pruner.prune(
    calib_data=calib_data,
    sparsity=0.5,           # 50% sparsity
    prunen=0,               # Unstructured (0) or N:M structured
    prunem=0,
    percdamp=0.01,          # Damping for Hessian inverse
)

# Results: Near-lossless pruning at 50% sparsity
```

### N:M Structured Pruning (Hardware Accelerator)

```python
def nm_prune(weight, n=2, m=4):
    """
    N:M pruning: Keep N weights per M consecutive weights.
    Example: 2:4 = keep 2 out of every 4 weights.

    Compatible with NVIDIA sparse tensor cores (2:4, 4:8).
    """
    # Reshape weight into groups of M
    shape = weight.shape
    weight_flat = weight.flatten()

    # Pad to multiple of M
    pad_size = (m - weight_flat.numel() % m) % m
    weight_padded = F.pad(weight_flat, (0, pad_size))

    # Reshape into (num_groups, m)
    weight_grouped = weight_padded.reshape(-1, m)

    # Find top-N in each group
    _, indices = torch.topk(weight_grouped.abs(), n, dim=-1)

    # Create mask
    mask = torch.zeros_like(weight_grouped)
    mask.scatter_(1, indices, 1.0)

    # Apply mask
    weight_pruned = weight_grouped * mask

    # Reshape back
    weight_pruned = weight_pruned.flatten()[:weight_flat.numel()]
    return weight_pruned.reshape(shape)

# Apply 2:4 sparsity (NVIDIA hardware)
for name, module in model.named_modules():
    if isinstance(module, torch.nn.Linear):
        module.weight.data = nm_prune(module.weight.data, n=2, m=4)

# 50% sparsity, 2× speedup on A100 with sparse tensor cores
```

## Core Concepts

### 1. Pruning Criteria

**Magnitude Pruning** (baseline):
```python
# Prune weights with smallest absolute values
importance = weight.abs()
threshold = torch.quantile(importance, sparsity)
mask = importance >= threshold
```

**Wanda** (weights × activations):
```python
# Importance = |weight| × input_activation
importance = weight.abs() * activation
# Better than magnitude alone (considers usage)
```

**SparseGPT** (second-order):
```python
# Uses Hessian (second derivative) for importance
# More accurate but computationally expensive
importance = weight^2 / diag(Hessian)
```

### 2. Structured vs Unstructured

**Unstructured** (fine-grained):
- Prune individual weights
- Higher quality (better accuracy)
- No hardware speedup (irregular sparsity)

**Structured** (coarse-grained):
- Prune entire neurons, heads, or layers
- Lower quality (more accuracy loss)
- Hardware speedup (regular sparsity)

**Semi-structured (N:M)**:
- Best of both worlds
- 50% sparsity (2:4) → 2× speedup on NVIDIA GPUs
- Minimal accuracy loss

### 3. Sparsity Patterns

```python
# Unstructured (random)
# [1, 0, 1, 0, 1, 1, 0, 0]
# Pros: Flexible, high quality
# Cons: No speedup

# Structured (block)
# [1, 1, 0, 0, 1, 1, 0, 0]
# Pros: Hardware friendly
# Cons: More accuracy loss

# N:M (semi-structured)
# [1, 0, 1, 0] [1, 1, 0, 0]  (2:4 pattern)
# Pros: Hardware speedup + good quality
# Cons: Requires specific hardware (NVIDIA)
```

## Pruning Strategies

### Strategy 1: Gradual Magnitude Pruning

```python
def gradual_prune(model, initial_sparsity=0.0, final_sparsity=0.5, num_steps=100):
    """Gradually increase sparsity during training."""
    for step in range(num_steps):
        # Current sparsity
        current_sparsity = initial_sparsity + (final_sparsity - initial_sparsity) * (step / num_steps)

        # Prune at current sparsity
        for module in model.modules():
            if isinstance(module, torch.nn.Linear):
                weight = module.weight.data
                threshold = torch.quantile(weight.abs().flatten(), current_sparsity)
                mask = weight.abs() >= threshold
                weight *= mask.float()

        # Train one step
        train_step(model)

    return model
```

### Strategy 2: Layer-wise Pruning

```python
def layer_wise_prune(model, sparsity_per_layer):
    """Different sparsity for different layers."""
    # Early layers: Less pruning (more important)
    # Late layers: More pruning (less critical)

    sparsity_schedule = {
        "layer.0": 0.3,   # 30% sparsity
        "layer.1": 0.4,
        "layer.2": 0.5,
        "layer.3": 0.6,   # 60% sparsity
    }

    for name, module in model.named_modules():
        if isinstance(module, torch.nn.Linear):
            # Find layer index
            for layer_name, sparsity in sparsity_schedule.items():
                if layer_name in name:
                    # Prune at layer-specific sparsity
                    prune_layer(module, sparsity)
                    break

    return model
```

### Strategy 3: Iterative Pruning + Fine-tuning

```python
def iterative_prune_finetune(model, target_sparsity=0.5, iterations=5):
    """Prune gradually with fine-tuning between iterations."""
    current_sparsity = 0.0
    sparsity_increment = target_sparsity / iterations

    for i in range(iterations):
        # Increase sparsity
        current_sparsity += sparsity_increment

        # Prune
        prune_model(model, sparsity=current_sparsity)

        # Fine-tune (recover accuracy)
        fine_tune(model, epochs=2, lr=1e-5)

    return model

# Results: Better accuracy than one-shot at high sparsity
```

## Production Deployment

### Complete Pruning Pipeline

```python
from transformers import Trainer, TrainingArguments

def production_pruning_pipeline(
    model_name="meta-llama/Llama-2-7b-hf",
    target_sparsity=0.5,
    method="wanda",  # or "sparsegpt"
):
    # 1. Load model
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    # 2. Load calibration data
    calib_dataset = load_dataset("wikitext", "wikitext-2-raw-v1", split="train[:1000]")

    # 3. Apply pruning
    if method == "wanda":
        pruned_model = wanda_prune(model, calib_dataset, sparsity=target_sparsity)
    elif method == "sparsegpt":
        pruner = SparseGPT(model)
        pruned_model = pruner.prune(calib_dataset, sparsity=target_sparsity)

    # 4. (Optional) Fine-tune to recover accuracy
    training_args = TrainingArguments(
        output_dir="./pruned-model",
        num_train_epochs=1,
        per_device_train_batch_size=4,
        learning_rate=1e-5,
        bf16=True,
    )

    trainer = Trainer(
        model=pruned_model,
        args=training_args,
        train_dataset=finetune_dataset,
    )

    trainer.train()

    # 5. Save
    pruned_model.save_pretrained("./pruned-llama-7b-50")
    tokenizer.save_pretrained("./pruned-llama-7b-50")

    return pruned_model

# Usage
pruned_model = production_pruning_pipeline(
    model_name="meta-llama/Llama-2-7b-hf",
    target_sparsity=0.5,
    method="wanda"
)
```

### Evaluation

```python
from lm_eval import evaluator

# Evaluate pruned vs original model
original_results = evaluator.simple_evaluate(
    model="hf",
    model_args="pretrained=meta-llama/Llama-2-7b-hf",
    tasks=["arc_easy", "hellaswag", "winogrande"],
)

pruned_results = evaluator.simple_evaluate(
    model="hf",
    model_args="pretrained=./pruned-llama-7b-50",
    tasks=["arc_easy", "hellaswag", "winogrande"],
)

# Compare
print(f"Original: {original_results['results']['arc_easy']['acc']:.3f}")
print(f"Pruned:   {pruned_results['results']['arc_easy']['acc']:.3f}")
print(f"Degradation: {(original_results - pruned_results):.3f}")

# Typical results at 50% sparsity:
# - Wanda: <1% accuracy loss
# - SparseGPT: <0.5% accuracy loss
# - Magnitude: 2-3% accuracy loss
```

## Best Practices

### 1. Sparsity Selection

```python
# Conservative (safe)
sparsity = 0.3  # 30%, <0.5% loss

# Balanced (recommended)
sparsity = 0.5  # 50%, ~1% loss

# Aggressive (risky)
sparsity = 0.7  # 70%, 2-5% loss

# Extreme (model-dependent)
sparsity = 0.9  # 90%, significant degradation
```

### 2. Method Selection

```python
# One-shot, no retraining → Wanda or SparseGPT
if no_retraining_budget:
    use_method = "wanda"  # Faster

# Best quality → SparseGPT
if need_best_quality:
    use_method = "sparsegpt"  # More accurate

# Hardware speedup → N:M structured
if need_speedup:
    use_method = "nm_prune"  # 2:4 or 4:8
```

### 3. Avoid Common Pitfalls

```python
# ❌ Bad: Pruning without calibration data
prune_random(model)  # No activation statistics

# ✅ Good: Use calibration data
prune_wanda(model, calib_data)

# ❌ Bad: Too high sparsity in one shot
prune(model, sparsity=0.9)  # Massive accuracy loss

# ✅ Good: Gradual or iterative
iterative_prune(model, target=0.9, steps=10)
```

## Performance Comparison

**Pruning methods at 50% sparsity** (LLaMA-7B):

| Method | Accuracy Loss | Speed | Memory | Retraining Needed |
|--------|---------------|-------|---------|-------------------|
| **Magnitude** | -2.5% | 1.0× | -50% | No |
| **Wanda** | -0.8% | 1.0× | -50% | No |
| **SparseGPT** | -0.4% | 1.0× | -50% | No |
| **N:M (2:4)** | -1.0% | 2.0× | -50% | No |
| **Structured** | -3.0% | 2.0× | -50% | No |

**Source**: Wanda paper (ICLR 2024), SparseGPT paper

## Resources

- **Wanda Paper (ICLR 2024)**: https://arxiv.org/abs/2306.11695
- **Wanda GitHub**: https://github.com/locuslab/wanda
- **SparseGPT Paper**: https://arxiv.org/abs/2301.00774
- **SparseGPT GitHub**: https://github.com/IST-DASLab/sparsegpt
- **NVIDIA Sparse Tensor Cores**: https://developer.nvidia.com/blog/accelerating-inference-with-sparsity-using-ampere-and-tensorrt/


