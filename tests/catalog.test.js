import { describe, expect, it } from 'vitest'
import { catalog, findCourse, findWeek, hasContent, loadContent } from '../src/lib/catalog.js'
import { parseRunbook } from '../src/lib/runbook.js'
import { parseSlides } from '../src/lib/slides.js'

describe('term-first content catalog', () => {
  it('keeps the complete course map separate from prepared weeks', () => {
    expect(catalog.terms).toHaveLength(1)
    const term = catalog.terms[0]
    expect(term.id).toBe('2026-fall')
    expect(term.courses.map((course) => course.id)).toEqual(['ai-agents', 'calculus-i'])
    const aiAgents = term.courses[0]
    expect(aiAgents.calendar.map((week) => week.id)).toEqual(
      Array.from({ length: 16 }, (_, index) => `week-${String(index + 1).padStart(2, '0')}`),
    )
    expect(aiAgents.weeks.map((week) => week.id)).toEqual([
      'week-01',
      'week-02',
      'week-03',
      'week-04',
    ])
    expect(aiAgents.calendar[0].title).toBe('设备成为可接续的学习现场')
    expect(aiAgents.calendar[0].week?.id).toBe('week-01')
    expect(aiAgents.calendar[1].week?.id).toBe('week-02')
    expect(aiAgents.calendar[2].week?.id).toBe('week-03')
    expect(aiAgents.calendar[3].week?.id).toBe('week-04')
    expect(aiAgents.calendar[3].title).toBe('把 Agent 接入现实系统')
    expect(aiAgents.calendar[4].week).toBeNull()
    const calculus = term.courses[1]
    expect(calculus.weeks.map((week) => week.id)).toEqual(['week-01'])
    expect(calculus.calendar.map((week) => week.id)).toEqual(
      Array.from({ length: 16 }, (_, index) => `week-${String(index + 1).padStart(2, '0')}`),
    )
    expect(calculus.calendar[0].title).toBe('精确描述“趋近”')
    expect(calculus.calendar[0].week?.id).toBe('week-01')
    expect(calculus.calendar.slice(1).every((week) => week.week === null)).toBe(true)
    expect(calculus.calendar[15].title).toBe('高阶线性方程及全课程收束')
  })

  it('resolves all three declared W1 resources within its course and term', async () => {
    const context = findWeek('2026-fall', 'ai-agents', 'week-01')
    expect(context.week.resources.runbook).toContain('week-01/runbook.md')
    expect(context.week.resources.slides).toContain('week-01/slides.md')
    expect(context.week.resources.guide).toContain('week-01/guide.md')
    expect(context.week.resources.draft).toBeUndefined()
    expect(hasContent(context.week.resources.runbook)).toBe(true)
    expect(hasContent(context.week.resources.guide)).toBe(true)
    expect(hasContent('2026-fall/courses/ai-agents/weeks/week-01/draft.md')).toBe(false)
    expect(parseRunbook(await loadContent(context.week.resources.runbook)).sections).toHaveLength(3)
    expect(parseSlides(await loadContent(context.week.resources.slides)).count).toBe(17)
    expect(await loadContent(context.week.resources.guide)).toContain('READY-CODE')
  })

  it('registers calculus W1 as a runbook-only teaching week', async () => {
    const context = findWeek('2026-fall', 'calculus-i', 'week-01')
    expect(context.week.label).toContain('W1')
    expect(Object.keys(context.week.resources)).toEqual(['runbook'])
    expect(context.week.resources.slides).toBeUndefined()
    expect(context.week.resources.guide).toBeUndefined()
    expect(hasContent(context.week.resources.runbook)).toBe(true)
    const runbook = parseRunbook(await loadContent(context.week.resources.runbook))
    expect(runbook.sections).toHaveLength(3)
    expect(runbook.sections.map((section) => section.segments.length)).toEqual([10, 8, 8])
    expect(runbook.segmentCount).toBe(26)
    expect(runbook.duration).toBe(300)
    runbook.sections.forEach((section) => {
      expect(section.segments[0].start).toBe(0)
      expect(section.segments.at(-1).end).toBe(100)
      expect(section.segments.filter((segment) => segment.periodBoundaryBefore)).toHaveLength(1)
    })
  })

  it.each([
    ['week-02', 'W2', '看到的同学代号'],
    ['week-03', 'W3', 'ACCEPT'],
    ['week-04', 'W4', 'KLINE_ROWS=6'],
  ])('loads a complete first-draft bundle for %s', async (weekId, code, guideAnchor) => {
    const context = findWeek('2026-fall', 'ai-agents', weekId)
    expect(Object.keys(context.week.resources).sort()).toEqual(['guide', 'runbook', 'slides'])
    Object.values(context.week.resources).forEach((path) => expect(hasContent(path)).toBe(true))
    expect(context.week.resources.draft).toBeUndefined()
    expect(hasContent(`2026-fall/courses/ai-agents/weeks/${weekId}/draft.md`)).toBe(false)

    const runbook = parseRunbook(await loadContent(context.week.resources.runbook))
    expect(runbook.code).toBe(code)
    expect(runbook.sections).toHaveLength(3)
    expect(runbook.duration).toBe(150)
    expect(runbook.overview.map((item) => item.label)).toEqual(['根问题', '最低出口', '硬收口'])
    expect(runbook.controls).toHaveLength(3)
    runbook.sections.forEach((section) => {
      expect(section.segments[0].start).toBe(0)
      expect(section.segments.at(-1).end).toBe(50)
      expect(section.segments.every((segment) => segment.summary)).toBe(true)
      section.segments.slice(1).forEach((segment, index) => {
        expect(segment.start).toBe(section.segments[index].end)
      })
    })

    const deck = parseSlides(await loadContent(context.week.resources.slides))
    expect(deck.slides[0].layout).toBe('cover')
    expect(deck.sections).toHaveLength(3)
    expect(deck.slides.filter((slide) => slide.layout === 'prompt').every((slide) => slide.copyText)).toBe(true)
    expect(await loadContent(context.week.resources.guide)).toContain(guideAnchor)
  })

  it('does not leak a week across courses or load an undeclared path', async () => {
    expect(findCourse('2026-fall', 'calculus-i')?.course.weeks.map((week) => week.id)).toEqual(['week-01'])
    expect(findWeek('2026-fall', 'calculus-i', 'week-02')).toBeNull()
    expect(findWeek('2026-fall', 'ai-agents', 'week-05')).toBeNull()
    expect(findWeek('missing', 'ai-agents', 'week-01')).toBeNull()
    await expect(loadContent('2026-fall/courses/ai-agents/weeks/week-01/missing.md')).rejects.toThrow('找不到 terms/')
  })
})
