<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const functionId = ref('square')
const stage = ref(1)
const x0 = ref(1)
const deltaXIndex = ref(15)

const deltaXChoices = [-1.5, -1, -0.75, -0.5, -0.2, -0.1, -0.05, -0.02, -0.01, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 0.75, 1, 1.5]
const deltaX = computed(() => deltaXChoices[deltaXIndex.value])

const chart = {
  width: 960,
  height: 560,
  left: 74,
  right: 918,
  top: 42,
  bottom: 486,
  minX: -2.6,
  maxX: 2.6,
}

const plotMinY = computed(() => -0.6)
const plotMaxY = computed(() => (functionId.value === 'square' ? 6.8 : 3))
const xTicks = [-2, -1, 0, 1, 2]
const yTicks = computed(() => (functionId.value === 'square' ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3]))

const plotX = (value) => chart.left
  + ((value - chart.minX) / (chart.maxX - chart.minX)) * (chart.right - chart.left)
const plotY = (value) => chart.bottom
  - ((value - plotMinY.value) / (plotMaxY.value - plotMinY.value)) * (chart.bottom - chart.top)

function functionValue(value) {
  return functionId.value === 'square' ? value * value : Math.abs(value)
}

function formatNumber(value, digits = 3) {
  if (Math.abs(value) < 10 ** (-(digits + 1))) return '0'
  return Number(value.toFixed(digits)).toString()
}

function pathFromSamples(start, end, steps, value) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const input = start + ((end - start) * index) / steps
    const command = index === 0 ? 'M' : 'L'
    return `${command} ${plotX(input).toFixed(2)} ${plotY(value(input)).toFixed(2)}`
  }).join(' ')
}

const curvePath = computed(() => pathFromSamples(
  chart.minX,
  chart.maxX,
  320,
  functionId.value === 'square' ? (value) => value * value : Math.abs,
))

const basePoint = computed(() => ({ x: x0.value, y: functionValue(x0.value) }))
const showBothSides = computed(() => (
  stage.value === 3 && functionId.value === 'absolute' && Math.abs(x0.value) < 1e-9
))
const visibleDeltaXs = computed(() => (
  showBothSides.value ? [-Math.abs(deltaX.value), Math.abs(deltaX.value)] : [deltaX.value]
))
const observations = computed(() => visibleDeltaXs.value.map((increment) => {
  const qx = x0.value + increment
  const qy = functionValue(qx)
  const deltaY = qy - basePoint.value.y
  return {
    id: increment < 0 ? 'left' : 'right',
    label: increment < 0 ? '从左' : '从右',
    deltaX: increment,
    qx,
    qy,
    deltaY,
    slope: deltaY / increment,
  }
}))

const derivativeExists = computed(() => (
  functionId.value === 'square' || Math.abs(x0.value) > 1e-9
))
const derivativeValue = computed(() => {
  if (!derivativeExists.value) return null
  return functionId.value === 'square' ? 2 * x0.value : Math.sign(x0.value)
})

const functionTex = computed(() => (
  functionId.value === 'square' ? 'f(x)=x^2' : 'f(x)=|x|'
))
const pointTex = computed(() => (
  String.raw`P=(${formatNumber(x0.value)},\,${formatNumber(basePoint.value.y)})`
))
const deltaXTex = computed(() => (
  showBothSides.value
    ? String.raw`\Delta x=\pm${formatNumber(Math.abs(deltaX.value), 2)}`
    : String.raw`\Delta x=${formatNumber(deltaX.value, 2)}`
))
const derivativeTex = computed(() => {
  if (functionId.value === 'square') {
    return String.raw`f'(${formatNumber(x0.value)})=2\cdot${formatNumber(x0.value)}=${formatNumber(derivativeValue.value)}`
  }
  if (derivativeExists.value) {
    return `f'(${formatNumber(x0.value)})=${formatNumber(derivativeValue.value)}`
  }
  return String.raw`f'_-(0)=-1,\qquad f'_+(0)=1`
})
const derivativeMapTex = computed(() => (
  functionId.value === 'square'
    ? "f'(x)=2x"
    : String.raw`f'(x)=\begin{cases}-1,&x<0,\\1,&x>0.\end{cases}`
))

function incrementTex(observation) {
  return String.raw`\Delta x=${formatNumber(observation.deltaX, 2)},\quad \Delta y=${formatNumber(observation.deltaY)}`
}

