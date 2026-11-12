<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const stage = ref('rolle')
const progress = ref(0)
const isPlaying = ref(false)

const secantSlope = 0.4
const maxAngle = Math.atan(secantSlope)
const criticalPoint = (-1.7 + Math.sqrt(1.7 ** 2 + 4 * 0.66 * 0.22)) / (2 * 0.66)
const domain = { xMin: -1.55, xMax: 1.55, yMin: -1.1, yMax: 1 }
const plotScale = 190
const chart = {
  width: 840,
  height: 520,
  left: (840 - (domain.xMax - domain.xMin) * plotScale) / 2,
  right: (840 + (domain.xMax - domain.xMin) * plotScale) / 2,
  top: (520 - (domain.yMax - domain.yMin) * plotScale) / 2,
  bottom: (520 + (domain.yMax - domain.yMin) * plotScale) / 2,
}
const stages = [
  { id: 'rolle', label: '1 · 罗尔', caption: '两端等高' },
  { id: 'rotate', label: '2 · 旋转直观', caption: '保留平行' },
  { id: 'flatten', label: '3 · 压平证明', caption: '减去线性部分' },
]

let animationFrameId = null

function baseCurve(x) {
  return 0.85 * (x * x - 1) + 0.22 * (x * x * x - x)
}

function plotX(x) {
  return chart.left + (x - domain.xMin) * plotScale
}

function plotY(y) {
  return chart.bottom - (y - domain.yMin) * plotScale
}

function formatNumber(value, digits = 2) {
  if (Math.abs(value) < 10 ** (-(digits + 1))) return '0'
  return Number(value.toFixed(digits)).toString()
}

const flattenAmount = computed(() => (stage.value === 'flatten' ? progress.value : 1))
const remainingSlope = computed(() => (
  stage.value === 'flatten' ? (1 - flattenAmount.value) * secantSlope : 0
))
const rotationAngle = computed(() => (
  stage.value === 'rotate' ? progress.value * maxAngle : 0
))
const displayedSlope = computed(() => (
  stage.value === 'rotate' ? Math.tan(rotationAngle.value) : remainingSlope.value
))
const drawingSlope = computed(() => (
  stage.value === 'flatten' ? remainingSlope.value : 0
))

function graphValue(x) {
  if (stage.value === 'flatten') return baseCurve(x) + remainingSlope.value * (x + 1)
  return baseCurve(x)
}

const rotationPivot = { x: -1, y: baseCurve(-1) }

function rotatePoint(point) {
  if (stage.value !== 'rotate') return point
  const cosine = Math.cos(rotationAngle.value)
  const sine = Math.sin(rotationAngle.value)
  const translatedX = point.x - rotationPivot.x
  const translatedY = point.y - rotationPivot.y
  return {
    x: rotationPivot.x + translatedX * cosine - translatedY * sine,
    y: rotationPivot.y + translatedX * sine + translatedY * cosine,
  }
}

function graphPoint(x) {
  return rotatePoint({ x, y: graphValue(x) })
}

function graphPath() {
  return Array.from({ length: 241 }, (_, index) => {
    const x = -1 + (2 * index) / 240
    const point = graphPoint(x)
    return `${index ? 'L' : 'M'} ${plotX(point.x).toFixed(2)} ${plotY(point.y).toFixed(2)}`
  }).join(' ')
}

const curvePath = computed(graphPath)
const leftEndpoint = computed(() => graphPoint(-1))
const rightEndpoint = computed(() => graphPoint(1))
const meanPoint = computed(() => graphPoint(criticalPoint))
const tangent = computed(() => {
  const halfWidth = 0.52
  const x1 = criticalPoint - halfWidth
  const x2 = criticalPoint + halfWidth
  const baseMeanY = graphValue(criticalPoint)
  return {
    start: rotatePoint({
      x: x1,
      y: baseMeanY + drawingSlope.value * (x1 - criticalPoint),
    }),
    end: rotatePoint({
      x: x2,
      y: baseMeanY + drawingSlope.value * (x2 - criticalPoint),
    }),
  }
})

