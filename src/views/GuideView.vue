<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { findTopic, findWeek, loadContent } from '../lib/catalog.js'
import SegmentNotes from '../components/runbook/SegmentNotes.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String, topicId: String })
const isTopic = computed(() => Boolean(props.topicId))
const context = computed(() => (
  isTopic.value
    ? findTopic(props.termId, props.courseId, props.topicId)
    : findWeek(props.termId, props.courseId, props.weekId)
))
const unit = computed(() => context.value?.[isTopic.value ? 'topic' : 'week'])
const sourcePath = computed(() => unit.value?.resources.guide)
const source = ref(null)
const loading = ref(false)
const error = ref('')

function resourceLocation(kind, extraParams = {}) {
  return {
    name: `${isTopic.value ? 'topic-' : ''}${kind}`,
    params: {
      termId: props.termId,
      courseId: props.courseId,
      [isTopic.value ? 'topicId' : 'weekId']: isTopic.value ? props.topicId : props.weekId,
      ...extraParams,
    },
  }
}

watch(sourcePath, async (path, _previous, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  source.value = null
  error.value = ''
  if (!path) return
  loading.value = true
  document.title = `${unit.value.label} · 学生指南 · Teaching Hub`
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
  <div v-if="context && sourcePath" class="guide-page">
    <nav class="breadcrumbs" aria-label="当前位置">
      <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
      <span>{{ unit.label }}</span><span aria-hidden="true">/</span><span aria-current="page">学生指南</span>
    </nav>
    <nav class="resource-tabs" :aria-label="isTopic ? '本专题材料' : '本周材料'">
      <RouterLink v-if="unit.resources.runbook" :to="resourceLocation('runbook')">台本</RouterLink>
      <RouterLink v-if="unit.resources.slides" :to="resourceLocation('slides', { page: 1 })">Slides</RouterLink>
      <RouterLink :to="resourceLocation('guide')">学生指南</RouterLink>
      <RouterLink v-if="isTopic && unit.resources.exams" :to="resourceLocation('exams')">真题</RouterLink>
    </nav>
    <p v-if="loading" class="reader-loading" role="status">正在打开学生指南…</p>
    <section v-else-if="error" class="error-state" role="alert"><h1>学生指南暂时无法读取</h1><p>{{ error }}</p></section>
    <article v-else-if="source !== null" class="guide-reader">
      <SegmentNotes :source="source" />
    </article>
  </div>
  <NotFoundView v-else />
</template>
