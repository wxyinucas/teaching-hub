import { describe, expect, it } from 'vitest'
import { findCourse, findMaterial, findMaterialResource, findTopic, findWeek, loadContent } from '../src/lib/catalog.js'

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

  it('keeps material and resource identities scoped to their authors', () => {
    const first = { id: 'shared-title', authorId: 'first-author', resources: [
      { id: 'notes', renderer: 'guide', title: '材料笔记' },
      { id: 'comparison', renderer: 'guide', title: '观点对照' },
    ] }
    const second = { id: 'shared-title', authorId: 'second-author', resources: [{ id: 'notes', renderer: 'guide', title: '第二份笔记' }] }
    const collection = { terms: [{ id: 'term', courses: [
      { id: 'materials', organization: 'materials', materials: [first, second] },
      { id: 'weeks', organization: 'weeks', materials: [first] },
    ] }] }

    expect(findMaterial('term', 'materials', 'first-author', 'shared-title', collection)?.material).toBe(first)
    expect(findMaterial('term', 'materials', 'second-author', 'shared-title', collection)?.material).toBe(second)
    expect(findMaterialResource('term', 'materials', 'first-author', 'shared-title', 'comparison', collection)?.resource).toBe(first.resources[1])
    expect(findMaterialResource('term', 'materials', 'second-author', 'shared-title', 'comparison', collection)).toBeNull()
    expect(findMaterial('term', 'weeks', 'first-author', 'shared-title', collection)).toBeNull()
    expect(findMaterial('term', 'materials', 'missing-author', 'shared-title', collection)).toBeNull()
  })
})
