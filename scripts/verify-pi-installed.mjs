import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [coreArg, outputArg] = process.argv.slice(2);
if (!coreArg || !outputArg) {
  console.error('Usage: node scripts/verify-pi-installed.mjs PI_DIST_CORE OUTPUT_JSON');
  process.exit(2);
}
const core = path.resolve(coreArg);
const { DefaultResourceLoader } = await import(pathToFileURL(path.join(core, 'resource-loader.js')).href);
const { SettingsManager } = await import(pathToFileURL(path.join(core, 'settings-manager.js')).href);
const { loadSkillsFromDir } = await import(pathToFileURL(path.join(core, 'skills.js')).href);
const agentDir = process.env.PI_CODING_AGENT_DIR ?? path.join(process.env.HOME, '.pi', 'agent');
const categories = fs.readdirSync(root).filter(name => /^\d+-/.test(name));
const expected = categories.flatMap(name => loadSkillsFromDir({ dir: path.join(root, name), source: 'path' }).skills);
assert.equal(expected.length, 98);
const sameFile = (left, right) => Boolean(left && right) && fs.realpathSync(left) === fs.realpathSync(right);
const results = [];
for (const cwd of ['/tmp', path.dirname(root), root]) {
  const loader = new DefaultResourceLoader({ cwd, agentDir, settingsManager: SettingsManager.create(cwd, agentDir), noExtensions: true, noContextFiles: true, noThemes: true, noPromptTemplates: true });
  await loader.reload();
  const { skills, diagnostics } = loader.getSkills();
  const byName = new Map(skills.map(skill => [skill.name, skill]));
  const active = expected.filter(skill => sameFile(byName.get(skill.name)?.filePath, skill.filePath));
  const shadowed = expected.filter(skill => byName.has(skill.name) && !sameFile(byName.get(skill.name).filePath, skill.filePath)).map(skill => ({ name: skill.name, expected: skill.filePath, actual: byName.get(skill.name).filePath }));
  const missing = expected.filter(skill => !byName.has(skill.name)).map(skill => skill.name);
  const feynman = byName.get('autoresearch')?.filePath;
  const feynmanPreserved = Boolean(feynman && /@companion-ai\/feynman\/skills\/autoresearch\/SKILL\.md$/.test(feynman));
  results.push({ cwd, totalSkills: skills.length, orchestraActive: active.length, shadowed, missing, feynman, feynmanPreserved, diagnostics });
}
const output = path.resolve(outputArg);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ root, expected: expected.length, results }, null, 2) + '\n');
console.log(JSON.stringify({ output, results: results.map(({ diagnostics, ...result }) => ({ ...result, diagnosticCount: diagnostics.length })) }, null, 2));
assert.ok(results.every(result => result.orchestraActive === 98 && result.shadowed.length === 0 && result.missing.length === 0 && result.feynmanPreserved), 'Installed Orchestra/Feynman discovery failed; inspect evidence JSON');
