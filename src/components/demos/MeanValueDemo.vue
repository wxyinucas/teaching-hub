<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import MathFormula from '../MathFormula.vue'
import {
  MINUTES_PER_HOUR,
  MOTION_DISTANCE_KM,
  MOTION_DURATION_MINUTES,
  MOTION_PEAK_SPEED_KMH,
  averageSpeed,
  meanValueTimes,
  positionAt,
  speedAt,
} from '../../lib/meanValueMotion.js'

const timeMinutes = ref(0)
const meanSpeed = averageSpeed()
const matchingTimes = meanValueTimes()
const timeTicks = [0, 3, 6, 9, 12]
const positionTicks = [0, 5, 10, 15, 20]
const speedTicks = [0, 60, 100, 180, MOTION_PEAK_SPEED_KMH]
const speedPlotMax = MOTION_PEAK_SPEED_KMH + 40
const plotHost = ref(null)
const chart = reactive({ width: 960, height: 250, left: 76, right: 918, top: 22, bottom: 208 })
let resizeObserver = null
const position = computed(() => positionAt(timeMinutes.value))
const speed = computed(() => speedAt(timeMinutes.value))
const isMatching = computed(() => Math.abs(speed.value - meanSpeed) < 1e-7)
const isEndpoint = computed(() => timeMinutes.value === 0 || timeMinutes.value === MOTION_DURATION_MINUTES)

function formatNumber(value, digits = 2) {
  return Number(value.toFixed(digits)).toString()
}

// Calculations accept minutes; both plot axes display hours, so a distance
// tangent's geometric slope and the speed graph's height are both in km/h.
const plotX = (minutes) => chart.left + ((minutes + 0.35) / (MOTION_DURATION_MINUTES + 0.7)) * (chart.right - chart.left)
const positionY = (km) => chart.bottom - ((km + 1) / 22) * (chart.bottom - chart.top)
const speedY = (kmh) => chart.bottom - (kmh / speedPlotMax) * (chart.bottom - chart.top)

function curvePath(valueAt, plotY) {
  return Array.from({ length: 241 }, (_, index) => {
    const minutes = (index / 240) * MOTION_DURATION_MINUTES
    return `${index ? 'L' : 'M'} ${plotX(minutes).toFixed(3)} ${plotY(valueAt(minutes)).toFixed(3)}`
  }).join(' ')
}

const positionPath = computed(() => curvePath(positionAt, positionY))
const speedPath = computed(() => curvePath(speedAt, speedY))
const tangent = computed(() => {
  const start = Math.max(0, timeMinutes.value - 2.4)
  const end = Math.min(MOTION_DURATION_MINUTES, timeMinutes.value + 2.4)
  const tangentPositionAt = (minutes) => position.value
    + speed.value * ((minutes - timeMinutes.value) / MINUTES_PER_HOUR)
  return { start, end, startPosition: tangentPositionAt(start), endPosition: tangentPositionAt(end) }
})

const comparison = computed(() => {
  if (isMatching.value) return '切线与割线平行；这一刻的瞬时速度，恰好等于整段平均速度。'
  const relation = speed.value > meanSpeed ? '大于' : '小于'
  if (isEndpoint.value) return `入口、出口的瞬时速度都是 60；它们并没有把整段平均速度 100 夹在中间。`
  return `这一刻的瞬时速度${relation}整段平均速度；继续移动，寻找两者相等的时刻。`
})

const correspondenceTex = computed(() => String.raw`s'(t)=${formatNumber(speed.value, 2)}\ \mathrm{km/h}`)
const timeLabel = computed(() => `${formatNumber(timeMinutes.value, 3)} 分钟（${formatNumber(timeMinutes.value / MINUTES_PER_HOUR, 4)} 小时）`)

function selectTime(minutes) {
  timeMinutes.value = minutes
}

function fitPlots(width) {
  if (!(width > 0)) return
  chart.width = Math.max(300, Math.round(width))
  chart.left = 60
  chart.right = chart.width - 24
}

