import { describe, expect, it } from 'vitest'
import { renderNotes } from '../src/lib/markdown.js'
import { parseRunbook } from '../src/lib/runbook.js'
import source from '../terms/2026-fall/courses/ai-agents/weeks/week-01/runbook.md?raw'
import template from '../terms/2026-fall/templates/runbook-template.md?raw'
import calculusTemplate from '../terms/2026-fall/courses/calculus-i/course-design/weekly-runbook-template.md?raw'
import calculusW1 from '../terms/2026-fall/courses/calculus-i/weeks/week-01/runbook.md?raw'

function expectCalculusMicroTimeline(runbook) {
  expect(runbook.sections).toHaveLength(3)
  runbook.sections.forEach((section) => {
    expect(section.segments.length).toBeGreaterThanOrEqual(6)
    expect(section.segments.length).toBeLessThanOrEqual(10)
    expect(section.segments[0].start).toBe(0)
    expect(section.segments.at(-1).end).toBe(100)
    section.segments.slice(1).forEach((segment, index) => {
      expect(segment.start).toBe(section.segments[index].end)
    })
    expect(section.segments.filter((segment) => segment.periodBoundaryBefore)).toEqual([
      expect.objectContaining({ start: 50, periodNumber: 2 }),
    ])
    expect(section.segments).not.toContainEqual(expect.objectContaining({ start: 0, end: 50 }))
    expect(section.segments).not.toContainEqual(expect.objectContaining({ start: 50, end: 100 }))
  })
  expect(runbook.duration).toBe(300)
}

function countOptionalSupplements(section) {
  return section.segments.reduce((total, segment) => (
    total + (segment.notes.match(/可选补充/g)?.length ?? 0)
  ), 0)
}

