<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { findTopic, findWeek, loadContent } from '../lib/catalog.js'
import { parseSlides } from '../lib/slides.js'
import SlidesReader from '../components/slides/SlidesReader.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String, topicId: String, page: String })
const router = useRouter()
const isTopic = computed(() => Boolean(props.topicId))
const context = computed(() => (
  isTopic.value
    ? findTopic(props.termId, props.courseId, props.topicId)
    : findWeek(props.termId, props.courseId, props.weekId)
))
const unit = computed(() => context.value?.[isTopic.value ? 'topic' : 'week'])
const sourcePath = computed(() => unit.value?.resources.slides)
const source = ref(null)
const loading = ref(false)
const loadError = ref('')

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
const currentLessonIndex = computed(() => deck.value?.lessons.findIndex(
  (lesson) => currentPage.value >= lesson.startPage && currentPage.value <= lesson.endPage,
) ?? -1)
const currentLesson = computed(() => deck.value?.lessons[currentLessonIndex.value] ?? null)
const visibleDeck = computed(() => {
  if (!deck.value) return null
  if (!currentLesson.value) return deck.value
  return {
    slides: deck.value.slides.slice(currentLesson.value.startPage - 1, currentLesson.value.endPage),
    count: currentLesson.value.count,
  }
})
const visiblePage = computed(() => currentLesson.value
  ? currentPage.value - currentLesson.value.startPage + 1
  : currentPage.value)

function routeToPage(page) {
  router.replace(resourceLocation('slides', { page }))
}

function routeToVisiblePage(page) {
  routeToPage(currentLesson.value ? currentLesson.value.startPage + page - 1 : page)
}

function routeToLesson(index) {
  const lesson = deck.value?.lessons[index]
  if (lesson) routeToPage(lesson.startPage)
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
  document.title = context.value && sourcePath.value
    ? `${unit.value.label} · ${currentLesson.value ? `${currentLesson.value.label} · ` : ''}Slides ${visiblePage.value} · Teaching Hub`
    : '未找到课件 · Teaching Hub'
})
</script>

<template>
  <div v-if="context && sourcePath" class="slides-page">
    <div class="slides-page-topbar">
      <nav class="breadcrumbs" aria-label="当前位置">
        <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
        <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
        <span>{{ unit.label }}</span><span aria-hidden="true">/</span><span aria-current="page">Slides</span>
      </nav>
      <nav class="resource-tabs" :aria-label="isTopic ? '本专题材料' : '本周材料'">
        <RouterLink v-if="unit.resources.runbook" :to="resourceLocation('runbook')">台本</RouterLink>
        <RouterLink :to="resourceLocation('slides', { page: currentPage })">Slides</RouterLink>
        <RouterLink v-if="unit.resources.guide" :to="resourceLocation('guide')">学生指南</RouterLink>
        <RouterLink v-if="isTopic && unit.resources.exams" :to="resourceLocation('exams')">真题</RouterLink>
      </nav>
    </div>
    <p v-if="loading" class="reader-loading" role="status">正在打开课件…</p>
    <section v-else-if="loadError || parsed.error" class="error-state" role="alert">
      <h1>课件暂时无法读取</h1><p>{{ loadError || parsed.error }}</p>
    </section>
    <SlidesReader
      v-else-if="visibleDeck"
      :deck="visibleDeck"
      :page="visiblePage"
      :lessons="deck.lessons"
      :current-lesson-index="currentLessonIndex"
      @change="routeToVisiblePage"
      @lesson-change="routeToLesson"
    />
  </div>
  <NotFoundView v-else />
</template>
