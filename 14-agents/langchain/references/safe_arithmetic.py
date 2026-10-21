"""Copy beside agent code for bounded arithmetic, not Python evaluation."""
import ast
from collections.abc import Callable
import math
import operator
from typing import cast

Number = int | float
_OPERATORS: dict[type[ast.operator], Callable[[Number, Number], Number]] = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
}


def _checked(value: Number) -> Number:
    if type(value) not in (int, float):
        raise ValueError("Only integer and floating-point numbers are allowed.")
    if isinstance(value, int):
        if value.bit_length() > 256:
            raise ValueError("Integer exceeds the arithmetic limit.")
    elif not math.isfinite(value):
        raise ValueError("Non-finite results are not allowed.")
    return value


def _evaluate(node: ast.AST) -> Number:
    if isinstance(node, ast.Constant):
        return _checked(cast(Number, node.value))
    if isinstance(node, ast.UnaryOp) and type(node.op) in (ast.UAdd, ast.USub):
        value = _evaluate(node.operand)
        return _checked(value if isinstance(node.op, ast.UAdd) else -value)
    if isinstance(node, ast.BinOp) and type(node.op) in _OPERATORS:
        return _checked(_OPERATORS[type(node.op)](_evaluate(node.left), _evaluate(node.right)))
    raise ValueError("Only numbers, parentheses, and +, -, *, / are allowed.")


def calculate(expression: str) -> str:
    """Return bounded arithmetic as text; reject calls, names, and attributes."""
    if not isinstance(expression, str) or len(expression) > 200:
        raise ValueError("Expression must be text of at most 200 characters.")
    try:
        tree = ast.parse(expression, mode="eval")
        if sum(1 for _ in ast.walk(tree)) > 64:
            raise ValueError("Expression exceeds the syntax-tree limit.")
        return str(_evaluate(tree.body))
    except (SyntaxError, ZeroDivisionError, OverflowError) as error:
        raise ValueError("Invalid arithmetic expression.") from error
