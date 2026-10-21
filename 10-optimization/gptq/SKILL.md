---
name: gptq
description: GPTQ post-training weight quantization for LLMs. Use to plan calibration, reduce weight storage, and evaluate quality and latency on a version-checked backend. Covers group-wise quantization, transformers integration, and adapter workflows; compatibility and performance require validation.
version: 1.0.1
author: Orchestra Research
license: MIT
tags: [Optimization, GPTQ, Quantization, 4-Bit, Post-Training, Memory Optimization, Consumer GPUs, Fast Inference, QLoRA, Group-Wise Quantization]
dependencies: [auto-gptq, transformers, optimum, peft]
---

# GPTQ (Generative Pre-trained Transformer Quantization)

GPTQ uses calibration data to guide weight quantization. Quality, capacity, and latency depend on the model, data, quantization settings, and kernels.

## Verification boundaries

- Record the actual installed library versions and available kernels before using a recipe. API compatibility remains unverified until checked.
- Inspect checkpoint architecture, quantization metadata, access, and local files. An example identifier does not establish checkpoint availability.
- All performance figures below are unverified illustrations, not target measurements or quality guarantees.
- The nominal 16/4 weight-bit ratio is not total runtime memory. Include quantization metadata, packing, activations, KV caches, and workspaces.
- Compare quantized and unquantized models on held-out data under the same evaluation settings. Measure target latency and throughput separately.

## When to use GPTQ

**Consider GPTQ when:**
- Lower weight storage is a goal and a supported quantized kernel is available.
- Calibration data can represent the intended workload.
- Quality, memory, and latency can be compared against a baseline.

**Compare AWQ as an alternative when:**
- The target backend supports its format and kernels.
- You can compare both methods on the same model, data, and hardware; neither has a universal accuracy advantage.

**Consider bitsandbytes when:**
- You need its transformers loading workflow.
- You want to evaluate supported 8-bit and 4-bit formats without assuming either guarantees better task quality.
- You want to quantize during loading rather than require an existing quantized checkpoint.

## Quick start

### Installation

```bash
# Install AutoGPTQ
pip install auto-gptq

# With Triton (Linux only, faster)
pip install auto-gptq[triton]

# With CUDA extensions (faster)
pip install auto-gptq --no-build-isolation

# Full installation
pip install auto-gptq transformers accelerate
```

### Load pre-quantized model

```python
from transformers import AutoTokenizer
from auto_gptq import AutoGPTQForCausalLM

# Load quantized model from HuggingFace
model_name = "TheBloke/Llama-2-7B-Chat-GPTQ"

model = AutoGPTQForCausalLM.from_quantized(
    model_name,
    device="cuda:0",
    use_triton=False  # Set True on Linux for speed
)

tokenizer = AutoTokenizer.from_pretrained(model_name)

# Generate
prompt = "Explain quantum computing"
inputs = tokenizer(prompt, return_tensors="pt").to("cuda:0")
outputs = model.generate(**inputs, max_new_tokens=200)
print(tokenizer.decode(outputs[0]))
```

### Quantize your own model

```python
from transformers import AutoTokenizer
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig
from datasets import load_dataset

# Load model
model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Quantization config
quantize_config = BaseQuantizeConfig(
    bits=4,              # 4-bit quantization
    group_size=128,      # Group size (recommended: 128)
    desc_act=False,      # Activation order (False for CUDA kernel)
    damp_percent=0.01    # Dampening factor
)

# Load model for quantization
model = AutoGPTQForCausalLM.from_pretrained(
    model_name,
    quantize_config=quantize_config
)

# Prepare calibration data
dataset = load_dataset("c4", split="train", streaming=True)
calibration_data = [
    tokenizer(example["text"])["input_ids"][:512]
    for example in dataset.take(128)
]

# Quantize
model.quantize(calibration_data)

# Save quantized model
model.save_quantized("llama-2-7b-gptq")
tokenizer.save_pretrained("llama-2-7b-gptq")

# Push to HuggingFace
model.push_to_hub("username/llama-2-7b-gptq")
```

## Group-wise quantization

**How GPTQ works**:
1. **Group weights**: Divide each weight matrix into groups (typically 128 elements)
2. **Quantize per-group**: Each group has its own scale/zero-point
3. **Minimize error**: Uses Hessian information to minimize quantization error
4. **Result**: 4-bit weights with near-FP16 accuracy

**Group size trade-off**:

| Group Size | Model Size | Accuracy | Speed | Recommendation |
|------------|------------|----------|-------|----------------|
| -1 (per-column) | Smallest | Best | Slowest | Research only |
| 32 | Smaller | Better | Slower | High accuracy needed |
| **128** | Medium | Good | **Fast** | **Recommended default** |
| 256 | Larger | Lower | Faster | Speed critical |
| 1024 | Largest | Lowest | Fastest | Not recommended |

