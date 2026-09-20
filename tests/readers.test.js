import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import RunbookReader from '../src/components/runbook/RunbookReader.vue'
import SegmentNotes from '../src/components/runbook/SegmentNotes.vue'
import SlidesReader from '../src/components/slides/SlidesReader.vue'
import { parseSlides } from '../src/lib/slides.js'

const runbookSource = [
  '# W1｜示例台本',
  '## 第一课时',
  '### 0-20 | 第一段',
  '> 第一段落点',
  '教师提示一。',
  '### 20-50 | 第二段',
  '> 第二段落点',
  '教师提示二。',
].join('\n')

const slidesSource = [
  '<!-- layout: cover -->',
  '# 示例课件',
  '---',
  '<!-- section: 第一课时 -->',
  '---',
  '# 纵向列表',
  '- 第一项',
  '- 第二项',
  '- 第三项',
  '<!-- footer -->',
  '一句落点。',
  '---',
  '<!-- layout: prompt -->',
  '# 示例任务',
  '请只执行指定命令。',
].join('\n')

let wrapper
let restoreFullscreen
let restoreScrollIntoView
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  restoreFullscreen?.()
  restoreFullscreen = null
  restoreScrollIntoView?.()
  restoreScrollIntoView = null
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  window.sessionStorage.clear()
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
    expect(triggers).toHaveLength(2)
    expect(wrapper.find('.route-toolbar').text()).toContain('2 个教学动作段')
    expect(wrapper.find('.runbook-reader').classes()).toEqual(['runbook-reader'])
    await triggers[0].trigger('click')
    await triggers[1].trigger('click')
    expect(wrapper.find('#segment-1-notes').isVisible()).toBe(true)
    expect(wrapper.find('#segment-2-notes').isVisible()).toBe(true)
    await wrapper.find('.collapse-all').trigger('click')
    expect(triggers.every((trigger) => trigger.attributes('aria-expanded') === 'false')).toBe(true)
    expect(wrapper.find('.collapse-all').attributes('disabled')).toBeDefined()

    wrapper.unmount()
    wrapper = mount(RunbookReader, { props: { source: runbookSource, file: 'runbook.md' } })
    await flushPromises()
    expect(wrapper.findAll('.segment-trigger').every(
      (trigger) => trigger.attributes('aria-expanded') === 'false',
    )).toBe(true)
  })

  it('keeps open cards across content updates and drops cards that no longer exist', async () => {
    wrapper = mount(RunbookReader, { props: { source: runbookSource, file: 'runbook.md' } })
    await wrapper.findAll('.segment-trigger')[0].trigger('click')

    await wrapper.setProps({ source: runbookSource.replace('教师提示一。', '教师提示一，已更新。') })
    await flushPromises()
    expect(wrapper.findAll('.segment-trigger')[0].attributes('aria-expanded')).toBe('true')

    const updatedSource = wrapper.props('source')
    wrapper.unmount()
    wrapper = mount(RunbookReader, { props: { source: updatedSource, file: 'runbook.md' } })
    await flushPromises()
    expect(wrapper.findAll('.segment-trigger')[0].attributes('aria-expanded')).toBe('true')

    await wrapper.findAll('.segment-trigger')[0].trigger('click')
    await wrapper.findAll('.segment-trigger')[1].trigger('click')
    await wrapper.setProps({ source: runbookSource.split('### 20-50')[0].trim() })
    await flushPromises()
    expect(wrapper.find('.collapse-all').attributes('disabled')).toBeDefined()

    wrapper.unmount()
    wrapper = mount(RunbookReader, { props: { source: runbookSource, file: 'another-runbook.md' } })
    await flushPromises()
    expect(wrapper.findAll('.segment-trigger')[0].attributes('aria-expanded')).toBe('false')
  })

  it('shows a non-interactive boundary between two 50-minute periods', () => {
    const source = [
      '# W1｜双课时台本',
      '## 第一次课 · 两节连上',
      '### 0-20 | 第一段',
      '### 20-50 | 第二段',
      '### 50-75 | 第三段',
      '### 75-100 | 第四段',
    ].join('\n')
    wrapper = mount(RunbookReader, { props: { source, file: 'runbook.md' } })

    const boundary = wrapper.find('.period-boundary')
    expect(boundary.exists()).toBe(true)
    expect(boundary.attributes('role')).toBe('separator')
    expect(boundary.attributes('aria-label')).toBe('第 2 课时从第 50 分钟开始')
    expect(boundary.text()).toContain('50–100 min')
    expect(boundary.element.tagName).toBe('DIV')
  })

  it('applies a course layout variant without changing the default reader', () => {
    const source = [
      '# T01｜专题台本',
      '> 高数测试',
      '## 第一次课 · 建立定义',
      '### 0-50 | 第一课时',
      '#### 从直觉进入定义',
      '- 画出误差带。',
      '### 50-100 | 第二课时',
      '#### 用定义完成证明',
      '- 写清量词次序。',
      '## 第二次课 · 比较定义',
      '### 0-50 | 第三课时',
      '#### 比较两种定义',
      '- 找到共同结构。',
    ].join('\n')
    wrapper = mount(RunbookReader, {
      props: { source, file: 'runbook.md', variant: 'calculus-topic' },
    })

    expect(wrapper.find('.runbook-reader--calculus-topic').exists()).toBe(true)
    expect(wrapper.find('.route-toolbar h2').text()).toBe('专题路线 3 个课时卡片')
    expect(wrapper.find('.lesson-meta').text()).toBe('高数测试')
    expect(wrapper.findAll('.topic-lesson-index button')).toHaveLength(2)
    expect(wrapper.findAll('.topic-segment-toc')).toHaveLength(1)
    expect(wrapper.find('.topic-segment-toc').text()).toContain('第一次课 · 0–50')
    expect(wrapper.find('.topic-segment-toc').text()).toContain('从直觉进入定义')
    expect(wrapper.find('.anchors').exists()).toBe(false)
    expect(wrapper.find('[aria-labelledby="controls-title"]').exists()).toBe(false)
    expect(wrapper.findAll('.notes-content h4').map((heading) => heading.text())).toEqual([
      '从直觉进入定义',
      '用定义完成证明',
      '比较两种定义',
    ])
    expect(wrapper.find('.notes-content h4').attributes('id')).toBe('segment-1-detail-1')
  })

  it('renders the lesson-cards layout as one knowledge map and three period cards', async () => {
    const source = [
      '# W1｜预备课',
      '> 三节连上',
      '## 知识地图',
      '- **Road map：为后续课程打开入口**',
      '  - 认识新的合作关系',
      '  - 搭起本地工作台',
      '## 本次课 · 从人的责任到可接续的工作台',
      '### 0-50 | 第一课时',
      '> 看见 Agent 的行动能力。',
      '#### 看见 Agent 在执行工作',
      '### 50-100 | 第二课时',
      '> 把 WSL 变成可核验状态。',
      '#### 课前检查',
      '### 100-150 | 第三课时',
      '> 让三个入口指向同一目录。',
      '#### 本次课回顾',
      '## 临场取舍',
      '- 默认：沿主线推进。',
    ].join('\n')
    wrapper = mount(RunbookReader, {
      props: { source, file: 'week-01/runbook.md', variant: 'lesson-cards' },
    })

    expect(wrapper.find('.runbook-reader--lesson-cards').exists()).toBe(true)
    expect(wrapper.find('.topic-roadmap h2').text()).toBe('知识地图 · 为后续课程打开入口')
    expect(wrapper.find('.route-toolbar h2').text()).toBe('本次课路线 3 个课时卡片')
    expect(wrapper.findAll('.period-boundary')).toHaveLength(2)
    expect(wrapper.find('.topic-side-nav').attributes('aria-label')).toBe('本周台本导航')
    expect(wrapper.find('.topic-lesson-index').attributes('aria-label')).toBe('课时索引')
    expect(wrapper.findAll('.topic-lesson-index button')).toHaveLength(3)
    expect(wrapper.findAll('.topic-lesson-index button').map((button) => button.text())).toEqual([
      '第 1 课时', '第 2 课时', '第 3 课时',
    ])
    expect(wrapper.find('.anchors').exists()).toBe(false)
    expect(wrapper.find('[aria-labelledby="controls-title"]').exists()).toBe(false)
    expect(wrapper.findAll('.notes-content h4').map((heading) => heading.text())).toEqual([
      '看见 Agent 在执行工作', '课前检查', '本次课回顾',
    ])

    const navigationToggle = wrapper.find('.topic-floating-nav-toggle')
    expect(navigationToggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.topic-side-nav').attributes('style') ?? '').not.toContain('display: none')
    await wrapper.findAll('.topic-lesson-index button')[1].trigger('click')
    expect(wrapper.findAll('.topic-lesson-index button')[1].attributes('aria-current')).toBe('location')
    expect(navigationToggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.topic-side-nav').attributes('style') ?? '').not.toContain('display: none')
  })

  it('renders a topic roadmap as nested bullets with mathematics', () => {
    const source = [
      '# T01｜专题台本',
      '## 本专题',
      '- 根问题：怎样描述趋近？',
      '- **Road map：定义与存在**',
      '  - 描述接近',
      '    - 定义：数列极限（$\\varepsilon$–$N$）',
      '## 第一次课',
      '### 0-50 | 第一课时',
    ].join('\n')
    wrapper = mount(RunbookReader, {
      props: { source, file: 'topic-01/runbook.md', variant: 'calculus-topic' },
    })

    const roadmap = wrapper.find('.topic-roadmap')
    expect(roadmap.find('h2').text()).toBe('Road map · 定义与存在')
    expect(roadmap.find('.notes-content > ul > li > ul > li').text()).toContain('数列极限')
    expect(roadmap.find('.katex').exists()).toBe(true)
    expect(wrapper.find('.anchors').exists()).toBe(false)
  })

  it('keeps the roadmap folded across source updates and remounts, per file', async () => {
    const source = [
      '# T01｜专题台本',
      '## 本专题',
      '- **Road map：定义与存在**',
      '  - 描述接近',
      '    - 定义：数列极限',
      '## 第一次课',
      '### 0-50 | 第一课时',
    ].join('\n')
    const props = { source, file: 'topic-01/runbook.md', variant: 'calculus-topic' }
    wrapper = mount(RunbookReader, { props })

    const toggle = wrapper.find('.topic-roadmap-toggle')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.topic-roadmap-content').isVisible()).toBe(true)

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.topic-roadmap-content').attributes('style')).toContain('display: none')

    await wrapper.setProps({ source: source.replace('描述接近', '描述趋近') })
    expect(wrapper.find('.topic-roadmap-toggle').attributes('aria-expanded')).toBe('false')

    wrapper.unmount()
    wrapper = mount(RunbookReader, { props })
    await flushPromises()
    expect(wrapper.find('.topic-roadmap-toggle').attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ file: 'topic-02/runbook.md' })
    expect(wrapper.find('.topic-roadmap-toggle').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.topic-roadmap-content').isVisible()).toBe(true)
  })

  it('uses the topic directory without closing it after navigation actions', async () => {
    const scrollIntoView = vi.fn()
    const scrollDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView')
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    })
    restoreScrollIntoView = () => {
      if (scrollDescriptor) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', scrollDescriptor)
      else delete HTMLElement.prototype.scrollIntoView
    }
    const source = [
      '# T01｜专题台本',
      '## 第一次课 · 建立定义',
      '### 0-50 | 第一课时',
      '#### 第一处',
      '- 内容。',
      '### 50-100 | 第二课时',
      '#### 第二处',
      '- 内容。',
      '## 第二次课 · 比较定义',
      '### 0-50 | 第三课时',
      '#### 第三处',
      '- 内容。',
    ].join('\n')
    wrapper = mount(RunbookReader, {
      props: { source, file: 'runbook.md', variant: 'calculus-topic' },
    })
    await flushPromises()

    const triggers = wrapper.findAll('.segment-trigger')
    await triggers[0].trigger('click')
    await triggers[1].trigger('click')
    expect(triggers[0].attributes('aria-expanded')).toBe('true')
    expect(triggers[1].attributes('aria-expanded')).toBe('true')

    const navigationToggle = wrapper.find('.topic-floating-nav-toggle')
    expect(navigationToggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.topic-side-nav').attributes('style') ?? '').not.toContain('display: none')

    const remoteToggle = wrapper.find('.topic-segment-toggle')
    expect(remoteToggle.text()).toBe('收起左侧')
    await remoteToggle.trigger('click')
    expect(triggers[0].attributes('aria-expanded')).toBe('false')
    expect(triggers[1].attributes('aria-expanded')).toBe('true')
    expect(remoteToggle.text()).toBe('展开左侧')
    expect(scrollIntoView).toHaveBeenCalled()
    expect(wrapper.find('.topic-side-nav').attributes('style') ?? '').not.toContain('display: none')

    await wrapper.find('.topic-outline button').trigger('click')
    await flushPromises()
    expect(triggers[0].attributes('aria-expanded')).toBe('true')
    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'auto', block: 'start' })
    expect(wrapper.find('.topic-side-nav').attributes('style') ?? '').not.toContain('display: none')

    await wrapper.findAll('.topic-lesson-index button')[1].trigger('click')
    expect(wrapper.findAll('.topic-lesson-index button')[1].attributes('aria-current')).toBe('location')
    expect(triggers[1].attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.topic-side-nav').attributes('style') ?? '').not.toContain('display: none')

    await navigationToggle.trigger('click')
    expect(wrapper.find('.topic-side-nav').attributes('style')).toContain('display: none')
  })

  it('keeps the original overview and controls outside the calculus layout', () => {
    const source = [
      '# W1｜普通台本',
      '## 本次课',
      '- 根问题：今天做什么？',
      '## 第一课时',
      '### 0-50 | 内容',
      '## 临场取舍',
      '- 默认：沿主线推进。',
    ].join('\n')
    wrapper = mount(RunbookReader, { props: { source, file: 'runbook.md' } })

    expect(wrapper.find('.anchors').text()).toContain('今天做什么？')
    expect(wrapper.find('.side-notes').text()).toContain('临场取舍')
    expect(wrapper.find('.topic-side-nav').exists()).toBe(false)
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
  it('uses controls and keyboard events to request page changes', async () => {
    const deck = parseSlides(slidesSource)
    wrapper = mount(SlidesReader, { attachTo: document.body, props: { deck, page: 1 } })
    await wrapper.find('.slide-next').trigger('click')
    expect(wrapper.emitted('change').at(-1)).toEqual([2])
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
    expect(wrapper.emitted('change').at(-1)).toEqual([deck.count])
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
    const page = deck.slides.findIndex((slide) => slide.layout === 'content') + 1
    wrapper = mount(SlidesReader, { props: { deck, page } })
    expect(wrapper.find('.slide-content.has-footer').exists()).toBe(true)
    expect(wrapper.findAll('.slide-content-body li')).toHaveLength(3)
    expect(wrapper.find('.slide-footer').text()).toBe('一句落点。')
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
    const page = deck.slides.findIndex((slide) => slide.layout === 'prompt') + 1
    wrapper = mount(SlidesReader, { props: { deck, page } })
    await wrapper.find('.prompt-heading button').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('请只执行指定命令。')
  })
})
