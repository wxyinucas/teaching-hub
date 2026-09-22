<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const scene = ref(1)

function pathFromSamples(samples, xScale, yScale) {
  return samples.map(({ x, y }, index) => (
    (index === 0 ? 'M ' : 'L ') + xScale(x).toFixed(2) + ' ' + yScale(y).toFixed(2)
  )).join(' ')
}

function samplesBetween(start, end, steps, value) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const x = start + ((end - start) * index) / steps
    return { x, y: value(x) }
  })
}

const epsilon = ref(1)
const fixedDelta = 1
const responsiveDelta = computed(() => epsilon.value / 5)
const delta = computed(() => Math.min(fixedDelta, responsiveDelta.value))
const epsilonText = computed(() => epsilon.value.toFixed(2))
const epsilonTex = computed(() => '\\varepsilon=' + epsilonText.value)
const deltaSelectionSummary = computed(() => {
  if (epsilon.value < 5) return '动态区间更窄，实际邻域随 ε 扩张'
  if (epsilon.value > 5) return '固定区间更窄，实际邻域保持为 (1, 3)'
  return '两个区间恰好重合，主导权在这里切换'
})
const epsilonResultTex = (
  '\\delta=\\min\\left\\{1,\\frac{\\varepsilon}{5}\\right\\},'
  + '\\qquad 0<|x-2|<\\delta\\Longrightarrow |x^2-4|<\\varepsilon'
)

const epsilonChart = {
  width: 960,
  height: 520,
  left: 76,
  right: 922,
  top: 36,
  bottom: 444,
  minX: 0,
  maxX: 4,
  minY: -4.5,
  maxY: 16.5,
}
const epsilonX = (value) => epsilonChart.left
  + ((value - epsilonChart.minX) / (epsilonChart.maxX - epsilonChart.minX))
    * (epsilonChart.right - epsilonChart.left)
const epsilonY = (value) => epsilonChart.bottom
  - ((value - epsilonChart.minY) / (epsilonChart.maxY - epsilonChart.minY))
    * (epsilonChart.bottom - epsilonChart.top)
const epsilonXTicks = [0, 1, 2, 3, 4]
const epsilonYTicks = [-4, 0, 4, 8, 12, 16]
const parabolaPath = pathFromSamples(
  samplesBetween(epsilonChart.minX, epsilonChart.maxX, 320, (x) => x * x),
  epsilonX,
  epsilonY,
)
const controlledParabolaPath = computed(() => pathFromSamples(
  samplesBetween(2 - delta.value, 2 + delta.value, 120, (x) => x * x),
  epsilonX,
  epsilonY,
))
const epsilonBandTop = computed(() => epsilonY(4 + epsilon.value))
const epsilonBandHeight = computed(() => epsilonY(4 - epsilon.value) - epsilonBandTop.value)
const epsilonBandTopLabelY = computed(() => Math.max(
  epsilonChart.top + 22,
  epsilonBandTop.value - 10,
))
const epsilonBandBottomLabelY = computed(() => Math.min(
  epsilonChart.bottom - 12,
  epsilonY(4 - epsilon.value) + 24,
))
const fixedBandLeft = epsilonX(1)
const fixedBandWidth = epsilonX(3) - fixedBandLeft
const responsiveBandLeft = computed(() => epsilonX(2 - responsiveDelta.value))
const responsiveBandWidth = computed(() => (
  epsilonX(2 + responsiveDelta.value) - responsiveBandLeft.value
))
const deltaBandLeft = computed(() => epsilonX(2 - delta.value))
const deltaBandWidth = computed(() => epsilonX(2 + delta.value) - deltaBandLeft.value)

const windowRadius = ref(0.6)
const windowRadiusText = computed(() => windowRadius.value.toFixed(2))
const windowRadiusTex = computed(() => 'r=' + windowRadiusText.value)
const squeezeResultTex = computed(() => (
  '0<|x|<' + windowRadiusText.value
  + '\\Longrightarrow \\left|x\\sin\\frac1x\\right|\\le |x|<' + windowRadiusText.value
))
const squeezeChart = {
  width: 960,
  height: 520,
  left: 76,
  right: 922,
  top: 36,
  bottom: 444,
  minX: -1.05,
  maxX: 1.05,
  minY: -1.05,
  maxY: 1.05,
}
const squeezeX = (value) => squeezeChart.left
  + ((value - squeezeChart.minX) / (squeezeChart.maxX - squeezeChart.minX))
    * (squeezeChart.right - squeezeChart.left)
