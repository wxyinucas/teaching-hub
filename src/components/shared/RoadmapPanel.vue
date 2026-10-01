<script setup>
import { computed } from 'vue'
import SegmentNotes from '../runbook/SegmentNotes.vue'

const props = defineProps({
  title: { type: String, default: 'Road map' },
  subtitle: { type: String, default: '' },
  source: { type: String, required: true },
  expanded: { type: Boolean, default: true },
  titleId: { type: String, required: true },
  contentId: { type: String, required: true },
  toggleLabel: { type: String, default: '' },
})
defineEmits(['toggle'])

const actionLabel = computed(() => (
  props.toggleLabel || `${props.expanded ? '收起' : '展开'} ${props.title}`
))
</script>

<template>
  <section class="topic-roadmap" :class="{ 'is-collapsed': !expanded }" :aria-labelledby="titleId">
    <div class="topic-roadmap-header">
      <h2 :id="titleId">{{ title }}<span v-if="subtitle"> · {{ subtitle }}</span></h2>
      <button
        type="button"
        class="topic-roadmap-toggle"
        :aria-label="actionLabel"
        :aria-expanded="expanded"
        :aria-controls="contentId"
        @click="$emit('toggle')"
      >{{ expanded ? '收起' : '展开' }} <span aria-hidden="true">{{ expanded ? '↑' : '↓' }}</span></button>
    </div>
    <div :id="contentId" v-show="expanded" class="topic-roadmap-content" role="region" :aria-labelledby="titleId">
      <SegmentNotes :source="source" />
    </div>
  </section>
</template>
