import { resolve } from 'node:path';

// Transport completion is separate from semantic correctness of a skill answer.
export function analyzeRun({ stdout, exitCode, timedOut }) {
  const events = [];
  let ignoredLines = 0;
  for (const line of stdout.split('\n')) {
    if (!line.trim()) continue;
    try { events.push(JSON.parse(line)); }
    catch { ignoredLines++; }
  }
  const messages = events.filter(event => event.type === 'message_end' && event.message?.role === 'assistant').map(event => event.message);
  const modelErrors = messages.flatMap(message => message.errorMessage ? [message.errorMessage] : []);
  const toolCalls = events.filter(event => event.type === 'tool_execution_start').map(event => ({ name: event.toolName, args: event.args }));
  const toolErrors = events.filter(event => event.type === 'tool_execution_end' && event.isError).map(event => ({ name: event.toolName, result: event.result }));
  const lastMessage = messages.at(-1);
  const finalText = lastMessage?.content?.filter(part => part.type === 'text').map(part => part.text).join('\n') ?? '';
  const agentEnded = events.some(event => event.type === 'agent_end');
  return {
    completed: exitCode === 0 && !timedOut && agentEnded && modelErrors.length === 0 && toolErrors.length === 0 && lastMessage?.stopReason === 'stop' && finalText.trim().length > 0,
    modelErrors,
    toolErrors,
    toolCalls,
    finalText,
    agentEnded,
    ignoredLines,
    usage: messages.flatMap(message => message.usage ? [message.usage] : []),
  };
}

// Mechanical response checks do not establish the truth of the technical prose.
export function evaluateSkillRun(run, contract) {
  const analysis = analyzeRun(run);
  const countWords = text => text.trim().split(/\s+/).filter(Boolean).length;
  const failures = [];
  if (!analysis.completed) failures.push('transport-incomplete');
  if (analysis.ignoredLines) failures.push('invalid-event-stream');
  let answer;
  try { answer = JSON.parse(analysis.finalText); }
  catch { failures.push('invalid-json-answer'); }
  if (!answer || Array.isArray(answer) || typeof answer !== 'object') {
    failures.push('missing-answer-object');
  } else {
    if (answer.skill !== contract.name) failures.push('wrong-skill-name');
    if (answer.mainPath !== contract.mainPath) failures.push('wrong-main-path');
    if (answer.referencePath !== contract.referencePath) failures.push('wrong-reference-path');
    if (answer.executed !== false) failures.push('execution-not-denied');
    const keys = ['skill', 'mainPath', 'referencePath', 'purpose', 'referenceFact', 'pitfall', 'prerequisites', 'executed'];
    if (Object.keys(answer).length !== keys.length || Object.keys(answer).some(key => !keys.includes(key))) failures.push('wrong-answer-keys');
    for (const [field, cap] of Object.entries({ purpose: 8, referenceFact: 18, pitfall: 28 })) {
      if (typeof answer[field] !== 'string' || !answer[field].trim()) failures.push(`missing-${field}`);
      else if (countWords(answer[field]) > cap) failures.push(`field-word-cap-exceeded:${field}`);
    }
    if (!Array.isArray(answer.prerequisites) || !answer.prerequisites.length || answer.prerequisites.some(value => typeof value !== 'string' || !value.trim())) {
      failures.push('missing-prerequisites');
    } else {
      if (answer.prerequisites.length !== 3) failures.push('wrong-prerequisite-count');
      if (answer.prerequisites.some(value => countWords(value) > 8)) failures.push('field-word-cap-exceeded:prerequisites');
    }
  }
  const words = countWords(analysis.finalText);
  if (words > contract.maxWords) failures.push('word-cap-exceeded');
  const events = run.stdout.split('\n').flatMap(line => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  const permittedPaths = new Set([contract.mainPath, contract.referencePath].filter(Boolean).map(path => resolve(path)));
  const successfulReads = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.type !== 'tool_execution_start') continue;
    if (event.toolName !== 'read') { failures.push(`unapproved-tool:${event.toolName}`); continue; }
    const { path, limit, offset = 1 } = event.args ?? {};
    if (typeof path !== 'string' || !permittedPaths.has(resolve(path))) { failures.push('unapproved-read-path'); continue; }
    if (!Number.isInteger(limit) || limit < 1 || limit > (contract.maxReadLines ?? 80) || !Number.isInteger(offset) || offset < 1) {
      failures.push('unbounded-read'); continue;
    }
    if (resolve(path) === resolve(contract.mainPath)) {
      if (offset !== 1 || limit !== 12) { failures.push('wrong-main-read-range'); continue; }
    } else if (limit > 40) {
      failures.push('reference-read-cap-exceeded'); continue;
    }
    const end = events.slice(i + 1).find(next => next.type === 'tool_execution_end' && typeof event.toolCallId === 'string' && next.toolCallId === event.toolCallId && next.toolName === 'read');
    if (end?.isError === false && end.result?.content?.some(part => part.type === 'text' && part.text?.trim())) successfulReads.push(resolve(path));
  }
  for (const path of permittedPaths) if (!successfulReads.includes(path)) failures.push(`missing-successful-read:${path}`);
  return { ...analysis, answer, finalWords: words, successfulReads, contractFailures: [...new Set(failures)], contractPassed: failures.length === 0 };
}
