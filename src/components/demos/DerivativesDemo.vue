<script setup>
import { ref } from 'vue'
import DerivativeMicroscopeDemo from './DerivativeMicroscopeDemo.vue'
import ParametricDerivativeDemo from './ParametricDerivativeDemo.vue'

const scene = ref(1)
</script>

<template>
  <section class="derivatives-demo">
    <nav class="demo-scene-nav" aria-label="演示页面">
      <button
        type="button"
        :class="{ 'is-active': scene === 1 }"
        :aria-current="scene === 1 ? 'page' : undefined"
        @click="scene = 1"
      >1 · 局部变化显微镜</button>
      <button
        type="button"
        :class="{ 'is-active': scene === 2 }"
        :aria-current="scene === 2 ? 'page' : undefined"
        @click="scene = 2"
      >2 · 参数曲线的斜率</button>
    </nav>

    <DerivativeMicroscopeDemo v-if="scene === 1" />
    <ParametricDerivativeDemo v-else />
  </section>
</template>