function slopeTex(observation) {
  return String.raw`\frac{\Delta y}{\Delta x}=${formatNumber(observation.slope)}`
}
const resultSentence = computed(() => {
  if (stage.value === 1) return '两个增量都随 Q 移动；先观察它们怎样一起变小。'
  if (stage.value === 2) return '把纵向变化除以横向变化，得到当前这条割线的斜率。'
  if (derivativeExists.value) return '当 Δx 从两侧趋于 0，割线斜率趋于同一个数；切线记录这个局部变化率。'
  return '左右割线稳定在不同斜率，没有共同极限，因此原点不可导。'
})

const tangent = computed(() => {
  if (!derivativeExists.value) return null
  const slope = derivativeValue.value
  return {
    yAtLeft: basePoint.value.y + slope * (chart.minX - x0.value),
    yAtRight: basePoint.value.y + slope * (chart.maxX - x0.value),
  }
})

function secantY(observation, input) {
  return basePoint.value.y + observation.slope * (input - x0.value)
}

function setFunction(nextFunction) {
  functionId.value = nextFunction
}

function setBasePoint(value) {
  x0.value = value
}

const map = {
  width: 360,
  height: 220,
  left: 38,
  right: 340,
  top: 22,
  bottom: 188,
  minX: -1.6,
  maxX: 1.6,
  minY: -3.4,
  maxY: 3.4,
}
const mapX = (value) => map.left + ((value - map.minX) / (map.maxX - map.minX)) * (map.right - map.left)
const mapY = (value) => map.bottom - ((value - map.minY) / (map.maxY - map.minY)) * (map.bottom - map.top)
const derivativeMapPath = computed(() => {
  if (functionId.value === 'square') {
    return `M ${mapX(map.minX)} ${mapY(2 * map.minX)} L ${mapX(map.maxX)} ${mapY(2 * map.maxX)}`
  }
  return ''
})
</script>

