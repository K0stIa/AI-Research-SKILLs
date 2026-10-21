# Evaluate Llama Guard

The official model card reports evaluations for a particular checkpoint, taxonomy, and datasets.
Those results are not a benchmark of a customized prompt or a production deployment.

## Evaluation checklist

1. Pin checkpoint and tokenizer revisions, prompt template, and decoding settings.
2. Build a held-out set covering each deployed category and realistic benign requests.
3. Label user-message moderation separately from assistant-response moderation.
4. Report precision, recall, false positives, false negatives, and sample counts by category.
5. Include multilingual, long-context, quoted-content, and adversarial examples relevant to deployment.
6. Measure malformed outputs, service failures, and latency separately from classification accuracy.

Keep the evaluation set independent from prompt tuning.
Record the human labeling rubric and disagreements.
Do not collapse all failures into an aggregate accuracy number or infer calibration from generated labels.
Compare model-card results only when taxonomy, data, and scoring protocol match.

## Source

Official benchmark tables, taxonomy, and limitations:
https://huggingface.co/meta-llama/Llama-Guard-3-8B/blob/main/README.md

No local benchmark was run. The checklist is deployment guidance, not a claim of measured performance.
