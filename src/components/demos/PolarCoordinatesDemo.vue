<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'
import { TAU, POLAR_CURVES, cartesianToPolar, curvePoint, normalizeAngle, polarToCartesian } from '../../lib/polarCoordinates.js'

const mode = ref('point')
const radius = ref(2)
const angle = ref(Math.PI / 4)
const curveId = ref('circle')
const parameter = ref(Math.PI / 4)
const dragging = ref(false)
const chartSize = 640
const center = chartSize / 2
const scale = 62
const plotX = (x) => center + scale * x
const plotY = (y) => center - scale * y
const curve = computed(() => POLAR_CURVES.find((item) => item.id === curveId.value))
const point = computed(() => mode.value === 'point'
  ? { ...polarToCartesian(radius.value, angle.value), r: radius.value, theta: radius.value === 0 ? null : normalizeAngle(angle.value) }
  : curvePoint(curveId.value, parameter.value))
const currentAngle = computed(() => mode.value === 'point' ? angle.value : parameter.value)
const ticks = [-4, -2, 2, 4]
const rays = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4]

function format(value) {
  return Math.abs(value) < 0.0005 ? '0' : Number(value.toFixed(3)).toString()
}

const cartesianTex = computed(() => String.raw`\left\{\begin{aligned}x&=${format(point.value.x)}\\y&=${format(point.value.y)}\end{aligned}\right.`)
const polarTex = computed(() => point.value.theta === null
  ? String.raw`r=0,\quad\theta\text{ 任意}`
  : String.raw`\left\{\begin{aligned}r&=${format(point.value.r)}\\\theta&=${format(point.value.theta)}\ \mathrm{rad}\end{aligned}\right.`)
const parameterTex = computed(() => String.raw`t=${format(parameter.value)}\ \mathrm{rad}`)
const angleTex = computed(() => String.raw`${format(angle.value)}\ \mathrm{rad}`)
const curveTex = computed(() => String.raw`\left\{\begin{aligned}x(t)&=r(t)\cos t\\y(t)&=r(t)\sin t\end{aligned}\right.`)
const canonicalAngle = computed(() => point.value.theta ?? 0)
const angleArc = computed(() => {
  const theta = canonicalAngle.value
  if (theta < 0.001 || point.value.r === 0) return ''
  const arcRadius = 32
  return `M ${center + arcRadius} ${center} A ${arcRadius} ${arcRadius} 0 ${theta > Math.PI ? 1 : 0} 0 ${center + arcRadius * Math.cos(theta)} ${center - arcRadius * Math.sin(theta)}`
})

function pathUntil(end) {
  const count = Math.max(1, Math.ceil(360 * end / curve.value.maxParameter))
  return Array.from({ length: count + 1 }, (_, index) => {
    const p = curvePoint(curveId.value, end * index / count)
    return `${index === 0 ? 'M' : 'L'} ${plotX(p.x).toFixed(2)} ${plotY(p.y).toFixed(2)}`
  }).join(' ')
}

const wholeCurve = computed(() => pathUntil(curve.value.maxParameter))
const tracedCurve = computed(() => pathUntil(parameter.value))
const presets = computed(() => [
  { label: '0', value: 0 },
  { label: 'π/2', value: Math.PI / 2 },
  { label: 'π', value: Math.PI },
  { label: '2π', value: TAU },
  ...(curveId.value === 'spiral' && mode.value === 'curve' ? [{ label: '4π', value: 2 * TAU }] : []),
])
const status = computed(() => {
  if (mode.value === 'point') return '平面上的点：半径与方向可以独立改变，需要两个独立的数。'
  return '沿选定的曲线移动：只选一个 t，半径、横坐标、纵坐标便一起确定。'
})

function selectMode(nextMode) {
  dragging.value = false
  mode.value = nextMode
}

function selectCurve() {
  parameter.value = 0
}

function setAngle(value) {
  if (mode.value === 'point') angle.value = value
  else parameter.value = value
}

function movePoint(event) {
  if (!dragging.value || mode.value !== 'point') return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = Math.min(rect.width, rect.height) / chartSize
  if (!ratio) return
  const offsetX = rect.left + (rect.width - chartSize * ratio) / 2
  const offsetY = rect.top + (rect.height - chartSize * ratio) / 2
  const x = ((event.clientX - offsetX) / ratio - center) / scale
  const y = (center - (event.clientY - offsetY) / ratio) / scale
  const polar = cartesianToPolar(x, y)
  radius.value = Math.min(4, polar.r)
  if (polar.theta !== null) angle.value = polar.theta
}

