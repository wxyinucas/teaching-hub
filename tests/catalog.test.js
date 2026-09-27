import { describe, expect, it } from 'vitest'
import { findCourse, findTopic, findWeek, loadContent } from '../src/lib/catalog.js'

describe('term-first content catalog', () => {
  it('keeps equally named resources inside their declared course and organization', async () => {
    const sharedWeek = { id: 'shared-week' }
    const sharedTopic = { id: 'shared-topic' }
    const weekCourse = { id: 'weekly', organization: 'weeks', weeks: [sharedWeek], topics: [] }
    const topicCourse = { id: 'topical', organization: 'topics', weeks: [], topics: [sharedTopic] }
    const collection = { terms: [{ id: 'term', courses: [weekCourse, topicCourse] }] }

    expect(findCourse('term', 'weekly', collection)?.course).toBe(weekCourse)
    expect(findWeek('term', 'weekly', sharedWeek.id, collection)?.week).toBe(sharedWeek)
    expect(findWeek('term', 'topical', sharedWeek.id, collection)).toBeNull()
    expect(findTopic('term', 'topical', sharedTopic.id, collection)?.topic).toBe(sharedTopic)
    expect(findTopic('term', 'weekly', sharedTopic.id, collection)).toBeNull()
    expect(findCourse('missing', 'weekly', collection)).toBeNull()

    await expect(loadContent('not-declared.md')).rejects.toThrow('找不到 terms/')
  })
})