const controlLabel = computed(() => (
  stage.value === 'rotate' ? '旋转进度' : '压平进度'
))
const controlValue = computed(() => (
  stage.value === 'rotate'
    ? `${formatNumber((rotationAngle.value * 180) / Math.PI, 1)}°`
    : `t = ${formatNumber(flattenAmount.value, 2)}`
))
const formulaTex = computed(() => {
  if (stage.value === 'rolle') {
    return String.raw`f(a)=f(b)\quad\Longrightarrow\quad f'(\xi)=0`
  }
  if (stage.value === 'rotate') {
    return String.raw`m_{\text{割线}}=m_{\text{切线}}=\tan\theta=${formatNumber(displayedSlope.value, 2)}`
  }
  return String.raw`g_t(x)=f(x)-tk(x-a),\qquad m_{\text{割线}}=m_{\text{切线}}=(1-t)k=${formatNumber(displayedSlope.value, 2)}`
})
const stageTitle = computed(() => {
  if (stage.value === 'rolle') return '两端等高，内部至少有一条水平切线'
  if (stage.value === 'rotate') return '图形一起旋转：水平会变，平行不变'
  return '减去首尾割线的线性部分，把问题压回罗尔'
})
const stageDescription = computed(() => {
  if (stage.value === 'rolle') return '这是一条不对称的示意光滑绳形；中值点不必是区间中点。'
  if (stage.value === 'rotate') return '刚性旋转只提供几何直观，不充当拉格朗日中值定理的正式证明。'
  if (flattenAmount.value < 0.999) return '割线与内部切线同步变平；它们的斜率始终相同。'
  return '当 t = 1 时两端等高，对新函数使用罗尔，便得到原函数的平行切线。'
})
const diagramDescription = computed(() => (
  `${stageTitle.value}。首尾割线斜率与内部切线斜率都为 ${formatNumber(displayedSlope.value, 2)}。${stageDescription.value}`
))

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

function selectStage(nextStage) {
  stopPlayback()
  stage.value = nextStage
  progress.value = 0
}

function setProgress(value) {
  stopPlayback()
  progress.value = Number(value)
}

function play() {
  if (isPlaying.value) {
    stopPlayback()
    return
  }
  if (stage.value === 'rolle') selectStage('rotate')
  if (reducedMotion || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    progress.value = 1
    return
  }

  if (progress.value >= 0.999) progress.value = 0
  const startProgress = progress.value
  const duration = 2200 * (1 - startProgress)
  let startTime = null
  let lastUpdateTime = Number.NEGATIVE_INFINITY
  isPlaying.value = true

  const advance = (timestamp) => {
    if (startTime === null) startTime = timestamp
    const elapsed = duration ? Math.min((timestamp - startTime) / duration, 1) : 1
    const eased = (1 - Math.cos(Math.PI * elapsed)) / 2
    if (timestamp - lastUpdateTime >= 33 || elapsed === 1) {
      progress.value = startProgress + (1 - startProgress) * eased
      lastUpdateTime = timestamp
    }
    if (elapsed < 1 && isPlaying.value) {
      animationFrameId = window.requestAnimationFrame(advance)
      return
    }
    animationFrameId = null
    isPlaying.value = false
  }

  animationFrameId = window.requestAnimationFrame(advance)
}

onBeforeUnmount(stopPlayback)
</script>

