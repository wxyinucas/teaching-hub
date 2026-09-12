import { describe, expect, it } from 'vitest'
import { catalog, findCourse, findWeek, hasContent, loadContent } from '../src/lib/catalog.js'
import { parseRunbook } from '../src/lib/runbook.js'
import { parseSlides } from '../src/lib/slides.js'

const parsers = {
  runbook: parseRunbook,
  slides: parseSlides,
  guide: (source) => source.trim(),
}

describe('term-first content catalog', () => {
  it('keeps term, course and week identities isolated', () => {
    expect(catalog.terms.length).toBeGreaterThan(0)

    catalog.terms.forEach((term) => {
      expect(new Set(term.courses.map((course) => course.id)).size).toBe(term.courses.length)
      term.courses.forEach((course) => {
        expect(new Set(course.weeks.map((week) => week.id)).size).toBe(course.weeks.length)
        course.weeks.forEach((week) => {
          expect(course.calendar.find((entry) => entry.id === week.id)?.week).toBe(week)
        })
      })
    })
  })

  it('loads and parses every declared public resource while keeping drafts private', async () => {
    for (const term of catalog.terms) {
      for (const course of term.courses) {
        for (const week of course.weeks) {
          expect(week.resources.draft).toBeUndefined()
          expect(hasContent(`${term.id}/courses/${course.id}/weeks/${week.id}/draft.md`)).toBe(false)

          for (const [kind, path] of Object.entries(week.resources)) {
            expect(Object.keys(parsers)).toContain(kind)
            expect(hasContent(path)).toBe(true)
            const source = await loadContent(path)
            expect(source.trim()).not.toBe('')
            expect(() => parsers[kind](source)).not.toThrow()
          }
        }
      }
    }
  })

  it('does not cross course boundaries or load undeclared paths', async () => {
    const term = catalog.terms[0]
    const course = term.courses[0]
    const week = course.weeks[0]

    expect(findCourse(term.id, course.id)?.course).toBe(course)
    expect(findWeek(term.id, course.id, week.id)?.week).toBe(week)
    expect(findCourse('missing', course.id)).toBeNull()
    expect(findWeek(term.id, course.id, 'missing')).toBeNull()
    await expect(loadContent(`${term.id}/courses/${course.id}/weeks/${week.id}/missing.md`)).rejects.toThrow('找不到 terms/')
  })
})
