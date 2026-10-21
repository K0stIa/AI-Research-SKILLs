import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateSkillRun } from './pi-verification-events.mjs';

const probes = {
  '0': 'Which scope, budget, authorization, and stopping agreements are needed before experiments?',
  '01': 'Which architectural distinction matters, and what measurement is needed before choosing a configuration?',
  '02': 'Which tokenizer artifacts must match inference, and what breaks when tokenization differs?',
  '03': 'Which parameters are trained or frozen, and what dataset or template checks precede fine-tuning?',
  '04': 'How do descriptive activation or feature observations differ from evidence of a causal effect?',
  '05': 'Which dataset invariant must be checked before processed output can be trusted?',
  '06': 'Which optimization or reward signal is used, and what failure can make its metric misleading?',
  '07': 'What does this guardrail do, and what must be evaluated before calling it safe?',
  '08': 'What training state or work is distributed, and which batch or topology invariant must hold?',
  '09': 'Which resource, environment, cost, and permission checks must precede a launch?',
  '10': 'Which numerical or runtime assumption needs checking, and which quality claim requires measurement?',
  '11': 'What evaluation input, dataset separation, and metric conditions must be checked?',
  '12': 'Which model-format and hardware compatibility checks precede serving measurements?',
  '13': 'Which identifiers and metrics must be recorded to compare runs reproducibly?',
  '14': 'Which permission and tool boundaries must an agent respect, and when must it stop?',
  '15': 'Which embedding, dimension, index, or distance assumptions must match ingestion and retrieval?',
  '16': 'What output or schema guarantee does the method offer, and what still needs validation?',
  '17': 'How are observations tied to requests, and what privacy or reproducibility fields need checking?',
  '18': 'Which modality-specific input/output contract or model-artifact mismatch must be checked?',
  '19': 'Which property does the method change or preserve, and which quality claim requires measurement?',
  '20': 'Which source evidence or artifact must be checked before using a paper, figure, or presentation?',
  '21': 'How is a brainstormed research hypothesis distinguished from a validated scientific claim?',
  '22': 'Which provenance evidence supports a research claim, and what cannot be inferred from missing data?',
};

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]);
}

