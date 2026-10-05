<script setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { loadContent } from '../lib/catalog.js'
import { useResourceContext } from '../lib/useResourceContext.js'
import RunbookReader from '../components/runbook/RunbookReader.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String, topicId: String, authorId: String, materialId: String, resourceId: String, page: String })
const { isMaterial, context, unit, sourcePath, resourceTitle, unitLabel, materialsLabel, tabs, tabLocation } = useResourceContext(props, 'runbook')
const source = ref(null)
const loading = ref(false)
const error = ref('')

watch([sourcePath, resourceTitle], async ([path], _previous, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  source.value = null
  error.value = ''
  if (!path) return
  loading.value = true
  document.title = `${unitLabel.value} · ${resourceTitle.value} · Teaching Hub`
  try {
    const text = await loadContent(path)
    if (active) source.value = text
  } catch (cause) {
    if (active) {
      error.value = cause.message
      document.title = `${resourceTitle.value}暂时无法读取 · Teaching Hub`
    }
  } finally {
    if (active) loading.value = false
  }
}, { immediate: true })
</script>

<template>
  <div v-if="context && sourcePath">
    <nav class="breadcrumbs" aria-label="当前位置">
      <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
      <span>{{ unitLabel }}</span><span aria-hidden="true">/</span><span aria-current="page">{{ resourceTitle }}</span>
    </nav>
    <nav class="resource-tabs" :aria-label="materialsLabel">
      <RouterLink v-for="tab in tabs" :key="tab.id" :to="tabLocation(tab)">{{ tab.title }}</RouterLink>
    </nav>
    <p v-if="loading" class="reader-loading" role="status">正在打开{{ resourceTitle }}…</p>
    <section v-else-if="error" class="error-state" role="alert"><h1>{{ resourceTitle }}暂时无法读取</h1><p>{{ error }}</p></section>
    <RunbookReader
      v-else-if="source !== null"
      :source="source"
      :file="sourcePath"
      :variant="isMaterial ? 'cards' : unit.runbookLayout ?? context.course.runbookLayout ?? ''"
      :format="isMaterial ? 'cards' : 'runbook'"
      :page-title="isMaterial ? `${unitLabel} · ${resourceTitle} · Teaching Hub` : ''"
    />
  </div>
  <NotFoundView v-else />
</template>
