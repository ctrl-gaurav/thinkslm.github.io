# ThinkSLM: Towards Reasoning in Small Language Models

[![EMNLP 2025](https://img.shields.io/badge/EMNLP%202025-Main%20Conference-brightgreen)](https://2025.emnlp.org/)
[![arXiv](https://img.shields.io/badge/arXiv-2502.11569-b31b1b.svg)](https://arxiv.org/abs/2502.11569)
[![Code](https://img.shields.io/badge/Code-Available%20Soon-green)](https://github.com/ctrl-gaurav)
[![Website](https://img.shields.io/badge/Website-ThinkSLM-blue)](https://thinkslm.github.io)

> 🎉 **[EMNLP 2025 Main Conference]** - We are excited to announce that our paper has been **accepted to EMNLP 2025 Main Conference**!

This repository contains the official implementation and project page for **"ThinkSLM: Towards Reasoning in Small Language Models"**, accepted at **EMNLP 2025 Main Conference**.

## 🎯 Overview

We present **ThinkSLM**, a comprehensive study that systematically **surveys, benchmarks, and analyzes** **72** Small Language Models (SLMs) from **six** model families across **14** reasoning benchmarks. Our work challenges the assumption that scaling is the only way to achieve strong reasoning capabilities.

### Key Contributions

- **🔍 Systematic Evaluation**: Comprehensive analysis of 72 SLMs across 14 reasoning benchmarks
- **🎯 Evaluation Methodology**: Comparison of 4 evaluation methods and 4 LLM judges against human evaluations
- **📊 Robustness Analysis**: Evaluation under adversarial conditions and intermediate reasoning steps
- **🔧 Compression Impact**: Study of quantization, pruning, and distillation effects on reasoning

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/ctrl-gaurav/thinkslm.git
cd thinkslm

# Install dependencies
pip install -r requirements.txt
```

### Usage

```python
from thinkslm import SLMEvaluator

# Initialize the evaluator
evaluator = SLMEvaluator(
    models=["qwen2.5-1.5b", "llama-3.2-3b"],
    benchmarks=["gsm8k", "arc_challenge"],
    evaluation_methods=["direct_io", "cot"]
)

# Run comprehensive evaluation
results = evaluator.evaluate()

# Analyze quantization impact
quant_results = evaluator.evaluate_quantization(
    bits=[4, 8],
    methods=["gptq", "awq"]
)
```

## 📊 Key Findings

### 🏆 Small ≠ Weak: 32B Qwen Rivals GPT-4 Turbo
Qwen 2.5-32B matches GPT-4-Turbo on intermediate-reasoning (MR-GSM8K 55.6 vs 53.0) and reaches 95% on GSM8K while using ≈1/5 the parameters, overturning the "> 100B for reasoning" myth.

### 🗜️ Quantization is Free: 75% Memory Reduction
4- to 8-bit GPTQ cuts GPU memory by up to 75% yet preserves ≥99% of accuracy across GSM8K, ARC, CQA and robustness benchmarks, enabling laptop-scale deployment of formerly heavyweight models.

### 💡 Keep Prompts Simple: Direct I/O Wins
On GSM8K, direct I/O prompts outperform or equal Chain-of-Thought and multi-shot variants; additional "think-step" instructions often confuse SLMs instead of helping them.

### 📏 Sequence Length Limitation: 80% → 40% Drop
Accuracy on sorting jumps from >80% (8-item lists) to <40% (32-item mixed lists), and negative numbers exacerbate errors, revealing a context-length bottleneck for algorithmic reasoning.

### 🛡️ Robustness Scales: Size Matters for Defense
Larger SLMs (32B, 70B) remain the most resilient to adversarial GSM-Plus inputs, yet their quantized versions show negligible degradation, whereas pruned counterparts collapse.

### ⚠️ Pruning Hurts: 30-50 Point Loss
Weight-pruned 8B models lose 30–50 points on reasoning tasks and score ~0 on MR-GSM8K, showing that aggressive sparsification cripples logical consistency even after recovery fine-tuning.

## 📊 Leaderboard Results

### Top Performing Models

| Model | Params | Quantization | GSM8K (Direct I/O) | GSM8K (COT) | ARC-Challenge | Overall Average |
|-------|--------|--------------|---------------------|-------------|---------------|-----------------|
| **Qwen2.5-32B** | 32B | None | 95.40 | 95.78 | 95.25 | **91.77** |
| **Qwen2.5-14B** | 14B | None | 94.29 | 94.57 | 93.37 | **85.80** |
| **Qwen2.5-7B** | 7B | None | 91.76 | 92.19 | 90.53 | **78.36** |
| **Llama-3.1-70B** | 70B | None | 95.10 | 95.27 | 94.43 | **94.74** |
| **Llama-3.1-8B** | 8B | None | 83.45 | 85.27 | 79.58 | **77.93** |

### Quantization Impact

| Model | Original | GPTQ 8-bit | Memory Reduction | Accuracy Loss |
|-------|----------|------------|------------------|---------------|
| Qwen2.5-7B | 78.36% | 78.87% | 67% | **+0.51%** |
| Llama-3.1-8B | 77.93% | 77.53% | 71% | **-0.40%** |
| Qwen2.5-32B | 91.77% | 91.86% | 73% | **+0.09%** |

## 🔬 Methodology

### Benchmarks Evaluated

**Mathematical Reasoning:**
- GSM8K (Direct I/O, CoT, 5-Shot, 8-Shot variants)
- ARC-Easy, ARC-Challenge
- CommonsenseQA

**Algorithmic Reasoning:**
- Sorting tasks (8, 16, 32 items with positive/mixed numbers)

### Evaluation Methods

1. **Direct I/O**: Simple input-output prompting
2. **Chain-of-Thought**: Step-by-step reasoning
3. **Few-Shot**: 5-shot and 8-shot examples
4. **Adversarial**: GSM-Plus robustness testing

### Model Families Studied

- **Qwen2/2.5** (0.5B - 32B)
- **Llama-3.1/3.2** (1B - 70B)
- **Mistral** (7B - 12B)
- **Phi-3** (3.8B - 7B)
- **SmolLM2** (1.7B)
- **Other SLMs** (Hymba, Minitron)

## 📁 Repository Structure

```
thinkslm/
├── src/
│   ├── models/          # Model implementations and loading
│   ├── benchmarks/      # Benchmark evaluation scripts
│   ├── quantization/    # Quantization utilities
│   └── analysis/        # Result analysis tools
├── configs/             # Configuration files
├── data/               # Benchmark datasets
├── scripts/            # Evaluation scripts
├── results/            # Experimental results
└── leaderboard/        # Interactive leaderboard code
```

## 🔧 Evaluation

### Running Benchmarks

```bash
# Evaluate a single model
python scripts/evaluate_model.py \
    --model qwen2.5-7b \
    --benchmarks gsm8k,arc_challenge \
    --methods direct_io,cot

# Evaluate quantized models
python scripts/evaluate_quantization.py \
    --model qwen2.5-7b \
    --bits 4,8 \
    --methods gptq,awq

# Run robustness evaluation
python scripts/evaluate_robustness.py \
    --model qwen2.5-7b \
    --adversarial_datasets gsm_plus
```

### Reproducing Results

```bash
# Reproduce all results
bash scripts/reproduce_all.sh

# Reproduce specific model family
bash scripts/reproduce_qwen.sh
bash scripts/reproduce_llama.sh
```

## 📄 Citation

If you find our work useful, please cite:

```bibtex
@article{srivastava2025towards,
  title={Towards reasoning ability of small language models},
  author={Srivastava, Gaurav and Cao, Shuxiang and Wang, Xuan},
  journal={arXiv preprint arXiv:2502.11569},
  year={2025}
}
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This work was supported by NSF NAIRR Pilot with PSC Neocortex, NCSA Delta; Amazon, Cisco Research, Commonwealth Cyber Initiative, Amazon–Virginia Tech Center for Efficient and Robust Machine Learning, and Sanghani Center for AI and Data Analytics at Virginia Tech.

## 📞 Contact

- **Gaurav Srivastava**: [gks@vt.edu](mailto:gks@vt.edu)
- **Shuxiang Cao**: [shuxiang.cao@physics.ox.ac.uk](mailto:shuxiang.cao@physics.ox.ac.uk)
- **Xuan Wang** (Corresponding Author): [xuanw@vt.edu](mailto:xuanw@vt.edu)

---

**Project Page**: [https://thinkslm.github.io](https://thinkslm.github.io) | **Interactive Leaderboard**: [View Results](https://thinkslm.github.io#leaderboard)