const squeezeY = (value) => squeezeChart.bottom
  - ((value - squeezeChart.minY) / (squeezeChart.maxY - squeezeChart.minY))
    * (squeezeChart.bottom - squeezeChart.top)

function oscillationBranch(radius, direction) {
  const minimumPhase = 1 / radius
  const maximumPhase = 80 * Math.PI
  const samples = Array.from({ length: 1001 }, (_, index) => {
    const phase = minimumPhase + ((maximumPhase - minimumPhase) * index) / 1000
    const x = direction / phase
    return { x, y: x * Math.sin(1 / x) }
  })
  return pathFromSamples(samples, squeezeX, squeezeY)
}

const fullPositiveOscillation = oscillationBranch(1, 1)
const fullNegativeOscillation = oscillationBranch(1, -1)
const localPositiveOscillation = computed(() => oscillationBranch(windowRadius.value, 1))
const localNegativeOscillation = computed(() => oscillationBranch(windowRadius.value, -1))
const squeezeBandLeft = computed(() => [
  squeezeX(-windowRadius.value) + ',' + squeezeY(windowRadius.value),
  squeezeX(0) + ',' + squeezeY(0),
  squeezeX(-windowRadius.value) + ',' + squeezeY(-windowRadius.value),
].join(' '))
const squeezeBandRight = computed(() => [
  squeezeX(windowRadius.value) + ',' + squeezeY(windowRadius.value),
  squeezeX(0) + ',' + squeezeY(0),
  squeezeX(windowRadius.value) + ',' + squeezeY(-windowRadius.value),
].join(' '))

const theta = ref(0.55)
const thetaText = computed(() => theta.value.toFixed(2))
const thetaTex = computed(() => 'x=' + thetaText.value + '\\text{ rad}')
const areaComparisonTex = computed(() => (
  '\\frac12\\sin x=' + (Math.sin(theta.value) / 2).toFixed(4)
  + '\\;<\\;\\frac12x=' + (theta.value / 2).toFixed(4)
  + '\\;<\\;\\frac12\\tan x=' + (Math.tan(theta.value) / 2).toFixed(4)
))
const ratioComparisonTex = computed(() => (
  '\\cos x=' + Math.cos(theta.value).toFixed(4)
  + '\\;<\\;\\frac{\\sin x}{x}=' + (Math.sin(theta.value) / theta.value).toFixed(4)
  + '\\;<\\;1'
))
const geometry = {
  width: 600,
  height: 520,
  cx: 88,
  cy: 430,
  radius: 250,
}
const pointA = {
  x: geometry.cx + geometry.radius,
  y: geometry.cy,
}
const pointB = computed(() => ({
  x: geometry.cx + geometry.radius * Math.cos(theta.value),
  y: geometry.cy - geometry.radius * Math.sin(theta.value),
}))
const pointC = computed(() => ({
  x: geometry.cx + geometry.radius,
  y: geometry.cy - geometry.radius * Math.tan(theta.value),
}))
const quarterCirclePath = 'M ' + pointA.x + ' ' + pointA.y
  + ' A ' + geometry.radius + ' ' + geometry.radius + ' 0 0 0 '
  + geometry.cx + ' ' + (geometry.cy - geometry.radius)
