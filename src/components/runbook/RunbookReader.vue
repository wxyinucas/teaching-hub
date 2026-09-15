<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import SegmentNotes from './SegmentNotes.vue'
import { parseRunbook } from '../../lib/runbook.js'
import { resolveRunbookNavigation } from '../../lib/runbookNavigation.js'

const props = defineProps({
  source: { type: String, required: true },
  file: { type: String, required: true },
  variant: { type: String, default: '' },
})

const parsed = computed(() => {
  try { return { runbook: parseRunbook(props.source), error: null } }
  catch (error) { return { runbook: null, error: error.message } }
})
const runbook = computed(() => parsed.value.runbook)
const variantClass = computed(() => {
  const name = props.variant.trim().replace(/[^a-zA-Z0-9_-]+/g, '-')
  return name ? `runbook-reader--${name}` : ''
})
const usesPeriodCards = computed(() => props.variant === 'calculus-topic')
const segmentUnit = computed(() => (usesPeriodCards.value ? '个课时卡片' : '个教学动作段'))
const sectionUnit = computed(() => (
  runbook.value?.sections.every((section) => /次课$/.test(section.label)) ? '次课' : '个教学区段'
))
const openSegments = ref(new Set())
const readerElement = ref(null)
const activeSectionId = ref('')
const activeSegmentId = ref('')
const visibleSegmentIds = ref([])
const triggers = new Map()
const sectionElements = new Map()
const segmentElements = new Map()
let navigationFrame = null
let navigationUsesTimeout = false
let navigationResizeObserver = null

const currentSectionId = computed(() => (
  activeSectionId.value || runbook.value?.sections[0]?.id || ''
))
const navigationSegments = computed(() => {
  const sections = runbook.value?.sections ?? []
  const entries = sections.flatMap((section) => section.segments.map((segment) => ({ section, segment })))
  const fallback = entries[0]?.segment.id
  const ids = visibleSegmentIds.value.length ? visibleSegmentIds.value : [activeSegmentId.value || fallback]
  return ids.map((id) => entries.find((entry) => entry.segment.id === id)).filter(Boolean)
})

function durationLabel(section) {
  return section.duration > 50 && section.duration % 50 === 0
    ? `${section.duration / 50} × 50 min`
    : `${section.duration} min`
}

function toggleSegment(id) {
  if (openSegments.value.has(id)) openSegments.value.delete(id)
  else openSegments.value.add(id)
  nextTick(scheduleNavigationUpdate)
}

function collapseAll() {
  openSegments.value = new Set()
  nextTick(scheduleNavigationUpdate)
}

async function closeSegment(id, restoreFocus = false) {
  const wasOpen = openSegments.value.delete(id)
  if (wasOpen && restoreFocus) {
    await nextTick()
    triggers.get(id)?.focus()
  }
  scheduleNavigationUpdate()
}

function closeOnEscape(event, id) {
  if (openSegments.value.has(id)) {
    event.preventDefault()
    event.stopPropagation()
    closeSegment(id, true)
  }
}

function registerElement(map, id, element) {
  if (element) map.set(id, element)
  else map.delete(id)
}

function scrollToElement(element) {
  element?.scrollIntoView?.({ behavior: 'auto', block: 'start' })
}

function goToSection(id) {
  const section = sectionElements.get(id)
  const firstSegment = runbook.value?.sections.find((item) => item.id === id)?.segments[0]
  activeSectionId.value = id
  if (firstSegment) {
    activeSegmentId.value = firstSegment.id
    visibleSegmentIds.value = [firstSegment.id]
  }
  scrollToElement(section?.querySelector('.period-header') ?? section)
}

function goToSegment(id) {
  const section = runbook.value?.sections.find((item) => item.segments.some((segment) => segment.id === id))
  if (section) activeSectionId.value = section.id
  activeSegmentId.value = id
  visibleSegmentIds.value = [id]
  scrollToElement(triggers.get(id))
}

async function goToOutline(segmentId, outlineId) {
  if (!openSegments.value.has(segmentId)) openSegments.value.add(segmentId)
  await nextTick()
  scrollToElement(readerElement.value?.querySelector(`[id="${outlineId}"]`))
  scheduleNavigationUpdate()
}

async function toggleSegmentFromNavigation(id) {
  const wasOpen = openSegments.value.has(id)
  if (wasOpen) {
    scrollToElement(triggers.get(id))
    openSegments.value.delete(id)
  } else openSegments.value.add(id)
  await nextTick()
  scrollToElement(triggers.get(id))
  activeSegmentId.value = id
  scheduleNavigationUpdate()
}

