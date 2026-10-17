<script setup>
import { ref } from 'vue'
import DerivativeMicroscopeDemo from './DerivativeMicroscopeDemo.vue'
import InverseDerivativeDemo from './InverseDerivativeDemo.vue'
import ParametricDerivativeDemo from './ParametricDerivativeDemo.vue'
import PolarCoordinatesDemo from './PolarCoordinatesDemo.vue'

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
      <button
        type="button"
        :class="{ 'is-active': scene === 3 }"
        :aria-current="scene === 3 ? 'page' : undefined"
        @click="scene = 3"
      >3 · 反函数与斜率</button>
      <button
        type="button"
        :class="{ 'is-active': scene === 4 }"
        :aria-current="scene === 4 ? 'page' : undefined"
        @click="scene = 4"
      >4 · 极坐标与曲线</button>
    </nav>

    <DerivativeMicroscopeDemo v-if="scene === 1" />
    <ParametricDerivativeDemo v-else-if="scene === 2" />
    <InverseDerivativeDemo v-else-if="scene === 3" />
    <PolarCoordinatesDemo v-else />
  </section>
</template>
