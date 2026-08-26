type CalculatorModel = {
  key: string
  label: string
  params: number
  layers: number
  kvHeads: number
  headDim: number
  active: number
  family: string
  mla?: boolean
  slidingWindow?: number
  slidingLayers?: number
}

const calculatorModels: CalculatorModel[] = [
  {
    key: "llama-3.1-8b",
    label: "Llama 3.1 8B",
    params: 8.03,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 8.03,
    family: "Llama",
  },
  {
    key: "llama-3.3-70b",
    label: "Llama 3.3 70B",
    params: 70.6,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 70.6,
    family: "Llama",
  },
  {
    key: "llama-3.2-1b",
    label: "Llama 3.2 1B",
    params: 1.24,
    layers: 16,
    kvHeads: 8,
    headDim: 64,
    active: 1.24,
    family: "Llama",
  },
  {
    key: "llama-3.2-3b",
    label: "Llama 3.2 3B",
    params: 3.21,
    layers: 28,
    kvHeads: 8,
    headDim: 128,
    active: 3.21,
    family: "Llama",
  },
  {
    key: "llama-3.1-405b",
    label: "Llama 3.1 405B",
    params: 405,
    layers: 126,
    kvHeads: 8,
    headDim: 128,
    active: 405,
    family: "Llama",
  },
  {
    key: "qwen-2.5-7b",
    label: "Qwen2.5 7B",
    params: 7.62,
    layers: 28,
    kvHeads: 4,
    headDim: 128,
    active: 7.62,
    family: "Qwen",
  },
  {
    key: "qwen-2.5-32b",
    label: "Qwen2.5 32B",
    params: 32.8,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32.8,
    family: "Qwen",
  },
  {
    key: "qwen-2.5-72b",
    label: "Qwen2.5 72B",
    params: 72.7,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 72.7,
    family: "Qwen",
  },
  {
    key: "qwen-2.5-0.5b",
    label: "Qwen2.5 0.5B",
    params: 0.49,
    layers: 24,
    kvHeads: 2,
    headDim: 64,
    active: 0.49,
    family: "Qwen",
  },
  {
    key: "qwen-2.5-1.5b",
    label: "Qwen2.5 1.5B",
    params: 1.54,
    layers: 28,
    kvHeads: 2,
    headDim: 128,
    active: 1.54,
    family: "Qwen",
  },
  {
    key: "qwen-2.5-3b",
    label: "Qwen2.5 3B",
    params: 3.09,
    layers: 36,
    kvHeads: 2,
    headDim: 128,
    active: 3.09,
    family: "Qwen",
  },
  {
    key: "qwen-2.5-14b",
    label: "Qwen2.5 14B",
    params: 14.8,
    layers: 48,
    kvHeads: 4,
    headDim: 128,
    active: 14.8,
    family: "Qwen",
  },
  {
    key: "qwen3-8b",
    label: "Qwen3 8B",
    params: 8.2,
    layers: 36,
    kvHeads: 8,
    headDim: 128,
    active: 8.2,
    family: "Qwen",
  },
  {
    key: "qwen3-14b",
    label: "Qwen3 14B",
    params: 14.8,
    layers: 40,
    kvHeads: 8,
    headDim: 128,
    active: 14.8,
    family: "Qwen",
  },
  {
    key: "qwen3-30b-a3b",
    label: "Qwen3 30B-A3B",
    params: 30.5,
    layers: 48,
    kvHeads: 4,
    headDim: 128,
    active: 3.3,
    family: "Qwen",
  },
  {
    key: "qwen3-235b-a22b",
    label: "Qwen3 235B-A22B",
    params: 235,
    layers: 94,
    kvHeads: 4,
    headDim: 128,
    active: 22,
    family: "Qwen",
  },
  {
    key: "mistral-7b",
    label: "Mistral 7B",
    params: 7.25,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 7.25,
    family: "Mistral",
  },
  {
    key: "gemma-3-4b",
    label: "Gemma 3 4B",
    params: 4.3,
    layers: 34,
    kvHeads: 4,
    headDim: 256,
    active: 4.3,
    family: "Gemma",
  },
  {
    key: "gemma-3-27b",
    label: "Gemma 3 27B",
    params: 27,
    layers: 62,
    kvHeads: 8,
    headDim: 128,
    active: 27,
    family: "Gemma",
  },
  {
    key: "phi-4",
    label: "Phi-4 14B",
    params: 14.7,
    layers: 40,
    kvHeads: 10,
    headDim: 128,
    active: 14.7,
    family: "Phi",
  },
  {
    key: "deepseek-r1-distill",
    label: "DeepSeek-R1 Distill Qwen 32B",
    params: 32.8,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32.8,
    family: "DeepSeek",
  },
  {
    key: "mixtral-8x7b",
    label: "Mixtral 8x7B",
    params: 46.7,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 12.9,
    family: "Mistral",
  },
  {
    key: "deepseek-v3",
    label: "DeepSeek-V3 / R1",
    params: 671,
    layers: 61,
    kvHeads: 1,
    headDim: 576,
    active: 37,
    mla: true,
    family: "DeepSeek",
  },
  {
    key: "glm-4-9b",
    label: "GLM-4 9B",
    params: 9,
    layers: 40,
    kvHeads: 2,
    headDim: 128,
    active: 9,
    family: "GLM",
  },
  {
    key: "glm-4.5-air",
    label: "GLM-4.5 Air 106B-A12B",
    params: 106,
    layers: 46,
    kvHeads: 8,
    headDim: 128,
    active: 12,
    family: "GLM",
  },
  {
    key: "glm-4.5",
    label: "GLM-4.5 355B-A32B",
    params: 355,
    layers: 92,
    kvHeads: 8,
    headDim: 128,
    active: 32,
    family: "GLM",
  },
  {
    key: "mistral-small-3.1",
    label: "Mistral Small 3.1 24B",
    params: 24,
    layers: 40,
    kvHeads: 8,
    headDim: 128,
    active: 24,
    family: "Mistral",
  },
  {
    key: "phi-4-mini",
    label: "Phi-4 Mini 3.8B",
    params: 3.8,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 3.8,
    family: "Phi",
  },
  {
    key: "gpt-oss-20b",
    label: "GPT-OSS 20B",
    params: 20.9,
    layers: 24,
    kvHeads: 8,
    headDim: 64,
    active: 3.6,
    family: "OpenAI",
    slidingWindow: 128,
    slidingLayers: 12,
  },
  {
    key: "gpt-oss-120b",
    label: "GPT-OSS 120B",
    params: 117,
    layers: 36,
    kvHeads: 8,
    headDim: 64,
    active: 5.1,
    family: "OpenAI",
    slidingWindow: 128,
    slidingLayers: 18,
  },
]

