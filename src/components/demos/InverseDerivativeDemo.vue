<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const exampleId = ref('exp')
const stage = ref(1)
const x0 = ref(Math.log(2))
const isPlaying = ref(false)

let animationFrameId = null

const examples = {
  exp: {
    label: '指数 ↔ 对数',
    formulaTex: String.raw`f(x)=e^x,\qquad f^{-1}(x)=\ln x`,
    x0Min: -1.15,
    x0Max: 1.25,
    defaultX0: Math.log(2),
    viewMin: -1.6,
    viewMax: 4.1,
    ticks: [-1, 0, 1, 2, 3, 4],
    sourceMin: -1.6,
    sourceMax: Math.log(4.1),
    value: (value) => Math.exp(value),
    slope: (value) => Math.exp(value),
    presets: [
      { label: '−1', value: -1 },
      { label: '0', value: 0 },
      { label: 'ln 2', value: Math.log(2) },
      { label: '1', value: 1 },
    ],
  },
  square: {
    label: '平方 ↔ 开方',
    formulaTex: String.raw`f(x)=x^2\ (x\ge 0),\qquad f^{-1}(x)=\sqrt{x}`,
    x0Min: 0,
    x0Max: 2,
    defaultX0: 1.5,
    viewMin: -0.35,
    viewMax: 4.25,
    ticks: [0, 1, 2, 3, 4],
    sourceMin: 0,
    sourceMax: Math.sqrt(4.25),
    value: (value) => value * value,
    slope: (value) => 2 * value,
    presets: [
      { label: '0', value: 0 },
      { label: '0.5', value: 0.5 },
      { label: '1', value: 1 },
      { label: '1.5', value: 1.5 },
      { label: '2', value: 2 },
    ],
  },
}

const chart = {
  width: 720,
  height: 700,
  left: 72,
  right: 662,
  top: 42,
  bottom: 632,
}

const currentExample = computed(() => examples[exampleId.value])
const rangeSize = computed(() => currentExample.value.viewMax - currentExample.value.viewMin)

const plotX = (value) => chart.left
  + ((value - currentExample.value.viewMin) / rangeSize.value) * (chart.right - chart.left)
const plotY = (value) => chart.bottom
  - ((value - currentExample.value.viewMin) / rangeSize.value) * (chart.bottom - chart.top)

function formatNumber(value, digits = 3) {
  if (Math.abs(value) < 10 ** (-(digits + 1))) return '0'
  return Number(value.toFixed(digits)).toString()
}

function samplesToPath(swapCoordinates = false) {
  const config = currentExample.value
  const steps = 360
  return Array.from({ length: steps + 1 }, (_, index) => {
    const input = config.sourceMin + ((config.sourceMax - config.sourceMin) * index) / steps
    const output = config.value(input)
    const x = swapCoordinates ? output : input
    const y = swapCoordinates ? input : output
    const command = index === 0 ? 'M' : 'L'
    return `${command} ${plotX(x).toFixed(2)} ${plotY(y).toFixed(2)}`
  }).join(' ')
}

const originalCurvePath = computed(() => samplesToPath(false))
const reflectedCurvePath = computed(() => samplesToPath(true))
const y0 = computed(() => currentExample.value.value(x0.value))
const originalPoint = computed(() => ({ x: x0.value, y: y0.value }))
const reflectedPoint = computed(() => ({ x: y0.value, y: x0.value }))
const pointsCoincide = computed(() => Math.abs(x0.value - y0.value) < 1e-6)
const originalSlope = computed(() => currentExample.value.slope(x0.value))
const inverseHasFiniteSlope = computed(() => Math.abs(originalSlope.value) > 1e-8)
const inverseSlope = computed(() => (
  inverseHasFiniteSlope.value ? 1 / originalSlope.value : null
))

function lineSegment(point, dx, dy) {
  const norm = Math.hypot(dx, dy)
  const halfLength = rangeSize.value * 0.18
  const unitX = dx / norm
  const unitY = dy / norm
  return {
    x1: point.x - unitX * halfLength,
    y1: point.y - unitY * halfLength,
    x2: point.x + unitX * halfLength,
    y2: point.y + unitY * halfLength,
  }
}

const originalTangent = computed(() => lineSegment(
  originalPoint.value,
  1,
  originalSlope.value,
))
const reflectedTangent = computed(() => lineSegment(
  reflectedPoint.value,
  originalSlope.value,
  1,
))

