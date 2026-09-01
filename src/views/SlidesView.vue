<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { findWeek, loadContent } from '../lib/catalog.js'
import { parseSlides } from '../lib/slides.js'
import SlidesReader from '../components/slides/SlidesReader.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String, page: String })
const router = useRouter()
const context = computed(() => findWeek(props.termId, props.courseId, props.weekId))
const sourcePath = computed(() => context.value?.week.resources.slides)
const source = ref(null)
const loading = ref(false)
const loadError = ref('')

const parsed = computed(() => {
  if (source.value === null) return { deck: null, error: '' }
  try { return { deck: parseSlides(source.value), error: '' } }
  catch (cause) { return { deck: null, error: cause.message } }
})
const deck = computed(() => parsed.value.deck)
const currentPage = computed(() => {
  const requested = Number.parseInt(props.page ?? '1', 10)
  if (!deck.value) return 1
  return Math.min(deck.value.count, Math.max(1, Number.isFinite(requested) ? requested : 1))
})

function routeToPage(page) {
  router.replace({
    name: 'slides',
    params: { termId: props.termId, courseId: props.courseId, weekId: props.weekId, page },
  })
}

watch(sourcePath, async (path, _previous, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  source.value = null
  loadError.value = ''
  if (!path) return
  loading.value = true
  try {
    const text = await loadContent(path)
    if (active) source.value = text
  } catch (cause) {
    if (active) loadError.value = cause.message
  } finally {
    if (active) loading.value = false
  }
}, { immediate: true })

watch([deck, () => props.page], ([value]) => {
  if (!value) return
  if (String(currentPage.value) !== props.page) routeToPage(currentPage.value)
}, { flush: 'post' })

watchEffect(() => {
  document.title = context.value
    ? `${context.value.week.label} · Slides ${currentPage.value} · Teaching Hub`
    : '未找到课件 · Teaching Hub'
})
</script>

<template>
  <div v-if="context" class="slides-page">
    <div class="slides-page-topbar">
      <nav class="breadcrumbs" aria-label="当前位置">
        <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
        <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
        <span>{{ context.week.label }}</span><span aria-hidden="true">/</span><span aria-current="page">Slides</span>
      </nav>
      <nav class="resource-tabs" aria-label="本周材料">
        <RouterLink v-if="context.week.resources.runbook" :to="{ name: 'runbook', params: { termId, courseId, weekId } }">台本</RouterLink>
        <RouterLink :to="{ name: 'slides', params: { termId, courseId, weekId, page: currentPage } }">Slides</RouterLink>
      </nav>
    </div>
    <p v-if="loading" class="reader-loading" role="status">正在打开课件…</p>
    <section v-else-if="loadError || parsed.error" class="error-state" role="alert">
      <h1>课件暂时无法读取</h1><p>{{ loadError || parsed.error }}</p>
    </section>
    <SlidesReader v-else-if="deck" :deck="deck" :page="currentPage" @change="routeToPage" />
  </div>
  <NotFoundView v-else />
</template>
