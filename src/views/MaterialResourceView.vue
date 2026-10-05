<script setup>
import { computed } from 'vue'
import { findMaterialResource } from '../lib/catalog.js'
import GuideView from './GuideView.vue'
import SlidesView from './SlidesView.vue'
import RunbookView from './RunbookView.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({ termId: String, courseId: String, authorId: String, materialId: String, resourceId: String, page: String })
const readers = { guide: GuideView, slides: SlidesView, cards: RunbookView }
const reader = computed(() => readers[findMaterialResource(
  props.termId, props.courseId, props.authorId, props.materialId, props.resourceId,
)?.resource.renderer])
</script>

<template>
  <component :is="reader" v-if="reader" v-bind="props" />
  <NotFoundView v-else />
</template>