const sectorPath = computed(() => (
  'M ' + geometry.cx + ' ' + geometry.cy
  + ' L ' + pointA.x + ' ' + pointA.y
  + ' A ' + geometry.radius + ' ' + geometry.radius + ' 0 0 0 '
  + pointB.value.x.toFixed(2) + ' ' + pointB.value.y.toFixed(2)
  + ' Z'
))
const innerTrianglePoints = computed(() => [
  geometry.cx + ',' + geometry.cy,
  pointA.x + ',' + pointA.y,
  pointB.value.x + ',' + pointB.value.y,
].join(' '))
const outerTrianglePoints = computed(() => [
  geometry.cx + ',' + geometry.cy,
  pointA.x + ',' + pointA.y,
  pointC.value.x + ',' + pointC.value.y,
].join(' '))
const angleRadius = 54
const angleArcPath = computed(() => (
  'M ' + (geometry.cx + angleRadius) + ' ' + geometry.cy
  + ' A ' + angleRadius + ' ' + angleRadius + ' 0 0 0 '
  + (geometry.cx + angleRadius * Math.cos(theta.value)).toFixed(2) + ' '
  + (geometry.cy - angleRadius * Math.sin(theta.value)).toFixed(2)
))
const angleLabel = computed(() => ({
  x: geometry.cx + 76 * Math.cos(theta.value / 2),
  y: geometry.cy - 76 * Math.sin(theta.value / 2),
}))
</script>

