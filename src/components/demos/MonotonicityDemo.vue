<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const x = ref(0.75)
const plotHost = ref(null)
const chart = reactive({ width: 960, height: 210, left: 55, right: 936, top: 18, bottom: 168 })
const xMin = 0.5
const xMax = 2.5
const xTicks = [0.5, 1, 1.5, 2, 2.5]
const pieces = [
  { start: xMin, end: 1, sign: 'positive' },
  { start: 1, end: 2, sign: 'negative' },
  { start: 2, end: xMax, sign: 'positive' },
]
const plots = [
  { kind: 'function', heading: '原函数', tex: 'f(x)=2x^3-9x^2+12x-3', min: 0.5, max: 2.5, ticks: [0.5, 1, 1.5, 2, 2.5] },
  { kind: 'derivative', heading: '导函数', tex: "f'(x)=6(x-1)(x-2)", min: -2, max: 5, ticks: [-1.5, 0, 1.5, 3, 4.5] },
]
const presets = [
  { id: 'left', x: 0.75, label: '增加段 ①' },
  { id: 'first-zero', x: 1, label: 'x = 1' },
  { id: 'middle', x: 1.5, label: '减少段' },
  { id: 'second-zero', x: 2, label: 'x = 2' },
  { id: 'right', x: 2.25, label: '增加段 ②' },
]
let resizeObserver = null

const f = (value) => 2 * value ** 3 - 9 * value ** 2 + 12 * value - 3
const derivative = (value) => 6 * (value - 1) * (value - 2)
const value = computed(() => f(x.value))
const slope = computed(() => derivative(x.value))
const sign = computed(() => Math.abs(slope.value) < 1e-9 ? 'zero' : slope.value > 0 ? 'positive' : 'negative')
const format = (number) => Number(number.toFixed(4)).toString()
const plotX = (value) => chart.left + (value - xMin) / (xMax - xMin) * (chart.right - chart.left)
const plotY = (value, plot) => chart.bottom - (value - plot.min) / (plot.max - plot.min) * (chart.bottom - chart.top)
const tangent = computed(() => {
  const start = Math.max(xMin, x.value - 0.18)
  const end = Math.min(xMax, x.value + 0.18)
  return {
    start, end,
    startValue: value.value + slope.value * (start - x.value),
    endValue: value.value + slope.value * (end - x.value),
  }
})
const correspondence = computed(() => "f'(" + format(x.value) + ')=' + format(slope.value))
const comparison = computed(() => {
  if (sign.value === 'zero') {
    return x.value === 1
      ? 'x = 1：下图经过零点，上图切线水平；左右导数由正变负，原函数由增加转为减少。'
      : 'x = 2：下图经过零点，上图切线水平；左右导数由负变正，原函数由减少转为增加。'
  }
  return sign.value === 'positive'
    ? '下图在零轴上方：导数为正；上图切线向右上方倾斜，原函数在这一段增加。'
    : '下图在零轴下方：导数为负；上图切线向右下方倾斜，原函数在这一段减少。'
})

function curvePath(piece, plot) {
  return Array.from({ length: 101 }, (_, index) => {
    const at = piece.start + index / 100 * (piece.end - piece.start)
    const height = plot.kind === 'function' ? f(at) : derivative(at)
    return (index ? 'L ' : 'M ') + plotX(at).toFixed(3) + ' ' + plotY(height, plot).toFixed(3)
  }).join(' ')
}

function fitPlots(width) {
  if (width > 0) {
    chart.width = Math.max(300, Math.round(width))
    chart.left = chart.width < 480 ? 43 : 55
    chart.right = chart.width - 18
  }
  chart.height = Math.max(150, Math.min(230, Math.floor((window.innerHeight - 420) / 2)))
  chart.bottom = chart.height - 42
}

