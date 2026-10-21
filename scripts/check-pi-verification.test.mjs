import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { analyzeRun } from './pi-verification-events.mjs';

function run(messages, overrides = {}) {
  return analyzeRun({
    exitCode: 0,
    timedOut: false,
    stdout: [...messages.map(message => ({ type: 'message_end', message: { role: 'assistant', ...message } })), { type: 'agent_end' }].map(event => JSON.stringify(event)).join('\n'),
    ...overrides,
  });
}
const text = [{ type: 'text', text: 'Verified answer.' }];

test('the installed matrix covers all 98 skills and cannot pass missing or overwritten evidence', async () => {
  const { buildSkillMatrix } = await import('./verify-pi-matrix.mjs');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const matrix = buildSkillMatrix(root);
  assert.equal(matrix.length, 98);
  assert.equal(new Set(matrix.map(item => item.name)).size, 98);
  for (const item of matrix) {
    assert.ok(existsSync(item.mainPath));
    assert.ok(item.referencePath === null || existsSync(item.referencePath));
    assert.ok(item.probe.length > 30);
  }
  assert.match(matrix.find(item => item.name === 'unsloth').referencePath, /qlora-workflow\.md$/);
  const directory = mkdtempSync(join(tmpdir(), 'pi-matrix-fixture-'));
  try {
    const capture = join(directory, 'argv.json');
    const fake = join(directory, 'fake-pi.cjs');
    writeFileSync(fake, '#!/usr/bin/env node\nconst fs = require("node:fs"); fs.writeFileSync(process.env.CAPTURE, JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd() })); console.log(JSON.stringify({ type: "agent_end" }));\n', { mode: 0o755 });
    const output = join(directory, 'evidence');
    const args = [fileURLToPath(new URL('./verify-pi-matrix.mjs', import.meta.url)), output, '2', '1', '30', matrix[0].name];
    const options = { encoding: 'utf8', timeout: 15_000, env: { ...process.env, PI_BIN: fake, CAPTURE: capture } };
    const result = spawnSync(process.execPath, args, options);
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stderr);
    const summary = JSON.parse(readFileSync(join(output, 'summary.json'), 'utf8'));
    assert.equal(summary.libraryComplete, false);
    assert.equal(summary.passed, false);
    assert.equal(summary.attempted, 1);
    const recorded = JSON.parse(readFileSync(capture, 'utf8'));
    assert.ok(recorded.args.includes('--no-session'));
    assert.ok(recorded.args.includes('--no-extensions'));
    assert.ok(!recorded.args.includes('-e') && !recorded.args.includes('--no-skills'));
    assert.ok(recorded.cwd.startsWith(output));
    const saved = readFileSync(join(output, `${matrix[0].name}.jsonl`), 'utf8');
    assert.equal(spawnSync(process.execPath, args, options).status, 2);
    assert.equal(readFileSync(join(output, `${matrix[0].name}.jsonl`), 'utf8'), saved);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('skill contracts require correct bounded successful reads and valid response evidence', async () => {
  const { evaluateSkillRun } = await import('./pi-verification-events.mjs');
  assert.equal(typeof evaluateSkillRun, 'function');
  const contract = { name: 'fixture-skill', mainPath: '/fixture/SKILL.md', referencePath: '/fixture/references/guide.md', maxWords: 140 };
  const answer = { skill: contract.name, mainPath: contract.mainPath, referencePath: contract.referencePath, purpose: 'Test a source-backed workflow.', referenceFact: 'Verify the input schema.', pitfall: 'Unknown versions can change APIs.', prerequisites: ['Installed version is unverified.'], executed: false };
  const reads = [contract.mainPath, contract.referencePath].flatMap((path, i) => [
    { type: 'tool_execution_start', toolCallId: `read-${i}`, toolName: 'read', args: { path, limit: 40 } },
    { type: 'tool_execution_end', toolCallId: `read-${i}`, toolName: 'read', isError: false, result: { content: [{ type: 'text', text: 'Source excerpt.' }] } },
  ]);
  function evaluate(overrides = {}, evidence = reads, options = {}) {
    const stdout = [...evidence, { type: 'message_end', message: { role: 'assistant', stopReason: 'stop', content: [{ type: 'text', text: JSON.stringify({ ...answer, ...overrides }) }] } }, { type: 'agent_end' }].map(e => JSON.stringify(e)).join('\n');
    return evaluateSkillRun({ stdout, exitCode: 0, timedOut: false }, { ...contract, ...options });
  }
  assert.equal(evaluate().contractPassed, true);
  assert.equal(evaluate({}, [], {}).contractPassed, false, 'narration is not a read');
  assert.equal(evaluate({}, reads.filter(e => e.type !== 'tool_execution_end')).contractPassed, false, 'starts are not successful reads');
  assert.equal(evaluate({ skill: 'wrong-name' }).contractPassed, false);
  assert.equal(evaluate({ mainPath: '/other/SKILL.md' }).contractPassed, false);
  assert.equal(evaluate({ executed: true }).contractPassed, false);
  assert.equal(evaluate({ prerequisites: [] }).contractPassed, false);
  assert.equal(evaluate({ purpose: '' }).contractPassed, false);
  assert.equal(evaluate({}, reads, { maxWords: 1 }).contractPassed, false);
  assert.equal(evaluate({}, reads.map(e => e.args ? { ...e, args: { ...e.args, limit: 2000 } } : e)).contractPassed, false);
  assert.equal(evaluate({}, [...reads, { type: 'tool_execution_start', toolCallId: 'bad', toolName: 'bash', args: { command: 'echo unsafe' } }]).contractPassed, false);
  assert.equal(evaluate({}, reads.map(e => e.args ? { ...e, args: { ...e.args, path: '/other/file.md' } } : e)).contractPassed, false);
});

test('live CLI rejects inherited object properties as scenario names before launching Pi', () => {
  const directory = mkdtempSync(join(tmpdir(), 'pi-invalid-scenario-'));
  try {
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('./verify-pi-live.mjs', import.meta.url)), directory, 'constructor', '0.1'], {
      encoding: 'utf8',
      timeout: 10_000,
      env: { ...process.env, PI_BIN: join(directory, 'not-installed') },
    });
    assert.ifError(result.error);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /Usage:/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('a completed assistant response is necessary for a successful run', () => {
  assert.equal(run([{ stopReason: 'stop', content: text }]).completed, true);
  assert.equal(run([]).completed, false);
  assert.equal(run([{ stopReason: 'toolUse', content: text }]).completed, false);
});

test('provider errors fail even when Pi exits zero', () => {
  const result = run([{ stopReason: 'error', errorMessage: 'Model not supported', content: [] }]);
  assert.equal(result.completed, false);
  assert.deepEqual(result.modelErrors, ['Model not supported']);
});

test('a prior answer cannot hide a later provider error or timeout', () => {
  assert.equal(run([{ stopReason: 'stop', content: text }], { timedOut: true }).completed, false);
  assert.equal(run([{ stopReason: 'stop', content: text }, { stopReason: 'error', errorMessage: 'Disconnected', content: [] }]).completed, false);
});

test('tool errors and missing agent completion fail verification', () => {
  const stdout = [
    { type: 'message_end', message: { role: 'assistant', stopReason: 'stop', content: text } },
    { type: 'tool_execution_end', toolName: 'read', isError: true },
    { type: 'agent_end' },
  ].map(event => JSON.stringify(event)).join('\n');
  assert.equal(run([], { stdout }).completed, false);
  assert.equal(run([], { stdout: JSON.stringify({ type: 'message_end', message: { role: 'assistant', stopReason: 'stop', content: text } }) }).completed, false);
});

test('read evidence and usage survive parsing without the full event stream', () => {
  const stdout = [
    { type: 'tool_execution_start', toolName: 'read', args: { path: '/skill/references/guide.md', limit: 40 } },
    { type: 'message_end', message: { role: 'assistant', stopReason: 'stop', content: text, usage: { input: 10, output: 4, cacheRead: 3 } } },
    { type: 'agent_end' },
  ].map(event => JSON.stringify(event)).join('\n');
  const result = run([], { stdout });
  assert.equal(result.completed, true);
  assert.equal(result.finalText, 'Verified answer.');
  assert.equal(result.toolCalls[0].args.limit, 40);
  assert.equal(result.usage[0].cacheRead, 3);
});
