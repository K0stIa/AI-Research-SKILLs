import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const categories = readdirSync(root).filter(name => /^\d+-/.test(name) && statSync(join(root, name)).isDirectory()).sort();

function skillFiles(directory) {
  if (existsSync(join(directory, 'SKILL.md'))) return [join(directory, 'SKILL.md')];
  return readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .flatMap(entry => skillFiles(join(directory, entry.name)));
}

const files = categories.flatMap(category => skillFiles(join(root, category)));

test('Pi manifest exposes every research category once', () => {
  assert.ok(manifest.keywords.includes('pi-package'));
  assert.equal(manifest.license, 'MIT');
  assert.deepEqual(Object.keys(manifest.pi), ['skills']);
  assert.deepEqual(manifest.pi.skills.map(path => path.replace(/^\.\//, '')).sort(), categories);
  assert.equal(new Set(manifest.pi.skills).size, categories.length);
});

test('all 98 research skills remain bundled with their supporting files', () => {
  assert.equal(files.length, 98);
  assert.equal(categories.length, 23);
  assert.deepEqual(manifest.files.filter(path => /^\d+-/.test(path)).map(path => path.replace(/\/$/, '')).sort(), categories);
  for (const category of categories) {
    // Pi loads Markdown files at a category root too. Only SKILL.md belongs there.
    for (const entry of readdirSync(join(root, category))) {
      assert.ok(!entry.endsWith('.md') || entry === 'SKILL.md', `Unexpected root Markdown: ${category}/${entry}`);
    }
  }
});

test('skills have unique Pi-compatible names and descriptions', () => {
  const names = new Set();
  for (const path of files) {
    const text = readFileSync(path, 'utf8');
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
    assert.ok(frontmatter, `Missing frontmatter: ${path}`);
    // These upstream fields are single-line plain YAML scalars.
    const name = frontmatter.match(/^name: (.+)$/m)?.[1].trim();
    const description = frontmatter.match(/^description: (.+)$/m)?.[1].trim();
    assert.match(name ?? '', /^[a-z0-9]+(?:-[a-z0-9]+)*$/, path);
    assert.ok(name.length <= 64, path);
    assert.ok(description && description.length <= 1024, path);
    assert.ok(!names.has(name), `Duplicate skill name: ${name}`);
    names.add(name);
  }
});

test('every local Markdown reference in main skills resolves to useful content', () => {
  const missing = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8').replace(/^\s*(```|~~~)[\s\S]*?^\s*\1[^\n]*$/gm, '');
    for (const match of text.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
      const target = match[1].replace(/^<|>$/g, '');
      if (/^(?:#|[a-z][a-z0-9+.-]*:)/i.test(target)) continue;
      const localPath = decodeURIComponent(target.split(/[?#]/)[0]);
      if (!localPath || /[$<>]/.test(localPath)) continue;
      const absolute = resolve(dirname(file), localPath);
      if (!existsSync(absolute)) missing.push(`${file}: ${localPath}`);
      else if (statSync(absolute).isFile()) assert.ok(statSync(absolute).size > 80, absolute);
    }
  }
  assert.deepEqual(missing, [], 'Broken local skill references');
});

test('Orchestra research command coexists with other autoresearch packages', () => {
  const text = readFileSync(join(root, '0-autoresearch-skill/SKILL.md'), 'utf8');
  assert.match(text, /^name: orchestra-autoresearch$/m);
  for (const file of ['README.md', 'docs/PI.md']) {
    const content = readFileSync(join(root, file), 'utf8');
    assert.ok(content.includes('/skill:orchestra-autoresearch'), file);
    assert.ok(!content.includes('/skill:autoresearch'), file);
  }
});

test('Unsloth entrypoint grounds QLoRA guidance before offering a recipe', () => {
  const text = readFileSync(join(root, '03-fine-tuning/unsloth/SKILL.md'), 'utf8');
  assert.doesNotMatch(text, /patterns will be added|Use `view`|2-5x|50-80%/i);
  assert.match(text, /MUST read.*references\/qlora-workflow\.md/);
  assert.match(text, /frozen.*base weights/i);
  assert.match(text, /trainable.*adapter/i);
  assert.match(text, /unverified/i);
  assert.ok(existsSync(join(root, '03-fine-tuning/unsloth/references/qlora-workflow.md')));
});

test('LLaMA-Factory entrypoint requires versioned SFT and dataset checks', () => {
  const text = readFileSync(join(root, '03-fine-tuning/llama-factory/SKILL.md'), 'utf8');
  assert.doesNotMatch(text, /patterns will be added|Use `view`|100\+ models|2\/3\/4\/5\/6\/8-bit/i);
  assert.match(text, /MUST read.*references\/sft-workflow\.md/);
  assert.match(text, /dataset_info\.json/);
  assert.match(text, /chat template/i);
  assert.match(text, /frozen.*base weights/i);
  assert.match(text, /trainable.*adapter/i);
  assert.match(text, /unverified/i);
  assert.ok(existsSync(join(root, '03-fine-tuning/llama-factory/references/sft-workflow.md')));
});

test('autoresearch defines bounded Pi operation without mandatory scheduling', () => {
  const text = readFileSync(join(root, '0-autoresearch-skill/SKILL.md'), 'utf8');
  assert.ok(text.includes('## Pi execution rules'));
  assert.ok(text.includes('### Pi coding agent'));
  assert.ok(text.includes('DO NOT create background loops, cron jobs, or subagents without explicit user authorization.'));
  assert.ok(text.includes('MUST stop at the agreed budget or checkpoint.'));
});
