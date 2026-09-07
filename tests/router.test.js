import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createWebHashHistory } from 'vue-router'
import App from '../src/App.vue'
import { createTeachingRouter } from '../src/router.js'

const coursePath = '/terms/2026-fall/courses/ai-agents'
const weekPath = `${coursePath}/weeks/week-01`
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
  it('navigates from the term homepage across all three W1 resources', async () => {
    await openPage('/')
    expect(document.title).toBe('Teaching Hub · 课程目录')
    expect(wrapper.findAll('.course-card')).toHaveLength(2)
    expect(wrapper.findAll('.course-card')[0].text()).toContain('16 周课程')
    expect(wrapper.findAll('.course-card')[1].text()).not.toContain('等待首周内容')
    await wrapper.findAll('.course-card')[0].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(coursePath)
    expect(wrapper.findAll('.week-card')).toHaveLength(16)
    expect(wrapper.findAll('.resource-link')).toHaveLength(9)
    expect(wrapper.findAll('.week-card')[3].find('a').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('尚未开放')
    await wrapper.find('.resource-runbook').trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/runbook`)
    expect(wrapper.findAll('.segment-trigger')).toHaveLength(9)
    await wrapper.findAll('.resource-tabs a')[1].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/1`)
    expect(wrapper.find('.slide-cover').exists()).toBe(true)
    await wrapper.findAll('.resource-tabs a')[2].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/guide`)
    expect(wrapper.find('.guide-reader').text()).toContain('W1 学生行动指南')
  })

  it('updates a stable slide page route with keyboard navigation', async () => {
    await openPage(`${weekPath}/slides/1`)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/2`)
    expect(wrapper.find('.slide-section').exists()).toBe(true)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
    await settle()
    expect(router.currentRoute.value.path).toBe(`${weekPath}/slides/17`)
  })

  it('shows the calculus course without inventing empty weeks', async () => {
    await openPage('/terms/2026-fall/courses/calculus-i')
    expect(wrapper.find('.empty-course').text()).toContain('还没有登记教学周')
    expect(wrapper.find('.week-card').exists()).toBe(false)
  })

  it.each([
    ['week-02', 'W2 学生行动指南', 17],
    ['week-03', 'W3 学生行动指南', 9],
  ])('opens the runbook, slides and guide for %s', async (weekId, guideTitle, segmentCount) => {
    const path = `${coursePath}/weeks/${weekId}`
    await openPage(`${path}/runbook`)
    expect(wrapper.findAll('.segment-trigger')).toHaveLength(segmentCount)
    await wrapper.findAll('.resource-tabs a')[1].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${path}/slides/1`)
    expect(wrapper.find('.slide-cover').exists()).toBe(true)
    await wrapper.findAll('.resource-tabs a')[2].trigger('click')
    await settle()
    expect(router.currentRoute.value.path).toBe(`${path}/guide`)
    expect(wrapper.find('.guide-reader').text()).toContain(guideTitle)
  })

  it('boots from a GitHub-Pages-friendly hash deep link', async () => {
    window.history.replaceState({}, '', `/#${weekPath}/runbook`)
    await openPage(undefined, createWebHashHistory('/'))
    expect(router.currentRoute.value.path).toBe(`${weekPath}/runbook`)
    expect(wrapper.findAll('.segment-trigger')).toHaveLength(9)
  })

  it.each([
    '/unknown',
    '/terms/missing/courses/ai-agents',
    `${coursePath}/weeks/missing/runbook`,
    `${coursePath}/weeks/week-04/runbook`,
  ])(
    'offers recovery for an unknown address: %s', async (path) => {
      await openPage(path)
      expect(wrapper.find('h1').text()).toBe('未找到课程或材料')
      await wrapper.find('.error-state a').trigger('click')
      await settle()
      expect(router.currentRoute.value.path).toBe('/')
    },
  )
})