<template>
  <section class="rolle-lagrange-demo">
    <header class="rolle-heading">
      <p class="rolle-eyebrow">20 分钟授课比赛 · 中值定理</p>
      <h1>从水平切线，到与割线平行的切线</h1>
      <p>先看见罗尔定理，再把同一个几何关系推广到拉格朗日中值定理。</p>
    </header>

    <nav class="rolle-stages" aria-label="演示阶段">
      <button
        v-for="item in stages"
        :key="item.id"
        type="button"
        :data-stage="item.id"
        :class="{ 'is-active': stage === item.id }"
        :aria-pressed="stage === item.id"
        @click="selectStage(item.id)"
      >
        <strong>{{ item.label }}</strong>
        <span>{{ item.caption }}</span>
      </button>
    </nav>

    <div v-if="stage !== 'rolle'" class="rolle-controls">
      <label for="rolle-progress-range">
        <span>{{ controlLabel }}</span>
        <output for="rolle-progress-range">{{ controlValue }}</output>
      </label>
      <div class="rolle-control-row">
        <input
          id="rolle-progress-range"
          :value="progress"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :aria-valuetext="controlValue"
          @input="setProgress($event.target.value)"
        >
        <button type="button" @click="play">{{ isPlaying ? '暂停' : progress >= 0.999 ? '重播' : '播放' }}</button>
      </div>
    </div>

    <div class="rolle-figure">
      <div class="rolle-figure-heading">
        <div>
          <span>{{ stages.find((item) => item.id === stage)?.label }}</span>
          <h2>{{ stageTitle }}</h2>
        </div>
        <div class="rolle-legend" aria-label="图例">
          <span><i class="is-curve"></i>光滑绳形</span>
          <span><i class="is-secant"></i>首尾割线</span>
          <span><i class="is-tangent"></i>内部切线</span>
        </div>
      </div>

      <svg
        :viewBox="`0 0 ${chart.width} ${chart.height}`"
        :data-unit-scale="plotScale"
        role="img"
        aria-labelledby="rolle-diagram-title rolle-diagram-description"
      >
        <title id="rolle-diagram-title">从罗尔定理到拉格朗日中值定理的几何演示</title>
        <desc id="rolle-diagram-description">{{ diagramDescription }}</desc>
        <defs>
          <clipPath id="rolle-lagrange-clip">
            <rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          </clipPath>
        </defs>

        <rect class="rolle-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
        <g class="rolle-grid" aria-hidden="true">
          <line :x1="chart.left" :x2="chart.right" :y1="plotY(0)" :y2="plotY(0)" />
          <line :x1="plotX(0)" :x2="plotX(0)" :y1="chart.top" :y2="chart.bottom" />
        </g>

        <g clip-path="url(#rolle-lagrange-clip)">
          <g>
            <line
              class="rolle-lagrange-chord"
              :data-slope="displayedSlope"
              :x1="plotX(leftEndpoint.x)"
              :y1="plotY(leftEndpoint.y)"
              :x2="plotX(rightEndpoint.x)"
              :y2="plotY(rightEndpoint.y)"
            />
            <path class="rolle-lagrange-curve" :d="curvePath" />
            <line
              class="rolle-lagrange-tangent"
              :data-slope="displayedSlope"
              :x1="plotX(tangent.start.x)"
              :y1="plotY(tangent.start.y)"
              :x2="plotX(tangent.end.x)"
              :y2="plotY(tangent.end.y)"
            />
            <circle class="rolle-lagrange-left-endpoint" :cx="plotX(leftEndpoint.x)" :cy="plotY(leftEndpoint.y)" r="6" />
            <circle class="rolle-lagrange-right-endpoint" :cx="plotX(rightEndpoint.x)" :cy="plotY(rightEndpoint.y)" r="6" />
            <circle class="rolle-mean-halo" :cx="plotX(meanPoint.x)" :cy="plotY(meanPoint.y)" r="14" />
            <circle class="rolle-lagrange-mean-point" :cx="plotX(meanPoint.x)" :cy="plotY(meanPoint.y)" r="6" />
          </g>
        </g>

        <g v-if="stage !== 'rotate' || progress < 0.04" class="rolle-labels" aria-hidden="true">
          <text :x="plotX(leftEndpoint.x) - 13" :y="plotY(leftEndpoint.y) - 13">A</text>
          <text :x="plotX(rightEndpoint.x) + 10" :y="plotY(rightEndpoint.y) - 13">B</text>
          <text :x="plotX(meanPoint.x) + 12" :y="plotY(meanPoint.y) - 15">ξ</text>
        </g>
      </svg>
    </div>

    <div class="rolle-result" role="status" aria-live="polite" aria-atomic="true">
      <MathFormula :tex="formulaTex" display />
      <p>{{ stageDescription }}</p>
    </div>
  </section>
</template>

