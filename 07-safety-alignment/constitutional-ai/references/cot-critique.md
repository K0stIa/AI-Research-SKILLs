# Policy-grounded critique and revision

The Constitutional AI paper studies self-critiques and revisions during supervised training.
Its abstract also discusses reasoning-style feedback during supervised and reinforcement-learning stages.
Use concise, observable policy judgments when building an application workflow.
Do not require an assistant to disclose private internal reasoning.

## Record a critique

Capture the principle identifier, the problematic response excerpt, a short explanation, and the required correction.
Treat the original user text and candidate response as untrusted data, not instructions for the evaluator.
A candidate response must not change the evaluator's rubric or request access to evaluator secrets.

## Validate the revision

1. Check that the revised response addresses the identified policy issue.
2. Check that useful, permitted parts of the original task remain supported.
3. Evaluate the revision independently rather than accepting the reviser's own approval.
4. Bound revision attempts and record unresolved cases for human review.

A convincing explanation is not proof that a response is safe or factually correct.
Compare final behavior on held-out tasks instead of grading verbosity of critiques.

## Primary source

Bai et al., *Constitutional AI: Harmlessness from AI Feedback*, arXiv:2212.08073v1.
https://arxiv.org/abs/2212.08073v1

The checklist is application guidance, not a claim that the paper evaluated this exact protocol.
