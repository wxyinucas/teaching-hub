<script setup>
import { computed, inject, ref, watch } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import CircleExhaustionDemo from './CircleExhaustionDemo.vue'
import RiemannApproximationDemo from './RiemannApproximationDemo.vue'

const route = inject(routeLocationKey, null)
const router = inject(routerKey, null)
const normalizeScene = (value) => (value === 'riemann' ? 'riemann' : 'exhaustion')
const scene = ref(normalizeScene(route?.query?.scene))
const activeComponent = computed(() => (
  scene.value === 'riemann' ? RiemannApproximationDemo : CircleExhaustionDemo
))

watch(() => route?.query?.scene, (value) => {
  scene.value = normalizeScene(value)
})

function selectScene(value) {
  scene.value = normalizeScene(value)
  if (router && route) {
    router.replace({
      query: { ...route.query, scene: scene.value === 'riemann' ? 'riemann' : undefined },
    })
  }
}
</script>

<template>
  <section class="definite-integral-demo">
    <nav class="demo-scene-nav" aria-label="定积分概念演示">
      <button
        type="button"
        data-scene="exhaustion"
        :class="{ 'is-active': scene === 'exhaustion' }"
        :aria-current="scene === 'exhaustion' ? 'page' : undefined"
        @click="selectScene('exhaustion')"
      >1 · 割圆与上下夹逼</button>
      <button
        type="button"
        data-scene="riemann"
        :class="{ 'is-active': scene === 'riemann' }"
        :aria-current="scene === 'riemann' ? 'page' : undefined"
        @click="selectScene('riemann')"
      >2 · 曲边梯形与局部估计</button>
    </nav>

    <KeepAlive>
      <component :is="activeComponent" />
    </KeepAlive>
  </section>
</template>

<style scoped>
.definite-integral-demo {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(22px, 3vw, 38px);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
.demo-scene-nav { margin-top: -6px; margin-bottom: 24px; }
.definite-integral-demo :deep(.circle-exhaustion-demo),
.definite-integral-demo :deep(.riemann-approximation-demo) {
  max-width: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}
@media (max-width: 680px) {
  .definite-integral-demo { padding: 22px 16px; }
  .demo-scene-nav button { padding-inline: 8px; }
}
</style>
