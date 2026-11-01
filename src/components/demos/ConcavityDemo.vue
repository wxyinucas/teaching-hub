<script setup>
import { computed, nextTick, onActivated, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const functionId = ref('cube')
const x = ref(-1)
const plotHost = ref(null)
const chart = reactive({ width: 960, height: 210, left: 53, right: 940, top: 17, bottom: 168 })
const xMin = -1.5
const xMax = 1.5
const xTicks = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]
const comparisonPoints = [-1, -0.5, 0, 0.5, 1]
const functions = {
  cube: {
    tex: 'f(x)=x^3', derivativeTex: "f'(x)=3x^2", secondTex: "f''(x)=6x",
    f: (at) => at ** 3, derivative: (at) => 3 * at ** 2, second: (at) => 6 * at,
    range: { min: -3.6, max: 3.6, ticks: [-3, -1.5, 0, 1.5, 3] },
    derivativeRange: { min: -0.5, max: 7.3, ticks: [0, 2, 4, 6] },
  },
  quartic: {
    tex: 'f(x)=x^4', derivativeTex: "f'(x)=4x^3", secondTex: "f''(x)=12x^2",
    f: (at) => at ** 4, derivative: (at) => 4 * at ** 3, second: (at) => 12 * at ** 2,
    range: { min: -0.5, max: 5.5, ticks: [0, 2, 4] },
    derivativeRange: { min: -14, max: 14, ticks: [-12, -6, 0, 6, 12] },
  },
}
const selected = computed(() => functions[functionId.value])
const f = (at) => selected.value.f(at)
const derivative = (at) => selected.value.derivative(at)
const second = (at) => selected.value.second(at)
const value = computed(() => f(x.value))
const slope = computed(() => derivative(x.value))
const secondValue = computed(() => second(x.value))
const bending = computed(() => secondValue.value === 0 ? 'zero' : secondValue.value > 0 ? 'up' : 'down')
const format = (number) => Number(number.toFixed(4)).toString()
const plotX = (at) => chart.left + (at - xMin) / (xMax - xMin) * (chart.right - chart.left)
const plotY = (at, plot) => chart.bottom - (at - plot.min) / (plot.max - plot.min) * (chart.bottom - chart.top)
const plots = computed(() => [
  { kind: 'function', heading: '原函数', tex: selected.value.tex, ...selected.value.range },
  { kind: 'derivative', heading: '导函数', tex: selected.value.derivativeTex, ...selected.value.derivativeRange },
])
const pieces = computed(() => [
  { start: xMin, end: 0, bending: functionId.value === 'cube' ? 'down' : 'up' },
  { start: 0, end: xMax, bending: 'up' },
])
const slopeMeaning = computed(() => slope.value === 0
  ? '当前切线水平'
  : slope.value > 0 ? '当前切线向右上倾斜' : '当前切线向右下倾斜')
const bendingMeaning = computed(() => bending.value === 'zero'
  ? '该点二阶导数为零，继续比较两侧'
  : bending.value === 'up' ? '斜率在增加 · 向上凹' : '斜率在减少 · 向上凸')
const comparison = computed(() => {
  if (functionId.value === 'cube') {
    if (x.value === 0) return '原点两侧，导函数先减少后增加，凹凸发生转换；原点是拐点。原函数两侧都增加，原点没有极值。'
    return x.value < 0
      ? '原函数在增加，切线却越来越平：导函数在减少，二阶导数为负，曲线向上凸。'
      : '原函数仍在增加，切线越来越陡：导函数在增加，二阶导数为正，曲线向上凹。'
  }
  if (x.value === 0) return '原点的二阶导数为零，但导函数在两侧都增加，曲线两侧都向上凹；原点不是拐点。原函数在这里先减后增，有极小值。'
  return x.value < 0
    ? '原函数在减少，负斜率逐渐接近零；斜率仍在增加，曲线向上凹。'
    : '原函数在增加，正斜率继续增大；斜率在增加，曲线仍向上凹。'
})

function curvePath(piece, plot) {
  return Array.from({ length: 101 }, (_, index) => {
    const at = piece.start + index / 100 * (piece.end - piece.start)
    const height = plot.kind === 'function' ? f(at) : derivative(at)
    return (index ? 'L ' : 'M ') + plotX(at).toFixed(3) + ' ' + plotY(height, plot).toFixed(3)
  }).join(' ')
}

