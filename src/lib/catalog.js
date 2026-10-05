const termFiles = import.meta.glob('../../terms/*/term.json', { eager: true, import: 'default' })
const courseFiles = import.meta.glob('../../terms/*/courses/*/course.json', { eager: true, import: 'default' })
const weekFiles = import.meta.glob('../../terms/*/courses/*/weeks/*/week.json', { eager: true, import: 'default' })
const topicFiles = import.meta.glob('../../terms/*/courses/*/topics/*/topic.json', { eager: true, import: 'default' })
const materialFiles = import.meta.glob('../../terms/*/courses/*/authors/*/materials/*/material.json', { eager: true, import: 'default' })
const sources = import.meta.glob([
  '../../terms/*/courses/*/weeks/*/*.md',
  '../../terms/*/courses/*/topics/*/*.md',
  '../../terms/*/courses/*/authors/*/materials/*/*.md',
  '../../terms/*/courses/*/exams/topics/*.tex',
  '!../../terms/*/courses/*/weeks/*/draft.md',
  '!../../terms/*/courses/*/topics/*/draft.md',
  '!../../terms/*/courses/*/authors/*/materials/*/draft.md',
], { query: '?raw', import: 'default' })

const byOrder = (left, right) => (left.order ?? 999) - (right.order ?? 999) || left.id.localeCompare(right.id)

function contentPath(termId, courseId, collection, itemId, file) {
  if (file && typeof file === 'object') {
    if (file.scope !== 'course' || typeof file.file !== 'string' || !file.file || file.file.startsWith('/') || /(^|\/)\.\.(\/|$)/.test(file.file)) {
      throw new Error(`课程级资源声明无效：${termId}/courses/${courseId}/${collection}/${itemId}`)
    }
    return `${termId}/courses/${courseId}/${file.file}`
  }
  return `${termId}/courses/${courseId}/${collection}/${itemId}/${file}`
}

function mapEntries(manifestPath, map, items, itemKey, duplicateMessage) {
  const entries = map ?? []
  const mappedIds = new Set(entries.map((entry) => entry.id))
  if (mappedIds.size !== entries.length) throw new Error(`${duplicateMessage}：${manifestPath}`)
  return [
    ...entries.map((entry) => ({
      ...entry,
      [itemKey]: items.find((item) => item.id === entry.id) ?? null,
    })),
    ...items
      .filter((item) => !mappedIds.has(item.id))
      .map((item) => ({
        id: item.id,
        label: item.label,
        title: item.title,
        summary: item.summary,
        [itemKey]: item,
      })),
  ]
}

