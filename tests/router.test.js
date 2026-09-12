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

  it('boots from a GitHub-Pages-friendly hash deep link', async () => {
    window.history.replaceState({}, '', `/#${weekPath}/runbook`)
    await openPage(undefined, createWebHashHistory('/'))
    expect(router.currentRoute.value.path).toBe(`${weekPath}/runbook`)
    expect(wrapper.find('.runbook-reader').exists()).toBe(true)
  })

  it.runIf(Boolean(unavailableResource))('treats an undeclared resource type as missing', async () => {
    const item = unavailableResource
    const suffix = item.kind === 'slides' ? 'slides/1' : item.kind
    const path = `/terms/${item.term.id}/courses/${item.course.id}/weeks/${item.week.id}/${suffix}`
    await openPage(path)
    expect(wrapper.find('h1').text()).toBe('未找到课程或材料')
  })

  it.each([
    '/unknown',
    '/terms/missing/courses/missing',
    `/terms/${term.id}/courses/${course.id}/weeks/missing/runbook`,
  ])('offers recovery for an unknown address: %s', async (path) => {
    await openPage(path)
    expect(wrapper.find('h1').text()).toBe('未找到课程或材料')
    await wrapper.find('.error-state a').trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe('/')
  })
})