const arenaOpenModels: CalculatorModel[] = [
  {
    key: "llama-2-7b",
    label: "Llama 2 7B Chat",
    params: 6.74,
    layers: 32,
    kvHeads: 32,
    headDim: 128,
    active: 6.74,
    family: "Arena / Llama",
  },
  {
    key: "llama-2-13b",
    label: "Llama 2 13B Chat",
    params: 13,
    layers: 40,
    kvHeads: 40,
    headDim: 128,
    active: 13,
    family: "Arena / Llama",
  },
  {
    key: "llama-2-70b",
    label: "Llama 2 70B Chat",
    params: 70,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 70,
    family: "Arena / Llama",
  },
  {
    key: "codellama-34b",
    label: "CodeLlama 34B Instruct",
    params: 34,
    layers: 48,
    kvHeads: 8,
    headDim: 128,
    active: 34,
    family: "Arena / Llama",
  },
  {
    key: "vicuna-13b",
    label: "Vicuna 13B",
    params: 13,
    layers: 40,
    kvHeads: 40,
    headDim: 128,
    active: 13,
    family: "Arena / Llama",
  },
  {
    key: "vicuna-33b",
    label: "Vicuna 33B",
    params: 33,
    layers: 60,
    kvHeads: 52,
    headDim: 128,
    active: 33,
    family: "Arena / Llama",
  },
  {
    key: "wizardlm-70b",
    label: "WizardLM 70B",
    params: 70,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 70,
    family: "Arena / Llama",
  },
  {
    key: "tulu-3-8b",
    label: "Tulu 3 8B",
    params: 8,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 8,
    family: "Arena / Llama",
  },
  {
    key: "tulu-3-70b",
    label: "Tulu 3 70B",
    params: 70,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 70,
    family: "Arena / Llama",
  },
  {
    key: "nemotron-51b",
    label: "Llama 3.1 Nemotron 51B",
    params: 51,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 51,
    family: "Arena / Llama",
  },
  {
    key: "nemotron-super-49b",
    label: "Llama 3.3 Nemotron Super 49B",
    params: 49,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 49,
    family: "Arena / Llama",
  },
  {
    key: "llama-4-scout",
    label: "Llama 4 Scout 109B-A17B",
    params: 109,
    layers: 48,
    kvHeads: 8,
    headDim: 128,
    active: 17,
    family: "Arena / Llama",
  },
  {
    key: "llama-4-maverick",
    label: "Llama 4 Maverick 400B-A17B",
    params: 400,
    layers: 48,
    kvHeads: 8,
    headDim: 128,
    active: 17,
    family: "Arena / Llama",
  },
  {
    key: "mistral-small-24b",
    label: "Mistral Small 24B",
    params: 24,
    layers: 40,
    kvHeads: 8,
    headDim: 128,
    active: 24,
    family: "Arena / Mistral",
  },
  {
    key: "mistral-large-2411",
    label: "Mistral Large 2411",
    params: 123,
    layers: 88,
    kvHeads: 8,
    headDim: 128,
    active: 123,
    family: "Arena / Mistral",
  },
  {
    key: "mixtral-8x22b",
    label: "Mixtral 8x22B",
    params: 141,
    layers: 56,
    kvHeads: 8,
    headDim: 128,
    active: 39,
    family: "Arena / Mistral",
  },
  {
    key: "zephyr-orpo-141b",
    label: "Zephyr ORPO 141B-A35B",
    params: 141,
    layers: 56,
    kvHeads: 8,
    headDim: 128,
    active: 35,
    family: "Arena / Mistral",
  },
  {
    key: "solar-10.7b",
    label: "SOLAR 10.7B",
    params: 10.7,
    layers: 48,
    kvHeads: 32,
    headDim: 128,
    active: 10.7,
    family: "Arena / Mistral",
  },
  {
    key: "qwen-14b",
    label: "Qwen 14B Chat",
    params: 14,
    layers: 40,
    kvHeads: 40,
    headDim: 128,
    active: 14,
    family: "Arena / Qwen",
  },
  {
    key: "qwen1.5-4b",
    label: "Qwen1.5 4B Chat",
    params: 4,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 4,
    family: "Arena / Qwen",
  },
  {
    key: "qwen1.5-32b",
    label: "Qwen1.5 32B Chat",
    params: 32,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32,
    family: "Arena / Qwen",
  },
  {
    key: "qwen1.5-110b",
    label: "Qwen1.5 110B Chat",
    params: 110,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 110,
    family: "Arena / Qwen",
  },
  {
    key: "qwen2-72b",
    label: "Qwen2 72B Instruct",
    params: 72,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    active: 72,
    family: "Arena / Qwen",
  },
  {
    key: "qwen2.5-coder-32b",
    label: "Qwen2.5 Coder 32B",
    params: 32.5,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32.5,
    family: "Arena / Qwen",
  },
  {
    key: "qwq-32b",
    label: "QwQ 32B",
    params: 32.5,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32.5,
    family: "Arena / Qwen",
  },
  {
    key: "qwen3-32b",
    label: "Qwen3 32B",
    params: 32.8,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32.8,
    family: "Arena / Qwen",
  },
  {
    key: "qwen3-coder-480b",
    label: "Qwen3 Coder 480B-A35B",
    params: 480,
    layers: 62,
    kvHeads: 8,
    headDim: 128,
    active: 35,
    family: "Arena / Qwen",
  },
  {
    key: "deepseek-llm-67b",
    label: "DeepSeek LLM 67B",
    params: 67,
    layers: 95,
    kvHeads: 95,
    headDim: 128,
    active: 67,
    family: "Arena / DeepSeek",
  },
  {
    key: "deepseek-v2",
    label: "DeepSeek V2 236B-A21B",
    params: 236,
    layers: 60,
    kvHeads: 1,
    headDim: 512,
    active: 21,
    family: "Arena / DeepSeek",
    mla: true,
  },
  {
    key: "deepseek-coder-v2",
    label: "DeepSeek Coder V2 236B-A21B",
    params: 236,
    layers: 60,
    kvHeads: 1,
    headDim: 512,
    active: 21,
    family: "Arena / DeepSeek",
    mla: true,
  },
  {
    key: "deepseek-r1",
    label: "DeepSeek R1 671B-A37B",
    params: 671,
    layers: 61,
    kvHeads: 1,
    headDim: 576,
    active: 37,
    family: "Arena / DeepSeek",
    mla: true,
  },
  {
    key: "yi-34b",
    label: "Yi 34B Chat",
    params: 34,
    layers: 60,
    kvHeads: 56,
    headDim: 128,
    active: 34,
    family: "Arena / Chinese",
  },
  {
    key: "internlm2.5-20b",
    label: "InternLM 2.5 20B",
    params: 20,
    layers: 48,
    kvHeads: 8,
    headDim: 128,
    active: 20,
    family: "Arena / Chinese",
  },
  {
    key: "chatglm3-6b",
    label: "ChatGLM3 6B",
    params: 6,
    layers: 28,
    kvHeads: 2,
    headDim: 128,
    active: 6,
    family: "Arena / Chinese",
  },
  {
    key: "gemma-2-2b",
    label: "Gemma 2 2B",
    params: 2.6,
    layers: 26,
    kvHeads: 4,
    headDim: 256,
    active: 2.6,
    family: "Arena / Gemma",
  },
  {
    key: "gemma-2-9b",
    label: "Gemma 2 9B",
    params: 9.2,
    layers: 42,
    kvHeads: 8,
    headDim: 256,
    active: 9.2,
    family: "Arena / Gemma",
  },
  {
    key: "gemma-2-27b",
    label: "Gemma 2 27B",
    params: 27,
    layers: 46,
    kvHeads: 16,
    headDim: 128,
    active: 27,
    family: "Arena / Gemma",
  },
  {
    key: "gemma-3-12b",
    label: "Gemma 3 12B",
    params: 12,
    layers: 48,
    kvHeads: 8,
    headDim: 256,
    active: 12,
    family: "Arena / Gemma",
  },
  {
    key: "phi-3-mini",
    label: "Phi-3 Mini 3.8B",
    params: 3.8,
    layers: 32,
    kvHeads: 32,
    headDim: 96,
    active: 3.8,
    family: "Arena / Phi",
  },
  {
    key: "phi-3-small",
    label: "Phi-3 Small 7B",
    params: 7,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 7,
    family: "Arena / Phi",
  },
  {
    key: "phi-3-medium",
    label: "Phi-3 Medium 14B",
    params: 14,
    layers: 40,
    kvHeads: 10,
    headDim: 128,
    active: 14,
    family: "Arena / Phi",
  },
  {
    key: "olmo-2-32b",
    label: "OLMo 2 32B",
    params: 32,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32,
    family: "Arena / Other",
  },
  {
    key: "smollm2-1.7b",
    label: "SmolLM2 1.7B",
    params: 1.7,
    layers: 24,
    kvHeads: 3,
    headDim: 128,
    active: 1.7,
    family: "Arena / Other",
  },
  {
    key: "granite-3.1-8b",
    label: "Granite 3.1 8B",
    params: 8,
    layers: 40,
    kvHeads: 8,
    headDim: 128,
    active: 8,
    family: "Arena / Other",
  },
  {
    key: "dbrx",
    label: "DBRX Instruct 132B-A36B",
    params: 132,
    layers: 40,
    kvHeads: 8,
    headDim: 128,
    active: 36,
    family: "Arena / Other",
  },
  {
    key: "snowflake-arctic",
    label: "Snowflake Arctic 480B-A17B",
    params: 480,
    layers: 35,
    kvHeads: 8,
    headDim: 128,
    active: 17,
    family: "Arena / Other",
  },
  {
    key: "command-r",
    label: "Command R 35B",
    params: 35,
    layers: 40,
    kvHeads: 8,
    headDim: 128,
    active: 35,
    family: "Arena / Other",
  },
  {
    key: "command-r-plus",
    label: "Command R+ 104B",
    params: 104,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 104,
    family: "Arena / Other",
  },
  {
    key: "aya-expanse-8b",
    label: "Aya Expanse 8B",
    params: 8,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 8,
    family: "Arena / Other",
  },
  {
    key: "aya-expanse-32b",
    label: "Aya Expanse 32B",
    params: 32,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    active: 32,
    family: "Arena / Other",
  },
  {
    key: "jamba-1.5-mini",
    label: "Jamba 1.5 Mini 52B-A12B",
    params: 52,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    active: 12,
    family: "Arena / Other",
  },
  {
    key: "falcon-40b",
    label: "Falcon 40B Instruct",
    params: 40,
    layers: 60,
    kvHeads: 1,
    headDim: 64,
    active: 40,
    family: "Arena / Other",
  },
  {
    key: "falcon-180b",
    label: "Falcon 180B Chat",
    params: 180,
    layers: 80,
    kvHeads: 1,
    headDim: 64,
    active: 180,
    family: "Arena / Other",
  },
  {
    key: "mpt-30b",
    label: "MPT 30B Instruct",
    params: 30,
    layers: 48,
    kvHeads: 1,
    headDim: 128,
    active: 30,
    family: "Arena / Other",
  },
]

