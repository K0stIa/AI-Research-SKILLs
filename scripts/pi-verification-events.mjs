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