<template>
  <section class="derivative-microscope-demo">
    <nav class="derivative-reveal-nav" aria-label="观察层级">
      <button type="button" :class="{ 'is-active': stage === 1 }" :aria-current="stage === 1 ? 'step' : undefined" @click="stage = 1">1 · 看增量</button>
      <button type="button" :class="{ 'is-active': stage === 2 }" :aria-current="stage === 2 ? 'step' : undefined" @click="stage = 2">2 · 看比值</button>
      <button type="button" :class="{ 'is-active': stage === 3 }" :aria-current="stage === 3 ? 'step' : undefined" @click="stage = 3">3 · 看极限</button>
    </nav>

    <header class="demo-heading">
      <p class="demo-source">固定基点 x₀，改变 Δx；同一张图依次显出增量、差商与极限。</p>
      <h1>局部变化显微镜</h1>
      <p class="sequence-expression">
        <MathFormula :tex="functionTex" />
        <MathFormula :tex="pointTex" />
      </p>
    </header>

    <div class="microscope-controls" aria-label="演示控制">
      <fieldset class="demo-choice-group">
        <legend>函数</legend>
        <button type="button" :class="{ 'is-active': functionId === 'square' }" :aria-pressed="functionId === 'square'" @click="setFunction('square')">x²</button>
        <button type="button" :class="{ 'is-active': functionId === 'absolute' }" :aria-pressed="functionId === 'absolute'" @click="setFunction('absolute')">|x|</button>
      </fieldset>

      <div class="demo-slider-control">
        <label for="derivative-base-point">
          <span>基点 x₀</span>
          <output for="derivative-base-point">{{ formatNumber(x0) }}</output>
        </label>
        <input id="derivative-base-point" v-model.number="x0" type="range" min="-1.5" max="1.5" step="0.1" aria-describedby="derivative-result">
        <div class="demo-shortcuts" aria-label="常用基点">
          <button v-for="value in [1, -1, 0]" :key="value" type="button" :class="{ 'is-active': Math.abs(x0 - value) < 1e-9 }" @click="setBasePoint(value)">x₀ = {{ value }}</button>
        </div>
      </div>

      <div class="demo-slider-control">
        <label for="derivative-delta-x-range">
          <span>改变 Δx（不取 0）</span>
          <output for="derivative-delta-x-range"><MathFormula :tex="deltaXTex" /></output>
        </label>
        <input id="derivative-delta-x-range" v-model.number="deltaXIndex" type="range" min="0" :max="deltaXChoices.length - 1" step="1" aria-describedby="derivative-result">
        <div class="range-ends" aria-hidden="true"><span>−1.5</span><span class="delta-x-zero">0⁻ ｜ 0⁺</span><span>1.5</span></div>
      </div>
    </div>

    <div class="microscope-layout">
      <div class="derivative-plot">
        <svg :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" aria-labelledby="derivative-plot-title derivative-plot-description">
          <title id="derivative-plot-title">{{ functionTex }} 在基点附近的割线变化</title>
          <desc id="derivative-plot-description">固定点 P 的横坐标为 {{ formatNumber(x0) }}。当前{{ showBothSides ? '同时从左右两侧观察' : `取 Δx 等于 ${formatNumber(deltaX, 2)}` }}。图中画出 Q、横向增量、纵向增量与割线；第三步才显示极限对应的切线。</desc>
          <defs>
            <clipPath id="derivative-microscope-clip">
              <rect :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
            </clipPath>
          </defs>

          <rect class="plot-frame" :x="chart.left" :y="chart.top" :width="chart.right - chart.left" :height="chart.bottom - chart.top" />
          <g aria-hidden="true">
            <line v-for="tick in yTicks" :key="`dy-grid-${tick}`" class="grid-line" :x1="chart.left" :x2="chart.right" :y1="plotY(tick)" :y2="plotY(tick)" />
          </g>
          <g class="derivative-axes" aria-hidden="true">
            <line :x1="chart.left" :x2="chart.right" :y1="plotY(0)" :y2="plotY(0)" />
            <line :x1="plotX(0)" :x2="plotX(0)" :y1="chart.top" :y2="chart.bottom" />
          </g>

          <g :clip-path="'url(#derivative-microscope-clip)'">
            <path class="derivative-function-curve" :d="curvePath" />
            <line
              v-if="stage === 3 && tangent"
              class="derivative-tangent"
              :x1="plotX(chart.minX)"
              :x2="plotX(chart.maxX)"
              :y1="plotY(tangent.yAtLeft)"
              :y2="plotY(tangent.yAtRight)"
            />
            <g v-for="observation in observations" :key="observation.id" class="derivative-observation" :class="`is-${observation.id}`">
              <line class="derivative-secant" :x1="plotX(chart.minX)" :x2="plotX(chart.maxX)" :y1="plotY(secantY(observation, chart.minX))" :y2="plotY(secantY(observation, chart.maxX))" />
              <line class="derivative-delta derivative-delta-x" :x1="plotX(x0)" :x2="plotX(observation.qx)" :y1="plotY(basePoint.y)" :y2="plotY(basePoint.y)" />
              <line class="derivative-delta derivative-delta-y" :x1="plotX(observation.qx)" :x2="plotX(observation.qx)" :y1="plotY(basePoint.y)" :y2="plotY(observation.qy)" />
            </g>
          </g>

          <g v-for="observation in observations" :key="`points-${observation.id}`" class="derivative-observation" :class="`is-${observation.id}`">
            <circle class="derivative-q" :cx="plotX(observation.qx)" :cy="plotY(observation.qy)" r="8" />
            <text class="derivative-q-label" :x="plotX(observation.qx) + (observation.deltaX < 0 ? -13 : 13)" :y="plotY(observation.qy) - 14" :text-anchor="observation.deltaX < 0 ? 'end' : 'start'">Q{{ showBothSides ? (observation.deltaX < 0 ? '₋' : '₊') : '' }}</text>
            <text class="derivative-delta-label" :x="(plotX(x0) + plotX(observation.qx)) / 2" :y="plotY(basePoint.y) + (observation.deltaY >= 0 ? 25 : -13)" text-anchor="middle">Δx</text>
            <text class="derivative-delta-label" :x="plotX(observation.qx) + (observation.deltaX < 0 ? -13 : 13)" :y="(plotY(basePoint.y) + plotY(observation.qy)) / 2" :text-anchor="observation.deltaX < 0 ? 'end' : 'start'">Δy</text>
          </g>

          <circle class="derivative-p-focus" :cx="plotX(x0)" :cy="plotY(basePoint.y)" r="15" />
          <circle class="derivative-p" :cx="plotX(x0)" :cy="plotY(basePoint.y)" r="8" />
          <text class="derivative-p-label" :x="plotX(x0) + 13" :y="plotY(basePoint.y) - 15">P</text>

          <g v-if="showBothSides" class="approach-callouts" aria-hidden="true">
            <text class="is-left" :x="chart.left + 22" :y="chart.top + 34">从左　m = −1</text>
            <text class="is-right" :x="chart.right - 22" :y="chart.top + 34" text-anchor="end">从右　m = 1</text>
          </g>

          <g class="axis-labels" aria-hidden="true">
            <template v-for="tick in xTicks" :key="`dx-${tick}`">
              <line class="tick-mark" :x1="plotX(tick)" :x2="plotX(tick)" :y1="plotY(0)" :y2="plotY(0) + 8" />
              <text :x="plotX(tick)" :y="plotY(0) + 30" text-anchor="middle">{{ tick }}</text>
            </template>
            <template v-for="tick in yTicks" :key="`dy-${tick}`">
              <text v-if="tick !== 0" :x="plotX(0) - 12" :y="plotY(tick) + 6" text-anchor="end">{{ tick }}</text>
            </template>
            <text class="axis-title" :x="chart.right" :y="plotY(0) - 12" text-anchor="end">x</text>
            <text class="axis-title" :x="plotX(0) + 13" :y="chart.top + 22">y</text>
          </g>
        </svg>
      </div>

      <aside class="microscope-readout" aria-label="当前观察结果">
        <div class="readout-block">
          <span class="readout-kicker">当前观察</span>
          <div v-for="observation in observations" :key="`readout-${observation.id}`" class="observation-values" :class="`is-${observation.id}`">
            <strong>{{ observation.label }}</strong>
            <MathFormula :tex="incrementTex(observation)" display />
            <MathFormula v-if="stage >= 2" :tex="slopeTex(observation)" display />
          </div>
        </div>

        <div v-if="stage === 3" class="readout-block limit-readout">
          <span class="readout-kicker">把 Δx 继续缩小</span>
          <MathFormula :tex="derivativeTex" display />
          <p v-if="!derivativeExists" class="derivative-warning">左右结果不同：这里不画一条共同切线。</p>
        </div>

        <div v-if="stage === 3" class="readout-block derivative-map-card">
          <span class="readout-kicker">各处变化率排成新函数</span>
          <MathFormula :tex="derivativeMapTex" display />
          <svg viewBox="0 0 360 220" role="img" aria-labelledby="derivative-map-title derivative-map-description">
            <title id="derivative-map-title">导函数地图</title>
            <desc id="derivative-map-description">{{ functionId === 'square' ? '直线 y 等于 2x，并标出当前基点对应的导数值。' : 'x 小于 0 时导数为负 1，x 大于 0 时导数为 1，原点没有导数。' }}</desc>
            <rect class="map-frame" :x="map.left" :y="map.top" :width="map.right - map.left" :height="map.bottom - map.top" />
            <line class="map-axis" :x1="map.left" :x2="map.right" :y1="mapY(0)" :y2="mapY(0)" />
            <line class="map-axis" :x1="mapX(0)" :x2="mapX(0)" :y1="map.top" :y2="map.bottom" />
            <path v-if="functionId === 'square'" class="map-curve" :d="derivativeMapPath" />
            <template v-else>
              <line class="map-curve" :x1="map.left" :x2="mapX(0) - 5" :y1="mapY(-1)" :y2="mapY(-1)" />
              <line class="map-curve" :x1="mapX(0) + 5" :x2="map.right" :y1="mapY(1)" :y2="mapY(1)" />
              <circle class="map-open-point" :cx="mapX(0)" :cy="mapY(-1)" r="6" />
              <circle class="map-open-point" :cx="mapX(0)" :cy="mapY(1)" r="6" />
            </template>
            <circle v-if="derivativeExists" class="map-current-point" :cx="mapX(x0)" :cy="mapY(derivativeValue)" r="7" />
            <text class="map-label" :x="map.right" :y="map.bottom + 23" text-anchor="end">基点 x₀</text>
            <text class="map-label" :x="mapX(0) + 10" :y="map.top + 16">f′(x₀)</text>
          </svg>
        </div>
      </aside>
    </div>

    <div id="derivative-result" class="demo-result" aria-live="polite">
      <p>{{ resultSentence }}</p>
    </div>
  </section>
</template>
