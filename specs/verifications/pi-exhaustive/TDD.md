# Test-before-build evidence

Baseline: `9dbef66445a4d905fc5db190c5e0de7d221dbd51`. Product/package acceptance revision: `4dc40f4f29a633f49d94d713cb987d4410413834`.

Twenty-five separate failing-test commits precede their repairs. Twenty-seven focused scenarios replayed successfully from isolated Git archives: 16 in `tdd-isolation`, five in `tdd-isolation-extra`, five in `tdd-isolation-final`, and one in `tdd-isolation-bitsandbytes`.

These are static, fixture, mathematical, configuration, or small local behavioral regressions. They are not 27 full framework or model replications. Existing PyTorch was used with CUDA hidden; no pretrained model was loaded and no optimizer step ran.

| Regression | Red | Green |
|---|---|---|
| Response/read contracts | `0d99e19` | `441a086` |
| Entrypoint byte budget | `b508699` | `d9a752a` |
| Nested reference links | `c62cef6` | `a25ebc4` |
| Entrypoint Python parsing | `1de69a1` | `ce02cda` |
| Complete immutable matrix | `7ae6b52` | `42a5193` |
| KL names and reverse-KL numerics | `4031233` | `e07d9ea` |
| Prompt field budgets | `1944987` | `8385a05` |
| Causal KL alignment/masking | `c4890f8` | `a1495b5` |
| Supporting Python parsing | `7fba3d5` | `580deba` |
| Markdown fence scanner | `93e0a37` | `580deba` |
| SimPO arithmetic | `e286907` | `90574dc` |
| W&B value-space bounds | `4e2fcf8` | `59334a7` |
| W&B stopping/GPU addressing | `37109e9` | `59334a7` |
| Wanda ties/autograd mutation | `27b1c88` | `ec91d43` |
| Explicit task boundaries | `aa68f6f` | `18a7812` |
| Exact reads and per-field caps | `dd8b44c` | `c6e7a0c` |
| README category inventory | `0d6c658` | `7a840e2` |
| AutoGPT async-generator protocol | `00de80e` | `3ecdf0b` |
| DSPy validation limits | `9ba0023` | `3039441` |
| FAISS unmeasured recall claims | `ebf0166` | `a991cff` |
| GRPO variance/loss interpretation | `08cf0aa` | `aad86de` |
| GPTQ measurement/checkpoint gates | `3974b16` | `cbe1c4e` |
| GPTQ exact module placement | `f2011ae` | `53b3673` |
| LangChain arithmetic safety and wiring | `caf3e67` | `82409b9` |
| QLoRA training-memory and quality claims | `081aa8e` | `4dc40f4` |

Raw TAP/unittest output, replay scripts, revision archives, and per-phase results remain under the host evidence root listed in `REPORT.md`. No historical log was normalized or overwritten. The last three replay batches also require the expected red failure marker, not an arbitrary process failure.

The parser covers ordinary fenced blocks, not Markdown list/blockquote containers. Python-fence checks use AST parsing; they do not establish import availability, contextual executability, API correctness, or scientific validity. Tiny behavioral tests deepen selected checks but do not remove those limits.
