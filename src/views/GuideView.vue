<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { findWeek, loadContent } from '../lib/catalog.js'
import SegmentNotes from '../components/runbook/SegmentNotes.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String })
const context = computed(() => findWeek(props.termId, props.courseId, props.weekId))
const sourcePath = computed(() => context.value?.week.resources.guide)
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
  document.title = `${context.value.week.label} · 学生指南 · Teaching Hub`
  try {
    const text = await loadContent(path)
    if (active) source.value = text
  } catch (cause) {
    if (active) {
      error.value = cause.message
      document.title = '学生指南暂时无法读取 · Teaching Hub'
    }
  } finally {
    if (active) loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <div v-if="context" class="guide-page">
    <nav class="breadcrumbs" aria-label="当前位置">
      <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
      <span>{{ context.week.label }}</span><span aria-hidden="true">/</span><span aria-current="page">学生指南</span>
    </nav>
    <nav class="resource-tabs" aria-label="本周材料">
      <RouterLink v-if="context.week.resources.runbook" :to="{ name: 'runbook', params: { termId, courseId, weekId } }">台本</RouterLink>
      <RouterLink v-if="context.week.resources.slides" :to="{ name: 'slides', params: { termId, courseId, weekId, page: 1 } }">Slides</RouterLink>
      <RouterLink :to="{ name: 'guide', params: { termId, courseId, weekId } }">学生指南</RouterLink>
    </nav>
    <p v-if="loading" class="reader-loading" role="status">正在打开学生指南…</p>
    <section v-else-if="error" class="error-state" role="alert"><h1>学生指南暂时无法读取</h1><p>{{ error }}</p></section>
    <article v-else-if="source !== null" class="guide-reader">
      <SegmentNotes :source="source" />
    </article>
  </div>
  <NotFoundView v-else />
</template>