const xTicks = computed(() => currentExample.value.ticks)
const functionPairTex = computed(() => currentExample.value.formulaTex)
const mappingTex = computed(() => String.raw`x_0=${formatNumber(x0.value)}\xrightarrow{\ f\ }y_0=${formatNumber(y0.value)}`)
const pointPairTex = computed(() => String.raw`P=(x_0,y_0),\qquad Q=(y_0,x_0)`)
const coordinateSwapTex = String.raw`(\Delta x,\Delta y)\longleftrightarrow(\Delta y,\Delta x)`

const originalSlopeTex = computed(() => {
  if (exampleId.value === 'exp') {
    return String.raw`f'(x_0)=e^{x_0}=${formatNumber(originalSlope.value)}`
  }
  if (!inverseHasFiniteSlope.value) return String.raw`f'_+(0)=0`
  return String.raw`f'(x_0)=2x_0=${formatNumber(originalSlope.value)}`
})
const inverseSlopeTex = computed(() => {
  if (!inverseHasFiniteSlope.value) {
    return String.raw`\left(f^{-1}\right)'_+(0)\ \text{没有有限值}`
  }
  return String.raw`\left(f^{-1}\right)'(y_0)=\frac{1}{f'(x_0)}=${formatNumber(inverseSlope.value)}`
})
const slopeProductTex = computed(() => {
  if (!inverseHasFiniteSlope.value) {
    return String.raw`(1,0)\longleftrightarrow(0,1)`
  }
  return String.raw`f'(x_0)\left(f^{-1}\right)'(y_0)=${formatNumber(originalSlope.value)}\times${formatNumber(inverseSlope.value)}=1`
})

const resultSentence = computed(() => {
  if (stage.value === 1) return '先固定一对输入、输出：反函数会从原函数的输出位置出发。'
  if (stage.value === 2) return '交换横纵坐标，点与整条图像都关于 y = x 镜像。'
  if (!inverseHasFiniteSlope.value) return '从右侧看，原函数切线水平，镜像后的反函数切线竖直；反函数在这里没有有限右导数。'
  return '切线方向也交换横纵分量，因此对应点处的两条切线斜率互为倒数。'
})

const reducedMotion = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function stopPlayback() {
  if (animationFrameId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(animationFrameId)
  }
  animationFrameId = null
  isPlaying.value = false
}

function selectExample(nextExample) {
  stopPlayback()
  exampleId.value = nextExample
  x0.value = examples[nextExample].defaultX0
}

function setBasePoint(value) {
  stopPlayback()
  x0.value = value
}

