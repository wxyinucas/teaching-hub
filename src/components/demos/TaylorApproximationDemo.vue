<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MathFormula from '../MathFormula.vue'
import {
  TAYLOR_FUNCTIONS,
  getTaylorFunction,
  originalValue,
  taylorObservation,
  taylorValue,
} from '../../lib/taylorApproximation.js'

const functionId = ref('sin')
const degree = ref(3)
const base = ref(0)
const radius = ref(1)
const deltaX = ref(0.5)
const activePreset = ref('near')
const rangeNotice = ref('')
const localPlotHost = ref(null)
const chartWidth = ref(520)
const chartHeight = 310
const domainMargin = 0.02
let resizeObserver = null
let normalizing = false

const definition = computed(() => getTaylorFunction(functionId.value))
const target = computed(() => base.value + deltaX.value)
const minDelta = computed(() => Math.max(
  -radius.value,
  Number.isFinite(definition.value.domainMin)
    ? definition.value.domainMin + domainMargin - base.value
    : -radius.value,
))
const observation = computed(() => taylorObservation(functionId.value, base.value, degree.value, target.value))
const nearObservation = computed(() => taylorObservation(functionId.value, base.value, degree.value, base.value + 0.5))

watch(functionId, () => {
  base.value = definition.value.defaultBase
  activePreset.value = ''
}, { flush: 'sync' })

watch([functionId, base, radius], () => {
  if (normalizing) return
  normalizing = true
  const nextBase = Math.max(definition.value.baseMin, Math.min(definition.value.baseMax, base.value))
  if (nextBase !== base.value) base.value = nextBase
  const nextDelta = Math.max(minDelta.value, Math.min(radius.value, deltaX.value))
  rangeNotice.value = nextDelta === deltaX.value ? '' : '目标超出新的有效范围，已移回范围内。'
  if (nextDelta !== deltaX.value) deltaX.value = nextDelta
  normalizing = false
}, { flush: 'sync' })

function formatNumber(value, digits = 5) {
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return '0'
  if (Math.abs(value) < 0.0001 || Math.abs(value) >= 10000) return value.toExponential(3)
  return Number(value.toPrecision(digits)).toString()
}

function formatTex(value) {
  const text = formatNumber(value)
  const match = text.match(/^(.+)e([+-]?\d+)$/)
  return match ? match[1] + '\\times10^{' + Number(match[2]) + '}' : text
}

const functionTex = computed(() => 'f(x)=' + definition.value.tex)
const inputTex = computed(() => 'x=x_0+\\Delta x=' + formatTex(base.value)
  + '+(' + formatTex(deltaX.value) + ')=' + formatTex(target.value))
const modelTex = computed(() => {
  const input = base.value === 0 ? 'x' : '\\left(x-(' + formatTex(base.value) + ')\\right)'
  return 'P_{' + degree.value + '}(x)=\\sum_{k=0}^{' + degree.value
    + '}\\frac{f^{(k)}(' + formatTex(base.value) + ')}{k!}' + input + '^{k}'
})

function selectPreset(id) {
  if (id === 'higher') {
    degree.value = Math.min(12, Math.max(11, degree.value + 1))
    activePreset.value = id
    rangeNotice.value = ''
    return
  }
  base.value = definition.value.defaultBase
  degree.value = 3
  radius.value = id === 'near' ? 1 : 6
  deltaX.value = id === 'near' ? 0.5 : 5.5
  activePreset.value = id
  rangeNotice.value = ''
}

function manualControl() {
  activePreset.value = ''
}

const frame = computed(() => ({
  left: 58,
  right: chartWidth.value - 20,
  top: 28,
  bottom: chartHeight - 46,
}))

function sampleRange(minX, maxX, count = 240) {
  return Array.from({ length: count + 1 }, (_, index) => {
    const x = minX + ((maxX - minX) * index) / count
    return {
      x,
      original: originalValue(functionId.value, x),
      polynomial: taylorValue(functionId.value, base.value, degree.value, x),
    }
  })
}

