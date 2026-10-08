<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const t = ref(Math.PI / 4)

const chart = {
  width: 700,
  height: 590,
  left: 62,
  right: 642,
  top: 34,
  bottom: 554,
  minX: -1.4,
  maxX: 1.4,
  minY: -1.25,
  maxY: 1.25,
}

const plotX = (value) => chart.left
  + ((value - chart.minX) / (chart.maxX - chart.minX)) * (chart.right - chart.left)
const plotY = (value) => chart.bottom
  - ((value - chart.minY) / (chart.maxY - chart.minY)) * (chart.bottom - chart.top)

const point = computed(() => ({ x: Math.cos(t.value), y: Math.sin(t.value) }))
const dxdt = computed(() => -Math.sin(t.value))
const dydt = computed(() => Math.cos(t.value))
const verticalTangent = computed(() => Math.abs(dxdt.value) < 1e-6)
const slope = computed(() => (verticalTangent.value ? null : dydt.value / dxdt.value))
const vectorScale = 0.58
const vectorCorner = computed(() => ({
  x: point.value.x + vectorScale * dxdt.value,
  y: point.value.y,
}))
const vectorEnd = computed(() => ({
  x: point.value.x + vectorScale * dxdt.value,
  y: point.value.y + vectorScale * dydt.value,
}))
const tangentEndA = computed(() => ({
  x: point.value.x - 2.1 * dxdt.value,
  y: point.value.y - 2.1 * dydt.value,
}))
const tangentEndB = computed(() => ({
  x: point.value.x + 2.1 * dxdt.value,
  y: point.value.y + 2.1 * dydt.value,
}))

function formatNumber(value, digits = 3) {
  if (Math.abs(value) < 10 ** (-(digits + 1))) return '0'
  return Number(value.toFixed(digits)).toString()
}

const tTex = computed(() => String.raw`t=${formatNumber(t.value)}\ \mathrm{rad}`)
const pointTex = computed(() => String.raw`P(t)=(${formatNumber(point.value.x)},\,${formatNumber(point.value.y)})`)
const horizontalRateTex = computed(() => String.raw`\frac{dx}{dt}=-\sin t=${formatNumber(dxdt.value)}`)
const verticalRateTex = computed(() => String.raw`\frac{dy}{dt}=\cos t=${formatNumber(dydt.value)}`)
const slopeTex = computed(() => {
  if (verticalTangent.value) return String.raw`\frac{dy}{dx}=\frac{dy/dt}{dx/dt}\quad\text{不能得到有限实数}`
  return String.raw`\frac{dy}{dx}=\frac{dy/dt}{dx/dt}=\frac{${formatNumber(dydt.value)}}{${formatNumber(dxdt.value)}}=${formatNumber(slope.value)}`
})
const statusText = computed(() => (
  verticalTangent.value
    ? '横向变化率为 0，而纵向仍在变化：这里是竖直切线。'
    : '共同的“每单位 t”约掉后，得到每单位 x 的 y 变化。'
))

const presets = [
  { label: '−π/4', value: -Math.PI / 4 },
  { label: '0', value: 0 },
  { label: 'π/4', value: Math.PI / 4 },
  { label: 'π/2', value: Math.PI / 2 },
  { label: 'π', value: Math.PI },
]

function setT(value) {
  t.value = value
}

function isCurrentPreset(value) {
  return Math.abs(t.value - value) < 0.005
}
</script>

