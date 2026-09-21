import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createWebHashHistory } from 'vue-router'
import App from '../src/App.vue'
import { catalog, loadContent } from '../src/lib/catalog.js'
import { parseSlides } from '../src/lib/slides.js'
import { createTeachingRouter } from '../src/router.js'

const bundle = catalog.terms.flatMap((term) => term.courses.flatMap((course) => (
  course.weeks.map((week) => ({ term, course, week }))
))).find(({ course, week }) => (
  course.id === 'ai-agents'
  && week.id === 'week-01'
  && ['runbook', 'slides', 'guide'].every((kind) => week.resources[kind])
))

if (!bundle) throw new Error('路由测试至少需要一个同时登记台本、Slides 与学生指南的教学周。')

const { term, course, week } = bundle
const coursePath = `/terms/${term.id}/courses/${course.id}`
const weekPath = `${coursePath}/weeks/${week.id}`
const topicBundle = catalog.terms.flatMap((itemTerm) => itemTerm.courses.flatMap((itemCourse) => (
  itemCourse.topics.flatMap((topic) => (
    topic.resources.runbook ? [{ term: itemTerm, course: itemCourse, topic }] : []
  ))
))).at(0)
const topicDemoBundle = catalog.terms.flatMap((itemTerm) => itemTerm.courses.flatMap((itemCourse) => (
  itemCourse.topics.flatMap((topic) => (topic.demos ?? []).map((demo) => ({
    term: itemTerm, course: itemCourse, topic, demo,
  })))
))).at(0)
const calculusExamContext = catalog.terms.flatMap((itemTerm) => itemTerm.courses
  .filter((itemCourse) => itemCourse.id === 'calculus-i')
  .map((itemCourse) => ({ term: itemTerm, course: itemCourse }))).at(0)
const calculusExamBundles = calculusExamContext?.course.topics.flatMap((topic) => (
  topic.resources.exams ? [{ ...calculusExamContext, topic }] : []
)) ?? []
const mergedLimitExamBundle = calculusExamBundles.find(({ topic }) => topic.label === 'T01')
const t09ExamBundle = calculusExamBundles.find(({ topic }) => topic.label === 'T09')

let wrapper
let router
let scrollIntoViewDescriptor
let scrollIntoViewMock

async function settle() {
  await flushPromises()
  await vi.dynamicImportSettled()
  await flushPromises()
}

async function openPage(path, history = createMemoryHistory()) {
  router = createTeachingRouter(history)
  if (path !== undefined) await router.push(path)
  wrapper = mount(App, { attachTo: document.body, global: { plugins: [router] } })
  await router.isReady()
  await settle()
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  scrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView')
  scrollIntoViewMock = vi.fn()
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoViewMock,
  })
})
afterEach(() => {
  wrapper?.unmount()
  router?.options.history.destroy()
  wrapper = null
  router = null
  vi.restoreAllMocks()
  if (scrollIntoViewDescriptor) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', scrollIntoViewDescriptor)
  else delete HTMLElement.prototype.scrollIntoView
  document.body.innerHTML = ''
  window.history.replaceState({}, '', '/')
})

