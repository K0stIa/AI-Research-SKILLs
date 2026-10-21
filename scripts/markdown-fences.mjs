// Dependency-free scanner for ordinary CommonMark fenced blocks (up to three-space indentation).
// Container/list/blockquote parsing is outside this scanner's scope.
export function fencedBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let active;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (active) {
      const close = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/)?.[1];
      if (close && close[0] === active.marker[0] && close.length >= active.marker.length) {
        blocks.push({ language: active.language, line: active.line, endLine: index + 1, code: active.code.join('\n'), closed: true });
        active = undefined;
      } else {
        const indentation = line.match(/^ {0,3}/)[0].length;
        active.code.push(line.slice(Math.min(active.indent, indentation)));
      }
      continue;
    }
    const opening = line.match(/^( {0,3})(`{3,}|~{3,})(.*)$/);
    if (!opening || (opening[2][0] === '`' && opening[3].includes('`'))) continue;
    active = { marker: opening[2], indent: opening[1].length, language: opening[3].trim().split(/\s+/)[0].toLowerCase(), line: index + 1, code: [] };
  }
  if (active) blocks.push({ language: active.language, line: active.line, endLine: lines.length, code: active.code.join('\n'), closed: false });
  return blocks;
}

export function withoutFencedBlocks(text) {
  const lines = text.split(/\r?\n/);
  for (const block of fencedBlocks(text)) lines.fill('', block.line - 1, block.endLine);
  return lines.join('\n');
}
