const termFiles = import.meta.glob('../../terms/*/term.json', { eager: true, import: 'default' })
const courseFiles = import.meta.glob('../../terms/*/courses/*/course.json', { eager: true, import: 'default' })
const weekFiles = import.meta.glob('../../terms/*/courses/*/weeks/*/week.json', { eager: true, import: 'default' })
const sources = import.meta.glob([
  '../../terms/*/courses/*/weeks/*/*.md',
  '!../../terms/*/courses/*/weeks/*/draft.md',
], { query: '?raw', import: 'default' })

const byOrder = (left, right) => (left.order ?? 999) - (right.order ?? 999) || left.id.localeCompare(right.id)

function contentPath(termId, courseId, weekId, file) {
  return `${termId}/courses/${courseId}/weeks/${weekId}/${file}`
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
          contentPath(termId, courseId, week.id, file),
        ]))
        return [{ ...week, resources }]
      }).sort(byOrder)
      return [{ ...course, weeks }]
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

export function hasContent(path) {
  return Boolean(path && sources[`../../terms/${path}`])
}

export async function loadContent(path) {
  const load = path && sources[`../../terms/${path}`]
  if (!load) throw new Error(`找不到 terms/${path ?? ''}，请核对 week.json 的资源登记。`)
  return load()
}
