# Tune a Ray Train workload

Ray Tune manages trial search and scheduling; Ray Train manages a trial's distributed training workers.
Keep the two resource boundaries explicit when calculating a tuning budget.

## Plan before launching

1. Pin Ray and choose the matching Train/Tune integration example.
2. Define the search space, optimization metric, direction, trial count, and stopping rule.
3. Record worker count and per-worker CPU/GPU allocation through the trainer's `ScalingConfig`.
4. Bound concurrent trials according to total cluster resources, not just resources for one worker.
5. Use the integration's `Tuner` and `RunConfig` interfaces for the installed release.
6. Verify metric reporting and checkpoint restoration with one small trial before a search.

Ray Train APIs differ between versions; do not mix Train V1 and V2 examples.
Do not assume that a training-loop configuration key is a Tune resource reservation.
Keep evaluation data independent of training and choose the best trial using a declared held-out metric.
Persist configuration, seed, reported metrics, checkpoint location, and failure status for every trial.

No search should begin without an approved compute environment, cost budget, and cancellation rule.

## Source

Official Train/Tune integration guide:
https://docs.ray.io/en/latest/train/user-guides/hyperparameter-optimization.html

This is a planning checklist, not an executed tuning recipe or performance result.