function startDrag(event) {
  if (mode.value !== 'point' || (event.button !== undefined && event.button !== 0)) return
  dragging.value = true
  event.currentTarget.setPointerCapture?.(event.pointerId)
  movePoint(event)
}

function stopDrag() {
  dragging.value = false
}
</script>

<template>
  <section class="polar-coordinates-demo">
    <header class="demo-heading">
      <p class="demo-source">换一种坐标报位置；给点一个约束，就沿着曲线移动。</p>
      <h1>两套坐标，一个曲线参数</h1>
      <p class="sequence-expression"><MathFormula tex="x=r\cos\theta,\qquad y=r\sin\theta" /></p>
    </header>

    <div class="polar-mode-controls">
      <fieldset class="demo-choice-group">
        <legend>比较自由移动与沿曲线移动</legend>
        <button type="button" :class="{ 'is-active': mode === 'point' }" :aria-pressed="mode === 'point'" @click="selectMode('point')">平面上的点 · 两个自由度</button>
        <button type="button" :class="{ 'is-active': mode === 'curve' }" :aria-pressed="mode === 'curve'" @click="selectMode('curve')">限制在曲线上 · 一个自由度</button>
      </fieldset>
      <label v-if="mode === 'curve'" class="polar-curve-choice" for="polar-curve-select">
        <span>选择曲线</span>
        <select id="polar-curve-select" v-model="curveId" @change="selectCurve">
          <option v-for="item in POLAR_CURVES" :key="item.id" :value="item.id">{{ item.label }}</option>
        </select>
      </label>
    </div>

    <div class="polar-controls">
      <template v-if="mode === 'point'">
        <div class="demo-slider-control">
          <label for="polar-radius-range"><span>独立选择半径 r</span><output for="polar-radius-range">{{ format(radius) }}</output></label>
          <input id="polar-radius-range" v-model.number="radius" type="range" min="0" max="4" step="0.01">
          <div class="range-ends" aria-hidden="true"><span>0 · 原点</span><span>4</span></div>
        </div>
        <div class="demo-slider-control">
          <label for="polar-angle-range"><span>独立选择转角</span><output for="polar-angle-range"><MathFormula :tex="angleTex" /></output></label>
          <input id="polar-angle-range" v-model.number="angle" type="range" min="0" :max="TAU" step="0.001">
          <div class="range-ends" aria-hidden="true"><span>0</span><span>2π · 回到同一方向</span></div>
        </div>
      </template>
      <div v-else class="demo-slider-control polar-parameter-control">
        <label for="polar-parameter-range"><span>只移动共同参数 t · 累计转角</span><output for="polar-parameter-range"><MathFormula :tex="parameterTex" /></output></label>
        <input id="polar-parameter-range" v-model.number="parameter" type="range" min="0" :max="curve.maxParameter" step="0.001">
        <div class="range-ends" aria-hidden="true"><span>0</span><span>{{ curveId === 'spiral' ? '4π · 两圈' : '2π · 一圈' }}</span></div>
      </div>
      <div class="demo-shortcuts polar-angle-presets" aria-label="代表转角">
        <button v-for="preset in presets" :key="preset.label" type="button" :class="{ 'is-active': Math.abs(currentAngle - preset.value) < 0.001 }" @click="setAngle(preset.value)">{{ preset.label }}</button>
      </div>
    </div>

    <div class="polar-layout">
      <div class="polar-plot">
        <svg :viewBox="`0 0 ${chartSize} ${chartSize}`" :class="{ 'is-draggable': mode === 'point' }" role="img" aria-labelledby="polar-plot-title polar-plot-description" @pointerdown.prevent="startDrag" @pointermove="movePoint" @pointerup="stopDrag" @pointercancel="stopDrag" @lostpointercapture="stopDrag">
          <title id="polar-plot-title">同一点的直角坐标与极坐标</title>
          <desc id="polar-plot-description">{{ mode === 'point' ? '可直接拖动平面上的点，也可用半径与角度滑块操作。' : `当前曲线：${curve.label}，一个参数决定两个坐标。` }} 当前点横坐标 {{ format(point.x) }}，纵坐标 {{ format(point.y) }}，半径 {{ format(point.r) }}。{{ point.theta === null ? '原点的极角任意。' : `规范极角 ${format(point.theta)} 弧度。` }}</desc>
          <rect class="plot-frame" x="20" y="20" width="600" height="600" />
          <g class="polar-cartesian-grid" aria-hidden="true">
            <template v-for="tick in ticks" :key="tick">
              <line :x1="plotX(tick)" :x2="plotX(tick)" y1="20" y2="620" />
              <line x1="20" x2="620" :y1="plotY(tick)" :y2="plotY(tick)" />
            </template>
          </g>
          <g class="polar-grid" aria-hidden="true">
            <circle v-for="r in [1, 2, 3, 4]" :key="r" :cx="center" :cy="center" :r="scale * r" />
            <line v-for="ray in rays" :key="ray" :x1="center" :y1="center" :x2="plotX(4.7 * Math.cos(ray))" :y2="plotY(4.7 * Math.sin(ray))" />
          </g>
          <g class="polar-axes" aria-hidden="true">
            <line x1="20" x2="620" :y1="center" :y2="center" />
            <line :x1="center" :x2="center" y1="20" y2="620" />
            <text x="608" :y="center - 12">x</text>
            <text :x="center + 12" y="39">y</text>
            <text :x="center - 10" :y="center + 20" text-anchor="end">O</text>
            <template v-for="tick in ticks" :key="tick">
              <text :x="plotX(tick)" :y="center + 22" text-anchor="middle">{{ tick }}</text>
              <text :x="center - 12" :y="plotY(tick) + 5" text-anchor="end">{{ tick }}</text>
            </template>
            <text :x="center + 13" :y="plotY(3) - 7">r = 3</text>
          </g>
          <g v-if="mode === 'curve'">
            <path class="polar-whole-curve" :d="wholeCurve" />
            <path class="polar-traced-curve" :d="tracedCurve" />
          </g>
          <g class="polar-coordinate-guides" aria-hidden="true">
            <line :x1="plotX(point.x)" :x2="plotX(point.x)" :y1="center" :y2="plotY(point.y)" />
            <line :x1="center" :x2="plotX(point.x)" :y1="plotY(point.y)" :y2="plotY(point.y)" />
          </g>
          <line class="polar-radius" :x1="center" :y1="center" :x2="plotX(point.x)" :y2="plotY(point.y)" />
          <path v-if="angleArc" class="polar-angle-arc" :d="angleArc" />
          <g v-if="point.r > 0.5" class="polar-measure-labels" aria-hidden="true">
            <text :x="plotX(point.x / 2) - 16 * Math.sin(currentAngle)" :y="plotY(point.y / 2) - 16 * Math.cos(currentAngle)" text-anchor="middle">r</text>
            <text v-if="angleArc" :x="center + 52 * Math.cos(canonicalAngle / 2)" :y="center - 52 * Math.sin(canonicalAngle / 2) + 5" text-anchor="middle">θ</text>
          </g>
          <circle class="polar-point-focus" :cx="plotX(point.x)" :cy="plotY(point.y)" r="17" />
          <circle class="polar-point" :cx="plotX(point.x)" :cy="plotY(point.y)" r="8" />
          <text class="polar-point-label" :x="plotX(point.x) + 16" :y="plotY(point.y) - 15">P</text>
        </svg>
        <p class="polar-plot-hint">{{ mode === 'point' ? '拖动图中的点，反过来读出它的半径与方向。' : '细线是完整曲线，实线是 t 已经走过的部分。' }}</p>
      </div>

      <aside class="polar-readout" aria-label="同一点的两套坐标">
        <div v-if="mode === 'curve'" class="readout-block polar-curve-readout">
          <span class="readout-kicker">{{ curve.label }} · 半径由 t 决定</span>
          <MathFormula :tex="curve.tex" display />
          <MathFormula :tex="curveTex" display />
        </div>
        <div class="readout-block">
          <span class="readout-kicker">直角坐标 · 横向与纵向</span>
          <MathFormula :tex="cartesianTex" display />
        </div>
        <div class="readout-block">
          <span class="readout-kicker">极坐标 · 距离与方向</span>
          <MathFormula :tex="polarTex" display />
          <p v-if="point.theta === null" class="polar-origin-note">在原点，转角改变也不会移动这个点。</p>
        </div>
        <p class="polar-convention"><MathFormula tex="r>0,\quad0\le\theta<2\pi" /> 时，两套坐标一一对应；原点单独处理。</p>
        <p v-if="mode === 'curve' && curveId === 'spiral'" class="polar-convention">t 记录累计转角；θ 只记录当前方向。多转一圈，方向相同，半径不同。</p>
      </aside>
    </div>

    <div id="polar-result" class="demo-result" aria-live="polite"><p>{{ status }}</p></div>
  </section>
</template>
