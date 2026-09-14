import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createWebHashHistory } from 'vue-router'
import App from '../src/App.vue'
import { catalog, loadContent } from '../src/lib/catalog.js'
import { parseSlides } from '../src/lib/slides.js'
import { createTeachingRouter } from '../src/router.js'

const bundle = catalog.terms.flatMap((term) => term.courses.flatMap((course) => (
  course.weeks.map((week) => ({ term, course, week }))
))).find(({ week }) => ['runbook', 'slides', 'guide'].every((kind) => week.resources[kind]))

if (!bundle) throw new Error('路由测试至少需要一个同时登记台本、Slides 与学生指南的教学周。')

const { term, course, week } = bundle
const coursePath = `/terms/${term.id}/courses/${course.id}`
const weekPath = `${coursePath}/weeks/${week.id}`
const unavailableResource = catalog.terms.flatMap((itemTerm) => itemTerm.courses.flatMap((itemCourse) => (
  itemCourse.weeks.flatMap((itemWeek) => ['runbook', 'slides', 'guide'].flatMap((kind) => (
    itemWeek.resources[kind] ? [] : [{ term: itemTerm, course: itemCourse, week: itemWeek, kind }]
  )))
))).at(0)
const demoBundle = catalog.terms.flatMap((itemTerm) => itemTerm.courses.flatMap((itemCourse) => (
  itemCourse.weeks.flatMap((itemWeek) => (itemWeek.demos ?? []).map((demo) => ({
    term: itemTerm, course: itemCourse, week: itemWeek, demo,
  })))
))).at(0)
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

let wrapper
let router

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

beforeEach(() => { vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) })
afterEach(() => {
  wrapper?.unmount()
  router?.options.history.destroy()
  wrapper = null
  router = null
  vi.restoreAllMocks()
  document.body.innerHTML = ''
  window.history.replaceState({}, '', '/')
})

describe('teaching hub navigation', () => {
  it('navigates from the homepage through every resource type in one declared week', async () => {
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
    expect(wrapper.find('.runbook-reader').classes()).toEqual(['runbook-reader'])

    await wrapper.findAll('.resource-tabs a')[1].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/1`)
    expect(wrapper.find('.slides-reader').exists()).toBe(true)

    await wrapper.find('.resource-tabs a:last-child').trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/guide`)
    expect(wrapper.find('.guide-reader').exists()).toBe(true)
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

  it('shows an opted-in topic map and opens its runbook', async () => {
    expect(topicBundle).toBeDefined()
    const item = topicBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const itemTopicPath = `${itemCoursePath}/topics/${item.topic.id}`
    await openPage(itemCoursePath)

    expect(wrapper.find('.directory-section-heading h2').text()).toBe('专题地图')
    expect(wrapper.find('.site-note').text()).toBe('2026 秋 · 按专题准备')
    expect(wrapper.findAll('.topic-card')).toHaveLength(item.course.topicMap.length)
    expect(wrapper.find('.topic-meta').text()).toMatch(/^约 \d+ 次课$/)
    const runbookLink = wrapper.findAll('.resource-runbook')
      .find((link) => link.attributes('href') === `${itemTopicPath}/runbook`)
    expect(runbookLink).toBeDefined()

    await runbookLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${itemTopicPath}/runbook`)
    expect(wrapper.find('.runbook-reader--calculus-topic').exists()).toBe(true)
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

  it.runIf(Boolean(demoBundle))('opens a declared week demo from the course page', async () => {
    const item = demoBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const demoPath = `${itemCoursePath}/weeks/${item.week.id}/demos/${item.demo.id}`
    await openPage(itemCoursePath)
    const demoLink = wrapper.findAll('.resource-demo').find((link) => link.attributes('href') === demoPath)
    expect(demoLink).toBeDefined()
    await demoLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(demoPath)
    expect(wrapper.find('.sequence-limit-demo').exists()).toBe(true)
  })

  it.runIf(Boolean(topicDemoBundle))('opens a declared topic demo from the course page', async () => {
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

  it.runIf(Boolean(unavailableResource))('treats an undeclared resource type as missing', async () => {
    const item = unavailableResource
    const suffix = item.kind === 'slides' ? 'slides/1' : item.kind
    const path = `/terms/${item.term.id}/courses/${item.course.id}/weeks/${item.week.id}/${suffix}`
    await openPage(path)
    expect(wrapper.find('h1').text()).toBe('未找到课程或材料')
    expect(wrapper.find('.error-state').text()).toContain('教学周、专题或资源')
  })

  it.each([
    '/unknown',
    '/terms/missing/courses/missing',
    `/terms/${term.id}/courses/${course.id}/weeks/missing/runbook`,
    `/terms/${term.id}/courses/${course.id}/weeks/${week.id}/demos/missing`,
    '/terms/2026-fall/courses/calculus-i/topics/missing/runbook',
  ])('offers recovery for an unknown address: %s', async (path) => {
    await openPage(path)
    expect(wrapper.find('h1').text()).toBe('未找到课程或材料')
    await wrapper.find('.error-state a').trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe('/')
  })
})