calculatorModels.push(...arenaOpenModels)

const calculatorGpus = [
  {
    key: "rtx-3060",
    label: "RTX 3060 (12 GB)",
    vram: 12,
    bandwidth: 360,
    tflops: 13,
    power: 170,
    rental: 0.16,
  },
  {
    key: "rtx-4060-ti",
    label: "RTX 4060 Ti (16 GB)",
    vram: 16,
    bandwidth: 288,
    tflops: 22.1,
    power: 165,
    rental: 0.28,
  },
  {
    key: "rtx-4070-ti",
    label: "RTX 4070 Ti Super (16 GB)",
    vram: 16,
    bandwidth: 672,
    tflops: 44.1,
    power: 285,
    rental: 0.42,
  },
  {
    key: "rtx-4090",
    label: "RTX 4090 (24 GB)",
    vram: 24,
    bandwidth: 1008,
    tflops: 82.6,
    power: 450,
    rental: 0.69,
  },
  {
    key: "rtx-5090",
    label: "RTX 5090 (32 GB)",
    vram: 32,
    bandwidth: 1792,
    tflops: 104.8,
    power: 575,
    rental: 1.05,
  },
  {
    key: "rtx-6000",
    label: "RTX 6000 Ada (48 GB)",
    vram: 48,
    bandwidth: 960,
    tflops: 91.6,
    power: 300,
    rental: 1.15,
  },
  {
    key: "a100-80",
    label: "NVIDIA A100 (80 GB)",
    vram: 80,
    bandwidth: 2039,
    tflops: 312,
    power: 400,
    rental: 1.79,
  },
  {
    key: "l40s",
    label: "NVIDIA L40S (48 GB)",
    vram: 48,
    bandwidth: 864,
    tflops: 362,
    power: 350,
    rental: 1.05,
  },
  {
    key: "h100-80",
    label: "NVIDIA H100 (80 GB)",
    vram: 80,
    bandwidth: 3350,
    tflops: 989,
    power: 700,
    rental: 2.69,
  },
  {
    key: "h200",
    label: "NVIDIA H200 (141 GB)",
    vram: 141,
    bandwidth: 4800,
    tflops: 989,
    power: 700,
    rental: 3.35,
  },
  {
    key: "b200",
    label: "NVIDIA B200 (180 GB)",
    vram: 180,
    bandwidth: 8000,
    tflops: 2250,
    power: 1000,
    rental: 4.95,
  },
  {
    key: "b300",
    label: "NVIDIA B300 (288 GB)",
    vram: 288,
    bandwidth: 8000,
    tflops: 2500,
    power: 1400,
    rental: 7.5,
  },
  {
    key: "rtx-pro-6000-blackwell",
    label: "RTX PRO 6000 Blackwell (96 GB)",
    vram: 96,
    bandwidth: 1792,
    tflops: 125,
    power: 600,
    rental: 2.25,
  },
  {
    key: "m4-max",
    label: "Apple M4 Max (128 GB unified)",
    vram: 96,
    bandwidth: 546,
    tflops: 38,
    power: 110,
    rental: 1.2,
  },
  {
    key: "m3-ultra",
    label: "Apple M3 Ultra (512 GB unified)",
    vram: 384,
    bandwidth: 819,
    tflops: 54,
    power: 180,
    rental: 2.4,
  },
  {
    key: "custom",
    label: "Custom GPU",
    vram: 24,
    bandwidth: 1008,
    tflops: 82.6,
    power: 450,
    rental: 0,
  },
]