function buildPlot(id, halfWidth) {
  const minX = Math.max(
    base.value - halfWidth,
    Number.isFinite(definition.value.domainMin) ? definition.value.domainMin + domainMargin : -Number.MAX_VALUE,
  )
  const maxX = base.value + halfWidth
  const samples = sampleRange(minX, maxX)
  const visibleTarget = target.value >= minX - 1e-9 && target.value <= maxX + 1e-9
  const sourceValues = samples.map((sample) => sample.original).filter(Number.isFinite)
  if (visibleTarget && observation.value) sourceValues.push(observation.value.original)
  const low = Math.min(...sourceValues)
  const high = Math.max(...sourceValues)
  const span = Math.max(0.8, high - low)
  const middle = (low + high) / 2
  const minY = middle - span * 0.7
  const maxY = middle + span * 0.7
  return {
    id, minX, maxX, minY, maxY, samples, visibleTarget,
    xTicks: Array.from({ length: 5 }, (_, i) => minX + ((maxX - minX) * i) / 4),
    yTicks: Array.from({ length: 5 }, (_, i) => minY + ((maxY - minY) * i) / 4),
    clipped: samples.some((sample) => sample.polynomial < minY || sample.polynomial > maxY),
    targetClipped: visibleTarget && observation.value
      && (observation.value.polynomial < minY || observation.value.polynomial > maxY),
  }
}

const plots = computed(() => [buildPlot('local', 0.5), buildPlot('wide', radius.value)])
const plotX = (plot, x) => frame.value.left + ((x - plot.minX) / (plot.maxX - plot.minX)) * (frame.value.right - frame.value.left)
const plotY = (plot, y) => frame.value.bottom - ((y - plot.minY) / (plot.maxY - plot.minY)) * (frame.value.bottom - frame.value.top)
const visibleY = (plot, y) => Number.isFinite(y) && y >= plot.minY && y <= plot.maxY

// Clip segments geometrically, without inventing boundary data points or
// artificial horizontal runs when the polynomial leaves the visible range.
function clippedSegment(plot, first, second) {
  if (!Number.isFinite(first.y) || !Number.isFinite(second.y)) return null
  const difference = second.y - first.y
  if (difference === 0) return visibleY(plot, first.y) ? [first, second] : null
  const firstCrossing = (plot.minY - first.y) / difference
  const secondCrossing = (plot.maxY - first.y) / difference
  const start = Math.max(0, Math.min(firstCrossing, secondCrossing))
  const end = Math.min(1, Math.max(firstCrossing, secondCrossing))
  if (start > end) return null
  const interpolate = (fraction) => ({
    x: first.x + fraction * (second.x - first.x),
    y: first.y + fraction * difference,
  })
  return [interpolate(start), interpolate(end)]
}

function curvePath(plot, field) {
  const parts = []
  for (let index = 1; index < plot.samples.length; index += 1) {
    const first = plot.samples[index - 1]
    const second = plot.samples[index]
    const segment = clippedSegment(plot, { x: first.x, y: first[field] }, { x: second.x, y: second[field] })
    if (!segment) continue
    parts.push('M ' + plotX(plot, segment[0].x).toFixed(3) + ' ' + plotY(plot, segment[0].y).toFixed(3)
      + ' L ' + plotX(plot, segment[1].x).toFixed(3) + ' ' + plotY(plot, segment[1].y).toFixed(3))
  }
  return parts.join(' ')
}

function errorEndpointY(plot) {
  return plotY(plot, Math.max(plot.minY, Math.min(plot.maxY, observation.value.polynomial)))
}

function setLocalPlotHost(element) {
  localPlotHost.value = element
}

function fitPlot(width) {
  if (width > 0) chartWidth.value = Math.max(300, Math.round(width))
}

