import { describe, expect, it } from 'vitest'
import { parseRunbook } from '../src/lib/runbook.js'
import source from '../terms/2026-fall/courses/ai-agents/weeks/week-01/runbook.md?raw'
import template from '../terms/2026-fall/templates/runbook-template.md?raw'

describe('Markdown runbook', () => {
  it('keeps W1 as three periods, eight segments and 150 teaching minutes', () => {
    const runbook = parseRunbook(source)
    expect(runbook.code).toBe('W1')
    expect(runbook.sections).toHaveLength(3)
    expect(runbook.segmentCount).toBe(8)
    expect(runbook.duration).toBe(150)
    expect(runbook.overview.map((item) => item.label)).toEqual(['根问题', '最低出口', '硬收口'])
    expect(runbook.controls).toHaveLength(3)
  })

  it('parses the term template without treating detail headings as segments', () => {
    const runbook = parseRunbook(template)
    expect(runbook.code).toBe('WXX')
    expect(runbook.sections).toHaveLength(3)
    expect(runbook.segmentCount).toBe(5)
    expect(runbook.sections[0].segments[0].notes).toContain('#### 【教师提示的小标题')
  })

  it('separates the short landing point from hidden teacher notes', () => {
    const first = parseRunbook(source).sections[0].segments[0]
    expect(first.summary).toBe('讲清：生产力提升，不等于个人自动减负。')
    expect(first.notes).toContain('用一个家庭纺织故事开场')
    expect(first.notes).not.toContain(first.summary)
  })

  it('allows a segment with no extra notes', () => {
    const runbook = parseRunbook('# W2｜简单台本\n\n## 课堂\n\n### 0-50 | 一个目标\n')
    expect(runbook.sections[0].segments[0]).toMatchObject({ summary: '', notes: '' })
  })

  it('rejects a reversed time range', () => {
    expect(() => parseRunbook(source.replace('### 0-10 |', '### 10-0 |'))).toThrow('结束时间需晚于开始时间')
  })
})