function updateNavigation() {
  navigationFrame = null
  if (!usesPeriodCards.value || !runbook.value || typeof window === 'undefined') return

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 768
  const readingLine = Math.max(88, Math.min(180, viewportHeight * 0.28))
  const entries = runbook.value.sections.flatMap((section) => section.segments.map((segment, index) => ({
    section,
    segment,
    index,
  })))
  const segmentPositions = entries.flatMap(({ section, segment, index }) => {
    const element = segmentElements.get(segment.id)
    if (!element) return []
    const rect = element.getBoundingClientRect()
    const sectionRect = index === 0 ? sectionElements.get(section.id)?.getBoundingClientRect() : null
    return [{ id: segment.id, top: sectionRect?.top ?? rect.top, bottom: rect.bottom }]
  })
  const focus = resolveRunbookNavigation(segmentPositions, viewportHeight, readingLine)
  activeSegmentId.value = focus.currentId
  visibleSegmentIds.value = focus.visibleIds
  activeSectionId.value = entries.find(({ segment }) => segment.id === focus.currentId)?.section.id ?? ''
}

function scheduleNavigationUpdate() {
  if (!usesPeriodCards.value || typeof window === 'undefined' || navigationFrame !== null) return
  if (window.requestAnimationFrame) {
    navigationUsesTimeout = false
    navigationFrame = window.requestAnimationFrame(updateNavigation)
  } else {
    navigationUsesTimeout = true
    navigationFrame = window.setTimeout(updateNavigation, 16)
  }
}

onMounted(() => {
  if (!usesPeriodCards.value) return
  window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true })
  window.addEventListener('resize', scheduleNavigationUpdate)
  if (window.ResizeObserver && readerElement.value) {
    navigationResizeObserver = new window.ResizeObserver(scheduleNavigationUpdate)
    navigationResizeObserver.observe(readerElement.value)
  }
  nextTick(scheduleNavigationUpdate)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', scheduleNavigationUpdate)
  window.removeEventListener('resize', scheduleNavigationUpdate)
  navigationResizeObserver?.disconnect()
  if (navigationFrame !== null) {
    if (navigationUsesTimeout) window.clearTimeout(navigationFrame)
    else window.cancelAnimationFrame(navigationFrame)
  }
})

watch(() => props.source, async () => {
  openSegments.value = new Set()
  activeSectionId.value = ''
  activeSegmentId.value = ''
  visibleSegmentIds.value = []
  await nextTick()
  scheduleNavigationUpdate()
})

watchEffect(() => {
  document.title = runbook.value
    ? `${runbook.value.code} · ${runbook.value.title} · Teaching Hub`
    : '台本暂时无法读取 · Teaching Hub'
})
</script>

