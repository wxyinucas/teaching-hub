<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { loadContent } from '../lib/catalog.js'
import { useResourceContext } from '../lib/useResourceContext.js'
import SegmentNotes from '../components/runbook/SegmentNotes.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, weekId: String, topicId: String, authorId: String, materialId: String, resourceId: String, page: String })
const { context, sourcePath, resourceTitle, unitLabel, materialsLabel, tabs, tabLocation } = useResourceContext(props, 'guide')
const source = ref(null)
const loading = ref(false)
const error = ref('')
const readerElement = ref(null)
const outline = ref([])
const activeSectionId = ref('')
let scrollFrame = null

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

function updateActiveSection() {
  scrollFrame = null
  if (!outline.value.length) return
  const readingLine = Math.max(88, Math.min(180, window.innerHeight * 0.28))
  const current = outline.value.reduce((active, section) => {
    const heading = document.getElementById(section.id)
    return heading && heading.getBoundingClientRect().top <= readingLine ? section.id : active
  }, outline.value[0].id)
  activeSectionId.value = current
}

function scheduleActiveSectionUpdate() {
  if (scrollFrame !== null) return
  scrollFrame = window.setTimeout(updateActiveSection, 16)
}

function buildOutline() {
  outline.value = []
  activeSectionId.value = ''
  if (!readerElement.value) return
  let section = null
  let sectionIndex = 0
  let subsectionIndex = 0
  for (const heading of readerElement.value.querySelectorAll('.notes-content h2, .notes-content h3')) {
    if (heading.tagName === 'H2') {
      section = { id: `guide-section-${sectionIndex++}`, title: heading.textContent.trim(), children: [] }
      heading.id = section.id
      outline.value.push(section)
    } else if (section) {
      const child = { id: `guide-subsection-${subsectionIndex++}`, title: heading.textContent.trim() }
      heading.id = child.id
      section.children.push(child)
    }
  }
  activeSectionId.value = outline.value[0]?.id ?? ''
  scheduleActiveSectionUpdate()
}

function goToHeading(id) {
  if (outline.value.some((section) => section.id === id)) activeSectionId.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

watch(source, async () => {
  await nextTick()
  buildOutline()
}, { flush: 'post' })

onMounted(() => {
  window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true })
  window.addEventListener('resize', scheduleActiveSectionUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleActiveSectionUpdate)
  window.removeEventListener('resize', scheduleActiveSectionUpdate)
  if (scrollFrame !== null) window.clearTimeout(scrollFrame)
})
</script>

<template>
  <div v-if="context && sourcePath" class="guide-page">
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
    <div v-else-if="source !== null" class="guide-layout guide-layout--topic">
      <article ref="readerElement" class="guide-reader">
        <SegmentNotes :source="source" />
      </article>
      <nav v-if="outline.length" class="guide-mini-content" :aria-label="`${resourceTitle}目录`">
        <h2>本页目录</h2>
        <ol>
          <li v-for="section in outline" :key="section.id">
            <button type="button" :class="{ 'is-current': activeSectionId === section.id }" :aria-current="activeSectionId === section.id ? 'location' : undefined" @click="goToHeading(section.id)">{{ section.title }}</button>
            <ol v-if="section.children.length">
              <li v-for="child in section.children" :key="child.id">
                <button type="button" @click="goToHeading(child.id)">{{ child.title }}</button>
              </li>
            </ol>
          </li>
        </ol>
      </nav>
    </div>
  </div>
  <NotFoundView v-else />
</template>
