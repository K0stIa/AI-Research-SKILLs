# TransformerLens research context

## Causal circuit analysis

Kevin Wang, Alexandre Variengien, Arthur Conmy, Buck Shlegeris, and Jacob Steinhardt.
*Interpretability in the Wild: a Circuit for Indirect Object Identification in GPT-2 small*.
arXiv:2211.00593v1, 2022-11-01.

- [Primary paper record](https://arxiv.org/abs/2211.00593v1)
- [Paper PDF](https://arxiv.org/pdf/2211.00593v1)

The paper studies indirect object identification using causal interventions.
Its abstract identifies faithfulness, completeness, and minimality as evaluation criteria.
Use those criteria to distinguish a plausible activation story from an evaluated circuit explanation.
This paper supplies research context, not a guarantee about a current TransformerLens API.

## Apply the reading to a workflow

- Define the behavior and a held-out set before selecting components.
- Record the model revision, token positions, and clean/corrupted input construction.
- Inspect activation shapes and hook names before patching.
- Compare interventions against the unmodified baseline and suitable controls.
- State the metric and its direction. Do not treat attention weight alone as causal proof.
- Separate observed effects from an explanation that generalizes to new prompts.

Check the [official TransformerLens documentation](https://transformerlensorg.github.io/TransformerLens/) for current cache and hook APIs.
No model execution or reproduction is implied by this bibliography.

Metadata provenance: arXiv API lookup of `2211.00593` on 2026-10-21.
Endpoint: https://export.arxiv.org/api/query?id_list=2211.00593%2C2406.04093&max_results=2
