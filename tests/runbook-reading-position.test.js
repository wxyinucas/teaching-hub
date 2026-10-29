import { afterEach, describe, expect, it } from 'vitest'
import { captureRunbookPosition, resolveRunbookPosition } from '../src/lib/runbookReadingPosition.js'

afterEach(() => { document.body.innerHTML = '' })

function page(contents) {
  document.body.innerHTML = `<main><header class="lesson-heading">专题</header><section data-reading-section="第二次课"><header class="period-header">第二次课</header><article data-reading-segment="第二次课::0-50"><div class="notes-content">${contents}</div></article></section></main>`
  return document.querySelector('main')
}

function at(element, top, height = 30) {
  element.getBoundingClientRect = () => ({ top, bottom: top + height, height, width: 600, left: 0, right: 600 })
  return element
}

function layout(root) {
  at(root.querySelector('[data-reading-section]'), -300, 1400)
  at(root.querySelector('[data-reading-segment]'), -250, 1300)
}

describe('runbook reading position', () => {
  it('does not capture unlaid-out or hidden content', () => {
    const root = page('<h4>定义</h4><p>正文</p>')
    expect(captureRunbookPosition(root, 600)).toBeNull()
  })

  it('keeps a paragraph at the same offset after headings and paragraphs are inserted above it', () => {
    let root = page('<h4>前文</h4><p>第一段</p><h4>当前定义</h4><p>正在阅读的段落</p>')
    layout(root)
    at(root.querySelectorAll('h4')[0], -200)
    at(root.querySelectorAll('p')[0], -160)
    at(root.querySelectorAll('h4')[1], 65)
    at(root.querySelectorAll('p')[1], 110, 80)
    const position = captureRunbookPosition(root, 600)
    expect(position.outlineTitle).toBe('当前定义')
    expect(position.block.text).toBe('正在阅读的段落')
    expect(position.offset).toBe(110)
    expect(JSON.parse(JSON.stringify(position))).toEqual(position)

    root = page('<h4>新增内容</h4><p>插入段落</p><h4>前文</h4><p>第一段</p><h4>当前定义</h4><p>新的说明</p><p>正在阅读的段落</p>')
    const expected = root.querySelectorAll('p')[3]
    at(expected, 430, 80)
    expect(resolveRunbookPosition(root, position)).toEqual({ element: expected, offset: 110 })
  })

  it('scopes repeated paragraphs to their heading and repeated heading occurrence', () => {
    let root = page('<h4>例题</h4><p>同一提醒</p><h4>例题</h4><p>同一提醒</p><p>同一提醒</p>')
    layout(root)
    at(root.querySelectorAll('h4')[0], -300)
    at(root.querySelectorAll('p')[0], -200)
    at(root.querySelectorAll('h4')[1], -100)
    at(root.querySelectorAll('p')[1], -40)
    at(root.querySelectorAll('p')[2], 110, 60)
    const position = captureRunbookPosition(root, 600)
    expect(position.outlineOccurrence).toBe(1)
    expect(position.block.occurrence).toBe(1)

    root = page('<h4>新标题</h4><p>同一提醒</p><h4>例题</h4><p>同一提醒</p><h4>例题</h4><p>同一提醒</p><p>同一提醒</p>')
    at(root.querySelectorAll('p')[3], 320)
    expect(resolveRunbookPosition(root, position)?.element).toBe(root.querySelectorAll('p')[3])
  })

  it('falls back to the same heading offset when the current paragraph is rewritten', () => {
    let root = page('<h4>当前定义</h4><p>旧的正文</p>')
    layout(root)
    at(root.querySelector('h4'), 30)
    at(root.querySelector('p'), 100, 80)
    const position = captureRunbookPosition(root, 600)
    root = page('<h4>插入一节</h4><p>新内容</p><h4>当前定义</h4><p>修改后的正文</p>')
    at(root.querySelectorAll('h4')[1], 230)
    expect(resolveRunbookPosition(root, position)).toEqual({ element: root.querySelectorAll('h4')[1], offset: 30 })
  })

  it('keeps a unique paragraph if its heading was renamed', () => {
    let root = page('<h4>旧标题</h4><p>原来的正文</p>')
    layout(root)
    at(root.querySelector('h4'), 20)
    at(root.querySelector('p'), 105, 100)
    const position = captureRunbookPosition(root, 600)
    root = page('<h4>新标题</h4><p>原来的正文</p>')
    at(root.querySelector('p'), 220)
    expect(resolveRunbookPosition(root, position)).toEqual({ element: root.querySelector('p'), offset: 105 })
  })

  it('remembers collapsed cards and falls back to their section when a card is removed', () => {
    let root = page('')
    at(root.querySelector('[data-reading-section]'), 50, 500)
    at(root.querySelector('[data-reading-segment]'), 110, 100)
    const position = captureRunbookPosition(root, 600)
    expect(position.block).toBeNull()
    expect(resolveRunbookPosition(root, position)).toEqual({ element: root.querySelector('[data-reading-segment]'), offset: 110 })
    root.querySelector('[data-reading-segment]').remove()
    expect(resolveRunbookPosition(root, position)).toEqual({ element: root.querySelector('[data-reading-section]'), offset: 50 })
    root.querySelector('[data-reading-section]').remove()
    expect(resolveRunbookPosition(root, position)).toBeNull()
  })

  it('ignores sidebar text and captures the overview when no cards are visible', () => {
    const root = page('<h4>正文标题</h4><p>正文内容</p>')
    root.insertAdjacentHTML('beforeend', '<aside><p>侧栏导航</p></aside>')
    at(root.querySelector('aside p'), 110, 50)
    const overview = at(root.querySelector('.lesson-heading'), 100, 80)
    const position = captureRunbookPosition(root, 600)
    expect(position.overview).toBe('heading')
    expect(resolveRunbookPosition(root, position)).toEqual({ element: overview, offset: 100 })
  })

  it('captures the actual roadmap and avoids hidden body blocks when a card is collapsed', () => {
    let root = page('<h4>定义</h4><p>当前内容</p>')
    root.insertAdjacentHTML('afterbegin', '<section class="topic-roadmap">知识地图</section>')
    at(root.querySelector('.topic-roadmap'), 90, 160)
    const overview = captureRunbookPosition(root, 600)
    expect(overview.overview).toBe('roadmap')
    expect(resolveRunbookPosition(root, overview)?.element).toBe(root.querySelector('.topic-roadmap'))

    layout(root)
    at(root.querySelector('.topic-roadmap'), -500, 160)
    at(root.querySelector('h4'), 20)
    at(root.querySelector('.notes-content p'), 110, 60)
    const position = captureRunbookPosition(root, 600)
    root = page('<h4>定义</h4><p>当前内容</p>')
    const collapsed = at(root.querySelector('[data-reading-segment]'), 80, 100)
    expect(resolveRunbookPosition(root, position)).toEqual({ element: collapsed, offset: 110 })
  })

  it('does not inspect blocks of cards outside the viewport', () => {
    const root = page('<h4>定义</h4><p>不可见内容</p>')
    const segment = at(root.querySelector('[data-reading-segment]'), 1000, 500)
    segment.querySelectorAll = () => { throw new Error('offscreen body should not be scanned') }
    expect(captureRunbookPosition(root, 600)).toBeNull()
  })
})
