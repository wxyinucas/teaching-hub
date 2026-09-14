import { describe, expect, it } from 'vitest'
import { catalog, findCourse, findTopic, findWeek, hasContent, loadContent } from '../src/lib/catalog.js'
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
        expect(new Set(course.topics.map((topic) => topic.id)).size).toBe(course.topics.length)
        course.weeks.forEach((week) => {
          expect(course.calendar.find((entry) => entry.id === week.id)?.week).toBe(week)
        })
        course.topics.forEach((topic) => {
          expect(course.topicMap.find((entry) => entry.id === topic.id)?.topic).toBe(topic)
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
        for (const topic of course.topics) {
          expect(topic.resources.draft).toBeUndefined()
          expect(hasContent(`${term.id}/courses/${course.id}/topics/${topic.id}/draft.md`)).toBe(false)

          for (const [kind, path] of Object.entries(topic.resources)) {
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

  it('keeps topic organization opt-in while preserving week courses', () => {
    const topicContext = catalog.terms.flatMap((term) => term.courses.map((course) => ({ term, course })))
      .find(({ course }) => course.organization === 'topics')
    expect(topicContext).toBeDefined()
    expect(topicContext.course.topicMap.length).toBeGreaterThan(0)

    const declaredTopic = topicContext.course.topics[0]
    expect(declaredTopic).toBeDefined()
    expect(findTopic(topicContext.term.id, topicContext.course.id, declaredTopic.id)?.topic).toBe(declaredTopic)
    expect(findTopic(topicContext.term.id, topicContext.course.id, 'missing')).toBeNull()

    const weekCourses = catalog.terms.flatMap((term) => term.courses).filter((course) => course.organization === 'weeks')
    expect(weekCourses.length).toBeGreaterThan(0)
    weekCourses.forEach((course) => {
      expect(course.calendar).toHaveLength(course.weekMap?.length || course.weeks.length)
    })
  })

  it('keeps every calculus T01 meeting at exactly two 50-minute cards', async () => {
    const context = findTopic('2026-fall', 'calculus-i', 'topic-01-describing-approach')
    expect(context).not.toBeNull()
    const source = await loadContent(context.topic.resources.runbook)
    const runbook = parseRunbook(source)

    expect(runbook.sections.length).toBeGreaterThan(0)
    runbook.sections.forEach((section) => {
      expect(section.segments.map(({ start, end }) => [start, end])).toEqual([
        [0, 50],
        [50, 100],
      ])
    })
  })
})
