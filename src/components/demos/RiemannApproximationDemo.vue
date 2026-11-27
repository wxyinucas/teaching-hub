<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'
import {
  QUARTER_CIRCLE_AREA,
  RIEMANN_PARTITION_COUNTS,
  buildQuarterCircleApproximation,
  quadraticInterpolant,
  quarterCircleValue,
} from '../../lib/definiteIntegral.js'

const refinementLevel = ref(1)
const partitionSeed = ref(0)
const sampleSeed = ref(0)
const method = ref('rectangle')
const count = computed(() => RIEMANN_PARTITION_COUNTS[refinementLevel.value])
const approximation = computed(() => buildQuarterCircleApproximation({
  count: count.value,
  partitionSeed: partitionSeed.value,
  sampleSeed: sampleSeed.value,
}))

const chart = {
  width: 960,
  height: 520,
  left: 72,
  right: 924,
  top: 34,
  bottom: 448,
  maxY: 1.08,
}

const plotX = (value) => chart.left + value * (chart.right - chart.left)
const plotY = (value) => chart.bottom - (value / chart.maxY) * (chart.bottom - chart.top)

const curvePath = computed(() => Array.from({ length: 241 }, (_, index) => {
  const x = index / 240
  return `${index === 0 ? 'M' : 'L'} ${plotX(x).toFixed(2)} ${plotY(quarterCircleValue(x)).toFixed(2)}`
}).join(' '))

const trueAreaPath = computed(() => (
  `M ${plotX(0)} ${plotY(0)} L ${plotX(0)} ${plotY(1)} `
  + curvePath.value.slice(curvePath.value.indexOf('L'))
  + ` L ${plotX(1)} ${plotY(0)} Z`
))

const sampleRectangles = computed(() => approximation.value.intervals.map((interval) => ({
  ...interval,
  x: plotX(interval.start),
  y: plotY(interval.sampleValue),
  widthPx: plotX(interval.end) - plotX(interval.start),
  heightPx: chart.bottom - plotY(interval.sampleValue),
})))

const trapezoidAreas = computed(() => approximation.value.intervals.map((interval) => ({
  index: interval.index,
  points: [
    [plotX(interval.start), plotY(0)],
    [plotX(interval.start), plotY(interval.startValue)],
    [plotX(interval.end), plotY(interval.endValue)],
    [plotX(interval.end), plotY(0)],
  ].map((point) => point.join(',')).join(' '),
})))

const parabolicAreas = computed(() => approximation.value.intervals.map((interval) => {
  const samples = Array.from({ length: 17 }, (_, index) => {
    const x = interval.start + (interval.width * index) / 16
    return [plotX(x), plotY(quadraticInterpolant(interval, x))]
  })
  return {
    index: interval.index,
    path: `M ${plotX(interval.start)} ${plotY(0)} L ${samples.map((point) => point.join(' ')).join(' L ')} L ${plotX(interval.end)} ${plotY(0)} Z`,
  }
}))

const currentEstimate = computed(() => ({
  rectangle: approximation.value.sample,
  trapezoid: approximation.value.trapezoid,
  parabola: approximation.value.simpson,
})[method.value])
const methodLabel = computed(() => ({
  rectangle: '任取矩形',
  trapezoid: '直线／梯形',
  parabola: '抛物线／辛普森',
})[method.value])

function format(value) {
  return value.toFixed(6)
}

function repartition() {
  partitionSeed.value += 1
}

function resample() {
  sampleSeed.value += 1
}
</script>

