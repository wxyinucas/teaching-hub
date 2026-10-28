<script setup>
import { inject, ref, watch } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import MeanValueDemo from './MeanValueDemo.vue'
import TaylorApproximationDemo from './TaylorApproximationDemo.vue'

const route = inject(routeLocationKey, null)
const router = inject(routerKey, null)
const scene = ref(route?.query?.scene === 'taylor' ? 'taylor' : 'motion')

watch(() => route?.query?.scene, (value) => {
  scene.value = value === 'taylor' ? 'taylor' : 'motion'
})

function selectScene(value) {
  scene.value = value
  if (router && route) {
    router.replace({
      query: { ...route.query, scene: value === 'taylor' ? 'taylor' : undefined },
    })
  }
}
</script>

<template>
  <section class="mvt-taylor-demo">
    <nav class="demo-scene-nav" aria-label="本专题演示">
      <button
        type="button"
        data-scene="motion"
        :class="{ 'is-active': scene === 'motion' }"
        :aria-current="scene === 'motion' ? 'page' : undefined"
        @click="selectScene('motion')"
      >1 · 区间测速与中值定理</button>
      <button
        type="button"
        data-scene="taylor"
        :class="{ 'is-active': scene === 'taylor' }"
        :aria-current="scene === 'taylor' ? 'page' : undefined"
        @click="selectScene('taylor')"
      >2 · 泰勒近似与误差</button>
    </nav>

    <MeanValueDemo v-if="scene === 'motion'" />
    <TaylorApproximationDemo v-else />
  </section>
</template>

<style scoped>
.mvt-taylor-demo {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(22px, 3vw, 38px);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
.demo-scene-nav { margin-top: -6px; margin-bottom: 24px; }
.mvt-taylor-demo :deep(.mean-value-demo),
.mvt-taylor-demo :deep(.taylor-approximation-demo) {
  max-width: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}
@media (max-width: 680px) {
  .mvt-taylor-demo { padding: 22px 16px; }
  .demo-scene-nav button { padding-inline: 8px; }
}
</style>
