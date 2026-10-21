import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const demo = fileURLToPath(new URL('../demos/scientific-plotting-demo/figures/gen_fig_andes_architecture_gemini.py', import.meta.url));

test('optional Gemini demo explains a missing SDK without calling an API', () => {
  // -S excludes site-packages even when the operator has the optional SDK installed.
  const result = spawnSync('python3', ['-S', demo], {
    encoding: 'utf8',
    env: { ...process.env, GEMINI_API_KEY: '' },
    timeout: 10_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Optional dependency missing: install google-genai/);
  assert.doesNotMatch(result.stderr, /Traceback/);
});
