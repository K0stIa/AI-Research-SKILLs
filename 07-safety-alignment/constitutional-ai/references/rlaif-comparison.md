# Compare RLAIF and RLHF

RLHF uses human preference feedback. RLAIF uses model-generated preference feedback.
In the Constitutional AI paper, a preference model learns from AI preferences and supplies an RL reward signal.
The supervised critique-and-revision stage is distinct from that reinforcement-learning stage.

## Compare fairly

- Hold the base model, prompts, sampling settings, and evaluation tasks constant where possible.
- Record the judge model, constitution, presentation order, and preference prompt.
- Measure agreement with independent human judgments on held-out data.
- Include benign prompts to measure unnecessary refusals.
- Report labeling cost separately from generation, training, and evaluation cost.
- Check whether preference improvements survive outside the judge's own evaluation distribution.

AI feedback can inherit judge bias and systematic errors.
Human feedback also depends on annotator instructions, expertise, and agreement.
Neither label source establishes deployment safety without independent evaluation.
Do not claim that RLAIF always matches RLHF or eliminates human oversight.

## Primary source

Bai et al., *Constitutional AI: Harmlessness from AI Feedback*, arXiv:2212.08073v1.

- https://arxiv.org/abs/2212.08073v1
- https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback

No comparative experiment or cost measurement is reported here.