function tangentAt(at, plot, halfWidth = 0.22) {
  const height = plot.kind === 'function' ? f(at) : derivative(at)
  const tilt = plot.kind === 'function' ? derivative(at) : second(at)
  const start = Math.max(xMin, at - halfWidth)
  const end = Math.min(xMax, at + halfWidth)
  return {
    x1: plotX(start), x2: plotX(end),
    y1: plotY(height + tilt * (start - at), plot),
    y2: plotY(height + tilt * (end - at), plot),
  }
}

function fitPlots(width) {
  if (width > 0) {
    chart.width = Math.max(300, Math.round(width))
    chart.left = chart.width < 480 ? 43 : 53
    chart.right = chart.width - 20
  }
  chart.height = Math.max(125, Math.min(230, Math.floor((window.innerHeight - 530) / 2)))
  chart.bottom = chart.height - 40
}
function onResize() { fitPlots(plotHost.value?.clientWidth) }
let resizeObserver = null
onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
  if (typeof ResizeObserver !== 'undefined' && plotHost.value) {
    resizeObserver = new ResizeObserver(([entry]) => fitPlots(entry.contentRect.width))
    resizeObserver.observe(plotHost.value)
  }
})
onActivated(async () => { await nextTick(); onResize() })
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="concavity-demo" :data-function="functionId" :data-bending="bending">
    <header class="concavity-heading">
      <p class="concavity-eyebrow">凹凸与拐点</p>
      <h1>{{ functionId === 'cube' ? '都在上升，也可以弯得不同' : '二阶导数为零，也未必是拐点' }}</h1>
      <p>上图比较切线斜率怎样变，下图把斜率画成函数。淡色短线保留几个位置的切线。</p>
    </header>

    <div class="concavity-choices" aria-label="比较函数">
      <button type="button" data-function-choice="cube" :aria-pressed="functionId === 'cube'" @click="functionId = 'cube'">
        <MathFormula tex="x^3" /> · 拐点不一定是极值点
      </button>
      <button type="button" data-function-choice="quartic" :aria-pressed="functionId === 'quartic'" @click="functionId = 'quartic'">
        <MathFormula tex="x^4" /> · 二阶导数为零，还要看两侧
      </button>
    </div>
    <div class="concavity-controls">
      <div class="demo-slider-control">
        <label for="concavity-x-range">
          <span>移动横坐标</span>
          <output id="concavity-x-output" for="concavity-x-range">x = {{ format(x) }}</output>
        </label>
        <input id="concavity-x-range" v-model.number="x" type="range" :min="xMin" :max="xMax" step="0.005" :aria-valuetext="'x = ' + format(x)" aria-describedby="concavity-result">
      </div>
      <div class="concavity-presets" aria-label="观察位置">
        <button v-for="at in [-1, 0, 1]" :key="at" type="button" :data-preset="at" :aria-pressed="x === at" @click="x = at">x = {{ at }}</button>
      </div>
    </div>
    <div class="concavity-legend" aria-label="图例">
      <span class="is-up"><i></i>斜率增加 · 向上凹</span>
      <span class="is-down"><i></i>斜率减少 · 向上凸</span>
      <span class="is-current"><i></i>当前切线与联动游标</span>
    </div>

    <div ref="plotHost" class="concavity-plots">
      <section v-for="plot in plots" :key="plot.kind" class="concavity-plot" :aria-labelledby="'concavity-' + plot.kind + '-heading'">
        <div class="concavity-plot-heading">
          <h2 :id="'concavity-' + plot.kind + '-heading'">{{ plot.heading }} · <MathFormula :tex="plot.tex" /></h2>
          <output :id="'concavity-' + plot.kind + '-value'" :data-value="plot.kind === 'function' ? value : slope">
            {{ plot.kind === 'function' ? '函数值' : '斜率值' }} {{ format(plot.kind === 'function' ? value : slope) }}
          </output>
        </div>
        <svg :viewBox="'0 0 ' + chart.width + ' ' + chart.height" role="img" :class="'concavity-' + plot.kind + '-plot'" :aria-labelledby="'concavity-' + plot.kind + '-title concavity-' + plot.kind + '-description'">
          <title :id="'concavity-' + plot.kind + '-title'">{{ plot.kind === 'function' ? '原函数与切线斜率的变化' : '导函数的升降与二阶导数' }}</title>
          <desc :id="'concavity-' + plot.kind + '-description'">当前 x = {{ format(x) }}，{{ comparison }}</desc>
          <defs><clipPath :id="'concavity-' + plot.kind + '-clip'"><rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" /></clipPath></defs>
          <rect class="concavity-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          <g class="concavity-grid" aria-hidden="true">
            <line v-for="tick in xTicks" :key="'x-' + tick" :x1="plotX(tick)" :x2="plotX(tick)" :y1="chart.top" :y2="chart.bottom" />
            <line v-for="tick in plot.ticks" :key="'y-' + tick" :x1="chart.left" :x2="chart.right" :y1="plotY(tick, plot)" :y2="plotY(tick, plot)" />
          </g>
          <g class="concavity-labels" aria-hidden="true">
            <text v-for="tick in xTicks" :key="'x-' + tick" :x="plotX(tick)" :y="chart.bottom + 21" text-anchor="middle">{{ tick }}</text>
            <text v-for="tick in plot.ticks" :key="'y-' + tick" :x="chart.left - 9" :y="plotY(tick, plot) + 5" text-anchor="end">{{ tick }}</text>
            <text :x="chart.right" :y="chart.height - 1" text-anchor="end">x</text>
          </g>
          <g :clip-path="'url(#concavity-' + plot.kind + '-clip)'">
            <line class="concavity-zero-axis" :x1="chart.left" :x2="chart.right" :y1="plotY(0, plot)" :y2="plotY(0, plot)" />
            <line class="concavity-origin-guide" :x1="plotX(0)" :x2="plotX(0)" :y1="chart.top" :y2="chart.bottom" />
            <line v-for="at in comparisonPoints" :key="'tangent-' + at" v-bind="tangentAt(at, plot, 0.16)" class="concavity-comparison-tangent" />
            <path v-for="(piece, index) in pieces" :key="index" :d="curvePath(piece, plot)" class="concavity-curve" :class="'is-' + piece.bending" />
            <line class="concavity-current-guide" :x1="plotX(x)" :x2="plotX(x)" :y1="chart.top" :y2="chart.bottom" />
            <line v-bind="tangentAt(x, plot)" :class="['concavity-tangent', 'concavity-' + plot.kind + '-tangent']" />
            <circle :class="'concavity-' + plot.kind + '-point'" class="concavity-current-point" :data-x="x" :cx="plotX(x)" :cy="plotY(plot.kind === 'function' ? value : slope, plot)" r="5" />
          </g>
        </svg>
      </section>
    </div>

    <div class="concavity-readouts">
      <p><MathFormula :tex="selected.derivativeTex" /><output id="concavity-slope" :data-value="slope">当前 {{ format(slope) }}</output><span>{{ slopeMeaning }}</span></p>
      <p><MathFormula :tex="selected.secondTex" /><output id="concavity-second" :data-value="secondValue">当前 {{ format(secondValue) }}</output><span>{{ bendingMeaning }}</span></p>
    </div>
    <p id="concavity-result" role="status" aria-live="polite" aria-atomic="true">{{ comparison }}</p>
    <p class="concavity-window-note">两图横轴一致，纵轴刻度不同。颜色表示斜率的增减；凹凸按一段区间判断，拐点要比较两侧。</p>
  </section>
