<script setup>
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  tex: { type: String, required: true },
  display: { type: Boolean, default: false },
})

const rendered = computed(() => katex.renderToString(props.tex, {
  displayMode: props.display,
  throwOnError: false,
  trust: false,
  output: 'htmlAndMathml',
}))
</script>

<template>
  <div v-if="display" class="math-formula math-display" v-html="rendered"></div>
  <span v-else class="math-formula math-inline" v-html="rendered"></span>
</template>
