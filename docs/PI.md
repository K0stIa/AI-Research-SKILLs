# Pi setup

This repository is a skills-only Pi package. Its manifest exposes all 98 research skills across 23 categories.
References, scripts, examples, and templates stay beside their original skills. No extension code loads during installation.

## Install

From a local checkout:

```bash
pi install /absolute/path/to/AI-Research-SKILLs
```

Use `pi install -l /absolute/path/to/AI-Research-SKILLs` for project scope instead of personal scope.
Run `/reload` in an existing Pi session after installation or edits.

After publishing the `pi` branch to GitHub, install that branch with:

```bash
pi install git:github.com/Orchestra-Research/AI-Research-SKILLs@pi
```

The branch command requires a remote `pi` branch. A local commit alone does not publish it.
Use your fork's URL if you publish there instead.

## Select a skill

Pi advertises skill names and descriptions, then reads full instructions when needed.
Use `/skill:name` to load a specific skill. Use the `name` field in its YAML frontmatter, not its category directory.

For the research orchestration skill:

```text
/skill:orchestra-autoresearch Plan a small CPU-only experiment. Propose budget and stopping criteria before execution.
```

For another skill, open its `SKILL.md`, inspect `name`, then invoke `/skill:<that-name>`.
Relative reference and script paths resolve from that skill's directory, not the current research project.

The `orchestra-autoresearch` name avoids the separate Feynman `autoresearch` skill. Both can remain installed.
The bare `autoresearch` name is not an Orchestra alias. Update saved prompts to use the new name.
Use `pi config` to disable unwanted skills. Pi keeps the first discovered definition when other names collide.

## Runtime differences

- Use Pi's available read, edit, write, and shell tools instead of literal Claude Code tool names.
- `/plugin`, `/loop`, OpenClaw cron tools, and heartbeat scheduling are not built-in Pi requirements.
- Load related skills through their frontmatter names or read their `SKILL.md` files directly.
- Use available research tools. Do not assume Exa, browser tools, or MCP servers are installed.
- Report missing capabilities instead of claiming a tool ran.
- Install domain dependencies only for selected work. The package does not install PyTorch, CUDA, model weights, or datasets.

Pi autoresearch runs bounded experiment batches. Agree on scope, environment, compute budget, and stopping conditions first.
Save results and return control at each checkpoint. Scheduling, delegation, paid compute, publishing, pushing, and deletion need explicit authorization.
Existing framework instructions and code examples remain upstream guidance, not verified compatibility guarantees for every library version.

## Validate

Requires Node.js 18 or later. No npm dependencies are needed for package checks.

```bash
npm test
bash scripts/check-inventory.sh
npm pack --dry-run
```

Tests check category coverage, skill inventory, unique names, frontmatter limits, and bounded Pi autoresearch instructions.
They do not run model training, provision cloud resources, or verify every upstream code example.
After installation, inspect Pi's startup diagnostics and confirm `/skill:orchestra-autoresearch` is available.