describe('Markdown runbook', () => {
  it('keeps W1 as three periods, fifteen action cards and 150 teaching minutes', () => {
    const runbook = parseRunbook(source)
    expect(runbook.code).toBe('W1')
    expect(runbook.sections).toHaveLength(3)
    expect(runbook.sections.map((section) => section.segments.length)).toEqual([5, 5, 5])
    expect(runbook.segmentCount).toBe(15)
    expect(runbook.duration).toBe(150)
    expect(runbook.overview.map((item) => item.label)).toEqual(['根问题', '最低出口', '硬收口'])
    expect(runbook.controls).toHaveLength(3)
  })

  it('parses the term template without treating detail headings as segments', () => {
    const runbook = parseRunbook(template)
    expect(runbook.code).toBe('WXX')
    expect(runbook.sections).toHaveLength(3)
    expect(runbook.segmentCount).toBe(5)
    expect(runbook.sections[0].segments[0].notes).toContain('#### 课前提醒（可选）')
  })

  it('parses the calculus weekly template as three meetings of micro-segments', () => {
    const runbook = parseRunbook(calculusTemplate)
    expect(runbook.code).toBe('WXX')
    expect(runbook.overview.map((item) => item.label)).toEqual(['根问题', '最低出口', '硬收口'])
    expect(runbook.sections.map((section) => section.label)).toEqual(['第一次课', '第二次课', '第三次课'])
    expect(runbook.sections.map((section) => section.segments.length)).toEqual([8, 8, 8])
    expectCalculusMicroTimeline(runbook)
    expect(runbook.sections.map(countOptionalSupplements)).toEqual([2, 2, 2])
    expect(calculusTemplate).not.toContain('####')
    expect(calculusTemplate).toContain('- 讲解：')
    expect(calculusTemplate).toContain('- 重点分析：')
    expect(calculusTemplate).toContain('- 例题占位：')
    expect(calculusTemplate).toContain('- 练习占位：')
  })

  it('parses the published calculus W1 as a complete 300-minute runbook', () => {
    const runbook = parseRunbook(calculusW1)
    expect(runbook.code).toBe('W1')
    expect(runbook.title).toBe('精确描述“趋近”')
    expect(runbook.overview.map((item) => item.label)).toEqual(['根问题', '最低出口', '硬收口'])
    expect(runbook.controls.map((item) => item.label)).toEqual(['默认', '保护项', '可删项'])
    expect(runbook.sections.map((section) => section.label)).toEqual(['第一次课', '第二次课', '第三次课'])
    expect(runbook.sections.map((section) => section.segments.length)).toEqual([10, 8, 8])
    expect(runbook.segmentCount).toBe(26)
    expectCalculusMicroTimeline(runbook)
    expect(runbook.sections.map(countOptionalSupplements)).toEqual([2, 2, 2])
    expect(runbook.sections.flatMap((section) => section.segments).every((segment) => segment.summary && segment.notes)).toBe(true)
    expect(calculusW1).not.toContain('WXX')
    expect(calculusW1).not.toContain('####')
    expect(calculusW1.match(/W1-B\d{2}/g)).toEqual([
      'W1-B01', 'W1-B02', 'W1-B03', 'W1-B04', 'W1-B05', 'W1-B06',
    ])
    expect(calculusW1).not.toContain('待填')

    const structuralText = [
      runbook.title,
      runbook.subtitle,
      ...runbook.overview.flatMap((item) => [item.label, item.text]),
      ...runbook.controls.flatMap((item) => [item.label, item.text]),
      ...runbook.sections.flatMap((section) => [
        section.label,
        section.title,
        ...section.segments.flatMap((segment) => [segment.title, segment.summary]),
      ]),
    ].join('\n')
    expect(structuralText).not.toContain('$')
    runbook.sections.flatMap((section) => section.segments).forEach((segment) => {
      expect(renderNotes(segment.notes).html).not.toContain('katex-error')
    })
  })

  it('separates the short landing point from hidden teacher notes', () => {
    const first = parseRunbook(source).sections[0].segments[0]
    expect(first.summary).toBe('Agent 不只生成回答，它还能观察界面、调用工具并连续完成任务。')
    expect(first.notes).toContain('Bilibili')
    expect(first.notes).not.toContain(first.summary)
  })

  it('allows a segment with no extra notes', () => {
    const runbook = parseRunbook('# W2｜简单台本\n\n## 课堂\n\n### 0-50 | 一个目标\n')
    expect(runbook.sections[0].segments[0]).toMatchObject({ summary: '', notes: '' })
  })

  it('parses a continuous 100-minute timeline and marks the second period', () => {
    const runbook = parseRunbook([
      '# W1｜细分台本',
      '',
      '## 第一次课',
      '',
      '### 0-8 | 进入问题',
      '### 8-15 | 识别变量',
      '### 15-32 | 建立语言',
      '### 32-50 | 第一次练习',
      '### 50-63 | 回顾',
      '### 63-82 | 深入',
      '### 82-100 | 收口',
    ].join('\n'))

    expect(runbook.sections[0].duration).toBe(100)
    expect(runbook.sections[0].segments).toHaveLength(7)
    expect(runbook.sections[0].segments.filter((segment) => segment.periodBoundaryBefore)).toEqual([
      expect.objectContaining({ start: 50, periodNumber: 2 }),
    ])
  })

  it.each([
    ['不是从 0 分钟开始', '### 2-8 | 晚开始\n### 8-50 | 继续', '第一段必须从 0 分钟开始'],
    ['时间段之间有空档', '### 0-8 | 开始\n### 10-50 | 继续', '时间段存在空档'],
    ['时间段发生重叠', '### 0-12 | 开始\n### 10-50 | 继续', '时间段发生重叠'],
    ['一个推进段跨过课时边界', '### 0-40 | 开始\n### 40-60 | 跨界\n### 60-100 | 继续', '跨过了 50 分钟课时边界'],
  ])('rejects an invalid timeline when %s', (_case, segments, message) => {
    expect(() => parseRunbook(`# W1｜时间轴\n\n## 第一次课\n\n${segments}`)).toThrow(message)
  })

  it('preserves TeX source inside segment notes', () => {
    const runbook = parseRunbook('# W1｜公式\n\n## 第一次课\n\n### 0-50 | 极限\n\n由 $f(x)$ 讨论：\n\n$$\n\\lim_{x \\to 0} f(x)=L\n$$')
    expect(runbook.sections[0].segments[0].notes).toContain('$f(x)$')
    expect(runbook.sections[0].segments[0].notes).toContain('$$\n\\lim_{x \\to 0} f(x)=L\n$$')
  })

  it('rejects a reversed time range', () => {
    expect(() => parseRunbook(source.replace('### 0-8 |', '### 8-0 |'))).toThrow('结束时间需晚于开始时间')
  })
})