function playCorrespondingPoints() {
  if (isPlaying.value) {
    stopPlayback()
    return
  }
  if (reducedMotion || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') return

  stage.value = Math.max(stage.value, 2)
  const { x0Min, x0Max } = currentExample.value
  const duration = 4200
  let startTime = null
  let lastUpdateTime = Number.NEGATIVE_INFINITY
  isPlaying.value = true
  x0.value = x0Min

  const advance = (timestamp) => {
    if (startTime === null) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const eased = (1 - Math.cos(Math.PI * progress)) / 2
    if (timestamp - lastUpdateTime >= 33 || progress === 1) {
      x0.value = x0Min + (x0Max - x0Min) * eased
      lastUpdateTime = timestamp
    }
    if (progress < 1 && isPlaying.value) {
      animationFrameId = window.requestAnimationFrame(advance)
      return
    }
    animationFrameId = null
    isPlaying.value = false
  }

  animationFrameId = window.requestAnimationFrame(advance)
}

function isCurrentPreset(value) {
  return Math.abs(x0.value - value) < 0.006
}

onBeforeUnmount(stopPlayback)
</script>

<template>
  <section class="inverse-derivative-demo">
    <nav class="inverse-stage-nav derivative-reveal-nav" aria-label="观察层级">
      <button type="button" data-stage="1" :class="{ 'is-active': stage === 1 }" :aria-current="stage === 1 ? 'step' : undefined" @click="stage = 1">1 · 找对应点</button>
      <button type="button" data-stage="2" :class="{ 'is-active': stage === 2 }" :aria-current="stage === 2 ? 'step' : undefined" @click="stage = 2">2 · 看镜像</button>
      <button type="button" data-stage="3" :class="{ 'is-active': stage === 3 }" :aria-current="stage === 3 ? 'step' : undefined" @click="stage = 3">3 · 比较斜率</button>
    </nav>

    <header class="demo-heading">
      <p class="demo-source">先交换一对点的横纵坐标，再把同样的交换施加到整条图像和切线方向。</p>
      <h1>反函数把什么“反”过来了</h1>
      <p class="sequence-expression">
        <MathFormula :tex="functionPairTex" />
        <MathFormula tex="y=x" />
      </p>
    </header>

    <div class="inverse-controls" aria-label="演示控制">
      <fieldset class="demo-choice-group inverse-example-switch">
        <legend>函数对</legend>
        <button type="button" data-example="exp" :class="{ 'is-active': exampleId === 'exp' }" :aria-pressed="exampleId === 'exp'" @click="selectExample('exp')">指数 ↔ 对数</button>
        <button type="button" data-example="square" :class="{ 'is-active': exampleId === 'square' }" :aria-pressed="exampleId === 'square'" @click="selectExample('square')">平方 ↔ 开方</button>
      </fieldset>

      <div class="demo-slider-control">
        <label for="inverse-base-point-range">
          <span>移动原函数的输入 x₀</span>
          <output for="inverse-base-point-range"><MathFormula :tex="mappingTex" /></output>
        </label>
        <input
          id="inverse-base-point-range"
          v-model.number="x0"
          type="range"
          :min="currentExample.x0Min"
          :max="currentExample.x0Max"
          step="0.01"
          aria-describedby="inverse-result"
          @input="stopPlayback"
        >
        <div class="demo-shortcuts" aria-label="代表输入值">
          <button v-for="preset in currentExample.presets" :key="preset.label" type="button" :class="{ 'is-active': isCurrentPreset(preset.value) }" @click="setBasePoint(preset.value)">{{ preset.label }}</button>
        </div>
      </div>

      <div class="inverse-playback">
        <span>让对应点连续移动</span>
        <button type="button" :aria-pressed="isPlaying" :disabled="reducedMotion" @click="playCorrespondingPoints">
          {{ reducedMotion ? '已减少动画' : (isPlaying ? '停止' : '播放一次') }}
        </button>
      </div>
    </div>

    <div class="inverse-layout">
      <div class="inverse-plot">
        <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" aria-labelledby="inverse-plot-title inverse-plot-description">
          <title id="inverse-plot-title">原函数与反函数的对应点、镜像图像和切线</title>
          <desc id="inverse-plot-description">当前原函数输入 x0 为 {{ formatNumber(x0) }}，输出 y0 为 {{ formatNumber(y0) }}。第二步显示关于 y 等于 x 对称的反函数图像，第三步显示两条对应切线。</desc>
          <defs>
            <clipPath id="inverse-plot-clip">
              <rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
            </clipPath>
          </defs>

          <rect class="plot-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          <g class="inverse-grid" aria-hidden="true">
            <template v-for="tick in xTicks" :key="`inverse-grid-${tick}`">
              <line :x1="plotX(tick)" :x2="plotX(tick)" :y1="chart.top" :y2="chart.bottom" />
              <line :x1="chart.left" :x2="chart.right" :y1="plotY(tick)" :y2="plotY(tick)" />
            </template>
          </g>
          <g class="inverse-axes" aria-hidden="true">
            <line :x1="chart.left" :x2="chart.right" :y1="plotY(0)" :y2="plotY(0)" />
            <line :x1="plotX(0)" :x2="plotX(0)" :y1="chart.top" :y2="chart.bottom" />
          </g>

          <g clip-path="url(#inverse-plot-clip)">
            <line class="inverse-mirror-axis" :x1="plotX(currentExample.viewMin)" :y1="plotY(currentExample.viewMin)" :x2="plotX(currentExample.viewMax)" :y2="plotY(currentExample.viewMax)" />
            <path class="inverse-original-curve" :d="originalCurvePath" />
            <path v-if="stage >= 2" class="inverse-reflected-curve" :d="reflectedCurvePath" />

            <g class="inverse-coordinate-guides" aria-hidden="true">
              <line :x1="plotX(x0)" :x2="plotX(x0)" :y1="plotY(0)" :y2="plotY(y0)" />
              <line :x1="plotX(0)" :x2="plotX(x0)" :y1="plotY(y0)" :y2="plotY(y0)" />
            </g>

            <line v-if="stage >= 2" class="inverse-reflection-connector" :x1="plotX(originalPoint.x)" :y1="plotY(originalPoint.y)" :x2="plotX(reflectedPoint.x)" :y2="plotY(reflectedPoint.y)" />

            <line
              v-if="stage === 3"
              class="inverse-original-tangent"
              :x1="plotX(originalTangent.x1)"
              :y1="plotY(originalTangent.y1)"
              :x2="plotX(originalTangent.x2)"
              :y2="plotY(originalTangent.y2)"
            />
            <line
              v-if="stage === 3"
              class="inverse-reflected-tangent"
              :class="{ 'is-vertical': !inverseHasFiniteSlope }"
              :x1="plotX(reflectedTangent.x1)"
              :y1="plotY(reflectedTangent.y1)"
              :x2="plotX(reflectedTangent.x2)"
              :y2="plotY(reflectedTangent.y2)"
            />
          </g>

          <circle class="inverse-original-point-focus" :cx="plotX(originalPoint.x)" :cy="plotY(originalPoint.y)" r="15" />
          <circle class="inverse-original-point" :cx="plotX(originalPoint.x)" :cy="plotY(originalPoint.y)" r="8" />
          <text class="inverse-point-label is-original" :x="plotX(originalPoint.x) + 13" :y="plotY(originalPoint.y) - 15">{{ stage >= 2 && pointsCoincide ? 'P = Q' : 'P(x₀,y₀)' }}</text>

          <template v-if="stage >= 2 && !pointsCoincide">
            <circle class="inverse-reflected-point" :cx="plotX(reflectedPoint.x)" :cy="plotY(reflectedPoint.y)" r="8" />
            <text class="inverse-point-label is-reflected" :x="plotX(reflectedPoint.x) - 13" :y="plotY(reflectedPoint.y) + 25" text-anchor="end">Q(y₀,x₀)</text>
          </template>

          <g class="axis-labels" aria-hidden="true">
            <template v-for="tick in xTicks" :key="`inverse-ticks-${tick}`">
              <line class="tick-mark" :x1="plotX(tick)" :x2="plotX(tick)" :y1="plotY(0)" :y2="plotY(0) + 7" />
              <text :x="plotX(tick)" :y="plotY(0) + 28" text-anchor="middle">{{ tick }}</text>
              <text v-if="tick !== 0" :x="plotX(0) - 11" :y="plotY(tick) + 5" text-anchor="end">{{ tick }}</text>
            </template>
            <text class="axis-title" :x="chart.right - 8" :y="plotY(0) - 12" text-anchor="end">x</text>
            <text class="axis-title" :x="plotX(0) + 12" :y="chart.top + 22">y</text>
            <text class="inverse-mirror-label" :x="chart.right - 12" :y="chart.top + 28" text-anchor="end">y = x</text>
          </g>
        </svg>
      </div>

      <aside class="inverse-readout" aria-label="反函数关系">
        <div class="readout-block">
          <span class="readout-kicker">同一对数，交换位置</span>
          <MathFormula :tex="mappingTex" display />
          <MathFormula v-if="stage >= 2" :tex="pointPairTex" display />
        </div>

        <div v-if="stage >= 2" class="readout-block inverse-swap-readout">
          <span class="readout-kicker">镜像交换方向分量</span>
          <MathFormula :tex="coordinateSwapTex" display />
        </div>

        <div v-if="stage === 3" class="readout-block inverse-slope-readout">
          <span class="readout-kicker">对应点处比较斜率</span>
          <div class="inverse-slope-formula is-original">
            <span aria-hidden="true"></span>
            <MathFormula :tex="originalSlopeTex" display />
          </div>
          <div class="inverse-slope-formula is-reflected">
            <span aria-hidden="true"></span>
            <MathFormula :tex="inverseSlopeTex" display />
          </div>
          <MathFormula class="inverse-slope-product" :tex="slopeProductTex" display />
          <p v-if="!inverseHasFiniteSlope" class="inverse-slope-warning">这里是定义域端点：从右侧看，斜率 0 镜像成竖直方向，不能写成一个有限的倒数。</p>
        </div>
      </aside>
    </div>

    <div id="inverse-result" class="demo-result" aria-live="polite">
      <p>{{ resultSentence }}</p>
    </div>
  </section>
</template>
