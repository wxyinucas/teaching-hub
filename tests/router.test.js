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
  ['runbook', 'slides', 'guide'].every((kind) => week.resources[kind])
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
const examBundle = catalog.terms.flatMap((itemTerm) => itemTerm.courses.flatMap((itemCourse) => (
  itemCourse.topics.flatMap((topic) => (
    topic.resources.exams ? [{ term: itemTerm, course: itemCourse, topic }] : []
  ))
))).at(0)
const materialBundle = catalog.terms.flatMap((itemTerm) => itemTerm.courses.flatMap((itemCourse) => (
  itemCourse.materials.map((material) => ({ term: itemTerm, course: itemCourse, material }))
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

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})
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
  it('opens material resources with their own names and keeps slides inside their declared identity', async () => {
    expect(materialBundle).toBeDefined()
    const item = materialBundle
    const directory = `/terms/${item.term.id}/courses/${item.course.id}`
    const base = `${directory}/authors/${item.material.authorId}/materials/${item.material.id}/resources`
    await openPage(directory)
    expect(wrapper.find('.site-note').text()).toContain('按材料学习')
    const notes = item.material.resources.find((resource) => resource.renderer === 'guide')
    const slides = item.material.resources.find((resource) => resource.renderer === 'slides')
    const cards = item.material.resources.find((resource) => resource.renderer === 'cards')

    const noteLink = wrapper.findAll('.resource-link').find((link) => link.attributes('href') === `${base}/${notes.id}`)
    expect(noteLink.text()).toContain(notes.title)
    await noteLink.trigger('click')
    await settle()
    expect(wrapper.find('.guide-reader').exists()).toBe(true)
    expect(wrapper.find('.breadcrumbs [aria-current]').text()).toBe(notes.title)
    expect(wrapper.findAll('.resource-tabs a').map((link) => link.text())).toEqual(item.material.resources.map((resource) => resource.title))

    await wrapper.findAll('.resource-tabs a').find((link) => link.attributes('href') === `${base}/${slides.id}/1`).trigger('click')
    await settle()
    expect(wrapper.find('.slides-reader').exists()).toBe(true)
    expect(wrapper.find('.site-shell').classes()).toContain('is-slide-route')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await settle()
    expect(router.currentRoute.value.path).toBe(`${base}/${slides.id}/2`)

    await wrapper.findAll('.resource-tabs a').find((link) => link.attributes('href') === `${base}/${cards.id}`).trigger('click')
    await settle()
    expect(wrapper.find('.runbook-reader--cards').exists()).toBe(true)
    expect(wrapper.find('.segment-time').exists()).toBe(false)
    expect(wrapper.find('.site-shell').classes()).not.toContain('is-slide-route')
    expect(wrapper.find('.breadcrumbs [aria-current]').text()).toBe(cards.title)

    await router.push(`${directory}/authors/wrong-author/materials/${item.material.id}/resources/${notes.id}`)
    await settle()
    expect(wrapper.find('.error-state').exists()).toBe(true)
  })

  it('allows two named resources to share the same guide reader and source', async () => {
    expect(materialBundle).toBeDefined()
    const item = materialBundle
    const original = item.material.resources.find((resource) => resource.renderer === 'guide')
    const alternative = { ...original, id: 'comparison', title: '观点对照' }
    item.material.resources.push(alternative)
    try {
      const base = `/terms/${item.term.id}/courses/${item.course.id}/authors/${item.material.authorId}/materials/${item.material.id}/resources`
      await openPage(`${base}/${original.id}`)
      await wrapper.findAll('.resource-tabs a').find((link) => link.attributes('href') === `${base}/${alternative.id}`).trigger('click')
      await settle()
      expect(router.currentRoute.value.path).toBe(`${base}/${alternative.id}`)
      expect(wrapper.find('.guide-reader').exists()).toBe(true)
      expect(wrapper.find('.breadcrumbs [aria-current]').text()).toBe(alternative.title)
      expect(document.title).toContain(alternative.title)
    } finally {
      item.material.resources.pop()
    }
  })

  it('opens each declared weekly resource from the course directory', async () => {
    await openPage('/')
    const courseLink = wrapper.findAll('.course-card').find((link) => link.attributes('href') === coursePath)
    expect(courseLink).toBeDefined()
    await courseLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(coursePath)

    const runbookLink = wrapper.findAll('.resource-runbook').find((link) => link.attributes('href') === `${weekPath}/runbook`)
    expect(runbookLink).toBeDefined()
    await runbookLink.trigger('click')
    await settle()
    expect(wrapper.find('.runbook-reader').exists()).toBe(true)

    const slidesLink = wrapper.findAll('.resource-tabs a')
      .find((link) => link.attributes('href') === `${weekPath}/slides/1`)
    expect(slidesLink).toBeDefined()
    await slidesLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/1`)
    expect(wrapper.find('.slides-reader').exists()).toBe(true)

    const guideLink = wrapper.findAll('.resource-tabs a')
      .find((link) => link.attributes('href') === `${weekPath}/guide`)
    expect(guideLink).toBeDefined()
    await guideLink.trigger('click')
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

  it('opens a declared topic runbook from the course directory', async () => {
    expect(topicBundle).toBeDefined()
    const item = topicBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const itemTopicPath = `${itemCoursePath}/topics/${item.topic.id}`
    await openPage(itemCoursePath)

    const runbookLink = wrapper.findAll('.resource-runbook')
      .find((link) => link.attributes('href') === `${itemTopicPath}/runbook`)
    expect(runbookLink).toBeDefined()

    await runbookLink.trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${itemTopicPath}/runbook`)
    expect(wrapper.find('.runbook-reader').exists()).toBe(true)
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
    expect(wrapper.find('.demo-reader').exists()).toBe(true)
  })

  it('opens a declared exam collection from the course directory', async () => {
    expect(examBundle).toBeDefined()
    const item = examBundle
    const itemCoursePath = `/terms/${item.term.id}/courses/${item.course.id}`
    const examPath = `${itemCoursePath}/topics/${item.topic.id}/exams`
    await openPage(itemCoursePath)

    const examLink = wrapper.findAll('.resource-exams').find((link) => link.attributes('href') === examPath)
    expect(examLink).toBeDefined()
    await examLink.trigger('click')
    await settle()

    expect(router.currentRoute.value.path).toBe(examPath)
    expect(wrapper.find('.exam-reader').exists()).toBe(true)
  })

  it.each([
    '/unknown',
    `/terms/${term.id}/courses/${course.id}/weeks/missing/runbook`,
  ])('offers recovery for an unknown address: %s', async (path) => {
    await openPage(path)
    expect(wrapper.find('.error-state').exists()).toBe(true)
    await wrapper.find('.error-state a').trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe('/')
  })
})
