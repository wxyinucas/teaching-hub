<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { findWeek } from '../lib/catalog.js'
import SequenceLimitDemo from '../components/demos/SequenceLimitDemo.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({
  termId: String,
  courseId: String,
  weekId: String,
  demoId: String,
})

const demoComponents = {
  'sequence-limit': SequenceLimitDemo,
}

const context = computed(() => findWeek(props.termId, props.courseId, props.weekId))
const declaration = computed(() => (
  context.value?.week.demos?.find((demo) => demo.id === props.demoId) ?? null
))
const demoComponent = computed(() => declaration.value && demoComponents[props.demoId])
const reader = ref(null)
const fullscreenSupported = ref(false)
const isFullscreen = ref(false)
const fullscreenFeedback = ref('')

function syncFullscreen() {
  isFullscreen.value = document.fullscreenElement === reader.value
}

async function toggleFullscreen() {
  fullscreenFeedback.value = ''
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await reader.value.requestFullscreen()
  } catch {
    fullscreenFeedback.value = '浏览器未允许进入全屏，请使用浏览器菜单重试。'
  }
}

onMounted(() => {
  fullscreenSupported.value = Boolean(reader.value?.requestFullscreen && document.exitFullscreen)
  syncFullscreen()
  document.addEventListener('fullscreenchange', syncFullscreen)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreen)
})

watchEffect(() => {
  document.title = demoComponent.value
    ? `${declaration.value.title} · ${context.value.week.label} · Teaching Hub`
    : '未找到演示 · Teaching Hub'
})
</script>

<template>
  <div v-if="context && declaration && demoComponent" class="demo-page">
    <nav class="breadcrumbs" aria-label="当前位置">
      <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
      <span>{{ context.week.label }}</span><span aria-hidden="true">/</span><span aria-current="page">{{ declaration.title }}</span>
    </nav>
    <section ref="reader" class="demo-reader" :aria-label="`${declaration.title}演示`">
      <div v-if="fullscreenSupported" class="demo-reader-toolbar">
        <button
          class="demo-fullscreen"
          type="button"
          :aria-pressed="isFullscreen"
          @click="toggleFullscreen"
        >{{ isFullscreen ? '退出全屏' : '全屏' }}</button>
        <span class="sr-only" role="status" aria-live="polite">{{ fullscreenFeedback }}</span>
      </div>
      <component :is="demoComponent" />
    </section>
  </div>
  <NotFoundView v-else />
</template>