function buildCatalog() {
  const terms = Object.entries(termFiles).map(([path, manifest]) => {
    const match = path.match(/terms\/([^/]+)\/term\.json$/)
    if (!match || manifest.id !== match[1]) throw new Error(`学期清单与目录不一致：${path}`)
    const termId = match[1]
    const courses = Object.entries(courseFiles).flatMap(([coursePath, course]) => {
      const courseMatch = coursePath.match(/terms\/([^/]+)\/courses\/([^/]+)\/course\.json$/)
      if (!courseMatch || courseMatch[1] !== termId) return []
      if (course.id !== courseMatch[2]) throw new Error(`课程清单与目录不一致：${coursePath}`)
      const courseId = courseMatch[2]
      const weeks = Object.entries(weekFiles).flatMap(([weekPath, week]) => {
        const weekMatch = weekPath.match(/terms\/([^/]+)\/courses\/([^/]+)\/weeks\/([^/]+)\/week\.json$/)
        if (!weekMatch || weekMatch[1] !== termId || weekMatch[2] !== courseId) return []
        if (week.id !== weekMatch[3]) throw new Error(`周清单与目录不一致：${weekPath}`)
        const resources = Object.fromEntries(Object.entries(week.resources ?? {}).map(([kind, file]) => [
          kind,
          contentPath(termId, courseId, 'weeks', week.id, file),
        ]))
        return [{ ...week, resources }]
      }).sort(byOrder)
      const topics = Object.entries(topicFiles).flatMap(([topicPath, topic]) => {
        const topicMatch = topicPath.match(/terms\/([^/]+)\/courses\/([^/]+)\/topics\/([^/]+)\/topic\.json$/)
        if (!topicMatch || topicMatch[1] !== termId || topicMatch[2] !== courseId) return []
        if (topic.id !== topicMatch[3]) throw new Error(`专题清单与目录不一致：${topicPath}`)
        const resources = Object.fromEntries(Object.entries(topic.resources ?? {}).map(([kind, file]) => [
          kind,
          contentPath(termId, courseId, 'topics', topic.id, file),
        ]))
        return [{ ...topic, resources }]
      }).sort(byOrder)
      const calendar = mapEntries(coursePath, course.weekMap, weeks, 'week', '课程地图含有重复周次')
      const topicMap = mapEntries(coursePath, course.topicMap, topics, 'topic', '课程地图含有重复专题')
      const materials = Object.entries(materialFiles).flatMap(([materialPath, material]) => {
        const match = materialPath.match(/terms\/([^/]+)\/courses\/([^/]+)\/authors\/([^/]+)\/materials\/([^/]+)\/material\.json$/)
        if (!match || match[1] !== termId || match[2] !== courseId) return []
        if (material.id !== match[4]) throw new Error(`材料清单与目录不一致：${materialPath}`)
        const resources = material.resources ?? []
        if (!Array.isArray(resources) || new Set(resources.map((resource) => resource.id)).size !== resources.length) {
          throw new Error(`材料资源声明无效或含有重复 id：${materialPath}`)
        }
        const directory = `${termId}/courses/${courseId}/authors/${match[3]}/materials/${match[4]}`
        return [{ ...material, authorId: match[3], resources: resources.map((resource) => {
          if (!/^[a-zA-Z0-9_-]+$/.test(resource.id ?? '') || !resource.title || !['guide', 'slides', 'cards'].includes(resource.renderer)
            || typeof resource.file !== 'string' || !/^[^/\\]+\.md$/.test(resource.file) || resource.file === 'draft.md') {
            throw new Error(`材料资源声明无效：${materialPath}`)
          }
          return { ...resource, path: `${directory}/${resource.file}` }
        }) }]
      }).sort((left, right) => byOrder(left, right) || left.authorId.localeCompare(right.authorId))
      return [{ ...course, organization: course.organization ?? 'weeks', weeks, calendar, topics, topicMap, materials }]
    }).sort(byOrder)
    return { ...manifest, courses }
  }).sort(byOrder)
  return { terms }
}

export const catalog = buildCatalog()

export function findTerm(termId, collection = catalog) {
  return collection.terms.find((term) => term.id === termId) ?? null
}

export function findCourse(termId, courseId, collection = catalog) {
  const term = findTerm(termId, collection)
  const course = term?.courses.find((item) => item.id === courseId)
  return course ? { term, course } : null
}

export function findWeek(termId, courseId, weekId, collection = catalog) {
  const context = findCourse(termId, courseId, collection)
  const week = context?.course.weeks.find((item) => item.id === weekId)
  return week ? { ...context, week } : null
}

export function findTopic(termId, courseId, topicId, collection = catalog) {
  const context = findCourse(termId, courseId, collection)
  const topic = context?.course.organization === 'topics'
    ? context.course.topics.find((item) => item.id === topicId)
    : null
  return topic ? { ...context, topic } : null
}

export function findMaterial(termId, courseId, authorId, materialId, collection = catalog) {
  const context = findCourse(termId, courseId, collection)
  const material = context?.course.organization === 'materials'
    ? (context.course.materials ?? []).find((item) => item.authorId === authorId && item.id === materialId)
    : null
  return material ? { ...context, material } : null
}

export function findMaterialResource(termId, courseId, authorId, materialId, resourceId, collection = catalog) {
  const context = findMaterial(termId, courseId, authorId, materialId, collection)
  const resource = context?.material.resources.find((item) => item.id === resourceId)
  return resource ? { ...context, resource } : null
}

export function hasContent(path) {
  return Boolean(path && sources[`../../terms/${path}`])
}

export async function loadContent(path) {
  const load = path && sources[`../../terms/${path}`]
  if (!load) throw new Error(`找不到 terms/${path ?? ''}，请核对对应内容清单的资源登记。`)
  return load()
}
