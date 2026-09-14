<script setup>
import { computed, ref } from 'vue'
import {
  halvingSequenceTerm,
  oscillatingSequenceTerm,
  minimumStrictTailN,
  sufficientOscillatingTailN,
} from '../../lib/sequence-limit.js'
import MathFormula from '../MathFormula.vue'

const scene = ref(1)

const epsilon = ref(0.1)
const minimumN = computed(() => minimumStrictTailN(epsilon.value))
const firstTailIndex = computed(() => minimumN.value + 1)
const epsilonText = computed(() => epsilon.value.toFixed(3))
const epsilonTex = computed(() => `\\varepsilon=${epsilonText.value}`)
const halvingResultTex = computed(() => (
  `n>${minimumN.value}\\Longrightarrow \\lvert a_n-0\\rvert<${epsilonText.value}`
))

const chart = {
  width: 960,
  height: 520,
  left: 78,
  right: 914,
  top: 48,
  bottom: 448,
  maxIndex: 10,
  maxValue: 0.55,
  pointInset: 16,
}

const x = (n) => chart.left + chart.pointInset
  + ((n - 1) / (chart.maxIndex - 1)) * (chart.right - chart.left - 2 * chart.pointInset)
const y = (value) => chart.bottom - (value / chart.maxValue) * (chart.bottom - chart.top)

const points = computed(() => Array.from({ length: chart.maxIndex }, (_, index) => {
  const n = index + 1
  const value = halvingSequenceTerm(n)
  return {
    n,
    value,
    cx: x(n),
    cy: y(value),
    inTail: n > minimumN.value,
  }
}))

const xTicks = Array.from({ length: chart.maxIndex }, (_, index) => index + 1)
const yTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
const epsilonY = computed(() => y(epsilon.value))
const thresholdX = computed(() => x(minimumN.value))

const quantifierStep = ref(1)
const oscillatingEpsilon = ref(0.25)
const oscillatingEpsilonText = computed(() => oscillatingEpsilon.value.toFixed(2))
const oscillatingEpsilonTex = computed(() => `\\varepsilon=${oscillatingEpsilonText.value}`)
const oscillatingN = computed(() => sufficientOscillatingTailN(oscillatingEpsilon.value))
const oscillatingFirstTailIndex = computed(() => oscillatingN.value + 1)

const oscillationChart = {
  width: 960,
  height: 520,
  left: 78,
  right: 914,
  top: 48,
  bottom: 448,
  minValue: 0,
  maxValue: 1.6,
  maxIndex: 20,
  pointInset: 16,
}

const oscillationX = (n) => oscillationChart.left + oscillationChart.pointInset
  + ((n - 1) / (oscillationChart.maxIndex - 1))
    * (oscillationChart.right - oscillationChart.left - 2 * oscillationChart.pointInset)
const oscillationY = (value) => oscillationChart.bottom
  - ((value - oscillationChart.minValue) / (oscillationChart.maxValue - oscillationChart.minValue))
    * (oscillationChart.bottom - oscillationChart.top)

const oscillationPoints = computed(() => Array.from(
  { length: oscillationChart.maxIndex },
  (_, index) => {
    const n = index + 1
    const value = oscillatingSequenceTerm(n)
    return {
      n,
      value,
      cx: oscillationX(n),
      cy: oscillationY(value),
      inTail: quantifierStep.value >= 3 && n > oscillatingN.value,
    }
  },
))

const oscillationCurve = Array.from({ length: 381 }, (_, index) => {
  const input = 1 + index / 20
  const value = 1 + Math.cos(Math.PI * input) / input
  return `${index === 0 ? 'M' : 'L'} ${oscillationX(input).toFixed(2)} ${oscillationY(value).toFixed(2)}`
}).join(' ')

const oscillationXTicks = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
const oscillationYTicks = [0, 0.5, 1, 1.5]
const oscillationUpperY = computed(() => oscillationY(1 + oscillatingEpsilon.value))
const oscillationLowerY = computed(() => oscillationY(1 - oscillatingEpsilon.value))
const oscillationThresholdX = computed(() => oscillationX(oscillatingN.value))
const oscillatingResultTex = computed(() => (
  `n>${oscillatingN.value}\\Longrightarrow \\lvert a_n-1\\rvert`
  + `=\\frac{1}{n}<\\frac{1}{${oscillatingN.value}}\\le ${oscillatingEpsilonText.value}`
))

function showScene(nextScene) {
  scene.value = nextScene
  if (nextScene === 2) quantifierStep.value = 1
}

