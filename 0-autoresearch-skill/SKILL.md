---
name: orchestra-autoresearch
description: Orchestrates bounded AI research with hypothesis-driven experiments, evidence synthesis, and domain-skill routing. Use when planning research, running approved experiment batches, or managing multiple hypotheses.
version: 1.1.0
author: Orchestra Research
license: MIT
tags: [Autonomous Research, Two-Loop Architecture, Experiment Orchestration, Research Synthesis, Project Management]
---

# Orchestra autoresearch

## Pi execution rules

These rules override conflicting autonomy or continuity instructions in all linked references.

- MUST agree on experiment scope, execution environment, compute budget, and stopping condition before running experiments.
- MUST stop at the agreed budget or checkpoint.
- DO NOT create background loops, cron jobs, or subagents without explicit user authorization.
- DO NOT provision paid compute, publish artifacts, push commits, or delete data without explicit user authorization.
- MUST use available Pi tools. DO NOT assume Claude Code commands or OpenClaw tools exist.
- MUST save findings and next steps before returning control. Resume only when requested.

## Load only the required detail

DO NOT load the complete workflow for identity, command-routing, or safety-only questions.
Answer those questions from this entrypoint.
For filesystem verification, MUST perform the requested bounded read before reporting its result.
DO NOT claim a tool ran without matching tool evidence. Supplied skill text is not a filesystem check.
Before planning actual research, read the relevant sections of [the complete workflow](references/research-workflow.md).
Use Pi's `read` tool with `offset` and `limit` for bounded reads.
Read domain skills by their frontmatter names with `/skill:name` or by their `SKILL.md` paths.
DO NOT treat a reference's continuous-operation example as authorization to schedule work.

## Start or resume

- [ ] Identify the research question and whether the user requests planning or execution.
- [ ] Confirm the permitted environment, resources, time budget, and stop condition.
- [ ] Read `research-state.yaml` and `findings.md` when resuming an existing project.
- [ ] Select the required domain skills and inspect their prerequisites.
- [ ] Define the baseline, metric, hypothesis, and bounded experiment protocol before execution.
- [ ] Record the protocol before results. Separate confirmatory findings from exploratory observations.

Use the existing [workspace templates](templates/) only after agreeing on the project scope.
DO NOT install packages, download models, or launch training merely because a domain example includes those actions.

## Two-loop research

The inner loop tests one approved hypothesis, checks data and baseline validity, measures outcomes, and records results.
The outer loop reviews accumulated evidence, updates `findings.md`, and chooses deeper study, broader study, a pivot, or conclusion.
Preserve negative results and uncertainty. DO NOT optimize a metric without checking what the change means.
Both loops remain inside the agreed batch and budget.
At the checkpoint, report artifact paths, findings, limitations, and the next proposed experiment. Return control.

### Pi coding agent

Execute only the agreed experiment batch. Save state before ending the session.
DO NOT invoke `/loop`, `cron.add`, or heartbeat tools unless explicitly installed and authorized.
Other-agent continuity examples remain in the complete workflow; they do not override Pi's rules.
See [Pi setup](../docs/PI.md) for command selection and installation.

## Domain routing and reports

Read the [routing guide](references/skill-routing.md) before selecting unfamiliar domain tools.
For Unsloth or LLaMA-Factory work, follow their local source gates before proposing a recipe.
For citations or paper writing, use `ml-paper-writing` and verify sources before adding references.
Use the [reporting guide](references/progress-reporting.md) for evidence-backed progress artifacts.
Consult [continuity details](references/agent-continuity.md) only when continuity was explicitly requested.
