"""Check bounded guide examples without loading pretrained models.

Requires an already-installed PyTorch. No models, downloads, training, or optimizer steps.
"""
import ast
import asyncio
from collections.abc import AsyncIterator, Callable
import math
import os
from pathlib import Path
import re
import runpy
from types import SimpleNamespace
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


class LangChainArithmeticExample(unittest.TestCase):
    def setUp(self):
        directory = GUIDE.parents[2] / "14-agents/langchain/references"
        helper = directory / "safe_arithmetic.py"
        if helper.exists():
            self.calculate = cast(Callable[[str], str], runpy.run_path(str(helper))["calculate"])
        else:
            # Reproduce the existing tool without importing LangChain or an LLM.
            text = (directory / "agents.md").read_text()
            code = re.search(r"```python\n([\s\S]*?)```", text)
            if code is None:
                raise AssertionError("Missing calculator example")
            function = next(node for node in ast.parse(code[1]).body if isinstance(node, ast.FunctionDef) and node.name == "calculator")
            namespace: dict[str, object] = {}
            exec(compile(ast.Module(body=[function], type_ignores=[]), str(directory / "agents.md"), "exec"), namespace)
            self.calculate = cast(Callable[[str], str], namespace["calculator"])

    def test_arithmetic_remains_usable(self):
        self.assertEqual(self.calculate("25 * 17"), "425")
        self.assertEqual(self.calculate("-2 + 4 * 3"), "10")
        self.assertEqual(self.calculate("8 / 4 + 3"), "5.0")

    def test_calls_attributes_and_non_numeric_expressions_are_rejected(self):
        for expression in ("__import__('builtins').len([1])", "(1).__class__", "[1, 2]", "True", "2 ** 3"):
            with self.subTest(expression=expression), self.assertRaises(ValueError):
                self.calculate(expression)

    def test_expression_work_and_numeric_results_are_bounded(self):
        for expression in ("1" * 201, "+".join(["1"] * 40), str(1 << 300), "1e309", "1e308 * 1e308", "1 / 0", "1 +"):
            with self.subTest(expression=expression), self.assertRaises(ValueError):
                self.calculate(expression)


class GptqDeviceMapExample(unittest.TestCase):
    def test_manual_device_map_names_existing_modules_and_covers_all_layers(self):
        path = GUIDE.parents[2] / "10-optimization/gptq/SKILL.md"
        section = path.read_text().split("### Multi-GPU deployment", 1)[1].split("### CPU offloading", 1)[0]
        match = re.search(r"```python\n([\s\S]*?)```", section)
        if match is None:
            raise AssertionError("Missing manual device-map example")
        tree = ast.parse(match[1])
        assignment = next(node for node in tree.body if isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == "device_map" for target in node.targets))
        # Evaluate the reviewed dictionary assignment only, not model loaders.
        namespace: dict[str, object] = {"__builtins__": {"range": range}}
        exec(compile(ast.Module(body=[assignment], type_ignores=[]), str(path), "exec"), namespace)
        placement = cast(dict[str, int], namespace["device_map"])
        model = torch.nn.ModuleDict({
            "model": torch.nn.ModuleDict({
                "embed_tokens": torch.nn.Identity(),
                "layers": torch.nn.ModuleList([torch.nn.Identity() for _ in range(80)]),
                "norm": torch.nn.Identity(),
            }),
            "lm_head": torch.nn.Identity(),
        })
        module_names = {name for name, _ in model.named_modules()}
        self.assertEqual(sorted(set(placement) - module_names), [], "Device-map keys must be real module paths, not textual ranges")
        for layer in range(80):
            self.assertEqual(placement[f"model.layers.{layer}"], 0 if layer < 40 else 1)


class GrpoMetricInterpretationExample(unittest.TestCase):
    def text(self) -> str:
        return (GUIDE.parents[2] / "06-post-training/grpo-rl-training/SKILL.md").read_text()

    def test_zero_variance_occurs_for_both_solved_and_failed_groups(self):
        solved = torch.tensor([1.0, 1.0])
        failed = torch.tensor([0.0, 0.0])
        self.assertEqual(solved.std(unbiased=False).item(), 0.0)
        self.assertEqual(failed.std(unbiased=False).item(), 0.0)
        self.assertNotEqual(solved.mean().item(), failed.mean().item())
        text = self.text()
        self.assertIn("Zero reward variance does not by itself prove mode collapse", text)
        self.assertIn("Loss is not a direct measurement of KL alone", text)
        self.assertNotIn("Loss starts near 0 and INCREASES", text)

    def test_reward_standard_deviation_threshold_depends_on_reward_scale(self):
        rewards = torch.tensor([0.0, 1.0])
        scaled = rewards * 0.001
        self.assertAlmostEqual(scaled.std(unbiased=False).item(), 0.001 * rewards.std(unbiased=False).item(), places=9)
        self.assertLess(scaled.std(unbiased=False).item(), 0.1)
        self.assertNotIn("should stay > 0.1", self.text())