describe('teaching hub navigation', () => {
  it('navigates through AI W1 resources and applies its unit-level lesson-card layout', async () => {
    expect(course.runbookLayout).toBeUndefined()
    expect(week.runbookLayout).toBe('lesson-cards')
    await openPage('/')
    expect(document.title).toBe('Teaching Hub · 课程目录')
    expect(wrapper.find('.site-note').text()).toBe('2026 秋 · 课程准备')
    const courseLink = wrapper.findAll('.course-card').find((link) => link.attributes('href') === coursePath)
    expect(courseLink).toBeDefined()
    await courseLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(coursePath)
    expect(wrapper.find('.site-note').text()).toBe('2026 秋 · 按周准备')
    expect(wrapper.find('.directory-section-heading h2').text()).toBe('教学周')
    expect(wrapper.find('.week-card').exists()).toBe(true)
    expect(wrapper.find('.topic-card').exists()).toBe(false)

    const runbookLink = wrapper.findAll('.resource-runbook').find((link) => link.attributes('href') === `${weekPath}/runbook`)
    expect(runbookLink).toBeDefined()
    await runbookLink.trigger('click')
    await settle()
    expect(wrapper.find('.runbook-reader').exists()).toBe(true)
    expect(wrapper.find('.runbook-reader--lesson-cards').exists()).toBe(true)
    expect(wrapper.find('.route-toolbar h2').text()).toContain('本次课路线')

    await wrapper.findAll('.resource-tabs a')[1].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/1`)
    expect(wrapper.find('.slides-reader').exists()).toBe(true)

    await wrapper.find('.resource-tabs a:last-child').trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/guide`)
    expect(wrapper.find('.guide-reader').exists()).toBe(true)
    expect(wrapper.find('.guide-mini-content').exists()).toBe(false)
  })

  it('keeps the slide page in the URL during keyboard navigation', async () => {
    const deck = parseSlides(await loadContent(week.resources.slides))
    await openPage(`${weekPath}/slides/1`)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/2`)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/${deck.count}`)
  })

  it('switches topic slide lessons and restarts the displayed page count', async () => {
    expect(mergedLimitExamBundle).toBeDefined()
    const { term: itemTerm, course: itemCourse, topic } = mergedLimitExamBundle
    const path = `/terms/${itemTerm.id}/courses/${itemCourse.id}/topics/${topic.id}/slides`
    await openPage(`${path}/1`)
    expect(wrapper.findAll('.slide-lesson-tabs button').map((button) => button.text()))
      .toEqual(['第一次课', '第二次课'])
    expect(wrapper.find('.slide-progress').text()).toContain('1 / 7')

    await wrapper.findAll('.slide-lesson-tabs button')[1].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${path}/8`)
    expect(wrapper.find('.slide-progress').text()).toContain('1 / 10')
    expect(wrapper.find('.slide-previous').attributes('disabled')).toBeDefined()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await settle()
    expect(router.currentRoute.value.path).toBe(`${path}/9`)
    expect(wrapper.find('.slide-progress').text()).toContain('2 / 10')
  })

  it('shows an opted-in topic map and opens its runbook', async () => {
    expect(topicBundle).toBeDefined()
    const item = topicBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const itemTopicPath = `${itemCoursePath}/topics/${item.topic.id}`
    await openPage(itemCoursePath)

    expect(wrapper.find('.directory-section-heading h2').text()).toBe('专题地图')
    expect(wrapper.find('.site-note').text()).toBe('2026 秋 · 按专题准备')
    expect(wrapper.findAll('.topic-card')).toHaveLength(item.course.topicMap.length)
    expect(wrapper.find('.topic-meta').text()).toMatch(/^约 \d+ 次课 · 最晚完成 \d{4}-\d{2}-\d{2}$/)
    const runbookLink = wrapper.findAll('.resource-runbook')
      .find((link) => link.attributes('href') === `${itemTopicPath}/runbook`)
    expect(runbookLink).toBeDefined()

    await runbookLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${itemTopicPath}/runbook`)
    expect(wrapper.find('.runbook-reader--calculus-topic').exists()).toBe(true)
    expect(wrapper.find('.runbook-reader--lesson-cards').exists()).toBe(false)
    expect(wrapper.find('.route-toolbar h2').text()).toContain('专题路线')
    expect(wrapper.find('.resource-tabs').attributes('aria-label')).toBe('本专题材料')
  })

  it('registers every topic resource route without changing week route names', async () => {
    expect(topicBundle).toBeDefined()
    const item = topicBundle
    await openPage('/')
    const params = { termId: item.term.id, courseId: item.course.id, topicId: item.topic.id }
    const base = `/terms/${item.term.id}/courses/${item.course.id}/topics/${item.topic.id}`

    expect(router.resolve({ name: 'topic-runbook', params }).path).toBe(`${base}/runbook`)
    expect(router.resolve({ name: 'topic-slides', params: { ...params, page: 2 } }).path).toBe(`${base}/slides/2`)
    expect(router.resolve({ name: 'topic-guide', params }).path).toBe(`${base}/guide`)
    expect(router.resolve({ name: 'topic-exams', params }).path).toBe(`${base}/exams`)
    expect(router.resolve({ name: 'topic-demo', params: { ...params, demoId: 'example' } }).path).toBe(`${base}/demos/example`)
    expect(router.resolve({ name: 'runbook', params: { termId: term.id, courseId: course.id, weekId: week.id } }).path)
      .toBe(`${weekPath}/runbook`)
  })

  it('boots from a GitHub-Pages-friendly hash deep link', async () => {
    window.history.replaceState({}, '', `/#${weekPath}/runbook`)
    await openPage(undefined, createWebHashHistory('/'))
    expect(router.currentRoute.value.path).toBe(`${weekPath}/runbook`)
    expect(wrapper.find('.runbook-reader').exists()).toBe(true)
  })

  it('opens a declared topic demo from the course page', async () => {
    expect(topicDemoBundle).toBeDefined()
    const item = topicDemoBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const demoPath = `${itemCoursePath}/topics/${item.topic.id}/demos/${item.demo.id}`
    await openPage(itemCoursePath)
    const demoLink = wrapper.findAll('.resource-demo').find((link) => link.attributes('href') === demoPath)
    expect(demoLink).toBeDefined()
    await demoLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(demoPath)
    expect(wrapper.find('.sequence-limit-demo').exists()).toBe(true)
  })

  it('lists only non-empty calculus exam entries and opens the merged limit collection', async () => {
    expect(mergedLimitExamBundle).toBeDefined()
    const item = mergedLimitExamBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const examPath = `${itemCoursePath}/topics/${item.topic.id}/exams`
    await openPage(itemCoursePath)

    const examLinks = wrapper.findAll('.resource-exams')
    expect(examLinks).toHaveLength(9)
    expect(examLinks.map((link) => link.attributes('href'))).toEqual(calculusExamBundles.map(({ topic }) => (
      `${itemCoursePath}/topics/${topic.id}/exams`
    )))
    const examLink = examLinks.find((link) => link.attributes('href') === examPath)
    expect(examLink).toBeDefined()
    expect(examLink.find('small').text()).toBe('按年份浏览')
    await examLink.trigger('click')
    await settle()

    expect(router.currentRoute.value.path).toBe(examPath)
    expect(wrapper.find('.exam-reader').exists()).toBe(true)
    expect(wrapper.find('.exam-heading').exists()).toBe(true)
    expect(wrapper.find('.exam-empty').exists()).toBe(false)
    expect(wrapper.find('.exam-year').exists()).toBe(true)
    expect(wrapper.find('.exam-question').exists()).toBe(true)
    expect(wrapper.find('.exam-question .exam-source').text()).toBe('选择题｜1')
    expect(wrapper.find('.exam-question').attributes('aria-label')).toBe('2020 年选择题第 1 题，3 分')
    expect(wrapper.find('.resource-tabs a.router-link-exact-active').text()).toBe('真题')

    scrollIntoViewMock.mockClear()
    await wrapper.find('.exam-year-index button').trigger('click')
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'start' })
    expect(router.currentRoute.value.path).toBe(examPath)
  })

  it('opens the fundamental collection from the T09 review topic', async () => {
    expect(t09ExamBundle).toBeDefined()
    const item = t09ExamBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const examPath = `${itemCoursePath}/topics/${item.topic.id}/exams`
    await openPage(itemCoursePath)

    const examLink = wrapper.findAll('.resource-exams').find((link) => link.attributes('href') === examPath)
    expect(examLink).toBeDefined()
    expect(examLink.find('small').text()).toBe('基础知识')
    await examLink.trigger('click')
    await settle()

    expect(router.currentRoute.value.path).toBe(examPath)
    expect(wrapper.find('.exam-heading h1').text()).toBe('基础知识')
    expect(wrapper.find('.exam-question').exists()).toBe(true)
    expect(wrapper.find('.exam-empty').exists()).toBe(false)
  })

  it.each([
    '/unknown',
    '/terms/missing/courses/missing',
    `/terms/${term.id}/courses/${course.id}/weeks/missing/runbook`,
    `/terms/${term.id}/courses/${course.id}/weeks/${week.id}/demos/missing`,
    '/terms/2026-fall/courses/calculus-i/topics/missing/runbook',
    '/terms/2026-fall/courses/calculus-i/topics/topic-00-entering-calculus/exams',
    '/terms/2026-fall/courses/calculus-i/topics/topic-02-limit-properties-existence-operations/exams',
  ])('offers recovery for an unknown address: %s', async (path) => {
    await openPage(path)
    expect(wrapper.find('h1').text()).toBe('未找到课程或材料')
    await wrapper.find('.error-state a').trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe('/')
  })
})
