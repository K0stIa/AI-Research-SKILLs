# Deploy a safety classifier

Llama Guard is a text classifier implemented using a language model.
Its classification is evidence for a policy decision, not permission to execute a tool or release sensitive data.

## Deployment boundary

- Pin model and tokenizer revisions and use the official chat template.
- Distinguish classification of user messages from classification of assistant responses.
- Parse only the documented `safe` or `unsafe` response format and recognized category identifiers.
- Treat malformed output, unknown labels, truncation, timeout, and service failure as unknown results.
- Define whether an unknown result blocks, retries within a bound, or escalates to human review.
- Do not silently allow a request because moderation was unavailable.

Validate the parser with safe, unsafe, malformed, and empty-response fixtures.
Measure false positives and false negatives on product-specific data before enforcement.
Log model revision, policy version, decision, and failure reason without storing unnecessary sensitive content.
Test prompt injection against the moderation boundary; the model card identifies it as a limitation.

## Source

Official usage, output examples, taxonomy, license links, and limitations:
https://huggingface.co/meta-llama/Llama-Guard-3-8B/blob/main/README.md

Review the model license and acceptable-use policy before downloading or serving weights.
This reference does not authorize downloads, paid endpoints, or deployment.
