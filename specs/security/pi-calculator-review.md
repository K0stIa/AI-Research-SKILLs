# Focused calculator security review

## Scope and verdict

Self-review of `caf3e67..82409b9`, limited to the LangChain calculator examples and their new helper. This is not a repository-wide or independent security audit.

**Confirmed documentation defect, repaired:** HIGH, code injection, CWE-95, confidence 10/10. Exposure occurs if a user copies the former example into a running agent; the verification matrix itself used read-only tools.

## Input to sink

- `14-agents/langchain/SKILL.md`: model-supplied tool argument reached `Tool.func`, which called Python expression evaluation.
- `14-agents/langchain/references/agents.md`: `calculator(expression)` evaluated that argument with normal built-ins available.

The benign regression expression `__import__('builtins').len([1])` completed without rejection in the old implementation. It must now raise `ValueError`. No payload invoked a shell, accessed secrets, wrote files, or contacted a network.

## Repair and evidence

- Failing tests: `caf3e67`; implementation: `82409b9`.
- Both examples import `calculate` from the packaged `references/safe_arithmetic.py`, with explicit copy/setup instructions.
- The helper accepts numeric constants, parentheses, unary signs, and addition, subtraction, multiplication, and division only.
- It rejects calls, names, attributes, containers, booleans, exponentiation, and non-finite results.
- Limits: 200 input characters, 64 AST nodes, and 256-bit integer values. Integer multiplication can briefly produce at most twice that bit width before rejection.
- Tests retain ordinary arithmetic and reject benign code-access probes, excessive work, oversized integers, invalid syntax, and division by zero.

Raw red/green logs and isolated revision replay remain under the host evidence root referenced by the exhaustive verification report.

## Limits

LangChain/provider integration and tool-error handling remain version-dependent and unexecuted. This helper is not a general-purpose Python sandbox. Other examples and security categories were not audited by this focused review.