**Example**:
```
Weight matrix: [1024, 4096] = 4.2M elements

Group size = 128:
- Groups: 4.2M / 128 = 32,768 groups
- Each group: own 4-bit scale + zero-point
- Result: Better granularity → better accuracy
```

## Quantization configurations

### Standard 4-bit (recommended)

```python
from auto_gptq import BaseQuantizeConfig

config = BaseQuantizeConfig(
    bits=4,              # 4-bit quantization
    group_size=128,      # Standard group size
    desc_act=False,      # Faster CUDA kernel
    damp_percent=0.01    # Dampening factor
)
```

**Performance**:
- Memory: 4× reduction (70B model: 140GB → 35GB)
- Accuracy: ~1.5% perplexity increase
- Speed: 3-4× faster than FP16

### High accuracy (3-bit with larger groups)

```python
config = BaseQuantizeConfig(
    bits=3,              # 3-bit (more compression)
    group_size=128,      # Keep standard group size
    desc_act=True,       # Better accuracy (slower)
    damp_percent=0.01
)
```

**Trade-off**:
- Memory: 5× reduction
- Accuracy: ~3% perplexity increase
- Speed: 5× faster (but less accurate)

### Maximum accuracy (4-bit with small groups)

```python
config = BaseQuantizeConfig(
    bits=4,
    group_size=32,       # Smaller groups (better accuracy)
    desc_act=True,       # Activation reordering
    damp_percent=0.005   # Lower dampening
)
```

**Trade-off**:
- Memory: 3.5× reduction (slightly larger)
- Accuracy: ~0.8% perplexity increase (best)
- Speed: 2-3× faster (kernel overhead)

## Kernel backends

### ExLlamaV2 (default, fastest)

```python
model = AutoGPTQForCausalLM.from_quantized(
    model_name,
    device="cuda:0",
    use_exllama=True,      # Use ExLlamaV2
    exllama_config={"version": 2}
)
```

**Performance**: 1.5-2× faster than Triton

### Marlin (Ampere+ GPUs)

```python
# Quantize with Marlin format
config = BaseQuantizeConfig(
    bits=4,
    group_size=128,
    desc_act=False  # Required for Marlin
)

model.quantize(calibration_data, use_marlin=True)

# Load with Marlin
model = AutoGPTQForCausalLM.from_quantized(
    model_name,
    device="cuda:0",
    use_marlin=True  # 2× faster on A100/H100
)
```

**Requirements**:
- NVIDIA Ampere or newer (A100, H100, RTX 40xx)
- Compute capability ≥ 8.0

### Triton (Linux only)

```python
model = AutoGPTQForCausalLM.from_quantized(
    model_name,
    device="cuda:0",
    use_triton=True  # Linux only
)
```

**Performance**: 1.2-1.5× faster than CUDA backend

## Integration with transformers

### Direct transformers usage

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load quantized model (transformers auto-detects GPTQ)
model = AutoModelForCausalLM.from_pretrained(
    "TheBloke/Llama-2-13B-Chat-GPTQ",
    device_map="auto",
    trust_remote_code=False
)

tokenizer = AutoTokenizer.from_pretrained("TheBloke/Llama-2-13B-Chat-GPTQ")

# Use like any transformers model
inputs = tokenizer("Hello", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=100)
```

### QLoRA fine-tuning (GPTQ + LoRA)

```python
from transformers import AutoModelForCausalLM
from peft import prepare_model_for_kbit_training, LoraConfig, get_peft_model

# Load GPTQ model
model = AutoModelForCausalLM.from_pretrained(
    "TheBloke/Llama-2-7B-GPTQ",
    device_map="auto"
)

# Prepare for LoRA training
model = prepare_model_for_kbit_training(model)

# LoRA config
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# Add LoRA adapters
model = get_peft_model(model, lora_config)

