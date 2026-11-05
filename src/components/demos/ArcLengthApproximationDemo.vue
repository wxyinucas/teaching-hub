<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const radius = 2
const x0 = -1
const deltaX = ref(1)
const f = (x) => Math.sqrt(radius ** 2 - x ** 2)
const y0 = f(x0)
const slope = -x0 / y0
const format = (value) => value.toFixed(5)

const x = computed(() => x0 + deltaX.value)
const arcLength = computed(() => radius * (Math.asin(x.value / radius) - Math.asin(x0 / radius)))
const hypotenuse = computed(() => Math.hypot(deltaX.value, slope * deltaX.value))
const lengthError = computed(() => Math.abs(arcLength.value - hypotenuse.value))

const left = 64
const right = 376
const base = 226
const width = right - left
const scale = computed(() => width / deltaX.value)
const tangentY = base - width * slope
const trianglePoints = [left + ',' + base, right + ',' + base, right + ',' + tangentY].join(' ')
const arcY = computed(() => base - scale.value * (f(x.value) - y0))
const arcPath = computed(() => {
  const plotRadius = radius * scale.value
  return 'M ' + left + ' ' + base + ' A ' + plotRadius + ' ' + plotRadius + ' 0 0 1 ' + right + ' ' + arcY.value
})
</script>

<template>
  <section class="arc-length-approximation-demo">
    <header>
      <h1>用三角形的斜边估计弧长</h1>
      <p>从上半圆 <MathFormula tex="y=\sqrt{4-x^2}" /> 上的 <MathFormula tex="M_0" /> 向右走。三角形的斜边沿着 <MathFormula tex="M_0" /> 处的切线。</p>
    </header>

    <div class="demo-slider-control approximation-control">
      <label for="arc-length-approximation-delta-range">
        <span>从基点横向移动</span>
        <output for="arc-length-approximation-delta-range">dx = {{ deltaX.toFixed(2) }}</output>
      </label>
      <input id="arc-length-approximation-delta-range" v-model.number="deltaX" type="range" min="0.05" max="1" step="0.01"
        :aria-valuetext="'dx = ' + deltaX.toFixed(2)" />
    </div>

    <figure class="approximation-figure">
      <svg viewBox="0 0 520 265" role="img" aria-label="圆弧位于直角三角形内。横边长 dx，竖边长 f′(x₀) dx，斜边沿基点处的切线。">
        <polygon class="approximation-triangle" :points="trianglePoints" />
        <polyline class="approximation-leg" :points="trianglePoints" />
        <path class="approximation-leg" :d="'M ' + (right - 13) + ' ' + base + ' v -13 h 13'" />
        <line class="approximation-hypotenuse" :x1="left" :y1="base" :x2="right" :y2="tangentY" />
        <path class="approximation-arc" :d="arcPath" />
        <circle class="approximation-anchor" :cx="left" :cy="base" r="4" />
        <circle class="approximation-tangent-dot" :cx="right" :cy="tangentY" r="3.5" />
        <circle class="approximation-arc-dot" :cx="right" :cy="arcY" r="3.5" />
        <text :x="left - 9" :y="base + 5" text-anchor="end">M₀</text>
        <text class="approximation-tangent-label" :x="right + 9" :y="tangentY + 1">T</text>
        <text class="approximation-arc-label" :x="right - 9" :y="arcY + 20" text-anchor="end">M</text>
        <text :x="(left + right) / 2" :y="base + 26" text-anchor="middle">dx</text>
        <text :x="right + 12" :y="(base + tangentY) / 2" dominant-baseline="middle">f′(x₀) dx</text>
      </svg>
      <figcaption>横边保持同样的显示宽度，纵横等比缩放，方便看清圆弧怎样贴近斜边。</figcaption>
    </figure>

    <dl class="approximation-readouts">
      <div><dt class="approximation-arc-label">紫色圆弧长</dt><dd>{{ format(arcLength) }}</dd></div>
      <div><dt class="approximation-tangent-label">橙色斜边长 |ds|</dt><dd>{{ format(hypotenuse) }}</dd></div>
      <div><dt>两者的长度差</dt><dd>{{ format(lengthError) }}</dd></div>
      <div><dt>长度差 ÷ dx</dt><dd>{{ format(lengthError / deltaX) }}</dd></div>
    </dl>
    <p>把 <MathFormula tex="dx" /> 调小，看看长度差除以 <MathFormula tex="dx" /> 后是否也变小。</p>
  </section>
</template>

<style scoped>
.arc-length-approximation-demo { --tangent-color: light-dark(#a64e14, #f0a36d); }
.arc-length-approximation-demo h1 { margin: 0 0 8px; font-size: clamp(24px, 3vw, 34px); }
.arc-length-approximation-demo p { margin: 0; color: var(--ink-muted); }
.approximation-control { margin: 16px 0 8px; }
.approximation-figure { margin: 0; border: 1px solid var(--border); border-radius: 8px; }
.approximation-figure svg { display: block; width: 100%; height: auto; max-height: 320px; }
.approximation-figure line, .approximation-figure path, .approximation-figure polyline { fill: none; vector-effect: non-scaling-stroke; }
.approximation-figure text { fill: var(--ink); font-size: 18px; font-weight: 650; }
.approximation-figure figcaption { padding: 4px 12px 10px; color: var(--ink-muted); font-size: 0.9em; }
.approximation-triangle { fill: var(--accent); fill-opacity: 0.07; }
.approximation-leg { stroke: var(--ink-subtle); stroke-width: 1.5; }
.approximation-arc { stroke: var(--accent); stroke-width: 2.5; }
.approximation-hypotenuse { stroke: var(--tangent-color); stroke-width: 2; }
.approximation-arc-dot, .approximation-figure .approximation-arc-label { fill: var(--accent); }
.approximation-tangent-dot, .approximation-figure .approximation-tangent-label { fill: var(--tangent-color); }
.approximation-anchor { fill: var(--ink); }
.approximation-readouts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 10px 0; }
.approximation-readouts div { padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; }
.approximation-readouts dt { font-size: 0.85em; color: var(--ink-muted); }
.approximation-readouts .approximation-arc-label { color: var(--accent); }
.approximation-readouts .approximation-tangent-label { color: var(--tangent-color); }
.approximation-readouts dd { margin: 3px 0 0; font-weight: 650; font-variant-numeric: tabular-nums; }
@media (max-width: 560px) {
  .approximation-readouts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
