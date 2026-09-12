import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import RunbookReader from '../src/components/runbook/RunbookReader.vue'
import SegmentNotes from '../src/components/runbook/SegmentNotes.vue'
import SlidesReader from '../src/components/slides/SlidesReader.vue'
import { parseSlides } from '../src/lib/slides.js'
import runbookSource from '../terms/2026-fall/courses/ai-agents/weeks/week-01/runbook.md?raw'
import slidesSource from '../terms/2026-fall/courses/ai-agents/weeks/week-01/slides.md?raw'

let wrapper
let restoreFullscreen
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  restoreFullscreen?.()
  restoreFullscreen = null
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

function installFullscreenMock() {
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

  Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { configurable: true, value: requestFullscreen })
  Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: exitFullscreen })
  Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => fullscreenElement })

  restoreFullscreen = () => {
    if (requestDescriptor) Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', requestDescriptor)
    else delete HTMLElement.prototype.requestFullscreen
    if (exitDescriptor) Object.defineProperty(document, 'exitFullscreen', exitDescriptor)
    else delete document.exitFullscreen
    if (elementDescriptor) Object.defineProperty(document, 'fullscreenElement', elementDescriptor)
    else delete document.fullscreenElement
  }

  return { requestFullscreen, exitFullscreen }
}

describe('runbook disclosure', () => {
  it('opens multiple cards independently and collapses all', async () => {
    wrapper = mount(RunbookReader, { props: { source: runbookSource, file: 'runbook.md' } })
    const triggers = wrapper.findAll('.segment-trigger')
    expect(triggers).toHaveLength(15)
    expect(wrapper.find('.period-boundary').exists()).toBe(false)
    await triggers[0].trigger('click')
    await triggers[4].trigger('click')
    expect(wrapper.find('#segment-1-notes').isVisible()).toBe(true)
    expect(wrapper.find('#segment-5-notes').isVisible()).toBe(true)
    await wrapper.find('.collapse-all').trigger('click')
    expect(wrapper.findAll('.segment-trigger').every((trigger) => trigger.attributes('aria-expanded') === 'false')).toBe(true)
    expect(wrapper.find('.collapse-all').attributes('disabled')).toBeDefined()
  })

  it('shows a non-interactive boundary between two 50-minute periods', () => {
    const source = [
      '# W1｜双课时台本',
      '',
      '## 第一次课 · 两节连上',
      '',
      '### 0-20 | 第一段',
      '### 20-50 | 第二段',
      '### 50-75 | 第三段',
      '### 75-100 | 第四段',
    ].join('\n')
    wrapper = mount(RunbookReader, { props: { source, file: 'runbook.md' } })

    expect(wrapper.findAll('.segment-trigger')).toHaveLength(4)
    expect(wrapper.findAll('.period-boundary')).toHaveLength(1)
    const boundary = wrapper.find('.period-boundary')
    expect(boundary.attributes('role')).toBe('separator')
    expect(boundary.attributes('aria-label')).toBe('第 2 课时从第 50 分钟开始')
    expect(boundary.text()).toContain('第 2 课时')
    expect(boundary.text()).toContain('50–100 min')
    expect(boundary.element.tagName).toBe('DIV')
  })

  it('copies fenced teaching material without executing it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    wrapper = mount(SegmentNotes, { props: { source: '```bash\ncode .\n```' } })
    await wrapper.find('[data-copy-code]').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('code .\n')
  })

  it('mounts accessible inline and display mathematics in note bodies', () => {
    wrapper = mount(SegmentNotes, { props: { source: '行内 $x^2$。\n\n$$\\int_0^1 x\\,dx$$' } })
    expect(wrapper.find('.katex').exists()).toBe(true)
    expect(wrapper.find('.katex-display').exists()).toBe(true)
    expect(wrapper.find('math').exists()).toBe(true)
  })
})

describe('slides reader', () => {
  it('uses explicit controls and keyboard events to request page changes', async () => {
    const deck = parseSlides(slidesSource)
    wrapper = mount(SlidesReader, { attachTo: document.body, props: { deck, page: 1 } })
    await wrapper.find('.slide-next').trigger('click')
    expect(wrapper.emitted('change').at(-1)).toEqual([2])
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
    expect(wrapper.emitted('change').at(-1)).toEqual([17])
  })

  it('enters and exits fullscreen while preserving the slide reader', async () => {
    const { requestFullscreen, exitFullscreen } = installFullscreenMock()
    const deck = parseSlides(slidesSource)
    wrapper = mount(SlidesReader, { attachTo: document.body, props: { deck, page: 1 } })
    await flushPromises()
    const fullscreen = wrapper.find('.slide-fullscreen')

    expect(fullscreen.attributes('aria-pressed')).toBe('false')
    await fullscreen.trigger('click')
    await flushPromises()
    expect(requestFullscreen).toHaveBeenCalledOnce()
    expect(fullscreen.text()).toBe('退出全屏')
    expect(fullscreen.attributes('aria-pressed')).toBe('true')

    await fullscreen.trigger('click')
    await flushPromises()
    expect(exitFullscreen).toHaveBeenCalledOnce()
    expect(fullscreen.text()).toBe('全屏')
    expect(fullscreen.attributes('aria-pressed')).toBe('false')
  })

  it('omits the fullscreen control when the browser does not support it', () => {
    const deck = parseSlides(slidesSource)
    wrapper = mount(SlidesReader, { props: { deck, page: 1 } })
    expect(wrapper.find('.slide-fullscreen').exists()).toBe(false)
  })

  it('renders a vertical content list with a separate closing line', () => {
    const deck = parseSlides(slidesSource)
    wrapper = mount(SlidesReader, { props: { deck, page: 4 } })
    expect(wrapper.find('.slide-content.has-footer').exists()).toBe(true)
    expect(wrapper.findAll('.slide-content-body li')).toHaveLength(3)
    expect(wrapper.find('.slide-footer').text()).toContain('哪些反馈对我的成长真正重要')
  })

  it('keeps an ordinary content page footer-free', () => {
    const deck = parseSlides('# 普通页面\n\n- 一项内容')
    wrapper = mount(SlidesReader, { props: { deck, page: 1 } })
    expect(wrapper.find('.slide-content').exists()).toBe(true)
    expect(wrapper.find('.slide-content.has-footer').exists()).toBe(false)
    expect(wrapper.find('.slide-footer').exists()).toBe(false)
  })

  it('copies the complete prompt from a prompt page', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const deck = parseSlides(slidesSource)
    wrapper = mount(SlidesReader, { props: { deck, page: 13 } })
    await wrapper.find('.prompt-heading button').trigger('click')
    await flushPromises()
    expect(writeText.mock.calls[0][0]).toContain('证据不足不得宣布 READY-WSL')
  })
})
