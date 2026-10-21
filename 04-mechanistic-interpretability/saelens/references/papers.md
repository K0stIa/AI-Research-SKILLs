# Sparse autoencoder research context

## Reconstruction, sparsity, and evaluation

Leo Gao, Tom Dupré la Tour, Henk Tillman, Gabriel Goh, Rajan Troll, Alec Radford, Ilya Sutskever, and Jan Leike.
*Scaling and evaluating sparse autoencoders*.
arXiv:2406.04093v1, 2024-06-06.

- [Primary paper record](https://arxiv.org/abs/2406.04093v1)
- [Paper PDF](https://arxiv.org/pdf/2406.04093v1)

The abstract describes sparse bottlenecks for reconstructing model activations.
It discusses the reconstruction/sparsity tradeoff, dead latents, and evaluation beyond reconstruction alone.
Use the paper as research context. It is not a specification of the current SAELens configuration or return types.

## Apply the reading to a workflow

- Match the SAE release to the exact base model, activation hook, layer, and activation dimension.
- Record the SAE architecture and sparsity mechanism rather than assuming every release uses an L1-penalized ReLU.
- Check activation normalization and preprocessing before encoding.
- Measure reconstruction and downstream behavior on held-out inputs.
- Report sparsity and inactive-feature behavior alongside reconstruction quality.
- Treat a feature description as a hypothesis until intervention or other appropriate evaluation supports it.
- Do not transfer a metric target or claimed improvement across models without measurement.

Check the [official SAELens repository](https://github.com/jbloomAus/SAELens) for versioned loading and training APIs.
No SAE training, model download, or reproduction was performed to create this reference.

Metadata provenance: arXiv API lookup of `2406.04093` on 2026-10-21.
Endpoint: https://export.arxiv.org/api/query?id_list=2211.00593%2C2406.04093&max_results=2
