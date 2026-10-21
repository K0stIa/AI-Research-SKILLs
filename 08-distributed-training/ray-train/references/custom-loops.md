# Build a custom Ray Train loop

A Ray Train training function executes on each configured worker.
The driver creates the trainer and specifies worker resources; it is not the per-worker training loop.

## PyTorch workflow

1. Pin Ray and PyTorch, and select an example for the intended Train API version.
2. Pass explicit hyperparameters into the training function rather than relying on driver globals.
3. Prepare the model and data loader with the integration's distributed helpers.
4. Verify data partitioning, epoch behavior, device placement, and random seeds.
5. Aggregate validation metrics according to their meaning rather than reporting one worker's local value as a global score.
6. Have workers participate consistently in reporting and checkpoint operations required by that API.
7. Test one checkpoint save and restore before a long run.

Use the official PyTorch guide to check `TorchTrainer`, `ScalingConfig`, `prepare_model`, and `prepare_data_loader` for the installed release.
Do not mix Train V1 and V2 reporting or checkpoint examples.
Test small CPU fixtures first when possible; a documentation example does not authorize GPU provisioning.
Include failure, cancellation, uneven batches, and restoration tests in a production integration.

## Sources

- Official PyTorch training guide: https://docs.ray.io/en/latest/train/getting-started-pytorch.html
- Existing cluster guidance: [multi-node.md](multi-node.md)

No training run or distributed correctness claim is made by this reference.
