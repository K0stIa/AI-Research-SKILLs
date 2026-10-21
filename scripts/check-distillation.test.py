"""Execute only the loss function AST from the guide on tiny CPU tensors.

Requires an already-installed PyTorch. No models, downloads, training, or optimizer steps.
"""
import ast
from collections.abc import Callable
import math
import os
from pathlib import Path
import re
import unittest
from typing import cast

os.environ["CUDA_VISIBLE_DEVICES"] = ""
import torch
import torch.nn.functional as F

GUIDE = Path(__file__).resolve().parents[1] / "19-emerging-techniques/knowledge-distillation/SKILL.md"


def load_example_function(name: str) -> Callable[..., torch.Tensor]:
    for code in re.findall(r"^```python\s*\n([\s\S]*?)^```", GUIDE.read_text(), re.M):
        for node in ast.parse(code).body:
            if isinstance(node, ast.FunctionDef) and node.name == name:
                namespace: dict[str, object] = {"torch": torch, "F": F}
                exec(compile(ast.Module(body=[node], type_ignores=[]), str(GUIDE), "exec"), namespace)
                return cast(Callable[..., torch.Tensor], namespace[name])
    raise AssertionError(f"Missing example function: {name}")


class ReverseKlExample(unittest.TestCase):
    def setUp(self):
        self.loss = load_example_function("reverse_kl_loss")
        self.teacher = torch.tensor([[math.log(0.8), math.log(0.2)]], dtype=torch.float64, requires_grad=True)
        self.student = torch.tensor([[math.log(0.55), math.log(0.45)]], dtype=torch.float64, requires_grad=True)

    def test_identical_distributions_have_zero_kl(self):
        self.assertAlmostEqual(self.loss(self.teacher, self.teacher).item(), 0.0, places=10)

    def test_reverse_direction_matches_student_weighted_definition(self):
        expected = 0.55 * math.log(0.55 / 0.8) + 0.45 * math.log(0.45 / 0.2)
        self.assertAlmostEqual(self.loss(self.student, self.teacher).item(), expected, places=10)

    def test_teacher_is_detached_and_student_gets_finite_gradients(self):
        value = self.loss(self.student, self.teacher)
        value.backward()
        self.assertIsNone(self.teacher.grad)
        gradient = self.student.grad
        if gradient is None:
            self.fail("Student gradient is missing")
        else:
            self.assertTrue(torch.isfinite(gradient).all().item())
            self.assertGreater(gradient.abs().sum().item(), 0.0)

    def test_temperature_scaling_matches_the_same_objective(self):
        temperature = 2.0
        p = F.softmax(self.student / temperature, dim=-1)
        log_p = F.log_softmax(self.student / temperature, dim=-1)
        log_q = F.log_softmax(self.teacher.detach() / temperature, dim=-1)
        expected = (p * (log_p - log_q)).sum(-1).mean() * temperature ** 2
        self.assertAlmostEqual(self.loss(self.student, self.teacher, temperature).item(), expected.item(), places=10)

    def test_extreme_finite_logits_do_not_produce_nan(self):
        logits = torch.tensor([[1000.0, -1000.0]], dtype=torch.float64)
        self.assertTrue(torch.isfinite(self.loss(logits, -logits)).item())


if __name__ == "__main__":
    print(f"Tiny CPU loss tests; PyTorch {torch.__version__}; no optimizer steps.")
    unittest.main()