function onResize() {
  fitPlots(plotHost.value?.clientWidth)
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
  if (typeof ResizeObserver !== 'undefined' && plotHost.value) {
    resizeObserver = new ResizeObserver(([entry]) => fitPlots(entry.contentRect.width))
    resizeObserver.observe(plotHost.value)
  }
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="monotonicity-demo" :data-sign="sign">
    <header class="monotonicity-heading">
      <p class="monotonicity-eyebrow">教材第 108 页例 4 · 单调性与极值</p>
      <h1>同一个函数，两种读法</h1>
      <p>上图看函数怎样升降，下图看导数的正负。两图使用同一个横坐标。</p>
    </header>

    <div class="monotonicity-controls">
      <div class="demo-slider-control">
        <label for="monotonicity-x-range">
          <span>移动横坐标</span>
          <output id="monotonicity-x-output" for="monotonicity-x-range">x = {{ format(x) }}</output>
        </label>
        <input
          id="monotonicity-x-range"
          v-model.number="x"
          type="range"
          :min="xMin"
          :max="xMax"
          step="0.005"
          :aria-valuetext="'x = ' + format(x)"
          aria-describedby="monotonicity-result"
        >
      </div>
      <div class="monotonicity-presets" aria-label="观察位置">
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          :data-preset="preset.id"
          :aria-pressed="x === preset.x"
          @click="x = preset.x"
        >{{ preset.label }}</button>
      </div>
    </div>

    <div class="monotonicity-legend" aria-label="图例">
      <span class="is-positive"><i></i>导数为正 · 原函数增加</span>
      <span class="is-negative"><i></i>导数为负 · 原函数减少</span>
      <span class="is-zero"><i></i>联动游标／当前切线</span>
    </div>

    <div ref="plotHost" class="monotonicity-plots">
      <section
        v-for="plot in plots"
        :key="plot.kind"
        class="monotonicity-plot"
        :aria-labelledby="'monotonicity-' + plot.kind + '-heading'"
      >
        <div class="monotonicity-plot-heading">
          <h2 :id="'monotonicity-' + plot.kind + '-heading'">
            {{ plot.heading }} · <MathFormula :tex="plot.tex" />
          </h2>
          <output :id="'monotonicity-' + plot.kind + '-value'" :data-value="plot.kind === 'function' ? value : slope">
            {{ plot.kind === 'function' ? '函数值' : '导数值' }} {{ format(plot.kind === 'function' ? value : slope) }}
          </output>
        </div>
        <svg
          :viewBox="'0 0 ' + chart.width + ' ' + chart.height"
          role="img"
          :class="'monotonicity-' + plot.kind + '-plot'"
          :aria-labelledby="'monotonicity-' + plot.kind + '-title monotonicity-' + plot.kind + '-description'"
        >
          <title :id="'monotonicity-' + plot.kind + '-title'">{{ plot.kind === 'function' ? '原函数图：移动点与切线' : '导函数图：同一横坐标下的导数值' }}</title>
          <desc :id="'monotonicity-' + plot.kind + '-description'">当前 x = {{ format(x) }}，{{ plot.kind === 'function' ? '函数值' : '导数值' }}为 {{ format(plot.kind === 'function' ? value : slope) }}。虚线标出 x = 1 和 x = 2。{{ comparison }}</desc>
          <defs>
            <clipPath :id="'monotonicity-' + plot.kind + '-clip'">
              <rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
            </clipPath>
          </defs>
          <rect class="monotonicity-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          <g class="monotonicity-grid" aria-hidden="true">
            <line v-for="tick in plot.ticks" :key="'y-' + tick" :x1="chart.left" :x2="chart.right" :y1="plotY(tick, plot)" :y2="plotY(tick, plot)" />
            <line v-for="tick in xTicks" :key="'x-' + tick" :x1="plotX(tick)" :x2="plotX(tick)" :y1="chart.top" :y2="chart.bottom" />
          </g>
          <g class="monotonicity-labels" aria-hidden="true">
            <text v-for="tick in plot.ticks" :key="'y-' + tick" :x="chart.left - 9" :y="plotY(tick, plot) + 5" text-anchor="end">{{ tick }}</text>
            <text v-for="tick in xTicks" :key="'x-' + tick" :x="plotX(tick)" :y="chart.bottom + 22" text-anchor="middle">{{ tick }}</text>
            <text :x="chart.right" :y="chart.height - 1" text-anchor="end">x</text>
          </g>
          <g :clip-path="'url(#monotonicity-' + plot.kind + '-clip)'">
            <rect v-if="plot.kind === 'derivative'" class="monotonicity-negative-band" :x="plotX(1)" :y="plotY(0, plot)" :width="plotX(2) - plotX(1)" :height="chart.bottom - plotY(0, plot)" />
            <line v-for="critical in [1, 2]" :key="critical" class="monotonicity-critical-guide" :x1="plotX(critical)" :x2="plotX(critical)" :y1="chart.top" :y2="chart.bottom" />
            <line v-if="plot.kind === 'derivative'" class="monotonicity-zero-axis" :x1="chart.left" :x2="chart.right" :y1="plotY(0, plot)" :y2="plotY(0, plot)" />
            <path v-for="(piece, index) in pieces" :key="index" :d="curvePath(piece, plot)" class="monotonicity-curve" :class="'is-' + piece.sign" />
            <line class="monotonicity-current-guide" :x1="plotX(x)" :x2="plotX(x)" :y1="chart.top" :y2="chart.bottom" />
            <line
              v-if="plot.kind === 'function'"
              class="monotonicity-tangent"
              :class="'is-' + sign"
              :x1="plotX(tangent.start)"
              :x2="plotX(tangent.end)"
              :y1="plotY(tangent.startValue, plot)"
              :y2="plotY(tangent.endValue, plot)"
            />
            <line v-else class="monotonicity-current-height" :class="'is-' + sign" :x1="plotX(x)" :x2="plotX(x)" :y1="plotY(0, plot)" :y2="plotY(slope, plot)" />
            <circle
              v-for="critical in [1, 2]"
              :key="'zero-' + critical"
              class="monotonicity-critical-point"
              :cx="plotX(critical)"
              :cy="plotY(plot.kind === 'function' ? f(critical) : 0, plot)"
              r="3"
            />
            <circle
              :class="['monotonicity-' + plot.kind + '-point', 'monotonicity-current-point', 'is-' + sign]"
              :data-x="x"
              :cx="plotX(x)"
              :cy="plotY(plot.kind === 'function' ? value : slope, plot)"
              r="5.5"
            />
          </g>
        </svg>
      </section>
    </div>

    <div id="monotonicity-result" class="monotonicity-result" :class="'is-' + sign" role="status" aria-live="polite" aria-atomic="true">
      <p><strong>上图切线斜率 ＝ 下图纵坐标：</strong><MathFormula :tex="correspondence" /></p>
      <p>{{ comparison }}</p>
    </div>
    <p class="monotonicity-window-note">观察窗口：0.5 ≤ x ≤ 2.5。两图横轴刻度一致，纵轴分别表示函数值与导数值。</p>
  </section>
</template>

<style scoped>
.monotonicity-demo {
  --mono-positive: #087f8c;
  --mono-negative: #b35b12;
  --mono-zero: #7850a7;
  max-width: 1180px; margin: 0 auto; padding: clamp(20px, 2.4vw, 30px);
  border: 1px solid var(--border); border-radius: 8px; background: var(--surface);
}
[data-theme="dark"] .monotonicity-demo { --mono-positive: #62ccd5; --mono-negative: #ffb16e; --mono-zero: #c3a2e9; }
.monotonicity-eyebrow { margin: 0 0 6px; color: var(--accent-text); font-size: 12px; font-weight: 650; }
.monotonicity-heading h1 { margin: 0; font-size: clamp(25px, 3vw, 34px); line-height: 1.2; letter-spacing: -.025em; }
.monotonicity-heading > p:last-child { margin: 8px 0 0; color: var(--ink-muted); font-size: 14px; line-height: 1.6; }
.monotonicity-controls { display: grid; gap: 8px; margin: 15px 0 10px; }
.monotonicity-presets { display: flex; flex-wrap: wrap; gap: 6px; }
.monotonicity-presets button { min-height: 31px; padding: 4px 11px; border: 1px solid var(--border); border-radius: 4px; color: var(--ink-muted); background: var(--surface-muted); font-size: 12px; font-weight: 600; }
.monotonicity-presets button:hover, .monotonicity-presets button[aria-pressed="true"] { border-color: var(--accent-border); color: var(--accent-text); background: var(--accent-soft); }
.monotonicity-legend { display: flex; flex-wrap: wrap; gap: 6px 22px; margin: 10px 0; color: var(--ink-muted); font-size: 12px; }
.monotonicity-legend > span { display: inline-flex; align-items: center; gap: 7px; }
.monotonicity-legend i { width: 22px; border-top: 2px solid currentColor; }
.monotonicity-legend .is-zero i { border-top-style: dashed; }
.is-positive { color: var(--mono-positive); }
.is-negative { color: var(--mono-negative); }
.is-zero { color: var(--mono-zero); }
.monotonicity-plots { display: grid; gap: 9px; }
.monotonicity-plot { min-width: 0; }
.monotonicity-plot-heading { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 4px 14px; margin-bottom: 5px; }
.monotonicity-plot-heading h2 { margin: 0; color: var(--ink); font-size: 15px; line-height: 1.5; font-weight: 650; }
.monotonicity-plot-heading output { color: var(--ink-muted); font-size: 13px; font-weight: 650; font-variant-numeric: tabular-nums; }
.monotonicity-plot svg { display: block; width: 100%; height: auto; overflow: visible; }
.monotonicity-frame { fill: var(--surface); stroke: var(--border); vector-effect: non-scaling-stroke; }
.monotonicity-grid line { stroke: var(--border); stroke-width: .6; opacity: .65; vector-effect: non-scaling-stroke; }
.monotonicity-labels text { fill: var(--ink-muted); font-size: 14px; font-variant-numeric: tabular-nums; }
.monotonicity-curve { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.monotonicity-critical-guide { stroke: var(--ink-subtle); stroke-width: .9; stroke-dasharray: 5 5; opacity: .7; vector-effect: non-scaling-stroke; }
.monotonicity-zero-axis { stroke: var(--ink-muted); stroke-width: 1.3; vector-effect: non-scaling-stroke; }
.monotonicity-negative-band { fill: var(--mono-negative); opacity: .07; }
.monotonicity-current-guide { stroke: var(--mono-zero); stroke-width: 1.1; stroke-dasharray: 3 4; opacity: .8; vector-effect: non-scaling-stroke; }
.monotonicity-tangent { stroke: var(--mono-zero); stroke-width: 2; stroke-dasharray: 7 3; vector-effect: non-scaling-stroke; }
.monotonicity-current-height { stroke: currentColor; stroke-width: 1.3; vector-effect: non-scaling-stroke; }
.monotonicity-current-point { fill: currentColor; stroke: var(--surface); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.monotonicity-critical-point { fill: var(--surface); stroke: var(--mono-zero); stroke-width: 1.4; vector-effect: non-scaling-stroke; }
.monotonicity-result { margin-top: 9px; padding-top: 9px; border-top: 1px solid var(--border); }
.monotonicity-result p { display: flex; flex-wrap: wrap; align-items: baseline; gap: 3px 7px; margin: 0; font-size: 13px; line-height: 1.7; }
.monotonicity-result p:last-child { color: var(--ink-muted); }
.monotonicity-window-note { margin: 7px 0 0; color: var(--ink-subtle); font-size: 11px; line-height: 1.5; }
@media (max-width: 680px) {
  .monotonicity-demo { padding: 20px 14px; }
  .monotonicity-heading h1 { font-size: 25px; }
  .monotonicity-plot-heading h2 { font-size: 13px; }
  .monotonicity-legend { gap: 5px 12px; font-size: 11px; }
  .monotonicity-presets button { padding-inline: 8px; }
}
</style>
