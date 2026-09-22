import { describe, expect, it } from 'vitest'
import { catalog, findCourse, findTopic, findWeek, loadContent } from '../src/lib/catalog.js'

describe('term-first content catalog', () => {
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

})