# Fine-tuning capacity is unverified. Measure activations, adapter/optimizer
# state, quantization metadata, and backend workspaces as well as weights.
```

## Unverified performance illustrations

These retained figures are not reproduced benchmarks. Do not quote them as target performance or capacity guarantees.

### Nominal weight storage

Approximate decimal GB from parameter counts and bit widths only; metadata and runtime allocations are excluded.

| Model | FP16 weights | Nominal 4-bit weights | Bit-width ratio |
|-------|--------------|-----------------------|-----------------|
| Llama 2-7B | 14 GB | 3.5 GB | 4× |
| Llama 2-13B | 26 GB | 6.5 GB | 4× |
| Llama 2-70B | 140 GB | 35 GB | 4× |
| Llama 3.1-405B | 810 GB | 203 GB | 4× |

**Capacity planning requires measurement:**
- For a 70B target on an 80GB device, include non-weight allocations before deciding whether the workload fits.
- For a 405B target, account for per-device memory, placement, and runtime overhead; rounded weight bytes alone do not determine a device count.
- For a 13B target on a 24GB device, measure the intended batch, sequence length, cache, and backend configuration.

### Inference speed (Llama 2-7B, A100)

| Precision | Tokens/sec | vs FP16 |
|-----------|------------|---------|
| FP16 | 25 tok/s | 1× |
| GPTQ 4-bit (CUDA) | 85 tok/s | 3.4× |
| GPTQ 4-bit (ExLlama) | 105 tok/s | 4.2× |
| GPTQ 4-bit (Marlin) | 120 tok/s | 4.8× |

### Accuracy (perplexity on WikiText-2)

| Model | FP16 | GPTQ 4-bit (g=128) | Degradation |
|-------|------|---------------------|-------------|
| Llama 2-7B | 5.47 | 5.55 | +1.5% |
| Llama 2-13B | 4.88 | 4.95 | +1.4% |
| Llama 2-70B | 3.32 | 3.38 | +1.8% |

These illustrative values are not validation results. Recompute perplexity with the same tokenizer, corpus, sequence handling, and evaluation settings before drawing quality conclusions.

## Common patterns

### Multi-GPU deployment

```python
# Automatic device mapping
model = AutoGPTQForCausalLM.from_quantized(
    "TheBloke/Llama-2-70B-GPTQ",
    device_map="auto",  # Automatically split across GPUs
    max_memory={0: "40GB", 1: "40GB"}  # Limit per GPU
)

# Manual device mapping
device_map = {
    "model.embed_tokens": 0,
    "model.layers.0-39": 0,  # First 40 layers on GPU 0
    "model.layers.40-79": 1,  # Last 40 layers on GPU 1
    "model.norm": 1,
    "lm_head": 1
}

model = AutoGPTQForCausalLM.from_quantized(
    model_name,
    device_map=device_map
)
```

### CPU offloading

```python
# Replace with an inspected, architecture-compatible quantized checkpoint.
# Verify this backend's CPU-offload support before using this illustration.
quantized_model_path = "/path/to/verified-gptq-checkpoint"
model = AutoGPTQForCausalLM.from_quantized(
    quantized_model_path,
    device_map="auto",
    max_memory={
        0: "80GB",  # GPU 0
        1: "80GB",  # GPU 1
        2: "80GB",  # GPU 2
        "cpu": "200GB"  # Offload overflow to CPU
    }
)
```

### Batch inference

```python
# Process multiple prompts efficiently
prompts = [
    "Explain AI",
    "Explain ML",
    "Explain DL"
]

inputs = tokenizer(prompts, return_tensors="pt", padding=True).to("cuda")

outputs = model.generate(
    **inputs,
    max_new_tokens=100,
    pad_token_id=tokenizer.eos_token_id
)

for i, output in enumerate(outputs):
    print(f"Prompt {i}: {tokenizer.decode(output)}")
```

## Finding pre-quantized models

**TheBloke on HuggingFace**:
- https://huggingface.co/TheBloke
- 1000+ models in GPTQ format
- Multiple group sizes (32, 128)
- Both CUDA and Marlin formats

**Search**:
```bash
# Find GPTQ models on HuggingFace
https://huggingface.co/models?library=gptq
```

**Download**:
```python
from auto_gptq import AutoGPTQForCausalLM

# Automatically downloads from HuggingFace
model = AutoGPTQForCausalLM.from_quantized(
    "TheBloke/Llama-2-70B-Chat-GPTQ",
    device="cuda:0"
)
```

## Supported models

- **LLaMA family**: Llama 2, Llama 3, Code Llama
- **Mistral**: Mistral 7B, Mixtral 8x7B, 8x22B
- **Qwen**: Qwen, Qwen2, QwQ
- **DeepSeek**: V2, V3
- **Phi**: Phi-2, Phi-3
- **Yi, Falcon, BLOOM, OPT**
- **100+ models** on HuggingFace

## References

- **[Calibration Guide](references/calibration.md)** - Dataset selection, quantization process, quality optimization
- **[Integration Guide](references/integration.md)** - Transformers, PEFT, vLLM, TensorRT-LLM
- **[Troubleshooting](references/troubleshooting.md)** - Common issues, performance optimization

## Resources

- **GitHub**: https://github.com/AutoGPTQ/AutoGPTQ
- **Paper**: GPTQ: Accurate Post-Training Quantization (arXiv:2210.17323)
- **Models**: https://huggingface.co/models?library=gptq
- **Discord**: https://discord.gg/autogptq


