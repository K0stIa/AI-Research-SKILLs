import assert from 'node:assert/strict';
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
