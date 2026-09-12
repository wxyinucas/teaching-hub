import { describe, expect, it } from 'vitest'
import { parseRunbook } from '../src/lib/runbook.js'

const example = [
  '# WXX｜示例台本',
  '',
  '> 一句副标题',
  '',
  '## 本次课',
  '',
  '- 根问题：今天解决什么？',
  '- 最低出口：留下一个证据。',
  '- 硬收口：到点停止。',
  '',
  '## 第一课时 · 建立共同语言',
  '',
  '### 0-20 | 提出问题',
  '',
  '> 这一段的落点。',
  '',
  '#### 课前提醒',
  '',
  '- 准备演示。',
  '',
  '### 20-50 | 完成练习',
  '',
  '## 第二课时 · 完成验证',
  '',
  '### 0-50 | 核对证据',
  '',
  '## 临场取舍',
  '',
  '- 默认：沿主线推进。',
].join('\n')

describe('Markdown runbook parser', () => {
  it('extracts metadata, teaching sections, summaries and notes', () => {
    const runbook = parseRunbook(example)
    expect(runbook).toMatchObject({ code: 'WXX', title: '示例台本', subtitle: '一句副标题' })
    expect(runbook.overview.map((item) => item.label)).toEqual(['根问题', '最低出口', '硬收口'])
    expect(runbook.controls.map((item) => item.label)).toEqual(['默认'])
    expect(runbook.sections.map((section) => section.label)).toEqual(['第一课时', '第二课时'])
    expect(runbook.sections[0].segments[0]).toMatchObject({
      start: 0,
      end: 20,
      title: '提出问题',
      summary: '这一段的落点。',
    })
    expect(runbook.sections[0].segments[0].notes).toContain('#### 课前提醒')
    expect(runbook.duration).toBe(100)
  })

  it('ignores detail headings and headings inside code fences', () => {
    const source = [
      '# 台本',
      '## 课堂',
      '### 0-50 | 一个目标',
      '#### 细节标题',
      '```markdown',
      '## 不是课时',
      '### 0-10 | 不是推进段',
      '```',
    ].join('\n')
    const runbook = parseRunbook(source)
    expect(runbook.sections).toHaveLength(1)
    expect(runbook.sections[0].segments).toHaveLength(1)
    expect(runbook.sections[0].segments[0].notes).toContain('### 0-10 | 不是推进段')
  })

  it('allows a segment with no summary or extra notes', () => {
    const runbook = parseRunbook('# W2｜简单台本\n\n## 课堂\n\n### 0-50 | 一个目标\n')
    expect(runbook.sections[0].segments[0]).toMatchObject({ summary: '', notes: '' })
  })

  it('marks a 50-minute boundary inside a continuous 100-minute timeline', () => {
    const runbook = parseRunbook([
      '# W1｜双课时台本',
      '## 第一次课',
      '### 0-20 | 第一段',
      '### 20-50 | 第二段',
      '### 50-75 | 第三段',
      '### 75-100 | 第四段',
    ].join('\n'))

    expect(runbook.sections[0].segments.filter((segment) => segment.periodBoundaryBefore)).toEqual([
      expect.objectContaining({ start: 50, periodNumber: 2 }),
    ])
  })

  it.each([
    ['不是从 0 分钟开始', '### 2-8 | 晚开始\n### 8-50 | 继续', '第一段必须从 0 分钟开始'],
    ['时间段之间有空档', '### 0-8 | 开始\n### 10-50 | 继续', '时间段存在空档'],
    ['时间段发生重叠', '### 0-12 | 开始\n### 10-50 | 继续', '时间段发生重叠'],
    ['一个推进段跨过课时边界', '### 0-40 | 开始\n### 40-60 | 跨界\n### 60-100 | 继续', '跨过了 50 分钟课时边界'],
    ['结束时间早于开始时间', '### 8-0 | 写反了', '结束时间需晚于开始时间'],
  ])('rejects an invalid timeline when %s', (_case, segments, message) => {
    expect(() => parseRunbook(`# W1｜时间轴\n\n## 第一次课\n\n${segments}`)).toThrow(message)
  })

  it('preserves TeX source inside segment notes', () => {
    const runbook = parseRunbook('# W1｜公式\n\n## 第一次课\n\n### 0-50 | 极限\n\n由 $f(x)$ 讨论：\n\n$$\n\\lim_{x \\to 0} f(x)=L\n$$')
    expect(runbook.sections[0].segments[0].notes).toContain('$f(x)$')
    expect(runbook.sections[0].segments[0].notes).toContain('$$\n\\lim_{x \\to 0} f(x)=L\n$$')
  })

  it('requires a title, a teaching section and at least one segment', () => {
    expect(() => parseRunbook('## 课堂\n\n### 0-50 | 内容')).toThrow('请先用一个 # 标题')
    expect(() => parseRunbook('# 只有标题')).toThrow('请用 ## 添加教学区段')
    expect(() => parseRunbook('# 台本\n\n## 课堂')).toThrow('还没有推进段')
  })
})
