<script setup>
import { computed, inject, ref, watch } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import MonotonicityDemo from './MonotonicityDemo.vue'
import ConcavityDemo from './ConcavityDemo.vue'

const route = inject(routeLocationKey, null)
const router = inject(routerKey, null)
const scene = ref(route?.query?.scene === 'concavity' ? 'concavity' : 'monotonicity')
const component = computed(() => scene.value === 'concavity' ? ConcavityDemo : MonotonicityDemo)

watch(() => route?.query?.scene, (value) => {
  scene.value = value === 'concavity' ? 'concavity' : 'monotonicity'
})

function selectScene(value) {
  scene.value = value
  if (router && route) {
    router.replace({ query: { ...route.query, scene: value === 'concavity' ? value : undefined } })
  }
}
</script>

<template>
  <section class="derivative-applications-demo">
    <nav class="demo-scene-nav" aria-label="本专题演示">
      <button
        type="button"
        data-scene="monotonicity"
        :class="{ 'is-active': scene === 'monotonicity' }"
        :aria-current="scene === 'monotonicity' ? 'page' : undefined"
        @click="selectScene('monotonicity')"
      >1 · 单调性与极值</button>
      <button
        type="button"
        data-scene="concavity"
        :class="{ 'is-active': scene === 'concavity' }"
        :aria-current="scene === 'concavity' ? 'page' : undefined"
        @click="selectScene('concavity')"
      >2 · 凹凸与拐点</button>
    </nav>
    <KeepAlive>
      <component :is="component" />
    </KeepAlive>
  </section>
</template>

<style scoped>
.derivative-applications-demo {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(20px, 2.4vw, 30px);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
.demo-scene-nav { margin: -6px 0 19px; }
.derivative-applications-demo :deep(.monotonicity-demo),
.derivative-applications-demo :deep(.concavity-demo) {
  max-width: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}
@media (max-width: 680px) {
  .derivative-applications-demo { padding: 20px 14px; }
  .demo-scene-nav button { padding-inline: 8px; }
}
</style>
