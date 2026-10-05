<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { loadContent } from '../lib/catalog.js'
import { useResourceContext } from '../lib/useResourceContext.js'
import { parseSlides } from '../lib/slides.js'
import SlidesReader from '../components/slides/SlidesReader.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String, topicId: String, authorId: String, materialId: String, resourceId: String, page: String })
const router = useRouter()
const { isMaterial, context, unit, resource, sourcePath, resourceTitle, unitLabel, materialsLabel, tabs, resourceLocation, tabLocation } = useResourceContext(props, 'slides')
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
  router.replace(resourceLocation(resource.value.id, { page }))
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
    ? `${unitLabel.value} · ${currentLesson.value ? `${currentLesson.value.label} · ` : ''}${resourceTitle.value} ${visiblePage.value} · Teaching Hub`
    : '未找到课件 · Teaching Hub'
})
</script>

<template>
  <div v-if="context && sourcePath" class="slides-page">
    <div class="slides-page-topbar">
      <nav class="breadcrumbs" aria-label="当前位置">
        <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
        <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
        <span>{{ unitLabel }}</span><span aria-hidden="true">/</span><span aria-current="page">{{ resourceTitle }}</span>
      </nav>
      <nav class="resource-tabs" :aria-label="materialsLabel">
        <RouterLink v-for="tab in tabs" :key="tab.id" :to="tabLocation(tab, tab.id === resource.id ? currentPage : 1)">{{ tab.title }}</RouterLink>
      </nav>
    </div>
    <p v-if="loading" class="reader-loading" role="status">正在打开{{ isMaterial ? resourceTitle : '课件' }}…</p>
    <section v-else-if="loadError || parsed.error" class="error-state" role="alert">
      <h1>{{ isMaterial ? resourceTitle : '课件' }}暂时无法读取</h1><p>{{ loadError || parsed.error }}</p>
    </section>
    <SlidesReader
      v-else-if="visibleDeck"
      :deck="visibleDeck"
      :page="visiblePage"
      :lessons="deck.lessons"
      :current-lesson-index="currentLessonIndex"
      :variant="unit.slidesVariant"
      @change="routeToVisiblePage"
      @lesson-change="routeToLesson"
    />
  </div>
  <NotFoundView v-else />
</template>
