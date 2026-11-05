<script setup>
import { computed, inject, ref, watch } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import MonotonicityDemo from './MonotonicityDemo.vue'
import ConcavityDemo from './ConcavityDemo.vue'
import CurvatureDemo from './CurvatureDemo.vue'
import ArcLengthDemo from './ArcLengthDemo.vue'
import ArcLengthApproximationDemo from './ArcLengthApproximationDemo.vue'

const route = inject(routeLocationKey, null)
const router = inject(routerKey, null)
const scenes = [
  { id: 'monotonicity', label: '单调性与极值', component: MonotonicityDemo },
  { id: 'concavity', label: '凹凸与拐点', component: ConcavityDemo },
  { id: 'curvature', label: '从直线到圆', component: CurvatureDemo },
  { id: 'arc-length', label: '弧长', component: ArcLengthDemo },
  { id: 'arc-length-approximation', label: '弧长近似', component: ArcLengthApproximationDemo },
]
const defaultScene = scenes[0].id
const findScene = (id) => scenes.find((entry) => entry.id === id) ?? scenes[0]
const scene = ref(findScene(route?.query?.scene).id)
const component = computed(() => findScene(scene.value).component)

watch(() => route?.query?.scene, (value) => {
  scene.value = findScene(value).id
})

function selectScene(value) {
  scene.value = value
  if (router && route) {
    router.replace({ query: { ...route.query, scene: value === defaultScene ? undefined : value } })
  }
}
</script>

<template>
  <section class="derivative-applications-demo">
    <nav class="demo-scene-nav" aria-label="本专题演示">
      <button
        v-for="(entry, index) in scenes"
        :key="entry.id"
        type="button"
        :data-scene="entry.id"
        :class="{ 'is-active': scene === entry.id }"
        :aria-current="scene === entry.id ? 'page' : undefined"
        @click="selectScene(entry.id)"
      >{{ index + 1 }} · {{ entry.label }}</button>
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
.derivative-applications-demo :deep(.concavity-demo),
.derivative-applications-demo :deep(.curvature-demo) {
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
