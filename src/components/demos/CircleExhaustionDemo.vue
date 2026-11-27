<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'
import { CIRCLE_SIDE_COUNTS, unitCircleApproximation } from '../../lib/definiteIntegral.js'

const level = ref(2)
const sides = computed(() => CIRCLE_SIDE_COUNTS[level.value])
const approximation = computed(() => unitCircleApproximation(sides.value))
const gap = computed(() => approximation.value.outer - approximation.value.inner)

const chart = {
  width: 760,
  height: 560,
  centerX: 380,
  centerY: 280,
  radius: 180,
}

function polygonPoints(count, radius, offset) {
  return Array.from({ length: count }, (_, index) => {
    const angle = offset + (index * 2 * Math.PI) / count
    return [
      chart.centerX + radius * Math.cos(angle),
      chart.centerY + radius * Math.sin(angle),
    ].map((value) => value.toFixed(2)).join(',')
  }).join(' ')
}

const innerPoints = computed(() => polygonPoints(
  sides.value,
  chart.radius,
  -Math.PI / 2,
))
const outerPoints = computed(() => polygonPoints(
  sides.value,
  chart.radius / Math.cos(Math.PI / sides.value),
  -Math.PI / 2 + Math.PI / sides.value,
))

function format(value) {
  return value.toFixed(6)
}
</script>

<template>
  <section class="circle-exhaustion-demo">
    <header class="integral-demo-heading">
      <p>先不计算圆面积，只看怎样把它夹住</p>
      <h1>有限多边形怎样逼出一个精确面积</h1>
      <span>内接多边形给出下估计，外切多边形给出上估计；真正重要的是两者之间的缝隙消失。</span>
    </header>

    <div class="circle-control">
      <label for="circle-side-level">
        <span>逐级加细</span>
        <output for="circle-side-level">{{ sides }} 边</output>
      </label>
      <input
        id="circle-side-level"
        v-model.number="level"
        type="range"
        min="0"
        :max="CIRCLE_SIDE_COUNTS.length - 1"
        step="1"
        :aria-valuetext="`${sides} 边`"
      >
      <div class="circle-levels" aria-hidden="true">
        <span v-for="count in CIRCLE_SIDE_COUNTS" :key="count">{{ count }}</span>
      </div>
    </div>

    <div class="circle-plot">
      <svg
        :viewBox="`0 0 ${chart.width} ${chart.height}`"
        role="img"
        aria-labelledby="circle-exhaustion-title circle-exhaustion-description"
        :data-sides="sides"
      >
        <title id="circle-exhaustion-title">单位圆的内接与外切正多边形</title>
        <desc id="circle-exhaustion-description">
          当前使用 {{ sides }} 边形。内接面积 {{ format(approximation.inner) }}，圆面积 π，外切面积 {{ format(approximation.outer) }}。
        </desc>
        <polygon class="circle-outer-polygon" :points="outerPoints" />
        <circle
          class="circle-target"
          :cx="chart.centerX"
          :cy="chart.centerY"
          :r="chart.radius"
        />
        <polygon class="circle-inner-polygon" :points="innerPoints" />
        <circle class="circle-center" :cx="chart.centerX" :cy="chart.centerY" r="4" />
      </svg>
    </div>

    <div class="circle-legend" aria-label="图例">
      <span><i class="circle-key is-inner"></i>内接正 {{ sides }} 边形</span>
      <span><i class="circle-key is-target"></i>单位圆</span>
      <span><i class="circle-key is-outer"></i>外切正 {{ sides }} 边形</span>
    </div>

    <div class="circle-readouts tabular-nums" aria-live="polite">
      <div><span>下估计</span><strong data-circle-value="inner">{{ format(approximation.inner) }}</strong></div>
      <div><span>目标</span><strong data-circle-value="target">π</strong></div>
      <div><span>上估计</span><strong data-circle-value="outer">{{ format(approximation.outer) }}</strong></div>
    </div>

    <div class="circle-conclusion" aria-live="polite">
      <MathFormula tex="A_{\text{内}}\leq \pi\leq A_{\text{外}}" display />
      <p>当前上下估计相差 <strong data-circle-gap>{{ format(gap) }}</strong>。继续细分时，我们关注的是这道缝隙，而不只是边数。</p>
    </div>
  </section>
</template>

<style scoped>
.circle-exhaustion-demo { color: var(--ink); }
.integral-demo-heading { max-width: 860px; }
.integral-demo-heading p { margin: 0 0 7px; color: var(--purple); font-size: 14px; font-weight: 650; }
.integral-demo-heading h1 { margin: 0; font-size: clamp(27px, 4vw, 42px); line-height: 1.25; letter-spacing: -.025em; }
.integral-demo-heading span { display: block; margin-top: 10px; color: var(--ink-muted); font-size: 14px; line-height: 1.75; }
.circle-control { margin: 26px 0 10px; padding-block: 15px; border-block: 1px solid var(--border); }
.circle-control label { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 7px; color: var(--ink-muted); font-size: 13px; font-weight: 650; }
.circle-control output { color: var(--purple-dark); font-size: 18px; font-variant-numeric: tabular-nums; }
.circle-control input { width: 100%; min-height: 36px; margin: 0; accent-color: var(--purple); }
.circle-levels { display: flex; justify-content: space-between; color: var(--ink-subtle); font-size: 11px; font-variant-numeric: tabular-nums; }
.circle-plot { max-width: 760px; margin: 0 auto; }
.circle-plot svg { display: block; width: 100%; height: auto; }
.circle-outer-polygon { fill: var(--surface-muted); stroke: var(--ink-subtle); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
.circle-target { fill: var(--surface); stroke: var(--ink); stroke-width: 2.5; vector-effect: non-scaling-stroke; }
.circle-inner-polygon { fill: var(--purple-light); fill-opacity: .88; stroke: var(--purple); stroke-width: 2; vector-effect: non-scaling-stroke; }
.circle-center { fill: var(--purple-dark); }
.circle-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 24px; margin: -2px 0 18px; color: var(--ink-muted); font-size: 12px; }
.circle-legend span { display: inline-flex; align-items: center; gap: 7px; }
.circle-key { width: 25px; height: 9px; }
.circle-key.is-inner { background: var(--purple-light); border-block: 2px solid var(--purple); }
.circle-key.is-target { background: var(--surface); border-block: 2px solid var(--ink); }
.circle-key.is-outer { background: var(--surface-muted); border-block: 2px solid var(--ink-subtle); }
.circle-readouts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-block: 1px solid var(--border); }
.circle-readouts > div { min-width: 0; padding: 12px 16px; }
.circle-readouts > div + div { border-left: 1px solid var(--border); }
.circle-readouts span { display: block; margin-bottom: 3px; color: var(--ink-muted); font-size: 11px; }
.circle-readouts strong { color: var(--purple-dark); font-size: clamp(17px, 2.5vw, 24px); font-weight: 650; }
.circle-conclusion { display: grid; grid-template-columns: minmax(250px, .7fr) minmax(0, 1.3fr); gap: 22px; align-items: center; margin-top: 18px; }
.circle-conclusion :deep(.katex-display) { margin: 0; text-align: left; }
.circle-conclusion p { margin: 0; color: var(--ink-muted); font-size: 14px; line-height: 1.75; }
.circle-conclusion strong { color: var(--purple-dark); font-variant-numeric: tabular-nums; }
@media (max-width: 680px) {
  .circle-readouts { grid-template-columns: 1fr; }
  .circle-readouts > div + div { border-top: 1px solid var(--border); border-left: 0; }
  .circle-conclusion { grid-template-columns: 1fr; }
}
</style>
