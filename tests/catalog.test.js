import { describe, expect, it } from 'vitest'
import { catalog, findCourse, findWeek, hasContent, loadContent } from '../src/lib/catalog.js'
import { parseRunbook } from '../src/lib/runbook.js'
import { parseSlides } from '../src/lib/slides.js'

describe('term-first content catalog', () => {
  it('discovers terms, courses and only prepared weeks', () => {
    expect(catalog.terms).toHaveLength(1)
    const term = catalog.terms[0]
    expect(term.id).toBe('2026-fall')
    expect(term.courses.map((course) => course.id)).toEqual(['ai-agents', 'calculus-i'])
    expect(term.courses[0].weeks.map((week) => week.id)).toEqual(['week-01'])
    expect(term.courses[1].weeks).toEqual([])
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

  it('does not leak a week across courses or load an undeclared path', async () => {
    expect(findCourse('2026-fall', 'calculus-i')?.course.weeks).toEqual([])
    expect(findWeek('2026-fall', 'calculus-i', 'week-01')).toBeNull()
    expect(findWeek('missing', 'ai-agents', 'week-01')).toBeNull()
    await expect(loadContent('2026-fall/courses/ai-agents/weeks/week-01/missing.md')).rejects.toThrow('找不到 terms/')
  })
})
