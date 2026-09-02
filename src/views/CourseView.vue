<script setup>
import { computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { findCourse, hasContent } from '../lib/catalog.js'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String })
const context = computed(() => findCourse(props.termId, props.courseId))

function ready(week, kind) {
  return hasContent(week.week?.resources[kind])
}

watchEffect(() => {
  document.title = context.value
    ? `${context.value.course.title} · ${context.value.term.title} · Teaching Hub`
    : '未找到课程 · Teaching Hub'
})
</script>

<template>
  <section v-if="context" class="directory-page">
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
      <h2>教学周</h2>
      <span v-if="context.course.calendar.length">{{ context.course.calendar.length }} 周</span>
    </div>
    <div v-if="context.course.calendar.length" class="week-list">
      <article v-for="week in context.course.calendar" :key="week.id" class="week-card">
        <div class="week-copy">
          <span class="week-kicker">{{ week.label }}</span>
          <h3>{{ week.title }}</h3>
          <p v-if="week.summary">{{ week.summary }}</p>
        </div>
        <div v-if="week.week" class="week-actions" aria-label="本周材料">
          <RouterLink
            v-if="ready(week, 'runbook')"
            class="resource-link resource-runbook"
            :to="{ name: 'runbook', params: { termId, courseId, weekId: week.id } }"
          ><span>台本</span><small>课前与课中</small></RouterLink>
          <RouterLink
            v-if="ready(week, 'slides')"
            class="resource-link resource-slides"
            :to="{ name: 'slides', params: { termId, courseId, weekId: week.id, page: 1 } }"
          ><span>Slides</span><small>静态课堂舞台</small></RouterLink>
          <RouterLink
            v-if="ready(week, 'guide')"
            class="resource-link resource-guide"
            :to="{ name: 'guide', params: { termId, courseId, weekId: week.id } }"
          ><span>学生指南</span><small>操作与验收</small></RouterLink>
        </div>
      </article>
    </div>
    <div v-else class="empty-course">
      <span aria-hidden="true">○</span>
      <h2>还没有登记教学周</h2>
      <p>课程入口已经建立；第一份台本或 Slides 准备好后，再加入对应的 week 目录。</p>
    </div>
    <p class="directory-footnote">周是严格的备课与放行单位；50 分钟课时只在周内作为软检查点。</p>
  </section>
  <NotFoundView v-else />
</template>