<template>
  <section class="parametric-derivative-demo">
    <header class="demo-heading">
      <p class="demo-source">t 是共同的时钟：先分解横向、纵向速度，再换算成关于 x 的变化率。</p>
      <h1>参数怎样组成曲线的斜率</h1>
      <p class="sequence-expression">
        <MathFormula tex="x(t)=\cos t,\qquad y(t)=\sin t" />
        <MathFormula tex="x^2+y^2=1" />
      </p>
    </header>

    <div class="parametric-controls">
      <div class="demo-slider-control">
        <label for="parameter-t-range">
          <span>移动共同参数 t</span>
          <output for="parameter-t-range"><MathFormula :tex="tTex" /></output>
        </label>
        <input id="parameter-t-range" v-model.number="t" type="range" :min="-Math.PI" :max="Math.PI" step="0.01" aria-describedby="parametric-result">
        <div class="range-ends" aria-hidden="true"><span>−π</span><span>π</span></div>
      </div>
      <div class="demo-shortcuts" aria-label="代表参数值">
        <button v-for="preset in presets" :key="preset.label" type="button" :class="{ 'is-active': isCurrentPreset(preset.value) }" @click="setT(preset.value)">{{ preset.label }}</button>
      </div>
    </div>

    <div class="parametric-layout">
      <div class="parametric-plot">
        <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" aria-labelledby="parametric-plot-title parametric-plot-description">
          <title id="parametric-plot-title">单位圆上的动点与两个参数变化率</title>
          <desc id="parametric-plot-description">参数 t 当前为 {{ formatNumber(t) }}。动点坐标为 {{ formatNumber(point.x) }}, {{ formatNumber(point.y) }}。水平分量表示 dx 除以 dt，竖直分量表示 dy 除以 dt，它们合成曲线的切向方向。</desc>
          <defs>
            <clipPath id="parametric-plot-clip">
              <rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
            </clipPath>
            <marker id="parametric-horizontal-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker id="parametric-vertical-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          <rect class="plot-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          <g class="parametric-axes" aria-hidden="true">
            <line :x1="chart.left" :x2="chart.right" :y1="plotY(0)" :y2="plotY(0)" />
            <line :x1="plotX(0)" :x2="plotX(0)" :y1="chart.top" :y2="chart.bottom" />
            <text :x="chart.right - 8" :y="plotY(0) - 12" text-anchor="end">x</text>
            <text :x="plotX(0) + 12" :y="chart.top + 22">y</text>
          </g>

          <g clip-path="url(#parametric-plot-clip)">
            <ellipse class="parametric-curve" :cx="plotX(0)" :cy="plotY(0)" :rx="plotX(1) - plotX(0)" :ry="plotY(0) - plotY(1)" />
            <line class="parametric-tangent" :x1="plotX(tangentEndA.x)" :y1="plotY(tangentEndA.y)" :x2="plotX(tangentEndB.x)" :y2="plotY(tangentEndB.y)" />
            <line class="parametric-radius" :x1="plotX(0)" :y1="plotY(0)" :x2="plotX(point.x)" :y2="plotY(point.y)" />
          </g>

          <line v-if="Math.abs(dxdt) >= 1e-6" class="parameter-rate is-horizontal" :x1="plotX(point.x)" :y1="plotY(point.y)" :x2="plotX(vectorCorner.x)" :y2="plotY(vectorCorner.y)" marker-end="url(#parametric-horizontal-arrow)" />
          <circle v-else class="zero-rate-marker is-horizontal" :cx="plotX(point.x)" :cy="plotY(point.y)" r="6" />
          <line v-if="Math.abs(dydt) >= 1e-6" class="parameter-rate is-vertical" :x1="plotX(vectorCorner.x)" :y1="plotY(vectorCorner.y)" :x2="plotX(vectorEnd.x)" :y2="plotY(vectorEnd.y)" marker-end="url(#parametric-vertical-arrow)" />
          <circle v-else class="zero-rate-marker is-vertical" :cx="plotX(vectorCorner.x)" :cy="plotY(vectorCorner.y)" r="6" />
          <circle class="parametric-vector-end" :cx="plotX(vectorEnd.x)" :cy="plotY(vectorEnd.y)" r="5" />
          <circle class="parametric-point-focus" :cx="plotX(point.x)" :cy="plotY(point.y)" r="15" />
          <circle class="parametric-point" :cx="plotX(point.x)" :cy="plotY(point.y)" r="8" />
          <text class="parametric-point-label" :x="plotX(point.x) + 14" :y="plotY(point.y) - 15">P(t)</text>
          <text class="rate-label is-horizontal" :x="(plotX(point.x) + plotX(vectorCorner.x)) / 2" :y="plotY(point.y) + 25" text-anchor="middle">{{ Math.abs(dxdt) < 1e-6 ? 'dx/dt = 0' : 'dx/dt' }}</text>
          <text class="rate-label is-vertical" :x="plotX(vectorCorner.x) + 13" :y="(plotY(vectorCorner.y) + plotY(vectorEnd.y)) / 2">{{ Math.abs(dydt) < 1e-6 ? 'dy/dt = 0' : 'dy/dt' }}</text>
        </svg>
      </div>

      <aside class="parameter-readout" aria-label="参数变化率换算">
        <span class="readout-kicker">动点位置</span>
        <MathFormula :tex="pointTex" display />

        <div class="parameter-rate-formula is-horizontal">
          <span aria-hidden="true"></span>
          <MathFormula :tex="horizontalRateTex" display />
        </div>
        <div class="parameter-rate-formula is-vertical">
          <span aria-hidden="true"></span>
          <MathFormula :tex="verticalRateTex" display />
        </div>

        <div class="parameter-division">
          <span class="readout-kicker">消去共同的 dt</span>
          <MathFormula :tex="slopeTex" display />
        </div>

        <p class="parameter-condition"><MathFormula tex="\dfrac{dx}{dt}\ne0" /> 时，才可以把 x 当作当前位置附近的新自变量。</p>
      </aside>
    </div>

    <div id="parametric-result" class="demo-result" aria-live="polite">
      <p>{{ statusText }}</p>
    </div>
  </section>
</template>
