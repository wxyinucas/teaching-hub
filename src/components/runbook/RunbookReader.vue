<script setup>
import { computed, nextTick, ref, watchEffect } from 'vue'
import SegmentNotes from './SegmentNotes.vue'
import { parseRunbook } from '../../lib/runbook.js'

const props = defineProps({
  source: { type: String, required: true },
  file: { type: String, required: true },
})

const parsed = computed(() => {
  try { return { runbook: parseRunbook(props.source), error: null } }
  catch (error) { return { runbook: null, error: error.message } }
})
const runbook = computed(() => parsed.value.runbook)
const sectionUnit = computed(() => (
  runbook.value?.sections.every((section) => /次课$/.test(section.label)) ? '次课' : '个教学区段'
))
const openSegments = ref(new Set())
const triggers = new Map()

function durationLabel(section) {
  return section.duration > 50 && section.duration % 50 === 0
    ? `${section.duration / 50} × 50 min`
    : `${section.duration} min`
}

function toggleSegment(id) {
  if (openSegments.value.has(id)) openSegments.value.delete(id)
  else openSegments.value.add(id)
}

function collapseAll() {
  openSegments.value = new Set()
}

async function closeSegment(id, restoreFocus = false) {
  const wasOpen = openSegments.value.delete(id)
  if (wasOpen && restoreFocus) {
    await nextTick()
    triggers.get(id)?.focus()
  }
}

function closeOnEscape(event, id) {
  if (openSegments.value.has(id)) {
    event.preventDefault()
    event.stopPropagation()
    closeSegment(id, true)
  }
}

watchEffect(() => {
  document.title = runbook.value
    ? `${runbook.value.code} · ${runbook.value.title} · Teaching Hub`
    : '台本暂时无法读取 · Teaching Hub'
})
</script>

<template>
  <section v-if="runbook" class="runbook-reader">
    <section class="lesson-heading" aria-labelledby="lesson-title">
      <div class="lesson-title-row"><span class="week-tag">{{ runbook.code }}</span><h1 id="lesson-title">{{ runbook.title }}</h1></div>
      <p class="lesson-meta">{{ runbook.subtitle }}<span class="meta-separator">·</span>{{ runbook.sections.length }} {{ sectionUnit }} / {{ runbook.segmentCount }} 个教学动作段 / {{ runbook.duration }} 分钟<span class="meta-note">不含课间</span></p>
    </section>

    <dl class="anchors" aria-label="台本的方向">
      <div v-for="(anchor, index) in runbook.overview" :key="anchor.label" class="anchor" :class="{ 'anchor-close': index === runbook.overview.length - 1 }">
        <dt>{{ anchor.label }}</dt><dd>{{ anchor.text }}</dd>
      </div>
    </dl>

    <div class="workspace">
      <section id="lesson-route" class="route" aria-labelledby="route-title">
        <div class="route-toolbar">
          <h2 id="route-title">课堂路线 <span>{{ runbook.segmentCount }} 个教学动作段</span></h2>
          <button class="collapse-all" :disabled="openSegments.size === 0" @click="collapseAll">全部收起 <span aria-hidden="true">↑</span></button>
        </div>

        <section v-for="section in runbook.sections" :key="section.id" class="period" :class="{ 'is-dense': section.segments.length >= 6 }" :aria-labelledby="section.id">
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
            <article class="segment" :class="{ 'is-open': openSegments.has(segment.id) }" @keydown.esc="closeOnEscape($event, segment.id)">
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
                <SegmentNotes :source="segment.notes" />
                <button class="close-inline" @click="closeSegment(segment.id, true)">收起本段 ↑</button>
              </div>
            </article>
          </template>
        </section>
      </section>

      <aside class="side-notes" aria-labelledby="controls-title">
        <h2 id="controls-title">临场取舍</h2>
        <dl class="controls">
          <div v-for="(control, index) in runbook.controls" :key="control.label" class="control">
            <dt><span class="control-index" aria-hidden="true">0{{ index + 1 }}</span>{{ control.label }}</dt>
            <dd>{{ control.text }}</dd>
          </div>
        </dl>
        <div class="usage-note"><span aria-hidden="true">＋</span><p>先看完整备课单位的路线。<br />需要时，点开一段查细节。</p></div>
        <p class="machine-note">台本用于教师备课与临场决策。<br />Slides 与其他材料是否展示，按课程约定执行。</p>
      </aside>
    </div>
    <footer class="page-footer"><span>总览里做取舍，展开后查细节。</span><span>{{ runbook.code }} · 内容与版式分开维护</span></footer>
  </section>
  <section v-else class="error-state" role="alert">
    <p class="eyebrow">备课台本</p><h1>台本暂时无法读取</h1><p>{{ parsed.error }}</p><p>请检查 <code>{{ file }}</code>，保存后页面会重新载入。</p>
  </section>
</template>
