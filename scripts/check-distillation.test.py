"""Check bounded numerical/configuration examples without loading models.

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


class WandbValueSpaceExample(unittest.TestCase):
    def stops(self, accuracy: float, best: float) -> bool:
        path = GUIDE.parents[2] / "13-mlops/weights-and-biases/references/sweeps.md"
        section = path.read_text().split("### Custom Termination", 1)[1].split("\n##", 1)[0]
        match = re.search(r"```python\n([\s\S]*?)```", section)
        if match is None:
            raise AssertionError("Missing early-stop example")
        for node in ast.walk(ast.parse(match[1])):
            if isinstance(node, ast.If) and any(isinstance(item, ast.Constant) and item.value == "Early stop: No improvement" for item in ast.walk(node)):
                code = compile(ast.Expression(body=node.test), str(path), "eval")
                return bool(eval(code, {"epoch": 11, "val_acc": accuracy, "best_acc": best}))
        raise AssertionError("Missing no-improvement condition")

    def test_improving_trial_is_not_stopped_as_stagnant(self):
        self.assertFalse(self.stops(0.8, 0.7))

    def test_stagnant_trial_can_stop_after_warmup(self):
        self.assertTrue(self.stops(0.7, 0.7))

    def test_visible_single_gpu_is_addressed_by_logical_zero(self):
        path = GUIDE.parents[2] / "13-mlops/weights-and-biases/references/sweeps.md"
        text = path.read_text()
        self.assertIn('device = torch.device("cuda:0")', text)
        self.assertNotIn("f'cuda:{gpu_id}'", text)

    def test_positive_raw_bounds_use_value_space_distributions(self):
        directory = GUIDE.parents[2] / "13-mlops/weights-and-biases"
        for relative in ("SKILL.md", "references/sweeps.md", "references/integrations.md"):
            with self.subTest(file=relative):
                text = (directory / relative).read_text()
                self.assertNotRegex(text, r"['\"]distribution['\"]\s*:\s*['\"](?:q_)?log_uniform['\"]")
                self.assertIn("log_uniform_values", text)


class WandaPruningExample(unittest.TestCase):
    def prune(self, weights: torch.Tensor, sparsity: float = 0.5):
        path = GUIDE.parents[2] / "19-emerging-techniques/model-pruning/references/wanda.md"
        section = path.read_text().split("### Per-Output Pruning", 1)[1].split("\n##", 1)[0]
        match = re.search(r"```python\n([\s\S]*?)```", section)
        if match is None:
            raise AssertionError("Missing per-output pruning example")
        namespace = {"torch": torch, "W": weights, "activation": torch.ones(weights.shape[1]), "sparsity": sparsity, "out_features": weights.shape[0], "quantile": torch.quantile}
        exec(compile(ast.parse(match[1]), str(path), "exec"), namespace)

    def test_equal_importances_still_prune_requested_count(self):
        weights = torch.ones((2, 4))
        self.prune(weights)
        self.assertEqual((weights == 0).sum(dim=1).tolist(), [2, 2])

    def test_parameter_pruning_does_not_mutate_an_autograd_graph(self):
        weights = torch.ones((2, 4), requires_grad=True)
        self.prune(weights)
        self.assertEqual((weights == 0).sum(dim=1).tolist(), [2, 2])
        self.assertIsNone(weights.grad)

    def test_invalid_sparsity_is_rejected(self):
        with self.assertRaises(ValueError):
            self.prune(torch.ones((2, 4)), sparsity=1.1)


class SimpoNumericalExamples(unittest.TestCase):
    def value(self, number: int, name: str) -> float:
        path = GUIDE.parents[2] / "06-post-training/simpo/references/loss-functions.md"
        section = path.read_text().split(f"### Example {number}:", 1)[1].split("\n##", 1)[0]
        match = re.search(r"```python\n([\s\S]*?)```", section)
        if match is None:
            raise AssertionError("Missing SimPO loss calculation")
        namespace: dict[str, object] = {"math": math}
        exec(compile(ast.parse(match[1]), str(path), "exec"), namespace)
        return float(cast(float, namespace[name]))

    def test_beta_two_example(self):
        self.assertAlmostEqual(self.value(1, "loss"), math.log1p(math.exp(-1.6)), places=10)

    def test_beta_two_point_five_with_sft(self):
        self.assertAlmostEqual(self.value(2, "total_loss"), math.log1p(math.exp(-2.0)) + 0.12, places=10)


class CausalDistillationExample(unittest.TestCase):
    def setUp(self):
        self.loss = load_example_function("distillation_loss")
        self.student = torch.tensor([[[2.0, 0.0], [0.0, 2.0], [6.0, -6.0]]], dtype=torch.float64, requires_grad=True)
        self.teacher = torch.tensor([[[0.0, 1.0], [1.0, 0.0], [0.0, 1.0]]], dtype=torch.float64, requires_grad=True)
        self.labels = torch.tensor([[0, 1, -100]])

    def test_hard_loss_predicts_next_token_not_current_token(self):
        expected = F.cross_entropy(self.student[:, 0, :], self.labels[:, 1])
        actual = self.loss(self.student, self.teacher, self.labels, alpha=0.0)
        self.assertAlmostEqual(actual.item(), expected.item(), places=10)

    def test_masked_and_final_token_predictions_do_not_affect_soft_loss(self):
        changed = self.teacher.detach().clone()
        changed[:, 1:, :] = torch.tensor([20.0, -20.0])
        before = self.loss(self.student, self.teacher, self.labels, alpha=1.0)
        after = self.loss(self.student, changed, self.labels, alpha=1.0)
        self.assertAlmostEqual(before.item(), after.item(), places=10)

    def test_forward_kl_matches_valid_next_token_distribution(self):
        expected = F.kl_div(F.log_softmax(self.student[:, 0, :] / 2.0, dim=-1), F.softmax(self.teacher[:, 0, :] / 2.0, dim=-1), reduction="batchmean") * 4.0
        actual = self.loss(self.student, self.teacher, self.labels, alpha=1.0)
        self.assertAlmostEqual(actual.item(), expected.item(), places=10)

    def test_all_ignored_targets_have_finite_zero_loss(self):
        actual = self.loss(self.student, self.teacher, torch.full_like(self.labels, -100))
        self.assertTrue(torch.isfinite(actual).item())
        self.assertEqual(actual.item(), 0.0)

    def test_forward_loss_does_not_train_teacher(self):
        self.loss(self.student, self.teacher, self.labels).backward()
        self.assertIsNone(self.teacher.grad)
        self.assertIsNotNone(self.student.grad)


if __name__ == "__main__":
    print(f"Tiny CPU loss tests; PyTorch {torch.__version__}; no optimizer steps.")
    unittest.main()