</template>

<style scoped>
.concavity-demo {
  --concavity-up: #087f8c;
  --concavity-down: #b35b12;
  --concavity-current: #7850a7;
  max-width: 1180px; margin: 0 auto; padding: clamp(20px, 2.4vw, 30px);
  border: 1px solid var(--border); border-radius: 8px; background: var(--surface);
}
[data-theme="dark"] .concavity-demo { --concavity-up: #62ccd5; --concavity-down: #ffb16e; --concavity-current: #c3a2e9; }
.concavity-eyebrow { margin: 0 0 6px; color: var(--accent-text); font-size: 12px; font-weight: 650; }
.concavity-heading h1 { margin: 0; font-size: clamp(25px, 3vw, 34px); line-height: 1.2; letter-spacing: -.025em; }
.concavity-heading > p:last-child { margin: 8px 0 0; color: var(--ink-muted); font-size: 14px; line-height: 1.6; }
.concavity-choices { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; }
.concavity-choices button, .concavity-presets button { min-height: 32px; padding: 4px 11px; border: 1px solid var(--border); border-radius: 4px; color: var(--ink-muted); background: var(--surface-muted); font-size: 12px; font-weight: 600; }
.concavity-choices button:hover, .concavity-presets button:hover,
.concavity-choices button[aria-pressed="true"], .concavity-presets button[aria-pressed="true"] { border-color: var(--accent-border); color: var(--accent-text); background: var(--accent-soft); }
.concavity-controls { display: grid; gap: 8px; margin: 10px 0; }
.concavity-presets { display: flex; flex-wrap: wrap; gap: 6px; }
.concavity-legend { display: flex; flex-wrap: wrap; gap: 6px 22px; margin: 10px 0; color: var(--ink-muted); font-size: 12px; }
.concavity-legend > span { display: inline-flex; align-items: center; gap: 7px; }
.concavity-legend i { width: 22px; border-top: 2px solid currentColor; }
.concavity-legend .is-current i { border-top-style: dashed; }
.is-up { color: var(--concavity-up); }
.is-down { color: var(--concavity-down); }
.is-current { color: var(--concavity-current); }
.concavity-plots { display: grid; gap: 9px; }
.concavity-plot { min-width: 0; }
.concavity-plot-heading { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 4px 14px; margin-bottom: 5px; }
.concavity-plot-heading h2 { margin: 0; color: var(--ink); font-size: 15px; line-height: 1.5; font-weight: 650; }
.concavity-plot-heading output { color: var(--ink-muted); font-size: 13px; font-weight: 650; font-variant-numeric: tabular-nums; }
.concavity-plot svg { display: block; width: 100%; height: auto; overflow: visible; }
.concavity-frame { fill: var(--surface); stroke: var(--border); vector-effect: non-scaling-stroke; }
.concavity-grid line { stroke: var(--border); stroke-width: .6; opacity: .65; vector-effect: non-scaling-stroke; }
.concavity-labels text { fill: var(--ink-muted); font-size: 14px; font-variant-numeric: tabular-nums; }
.concavity-curve { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.concavity-zero-axis { stroke: var(--ink-muted); stroke-width: 1; vector-effect: non-scaling-stroke; }
.concavity-origin-guide { stroke: var(--ink-subtle); stroke-width: .9; stroke-dasharray: 5 5; opacity: .7; vector-effect: non-scaling-stroke; }
.concavity-comparison-tangent { stroke: var(--ink-muted); stroke-width: 1; opacity: .4; vector-effect: non-scaling-stroke; }
.concavity-current-guide { stroke: var(--concavity-current); stroke-width: 1; stroke-dasharray: 3 4; opacity: .7; vector-effect: non-scaling-stroke; }
.concavity-tangent { stroke: var(--concavity-current); stroke-width: 2; stroke-dasharray: 7 3; vector-effect: non-scaling-stroke; }
.concavity-current-point { fill: var(--concavity-current); stroke: var(--surface); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.concavity-readouts { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 22px; margin-top: 9px; padding-top: 9px; border-top: 1px solid var(--border); }
.concavity-readouts p { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; margin: 0; font-size: 13px; line-height: 1.7; }
.concavity-readouts output { color: var(--concavity-current); font-weight: 650; font-variant-numeric: tabular-nums; }
.concavity-readouts p > span:last-child { color: var(--ink-muted); }
#concavity-result { margin: 8px 0 0; color: var(--ink); font-size: 13px; line-height: 1.7; }
.concavity-window-note { margin: 6px 0 0; color: var(--ink-subtle); font-size: 11px; line-height: 1.5; }
@media (min-width: 1000px) {
  .concavity-controls { grid-template-columns: minmax(280px, 1fr) auto; align-items: end; column-gap: 28px; }
  .concavity-presets { padding-bottom: 5px; }
}
@media (max-width: 680px) {
  .concavity-demo { padding: 20px 14px; }
  .concavity-heading h1 { font-size: 25px; }
  .concavity-plot-heading h2 { font-size: 13px; }
  .concavity-legend { gap: 5px 12px; font-size: 11px; }
  .concavity-readouts { grid-template-columns: 1fr; }
}
</style>