class AutoGptAsyncGeneratorExample(unittest.TestCase):
    def setUp(self):
        self.path = GUIDE.parents[2] / "14-agents/autogpt/references/advanced-usage.md"
        section = self.path.read_text().split("### Block structure", 1)[1].split("### Block registration", 1)[0]
        match = re.search(r"```python\n([\s\S]*?)```", section)
        if match is None:
            raise AssertionError("Missing custom block example")
        tree = ast.parse(match[1])
        block = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "MyCustomBlock")
        self.method = next(node for node in block.body if isinstance(node, ast.AsyncFunctionDef) and node.name == "execute")

    def test_return_annotation_describes_an_async_iterator(self):
        annotation = ast.unparse(self.method.returns) if self.method.returns else ""
        self.assertEqual(annotation, "AsyncIterator[tuple[str, object]]")

    def test_extracted_method_yields_result_pairs_without_framework_imports(self):
        # Strip annotations only; execute no backend imports or registration code.
        self.method.returns = None
        for argument in self.method.args.args:
            argument.annotation = None
        namespace: dict[str, object] = {}
        exec(compile(ast.Module(body=[self.method], type_ignores=[]), str(self.path), "exec"), namespace)
        function = cast(Callable[..., AsyncIterator[tuple[str, object]]], namespace["execute"])

        async def process(query: str, maximum: int) -> list[str]:
            return [query] * maximum

        async def collect():
            host = SimpleNamespace(process=process)
            data = SimpleNamespace(query="test", max_results=2)
            return [item async for item in function(host, data)]

        self.assertEqual(asyncio.run(collect()), [("results", ["test", "test"]), ("count", 2)])


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