onMounted(() => {
  fitPlot(localPlotHost.value?.clientWidth)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(([entry]) => fitPlot(entry.contentRect.width))
    resizeObserver.observe(localPlotHost.value)
  }
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <section class="taylor-approximation-demo">
    <header class="taylor-heading">
      <p class="taylor-eyebrow">同一个展开基点 · 两种观察尺度</p>
      <h1>近处贴合，远处还能相信吗？</h1>
      <p>先固定阶数，把视野与目标拉远；再在同一目标位置增加阶数，比较误差怎样变化。</p>
    </header>

    <div class="taylor-function-choices" aria-label="选择原函数">
      <button v-for="example in TAYLOR_FUNCTIONS" :key="example.id" type="button"
        :data-function="example.id" :aria-pressed="functionId === example.id"
        :class="{ 'is-active': functionId === example.id }" @click="functionId = example.id">
        <MathFormula :tex="'f(x)=' + example.tex" />
      </button>
    </div>

    <div class="taylor-controls">
      <div class="taylor-slider">
        <label for="taylor-degree-range"><span>展开阶数 n</span><output id="taylor-degree-output">{{ degree }} 阶</output></label>
        <input id="taylor-degree-range" v-model.number="degree" type="range" min="0" max="12" step="1" @input="manualControl">
      </div>
      <div class="taylor-slider">
        <label for="taylor-base-range"><span>展开基点 x₀</span><output id="taylor-base-output">{{ formatNumber(base) }}</output></label>
        <input id="taylor-base-range" v-model.number="base" type="range" :min="definition.baseMin" :max="definition.baseMax" :step="definition.baseStep" @input="manualControl">
      </div>
      <div class="taylor-slider">
        <label for="taylor-radius-range"><span>拉远视野 · 观察半径</span><output id="taylor-radius-output">{{ formatNumber(radius) }}</output></label>
        <input id="taylor-radius-range" v-model.number="radius" type="range" min="0.5" max="8" step="0.1" @input="manualControl">
      </div>
      <div class="taylor-slider">
        <label for="taylor-delta-range"><span>目标距基点的增量 Δx</span><output id="taylor-delta-output">{{ formatNumber(deltaX) }}</output></label>
        <input :key="minDelta + ':' + radius" id="taylor-delta-range" v-model.number="deltaX" type="range" :min="minDelta" :max="radius" step="0.01" @input="manualControl">
      </div>
    </div>

    <div class="taylor-presets" aria-label="课堂观察顺序">
      <button type="button" data-preset="near" :aria-pressed="activePreset === 'near'" :class="{ 'is-active': activePreset === 'near' }" @click="selectPreset('near')">① 近处贴合</button>
      <button type="button" data-preset="far" :aria-pressed="activePreset === 'far'" :class="{ 'is-active': activePreset === 'far' }" @click="selectPreset('far')">② 拉远观察</button>
      <button type="button" data-preset="higher" :aria-pressed="activePreset === 'higher'" :class="{ 'is-active': activePreset === 'higher' }" :disabled="degree >= 12" :title="degree >= 12 ? '已到最高的 12 阶' : '保持基点与目标位置，只提高展开阶数'" @click="selectPreset('higher')">③ 保持位置加阶</button>
    </div>

    <div class="taylor-input"><MathFormula :tex="inputTex" /><span>n 阶匹配到第 n 阶导数；某些系数为零时，多项式不会增加新项。</span></div>
    <p v-if="functionId === 'log'" id="taylor-domain-note" class="taylor-domain-note">对数函数要求 x &gt; −1；图像和目标点保持在此定义域内。远处增加阶数，误差也可能更大。</p>
    <p v-if="rangeNotice" class="taylor-domain-note" role="status">{{ rangeNotice }}</p>

    <div class="taylor-legend" aria-label="图例">
      <span><i class="taylor-key is-original"></i>原函数 f(x)</span>
      <span><i class="taylor-key is-polynomial"></i>泰勒多项式 Pₙ(x)</span>
      <span><i class="taylor-key is-error"></i>同一输入处的误差</span>
    </div>

    <div class="taylor-plots">
      <section v-for="plot in plots" :key="plot.id" :ref="plot.id === 'local' ? setLocalPlotHost : undefined" class="taylor-plot" :data-plot="plot.id">
        <header>
          <h2>{{ plot.id === 'local' ? '基点附近' : '拉远观察' }}</h2>
          <span>{{ plot.id === 'local' ? '固定观察基点两侧 0.5' : '观察半径 ' + formatNumber(radius) }}</span>
        </header>
        <svg :viewBox="'0 0 ' + chartWidth + ' ' + chartHeight" role="img" :aria-labelledby="'taylor-' + plot.id + '-title taylor-' + plot.id + '-description'">
          <title :id="'taylor-' + plot.id + '-title'">{{ plot.id === 'local' ? '局部' : '远处' }}原函数与泰勒多项式比较</title>
          <desc :id="'taylor-' + plot.id + '-description'">原函数实线，多项式虚线，基点 {{ formatNumber(base) }}，展开阶数 {{ degree }}。{{ plot.clipped ? '部分多项式超出画面范围，数值仍按真实函数计算。' : '' }}</desc>
          <defs><clipPath :id="'taylor-' + plot.id + '-clip'"><rect :x="frame.left" :y="frame.top" :width="frame.right - frame.left" :height="frame.bottom - frame.top" /></clipPath></defs>
          <rect class="taylor-frame" :x="frame.left" :y="frame.top" :width="frame.right - frame.left" :height="frame.bottom - frame.top" />
          <g class="taylor-grid" aria-hidden="true">
            <line v-for="tick in plot.xTicks" :key="'x-' + tick" :x1="plotX(plot, tick)" :x2="plotX(plot, tick)" :y1="frame.top" :y2="frame.bottom" />
            <line v-for="tick in plot.yTicks" :key="'y-' + tick" :x1="frame.left" :x2="frame.right" :y1="plotY(plot, tick)" :y2="plotY(plot, tick)" />
          </g>
          <g class="taylor-ticks" aria-hidden="true">
            <text v-for="tick in plot.xTicks" :key="'x-label-' + tick" :x="plotX(plot, tick)" :y="frame.bottom + 23" text-anchor="middle">{{ formatNumber(tick, 3) }}</text>
            <text v-for="tick in plot.yTicks" :key="'y-label-' + tick" :x="frame.left - 9" :y="plotY(plot, tick) + 5" text-anchor="end">{{ formatNumber(tick, 3) }}</text>
            <text :x="frame.right" :y="chartHeight - 2" text-anchor="end">x</text>
          </g>
          <g :clip-path="'url(#taylor-' + plot.id + '-clip)'">
            <line class="taylor-base-guide" :x1="plotX(plot, base)" :x2="plotX(plot, base)" :y1="frame.top" :y2="frame.bottom" />
            <path class="taylor-original-curve" :d="curvePath(plot, 'original')" />
            <path class="taylor-polynomial-curve" :d="curvePath(plot, 'polynomial')" />
            <circle class="taylor-base-point" :cx="plotX(plot, base)" :cy="plotY(plot, originalValue(functionId, base))" r="4" />
            <g v-if="plot.visibleTarget && observation">
              <line class="taylor-target-guide" :x1="plotX(plot, target)" :x2="plotX(plot, target)" :y1="frame.top" :y2="frame.bottom" />
              <line class="taylor-error-line" :x1="plotX(plot, target)" :x2="plotX(plot, target)" :y1="plotY(plot, observation.original)" :y2="errorEndpointY(plot)" :data-error="observation.absoluteError" />
              <circle class="taylor-original-point" :cx="plotX(plot, target)" :cy="plotY(plot, observation.original)" r="5" :data-x="target" :data-y="observation.original" />
              <circle v-if="visibleY(plot, observation.polynomial)" class="taylor-polynomial-point" :cx="plotX(plot, target)" :cy="plotY(plot, observation.polynomial)" r="5" :data-x="target" :data-y="observation.polynomial" />
              <text v-else class="taylor-offscreen-arrow" :x="plotX(plot, target)" :y="observation.polynomial > plot.maxY ? frame.top + 16 : frame.bottom - 5" text-anchor="middle">{{ observation.polynomial > plot.maxY ? '↑' : '↓' }}</text>
            </g>
          </g>
        </svg>
        <p v-if="plot.id === 'local'" class="taylor-plot-note">距基点 0.5 处的绝对误差：<strong>{{ formatNumber(nearObservation?.absoluteError) }}</strong>。{{ !plot.visibleTarget ? '当前目标已在局部视野之外。' : '' }}</p>
        <p v-else-if="plot.clipped" class="taylor-plot-note taylor-clipping-note">虚线已有部分超出纵轴范围<span v-if="plot.targetClipped">，箭头表示目标多项式点在画面之外</span>；下方保留实际数值。</p>
        <p v-else class="taylor-plot-note">纵轴按原函数取范围；误差线比较同一个 x 处的两个值。</p>
      </section>
    </div>

    <div v-if="observation" class="taylor-readouts" aria-label="目标点数值">
      <div><span>原函数 f(x)</span><output id="taylor-original-value" :data-value="observation.original">{{ formatNumber(observation.original) }}</output></div>
      <div><span>多项式 Pₙ(x)</span><output id="taylor-polynomial-value" :data-value="observation.polynomial">{{ formatNumber(observation.polynomial) }}</output></div>
      <div class="taylor-error-readout"><span>绝对误差 |Rₙ(x)|</span><output id="taylor-absolute-error" :data-value="observation.absoluteError">{{ formatNumber(observation.absoluteError) }}</output></div>
      <div><span>拉格朗日上界 Eₙ(x)</span><output id="taylor-error-bound" :data-value="observation.bound">{{ formatNumber(observation.bound) }}</output></div>
    </div>

    <div class="taylor-model"><MathFormula :tex="functionTex" /><MathFormula :tex="modelTex" /></div>
    <p class="taylor-conclusion">局部匹配并不保证远处同样准确。误差上界是保证范围，不等于实际误差；提高阶数后，仍要检查目标位置与误差。</p>
  </section>
</template>

<style scoped>
.taylor-approximation-demo { --taylor-original: #087e8b; --taylor-polynomial: #bb5612; max-width: 1180px; margin: 0 auto; padding: clamp(22px, 3vw, 38px); border: 1px solid var(--border); border-radius: 8px; background: var(--surface); }
.taylor-eyebrow { margin: 0 0 7px; color: var(--accent); font-size: 13px; font-weight: 650; }
.taylor-heading h1 { margin: 0; font-size: clamp(26px, 3.2vw, 36px); line-height: 1.25; letter-spacing: -.025em; }
.taylor-heading > p:last-child { margin: 10px 0 18px; color: var(--ink-muted); font-size: 14px; line-height: 1.7; }
.taylor-function-choices, .taylor-presets { display: flex; flex-wrap: wrap; gap: 8px; }
.taylor-function-choices button, .taylor-presets button { min-height: 38px; padding: 7px 14px; border: 1px solid var(--border); border-radius: 5px; background: var(--surface-muted); color: var(--ink-muted); font-size: 13px; }
.taylor-function-choices button.is-active, .taylor-presets button.is-active { border-color: var(--accent-border); background: var(--accent-soft); color: var(--accent-text); }
.taylor-presets button:disabled { opacity: .5; cursor: not-allowed; }
.taylor-controls { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; margin: 20px 0 12px; }
.taylor-slider { min-width: 0; }
.taylor-slider label { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-size: 12px; font-weight: 600; }
.taylor-slider output { color: var(--accent-text); font-size: 17px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.taylor-slider input { width: 100%; min-height: 36px; margin: 3px 0 0; accent-color: var(--accent); }
.taylor-input { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 18px; margin: 15px 0 0; font-size: 14px; }
.taylor-input > span { color: var(--ink-muted); font-size: 12px; }
.taylor-domain-note { margin: 8px 0 0; color: var(--accent-text); font-size: 12px; line-height: 1.6; }
.taylor-legend { display: flex; flex-wrap: wrap; gap: 9px 22px; margin: 18px 0 12px; color: var(--ink-muted); font-size: 12px; }
.taylor-legend > span { display: inline-flex; align-items: center; gap: 7px; }
.taylor-key { display: inline-block; width: 23px; border-top: 2px solid; }
.taylor-key.is-original { border-color: var(--taylor-original); }
.taylor-key.is-polynomial { border-color: var(--taylor-polynomial); border-top-style: dashed; }
.taylor-key.is-error { border-color: var(--accent); }
.taylor-plots { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.taylor-plot { min-width: 0; }
.taylor-plot > header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 6px; }
.taylor-plot h2 { margin: 0; font-size: 17px; font-weight: 650; }
.taylor-plot > header > span { color: var(--ink-muted); font-size: 12px; }
.taylor-plot svg { display: block; width: 100%; height: auto; }
.taylor-frame { fill: var(--surface); stroke: var(--border); vector-effect: non-scaling-stroke; }
.taylor-grid line { stroke: var(--border); stroke-width: .7; opacity: .65; vector-effect: non-scaling-stroke; }
.taylor-ticks text { fill: var(--ink-muted); font-size: 13px; font-variant-numeric: tabular-nums; }
.taylor-original-curve, .taylor-polynomial-curve { fill: none; stroke-width: 1.9; vector-effect: non-scaling-stroke; }
.taylor-original-curve { stroke: var(--taylor-original); }
.taylor-polynomial-curve { stroke: var(--taylor-polynomial); stroke-dasharray: 7 5; }
.taylor-base-guide { stroke: var(--ink-subtle); stroke-width: 1; stroke-dasharray: 3 5; vector-effect: non-scaling-stroke; }
.taylor-base-point { fill: var(--surface); stroke: var(--ink); stroke-width: 1.6; vector-effect: non-scaling-stroke; }
.taylor-target-guide { stroke: var(--accent-border); stroke-width: 1; vector-effect: non-scaling-stroke; }
.taylor-error-line { stroke: var(--accent); stroke-width: 2.5; vector-effect: non-scaling-stroke; }
.taylor-original-point { fill: var(--taylor-original); stroke: var(--surface); stroke-width: 1.4; }
.taylor-polynomial-point { fill: var(--surface); stroke: var(--taylor-polynomial); stroke-width: 2.2; }
.taylor-offscreen-arrow { fill: var(--taylor-polynomial); font-size: 24px; font-weight: 700; }
.taylor-plot-note { min-height: 38px; margin: 0; color: var(--ink-muted); font-size: 12px; line-height: 1.6; }
.taylor-plot-note strong { color: var(--accent-text); font-weight: 650; }
.taylor-clipping-note { color: var(--taylor-polynomial); }
.taylor-readouts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 15px; }
.taylor-readouts > div { min-width: 0; padding: 12px 14px; border: 1px solid var(--border); border-radius: 5px; background: var(--surface-muted); }
.taylor-readouts span { display: block; margin-bottom: 5px; color: var(--ink-muted); font-size: 12px; }
.taylor-readouts output { display: block; color: var(--ink); font-size: clamp(18px, 2.5vw, 25px); font-weight: 650; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.taylor-readouts .taylor-error-readout { border-color: var(--accent-border); background: var(--accent-soft); }
.taylor-error-readout output { color: var(--accent-text); }
.taylor-model { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 30px; margin-top: 20px; font-size: 14px; }
.taylor-model .math-formula { max-width: 100%; overflow-x: auto; overflow-y: hidden; }
.taylor-conclusion { margin: 12px 0 0; color: var(--ink-muted); font-size: 12px; line-height: 1.7; }
[data-theme="dark"] .taylor-approximation-demo { --taylor-original: #62ccd5; --taylor-polynomial: #ffb16e; }
@media (max-width: 1050px) {
  .taylor-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 20px; }
}
@media (max-width: 900px) {
  .taylor-plots { grid-template-columns: 1fr; gap: 16px; }
}
@media (max-width: 560px) {
  .taylor-approximation-demo { padding: 20px 14px; }
  .taylor-readouts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .taylor-readouts > div { padding: 10px; }
  .taylor-controls { gap: 9px 14px; }
  .taylor-slider label { font-size: 11px; }
  .taylor-slider output { font-size: 15px; }
  .taylor-function-choices button, .taylor-presets button { padding-inline: 10px; font-size: 12px; }
}
</style>
