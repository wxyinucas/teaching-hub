<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const radius = 2
const x = ref(1)
const center = { x: 260, y: 225 }
const unitsToPixels = 90
const plotRadius = radius * unitsToPixels
const baseY = center.y - plotRadius
const angleRadius = 28
const ticks = [-2, 0, 2]
const toPlotX = (value) => center.x + unitsToPixels * value
const format = (value) => Number(value.toFixed(3)).toString()

const y = computed(() => Math.sqrt(radius ** 2 - x.value ** 2))
const angle = computed(() => Math.asin(x.value / radius))
const signedLength = computed(() => radius * angle.value)
const point = computed(() => ({ x: toPlotX(x.value), y: center.y - unitsToPixels * y.value }))
const semicircle = `M ${toPlotX(-radius)} ${center.y} A ${plotRadius} ${plotRadius} 0 0 1 ${toPlotX(radius)} ${center.y}`

function arcFromTop(drawingRadius, endX, endY) {
  const sweep = x.value > 0 ? 1 : 0
  return `M ${center.x} ${center.y - drawingRadius} A ${drawingRadius} ${drawingRadius} 0 0 ${sweep} ${endX} ${endY}`
}

const highlightedArc = computed(() => arcFromTop(plotRadius, point.value.x, point.value.y))
const angleArc = computed(() => arcFromTop(
  angleRadius,
  center.x + angleRadius * x.value / radius,
  center.y - angleRadius * y.value / radius,
))
</script>

<template>
  <section class="arc-length-demo">
    <header>
      <h1>沿上半圆量弧长</h1>
      <p>在上半圆 <MathFormula tex="y=\sqrt{4-x^2}" /> 上拖动横坐标 <MathFormula tex="x" />，观察从基点 <MathFormula tex="M_0" /> 到动点 <MathFormula tex="M" /> 的弧段。</p>
    </header>

    <div class="demo-slider-control arc-length-control">
      <label for="arc-length-x-range">
        <span>移动横坐标</span>
        <output for="arc-length-x-range">x = {{ format(x) }}</output>
      </label>
      <input id="arc-length-x-range" v-model.number="x" type="range" :min="-radius" :max="radius" step="0.01"
        :aria-valuetext="'x = ' + format(x)" />
    </div>

    <figure class="arc-length-figure">
      <svg viewBox="0 0 520 265" role="img" aria-label="动点在上半圆上的位置，以及从基点到动点的弧段">
        <line class="arc-length-axis" x1="46" x2="474" :y1="center.y" :y2="center.y" />
        <text class="arc-length-tick" x="485" :y="center.y + 5">x</text>
        <text v-for="tick in ticks" :key="tick" class="arc-length-tick"
          :x="toPlotX(tick)" :y="center.y + 22" text-anchor="middle">{{ tick }}</text>

        <line class="arc-length-radius" :x1="center.x" :x2="center.x" :y1="center.y" :y2="baseY" />
        <template v-if="x !== 0">
          <line class="arc-length-radius" :x1="center.x" :x2="point.x" :y1="center.y" :y2="point.y" />
          <line class="arc-length-projection" :x1="point.x" :x2="point.x" :y1="point.y" :y2="center.y" />
          <path class="arc-length-angle" :d="angleArc" />
          <circle class="arc-length-projection-point" :cx="point.x" :cy="center.y" r="3" />
        </template>
        <circle class="arc-length-center" :cx="center.x" :cy="center.y" r="3" />
        <path class="arc-length-track" :d="semicircle" />
        <path v-if="x !== 0" class="arc-length-highlight" :d="highlightedArc" />
        <circle class="arc-length-base" :cx="center.x" :cy="baseY" r="5" />
        <text class="arc-length-label" :x="center.x" :y="baseY - 16" text-anchor="middle">{{ x === 0 ? 'M₀ = M' : 'M₀' }}</text>
        <template v-if="x !== 0">
          <circle class="arc-length-point" :cx="point.x" :cy="point.y" r="5" />
          <text class="arc-length-label" :x="point.x + (x < 0 ? -12 : 12)"
            :y="point.y < center.y - 32 ? point.y + 18 : point.y - 10"
            :text-anchor="x < 0 ? 'end' : 'start'">M</text>
        </template>
      </svg>
      <figcaption>从基点向右沿弧走记为正，向左记为负。</figcaption>
    </figure>

    <dl class="arc-length-readouts">
      <div><dt>圆心角 θ（弧度）</dt><dd>{{ format(angle) }}</dd></div>
      <div><dt>带符号弧长 s</dt><dd>{{ format(signedLength) }}</dd></div>
      <div><dt>实际弧长 |s|</dt><dd>{{ format(Math.abs(signedLength)) }}</dd></div>
    </dl>
    <p>半径为 2。从竖直半径向右转记为正，因此
      <MathFormula tex="x=2\sin\theta,\quad \theta=\arcsin(x/2),\quad s=2\theta" />。</p>
  </section>
</template>

<style scoped>
.arc-length-demo h1 { margin: 0 0 8px; font-size: clamp(24px, 3vw, 34px); }
.arc-length-demo p { margin: 0; color: var(--ink-muted); }
.arc-length-control { margin: 16px 0 10px; }
.arc-length-figure { margin: 0; border: 1px solid var(--border); border-radius: 8px; }
.arc-length-figure svg { display: block; width: 100%; height: clamp(180px, 36vh, 355px); }
.arc-length-figure path, .arc-length-figure line { fill: none; vector-effect: non-scaling-stroke; }
.arc-length-axis, .arc-length-radius { stroke: var(--ink-subtle); stroke-width: 1; }
.arc-length-radius { stroke-dasharray: 4 4; }
.arc-length-projection { stroke: var(--accent); stroke-width: 1; stroke-dasharray: 3 4; }
.arc-length-angle { stroke: var(--accent); stroke-width: 1.5; }
.arc-length-track { stroke: var(--ink-subtle); stroke-width: 2.5; }
.arc-length-highlight { stroke: var(--accent); stroke-width: 5; stroke-linecap: round; }
.arc-length-base, .arc-length-center { fill: var(--ink); }
.arc-length-point, .arc-length-projection-point { fill: var(--accent); }
.arc-length-label { fill: var(--ink); font-size: 16px; font-weight: 650; }
.arc-length-tick { fill: var(--ink-muted); font-size: 14px; }
.arc-length-figure figcaption { padding: 0 12px 10px; text-align: center; color: var(--ink-muted); }
.arc-length-readouts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 10px 0; }
.arc-length-readouts div { padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; }
.arc-length-readouts dt { font-size: 0.85em; color: var(--ink-muted); }
.arc-length-readouts dd { margin: 3px 0 0; font-weight: 650; font-variant-numeric: tabular-nums; }
@media (max-width: 520px) {
  .arc-length-label { font-size: 20px; }
  .arc-length-tick { font-size: 18px; }
  .arc-length-readouts div { padding-inline: 6px; }
}
</style>