const bytesByPrecision: Record<string, number> = {
  fp32: 4,
  fp16: 2,
  fp8: 1,
  int8: 1,
  q8: 1.06,
  q6: 0.75,
  q5: 0.69,
  q4: 0.56,
  q3: 0.48,
  int4: 0.5,
  nvfp4: 0.5,
  fp4: 0.5,
}
const formatGb = (value: number) => `${value < 10 ? value.toFixed(2) : value.toFixed(1)} GB`
const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(Math.round(value))
const modelAuthor = (model: CalculatorModel) => {
  const key = model.key
  if (key.includes("nemotron")) return "NVIDIA"
  if (key.startsWith("tulu") || key.startsWith("olmo")) return "AllenAI"
  if (
    key.startsWith("vicuna") ||
    key.startsWith("wizard") ||
    key.startsWith("codellama") ||
    key.startsWith("llama")
  )
    return "Meta"
  if (key.startsWith("qwen") || key.startsWith("qwq")) return "Alibaba / Qwen"
  if (
    key.startsWith("mistral") ||
    key.startsWith("mixtral") ||
    key.startsWith("zephyr") ||
    key.startsWith("solar")
  )
    return "Mistral AI"
  if (key.startsWith("deepseek")) return "DeepSeek"
  if (key.startsWith("glm")) return "Z.ai"
  if (key.startsWith("gemma")) return "Google"
  if (key.startsWith("phi")) return "Microsoft"
  if (key.startsWith("gpt-oss")) return "OpenAI"
  if (key.startsWith("yi")) return "01.AI"
  if (key.startsWith("internlm")) return "InternLM"
  if (key.startsWith("chatglm")) return "THUDM"
  if (key.startsWith("command") || key.startsWith("aya")) return "Cohere"
  if (key.startsWith("granite")) return "IBM"
  if (key.startsWith("dbrx")) return "Databricks"
  if (key.startsWith("snowflake")) return "Snowflake"
  if (key.startsWith("jamba")) return "AI21 Labs"
  if (key.startsWith("falcon")) return "TII"
  if (key.startsWith("mpt")) return "MosaicML"
  if (key.startsWith("smollm")) return "Hugging Face"
  return "Community / other"
}

