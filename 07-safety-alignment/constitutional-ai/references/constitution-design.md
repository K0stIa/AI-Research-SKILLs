# Design a constitution

A constitution is an explicit set of principles used to guide critiques, revisions, or preference judgments.
It is not a guarantee that a trained system follows those principles in every situation.

## Design workflow

1. Define the intended users, tasks, protected data, and unacceptable outcomes.
2. Write principles with stable identifiers and concrete decision criteria.
3. Specify how to resolve conflicts between principles.
4. Create harmful, benign, and ambiguous examples for each principle.
5. Check that reviewers can apply the principles consistently.
6. Keep an evaluation set separate from examples used to refine the constitution.

Track both harmful compliance and unnecessary refusals on benign inputs.
Version the constitution together with prompts, model revisions, evaluation data, and judgment procedures.
Require human review when policy changes affect legal obligations or high-impact decisions.
Do not mistake agreement between two similar models for independent validation.

## Primary source

Bai et al., *Constitutional AI: Harmlessness from AI Feedback*, arXiv:2212.08073v1.
The paper describes supervised critique/revision and reinforcement learning from AI preferences.

- https://arxiv.org/abs/2212.08073v1
- https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback

The workflow above is operational guidance, not a reproduction of the paper's results.
