<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { findCourse, findMaterialResource } from './lib/catalog.js'
import {
  applyTheme,
  getInitialTheme,
  listenForSystemTheme,
  readStoredTheme,
  storeTheme,
} from './lib/theme.js'

const route = useRoute()
const content = ref(null)
const theme = ref(getInitialTheme())
let stopSystemTheme = () => {}
const activeCourse = computed(() => (
  route.params.termId && route.params.courseId
    ? findCourse(route.params.termId, route.params.courseId)?.course
    : null
))
const organizationNote = computed(() => (
  activeCourse.value
    ? `2026 秋 · ${activeCourse.value.organization === 'materials' ? '按材料学习' : activeCourse.value.organization === 'topics' ? '按专题准备' : '按周准备'}`
    : '2026 秋 · 课程准备'
))
const isSlideRoute = computed(() => ['slides', 'topic-slides'].includes(route.name)
  || (route.name === 'material-resource' && findMaterialResource(
    route.params.termId, route.params.courseId, route.params.authorId, route.params.materialId, route.params.resourceId,
  )?.resource.renderer === 'slides'))

function focusContent() {
  content.value?.focus({ preventScroll: true })
}

function skipToContent() {
  focusContent()
  content.value?.scrollIntoView?.({ block: 'start' })
}

function toggleTheme() {
  stopSystemTheme()
  stopSystemTheme = () => {}
  const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
  theme.value = applyTheme(nextTheme)
  storeTheme(theme.value)
}

onMounted(() => {
  theme.value = applyTheme(theme.value)
  if (!readStoredTheme()) {
    stopSystemTheme = listenForSystemTheme((nextTheme) => {
      theme.value = applyTheme(nextTheme)
    })
  }
})

onBeforeUnmount(() => stopSystemTheme())

watch(() => route.path, async () => {
  await nextTick()
  focusContent()
})
</script>

<template>
  <a class="skip-link" href="#page-content" @click.prevent="skipToContent">跳到主要内容</a>
  <div class="site-shell" :class="{ 'is-slide-route': isSlideRoute }">
    <header class="site-header">
      <RouterLink to="/" class="identity" aria-label="Teaching Hub 首页">
        <span class="identity-mark" aria-hidden="true">TH</span>
        <span><strong>Teaching Hub</strong><small>课程台本与课件</small></span>
      </RouterLink>
      <nav class="site-nav" aria-label="主导航">
        <RouterLink to="/">课程</RouterLink>
      </nav>
      <span class="site-note">{{ organizationNote }}</span>
      <button
        class="theme-toggle"
        type="button"
        :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
        :aria-pressed="theme === 'dark'"
        @click="toggleTheme"
      >
        <span class="theme-toggle-symbol" aria-hidden="true"></span>
        <span>{{ theme === 'dark' ? '浅色' : '深色' }}</span>
      </button>
    </header>
    <main id="page-content" ref="content" class="site-main" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>
