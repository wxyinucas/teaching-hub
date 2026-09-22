import { describe, expect, it } from 'vitest'
import { catalog, hasContent, loadContent } from '../src/lib/catalog.js'
import { parseExamCollection } from '../src/lib/exams.js'
import { parseRunbook } from '../src/lib/runbook.js'
import { parseSlides } from '../src/lib/slides.js'

const parsers = {
  runbook: parseRunbook,
  slides: parseSlides,
  guide: (source) => source.trim(),
  exams: parseExamCollection,
}

describe('published content contract', () => {
  it('keeps declared resources present, non-empty and parseable', async () => {
    expect(catalog.terms.length).toBeGreaterThan(0)

    for (const term of catalog.terms) {
      expect(new Set(term.courses.map((course) => course.id)).size).toBe(term.courses.length)

      for (const course of term.courses) {
        expect(new Set(course.weeks.map((week) => week.id)).size).toBe(course.weeks.length)
        expect(new Set(course.topics.map((topic) => topic.id)).size).toBe(course.topics.length)
        course.weeks.forEach((week) => {
          expect(course.calendar.find((entry) => entry.id === week.id)?.week).toBe(week)
        })
        course.topics.forEach((topic) => {
          expect(course.topicMap.find((entry) => entry.id === topic.id)?.topic).toBe(topic)
        })

        for (const [collection, items] of [
          ['weeks', course.weeks],
          ['topics', course.topics],
        ]) {
          for (const item of items) {
            expect(item.resources.draft).toBeUndefined()
            expect(hasContent(
              term.id + '/courses/' + course.id + '/' + collection + '/' + item.id + '/draft.md',
            )).toBe(false)

            for (const [kind, path] of Object.entries(item.resources)) {
              expect(parsers[kind], '未支持的资源类型：' + kind).toBeDefined()
              expect(hasContent(path), '资源不存在：' + path).toBe(true)
              const source = await loadContent(path)
              expect(source.trim(), '资源为空：' + path).not.toBe('')
              expect(() => parsers[kind](source), '资源无法解析：' + path).not.toThrow()
              if (kind === 'exams') expect(parseExamCollection(source).questionCount).toBeGreaterThan(0)
            }
          }
        }
      }
    }
  })
})