<style scoped>
.rolle-lagrange-demo { max-width: 1180px; margin: 0 auto; padding: clamp(22px, 3vw, 38px); border: 1px solid var(--border); border-radius: 8px; background: var(--surface); }
.rolle-eyebrow { margin: 0 0 8px; color: var(--accent); font-size: 13px; font-weight: 650; }
.rolle-heading h1 { margin: 0; font-size: clamp(26px, 3.2vw, 38px); line-height: 1.22; letter-spacing: -.025em; }
.rolle-heading > p:last-child { margin: 10px 0 0; color: var(--ink-muted); font-size: 14px; line-height: 1.7; }
.rolle-stages { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 22px 0 16px; }
.rolle-stages button { display: flex; min-width: 0; min-height: 58px; flex-direction: column; align-items: flex-start; justify-content: center; padding: 9px 13px; border: 1px solid var(--border); border-radius: 5px; background: var(--surface-muted); color: var(--ink-muted); text-align: left; }
.rolle-stages button:hover { border-color: var(--accent-border); color: var(--accent-text); }
.rolle-stages button.is-active { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-text); }
.rolle-stages strong { font-size: 13px; }
.rolle-stages span { margin-top: 3px; font-size: 11px; }
.rolle-controls { margin: 0 0 15px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 5px; background: var(--surface-muted); }
.rolle-controls label { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; color: var(--ink-muted); font-size: 12px; font-weight: 600; }
.rolle-controls output { color: var(--accent-text); font-size: 14px; font-variant-numeric: tabular-nums; }
.rolle-control-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; margin-top: 8px; }
.rolle-control-row input { width: 100%; accent-color: var(--accent); }
.rolle-control-row button { min-width: 64px; padding: 7px 12px; border: 1px solid var(--accent); border-radius: 4px; background: var(--accent); color: white; font-size: 12px; font-weight: 650; }
.rolle-figure { overflow: hidden; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); }
.rolle-figure-heading { display: flex; align-items: end; justify-content: space-between; gap: 18px; padding: 14px 16px 4px; }
.rolle-figure-heading > div:first-child > span { color: var(--accent); font-size: 11px; font-weight: 650; letter-spacing: .04em; }
.rolle-figure-heading h2 { margin: 3px 0 0; font-size: clamp(16px, 2vw, 21px); line-height: 1.35; }
.rolle-legend { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 7px 15px; color: var(--ink-muted); font-size: 11px; }
.rolle-legend span { display: inline-flex; align-items: center; gap: 6px; }
.rolle-legend i { display: inline-block; width: 22px; border-top: 2px solid var(--ink); }
.rolle-legend i.is-secant { border-color: var(--ink-muted); border-top-style: dashed; }
.rolle-legend i.is-tangent { border-color: var(--accent); }
.rolle-figure svg { display: block; width: 100%; height: auto; }
.rolle-frame { fill: #fcfbfd; stroke: #d9d4df; vector-effect: non-scaling-stroke; }
.rolle-grid line { stroke: #d9d4df; stroke-width: 1; opacity: .9; vector-effect: non-scaling-stroke; }
.rolle-lagrange-curve { fill: none; stroke: #302a39; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.rolle-lagrange-chord { stroke: #716a7b; stroke-width: 2; stroke-dasharray: 8 6; vector-effect: non-scaling-stroke; }
.rolle-lagrange-tangent { stroke: #7956c6; stroke-width: 3; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.rolle-lagrange-left-endpoint, .rolle-lagrange-right-endpoint { fill: #fff; stroke: #302a39; stroke-width: 2; vector-effect: non-scaling-stroke; }
.rolle-mean-halo { fill: #eadfff; stroke: #b092e7; stroke-width: 1; vector-effect: non-scaling-stroke; }
.rolle-lagrange-mean-point { fill: #7956c6; stroke: #fff; stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.rolle-labels text { fill: #302a39; font-size: 17px; font-weight: 650; }
.rolle-result { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(260px, .8fr); align-items: center; gap: 18px; margin-top: 14px; padding: 14px 16px; border-left: 3px solid var(--accent); background: var(--accent-soft); }
.rolle-result :deep(.math-display) { margin: 0; overflow-x: auto; color: var(--accent-text); }
.rolle-result p { margin: 0; color: var(--ink-muted); font-size: 13px; line-height: 1.65; }
@media (max-width: 760px) {
  .rolle-lagrange-demo { padding: 20px; }
  .rolle-stages { grid-template-columns: 1fr; }
  .rolle-stages button { min-height: 50px; }
  .rolle-figure-heading { align-items: flex-start; flex-direction: column; }
  .rolle-legend { justify-content: flex-start; }
  .rolle-result { grid-template-columns: 1fr; }
}
</style>
