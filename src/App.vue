<script setup>
import { nextTick, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const content = ref(null)

function focusContent() {
  content.value?.focus({ preventScroll: true })
}

function skipToContent() {
  focusContent()
  content.value?.scrollIntoView?.({ block: 'start' })
}

watch(() => route.path, async () => {
  await nextTick()
  focusContent()
})
</script>

<template>
  <a class="skip-link" href="#page-content" @click.prevent="skipToContent">跳到主要内容</a>
  <div class="site-shell" :class="{ 'is-slide-route': route.name === 'slides' }">
    <header class="site-header">
      <RouterLink to="/" class="identity" aria-label="Teaching Hub 首页">
        <span class="identity-mark" aria-hidden="true">TH</span>
        <span><strong>Teaching Hub</strong><small>课程台本与课件</small></span>
      </RouterLink>
      <nav class="site-nav" aria-label="主导航">
        <RouterLink to="/">课程</RouterLink>
      </nav>
      <span class="site-note">2026 秋 · 按周准备</span>
    </header>
    <main id="page-content" ref="content" class="site-main" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>