<template>
  <section class="riemann-approximation-demo" :data-method="method">
    <header class="integral-demo-heading">
      <p>把单位圆的第一象限展开成一个曲边梯形</p>
      <h1>任分任取，也可以更换局部模型</h1>
      <span>矩形负责说明分法、取点可以变化；梯形和抛物线说明局部近似也不只一种。这里观察共同极限，不比较谁收敛得更快。</span>
    </header>

    <div class="riemann-controls">
      <fieldset class="riemann-methods">
        <legend>局部模型</legend>
        <button type="button" data-method="rectangle" :aria-pressed="method === 'rectangle'" :class="{ 'is-active': method === 'rectangle' }" @click="method = 'rectangle'">矩形</button>
        <button type="button" data-method="trapezoid" :aria-pressed="method === 'trapezoid'" :class="{ 'is-active': method === 'trapezoid' }" @click="method = 'trapezoid'">梯形</button>
        <button type="button" data-method="parabola" :aria-pressed="method === 'parabola'" :class="{ 'is-active': method === 'parabola' }" @click="method = 'parabola'">抛物线</button>
      </fieldset>

      <div class="riemann-slider">
        <label for="riemann-refinement">
          <span>细分程度</span>
          <output for="riemann-refinement">{{ count }} 段</output>
        </label>
        <input id="riemann-refinement" v-model.number="refinementLevel" type="range" min="0" :max="RIEMANN_PARTITION_COUNTS.length - 1" step="1">
      </div>

      <div class="riemann-randomizers">
        <span>{{ partitionSeed === 0 ? '当前：等分' : '当前：不等分' }}</span>
        <div>
          <button type="button" data-action="repartition" @click="repartition">重新分割</button>
          <button type="button" data-action="resample" :disabled="method !== 'rectangle'" @click="resample">重新取样</button>
        </div>
      </div>
    </div>

    <div class="riemann-plot">
      <svg
        :viewBox="`0 0 ${chart.width} ${chart.height}`"
        role="img"
        aria-labelledby="riemann-plot-title riemann-plot-description"
      >
        <title id="riemann-plot-title">四分之一单位圆下方的局部估计</title>
        <desc id="riemann-plot-description">
          当前将区间分成 {{ count }} 段，最宽小段为 {{ format(approximation.maxWidth) }}，使用{{ methodLabel }}得到估计 {{ format(currentEstimate) }}，共同目标为 π/4。
        </desc>
        <path class="riemann-true-area" :d="trueAreaPath" />
        <line class="riemann-axis" :x1="chart.left" :x2="chart.right + 10" :y1="chart.bottom" :y2="chart.bottom" />
        <line class="riemann-axis" :x1="chart.left" :x2="chart.left" :y1="chart.top - 5" :y2="chart.bottom" />

        <g v-if="method === 'rectangle'" class="riemann-rectangle-layer">
          <g v-for="rectangle in sampleRectangles" :key="`rect-${rectangle.index}`">
            <rect
              class="riemann-sample-rectangle"
              :x="rectangle.x"
              :y="rectangle.y"
              :width="rectangle.widthPx"
              :height="rectangle.heightPx"
            />
            <line class="riemann-upper-cap" :x1="plotX(rectangle.start)" :x2="plotX(rectangle.end)" :y1="plotY(rectangle.startValue)" :y2="plotY(rectangle.startValue)" />
            <line class="riemann-lower-cap" :x1="plotX(rectangle.start)" :x2="plotX(rectangle.end)" :y1="plotY(rectangle.endValue)" :y2="plotY(rectangle.endValue)" />
            <circle class="riemann-sample-point" :cx="plotX(rectangle.samplePoint)" :cy="plotY(rectangle.sampleValue)" r="4.5" />
          </g>
        </g>

        <g v-else-if="method === 'trapezoid'" class="riemann-trapezoid-layer">
          <polygon v-for="area in trapezoidAreas" :key="`trap-${area.index}`" :points="area.points" />
        </g>

        <g v-else class="riemann-parabola-layer">
          <path v-for="area in parabolicAreas" :key="`para-${area.index}`" :d="area.path" />
        </g>

        <g class="riemann-partition-lines" aria-hidden="true">
          <line v-for="boundary in approximation.boundaries" :key="boundary" :x1="plotX(boundary)" :x2="plotX(boundary)" :y1="plotY(quarterCircleValue(boundary))" :y2="chart.bottom" />
        </g>
        <path class="riemann-function-curve" :d="curvePath" />
        <g class="riemann-axis-labels" aria-hidden="true">
          <text :x="chart.left - 12" :y="chart.bottom + 28">0</text>
          <text :x="chart.right" :y="chart.bottom + 28" text-anchor="middle">1</text>
          <text :x="chart.left - 16" :y="plotY(1) + 5" text-anchor="end">1</text>
          <text :x="chart.right + 18" :y="chart.bottom + 5">x</text>
          <text :x="chart.left - 4" :y="chart.top - 12">y</text>
        </g>
      </svg>
    </div>

    <div v-if="method === 'rectangle'" class="riemann-legend" aria-label="矩形估计图例">
      <span><i class="riemann-key is-lower"></i>每段最低高度</span>
      <span><i class="riemann-key is-sample"></i>每段任取高度</span>
      <span><i class="riemann-key is-upper"></i>每段最高高度</span>
    </div>
    <div v-else class="riemann-legend" aria-label="局部模型说明">
      <span>{{ method === 'trapezoid' ? '每段用端点之间的直线代替圆弧' : '每段用端点与中点确定的抛物线代替圆弧' }}</span>
    </div>

    <div class="riemann-readouts tabular-nums" aria-live="polite">
      <div><span>最宽小段 λ</span><strong data-riemann-value="mesh">{{ format(approximation.maxWidth) }}</strong></div>
      <div><span>{{ methodLabel }}</span><strong data-riemann-value="current">{{ format(currentEstimate) }}</strong></div>
      <div><span>共同目标</span><strong data-riemann-value="target">π / 4</strong></div>
    </div>

    <div v-if="method === 'rectangle'" class="riemann-conclusion" aria-live="polite">
      <MathFormula tex="L(P)\leq S(P,\xi)\leq U(P)" display />
      <p>
        <strong data-riemann-value="lower">{{ format(approximation.lower) }}</strong>
        ≤ <strong data-riemann-value="sample">{{ format(approximation.sample) }}</strong>
        ≤ <strong data-riemann-value="upper">{{ format(approximation.upper) }}</strong>。
        改变分法和取点会改变有限估计；当上下缝隙消失，中间的任意矩形估计只能走向同一个结果。
      </p>
    </div>
    <div v-else class="riemann-conclusion" aria-live="polite">
      <MathFormula :tex="method === 'trapezoid' ? '\\text{局部直线}\\longrightarrow\\text{同一总量}' : '\\text{局部抛物线}\\longrightarrow\\text{同一总量}'" display />
      <p>更换的是每一小段上的局部模型，不是最后要描述的总量；继续加细时，两种方法都逼近同一个四分之一圆面积。</p>
    </div>
  </section>