<template>
  <section class="function-limit-demo">
    <nav class="demo-scene-nav" aria-label="演示页面">
      <button type="button" :class="{ 'is-active': scene === 1 }" :aria-current="scene === 1 ? 'page' : undefined" @click="scene = 1">1 · 两个邻域取交集</button>
      <button type="button" :class="{ 'is-active': scene === 2 }" :aria-current="scene === 2 ? 'page' : undefined" @click="scene = 2">2 · 振荡函数的夹逼</button>
      <button type="button" :class="{ 'is-active': scene === 3 }" :aria-current="scene === 3 ? 'page' : undefined" @click="scene = 3">3 · 第一重要极限</button>
    </nav>

    <div v-if="scene === 1" class="demo-scene" aria-labelledby="function-limit-control-title">
      <header class="demo-heading">
        <p class="demo-source">固定邻域与 ε 诱导的邻域同时存在；真正生效的是二者的交集。</p>
        <h1 id="function-limit-control-title">两个邻域的交集决定 δ</h1>
        <p class="sequence-expression">
          <MathFormula tex="f(x)=x^2,\quad x_0=2,\quad A=4" />
          <MathFormula tex="\lim_{x\to2}x^2=4" />
        </p>
      </header>

      <div class="epsilon-control">
        <label for="function-epsilon-range">
          <span>调整允许误差 ε</span>
          <output for="function-epsilon-range"><MathFormula :tex="epsilonTex" /></output>
        </label>
        <input id="function-epsilon-range" v-model.number="epsilon" type="range" min="0.25" max="8" step="0.05" aria-describedby="epsilon-delta-choice function-limit-result">
        <div class="range-ends" aria-hidden="true">
          <span>0.25</span>
          <span class="range-switch">ε = 5 · 切换点</span>
          <span>8.00</span>
        </div>
      </div>

      <div id="epsilon-delta-choice" class="interval-legend">
        <span class="interval-legend-item">
          <i class="interval-swatch is-fixed" aria-hidden="true"></i>
          <span>固定限制</span>
          <MathFormula tex="I_1=(1,3)" />
        </span>
        <span class="interval-legend-item">
          <i class="interval-swatch is-responsive" aria-hidden="true"></i>
          <span>随 ε 扩张</span>
          <MathFormula tex="I_2=(2-\varepsilon/5,\,2+\varepsilon/5)" />
        </span>
        <span class="interval-legend-item">
          <i class="interval-swatch is-effective" aria-hidden="true"></i>
          <span>实际生效</span>
          <MathFormula tex="I_1\cap I_2=(2-\delta,\,2+\delta)" />
        </span>
      </div>
      <p class="interval-switch-status" aria-live="polite">
        {{ deltaSelectionSummary }}
      </p>

      <div class="function-plot">
        <svg :viewBox="'0 0 ' + epsilonChart.width + ' ' + epsilonChart.height" role="img" aria-labelledby="epsilon-delta-plot-title epsilon-delta-plot-description">
          <title id="epsilon-delta-plot-title">函数 x² 在 2 附近的 ε–δ 控制</title>
          <desc id="epsilon-delta-plot-description">横轴从 0 到 4。灰色长虚线区域表示固定开区间 1 到 3，紫色竖线表示随 ε 扩张的开区间 2 减 ε 除以 5 到 2 加 ε 除以 5；二者重合的深色区域是实际生效的交集，其边界仅由圆括号标出。水平带表示函数值与 4 的距离小于 ε。</desc>
          <rect class="plot-frame" :x="epsilonChart.left" :y="epsilonChart.top" :width="epsilonChart.right - epsilonChart.left" :height="epsilonChart.bottom - epsilonChart.top" />
          <g aria-hidden="true">
            <line v-for="tick in epsilonYTicks" :key="'epsilon-grid-' + tick" class="grid-line" :x1="epsilonChart.left" :x2="epsilonChart.right" :y1="epsilonY(tick)" :y2="epsilonY(tick)" />
          </g>
          <rect class="function-output-band" :x="epsilonChart.left" :y="epsilonBandTop" :width="epsilonChart.right - epsilonChart.left" :height="epsilonBandHeight" />
          <rect class="function-fixed-band" :x="fixedBandLeft" :y="epsilonChart.top" :width="fixedBandWidth" :height="epsilonChart.bottom - epsilonChart.top" />
          <rect class="function-responsive-band" :x="responsiveBandLeft" :y="epsilonChart.top" :width="responsiveBandWidth" :height="epsilonChart.bottom - epsilonChart.top" />
          <rect class="function-input-band" :x="deltaBandLeft" :y="epsilonChart.top" :width="deltaBandWidth" :height="epsilonChart.bottom - epsilonChart.top" />
          <line class="function-boundary output-boundary" :x1="epsilonChart.left" :x2="epsilonChart.right" :y1="epsilonY(4 + epsilon)" :y2="epsilonY(4 + epsilon)" />
          <line class="function-boundary output-boundary" :x1="epsilonChart.left" :x2="epsilonChart.right" :y1="epsilonY(4 - epsilon)" :y2="epsilonY(4 - epsilon)" />
          <line class="function-boundary fixed-boundary" :x1="epsilonX(1)" :x2="epsilonX(1)" :y1="epsilonChart.top" :y2="epsilonChart.bottom" />
          <line class="function-boundary fixed-boundary" :x1="epsilonX(3)" :x2="epsilonX(3)" :y1="epsilonChart.top" :y2="epsilonChart.bottom" />
          <line class="function-boundary responsive-boundary" :x1="epsilonX(2 - responsiveDelta)" :x2="epsilonX(2 - responsiveDelta)" :y1="epsilonChart.top" :y2="epsilonChart.bottom" />
          <line class="function-boundary responsive-boundary" :x1="epsilonX(2 + responsiveDelta)" :x2="epsilonX(2 + responsiveDelta)" :y1="epsilonChart.top" :y2="epsilonChart.bottom" />
          <g class="open-interval-markers" aria-hidden="true">
            <text :x="epsilonX(2 - delta)" :y="epsilonChart.bottom - 24" text-anchor="middle">(</text>
            <text :x="epsilonX(2 + delta)" :y="epsilonChart.bottom - 24" text-anchor="middle">)</text>
          </g>
          <path class="function-curve is-muted" :d="parabolaPath" />
          <path class="function-curve is-controlled" :d="controlledParabolaPath" />
          <line class="function-target-line" :x1="epsilonX(2)" :x2="epsilonX(2)" :y1="epsilonChart.top" :y2="epsilonChart.bottom" />
          <line class="function-target-line" :x1="epsilonChart.left" :x2="epsilonChart.right" :y1="epsilonY(4)" :y2="epsilonY(4)" />
          <g class="axis-labels" aria-hidden="true">
            <template v-for="tick in epsilonYTicks" :key="'epsilon-y-' + tick">
              <text :x="epsilonChart.left - 15" :y="epsilonY(tick) + 6" text-anchor="end">{{ tick }}</text>
            </template>
            <template v-for="tick in epsilonXTicks" :key="'epsilon-x-' + tick">
              <line class="tick-mark" :x1="epsilonX(tick)" :x2="epsilonX(tick)" :y1="epsilonChart.bottom" :y2="epsilonChart.bottom + 8" />
              <text :x="epsilonX(tick)" :y="epsilonChart.bottom + 31" text-anchor="middle">{{ tick }}</text>
            </template>
            <text class="axis-title" :x="epsilonChart.right" :y="epsilonChart.bottom + 31" text-anchor="end">输入 x</text>
            <text class="axis-title" :x="epsilonChart.left" :y="epsilonChart.top - 12">输出 f(x)</text>
          </g>
          <text class="function-band-label" :x="epsilonChart.right - 14" :y="epsilonBandTopLabelY" text-anchor="end">A + ε</text>
          <text class="function-band-label" :x="epsilonChart.right - 14" :y="epsilonBandBottomLabelY" text-anchor="end">A − ε</text>
          <text class="function-band-label" :x="epsilonX(2)" :y="epsilonChart.top + 25" text-anchor="middle">x₀ = 2</text>
        </svg>
      </div>

      <div id="function-limit-result" class="demo-result" aria-live="polite">
        <MathFormula class="result-formula" :tex="epsilonResultTex" display />
        <p><MathFormula tex="\delta\le1" /> 给出 <MathFormula tex="|x+2|<5" />；<MathFormula tex="\delta\le\varepsilon/5" /> 给出 <MathFormula tex="|x-2|<\varepsilon/5" />。两个条件同时成立，因此 <MathFormula tex="|x^2-4|<5\cdot\varepsilon/5=\varepsilon" />。</p>
      </div>
    </div>

    <div v-else-if="scene === 2" class="demo-scene" aria-labelledby="squeeze-title">
      <header class="demo-heading">
        <p class="demo-source">中间函数不停振荡，但始终逃不出正在收紧的上下界。</p>
        <h1 id="squeeze-title">振荡函数也可以被夹到同一个极限</h1>
        <p class="sequence-expression">
          <MathFormula tex="-|x|\le x\sin\frac1x\le |x|" />
          <MathFormula tex="\lim_{x\to0}x\sin\frac1x=0" />
        </p>
      </header>

      <div class="epsilon-control">
        <label for="squeeze-window-range">
          <span>缩小观察范围 0 &lt; |x| &lt; r</span>
          <output for="squeeze-window-range"><MathFormula :tex="windowRadiusTex" /></output>
        </label>
        <input id="squeeze-window-range" v-model.number="windowRadius" type="range" min="0.1" max="1" step="0.05" aria-describedby="squeeze-result">
        <div class="range-ends" aria-hidden="true"><span>0.10</span><span>1.00</span></div>
      </div>

      <div class="function-plot">
        <svg :viewBox="'0 0 ' + squeezeChart.width + ' ' + squeezeChart.height" role="img" aria-labelledby="squeeze-plot-title squeeze-plot-description">
          <title id="squeeze-plot-title">x sin(1/x) 与上下包络</title>
          <desc id="squeeze-plot-description">振荡曲线始终位于负绝对值函数和绝对值函数之间。当前只高亮绝对值小于 r 的局部范围。</desc>
          <rect class="plot-frame" :x="squeezeChart.left" :y="squeezeChart.top" :width="squeezeChart.right - squeezeChart.left" :height="squeezeChart.bottom - squeezeChart.top" />
          <line class="grid-line" :x1="squeezeChart.left" :x2="squeezeChart.right" :y1="squeezeY(0)" :y2="squeezeY(0)" />
          <line class="grid-line" :x1="squeezeX(0)" :x2="squeezeX(0)" :y1="squeezeChart.top" :y2="squeezeChart.bottom" />
          <polygon class="squeeze-band" :points="squeezeBandLeft" />
          <polygon class="squeeze-band" :points="squeezeBandRight" />
          <path class="envelope-line" :d="'M ' + squeezeX(-1) + ' ' + squeezeY(1) + ' L ' + squeezeX(0) + ' ' + squeezeY(0) + ' L ' + squeezeX(1) + ' ' + squeezeY(1)" />
          <path class="envelope-line" :d="'M ' + squeezeX(-1) + ' ' + squeezeY(-1) + ' L ' + squeezeX(0) + ' ' + squeezeY(0) + ' L ' + squeezeX(1) + ' ' + squeezeY(-1)" />
          <path class="oscillating-function is-muted" :d="fullNegativeOscillation" />
          <path class="oscillating-function is-muted" :d="fullPositiveOscillation" />
          <path class="oscillating-function is-local" :d="localNegativeOscillation" />
          <path class="oscillating-function is-local" :d="localPositiveOscillation" />
          <line class="function-boundary input-boundary" :x1="squeezeX(-windowRadius)" :x2="squeezeX(-windowRadius)" :y1="squeezeChart.top" :y2="squeezeChart.bottom" />
          <line class="function-boundary input-boundary" :x1="squeezeX(windowRadius)" :x2="squeezeX(windowRadius)" :y1="squeezeChart.top" :y2="squeezeChart.bottom" />
          <g class="axis-labels" aria-hidden="true">
            <text :x="squeezeX(-1)" :y="squeezeChart.bottom + 31" text-anchor="middle">−1</text>
            <text :x="squeezeX(0)" :y="squeezeChart.bottom + 31" text-anchor="middle">0</text>
            <text :x="squeezeX(1)" :y="squeezeChart.bottom + 31" text-anchor="middle">1</text>
            <text :x="squeezeChart.left - 15" :y="squeezeY(1) + 6" text-anchor="end">1</text>
            <text :x="squeezeChart.left - 15" :y="squeezeY(0) + 6" text-anchor="end">0</text>
            <text :x="squeezeChart.left - 15" :y="squeezeY(-1) + 6" text-anchor="end">−1</text>
            <text class="axis-title" :x="squeezeChart.right" :y="squeezeChart.bottom + 31" text-anchor="end">x</text>
            <text class="axis-title" :x="squeezeChart.left" :y="squeezeChart.top - 12">函数值</text>
          </g>
          <text class="function-band-label" :x="squeezeX(0.72)" :y="squeezeY(0.72) - 12">y = |x|</text>
          <text class="function-band-label" :x="squeezeX(0.72)" :y="squeezeY(-0.72) + 24">y = −|x|</text>
          <text class="function-band-label" :x="squeezeX(-windowRadius) - 8" :y="squeezeChart.top + 25" text-anchor="end">−r</text>
          <text class="function-band-label" :x="squeezeX(windowRadius) + 8" :y="squeezeChart.top + 25">r</text>
        </svg>
      </div>

      <div id="squeeze-result" class="demo-result" aria-live="polite">
        <MathFormula class="result-formula" :tex="squeezeResultTex" display />
        <p><MathFormula tex="\sin(1/x)" /> 自身没有极限；这里使用的是上下界，而不是乘法法则。</p>
      </div>
    </div>

    <div v-else class="demo-scene" aria-labelledby="important-limit-title">
      <header class="demo-heading">
        <p class="demo-source">单位圆中：内接三角形面积 &lt; 扇形面积 &lt; 外切三角形面积。</p>
        <h1 id="important-limit-title">面积关系夹出第一重要极限</h1>
        <p class="sequence-expression">
          <MathFormula tex="\sin x<x<\tan x\qquad(0<x<\pi/2)" />
          <MathFormula tex="\cos x<\frac{\sin x}{x}<1" />
        </p>
      </header>

      <div class="epsilon-control">
        <label for="theta-range">
          <span>调整圆心角（弧度）</span>
          <output for="theta-range"><MathFormula :tex="thetaTex" /></output>
        </label>
        <input id="theta-range" v-model.number="theta" type="range" min="0.12" max="0.95" step="0.01" aria-describedby="important-limit-result">
        <div class="range-ends" aria-hidden="true"><span>0.12</span><span>0.95</span></div>
      </div>

      <div class="geometry-layout">
        <div class="function-plot geometry-plot">
          <svg :viewBox="'0 0 ' + geometry.width + ' ' + geometry.height" role="img" aria-labelledby="unit-circle-title unit-circle-description">
            <title id="unit-circle-title">单位圆中的三块面积</title>
            <desc id="unit-circle-description">内接三角形 OAB 位于扇形 OAB 内，扇形又位于外切三角形 OAC 内。角 x 使用弧度制；从 B 向 OA 作垂线，所得线段长度为 sin x。</desc>
            <line class="geometry-axis" x1="36" :x2="geometry.width - 25" :y1="geometry.cy" :y2="geometry.cy" />
            <line class="geometry-tangent" :x1="pointA.x" :x2="pointA.x" y1="50" :y2="geometry.cy + 18" />
            <polygon class="area-outer" :points="outerTrianglePoints" />
            <path class="area-sector" :d="sectorPath" />
            <polygon class="area-inner" :points="innerTrianglePoints" />
            <path class="unit-circle" :d="quarterCirclePath" />
            <line class="geometry-ray" :x1="geometry.cx" :y1="geometry.cy" :x2="pointC.x" :y2="pointC.y" />
            <line class="geometry-radius" :x1="geometry.cx" :y1="geometry.cy" :x2="pointA.x" :y2="pointA.y" />
            <line class="geometry-radius" :x1="geometry.cx" :y1="geometry.cy" :x2="pointB.x" :y2="pointB.y" />
            <line class="geometry-sine-segment" :x1="pointB.x" :y1="pointB.y" :x2="pointB.x" :y2="geometry.cy" />
            <path
              class="geometry-right-angle"
              :d="'M ' + (pointB.x - 13) + ' ' + geometry.cy
                + ' L ' + (pointB.x - 13) + ' ' + (geometry.cy - 13)
                + ' L ' + pointB.x + ' ' + (geometry.cy - 13)"
            />
            <path class="geometry-angle" :d="angleArcPath" />
            <circle class="geometry-point" :cx="geometry.cx" :cy="geometry.cy" r="5" />
            <circle class="geometry-point" :cx="pointA.x" :cy="pointA.y" r="5" />
            <circle class="geometry-point" :cx="pointB.x" :cy="pointB.y" r="5" />
            <circle class="geometry-point" :cx="pointC.x" :cy="pointC.y" r="5" />
            <g class="geometry-labels" aria-hidden="true">
              <text :x="geometry.cx - 18" :y="geometry.cy + 28">O</text>
              <text :x="pointA.x - 3" :y="pointA.y + 30">A</text>
              <text :x="pointB.x - 22" :y="pointB.y - 12">B</text>
              <text :x="pointC.x + 12" :y="pointC.y + 6">C</text>
              <text :x="angleLabel.x" :y="angleLabel.y">x</text>
              <text class="geometry-sine-label" :x="pointB.x - 14" :y="(pointB.y + geometry.cy) / 2 + 6" text-anchor="end">sin x</text>
              <text :x="geometry.cx + 70" :y="geometry.cy - 170">半径 = 1</text>
              <text :x="pointA.x + 16" y="80">A 点切线</text>
            </g>
          </svg>
        </div>

        <div class="geometry-relations" aria-live="polite">
          <div><span class="area-key area-key-inner" aria-hidden="true"></span><p>内接三角形</p><MathFormula tex="S_{\triangle OAB}=\frac12\sin x" display /></div>
          <div><span class="area-key area-key-sector" aria-hidden="true"></span><p>单位圆扇形</p><MathFormula tex="S_{\text{扇形 }OAB}=\frac12x" display /></div>
          <div><span class="area-key area-key-outer" aria-hidden="true"></span><p>外切三角形</p><MathFormula tex="S_{\triangle OAC}=\frac12\tan x" display /></div>
        </div>
      </div>

      <div id="important-limit-result" class="demo-result" aria-live="polite">
        <MathFormula class="result-formula" :tex="areaComparisonTex" display />
        <MathFormula class="result-formula" :tex="ratioComparisonTex" display />
        <p>正侧由面积关系得到夹逼；负侧由 <MathFormula tex="\sin x/x" /> 与 <MathFormula tex="\cos x" /> 的偶性补齐。</p>
      </div>
    </div>
  </section>
</template>
