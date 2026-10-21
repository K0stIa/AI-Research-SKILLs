# MiniLLM: On-Policy Distillation of Large Language Models

Sources: [arXiv 2306.08543v6](https://arxiv.org/abs/2306.08543v6), sections 2.1–2.3, and the [official implementation](https://github.com/microsoft/LMOps/tree/main/minillm).
First preprint: 2023. Conference publication: ICLR 2024. Source check: 2026-10-21.

## Overview

MiniLLM replaces the standard forward-KL distillation objective with reverse KL and derives an on-policy sequence optimization method. Its reported results depend on the paper's models, data, evaluation and training procedure. Replacing one loss function is not a full MiniLLM implementation.

## Problem with Standard KLD

### Forward KL Divergence (Standard)

**Formula**: `KL(Teacher || Student)`

**Minimization behavior**: Mode-covering tendency. Teacher probabilities weight the expectation. Assigning little student probability where the teacher has substantial mass is penalized. A capacity-limited student may spread mass into regions poorly supported by the teacher; this is a tendency, not a universal outcome.

## MiniLLM Solution: Reverse KLD

### Reverse KL Divergence

**Formula**: `KL(Student || Teacher)`

**Minimization behavior**: Mode-seeking tendency. Student probabilities weight the expectation. Student mass where the teacher assigns low probability is penalized. This can omit smaller teacher modes; it does not guarantee increased diversity, factuality or downstream quality.

### Mathematical Formulation

For a shared discrete support, write `q` for the student and `p` for the fixed teacher:

```text
Forward KL: sum_x p(x) [log p(x) - log q(x)]
Reverse KL: sum_x q(x) [log q(x) - log p(x)]
```

Teacher-weighted cross-entropy `-sum_x p(x) log q(x)` is forward KL plus teacher entropy, a student-independent constant. It is not reverse KL and need not be zero when distributions match. Reverse KL includes the student's entropy term, whose gradient cannot be dropped.

## Implementation

### Reverse KLD Loss

This exact token-vocabulary calculation matches the main guide. It is not a full MiniLLM implementation or a policy-gradient estimator. Inputs must have matching shapes and vocabulary semantics. Supply finite logits and a positive temperature. Shift causal targets, exclude padding/ignored positions, and align valid contexts before calling it; the helper averages every supplied position.

```python
import torch
import torch.nn.functional as F

def reverse_kl_loss(student_logits, teacher_logits, temperature=1.0):
    """Exact token-level KL(Student || Teacher), with a detached teacher."""
    log_p_teacher = F.log_softmax(teacher_logits.detach() / temperature, dim=-1)
    log_p_student = F.log_softmax(student_logits / temperature, dim=-1)
    p_student = F.softmax(student_logits / temperature, dim=-1)

    # Student weighting includes the student-entropy gradient.
    reverse_kl = (p_student * (log_p_student - log_p_teacher)).sum(dim=-1).mean()
    return reverse_kl * (temperature ** 2)
```

The `temperature ** 2` factor is a conventional teaching-example scaling. It is not a claim about the official implementation's default objective or hyperparameters. At temperature 1, identical distributions give zero KL; unequal distributions distinguish the direction. Teacher gradients are absent while student gradients include both terms.

### Policy Gradient Optimization

The sequence objective uses student-distribution expectations:

```text
L = E_{y ~ q_student(. | prompt)} [log q_student(y | prompt) - log p_teacher(y | prompt)]
```

Changing the student changes both the log ratio and the distribution over sampled sequences. Computing token-level KL at fixed contexts does not include that entire sequence-level effect. Maximizing likelihood on teacher-generated responses alone is response imitation, not the paper's on-policy reverse-KL algorithm. Averaging raw logits is neither a likelihood nor a KL objective.

Paper section 2.2 derives the policy gradient and introduces single-step decomposition, teacher-mixed sampling and length normalization to reduce variance, mitigate reward hacking and address length bias. Teacher-mixed sampling is a specific part of that algorithm; it does not justify replacing it with arbitrary teacher-only sampling. Use the paper and a pinned official revision for sampling probabilities, corrections and optimization details.

## Training Procedure

Use the [official README](https://github.com/microsoft/LMOps/blob/main/minillm/README.md) and scripts at a selected revision. This reference does not provide an unverified substitute trainer.

Before running that procedure:

1. Pin the implementation revision, dependencies, teacher/student checkpoints and access permissions. Confirm compatible tokenizer/vocabulary semantics; matching tensor dimensions alone are insufficient.
2. Inspect the chosen dataset's actual schema, split, license and availability. Prepare prompt, response, padding and causal-loss masks according to the selected implementation, not a guessed field mapping.
3. Check the revision's student initialization, rollout distribution, teacher scoring, sampling corrections, length treatment and optimizer settings. Freeze the teacher; account for its evaluation mode, device and memory footprint.
4. Verify generation/scoring alignment. Generation scores usually cover generated steps, while a separate causal forward includes prompt positions. Do not compare these tensors without explicitly matching positions and normalization.
5. Validate the loss and gradients on a tiny supported fixture before a budgeted run. Check stop criteria, finite statistics, checkpoint/recovery behavior, resource limits and held-out evaluation.

These are integration gates, not a claim that any particular framework release, dataset or hardware configuration has passed them. No pretrained checkpoint, rollout, trainer or optimizer is executed by the local token-loss tests.

## Performance Results

Consult the paper's tables and exact experimental setup for measured outcomes. No generic LLaMA-7B/70B MT-Bench or AlpacaEval scores are asserted here. Loss direction alone does not establish a fixed percentage improvement, teacher-equivalent performance, diversity or factual accuracy.

For a reproduction, record the paper table/row, implementation revision, checkpoint, dataset split, evaluation version, decoding settings, seeds, resource use and uncertainty. Compare held-out quality against the appropriate undistilled and forward-KL baselines. Do not infer task quality from decreasing training KL alone.

## Comparison: Forward vs Reverse KL

Forward KL penalizes missing teacher mass. Reverse KL penalizes student mass in low-teacher-probability regions. Neither direction forces deterministic output or guarantees diverse generations. Model capacity, data, rollout distribution, decoding and the complete optimization method affect the result. Choose with measured task-specific evidence, not a classification-versus-generation rule alone.

## Hyperparameters

The helper accepts a positive temperature; changing it changes the token distributions and scaled objective. Values other than 1 are illustrative choices, not verified MiniLLM defaults. There is no universal higher-learning-rate rule for reverse KL. Obtain learning rate, warmup, batch size, rollout length and schedule from the chosen official experiment and validate them for the actual workload.

## Limitations

- The helper computes exact KL over a shared token vocabulary at supplied contexts. It does not implement sequence sampling, policy-gradient corrections, masking or the complete paper pipeline.
- On-policy rollouts and teacher scoring add compute and memory costs. Measure them with actual model sizes, sequence lengths and devices.
- A frozen teacher may still be wrong. Teacher alignment, low KL and successful numerical tests do not prove truthfulness or safety.
- CPU identity, direction, temperature and gradient checks establish local numerical behavior only. Full training, SDK/device compatibility, quality and throughput remain unverified.

## Resources

- [Paper, version 6](https://arxiv.org/abs/2306.08543v6)
- [Official implementation](https://github.com/microsoft/LMOps/tree/main/minillm)
- [Microsoft research overview](https://www.microsoft.com/en-us/research/blog/minillm-small-language-models-via-large-language-model-distillation/)
