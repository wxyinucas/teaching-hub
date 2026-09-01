<script setup>
import { watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
watchEffect(() => { document.title = '未找到页面 · Teaching Hub' })
</script>

<template>
  <section class="error-state" role="alert">
    <p class="eyebrow">Teaching Hub</p>
    <h1>未找到课程或材料</h1>
    <p>这个地址没有对应的学期、课程、教学周或资源。</p>
    <RouterLink to="/">返回课程目录</RouterLink>
  </section>
</template>
