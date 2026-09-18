<script setup>
import { computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { findCourse, hasContent } from '../lib/catalog.js'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String })
const context = computed(() => findCourse(props.termId, props.courseId))
const isTopicCourse = computed(() => context.value?.course.organization === 'topics')
const entries = computed(() => (
  isTopicCourse.value ? context.value?.course.topicMap ?? [] : context.value?.course.calendar ?? []
))

function record(entry) {
  return isTopicCourse.value ? entry.topic : entry.week
}

function ready(entry, kind) {
  return hasContent(record(entry)?.resources[kind])
}

function examLinkCaption(entry) {
  return record(entry)?.examTitle ?? '按年份浏览'
}

function resourceLocation(entry, kind, extraParams = {}) {
  const unit = isTopicCourse.value ? 'topic' : 'week'
  const params = {
    termId: props.termId,
    courseId: props.courseId,
    [`${unit}Id`]: entry.id,
    ...extraParams,
  }
  return { name: `${isTopicCourse.value ? 'topic-' : ''}${kind}`, params }
}

watchEffect(() => {
  document.title = context.value
    ? `${context.value.course.title} · ${context.value.term.title} · Teaching Hub`
    : '未找到课程 · Teaching Hub'
})
</script>

<template>
  <section
    v-if="context"
    class="directory-page"
    :class="{ 'directory-page--surface-study': courseId === 'calculus-i' }"
  >
    <nav class="breadcrumbs" aria-label="当前位置">
      <RouterLink to="/">首页</RouterLink><span aria-hidden="true">/</span>
      <span>{{ context.term.title }}</span><span aria-hidden="true">/</span>
      <span aria-current="page">{{ context.course.title }}</span>
    </nav>
    <header class="directory-heading">
      <p class="eyebrow">{{ context.term.title }}</p>
      <h1>{{ context.course.title }}</h1>
      <p class="directory-intro">{{ context.course.description }}</p>
    </header>

    <div class="directory-section-heading">
      <h2>{{ isTopicCourse ? '专题地图' : '教学周' }}</h2>
      <span v-if="entries.length">{{ entries.length }} {{ isTopicCourse ? '个专题' : '周' }}</span>
    </div>
    <div v-if="entries.length" :class="isTopicCourse ? 'topic-list' : 'week-list'">
      <article v-for="entry in entries" :key="entry.id" :class="isTopicCourse ? 'topic-card' : 'week-card'">
        <div :class="isTopicCourse ? 'topic-copy' : 'week-copy'">
          <span :class="isTopicCourse ? 'topic-kicker' : 'week-kicker'">{{ entry.label }}</span>
          <h3>{{ entry.title }}</h3>
          <p v-if="entry.summary">{{ entry.summary }}</p>
          <p v-if="isTopicCourse && (entry.lessonCount || entry.completedBy)" class="topic-meta">
            <span v-if="entry.lessonCount">约 {{ entry.lessonCount }} 次课</span>
            <span v-if="entry.completedBy"> · 最晚完成 <time :datetime="entry.completedBy">{{ entry.completedBy }}</time></span>
          </p>
        </div>
        <div
          v-if="record(entry)"
          :class="isTopicCourse ? 'topic-actions' : 'week-actions'"
          :aria-label="isTopicCourse ? '本专题材料' : '本周材料'"
        >
          <RouterLink
            v-if="ready(entry, 'runbook')"
            class="resource-link resource-runbook"
            :to="resourceLocation(entry, 'runbook')"
          ><span>台本</span><small>课前与课中</small></RouterLink>
          <RouterLink
            v-if="ready(entry, 'slides')"
            class="resource-link resource-slides"
            :to="resourceLocation(entry, 'slides', { page: 1 })"
          ><span>Slides</span><small>按课程约定使用</small></RouterLink>
          <RouterLink
            v-if="ready(entry, 'guide')"
            class="resource-link resource-guide"
            :to="resourceLocation(entry, 'guide')"
          ><span>学生指南</span><small v-if="!isTopicCourse">独立执行与接续</small></RouterLink>
          <RouterLink
            v-if="isTopicCourse && ready(entry, 'exams')"
            class="resource-link resource-exams"
            :to="resourceLocation(entry, 'exams')"
          ><span>真题</span><small>{{ examLinkCaption(entry) }}</small></RouterLink>
          <RouterLink
            v-for="demo in record(entry).demos ?? []"
            :key="demo.id"
            class="resource-link resource-demo"
            :to="resourceLocation(entry, 'demo', { demoId: demo.id })"
          ><span>演示</span><small>{{ demo.title }}</small></RouterLink>
        </div>
      </article>
    </div>
    <div v-else class="empty-course">
      <span aria-hidden="true">○</span>
      <h2>还没有登记{{ isTopicCourse ? '专题' : '教学周' }}</h2>
      <p v-if="isTopicCourse">课程入口已经建立；第一个专题准备好后，再加入对应的 topic 目录。</p>
      <p v-else>课程入口已经建立；第一份正式周材料准备好后，再加入对应的 week 目录。</p>
    </div>
    <p v-if="isTopicCourse" class="directory-footnote">网站按专题组织；每次课的日期与材料写在对应专题内。</p>
    <p v-else class="directory-footnote">网站按教学周组织；备课与放行单位由课程契约定义。</p>
  </section>
  <NotFoundView v-else />
</template>
