<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { findCourse } from './lib/catalog.js'

const route = useRoute()
const content = ref(null)
const activeCourse = computed(() => (
  route.params.termId && route.params.courseId
    ? findCourse(route.params.termId, route.params.courseId)?.course
    : null
))
const organizationNote = computed(() => (
  activeCourse.value
    ? `2026 秋 · ${activeCourse.value.organization === 'topics' ? '按专题准备' : '按周准备'}`
    : '2026 秋 · 课程准备'
))

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
  <div class="site-shell" :class="{ 'is-slide-route': ['slides', 'topic-slides'].includes(route.name) }">
    <header class="site-header">
      <RouterLink to="/" class="identity" aria-label="Teaching Hub 首页">
        <span class="identity-mark" aria-hidden="true">TH</span>
        <span><strong>Teaching Hub</strong><small>课程台本与课件</small></span>
      </RouterLink>
      <nav class="site-nav" aria-label="主导航">
        <RouterLink to="/">课程</RouterLink>
      </nav>
      <span class="site-note">{{ organizationNote }}</span>
    </header>
    <main id="page-content" ref="content" class="site-main" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>