class WandaFullPruningExample(unittest.TestCase):
    def setUp(self):
        path = GUIDE.parents[2] / "19-emerging-techniques/model-pruning/references/wanda.md"
        section = path.read_text().split("### One-Shot Pruning", 1)[1].split("### Per-Output Pruning", 1)[0]
        match = re.search(r"```python\n([\s\S]*?)```", section)
        if match is None:
            raise AssertionError("Missing full Wanda example")
        function = next(node for node in ast.parse(match[1]).body if isinstance(node, ast.FunctionDef) and node.name == "wanda_prune")
        namespace: dict[str, object] = {"torch": torch}
        exec(compile(ast.Module(body=[function], type_ignores=[]), str(path), "exec"), namespace)
        self.prune = cast(Callable[..., torch.nn.Module], namespace["wanda_prune"])

    def fixture(self, weights: torch.Tensor):
        layer = torch.nn.Linear(weights.shape[1], weights.shape[0], bias=False, dtype=weights.dtype)
        with torch.no_grad():
            layer.weight.copy_(weights)
        return torch.nn.Sequential(layer), layer

    def test_sequence_calibration_completes_per_output_pruning(self):
        model, layer = self.fixture(torch.ones(2, 3))
        result = self.prune(model, [{"input": torch.ones(1, 4, 3)}], sparsity=1 / 3)
        self.assertIs(result, model)
        torch.testing.assert_close(layer.weight, torch.tensor([[0., 1., 1.], [0., 1., 1.]]))
        self.assertIsNone(layer.weight.grad)

    def test_unequal_batches_and_leading_axes_match_l2_mask(self):
        tokens = torch.tensor([[0., 2., 8.], [0., 2., 8.], [0., 2., 8.], [5., 2., 8.]])
        # Feature L2 norms are [5, 4, 16]; L1 and summed batch norms rank differently.
        weights = torch.tensor([[1., 1., 1.], [3., 1., 0.1]])
        expected = torch.tensor([[1., 0., 1.], [3., 1., 0.]])
        batches = [[{"input": tokens[:1].reshape(1, 1, 3)}, {"input": tokens[1:].reshape(1, 3, 3)}]]
        batches.extend([{"input": tokens.reshape(shape)}] for shape in [(4, 3), (1, 4, 3), (1, 1, 4, 3)])
        for calibration in batches:
            with self.subTest(shapes=[list(batch["input"].shape) for batch in calibration]):
                model, layer = self.fixture(weights)
                self.prune(model, calibration, sparsity=1 / 3)
                torch.testing.assert_close(layer.weight, expected)

    def test_tied_scores_and_sparsity_endpoints_prune_exact_coordinates(self):
        for sparsity in (0., 0.5, 1.):
            with self.subTest(sparsity=sparsity):
                model, layer = self.fixture(torch.ones(2, 4))
                self.prune(model, [{"input": torch.zeros(1, 2, 4)}], sparsity=sparsity)
                expected = torch.ones(2, 4)
                expected[:, :int(sparsity * 4)] = 0
                torch.testing.assert_close(layer.weight, expected)

    def test_invalid_sparsity_is_rejected_without_calibration(self):
        for sparsity in (-0.1, 1.1, float("nan")):
            with self.subTest(sparsity=sparsity):
                model, _ = self.fixture(torch.ones(2, 3))
                with self.assertRaises(ValueError):
                    self.prune(model, [], sparsity=sparsity)

    def test_hooks_are_removed_after_calibration_failure(self):
        model, layer = self.fixture(torch.ones(2, 3))

        def interrupted():
            yield {"input": torch.ones(1, 4, 3)}
            raise RuntimeError("Calibration interrupted")

        with self.assertRaisesRegex(RuntimeError, "Calibration interrupted"):
            self.prune(model, interrupted())
        # Inspect the host framework's resource registry, not guide-local state.
        self.assertFalse(layer._forward_hooks)
        torch.testing.assert_close(layer.weight, torch.ones(2, 3))

    def test_fp16_inputs_accumulate_norms_without_half_overflow(self):
        weights = torch.tensor([[0.1, 0.2, 0.3], [0.3, 0.2, 0.1]], dtype=torch.float16)
        model, layer = self.fixture(weights)
        self.prune(model, [{"input": torch.full((1, 4, 3), 40000., dtype=torch.float16)}], sparsity=1 / 3)
        expected = weights.clone()
        expected[0, 0] = expected[1, 2] = 0
        torch.testing.assert_close(layer.weight, expected)

    def test_nonfinite_or_overflowed_statistics_abort_and_remove_hooks(self):
        for value in (float("nan"), float("inf"), 1e20):
            with self.subTest(value=value):
                model, layer = self.fixture(torch.ones(2, 3))
                with self.assertRaisesRegex(ValueError, "statistics"):
                    self.prune(model, [{"input": torch.full((1, 4, 3), value)}])
                self.assertFalse(layer._forward_hooks)
                torch.testing.assert_close(layer.weight, torch.ones(2, 3))

    def test_empty_calibration_does_not_prune_unobserved_layers(self):
        for batches in ([], [{"input": torch.empty(1, 0, 3)}]):
            with self.subTest(batches=len(batches)):
                model, layer = self.fixture(torch.ones(2, 3))
                self.prune(model, batches)
                torch.testing.assert_close(layer.weight, torch.ones(2, 3))


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

    def test_all_ignored_fp16_overflow_has_zero_loss_and_gradients(self):
        student = torch.full((1, 3, 2), 40000.0, dtype=torch.float16, requires_grad=True)
        teacher = student.detach().clone().requires_grad_()
        labels = torch.full((1, 3), -100, dtype=torch.long)
        self.assertTrue(torch.isfinite(student).all().item())
        self.assertTrue(torch.isinf(student[:, :-1, :].sum()).item())
        actual = self.loss(student, teacher, labels)
        self.assertTrue(torch.isfinite(actual).item(), "Ignored finite FP16 logits must not produce NaN")
        self.assertEqual(actual.item(), 0.0)
        actual.backward()
        self.assertIsNone(teacher.grad)
        gradient = student.grad
        if gradient is None:
            self.fail("Student gradient is missing")
        else:
            torch.testing.assert_close(gradient, torch.zeros_like(student), rtol=0, atol=0)

    def test_forward_loss_does_not_train_teacher(self):
        self.loss(self.student, self.teacher, self.labels).backward()
        self.assertIsNone(self.teacher.grad)
        self.assertIsNotNone(self.student.grad)


if __name__ == "__main__":
    print(f"Tiny CPU example tests; PyTorch {torch.__version__}; no optimizer steps.")
    unittest.main()
