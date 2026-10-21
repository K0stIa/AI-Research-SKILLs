import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { fencedBlocks, withoutFencedBlocks } from './markdown-fences.mjs';

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
const markdownFiles = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? markdownFiles(join(directory, entry.name)) : entry.name.endsWith('.md') ? [join(directory, entry.name)] : []);
const allMarkdown = categories.flatMap(category => markdownFiles(join(root, category)));

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

test('Markdown fence parsing respects longer closers, nested examples, tilde fences, and indentation', async () => {
  const { fencedBlocks } = await import('./markdown-fences.mjs');
  const sample = '````text\n```python\nnot Python\n```\n````\n```python title="example"\nx = 1\n````\n  ~~~py\n  y = 2\n  ~~~~\n```python\nz = 3';
  const blocks = fencedBlocks(sample);
  assert.deepEqual(blocks.map(item => [item.language, item.code, item.closed]), [
    ['text', '```python\nnot Python\n```', true], ['python', 'x = 1', true], ['py', 'y = 2', true], ['python', 'z = 3', false],
  ]);
  assert.deepEqual(blocks.map(item => item.line), [1, 6, 9, 12]);
});

test('Python-tagged examples in all packaged Markdown parse without importing dependencies', () => {
  const snippets = allMarkdown.flatMap(file => {
    const text = readFileSync(file, 'utf8');
    return fencedBlocks(text).filter(block => ['python', 'py', 'python3'].includes(block.language)).map(block => ({ file: file.slice(root.length + 1), line: block.line, code: block.code }));
  });
  const parser = 'import ast,json,sys\nerrors=[]\nfor item in json.load(sys.stdin):\n try: ast.parse(item["code"])\n except SyntaxError as e: errors.append({"file":item["file"],"line":item["line"],"error":e.msg})\nprint(json.dumps(errors))\n';
  const result = spawnSync(process.env.PYTHON_BIN ?? 'python3', ['-I', '-S', '-c', parser], { input: JSON.stringify(snippets), encoding: 'utf8', timeout: 30_000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(snippets.length > 3500, 'Do not silently skip supporting example coverage');
  assert.deepEqual(JSON.parse(result.stdout), [], 'Invalid Python examples or incorrect code-fence languages');
});

test('skills with reproduced task-contract failures state read and response boundaries', () => {
  const reproduced = ['ara-compiler', 'audiocraft-audio-generation', 'chroma', 'clip', 'constitutional-ai', 'distributed-llm-pretraining-torchtitan', 'evaluating-llms-harness', 'fine-tuning-with-trl', 'huggingface-accelerate', 'huggingface-tokenizers', 'knowledge-distillation', 'lambda-labs-gpu-cloud'];
  for (const name of reproduced) {
    const file = files.find(path => readFileSync(path, 'utf8').includes(`\nname: ${name}\n`));
    assert.ok(file, name);
    const text = readFileSync(file, 'utf8');
    const rules = text.match(/## Pi task contract\n([\s\S]*?)(?=\n#|$)/)?.[1] ?? '';
    assert.match(rules, /actual bounded `read` calls/, name);
    assert.match(rules, /expansion is not filesystem evidence/, name);
    assert.match(rules, /response format and word limit/, name);
    assert.match(rules, /without matching tool results/, name);
  }
});

test('both README category tables match the actual 98-skill inventory', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  const summaryText = readme.split('<summary><b>View All 23 Categories</b></summary>')[1]?.split('</details>')[0] ?? '';
  const detailText = readme.split('### All 23 Categories (98 Skills)')[1]?.split('<details>')[0] ?? '';
  const summary = new Map([...summaryText.matchAll(/\*\*([^*]+)\*\*\s*\((\d+)\)/g)].map(match => [match[1], Number(match[2])]));
  const detail = new Map(detailText.split('\n').map(line => line.replaceAll('**', '').split('|').map(cell => cell.trim())).filter(cells => cells.length > 3 && /^\d+$/.test(cells[2])).map(cells => [cells[1], Number(cells[2])]));
  const labels = [['0', 'Autoresearch'], ['01', 'Model Architecture'], ['02', 'Tokenization'], ['03', 'Fine-Tuning'], ['04', 'Mech Interp'], ['05', 'Data Processing'], ['06', 'Post-Training'], ['07', 'Safety & Alignment', 'Safety'], ['08', 'Distributed Training', 'Distributed'], ['09', 'Infrastructure'], ['10', 'Optimization'], ['11', 'Evaluation'], ['12', 'Inference'], ['13', 'MLOps'], ['14', 'Agents'], ['15', 'RAG'], ['16', 'Prompt Engineering', 'Prompt Eng'], ['17', 'Observability'], ['18', 'Multimodal'], ['19', 'Emerging Techniques', 'Emerging'], ['20', 'ML Paper Writing'], ['21', 'Ideation'], ['22', 'Agent-Native Research Artifact']];
  assert.equal(summary.size, 23);
  assert.equal(detail.size, 23);
  const expected = labels.map(([prefix]) => {
    const category = categories.find(name => name.startsWith(`${prefix}-`));
    const count = skillFiles(join(root, category)).length;
    return [prefix, count, count];
  });
  assert.deepEqual(labels.map(([prefix, title, alias = title]) => [prefix, summary.get(title), detail.get(alias)]), expected);
});

test('all skill entrypoints fit a bounded prompt-expansion budget', () => {
  const oversized = files.filter(file => statSync(file).size > 50_000).map(file => ({ file, bytes: statSync(file).size }));
  assert.deepEqual(oversized, [], 'Move scraped manuals into references instead of expanding them for every invocation');
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
    const text = withoutFencedBlocks(readFileSync(file, 'utf8'));
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

test('local links in all packaged Markdown references resolve, not only main skills', () => {
  const missing = [];
  for (const file of allMarkdown) {
    const text = withoutFencedBlocks(readFileSync(file, 'utf8')).replace(/`[^`\n]+`/g, '');
    for (const match of text.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
      const target = match[1].replace(/^<|>$/g, '');
      if (/^(?:#|[a-z][a-z0-9+.-]*:)/i.test(target)) continue;
      const local = decodeURIComponent(target.split(/[?#]/)[0]);
      if (!local || /[$<>]/.test(local)) continue;
      if (!existsSync(resolve(dirname(file), local))) missing.push(`${file.slice(root.length + 1)} -> ${local}`);
    }
  }
  assert.deepEqual(missing, [], 'Broken links in supporting documentation');
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

test('LLaMA-Factory distinguishes Alpaca source columns from response mapping roles', () => {
  const guide = readFileSync(join(root, '03-fine-tuning/llama-factory/references/sft-workflow.md'), 'utf8');
  for (const column of ['instruction', 'input', 'output']) assert.ok(guide.includes(`\`${column}\``), column);
  assert.match(guide, /`response`.*mapping.*not.*default/);
});

test('fine-tuning references separate bit width from quantization format and actual tensor dtype', () => {
  for (const guide of ['unsloth/references/qlora-workflow.md', 'llama-factory/references/sft-workflow.md']) {
    const text = readFileSync(join(root, '03-fine-tuning', guide), 'utf8');
    assert.match(text, /not.*INT4/);
    assert.match(text, /NF4/);
    assert.match(text, /inspect.*dtype/i);
  }
});

test('distillation guidance names forward and reverse KL in the correct direction', () => {
  const text = readFileSync(join(root, '19-emerging-techniques/knowledge-distillation/SKILL.md'), 'utf8');
  assert.match(text, /Forward KL: KL\(Teacher \|\| Student\)/);
  assert.match(text, /Reverse KL: KL\(Student \|\| Teacher\)/);
  assert.doesNotMatch(text, /reverse_kl = -\(p_teacher \* log_p_student\)/);
  assert.match(text, /unshifted causal-LM labels/);
  assert.match(text, /mask.*soft.*hard/i);
});

test('paper-writing prioritizes citation evidence over template discovery', () => {
  const text = readFileSync(join(root, '20-ml-paper-writing/ml-paper-writing/SKILL.md'), 'utf8');
  const gate = text.match(/## Pi citation gate\n([\s\S]*?)(?=\n## )/)?.[1] ?? '';
  assert.match(gate, /MUST read.*references\/citation-workflow\.md/);
  assert.match(gate, /DO NOT inspect templates/);
  assert.match(gate, /unverified/i);
  assert.match(gate, /\[CITATION NEEDED\]/);
  assert.match(gate, /unavailable/i);
  assert.doesNotMatch(text, /~40% error rate/);
});

test('research entrypoint stays bounded while preserving the complete workflow reference', () => {
  const text = readFileSync(join(root, '0-autoresearch-skill/SKILL.md'), 'utf8');
  assert.ok(Buffer.byteLength(text) < 7000, 'Identity and routing requests must not load the complete research manual');
  assert.match(text, /DO NOT.*identity/);
  assert.match(text, /references\/research-workflow\.md/);
  const workflow = readFileSync(join(root, '0-autoresearch-skill/references/research-workflow.md'), 'utf8');
  assert.match(workflow, /## The Inner Loop/);
  assert.match(workflow, /## The Outer Loop/);
  assert.match(workflow, /## Git Protocol/);
  assert.ok(Buffer.byteLength(workflow) > 15000, 'Preserve detailed guidance, not a placeholder');
});

test('research identity checks do not invent filesystem verification', () => {
  const text = readFileSync(join(root, '0-autoresearch-skill/SKILL.md'), 'utf8');
  assert.match(text, /MUST perform.*requested.*read/);
  assert.match(text, /DO NOT claim.*tool.*without.*evidence/);
});

test('autoresearch defines bounded Pi operation without mandatory scheduling', () => {
  const text = readFileSync(join(root, '0-autoresearch-skill/SKILL.md'), 'utf8');
  assert.ok(text.includes('## Pi execution rules'));
  assert.ok(text.includes('### Pi coding agent'));
  assert.ok(text.includes('DO NOT create background loops, cron jobs, or subagents without explicit user authorization.'));
  assert.ok(text.includes('MUST stop at the agreed budget or checkpoint.'));
});
