import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/inferenceCalculator.inline"
import style from "./styles/inferenceCalculator.scss"

const InferenceCalculator: QuartzComponent = () => (
  <section class="inference-calculator" data-calculator-root>
    <div class="calculator-tabs" role="tablist" aria-label="Calculator mode">
      <button class="active" data-mode="inference" role="tab" aria-selected="true">
        Inference
      </button>
      <button data-mode="finetuning" role="tab" aria-selected="false">
        Fine-tuning
      </button>
    </div>
    <div class="calculator-grid">
      <form class="calculator-controls" data-calculator-form>
        <div class="control-row">
          <label>
            <span>
              Select Model <b>*</b>
            </span>
            <select name="model" aria-label="Select model"></select>
          </label>
          <div class="model-source" role="group" aria-label="Model source">
            <button type="button" class="active" data-model-source="preset">
              Predefined model
            </button>
            <button type="button" data-model-source="custom">
              Custom model
            </button>
          </div>
        </div>
        <div class="custom-model-fields" data-custom-fields hidden>
          <label>
            Parameters (billions)
            <input name="parameters" type="number" min="0.1" step="0.1" value="8" />
          </label>
          <label>
            Layers
            <input name="layers" type="number" min="1" step="1" value="32" />
          </label>
          <label>
            KV heads
            <input name="kvHeads" type="number" min="1" step="1" value="8" />
          </label>
          <label>
            Head dimension
            <input name="headDim" type="number" min="1" step="1" value="128" />
          </label>
        </div>
        <div class="inference-only control-pair">
          <label>
            <span>Inference Quantization</span>
            <small>Precision for model weights during inference.</small>
            <select name="weightPrecision" aria-label="Inference quantization">
              <option value="fp32">FP32</option>
              <option value="fp16" selected>
                FP16 / BF16
              </option>
              <option value="fp8">FP8</option>
              <option value="int8">INT8</option>
              <option value="q8">Q8_0</option>
              <option value="q6">Q6</option>
              <option value="q5">Q5_K_M</option>
              <option value="q4">Q4_K_M</option>
              <option value="q3">Q3_K_M</option>
              <option value="int4">INT4 / NF4</option>
              <option value="nvfp4">NVFP4</option>
            </select>
          </label>
          <label>
            <span>KV Cache Quantization</span>
            <small>Lower values reduce memory for long contexts.</small>
            <select name="kvPrecision" aria-label="KV cache quantization">
              <option value="fp16" selected>
                FP16 / BF16
              </option>
              <option value="fp8">FP8</option>
              <option value="int8">INT8</option>
              <option value="int4">INT4</option>
              <option value="fp4">FP4</option>
            </select>
          </label>
        </div>
        <div class="finetuning-only control-pair" hidden>
          <label>
            <span>Fine-tuning Method</span>
            <select name="trainingMethod">
              <option value="full">Full fine-tuning</option>
              <option value="lora" selected>
                LoRA
              </option>
              <option value="qlora">QLoRA</option>
            </select>
          </label>
          <label>
            <span>Base Model Precision</span>
            <select name="trainingPrecision">
              <option value="fp32">FP32</option>
              <option value="fp16" selected>
                FP16 / BF16
              </option>
              <option value="fp8">FP8</option>
              <option value="int4">NF4</option>
            </select>
          </label>
          <label>
            <span>LoRA rank</span>
            <input name="loraRank" type="number" min="1" max="1024" value="16" />
          </label>
          <label>
            <span>Gradient accumulation</span>
            <input name="gradientAccumulation" type="number" min="1" max="128" value="1" />
          </label>
        </div>
        <fieldset class="hardware-fields">
          <legend>Hardware Configuration</legend>
          <div class="segmented" role="group" aria-label="Hardware configuration">
            <button type="button" class="active" data-hardware-mode="single">
              Single Rig
            </button>
            <button type="button" data-hardware-mode="cluster">
              Cluster
            </button>
          </div>
          <div class="cluster-topology">
            <span>Serving architecture</span>
            <div class="pd-mode segmented" role="group" aria-label="Cluster serving topology">
              <button type="button" class="active" data-pd-mode="unified">
                Unified serving
              </button>
              <button type="button" data-pd-mode="disaggregated">
                Disaggregated P/D
              </button>
            </div>
            <small>Separate prefill and decode workers for high-concurrency serving.</small>
          </div>
          <div class="control-pair">
            <label>
              <span>Device / GPU</span>
              <small>Select a GPU or define custom hardware.</small>
              <select name="gpu" aria-label="Device or GPU"></select>
              <button type="button" class="recommend-setup" data-recommend-setup>
                Recommend setup
              </button>
              <small data-recommendation aria-live="polite"></small>
            </label>
            <label data-single-rig-control>
              <span>Num GPUs</span>
              <small>Devices for parallel inference.</small>
              <input name="numGpus" type="number" min="1" max="128" value="1" />
            </label>
          </div>
          <div class="pd-fields" data-pd-fields hidden>
            <label>
              Prefill device / GPU
              <select name="prefillGpu" aria-label="Prefill device or GPU"></select>
            </label>
            <label>
              Prefill GPUs
              <input name="prefillGpus" type="number" min="1" max="128" value="1" />
            </label>
            <label>
              Decode device / GPU
              <select name="decodeGpu" aria-label="Decode device or GPU"></select>
            </label>
            <label>
              Decode GPUs
              <input name="decodeGpus" type="number" min="1" max="128" value="1" />
            </label>
          </div>
          <div class="cluster-fields" hidden>
            <label>
              Nodes
              <input name="nodes" type="number" min="1" max="64" value="2" />
            </label>
            <label>
              GPUs per node
              <input name="gpusPerNode" type="number" min="1" max="32" value="4" />
            </label>
            <label>
              <span>
                Pipeline parallelism (PP) <output data-output="ppDegree">1</output>
              </span>
              <div class="parallelism-control">
                <input
                  name="ppDegree"
                  type="range"
                  min="1"
                  max="128"
                  value="1"
                  aria-label="Pipeline parallelism slider"
                />
                <input
                  data-parallelism-value="ppDegree"
                  type="number"
                  min="1"
                  max="128"
                  value="1"
                  aria-label="Pipeline parallelism value"
                />
              </div>
            </label>
            <label>
              <span>
                Tensor parallelism (TP) <output data-output="tpDegree">1</output>
              </span>
              <div class="parallelism-control">
                <input
                  name="tpDegree"
                  type="range"
                  min="1"
                  max="128"
                  value="1"
                  aria-label="Tensor parallelism slider"
                />
                <input
                  data-parallelism-value="tpDegree"
                  type="number"
                  min="1"
                  max="128"
                  value="1"
                  aria-label="Tensor parallelism value"
                />
              </div>
            </label>
            <small class="parallelism-hint">TP x PP cannot exceed the available decode GPUs.</small>
            <label>
              GPU interconnect
              <select name="gpuInterconnect">
                <option value="pcie4">PCIe 4.0 x16 (64 GB/s)</option>
                <option value="pcie5" selected>
                  PCIe 5.0 x16 (128 GB/s)
                </option>
                <option value="nvlink4">NVLink Gen 4</option>
                <option value="nvlink5">NVLink Gen 5</option>
              </select>
            </label>
            <label>
              Inter-node interconnect
              <select name="interconnect">
                <option value="ethernet10">Ethernet 10 Gb/s</option>
                <option value="ethernet">Ethernet 100 Gb/s</option>
                <option value="ethernet400">Ethernet 400 Gb/s</option>
                <option value="infiniband" selected>
                  InfiniBand HDR
                </option>
                <option value="nvlink">NVLink</option>
                <option value="infiniband-ndr">InfiniBand NDR</option>
              </select>
            </label>
          </div>
          <div class="custom-gpu-fields" data-custom-gpu hidden>
            <label>
              VRAM (GB)
              <input name="vram" type="number" min="1" value="24" />
            </label>
            <label>
              Bandwidth (GB/s)
              <input name="bandwidth" type="number" min="1" value="1008" />
            </label>
            <label>
              FP16 TFLOPS
              <input name="tflops" type="number" min="1" value="82.6" />
            </label>
            <label>
              Power (W)
              <input name="power" type="number" min="1" value="450" />
            </label>
          </div>
        </fieldset>
        <div class="workload-fields">
          <label>
            <span>
              Batch Size <output data-output="batchSize">1</output>
            </span>
            <input
              name="batchSize"
              type="range"
              min="1"
              max="64"
              value="1"
              aria-label="Batch Size"
            />
            <small>Inputs processed simultaneously per step.</small>
          </label>
          <label>
            <span>
              Sequence Length <output data-output="sequenceLength">2,048</output>
            </span>
            <input
              name="sequenceLength"
              type="range"
              min="256"
              max="131072"
              step="256"
              value="2048"
              aria-label="Sequence Length"
            />
            <small>Maximum tokens per input.</small>
          </label>
          <label class="inference-only">
            <span>
              Concurrent Users <output data-output="concurrentUsers">1</output>
            </span>
            <input
              name="concurrentUsers"
              type="range"
              min="1"
              max="64"
              value="1"
              aria-label="Concurrent Users"
            />
            <small>Users sharing this deployment.</small>
          </label>
          <label class="finetuning-only" hidden>
            <span>Dataset samples</span>
            <input name="samples" type="number" min="1" value="10000" />
          </label>
          <label class="finetuning-only" hidden>
            <span>Epochs</span>
            <input name="epochs" type="number" min="1" value="3" />
          </label>
        </div>
        <details class="advanced-fields">
          <summary>Advanced Configuration</summary>
          <div class="advanced-grid">
            <label class="checkbox">
              <input name="prefixCaching" type="checkbox" /> Enable prefix caching
            </label>
            <label>
              Shared prefix (%)
              <input name="sharedPrefix" type="number" min="0" max="100" value="0" />
            </label>
            <label class="checkbox">
              <input name="continuousBatching" type="checkbox" /> Enable continuous batching
            </label>
            <label class="checkbox">
              <input name="staticVram" type="checkbox" checked /> Static VRAM pre-allocation
            </label>
            <label>
              Static VRAM target (%)
              <input name="staticVramTarget" type="number" min="50" max="98" value="90" />
            </label>
            <label class="checkbox">
              <input name="speculativeDecoding" type="checkbox" /> Enable speculative decoding
            </label>
            <label>
              Draft tokens per step
              <input name="draftTokens" type="number" min="1" max="16" value="4" />
            </label>
            <label>
              Parallelism
              <select name="parallelism">
                <option value="tensor" selected>
                  Tensor parallelism
                </option>
                <option value="pipeline">Pipeline parallelism</option>
              </select>
            </label>
            <label class="checkbox">
              <input name="offloading" type="checkbox" /> Enable offloading
            </label>
            <label data-offload-field hidden>
              Offload target
              <select name="offloadTarget">
                <option value="ram">CPU RAM</option>
                <option value="nvme">NVMe</option>
              </select>
            </label>
            <label data-offload-field hidden>
              Layers offloaded
              <input name="offloadLayers" type="number" min="0" value="0" />
            </label>
            <label class="checkbox inference-only" data-offload-field hidden>
              <input name="offloadKvCache" type="checkbox" /> Offload KV cache
            </label>
            <label class="checkbox finetuning-only" hidden>
              <input name="checkpointing" type="checkbox" checked /> Gradient checkpointing
            </label>
            <label class="checkbox finetuning-only" hidden>
              <input name="flashAttention" type="checkbox" checked /> Flash Attention
            </label>
          </div>
        </details>
        <p class="calculator-assumptions">
          Estimates are browser-local planning guidance. Runtime, kernels, and model artifacts can
          vary.
        </p>
        <details class="calculation-method">
          <summary>How estimates are calculated</summary>
          <p>
            Weight memory is parameter count times the selected precision. KV cache uses the model's
            layer, KV-head, and head-dimension geometry, then scales with context, batch size, and
            concurrent users. Activations and runtime reserve are planning allowances, not profiler
            measurements.
          </p>
        </details>
      </form>
      <aside class="calculator-results" aria-live="polite">
        <h2>Performance &amp; Memory Results</h2>
        <div class="vram-ring" data-vram-ring>
          <strong data-result="vramPercent">0.0%</strong>
          <span>VRAM</span>
        </div>
        <strong class="memory-status" data-result="status">
          READY
        </strong>
        <p class="fit-message" data-result="fitMessage">
          Select a model and device to calculate a fit estimate.
        </p>
        <p class="vram-total">
          <b data-result="vramUsage">0 GB</b>
          <span>
            of <span data-result="vramCapacity">0 GB</span> VRAM
          </span>
        </p>
        <div class="result-tabs">
          <button class="active" type="button" data-result-tab="performance">
            Performance
          </button>
          <button type="button" data-result-tab="cost">
            Energy &amp; Cost
          </button>
          <button type="button" data-result-tab="memory">
            Memory Details
          </button>
        </div>
        <div data-result-panel="performance" class="result-panel">
          <p>
            <span>Generation Speed</span>
            <b data-result="generationSpeed">...</b>
          </p>
          <p>
            <span>Time to First Token</span>
            <b data-result="ttft">...</b>
          </p>
          <p>
            <span>Total Throughput</span>
            <b data-result="throughput">...</b>
          </p>
          <p>
            <span data-training-label>Per-user Speed</span>
            <b data-result="perUserSpeed">...</b>
          </p>
        </div>
        <div data-result-panel="cost" class="result-panel" hidden>
          <p>
            <span>Estimated Power Draw</span>
            <b data-result="power">...</b>
          </p>
          <p>
            <span>Est. GPU Rental</span>
            <b data-result="rental">...</b>
          </p>
          <p class="finetuning-only" hidden>
            <span>Estimated Training Time</span>
            <b data-result="trainingTime">...</b>
          </p>
        </div>
        <div data-result-panel="memory" class="result-panel memory-panel" hidden></div>
        <p class="model-summary" data-result="modelSummary"></p>
      </aside>
    </div>
  </section>
)

InferenceCalculator.css = style
InferenceCalculator.afterDOMLoaded = script

export default (() => InferenceCalculator) satisfies QuartzComponentConstructor
