import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import RunbookReader from '../src/components/runbook/RunbookReader.vue'

const source = [
  '# T05｜阅读位置测试',
  '## 第一次课 · 旧内容',
  '### 0-50 | 第一段',
  '#### 最初的标题',
  '旧内容。',
  '### 50-100 | 第二段',
  '第二段正文。',
  '## 第二次课 · 当前内容',
  '### 0-50 | 第三段',
  '#### 当前定义',
  '正在阅读的内容。',
  '### 50-100 | 第四段',
  '第四段正文。',
].join('\n')
const changedSource = source.replace('#### 当前定义', '#### 插入的小节\n新增内容。\n#### 当前定义')
const props = { source, file: 'topic-05/runbook.md', variant: 'calculus-topic' }
const key = 'teaching-hub:runbook-position:' + props.file
let wrapper
let frames
let frameId

function rect(top = 0, height = 0) {
  return { top, bottom: top + height, left: 0, right: 800, width: 800, height }
}

// Model document coordinates, including an inserted section above the paragraph
// being read. scrollTo moves the viewport, as it would in a real browser.
function layout(element) {
  if (element.closest('[style*="display: none"]')) return rect()
  const shifted = Boolean(document.querySelector('.notes-content')?.closest('.runbook-reader')
    ?.textContent.includes('插入的小节'))
  const extra = shifted ? 300 : 0
  const section = element.closest('[data-reading-section]')
  const second = section?.dataset.readingSection === '第二次课'
  const start = second ? 1200 + extra : 200
  let top
  let height
  if (element.matches('[data-reading-section]')) {
    top = start
    height = second ? 1700 : 800 + extra
  } else if (element.matches('[data-reading-segment]')) {
    const later = element.dataset.readingSegment.endsWith('50-100')
    top = start + (later ? 1200 : 100)
    height = element.classList.contains('is-open') ? 1000 : 100
  } else if (second && element.matches('.notes-content h4')) {
    top = element.textContent === '当前定义' ? 1460 + extra : 1360
    height = 30
  } else if (second && element.matches('.notes-content p')) {
    top = element.textContent === '正在阅读的内容。' ? 1500 + extra : 1400
    height = 90
  } else return rect()
  return rect(top - window.scrollY, height)
}

async function settleFrames() {
  await flushPromises()
  for (let turn = 0; frames.size && turn < 8; turn += 1) {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((callback) => callback(0))
    await flushPromises()
  }
  expect(frames.size).toBe(0)
}

async function startReading() {
  wrapper = mount(RunbookReader, { attachTo: document.body, props })
  await settleFrames()
  await wrapper.findAll('.segment-trigger')[2].trigger('click')
  window.scrollY = 1350
  window.dispatchEvent(new Event('scroll'))
  await settleFrames()
  expect(wrapper.findAll('.topic-lesson-index button')[1].attributes('aria-current')).toBe('location')
  expect(JSON.parse(window.sessionStorage.getItem(key)).block.text).toBe('正在阅读的内容。')
}

beforeEach(() => {
  window.sessionStorage.clear()
  frames = new Map()
  frameId = 0
  vi.stubGlobal('innerHeight', 800)
  vi.stubGlobal('scrollY', 0)
  vi.stubGlobal('scrollX', 0)
  vi.stubGlobal('requestAnimationFrame', (callback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id) => frames.delete(id))
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () { return layout(this) })
  vi.spyOn(window, 'scrollTo').mockImplementation(({ top }) => { window.scrollY = top })
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  window.sessionStorage.clear()
  document.body.innerHTML = ''
})

describe('runbook viewport restoration', () => {
  it('keeps the same content offset and current lesson after inserting content above it', async () => {
    await startReading()
    await wrapper.find('.topic-floating-nav-toggle').trigger('click')
    expect(wrapper.find('.topic-floating-nav-toggle').attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ source: changedSource })
    await settleFrames()

    const current = wrapper.findAll('.notes-content p').find((item) => item.text() === '正在阅读的内容。')
    expect(current.element.getBoundingClientRect().top).toBe(150)
    expect(window.scrollY).toBe(1650)
    expect(wrapper.findAll('.topic-lesson-index button')[1].attributes('aria-current')).toBe('location')
    expect(wrapper.find('.topic-floating-nav-toggle').attributes('aria-expanded')).toBe('false')
    expect(wrapper.findAll('.segment-trigger')[2].attributes('aria-expanded')).toBe('true')
  })

  it('restores the reading position and expanded card after remounting the same file', async () => {
    await startReading()
    window.dispatchEvent(new Event('pagehide'))
    wrapper.unmount()
    wrapper = null
    window.scrollY = 0
    wrapper = mount(RunbookReader, { attachTo: document.body, props })
    await settleFrames()

    expect(window.scrollY).toBe(1350)
    expect(wrapper.findAll('.segment-trigger')[2].attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('.topic-lesson-index button')[1].attributes('aria-current')).toBe('location')
  })

  it('does not apply one file’s reading position to a different file', async () => {
    await startReading()
    window.scrollTo.mockClear()
    await wrapper.setProps({ file: 'topic-06/runbook.md' })
    await settleFrames()

    expect(window.scrollTo).not.toHaveBeenCalled()
    expect(wrapper.findAll('.segment-trigger').every((item) => item.attributes('aria-expanded') === 'false')).toBe(true)
    expect(JSON.parse(window.sessionStorage.getItem(key)).block.text).toBe('正在阅读的内容。')
  })

  it('retains the last valid reading position through a temporary Markdown parse error', async () => {
    await startReading()
    await wrapper.setProps({ source: '# 临时不完整的台本' })
    await settleFrames()
    expect(wrapper.find('.error-state').exists()).toBe(true)
    window.scrollY = 0
    await wrapper.setProps({ source })
    await settleFrames()

    expect(window.scrollY).toBe(1350)
    expect(wrapper.findAll('.segment-trigger')[2].attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('.topic-lesson-index button')[1].attributes('aria-current')).toBe('location')
  })
})