function setupInferenceCalculator() {
  if (document.body.dataset.slug !== "inference-calculator") return
  const root = document.querySelector<HTMLElement>("[data-calculator-root]")
  const form = root?.querySelector<HTMLFormElement>("[data-calculator-form]")
  if (!root || !form || root.dataset.initialized) return
  root.dataset.initialized = "true"

  const get = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement
  const modelSelect = get("model") as HTMLSelectElement
  const gpuSelect = get("gpu") as HTMLSelectElement
  const prefillGpuSelect = get("prefillGpu") as HTMLSelectElement
  const decodeGpuSelect = get("decodeGpu") as HTMLSelectElement
  const cleanups: (() => void)[] = []
  let mode = "inference"
  let hardwareMode = "single"
  let pdMode = "unified"
  let customModel = false

  const modelGroups = new Map<string, HTMLOptGroupElement>()
  calculatorModels.forEach((model) => {
    const author = modelAuthor(model)
    let group = modelGroups.get(author)
    if (!group) {
      group = document.createElement("optgroup")
      group.label = author
      modelGroups.set(author, group)
      modelSelect.add(group)
    }
    group.append(new Option(model.label, model.key))
  })
  calculatorGpus.forEach((gpu) => {
    gpuSelect.add(new Option(gpu.label, gpu.key))
    prefillGpuSelect.add(new Option(gpu.label, gpu.key))
    decodeGpuSelect.add(new Option(gpu.label, gpu.key))
  })
  modelSelect.value = "llama-3.1-8b"
  gpuSelect.value = "rtx-4090"
  prefillGpuSelect.value = gpuSelect.value
  decodeGpuSelect.value = gpuSelect.value

  const setText = (name: string, value: string) => {
    root
      .querySelectorAll<HTMLElement>(`[data-result="${name}"]`)
      .forEach((node) => (node.textContent = value))
  }
  const renderMemory = (items: [string, number][]) => {
    const panel = root.querySelector<HTMLElement>("[data-result-panel=memory]")!
    const total = items.reduce((sum, [, value]) => sum + value, 0) || 1
    panel.innerHTML = items
      .map(
        ([label, value]) =>
          `<p><span>${label}</span><b>${formatGb(value)} (${((value / total) * 100).toFixed(0)}%)</b></p>`,
      )
      .join("")
  }
  const value = (name: string) => Number((get(name) as HTMLInputElement).value)
  const checked = (name: string) => (get(name) as HTMLInputElement).checked
  const selected = (name: string) => (get(name) as HTMLSelectElement).value
  const syncParallelismCaps = () => {
    const availableGpus =
      pdMode === "disaggregated"
        ? value("decodeGpus")
        : hardwareMode === "cluster"
          ? value("nodes") * value("gpusPerNode")
          : value("numGpus")
    const tp = get("tpDegree") as HTMLInputElement
    const pp = get("ppDegree") as HTMLInputElement
    const capacity = Math.max(1, Math.floor(availableGpus))
    const maxPp = Math.max(1, Math.floor(capacity / Math.max(1, Number(tp.value))))
    pp.max = String(maxPp)
    if (Number(pp.value) > maxPp) pp.value = String(maxPp)
    const maxTp = Math.max(1, Math.floor(capacity / Math.max(1, Number(pp.value))))
    tp.max = String(maxTp)
    if (Number(tp.value) > maxTp) tp.value = String(maxTp)
    root.querySelectorAll<HTMLInputElement>("[data-parallelism-value]").forEach((input) => {
      const degree = input.dataset.parallelismValue!
      const slider = get(degree) as HTMLInputElement
      input.max = slider.max
      input.value = slider.value
    })
  }

  function calculate() {
    const selectedModel = calculatorModels.find((item) => item.key === modelSelect.value)!
    const model = customModel
      ? {
          ...selectedModel,
          params: value("parameters"),
          layers: value("layers"),
          kvHeads: value("kvHeads"),
          headDim: value("headDim"),
          active: value("parameters"),
        }
      : selectedModel
    const resolveGpu = (key: string) => {
      const chosenGpu = calculatorGpus.find((item) => item.key === key)!
      return chosenGpu.key === "custom"
        ? {
            ...chosenGpu,
            vram: value("vram"),
            bandwidth: value("bandwidth"),
            tflops: value("tflops"),
            power: value("power"),
          }
        : chosenGpu
    }
    const baseGpu = resolveGpu(gpuSelect.value)
    const prefillGpu = pdMode === "disaggregated" ? resolveGpu(prefillGpuSelect.value) : baseGpu
    const decodeGpu = pdMode === "disaggregated" ? resolveGpu(decodeGpuSelect.value) : baseGpu
    const gpu = decodeGpu
    const unifiedGpus =
      hardwareMode === "cluster" ? value("nodes") * value("gpusPerNode") : value("numGpus")
    const prefillGpus = pdMode === "disaggregated" ? value("prefillGpus") : unifiedGpus
    const decodeGpus = pdMode === "disaggregated" ? value("decodeGpus") : unifiedGpus
    const numGpus = decodeGpus
    const totalDevices = pdMode === "disaggregated" ? prefillGpus + decodeGpus : numGpus
    const batch = value("batchSize")
    const sequence = value("sequenceLength")
    const users = mode === "inference" ? value("concurrentUsers") : 1
    const precision =
      mode === "inference" ? selected("weightPrecision") : selected("trainingPrecision")
    const weightBytes = bytesByPrecision[precision] ?? 2
    const kvBytes = bytesByPrecision[selected("kvPrecision")] ?? 2
    const offloadRatio = checked("offloading")
      ? Math.min(0.9, value("offloadLayers") / Math.max(1, model.layers))
      : 0
    const offloadKvRatio =
      mode === "inference" && checked("offloading") && checked("offloadKvCache") ? 1 : 0
    let weights = model.params * weightBytes
    const fullContextLayers = model.layers - (model.slidingLayers ?? 0)
    const cacheTokenLayers =
      fullContextLayers * sequence +
      (model.slidingLayers ?? 0) * Math.min(sequence, model.slidingWindow ?? sequence)
    let kvCache =
      (2 * cacheTokenLayers * model.kvHeads * model.headDim * batch * users * kvBytes) / 1e9
    if (model.mla)
      kvCache = (model.layers * model.headDim * sequence * batch * users * kvBytes) / 1e9
    if (checked("prefixCaching"))
      kvCache *=
        1 - (Math.min(1, value("sharedPrefix") / 100) * Math.max(0, users - 1)) / Math.max(1, users)
    const offloadedKvCache = kvCache * offloadKvRatio
    kvCache -= offloadedKvCache
    let activations = Math.max(
      0.15,
      (model.params * 0.012 + sequence * batch * 0.000008) *
        (checked("continuousBatching") ? 1.12 : 1),
    )
    let framework = Math.max(0.45, weights * 0.06 + 0.35)
    let trainingTime = "N/A"
    let trainingTps = 0
    let memory: [string, number][]

    if (mode === "finetuning") {
      const trainingMethod = selected("trainingMethod")
      const trainable =
        trainingMethod === "full"
          ? model.params
          : model.params * (trainingMethod === "qlora" ? 0.002 : 0.004) * (value("loraRank") / 16)
      const baseWeights = model.params * (trainingMethod === "qlora" ? 0.56 : weightBytes)
      const gradients = trainingMethod === "full" ? model.params * 2 : trainable * 2
      const optimizer = trainingMethod === "full" ? model.params * 8 : trainable * 8
      activations =
        (model.params * 0.03 + sequence * batch * 0.00003) *
        (checked("checkpointing") ? 0.45 : 1) *
        (checked("flashAttention") ? 0.7 : 1)
      weights = baseWeights
      framework = Math.max(0.8, baseWeights * 0.08)
      kvCache = 0
      memory = [
        ["Base Model Weights", baseWeights],
        ["Gradients", gradients],
        ["Optimizer States", optimizer],
        ["Activations", activations],
        ["Framework Overhead", framework],
      ]
      trainingTps = Math.max(
        0.1,
        ((gpu.tflops * numGpus * 700) /
          (model.active * 1e3 * (sequence / 1024) * Math.sqrt(batch))) *
          (1 + Math.log2(value("gradientAccumulation")) * 0.04),
      )
      const totalTokens = value("samples") * sequence * value("epochs")
      trainingTime = `${(totalTokens / trainingTps / 3600).toFixed(1)} hours`
    } else {
      memory = [
        ["Base Model Weights", weights],
        ["KV Cache", kvCache],
        ["Activations", activations],
        ["Framework Overhead", framework],
      ]
    }
    const offloadedWeights = memory[0][1] * offloadRatio
    memory[0][1] -= offloadedWeights
    const tpDegree = Math.min(numGpus, Math.max(1, value("tpDegree")))
    const ppDegree = Math.min(numGpus, Math.max(1, value("ppDegree")))
    const used = memory.reduce((sum, [, amount]) => sum + amount, 0) / Math.max(1, numGpus)
    const usableVram = checked("staticVram")
      ? gpu.vram * (value("staticVramTarget") / 100)
      : gpu.vram
    const percentage = (used / usableVram) * 100
    const prefillUsed =
      memory.reduce((sum, [, amount]) => sum + amount, 0) / Math.max(1, prefillGpus)
    const prefillUsableVram = checked("staticVram")
      ? prefillGpu.vram * (value("staticVramTarget") / 100)
      : prefillGpu.vram
    const prefillPercentage = (prefillUsed / prefillUsableVram) * 100
    const worstPercentage = Math.max(percentage, prefillPercentage)
    const status =
      worstPercentage > 100
        ? "INSUFFICIENT"
        : worstPercentage > 90
          ? "VERY HIGH"
          : worstPercentage > 75
            ? "HIGH"
            : worstPercentage > 50
              ? "MODERATE"
              : "READY"
    const interconnectPenalty =
      {
        ethernet10: 0.32,
        ethernet: 0.12,
        ethernet400: 0.06,
        infiniband: 0.03,
        "infiniband-ndr": 0.015,
        nvlink: 0,
      }[selected("interconnect")] ?? 0.12
    const gpuInterconnectBonus =
      {
        pcie4: 0,
        pcie5: 0.03,
        nvlink4: 0.08,
        nvlink5: 0.11,
      }[selected("gpuInterconnect")] ?? 0
    const parallelPenalty =
      numGpus > 1 ? Math.min(0.98, 0.88 - interconnectPenalty + gpuInterconnectBonus) : 1
    const offloadPenalty = offloadRatio
      ? 1 - offloadRatio * (selected("offloadTarget") === "nvme" ? 0.7 : 0.35)
      : 1
    const kvOffloadPenalty = offloadKvRatio
      ? selected("offloadTarget") === "nvme"
        ? 0.45
        : 0.72
      : 1
    const speculativeBoost = checked("speculativeDecoding")
      ? 1 + Math.min(0.75, value("draftTokens") * 0.08)
      : 1
    const decodeTps = Math.max(
      0.1,
      ((gpu.bandwidth *
        numGpus *
        parallelPenalty *
        offloadPenalty *
        kvOffloadPenalty *
        speculativeBoost) /
        Math.max(0.1, model.active * weightBytes)) *
        (1 / (1 + batch * 0.035)),
    )
    const throughput =
      mode === "finetuning"
        ? trainingTps
        : decodeTps * Math.min(batch, users) * (checked("continuousBatching") ? 1.15 : 1)
    const perUser = mode === "finetuning" ? trainingTps : throughput / users
    const ttft = Math.max(
      5,
      (model.active * weightBytes * sequence * 1000) /
        Math.max(1, prefillGpu.bandwidth * prefillGpus * 80),
    )
    const ring = root!.querySelector<HTMLElement>("[data-vram-ring]")!
    ring.style.setProperty("--vram-progress", `${Math.min(100, worstPercentage)}%`)
    ring.dataset.status = status.toLowerCase().replace(" ", "-")
    setText("vramPercent", `${worstPercentage.toFixed(1)}%`)
    setText("status", status)
    setText("vramUsage", formatGb(used))
    setText("vramCapacity", formatGb(gpu.vram))
    const fitMessage =
      worstPercentage > 100
        ? `At least one serving stage exceeds its usable VRAM target. Increase stage devices, reduce precision, or offload weights.`
        : worstPercentage > 90
          ? `Fits, but leaves only ${formatGb(usableVram - used)} usable VRAM headroom per device.`
          : `Decode leaves ${formatGb(usableVram - used)} usable VRAM headroom per device.${pdMode === "disaggregated" ? ` Prefill leaves ${formatGb(prefillUsableVram - prefillUsed)}.` : ""}${offloadedWeights ? ` ${formatGb(offloadedWeights)} weights offloaded to ${selected("offloadTarget") === "nvme" ? "NVMe" : "CPU RAM"}.` : ""}${offloadedKvCache ? ` ${formatGb(offloadedKvCache)} KV cache offloaded.` : ""}`
    setText("fitMessage", fitMessage)
    setText(
      "modelSummary",
      `${customModel ? "Custom model" : model.label} | ${model.params.toFixed(model.params < 10 ? 1 : 0)}B total params${model.active !== model.params ? `, ${model.active.toFixed(1)}B active` : ""} | ${model.mla ? "MLA cache" : `${model.layers} layers, ${model.kvHeads} KV heads`}${numGpus > 1 ? ` | TP ${tpDegree}, PP ${ppDegree}` : ""}${pdMode === "disaggregated" ? ` | P/D ${prefillGpus}/${decodeGpus}` : ""}`,
    )
    root!.querySelector<HTMLElement>(".memory-status")!.dataset.status = status
      .toLowerCase()
      .replace(" ", "-")
    setText(
      "generationSpeed",
      mode === "finetuning" ? `${trainingTps.toFixed(1)} tok/s` : `~${decodeTps.toFixed(1)} tok/s`,
    )
    setText("ttft", mode === "finetuning" ? "N/A" : `~${Math.round(ttft)} ms`)
    setText("throughput", `${throughput.toFixed(1)} tok/s`)
    setText("perUserSpeed", `${perUser.toFixed(1)} tok/s`)
    const utilization = mode === "finetuning" ? 0.92 : 0.65
    const stagePower =
      pdMode === "disaggregated"
        ? prefillGpu.power * prefillGpus + decodeGpu.power * decodeGpus
        : gpu.power * totalDevices
    setText("power", `${Math.round(stagePower * utilization)} W`)
    const stageRental =
      pdMode === "disaggregated"
        ? prefillGpu.rental * prefillGpus + decodeGpu.rental * decodeGpus
        : gpu.rental * totalDevices
    setText("rental", stageRental ? `$${stageRental.toFixed(2)} / hour` : "Custom hardware")
    setText("trainingTime", trainingTime)
    renderMemory(memory)
  }

  const syncOutputs = () =>
    root.querySelectorAll<HTMLOutputElement>("[data-output]").forEach((output) => {
      const input = get(output.dataset.output!) as HTMLInputElement
      output.value =
        output.dataset.output === "sequenceLength" ? formatNumber(Number(input.value)) : input.value
    })
  const update = () => {
    form.querySelectorAll<HTMLInputElement>('input[type="number"]').forEach((input) => {
      const minimum = Number(input.min || 0)
      const maximum = input.max ? Number(input.max) : Infinity
      const numericValue = Number(input.value)
      input.value = String(
        Math.min(
          maximum,
          Math.max(minimum, Number.isFinite(numericValue) ? numericValue : minimum),
        ),
      )
    })
    syncParallelismCaps()
    syncOutputs()
    calculate()
  }
  const on = (element: Element, event: string, listener: EventListener) => {
    element.addEventListener(event, listener)
    cleanups.push(() => element.removeEventListener(event, listener))
  }

  const onFormChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const degree = target.dataset.parallelismValue
    if (degree) (get(degree) as HTMLInputElement).value = target.value
    update()
  }
  on(form, "input", onFormChange)
  on(form, "change", onFormChange)
  root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) =>
    on(button, "click", () => {
      mode = button.dataset.mode!
      root.querySelectorAll("[data-mode]").forEach((tab) => {
        tab.classList.toggle("active", (tab as HTMLElement).dataset.mode === mode)
        tab.setAttribute("aria-selected", String((tab as HTMLElement).dataset.mode === mode))
      })
      root
        .querySelectorAll<HTMLElement>(".inference-only, .finetuning-only")
        .forEach((field) => (field.hidden = !field.classList.contains(`${mode}-only`)))
      syncOffloadFields()
      update()
    }),
  )
  root.querySelectorAll<HTMLButtonElement>("[data-hardware-mode]").forEach((button) =>
    on(button, "click", () => {
      hardwareMode = button.dataset.hardwareMode!
      root
        .querySelectorAll("[data-hardware-mode]")
        .forEach((control) =>
          control.classList.toggle(
            "active",
            (control as HTMLElement).dataset.hardwareMode === hardwareMode,
          ),
        )
      root.querySelector<HTMLElement>(".cluster-fields")!.hidden = hardwareMode !== "cluster"
      root.querySelector<HTMLElement>("[data-single-rig-control]")!.hidden =
        hardwareMode === "cluster" || pdMode === "disaggregated"
      update()
    }),
  )
  root.querySelectorAll<HTMLButtonElement>("[data-pd-mode]").forEach((button) =>
    on(button, "click", () => {
      pdMode = button.dataset.pdMode!
      root
        .querySelectorAll("[data-pd-mode]")
        .forEach((control) =>
          control.classList.toggle("active", (control as HTMLElement).dataset.pdMode === pdMode),
        )
      root.querySelector<HTMLElement>("[data-pd-fields]")!.hidden = pdMode !== "disaggregated"
      root.querySelector<HTMLElement>("[data-single-rig-control]")!.hidden =
        hardwareMode === "cluster" || pdMode === "disaggregated"
      update()
    }),
  )
  root.querySelectorAll<HTMLButtonElement>("[data-model-source]").forEach((button) =>
    on(button, "click", () => {
      customModel = button.dataset.modelSource === "custom"
      modelSelect.disabled = customModel
      root.querySelector<HTMLElement>("[data-custom-fields]")!.hidden = !customModel
      root
        .querySelectorAll("[data-model-source]")
        .forEach((control) =>
          control.classList.toggle(
            "active",
            (control as HTMLElement).dataset.modelSource === (customModel ? "custom" : "preset"),
          ),
        )
      update()
    }),
  )
  on(gpuSelect, "change", () => {
    syncCustomGpuFields()
    update()
  })
  const syncCustomGpuFields = () => {
    root.querySelector<HTMLElement>("[data-custom-gpu]")!.hidden =
      gpuSelect.value !== "custom" &&
      prefillGpuSelect.value !== "custom" &&
      decodeGpuSelect.value !== "custom"
  }
  on(prefillGpuSelect, "change", () => {
    syncCustomGpuFields()
    update()
  })
  on(decodeGpuSelect, "change", () => {
    syncCustomGpuFields()
    update()
  })
  const syncOffloadFields = () => {
    root.querySelectorAll<HTMLElement>("[data-offload-field]").forEach((field) => {
      field.hidden =
        !checked("offloading") ||
        (field.classList.contains("inference-only") && mode !== "inference")
    })
  }
  on(get("offloading"), "change", () => {
    syncOffloadFields()
    update()
  })
  on(root.querySelector("[data-recommend-setup]")!, "click", () => {
    const selectedModel = calculatorModels.find((item) => item.key === modelSelect.value)!
    const params = customModel ? value("parameters") : selectedModel.params
    const layers = customModel ? value("layers") : selectedModel.layers
    const kvHeads = customModel ? value("kvHeads") : selectedModel.kvHeads
    const headDim = customModel ? value("headDim") : selectedModel.headDim
    const weightGb = params * (bytesByPrecision[selected("weightPrecision")] ?? 2)
    const kvGb =
      (2 *
        layers *
        kvHeads *
        headDim *
        value("sequenceLength") *
        value("batchSize") *
        value("concurrentUsers") *
        (bytesByPrecision[selected("kvPrecision")] ?? 2)) /
      1e9
    const requiredGb =
      (weightGb + kvGb + Math.max(1, weightGb * 0.08)) / (checked("offloading") ? 2 : 1)
    const recommendation = calculatorGpus
      .filter((gpu) => gpu.key !== "custom" && gpu.rental > 0)
      .flatMap((gpu) => {
        const devices = Math.ceil(requiredGb / gpu.vram)
        const totalDevices = pdMode === "disaggregated" ? devices * 2 : devices
        return totalDevices <= 8
          ? [{ gpu, devices, totalDevices, cost: totalDevices * gpu.rental }]
          : []
      })
      .sort((a, b) => a.cost - b.cost)[0]
    const recommendationMessage = root.querySelector<HTMLElement>("[data-recommendation]")!
    if (!recommendation) {
      recommendationMessage.textContent = "No cataloged setup fits this workload within 8 devices."
      return
    }
    gpuSelect.value = recommendation.gpu.key
    if (pdMode === "disaggregated") {
      ;(get("prefillGpus") as HTMLInputElement).value = String(recommendation.devices)
      ;(get("decodeGpus") as HTMLInputElement).value = String(recommendation.devices)
    } else if (hardwareMode === "cluster") {
      ;(get("nodes") as HTMLInputElement).value = "1"
      ;(get("gpusPerNode") as HTMLInputElement).value = String(recommendation.devices)
    } else {
      const gpuCountInput = get("numGpus") as HTMLInputElement
      gpuCountInput.value = String(recommendation.devices)
    }
    root.querySelector<HTMLElement>("[data-custom-gpu]")!.hidden = true
    recommendationMessage.textContent =
      pdMode === "disaggregated"
        ? `Recommended: ${recommendation.totalDevices}x ${recommendation.gpu.label} (${recommendation.devices} prefill + ${recommendation.devices} decode, $${recommendation.cost.toFixed(2)} / hour).`
        : `Recommended: ${recommendation.devices}x ${recommendation.gpu.label} ($${recommendation.cost.toFixed(2)} / hour).`
    update()
  })
  root.querySelectorAll<HTMLButtonElement>("[data-result-tab]").forEach((button) =>
    on(button, "click", () => {
      const tab = button.dataset.resultTab!
      root
        .querySelectorAll("[data-result-tab]")
        .forEach((control) =>
          control.classList.toggle("active", (control as HTMLElement).dataset.resultTab === tab),
        )
      root
        .querySelectorAll<HTMLElement>("[data-result-panel]")
        .forEach((panel) => (panel.hidden = panel.dataset.resultPanel !== tab))
    }),
  )
  const updateCalculatorFocus = () => {
    const bounds = root.getBoundingClientRect()
    document.body.classList.toggle("calculator-focus", bounds.top <= 140 && bounds.bottom > 140)
  }
  window.addEventListener("scroll", updateCalculatorFocus, { passive: true })
  updateCalculatorFocus()
  cleanups.push(() => {
    window.removeEventListener("scroll", updateCalculatorFocus)
    document.body.classList.remove("calculator-focus")
  })
  syncOffloadFields()
  // Quartz installs addCleanup later in the aggregated postscript.
  queueMicrotask(() => window.addCleanup?.(() => cleanups.forEach((cleanup) => cleanup())))
  update()
}

document.addEventListener("nav", setupInferenceCalculator)
setupInferenceCalculator()