<template>
  <section v-if="runbook" ref="readerElement" class="runbook-reader" :class="variantClass">
    <section class="lesson-heading" aria-labelledby="lesson-title">
      <div class="lesson-title-row"><span class="week-tag">{{ runbook.code }}</span><h1 id="lesson-title">{{ runbook.title }}</h1></div>
      <p class="lesson-meta">
        {{ runbook.subtitle }}<template v-if="!usesPeriodCards"><span class="meta-separator">·</span>{{ runbook.sections.length }} {{ sectionUnit }} / {{ runbook.segmentCount }} {{ segmentUnit }} / {{ runbook.duration }} 分钟<span class="meta-note">不含课间</span></template>
      </p>
    </section>

    <dl v-if="!usesPeriodCards" class="anchors" aria-label="台本的方向">
      <div v-for="(anchor, index) in runbook.overview" :key="anchor.label" class="anchor" :class="{ 'anchor-close': index === runbook.overview.length - 1 }">
        <dt>{{ anchor.label }}</dt><dd>{{ anchor.text }}</dd>
      </div>
    </dl>

    <div class="workspace">
      <section id="lesson-route" class="route" aria-labelledby="route-title">
        <div class="route-toolbar">
          <h2 id="route-title">{{ usesPeriodCards ? '专题路线' : '课堂路线' }} <span>{{ runbook.segmentCount }} {{ segmentUnit }}</span></h2>
          <button class="collapse-all" :disabled="openSegments.size === 0" @click="collapseAll">全部收起 <span aria-hidden="true">↑</span></button>
        </div>

        <section
          v-for="section in runbook.sections"
          :key="section.id"
          :ref="(element) => registerElement(sectionElements, section.id, element)"
          class="period"
          :class="{ 'is-dense': section.segments.length >= 6 }"
          :aria-labelledby="section.id"
        >
          <header class="period-header">
            <div><span class="period-label">{{ section.label }}</span><h3 :id="section.id">{{ section.title }}</h3></div>
            <span class="period-duration">{{ durationLabel(section) }}</span>
          </header>
          <template v-for="segment in section.segments" :key="segment.id">
            <div
              v-if="segment.periodBoundaryBefore"
              class="period-boundary"
              role="separator"
              :aria-label="`第 ${segment.periodNumber} 课时从第 ${segment.start} 分钟开始`"
            >
              <span>第 {{ segment.periodNumber }} 课时</span>
              <span>{{ segment.start }}–{{ Math.min(segment.start + 50, section.duration) }} min</span>
            </div>
            <article
              :ref="(element) => registerElement(segmentElements, segment.id, element)"
              class="segment"
              :class="{ 'is-open': openSegments.has(segment.id) }"
              @keydown.esc="closeOnEscape($event, segment.id)"
            >
              <button
                :id="`${segment.id}-trigger`"
                :ref="(element) => element ? triggers.set(segment.id, element) : triggers.delete(segment.id)"
                class="segment-trigger"
                :aria-expanded="openSegments.has(segment.id)"
                :aria-controls="`${segment.id}-notes`"
                @click="toggleSegment(segment.id)"
              >
                <span class="segment-time">{{ segment.time }}<small>min</small></span>
                <span class="segment-overview"><span class="segment-title">{{ segment.title }}</span><span v-if="segment.summary" class="segment-summary">{{ segment.summary }}</span></span>
                <span class="disclosure-icon" aria-hidden="true">{{ openSegments.has(segment.id) ? '−' : '+' }}</span>
              </button>
              <div v-show="openSegments.has(segment.id)" :id="`${segment.id}-notes`" class="segment-notes" role="region" :aria-labelledby="`${segment.id}-trigger`">
                <div class="notes-heading"><span>教师提示</span><span>卡片内按 Esc 收起</span></div>
                <SegmentNotes :source="segment.notes" :outline="segment.outline" />
                <button class="close-inline" @click="closeSegment(segment.id, true)">收起本段 ↑</button>
              </div>
            </article>
          </template>
        </section>
      </section>

      <aside v-if="usesPeriodCards" class="side-notes topic-side-nav" aria-label="专题台本导航">
        <nav class="topic-lesson-index" aria-label="课次索引">
          <span>课次</span>
          <div>
            <button
              v-for="section in runbook.sections"
              :key="section.id"
              type="button"
              :class="{ 'is-current': section.id === currentSectionId }"
              :aria-current="section.id === currentSectionId ? 'location' : undefined"
              @click="goToSection(section.id)"
            >{{ section.label }}</button>
          </div>
        </nav>

        <nav class="topic-toc-stack" aria-label="当前课时目录">
          <section
            v-for="entry in navigationSegments"
            :key="entry.segment.id"
            class="topic-segment-toc"
            :class="{ 'is-current': entry.segment.id === activeSegmentId }"
            :aria-labelledby="`${entry.segment.id}-toc-title`"
          >
            <header class="topic-segment-toc-heading">
              <button
                type="button"
                class="topic-segment-link"
                :aria-current="entry.segment.id === activeSegmentId ? 'location' : undefined"
                @click="goToSegment(entry.segment.id)"
              >
                <span>{{ entry.section.label }} · {{ entry.segment.time }}</span>
                <strong :id="`${entry.segment.id}-toc-title`">{{ entry.segment.title }}</strong>
              </button>
              <button
                type="button"
                class="topic-segment-toggle"
                :aria-label="`${openSegments.has(entry.segment.id) ? '收起' : '展开'}左侧${entry.section.label}的${entry.segment.time}`"
                :aria-expanded="openSegments.has(entry.segment.id)"
                :aria-controls="`${entry.segment.id}-notes`"
                @click="toggleSegmentFromNavigation(entry.segment.id)"
              >{{ openSegments.has(entry.segment.id) ? '收起左侧' : '展开左侧' }}</button>
            </header>
            <ul v-if="entry.segment.outline.length" class="topic-outline">
              <li v-for="item in entry.segment.outline" :key="item.id">
                <button type="button" @click="goToOutline(entry.segment.id, item.id)">{{ item.text }}</button>
              </li>
            </ul>
          </section>
        </nav>
      </aside>

      <aside v-else class="side-notes" aria-labelledby="controls-title">
        <h2 id="controls-title">临场取舍</h2>
        <dl class="controls">
          <div v-for="(control, index) in runbook.controls" :key="control.label" class="control">
            <dt><span class="control-index" aria-hidden="true">0{{ index + 1 }}</span>{{ control.label }}</dt>
            <dd>{{ control.text }}</dd>
          </div>
        </dl>
        <div class="usage-note"><span aria-hidden="true">＋</span><p>先看完整备课单位的路线。<br />需要时，点开{{ usesPeriodCards ? '一个课时' : '一段' }}查细节。</p></div>
        <p class="machine-note">台本用于教师备课与临场决策。<br />Slides 与其他材料是否展示，按课程约定执行。</p>
      </aside>
    </div>
    <footer v-if="!usesPeriodCards" class="page-footer"><span>总览里做取舍，展开后查细节。</span><span>{{ runbook.code }} · 内容与版式分开维护</span></footer>
  </section>
  <section v-else class="error-state" role="alert">
    <p class="eyebrow">备课台本</p><h1>台本暂时无法读取</h1><p>{{ parsed.error }}</p><p>请检查 <code>{{ file }}</code>，保存后页面会重新载入。</p>
  </section>
</template>
