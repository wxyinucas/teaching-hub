<script setup>
import { watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { catalog } from '../lib/catalog.js'

watchEffect(() => { document.title = 'Teaching Hub · 课程目录' })
</script>

<template>
  <section class="library-page">
    <header class="directory-heading home-heading">
      <p class="eyebrow">按学期组织，按周完成</p>
      <h1>课程工作台</h1>
      <p class="directory-intro">台本负责课前放行与临场决策，Slides 只承担课堂舞台。两者共享同一个教学周，但各自保持边界。</p>
    </header>

    <section v-for="term in catalog.terms" :key="term.id" class="term-group" :aria-labelledby="`term-${term.id}`">
      <div class="directory-section-heading">
        <h2 :id="`term-${term.id}`">{{ term.title }}</h2>
        <span>{{ term.courses.length }} 门课程</span>
      </div>
      <div class="course-grid">
        <RouterLink
          v-for="course in term.courses"
          :key="course.id"
          class="course-card"
          :to="{ name: 'course', params: { termId: term.id, courseId: course.id } }"
        >
          <div class="course-card-top"><h3>{{ course.title }}</h3><span aria-hidden="true">↗</span></div>
          <p>{{ course.description }}</p>
          <div class="course-card-bottom">
            <span v-if="course.weekMap?.length">{{ course.calendar.length }} 周课程</span>
            <span v-else-if="course.weeks.length">{{ course.weeks.length }} 周内容</span>
            <span>进入课程 →</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <p v-if="!catalog.terms.length" class="directory-empty">尚未登记学期。</p>
    <footer class="page-footer"><span>内容进入 Git，页面由清单自动生成。</span><span>Teaching Hub · 公开但不面向学生宣传</span></footer>
  </section>
</template>
