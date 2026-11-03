<script setup>
import { computed, ref } from 'vue'
import MathFormula from '../MathFormula.vue'

const degrees = ref(0)
const length = 1
const drawingLength = 440
const origin = { x: 150, y: 370, angle: 0 }
const radians = computed(() => degrees.value * Math.PI / 180)
const curvature = computed(() => radians.value / length)
const closed = computed(() => degrees.value === 360)
const format = (value) => Number(value.toFixed(3)).toString()
const presets = [
  { value: 0, label: '直线' },
  { value: 90, label: '四分之一圈' },
  { value: 180, label: '半圆' },
  { value: 360, label: '整圆' },
]

// Keep the starting point and heading fixed as the strip bends.
function pointAt(fraction) {
  const turn = radians.value
  if (turn === 0) return { ...origin, x: origin.x + drawingLength * fraction }
  const angle = turn * fraction
  const radius = drawingLength / turn
  return {
    x: origin.x + radius * Math.sin(angle),
    y: origin.y - 2 * radius * Math.sin(angle / 2) ** 2,
    angle,
  }
}

const end = computed(() => closed.value ? { ...origin, angle: radians.value } : pointAt(1))
const path = computed(() => {
  const last = end.value
  const move = 'M ' + origin.x + ' ' + origin.y
  if (radians.value === 0) return move + ' L ' + last.x + ' ' + last.y
  const radius = drawingLength / radians.value
  const middle = pointAt(0.5)
  // Two arcs also describe the full circle when the endpoints coincide.
  return move
    + ' A ' + radius + ' ' + radius + ' 0 0 0 ' + middle.x + ' ' + middle.y
    + ' A ' + radius + ' ' + radius + ' 0 0 0 ' + last.x + ' ' + last.y
})

const tangents = computed(() => (closed.value
  ? [{ id: 'joined', point: origin }]
  : [{ id: 'start', point: origin }, { id: 'end', point: end.value }]
).map(({ id, point }) => ({
  id,
  transform: 'translate(' + point.x + ' ' + point.y + ') rotate(' + (-point.angle * 180 / Math.PI) + ')',
})))
</script>

<template>
  <section class="curvature-demo">
    <header>
      <h1>把一段直线弯成圆</h1>
      <p>这段线始终长 1 个单位，起点和初始方向固定。拖动滑块，观察终点怎样移动。</p>
    </header>

    <div class="curvature-controls">
      <label for="curvature-turn">累计转角 <strong>{{ degrees }}°</strong></label>
      <input id="curvature-turn" v-model.number="degrees" type="range" min="0" max="360" step="1"
        :aria-valuetext="degrees + ' 度'" />
      <div class="demo-scene-nav curvature-presets" aria-label="常用转角">
        <button v-for="preset in presets" :key="preset.value" type="button"
          :aria-pressed="degrees === preset.value" :class="{ 'is-active': degrees === preset.value }"
          @click="degrees = preset.value">{{ preset.label }}</button>
      </div>
    </div>

    <figure class="curvature-figure">
      <svg viewBox="0 0 680 410" role="img" aria-label="起点固定的定长曲线与首尾两处的前进方向">
        <path :d="path" class="curvature-strip" vector-effect="non-scaling-stroke" />
        <g v-for="tangent in tangents" :key="tangent.id" :transform="tangent.transform"
          :class="'curvature-tangent-' + tangent.id">
          <path d="M -24 0 H 44 M 34 -7 L 44 0 L 34 7" vector-effect="non-scaling-stroke" />
          <circle r="5" />
        </g>
      </svg>
      <figcaption v-if="closed">首尾相接，两处切线方向重合。沿圆走完全程，累计转角是 360°。</figcaption>
      <figcaption v-else><span class="curvature-start-key">起点箭头</span>和<span class="curvature-end-key">终点箭头</span>标出沿曲线前进的方向。</figcaption>
    </figure>

    <dl class="curvature-readouts">
      <div><dt>固定弧长</dt><dd>{{ length }}</dd></div>
      <div><dt>累计转角</dt><dd>{{ format(radians) }} <small>弧度</small></dd></div>
      <div><dt>曲率</dt><dd>{{ format(curvature) }} <small>弧度 / 单位长度</small></dd></div>
    </dl>
    <p class="curvature-relation">这段线均匀弯曲，所以任一点的曲率都是
      <MathFormula tex="K=\dfrac{\text{累计转角（弧度）}}{\text{弧长}}" />。</p>
  </section>
</template>

<style scoped>
.curvature-demo h1 { margin: 0 0 8px; font-size: clamp(24px, 3vw, 34px); }
.curvature-demo p { margin: 0; color: var(--muted); }
.curvature-controls { display: grid; gap: 8px; margin: 16px 0 10px; }
.curvature-controls label { font-weight: 600; }
.curvature-controls label strong { margin-left: 8px; font-variant-numeric: tabular-nums; }
.curvature-controls input { width: 100%; margin: 0; }
.curvature-presets { margin: 0; }
.curvature-figure {
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.curvature-figure svg { display: block; width: 100%; height: clamp(165px, 34vh, 345px); }
.curvature-strip { fill: none; stroke: #0789ad; stroke-width: 4; stroke-linecap: round; }
.curvature-tangent-start, .curvature-start-key { color: #bb6221; }
.curvature-tangent-end, .curvature-end-key, .curvature-tangent-joined { color: #9262dc; }
.curvature-figure g path { fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.curvature-figure circle { fill: currentColor; }
.curvature-figure figcaption { padding: 0 12px 10px; text-align: center; }
.curvature-readouts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 10px 0; }
.curvature-readouts div { padding: 8px 10px; border: 1px solid var(--border); border-radius: 6px; }
.curvature-readouts dt { font-size: 0.85em; color: var(--muted); }
.curvature-readouts dd { margin: 3px 0 0; font-weight: 650; font-variant-numeric: tabular-nums; }
.curvature-readouts small { font-weight: 400; }
</style>
