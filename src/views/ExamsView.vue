<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { findTopic, loadContent } from '../lib/catalog.js'
import { parseExamCollection, structureExamQuestion } from '../lib/exams.js'
import { renderNotes } from '../lib/markdown.js'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, topicId: String })
const context = computed(() => findTopic(props.termId, props.courseId, props.topicId))
const topic = computed(() => context.value?.topic)
const sourcePath = computed(() => topic.value?.resources.exams)
const collection = ref(null)
const loading = ref(false)
const error = ref('')

function resourceLocation(kind, extraParams = {}) {
  return {
    name: `topic-${kind}`,
    params: {
      termId: props.termId,
      courseId: props.courseId,
      topicId: props.topicId,
      ...extraParams,
    },
  }
}

function scrollToYear(year) {
  document.getElementById(`exam-year-${year}`)?.scrollIntoView({ block: 'start' })
}

function paperReference(question) {
  return question.paperSection
    ? `${question.paperSection}｜${question.paperNumber ?? '—'}`
    : ''
}

function questionAriaLabel(question, index) {
  const reference = question.paperSection
    ? question.paperNumber === null
      ? `${question.paperSection}，原卷无题号`
      : `${question.paperSection}第 ${question.paperNumber} 题`
    : `第 ${index + 1} 道题`
  return `${question.year} 年${reference}，${question.points} 分`
}

watch(sourcePath, async (path, _previous, onCleanup) => {
  let active = true
  onCleanup(() => { active = false })
  collection.value = null
  error.value = ''
  if (!path) return
  loading.value = true
  try {
    const source = await loadContent(path)
    const parsed = parseExamCollection(source)
    const rendered = {
      ...parsed,
      years: parsed.years.map((group) => ({
        ...group,
        totalPoints: group.questions.reduce((sum, question) => sum + question.points, 0),
        questions: group.questions.map((question) => {
          const structured = structureExamQuestion(question.source)
          return {
            ...question,
            html: structured.options.length ? '' : renderNotes(structured.body).html,
            stemHtml: structured.options.length ? renderNotes(structured.stem).html : '',
            options: structured.options.map((option) => ({
              ...option,
              html: renderNotes(option.source).html,
            })),
            optionColumns: structured.optionColumns,
          }
        }),
      })),
    }
    if (active) collection.value = rendered
  } catch (cause) {
    if (active) error.value = cause.message
  } finally {
    if (active) loading.value = false
  }
}, { immediate: true })

watchEffect(() => {
  document.title = context.value && sourcePath.value
    ? `${topic.value.label} · 真题 · Teaching Hub`
    : '未找到真题 · Teaching Hub'
})
</script>

<template>
  <div v-if="context && sourcePath" class="exams-page">
    <nav class="breadcrumbs" aria-label="当前位置">
      <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
      <RouterLink :to="{ name: 'course', params: { termId, courseId } }">{{ context.course.title }}</RouterLink><span aria-hidden="true">/</span>
      <span>{{ topic.label }}</span><span aria-hidden="true">/</span><span aria-current="page">真题</span>
    </nav>
    <nav class="resource-tabs" aria-label="本专题材料">
      <RouterLink v-if="topic.resources.runbook" :to="resourceLocation('runbook')">台本</RouterLink>
      <RouterLink v-if="topic.resources.slides" :to="resourceLocation('slides', { page: 1 })">Slides</RouterLink>
      <RouterLink v-if="topic.resources.guide" :to="resourceLocation('guide')">学生指南</RouterLink>
      <RouterLink :to="resourceLocation('exams')">真题</RouterLink>
    </nav>

    <p v-if="loading" class="reader-loading" role="status">正在打开真题…</p>
    <section v-else-if="error" class="error-state" role="alert">
      <h1>真题暂时无法读取</h1><p>{{ error }}</p>
    </section>
    <article v-else-if="collection" class="exam-reader">
      <header class="exam-heading">
        <p class="eyebrow">{{ topic.label }} · 历年真题</p>
        <h1>{{ topic.examTitle ?? topic.title }}</h1>
        <p>{{ topic.examDescription ?? '题目按主要考查能力唯一归类，并按年份顺序排列。' }}</p>
        <div class="exam-totals" aria-label="真题统计">
          <span>{{ collection.questionCount }} 道题</span>
          <span v-if="collection.questionCount">{{ collection.totalPoints }} 分</span>
        </div>
      </header>

      <section v-if="!collection.questionCount" class="exam-empty">
        <span aria-hidden="true">0</span>
        <h2>暂无直接归入本专题的真题</h2>
        <p>当前题库没有直接考查本专题核心内容的题目；相邻专题的题目不在这里重复展示。</p>
      </section>

      <template v-else>
        <nav class="exam-year-index" aria-label="年份目录">
          <button
            v-for="group in collection.years"
            :key="group.year"
            type="button"
            @click="scrollToYear(group.year)"
          >{{ group.year }}</button>
        </nav>
        <section
          v-for="group in collection.years"
          :id="`exam-year-${group.year}`"
          :key="group.year"
          class="exam-year"
        >
          <header class="exam-year-heading">
            <h2>{{ group.year }} 年</h2>
            <p>{{ group.questions.length }} 道题 · {{ group.totalPoints }} 分</p>
          </header>
          <div class="exam-question-list">
            <article
              v-for="(question, index) in group.questions"
              :key="question.sourceId ?? `${group.year}-${index}`"
              class="exam-question"
              :aria-label="questionAriaLabel(question, index)"
            >
              <span v-if="question.paperSection" class="exam-source">{{ paperReference(question) }}</span>
              <span class="exam-score">{{ question.points }} 分</span>
              <div class="notes-content exam-question-content">
                <template v-if="question.options.length">
                  <div class="exam-question-stem" v-html="question.stemHtml"></div>
                  <div class="exam-options" :class="`exam-options--${question.optionColumns}`">
                    <div v-for="option in question.options" :key="option.label" class="exam-option">
                      <span class="exam-option-label">{{ option.label }}.</span>
                      <div class="exam-option-content" v-html="option.html"></div>
                    </div>
                  </div>
                </template>
                <div v-else v-html="question.html"></div>
              </div>
            </article>
          </div>
        </section>
      </template>
    </article>
  </div>
  <NotFoundView v-else />
</template>
