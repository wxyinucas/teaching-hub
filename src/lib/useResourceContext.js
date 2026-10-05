import { computed } from 'vue'
import { findMaterial, findTopic, findWeek, hasContent } from './catalog.js'

const legacyTitles = { runbook: '台本', slides: 'Slides', guide: '学生指南', exams: '真题', template: '话题交流模板' }

// Content identity and reader choice are separate for material courses. Existing
// week/topic routes continue to use their original resource names and URLs.
export function useResourceContext(props, kind) {
  const isMaterial = computed(() => Boolean(props.materialId))
  const isTopic = computed(() => Boolean(props.topicId))
  const context = computed(() => {
    if (isMaterial.value) return findMaterial(props.termId, props.courseId, props.authorId, props.materialId)
    if (isTopic.value) return findTopic(props.termId, props.courseId, props.topicId)
    return findWeek(props.termId, props.courseId, props.weekId)
  })
  const unit = computed(() => context.value?.[isMaterial.value ? 'material' : isTopic.value ? 'topic' : 'week'])
  const resourceId = computed(() => props.resourceId ?? kind)
  const resource = computed(() => isMaterial.value
    ? unit.value?.resources.find((item) => item.id === props.resourceId)
    : { id: resourceId.value, title: legacyTitles[resourceId.value], renderer: kind, path: unit.value?.resources[resourceId.value] })
  const sourcePath = computed(() => resource.value?.path)
  const resourceTitle = computed(() => resource.value?.title ?? legacyTitles[kind])
  const unitLabel = computed(() => isMaterial.value ? unit.value?.title : unit.value?.label)
  const materialsLabel = computed(() => isMaterial.value ? '本材料内容' : isTopic.value ? '本专题材料' : '本周材料')
  const tabs = computed(() => {
    if (isMaterial.value) return unit.value?.resources.filter((item) => hasContent(item.path)) ?? []
    return ['runbook', 'slides', 'guide', ...(isTopic.value ? ['exams'] : ['template'])]
      .filter((id) => unit.value?.resources[id])
      .map((id) => ({ id, renderer: id === 'template' ? 'guide' : id, title: legacyTitles[id] }))
  })

  function resourceLocation(id, extraParams = {}) {
    if (isMaterial.value) return {
      name: 'material-resource',
      params: {
        termId: props.termId, courseId: props.courseId,
        authorId: props.authorId, materialId: props.materialId, resourceId: id,
        ...extraParams,
      },
    }
    return {
      name: `${isTopic.value ? 'topic-' : ''}${id}`,
      params: {
        termId: props.termId, courseId: props.courseId,
        [isTopic.value ? 'topicId' : 'weekId']: isTopic.value ? props.topicId : props.weekId,
        ...extraParams,
      },
    }
  }

  function tabLocation(tab, page = 1) {
    return resourceLocation(tab.id, tab.renderer === 'slides' ? { page } : {})
  }

  return { isMaterial, isTopic, context, unit, resource, sourcePath, resourceTitle, unitLabel, materialsLabel, tabs, resourceLocation, tabLocation }
}