onMounted(() => {
  fitPlots(plotHost.value?.clientWidth)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(([entry]) => fitPlots(entry.contentRect.width))
    resizeObserver.observe(plotHost.value)
  }
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <section class="mean-value-demo">
    <header class="motion-heading">
      <p class="motion-eyebrow">20 km · 12 分钟 · 区间平均速度 100 km/h</p>
      <h1>同一段行程，两种读法</h1>
      <p>上图看路程的变化，下图直接看变化的快慢。两图使用同一个时刻。</p>
    </header>

    <div class="motion-controls">
      <div class="demo-slider-control">
        <label for="mean-value-time-range">
          <span>移动时刻</span>
          <output id="mean-value-time-output" for="mean-value-time-range">{{ timeLabel }}</output>
        </label>
        <input
          id="mean-value-time-range"
          v-model.number="timeMinutes"
          type="range"
          min="0"
          :max="MOTION_DURATION_MINUTES"
          step="any"
          :aria-valuetext="timeLabel"
          aria-describedby="mean-value-result"
        >
      </div>
      <div class="motion-shortcuts" aria-label="观察时刻">
        <button type="button" data-preset="entry" @click="selectTime(0)">入口</button>
        <button type="button" data-preset="midpoint" @click="selectTime(6)">6 分钟</button>
        <button type="button" data-preset="exit" @click="selectTime(MOTION_DURATION_MINUTES)">出口</button>
        <span aria-hidden="true" class="motion-shortcut-divider"></span>
        <button type="button" data-preset="first-mean" @click="selectTime(matchingTimes[0])">相等时刻 ①</button>
        <button type="button" data-preset="second-mean" @click="selectTime(matchingTimes[1])">相等时刻 ②</button>
      </div>
    </div>

    <div class="motion-legend" aria-label="图例">
      <span><i class="motion-key is-curve"></i>路程／速度曲线</span>
      <span><i class="motion-key is-current"></i>当前时刻：切线／速度点</span>
      <span><i class="motion-key is-average"></i>整段平均：割线／水平线</span>
    </div>

    <div ref="plotHost" class="motion-plots">
      <section class="motion-plot" aria-labelledby="motion-position-heading">
        <div class="motion-plot-heading">
          <h2 id="motion-position-heading">原函数 · 路程 <MathFormula tex="s(t)" /></h2>
          <span id="mean-value-position-value">已走 {{ formatNumber(position, 2) }} km</span>
        </div>
        <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" aria-labelledby="motion-position-title motion-position-description">
          <title id="motion-position-title">路程图：移动点与切线，比较固定割线</title>
          <desc id="motion-position-description">时刻 {{ timeLabel }}，路程 {{ formatNumber(position) }} 千米。紫色切线对应时速 {{ formatNumber(speed) }} 千米每小时；虚线割线对应整段平均速度 100 千米每小时。</desc>
          <defs>
            <clipPath id="motion-position-clip"><rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" /></clipPath>
          </defs>
          <rect class="motion-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          <g class="motion-grid" aria-hidden="true">
            <line v-for="tick in positionTicks" :key="`position-grid-${tick}`" :x1="chart.left" :x2="chart.right" :y1="positionY(tick)" :y2="positionY(tick)" />
            <line v-for="tick in timeTicks" :key="`position-time-${tick}`" :x1="plotX(tick)" :x2="plotX(tick)" :y1="chart.top" :y2="chart.bottom" />
          </g>
          <g class="motion-labels" aria-hidden="true">
            <text class="motion-axis-title" :x="chart.left" y="14">路程（km）</text>
            <text v-for="tick in positionTicks" :key="`position-label-${tick}`" :x="chart.left - 12" :y="positionY(tick) + 6" text-anchor="end">{{ tick }}</text>
            <text v-for="tick in timeTicks" :key="`position-time-label-${tick}`" :x="plotX(tick)" :y="chart.bottom + 24" text-anchor="middle">{{ (tick / MINUTES_PER_HOUR).toFixed(2) }}</text>
            <text class="motion-axis-title" :x="chart.right" :y="chart.height - 2" text-anchor="end">时间 t（h）</text>
          </g>
          <g clip-path="url(#motion-position-clip)">
            <line class="mean-value-time-guide" :x1="plotX(timeMinutes)" :x2="plotX(timeMinutes)" :y1="chart.top" :y2="chart.bottom" />
            <line class="mean-value-secant motion-average" :x1="plotX(0)" :y1="positionY(0)" :x2="plotX(MOTION_DURATION_MINUTES)" :y2="positionY(MOTION_DISTANCE_KM)" />
            <path class="motion-curve" :d="positionPath" />
            <line class="mean-value-tangent motion-current" :x1="plotX(tangent.start)" :y1="positionY(tangent.startPosition)" :x2="plotX(tangent.end)" :y2="positionY(tangent.endPosition)" />
            <circle class="motion-endpoint" :cx="plotX(0)" :cy="positionY(0)" r="4" />
            <circle class="motion-endpoint" :cx="plotX(MOTION_DURATION_MINUTES)" :cy="positionY(MOTION_DISTANCE_KM)" r="4" />
            <circle v-if="isMatching" class="motion-match-halo" :cx="plotX(timeMinutes)" :cy="positionY(position)" r="13" />
            <circle class="mean-value-position-point motion-point" :cx="plotX(timeMinutes)" :cy="positionY(position)" :data-time-minutes="timeMinutes" r="6" />
          </g>
        </svg>
      </section>

      <section class="motion-plot" aria-labelledby="motion-speed-heading">
        <div class="motion-plot-heading">
          <h2 id="motion-speed-heading">导函数 · 速度 <MathFormula tex="v(t)=s'(t)" /></h2>
          <span id="mean-value-speed-value">瞬时 {{ formatNumber(speed, 2) }} km/h</span>
        </div>
        <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" aria-labelledby="motion-speed-title motion-speed-description">
          <title id="motion-speed-title">速度图：同一时刻的速度点，与平均速度水平线比较</title>
          <desc id="motion-speed-description">两端的瞬时速度都是 60 千米每小时。当前点的高度为 {{ formatNumber(speed) }}，与上图切线斜率相同。水平虚线高度为整段平均速度 100。{{ comparison }}</desc>
          <defs>
            <clipPath id="motion-speed-clip"><rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" /></clipPath>
          </defs>
          <rect class="motion-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          <g class="motion-grid" aria-hidden="true">
            <line v-for="tick in speedTicks" :key="`speed-grid-${tick}`" :x1="chart.left" :x2="chart.right" :y1="speedY(tick)" :y2="speedY(tick)" />
            <line v-for="tick in timeTicks" :key="`speed-time-${tick}`" :x1="plotX(tick)" :x2="plotX(tick)" :y1="chart.top" :y2="chart.bottom" />
          </g>
          <g class="motion-labels" aria-hidden="true">
            <text class="motion-axis-title" :x="chart.left" y="14">速度（km/h）</text>
            <text v-for="tick in speedTicks" :key="`speed-label-${tick}`" :x="chart.left - 12" :y="speedY(tick) + 6" text-anchor="end">{{ tick }}</text>
            <text v-for="tick in timeTicks" :key="`speed-time-label-${tick}`" :x="plotX(tick)" :y="chart.bottom + 24" text-anchor="middle">{{ (tick / MINUTES_PER_HOUR).toFixed(2) }}</text>
            <text class="motion-axis-title" :x="chart.right" :y="chart.height - 2" text-anchor="end">时间 t（h）</text>
          </g>
          <g clip-path="url(#motion-speed-clip)">
            <line class="mean-value-time-guide" :x1="plotX(timeMinutes)" :x2="plotX(timeMinutes)" :y1="chart.top" :y2="chart.bottom" />
            <line class="mean-value-average-speed motion-average" :x1="chart.left" :x2="chart.right" :y1="speedY(meanSpeed)" :y2="speedY(meanSpeed)" />
            <path class="motion-curve" :d="speedPath" />
            <line class="motion-current-height" :x1="plotX(timeMinutes)" :x2="plotX(timeMinutes)" :y1="speedY(0)" :y2="speedY(speed)" />
            <circle class="motion-endpoint" :cx="plotX(0)" :cy="speedY(speedAt(0))" r="4" />
            <circle class="motion-endpoint" :cx="plotX(MOTION_DURATION_MINUTES)" :cy="speedY(speedAt(MOTION_DURATION_MINUTES))" r="4" />
            <circle v-if="isMatching" class="motion-match-halo" :cx="plotX(timeMinutes)" :cy="speedY(speed)" r="13" />
            <circle class="mean-value-speed-point motion-point" :cx="plotX(timeMinutes)" :cy="speedY(speed)" :data-time-minutes="timeMinutes" r="6" />
          </g>
          <g class="motion-labels" aria-hidden="true">
            <text class="motion-average-label" :x="chart.right - 10" :y="speedY(meanSpeed) - 10" text-anchor="end">整段平均 100</text>
            <text :x="plotX(0) + 12" :y="speedY(60) - 10">60</text>
            <text :x="plotX(MOTION_DURATION_MINUTES) - 12" :y="speedY(60) - 10" text-anchor="end">60</text>
          </g>
        </svg>
      </section>
    </div>

    <div id="mean-value-result" class="motion-result" :class="{ 'is-matching': isMatching }" role="status" aria-live="polite" aria-atomic="true">
      <p><strong>上图切线斜率 ＝ 下图纵坐标：</strong><MathFormula :tex="correspondenceTex" /></p>
      <p>{{ comparison }}</p>
    </div>
    <p class="motion-model-note">这是一条满足开场数据的示意行程，不是由端点数据唯一确定的行程。两图横轴统一用小时，切线斜率与速度都用 km/h。</p>
  </section>
</template>

<style scoped>
.mean-value-demo { max-width: 1180px; margin: 0 auto; padding: clamp(22px, 3vw, 38px); border: 1px solid var(--border); border-radius: 8px; background: var(--surface); }
.motion-eyebrow { margin: 0 0 8px; color: var(--accent); font-size: 13px; font-weight: 650; }
.motion-heading h1 { margin: 0; font-size: clamp(26px, 3.2vw, 36px); line-height: 1.25; letter-spacing: -.025em; }
.motion-heading > p:last-child { margin: 10px 0 0; color: var(--ink-muted); font-size: 14px; line-height: 1.7; }
.motion-controls { display: grid; gap: 10px; margin: 20px 0 14px; }
.motion-shortcuts { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }
.motion-shortcuts button { min-height: 36px; padding: 6px 12px; border: 1px solid var(--border); border-radius: 4px; background: var(--surface-muted); color: var(--ink-muted); font-size: 12px; font-weight: 600; }
.motion-shortcuts button:hover { border-color: var(--accent-border); color: var(--accent-text); }
.motion-shortcut-divider { height: 22px; margin-inline: 3px; border-left: 1px solid var(--border); }
.motion-legend { display: flex; flex-wrap: wrap; gap: 8px 24px; margin: 16px 0; color: var(--ink-muted); font-size: 12px; }
.motion-legend > span { display: inline-flex; align-items: center; gap: 8px; }
.motion-key { display: inline-block; width: 24px; border-top: 2px solid var(--ink); }
.motion-key.is-current { border-color: var(--accent); }
.motion-key.is-average { border-color: var(--ink-muted); border-top-style: dashed; }
.motion-plots { display: grid; gap: 12px; }
.motion-plot { min-width: 0; }
.motion-plot-heading { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 20px; margin: 0 0 8px; }
.motion-plot-heading h2 { margin: 0; color: var(--ink); font-size: 16px; font-weight: 650; }
.motion-plot-heading > span { color: var(--accent-text); font-size: 14px; font-weight: 650; font-variant-numeric: tabular-nums; }
.motion-plot svg { display: block; width: 100%; height: auto; overflow: visible; }
.motion-frame { fill: var(--surface); stroke: var(--border); vector-effect: non-scaling-stroke; }
.motion-grid line { stroke: var(--border); stroke-width: .7; opacity: .65; vector-effect: non-scaling-stroke; }
.motion-labels text { fill: var(--ink-muted); font-size: 16px; font-variant-numeric: tabular-nums; }
.motion-labels .motion-axis-title { fill: var(--ink); font-size: 15px; }
.motion-labels .motion-average-label { fill: var(--ink); font-size: 16px; font-weight: 600; }
.motion-curve { fill: none; stroke: var(--ink); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.motion-average { stroke: var(--ink-muted); stroke-width: 1.7; stroke-dasharray: 7 5; vector-effect: non-scaling-stroke; }
.motion-current { stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.mean-value-time-guide { stroke: var(--accent-border); stroke-width: 1.3; stroke-dasharray: 3 4; vector-effect: non-scaling-stroke; }
.motion-current-height { stroke: var(--accent); stroke-width: 1.3; opacity: .65; vector-effect: non-scaling-stroke; }
.motion-point { fill: var(--accent); stroke: var(--surface); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.motion-endpoint { fill: var(--surface); stroke: var(--ink); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.motion-match-halo { fill: var(--accent-soft); stroke: var(--accent-border); stroke-width: 1; vector-effect: non-scaling-stroke; }
.motion-result { margin-top: 16px; padding-top: 13px; border-top: 1px solid var(--border); }
.motion-result p { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; margin: 0; color: var(--ink-muted); font-size: 14px; line-height: 1.8; }
.motion-result strong, .motion-result.is-matching p { color: var(--accent-text); }
.motion-model-note { margin: 12px 0 0; color: var(--ink-subtle); font-size: 12px; line-height: 1.65; }
@media (max-width: 800px) {
  .mean-value-demo { padding: 22px; }
  .demo-slider-control > label { flex-wrap: wrap; gap: 4px 12px; }
  .demo-slider-control output { font-size: 15px; }
}
</style>
