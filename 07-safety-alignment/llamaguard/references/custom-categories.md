# Custom safety categories

Llama Guard 3's published model card defines fourteen hazard categories, S1 through S14.
Do not assume the taxonomy, prompt template, or category numbering is identical across Llama Guard releases.

## Customize deliberately

1. Pin the model revision and retain its official chat template.
2. Write explicit category definitions with allowed and disallowed examples.
3. Separate the product's policy identifiers from the model's output labels.
4. Evaluate customized prompts on held-out positive, negative, and ambiguous examples.
5. Measure category-level precision, recall, and false-positive rates.

Changing prompt text does not retrain the model or establish reliable detection of a new category.
Do not silently reinterpret an unknown label as `safe`.
Route malformed output, unknown categories, and unavailable moderation through an explicit failure policy.
Preserve disagreements for review instead of forcing a confident category assignment.

The model card warns that factual categories require up-to-date knowledge and that the classifier can face prompt injection.
Use moderation as one layer, not as an authorization mechanism for tool execution.

## Source

Official model card, taxonomy, usage, and limitations:
https://huggingface.co/meta-llama/Llama-Guard-3-8B/blob/main/README.md

No custom-category accuracy is asserted by this reference.
