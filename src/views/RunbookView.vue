<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { findWeek, loadContent } from '../lib/catalog.js'
import RunbookReader from '../components/runbook/RunbookReader.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String })
const context = computed(() => findWeek(props.termId, props.courseId, props.weekId))
const sourcePath = computed(() => context.value?.week.resources.runbook)
const source = ref(null)
const loading = ref(false)
const error = ref('')

watch(sourcePath, async (path, _previous, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  source.value = null
  error.value = ''
  if (!path) return
  loading.value = true
  document.title = `${context.value.week.label} · 台本 · Teaching Hub`
  try {
    const text = await loadContent(path)
    if (active) source.value = text
  } catch (cause) {
    if (active) {
      error.value = cause.message
      document.title = '台本暂时无法读取 · Teaching Hub'
    }
  } finally {
    if (active) loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <div v-if="context">
    <nav class="breadcrumbs" aria-label="当前位置">
      <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
      <span>{{ context.week.label }}</span><span aria-hidden="true">/</span><span aria-current="page">台本</span>
    </nav>
    <nav class="resource-tabs" aria-label="本周材料">
      <RouterLink :to="{ name: 'runbook', params: { termId, courseId, weekId } }">台本</RouterLink>
      <RouterLink v-if="context.week.resources.slides" :to="{ name: 'slides', params: { termId, courseId, weekId, page: 1 } }">Slides</RouterLink>
    </nav>
    <p v-if="loading" class="reader-loading" role="status">正在打开台本…</p>
    <section v-else-if="error" class="error-state" role="alert"><h1>台本暂时无法读取</h1><p>{{ error }}</p></section>
    <RunbookReader v-else-if="source !== null" :source="source" :file="sourcePath" />
  </div>
  <NotFoundView v-else />
</template>