</template>

<style scoped>
.riemann-approximation-demo { color: var(--ink); }
.integral-demo-heading { max-width: 900px; }
.integral-demo-heading p { margin: 0 0 7px; color: var(--purple); font-size: 14px; font-weight: 650; }
.integral-demo-heading h1 { margin: 0; font-size: clamp(27px, 4vw, 42px); line-height: 1.25; letter-spacing: -.025em; }
.integral-demo-heading span { display: block; margin-top: 10px; color: var(--ink-muted); font-size: 14px; line-height: 1.75; }
.riemann-controls { display: grid; grid-template-columns: minmax(290px, .9fr) minmax(260px, 1fr) auto; gap: 18px 26px; align-items: end; margin: 25px 0 12px; padding-block: 15px; border-block: 1px solid var(--border); }
.riemann-methods { display: flex; min-width: 0; margin: 0; padding: 0; border: 0; }
.riemann-methods legend, .riemann-slider label, .riemann-randomizers > span { margin-bottom: 7px; color: var(--ink-muted); font-size: 12px; font-weight: 650; }
.riemann-methods legend { width: 100%; }
.riemann-methods button, .riemann-randomizers button { min-height: 40px; padding: 7px 12px; border: 1px solid var(--border); background: var(--surface); color: var(--ink-muted); font-size: 12px; font-weight: 600; }
.riemann-methods button:first-of-type, .riemann-randomizers button:first-child { border-radius: 5px 0 0 5px; }
.riemann-methods button:last-of-type, .riemann-randomizers button:last-child { border-radius: 0 5px 5px 0; }
.riemann-methods button + button, .riemann-randomizers button + button { margin-left: -1px; }
.riemann-methods button.is-active { position: relative; z-index: 1; border-color: var(--accent-solid); background: var(--accent-solid); color: var(--on-accent); }
.riemann-randomizers button:disabled { opacity: .45; }
.riemann-slider { min-width: 0; }
.riemann-slider label { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.riemann-slider output { color: var(--purple-dark); font-size: 17px; font-variant-numeric: tabular-nums; }
.riemann-slider input { width: 100%; min-height: 34px; margin: 0; accent-color: var(--purple); }
.riemann-randomizers { display: flex; flex-direction: column; align-items: stretch; }
.riemann-randomizers > div { display: flex; }
.riemann-plot svg { display: block; width: 100%; height: auto; }
.riemann-true-area { fill: var(--purple-light); fill-opacity: .28; stroke: none; }
.riemann-axis { stroke: var(--ink-subtle); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.riemann-function-curve { fill: none; stroke: var(--ink); stroke-width: 3; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.riemann-partition-lines line { stroke: var(--border); stroke-width: 1; vector-effect: non-scaling-stroke; }
.riemann-sample-rectangle { fill: var(--purple-border); fill-opacity: .58; stroke: var(--purple); stroke-width: 1.4; vector-effect: non-scaling-stroke; }
.riemann-upper-cap { stroke: var(--ink-muted); stroke-width: 2.2; stroke-dasharray: 7 5; vector-effect: non-scaling-stroke; }
.riemann-lower-cap { stroke: var(--purple-dark); stroke-width: 2.2; vector-effect: non-scaling-stroke; }
.riemann-sample-point { fill: var(--surface); stroke: var(--purple-dark); stroke-width: 2; vector-effect: non-scaling-stroke; }
.riemann-trapezoid-layer polygon, .riemann-parabola-layer path { fill: var(--purple-border); fill-opacity: .48; stroke: var(--purple); stroke-width: 1.6; vector-effect: non-scaling-stroke; }
.riemann-axis-labels text { fill: var(--ink-muted); font-family: "KaTeX_Main", Georgia, serif; font-size: 17px; }
.riemann-legend { display: flex; min-height: 28px; flex-wrap: wrap; justify-content: center; gap: 10px 24px; margin: 2px 0 14px; color: var(--ink-muted); font-size: 12px; }
.riemann-legend span { display: inline-flex; align-items: center; gap: 7px; }
.riemann-key { width: 25px; height: 9px; }
.riemann-key.is-lower { border-block: 2px solid var(--purple-dark); }
.riemann-key.is-sample { background: var(--purple-border); border-block: 2px solid var(--purple); }
.riemann-key.is-upper { border-block: 2px dashed var(--ink-muted); }
.riemann-readouts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-block: 1px solid var(--border); }
.riemann-readouts > div { min-width: 0; padding: 12px 16px; }
.riemann-readouts > div + div { border-left: 1px solid var(--border); }
.riemann-readouts span { display: block; margin-bottom: 3px; color: var(--ink-muted); font-size: 11px; }
.riemann-readouts strong { color: var(--purple-dark); font-size: clamp(17px, 2.5vw, 24px); font-weight: 650; }
.riemann-conclusion { display: grid; grid-template-columns: minmax(270px, .8fr) minmax(0, 1.2fr); gap: 22px; align-items: center; margin-top: 18px; }
.riemann-conclusion :deep(.katex-display) { margin: 0; text-align: left; }
.riemann-conclusion p { margin: 0; color: var(--ink-muted); font-size: 14px; line-height: 1.75; }
.riemann-conclusion strong { color: var(--purple-dark); font-variant-numeric: tabular-nums; }
@media (max-width: 820px) {
  .riemann-controls { grid-template-columns: 1fr; }
  .riemann-randomizers { align-items: flex-start; }
}
@media (max-width: 680px) {
  .riemann-readouts { grid-template-columns: 1fr; }
  .riemann-readouts > div + div { border-top: 1px solid var(--border); border-left: 0; }
  .riemann-conclusion { grid-template-columns: 1fr; }
}
</style>
