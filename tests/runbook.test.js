import { describe, expect, it } from 'vitest'
import { parseRunbook } from '../src/lib/runbook.js'
import { resolveRunbookNavigation } from '../src/lib/runbookNavigation.js'

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

  it('uses 本专题 as an overview heading for topic-organized courses', () => {
    const runbook = parseRunbook([
      '# T01｜专题台本',
      '## 本专题',
      '- 根问题：怎样描述趋近？',
      '- 最低出口：读懂量词次序。',
      '## 第一次课',
      '### 0-50 | 建立直觉',
    ].join('\n'))

    expect(runbook.overview).toEqual([
      { label: '根问题', text: '怎样描述趋近？' },
      { label: '最低出口', text: '读懂量词次序。' },
    ])
    expect(runbook.sections).toHaveLength(1)
  })

  it('keeps an indented topic roadmap separate from overview anchors', () => {
    const runbook = parseRunbook([
      '# T01｜专题台本',
      '## 本专题',
      '- 根问题：怎样描述趋近？',
      '- **Road map：定义与存在**',
      '  - 描述接近',
      '    - 定义：数列极限（$\\varepsilon$–$N$）',
      '    - 算法：由误差倒推 $N$（需例题）',
      '## 第一次课',
      '### 0-50 | 建立直觉',
    ].join('\n'))

    expect(runbook.overview).toEqual([{ label: '根问题', text: '怎样描述趋近？' }])
    expect(runbook.roadmap).toEqual({
      title: '定义与存在',
      source: '- 描述接近\n  - 定义：数列极限（$\\varepsilon$–$N$）\n  - 算法：由误差倒推 $N$（需例题）',
    })
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

  it('builds a stable outline from real top-level H4 headings', () => {
    const source = [
      '# T01｜目录',
      '## 第一次课',
      '### 0-50 | 第一课时',
      '#### 课前检查',
      '##### 不进入目录',
      '> #### 引用里的伪标题',
      '```markdown',
      '#### 围栏里的伪标题',
      '```',
      '#### 课前检查',
      '### 50-100 | 第二课时',
      '#### 收束',
    ].join('\n')
    const runbook = parseRunbook(source)

    expect(runbook.sections[0].segments[0].outline).toEqual([
      { id: 'segment-1-detail-1', text: '课前检查' },
      { id: 'segment-1-detail-2', text: '课前检查' },
    ])
    expect(runbook.sections[0].segments[1].outline).toEqual([
      { id: 'segment-2-detail-1', text: '收束' },
    ])
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

describe('runbook reading position', () => {
  const items = [
    { id: 'segment-1', top: -400, bottom: 70 },
    { id: 'segment-2', top: 220, bottom: 900 },
    { id: 'segment-3', top: 940, bottom: 1500 },
  ]

  it('shows only the current half-period away from a boundary', () => {
    expect(resolveRunbookNavigation(items, 800, 120)).toEqual({
      currentId: 'segment-1',
      visibleIds: ['segment-1'],
    })
  })

  it('shows both adjacent half-periods near their boundary', () => {
    expect(resolveRunbookNavigation(items, 800, 130)).toEqual({
      currentId: 'segment-1',
      visibleIds: ['segment-1', 'segment-2'],
    })
    expect(resolveRunbookNavigation(items, 800, 250)).toEqual({
      currentId: 'segment-2',
      visibleIds: ['segment-1', 'segment-2'],
    })
  })

  it('falls back to the first half-period before layout is measured', () => {
    expect(resolveRunbookNavigation([
      { id: 'segment-1', top: 0, bottom: 0 },
      { id: 'segment-2', top: 0, bottom: 0 },
    ], 800)).toEqual({ currentId: 'segment-1', visibleIds: ['segment-1'] })
  })
})