function resetQuantifierOrder() {
  quantifierStep.value = 1
}
</script>

<template>
  <section class="sequence-limit-demo">
    <nav class="demo-scene-nav" aria-label="演示页面">
      <button
        type="button"
        :class="{ 'is-active': scene === 1 }"
        :aria-current="scene === 1 ? 'page' : undefined"
        @click="showScene(1)"
      >1 · 单侧趋近 0</button>
      <button
        type="button"
        :class="{ 'is-active': scene === 2 }"
        :aria-current="scene === 2 ? 'page' : undefined"
        @click="showScene(2)"
      >2 · 波动趋近 1</button>
    </nav>

    <div v-if="scene === 1" class="demo-scene" aria-labelledby="sequence-limit-title">
    <header class="demo-heading">
      <p class="demo-source">《庄子》：“一尺之棰，日取其半，万世不竭。”</p>
      <h1 id="sequence-limit-title">用 ε 描述“越来越接近”</h1>
      <p class="sequence-expression">
        <MathFormula tex="\frac12,\ \frac14,\ \frac18,\ \frac1{16},\ \ldots" />
        <MathFormula tex="a_n=2^{-n},\quad n=1,2,\ldots" />
      </p>
    </header>

    <div class="epsilon-control">
        <label for="epsilon-range">
          <span>调整 ε</span>
          <output for="epsilon-range"><MathFormula :tex="epsilonTex" /></output>
      </label>
      <input
        id="epsilon-range"
        v-model.number="epsilon"
        type="range"
        min="0.02"
        max="0.3"
        step="0.005"
        aria-describedby="sequence-limit-result"
      >
      <div class="range-ends" aria-hidden="true"><span>0.020</span><span>0.300</span></div>
    </div>

    <div class="sequence-plot">
      <svg
        :viewBox="`0 0 ${chart.width} ${chart.height}`"
        role="img"
        aria-labelledby="sequence-plot-title sequence-plot-description"
      >
        <title id="sequence-plot-title">数列 aₙ = 2⁻ⁿ 与 ε 的关系</title>
        <desc id="sequence-plot-description">
          当前 ε 为 {{ epsilonText }}。由数列公式可知，从第 {{ firstTailIndex }} 项起 aₙ 都低于 ε；图中相应尾项被高亮。按 n 大于 N 的写法，最小可行 N 为 {{ minimumN }}。
        </desc>

        <rect
          class="plot-frame"
          :x="chart.left"
          :y="chart.top"
          :width="chart.right - chart.left"
          :height="chart.bottom - chart.top"
        />

        <g aria-hidden="true">
          <line
            v-for="tick in yTicks"
            :key="`grid-${tick}`"
            class="grid-line"
            :x1="chart.left"
            :x2="chart.right"
            :y1="y(tick)"
            :y2="y(tick)"
          />
        </g>

        <rect
          class="epsilon-band"
          :x="chart.left"
          :y="epsilonY"
          :width="chart.right - chart.left"
          :height="chart.bottom - epsilonY"
        />
        <line
          class="epsilon-line"
          :x1="chart.left"
          :x2="chart.right"
          :y1="epsilonY"
          :y2="epsilonY"
        />
        <text class="epsilon-label" :x="chart.right - 12" :y="epsilonY - 12" text-anchor="end">
          ε = {{ epsilonText }}
        </text>

        <line
          class="threshold-line"
          :x1="thresholdX"
          :x2="thresholdX"
          :y1="chart.top"
          :y2="chart.bottom"
        />
        <text class="threshold-label" :x="thresholdX + 12" :y="chart.top + 28">
          N = {{ minimumN }}
        </text>

        <g class="axis-labels" aria-hidden="true">
          <template v-for="tick in yTicks" :key="`y-${tick}`">
            <text :x="chart.left - 16" :y="y(tick) + 6" text-anchor="end">{{ tick.toFixed(1) }}</text>
          </template>
          <template v-for="tick in xTicks" :key="`x-${tick}`">
            <line class="tick-mark" :x1="x(tick)" :x2="x(tick)" :y1="chart.bottom" :y2="chart.bottom + 8" />
            <text :x="x(tick)" :y="chart.bottom + 32" text-anchor="middle">{{ tick }}</text>
          </template>
          <text class="axis-title" :x="(chart.left + chart.right) / 2" :y="chart.height - 14" text-anchor="middle">项数 n</text>
          <text class="axis-title" :x="chart.left" :y="chart.top - 18">数列项 aₙ</text>
        </g>

        <g class="sequence-points">
          <circle
            v-for="point in points"
            :key="point.n"
            class="sequence-point"
            :class="{ 'is-in-tail': point.inTail }"
            :data-n="point.n"
            :data-in-tail="String(point.inTail)"
            :cx="point.cx"
            :cy="point.cy"
            r="8"
          >
            <title>第 {{ point.n }} 项：{{ point.value }}</title>
          </circle>
        </g>
      </svg>
    </div>

    <div id="sequence-limit-result" class="demo-result" aria-live="polite">
      <p>
        最早从第 <strong>{{ firstTailIndex }}</strong> 项起满足
        <MathFormula tex="a_n<\varepsilon" />；按 <MathFormula tex="n>N" /> 的写法，
        本例最小可行 <strong>N = {{ minimumN }}</strong>。
      </p>
      <MathFormula class="result-formula" :tex="halvingResultTex" display />
    </div>
    </div>

    <div v-else class="demo-scene" aria-labelledby="oscillation-limit-title">
      <header class="demo-heading">
        <p class="demo-source">数列可以反复越过目标，同时不断缩小偏离。</p>
        <h1 id="oscillation-limit-title">波动也可以收敛</h1>
        <p class="sequence-expression">
          <MathFormula tex="0,\ \frac32,\ \frac23,\ \frac54,\ \frac45,\ \ldots" />
          <MathFormula tex="a_n=1+\frac{(-1)^n}{n}\longrightarrow1" />
        </p>
      </header>

      <nav class="quantifier-steps" aria-label="ε–N 定义的量词次序">
        <button
          type="button"
          :class="{ 'is-active': quantifierStep === 1, 'is-complete': quantifierStep > 1 }"
          :aria-current="quantifierStep === 1 ? 'step' : undefined"
          @click="quantifierStep = 1"
        ><strong>1 · <MathFormula tex="\forall\varepsilon>0" /></strong><span>给定 ε</span></button>
        <span aria-hidden="true">→</span>
        <button
          type="button"
          :class="{ 'is-active': quantifierStep === 2, 'is-complete': quantifierStep > 2 }"
          :aria-current="quantifierStep === 2 ? 'step' : undefined"
          @click="quantifierStep = 2"
        ><strong>2 · <MathFormula tex="\exists N" /></strong><span>取一个可行 N</span></button>
        <span aria-hidden="true">→</span>
        <button
          type="button"
          :class="{ 'is-active': quantifierStep === 3 }"
          :aria-current="quantifierStep === 3 ? 'step' : undefined"
          :disabled="quantifierStep < 2"
          @click="quantifierStep = 3"
        ><strong>3 · <MathFormula tex="\forall n>N" /></strong><span>检查尾部全体</span></button>
      </nav>

      <div class="epsilon-control">
        <label for="oscillating-epsilon-range">
          <span>调整 ε</span>
          <output for="oscillating-epsilon-range"><MathFormula :tex="oscillatingEpsilonTex" /></output>
        </label>
        <input
          id="oscillating-epsilon-range"
          v-model.number="oscillatingEpsilon"
          type="range"
          min="0.1"
          max="0.5"
          step="0.01"
          aria-describedby="oscillation-limit-result"
          @input="resetQuantifierOrder"
        >
        <div class="range-ends" aria-hidden="true"><span>0.10</span><span>0.50</span></div>
      </div>

      <div class="sequence-plot oscillation-plot">
        <svg
          :viewBox="`0 0 ${oscillationChart.width} ${oscillationChart.height}`"
          role="img"
          aria-labelledby="oscillation-plot-title oscillation-plot-description"
        >
          <title id="oscillation-plot-title">波动数列与 ε–N 量词次序</title>
          <desc id="oscillation-plot-description">
            数列 aₙ 等于 1 加负 1 的 n 次方除以 n，围绕 1 上下波动并收敛于 1。当前 ε 为 {{ oscillatingEpsilonText }}，演示进行到第 {{ quantifierStep }} 步。
          </desc>

          <rect
            class="plot-frame"
            :x="oscillationChart.left"
            :y="oscillationChart.top"
            :width="oscillationChart.right - oscillationChart.left"
            :height="oscillationChart.bottom - oscillationChart.top"
          />

          <g aria-hidden="true">
            <line
              v-for="tick in oscillationYTicks"
              :key="`oscillation-grid-${tick}`"
              class="grid-line"
              :x1="oscillationChart.left"
              :x2="oscillationChart.right"
              :y1="oscillationY(tick)"
              :y2="oscillationY(tick)"
            />
          </g>

          <rect
            class="epsilon-band"
            :x="oscillationChart.left"
            :y="oscillationUpperY"
            :width="oscillationChart.right - oscillationChart.left"
            :height="oscillationLowerY - oscillationUpperY"
          />
          <line
            class="target-line"
            :x1="oscillationChart.left"
            :x2="oscillationChart.right"
            :y1="oscillationY(1)"
            :y2="oscillationY(1)"
          />
          <text class="target-label" :x="oscillationChart.right - 12" :y="oscillationY(1) - 12" text-anchor="end">A = 1</text>
          <line
            class="epsilon-line"
            :x1="oscillationChart.left"
            :x2="oscillationChart.right"
            :y1="oscillationUpperY"
            :y2="oscillationUpperY"
          />
          <line
            class="epsilon-line"
            :x1="oscillationChart.left"
            :x2="oscillationChart.right"
            :y1="oscillationLowerY"
            :y2="oscillationLowerY"
          />
          <text class="epsilon-label" :x="oscillationChart.right - 12" :y="oscillationUpperY - 10" text-anchor="end">1 + ε</text>
          <text class="epsilon-label" :x="oscillationChart.right - 12" :y="oscillationLowerY + 24" text-anchor="end">1 − ε</text>

          <path class="oscillation-curve" :d="oscillationCurve" />

          <template v-if="quantifierStep >= 2">
            <line
              class="threshold-line"
              :x1="oscillationThresholdX"
              :x2="oscillationThresholdX"
              :y1="oscillationChart.top"
              :y2="oscillationChart.bottom"
            />
            <text class="threshold-label" :x="oscillationThresholdX + 12" :y="oscillationChart.top + 28">取 N = {{ oscillatingN }}</text>
          </template>

          <text
            v-if="quantifierStep >= 3"
            class="tail-label"
            :x="oscillationChart.right - 12"
            :y="oscillationChart.top + 28"
            text-anchor="end"
          >所有 n &gt; N</text>

          <g class="axis-labels" aria-hidden="true">
            <template v-for="tick in oscillationYTicks" :key="`oscillation-y-${tick}`">
              <text :x="oscillationChart.left - 16" :y="oscillationY(tick) + 6" text-anchor="end">{{ tick.toFixed(1) }}</text>
            </template>
            <template v-for="tick in oscillationXTicks" :key="`oscillation-x-${tick}`">
              <line class="tick-mark" :x1="oscillationX(tick)" :x2="oscillationX(tick)" :y1="oscillationChart.bottom" :y2="oscillationChart.bottom + 8" />
              <text :x="oscillationX(tick)" :y="oscillationChart.bottom + 32" text-anchor="middle">{{ tick }}</text>
            </template>
            <text class="axis-title" :x="(oscillationChart.left + oscillationChart.right) / 2" :y="oscillationChart.height - 14" text-anchor="middle">项数 n</text>
            <text class="axis-title" :x="oscillationChart.left" :y="oscillationChart.top - 18">数列项 aₙ</text>
          </g>

          <g class="sequence-points">
            <circle
              v-for="point in oscillationPoints"
              :key="point.n"
              class="sequence-point oscillation-point"
              :class="{ 'is-in-tail': point.inTail }"
              :data-oscillation-n="point.n"
              :data-in-tail="String(point.inTail)"
              :cx="point.cx"
              :cy="point.cy"
              r="7"
            >
              <title>第 {{ point.n }} 项：{{ point.value }}</title>
            </circle>
          </g>
        </svg>
      </div>

      <div id="oscillation-limit-result" class="demo-result quantifier-result" aria-live="polite">
        <p v-if="quantifierStep === 1">
          给定允许误差 <MathFormula :tex="oscillatingEpsilonTex" />。
        </p>
        <p v-else-if="quantifierStep === 2">
          取一个满足 <MathFormula tex="N\geq1/\varepsilon" /> 的正整数，本例可取
          <MathFormula :tex="`N=${oscillatingN}`" />；更大的 <MathFormula tex="N" /> 也可以。
        </p>
        <template v-else>
          <p>从第 <strong>{{ oscillatingFirstTailIndex }}</strong> 项起，所有数列项都落在允许范围内。</p>
          <MathFormula class="result-formula" :tex="oscillatingResultTex" display />
        </template>
      </div>
    </div>
  </section>
</template>