export function buildSkillMatrix(root) {
  let manifest;
  try { manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')); }
  catch (error) { throw new Error(`Cannot read skill manifest: ${error.message}`, { cause: error }); }
  return manifest.pi.skills.flatMap(category => walk(resolve(root, category)).filter(file => file.endsWith('/SKILL.md')).map(mainPath => {
    const text = readFileSync(mainPath, 'utf8');
    const name = text.match(/^name: ([a-z0-9-]+)$/m)?.[1];
    if (!name) throw new Error(`Invalid skill name in ${mainPath}`);
    const linked = [...text.matchAll(/\]\((references\/[^\s)#]+\.md)(?:#[^)]*)?\)/g)].map(match => resolve(dirname(mainPath), match[1])).find(path => existsSync(path));
    const referenceDirectory = resolve(dirname(mainPath), 'references');
    const fallback = existsSync(referenceDirectory) ? walk(referenceDirectory).filter(path => path.endsWith('.md') && !path.endsWith('/legacy-entrypoint.md')).sort()[0] : undefined;
    const key = category.replace(/^\.\//, '').match(/^\d+/)?.[0];
    return { name, category, mainPath, referencePath: linked ?? fallback ?? null, probe: probes[key], maxWords: 140, maxReadLines: 80 };
  })).sort((a, b) => a.name.localeCompare(b.name));
}

function promptFor(item) {
  return `/skill:${item.name} Read-only installed-skill verification. No training, installation, downloads, paid resources, delegation, serving, or file writes.\n` +
    'Find this loaded skill\'s absolute SKILL.md path from its expansion. Make a real read call for its first 12 lines. ' +
    (item.referencePath ? `Also read at most 40 lines from ${item.referencePath.slice(dirname(item.mainPath).length + 1)}, relative to that skill directory. ` : 'No supporting Markdown reference exists; use null for referencePath. ') +
    'Use only those two files. A supplied skill expansion is not the requested filesystem read. ' +
    `Planning question: ${item.probe}\n` +
    'Final response: one bare JSON object, no Markdown fence. Keys: skill (exact frontmatter name), mainPath (absolute), referencePath (absolute or null), purpose (one sentence), referenceFact (one fact from the actual excerpt, or explain no reference), pitfall (answer the planning question), prerequisites (nonempty list of unverified environment/version/data requirements), executed (false). ' +
    'Content budgets: purpose at most 8 words; referenceFact at most 18 words; pitfall at most 28 words; exactly 3 prerequisites, each at most 8 words. Do not repeat the referenceFact in pitfall. ' +
    'Keep the entire final JSON under 140 whitespace-separated words, including keys and paths. Do not claim anything was executed or scientifically validated. State uncertainty instead of inventing APIs or results.';
}

function sourceHash(item) {
  const hash = createHash('sha256');
  for (const path of [item.mainPath, item.referencePath].filter(Boolean)) hash.update(path).update(readFileSync(path));
  return hash.digest('hex');
}

async function runCase(item, config) {
  const started = new Date().toISOString();
  const start = performance.now();
  const beforeHash = sourceHash(item);
  const args = ['--print', '--mode', 'json', '--no-session', '--no-context-files', '--no-prompt-templates', '--no-mcp', '--offline', '--no-approve', '--tools', 'read', '--model', config.model, '--thinking', 'off', '--no-extensions', promptFor(item)];
  const child = spawn(process.env.PI_BIN ?? 'pi', args, { cwd: config.workspace, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '', stderr = '', timedOut = false, spawnError;
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  child.on('error', error => { spawnError = error.message; });
  const timer = setTimeout(() => {
    timedOut = true;
    try {
      if (process.platform === 'win32') child.kill('SIGKILL');
      else process.kill(-child.pid, 'SIGKILL');
    } catch (error) { if (error.code !== 'ESRCH') stderr += `\nTermination failed: ${error.message}`; }
  }, Math.max(1, Math.min(config.timeout * 1000, config.deadline - Date.now())));
  const { exitCode, signal } = await new Promise(done => child.on('close', (exitCode, signal) => done({ exitCode, signal })));
  clearTimeout(timer);
  if (spawnError) stderr += `\n${spawnError}`;
  const analysis = evaluateSkillRun({ stdout, exitCode, timedOut }, item);
  const sourceChanged = sourceHash(item) !== beforeHash;
  if (sourceChanged) { analysis.contractFailures.push('source-changed-during-run'); analysis.contractPassed = false; }
  const result = { name: item.name, started, durationSeconds: Number(((performance.now() - start) / 1000).toFixed(2)), exitCode, signal, timedOut, sourceHash: beforeHash, sourceChanged, args, ...analysis, semanticReview: 'Technical truth requires manual comparison with the source excerpts.' };
  writeFileSync(resolve(config.output, `${item.name}.jsonl`), stdout);
  writeFileSync(resolve(config.output, `${item.name}.stderr`), stderr);
  writeFileSync(resolve(config.output, `${item.name}.result.json`), JSON.stringify(result, null, 2) + '\n');
  appendFileSync(resolve(config.output, 'progress.jsonl'), JSON.stringify({ name: item.name, completed: result.completed, contractPassed: result.contractPassed, failures: result.contractFailures, seconds: result.durationSeconds }) + '\n');
  return result;
}

async function main() {
  const [outputArg, timeoutArg = '240', concurrencyArg = '1', budgetArg = '28800', namesArg = 'all'] = process.argv.slice(2);
  const timeout = Number(timeoutArg), concurrency = Number(concurrencyArg), budget = Number(budgetArg);
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const matrix = buildSkillMatrix(root);
  const names = namesArg === 'all' ? matrix.map(item => item.name) : namesArg.split(',');
  if (!outputArg || existsSync(resolve(outputArg)) || !Number.isFinite(timeout) || timeout < 1 || timeout > 1800 || !Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4 || !Number.isFinite(budget) || budget < 1 || budget > 86400 || !names.length || new Set(names).size !== names.length || names.some(name => !matrix.some(item => item.name === name))) {
    console.error('Usage: node scripts/verify-pi-matrix.mjs NEW_OUTPUT [TIMEOUT=240] [CONCURRENCY=1] [BUDGET_SECONDS=28800] [NAMES=all]');
    console.error('Output must not exist; selected names must be unique installed-library skill names.');
    process.exitCode = 2;
    return;
  }
  const output = resolve(outputArg), workspace = resolve(output, 'workspace');
  mkdirSync(workspace, { recursive: true });
  const selected = matrix.filter(item => names.includes(item.name));
  const config = { output, workspace, timeout, concurrency, deadline: Date.now() + budget * 1000, model: process.env.PI_LIVE_MODEL ?? 'local-llamacpp/qwen3.8-35b-a3b-mtp-256k' };
  let revision;
  try { revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { revision = 'unavailable'; }
  writeFileSync(resolve(output, 'matrix.json'), JSON.stringify({ revision, model: config.model, timeout, concurrency, budgetSeconds: budget, selected, totalLibrarySkills: matrix.length }, null, 2) + '\n');
  const results = [];
  let next = 0;
  async function worker() {
    while (next < selected.length && Date.now() < config.deadline) {
      const item = selected[next++];
      results.push(await runCase(item, config));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const workspaceMutated = readdirSync(workspace).length !== 0;
  const summary = { revision, totalLibrarySkills: matrix.length, selected: selected.length, attempted: results.length, completed: results.filter(item => item.completed).length, contractPassed: results.filter(item => item.contractPassed).length, workspaceMutated, libraryComplete: selected.length === matrix.length && results.length === matrix.length && results.every(item => item.completed), passed: results.length === selected.length && results.every(item => item.contractPassed) && !workspaceMutated, missing: selected.filter(item => !results.some(result => result.name === item.name)).map(item => item.name), failures: results.filter(item => !item.contractPassed).map(item => ({ name: item.name, failures: item.contractFailures, timedOut: item.timedOut })), semanticReviewRequired: true };
  writeFileSync(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
  process.exitCode = summary.passed ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await main(); }
  catch (error) { console.error(`Matrix verification failed: ${error.message}`); process.exitCode = 1; }
}
