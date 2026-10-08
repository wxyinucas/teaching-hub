import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { catalog } from '../src/lib/catalog.js'
import DemoView from '../src/views/DemoView.vue'

const demoBundle = catalog.terms.flatMap((term) => term.courses.flatMap((course) => [
  ...course.weeks.flatMap((week) => (
    week.demos ?? []).map((demo) => ({ term, course, week, topic: null, demo }))),
  ...course.topics.flatMap((topic) => (
    topic.demos ?? []).map((demo) => ({ term, course, week: null, topic, demo }))),
])).at(0)

if (!demoBundle) throw new Error('DemoView 测试至少需要一个已登记的演示。')

let wrapper
let restoreFullscreen

function installFullscreenMock(supported = true) {
  const requestDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'requestFullscreen')
  const exitDescriptor = Object.getOwnPropertyDescriptor(document, 'exitFullscreen')
  const elementDescriptor = Object.getOwnPropertyDescriptor(document, 'fullscreenElement')
  let fullscreenElement = null

  const requestFullscreen = vi.fn(function requestFullscreen() {
    fullscreenElement = this
    document.dispatchEvent(new Event('fullscreenchange'))
    return Promise.resolve()
  })
  const exitFullscreen = vi.fn(() => {
    fullscreenElement = null
    document.dispatchEvent(new Event('fullscreenchange'))
    return Promise.resolve()
  })

  Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
    configurable: true,
    value: supported ? requestFullscreen : undefined,
  })
  Object.defineProperty(document, 'exitFullscreen', {
    configurable: true,
    value: supported ? exitFullscreen : undefined,
  })
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    get: () => fullscreenElement,
  })

  function simulateBrowserExit() {
    fullscreenElement = null
    document.dispatchEvent(new Event('fullscreenchange'))
  }

  function restore() {
    if (requestDescriptor) Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', requestDescriptor)
    else delete HTMLElement.prototype.requestFullscreen
    if (exitDescriptor) Object.defineProperty(document, 'exitFullscreen', exitDescriptor)
    else delete document.exitFullscreen
    if (elementDescriptor) Object.defineProperty(document, 'fullscreenElement', elementDescriptor)
    else delete document.fullscreenElement
  }

  return { requestFullscreen, exitFullscreen, simulateBrowserExit, restore }
}

function mountDemo() {
  wrapper = mount(DemoView, {
    props: {
      termId: demoBundle.term.id,
      courseId: demoBundle.course.id,
      weekId: demoBundle.week?.id,
      topicId: demoBundle.topic?.id,
      demoId: demoBundle.demo.id,
    },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

afterEach(() => {
  wrapper?.unmount()
  restoreFullscreen?.()
  wrapper = null
  restoreFullscreen = null
})

describe('demo fullscreen reader', () => {
  it('enters, exits, and follows a browser-initiated fullscreen exit', async () => {
    const fullscreen = installFullscreenMock()
    restoreFullscreen = fullscreen.restore
    mountDemo()
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.demo-fullscreen')
    expect(button.attributes('aria-pressed')).toBe('false')
    await button.trigger('click')
    expect(fullscreen.requestFullscreen).toHaveBeenCalledOnce()
    expect(button.text()).toBe('退出全屏')
    expect(button.attributes('aria-pressed')).toBe('true')

    fullscreen.simulateBrowserExit()
    await wrapper.vm.$nextTick()
    expect(button.text()).toBe('全屏')
    expect(button.attributes('aria-pressed')).toBe('false')

    await button.trigger('click')
    await button.trigger('click')
    expect(fullscreen.exitFullscreen).toHaveBeenCalledOnce()
    expect(button.text()).toBe('全屏')
  })

  it('omits the control when fullscreen is unavailable', async () => {
    const fullscreen = installFullscreenMock(false)
    restoreFullscreen = fullscreen.restore
    mountDemo()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.demo-fullscreen').exists()).toBe(false)
  })

  it('renders every demo declared by calculus topic T03', () => {
    const term = catalog.terms.find((item) => item.id === '2026-fall')
    const course = term?.courses.find((item) => item.id === 'calculus-i')
    const topic = course?.topics.find((item) => item.id === 'topic-03-derivatives-and-differentials')
    const selectors = {
      derivatives: '.derivatives-demo',
    }

    expect(topic?.demos?.map((demo) => demo.id)).toEqual(Object.keys(selectors))

    topic.demos.forEach((demo) => {
      const demoWrapper = mount(DemoView, {
        props: {
          termId: term.id,
          courseId: course.id,
          topicId: topic.id,
          demoId: demo.id,
        },
        global: { stubs: { RouterLink: RouterLinkStub } },
      })
      expect(demoWrapper.find(selectors[demo.id]).exists()).toBe(true)
      demoWrapper.unmount()
    })
  })
})
