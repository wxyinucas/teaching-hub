import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import RunbookView from '../src/views/RunbookView.vue'

const fixtures = vi.hoisted(() => ({ topics: {}, sources: {} }))
vi.mock('../src/lib/catalog.js', () => ({
  findTopic: (_termId, _courseId, topicId) => fixtures.topics[topicId],
  findWeek: () => undefined,
  findMaterial: () => undefined,
  hasContent: (path) => path in fixtures.sources,
  loadContent: async (path) => fixtures.sources[path],
}))

let wrapper
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  fixtures.topics = {}
  fixtures.sources = {}
  window.sessionStorage.clear()
})

describe('topic runbook format', () => {
  it('opens untimed sections and keeps timed topics on their existing format after navigation', async () => {
    const course = { title: '示例课程', runbookLayout: 'calculus-topic' }
    fixtures.topics = {
      untimed: {
        course,
        topic: { label: 'T01', runbookFormat: 'cards', resources: { runbook: 'untimed.md' } },
      },
      timed: {
        course,
        topic: { label: 'T00', resources: { runbook: 'timed.md' } },
      },
    }
    fixtures.sources = {
      'untimed.md': '# T01｜专题台本\n## S1｜模型\n### 1｜数据与预测\n> 分清两个对象\n#### 记录\n写下区别。',
      'timed.md': '# T00｜计时台本\n## 第一次课\n### 0-50 | 第一课时\n讲解内容。',
    }
    wrapper = mount(RunbookView, {
      props: { termId: 'term', courseId: 'course', topicId: 'untimed' },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    await flushPromises()

    expect(wrapper.find('.runbook-reader--cards').exists()).toBe(true)
    expect(wrapper.find('.segment-time').exists()).toBe(false)
    expect(wrapper.find('.period-duration').exists()).toBe(false)
    expect(wrapper.find('h1').text()).toBe('专题台本')
    expect(wrapper.find('#route-title').text()).toContain('专题路线')
    expect(wrapper.find('#route-title').text()).toContain('1 个学习单元')
    expect(wrapper.find('.notes-heading').text()).toContain('教师提示')
    expect(wrapper.text()).not.toContain('个人提示')
    expect(document.title).toBe('T01 · 专题台本 · Teaching Hub')
    expect(wrapper.find('.segment-trigger').text()).toContain('1｜数据与预测')
    await wrapper.find('.segment-trigger').trigger('click')
    expect(wrapper.find('.notes-content').text()).toContain('写下区别。')

    await wrapper.setProps({ topicId: 'timed' })
    await flushPromises()
    expect(wrapper.find('.runbook-reader--cards').exists()).toBe(false)
    expect(wrapper.find('.runbook-reader--calculus-topic').exists()).toBe(true)
    expect(wrapper.find('.segment-time').text()).toContain('0–50')
    expect(wrapper.find('.period-duration').exists()).toBe(true)
    expect(wrapper.find('.error-state').exists()).toBe(false)
  })
})
