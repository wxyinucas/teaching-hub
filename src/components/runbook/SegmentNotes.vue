<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { renderNotes } from '../../lib/markdown.js'

const props = defineProps({ source: { type: String, default: '' } })
const rendered = computed(() => renderNotes(props.source))
const feedback = ref('')
const timers = new Set()

async function handleClick(event) {
  const button = event.target.closest?.('button[data-copy-code]')
  if (!button || !event.currentTarget.contains(button)) return
  const code = rendered.value.codes[Number(button.dataset.copyCode)]
  if (code === undefined) return
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
    await navigator.clipboard.writeText(code)
    button.textContent = '已复制'
    feedback.value = '内容已复制。命令请在提示的终端中执行。'
  } catch {
    button.textContent = '请手动复制'
    feedback.value = '浏览器未允许复制，请选中下方文字手动复制。'
  }
  const timer = setTimeout(() => {
    if (button.isConnected) button.textContent = '复制'
    timers.delete(timer)
  }, 2400)
  timers.add(timer)
}

onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <div v-if="source.trim()" class="notes-content" @click="handleClick" v-html="rendered.html"></div>
  <p v-else class="empty-notes">这一段还没有补充提示。总览中的落点已经保留。</p>
  <p class="sr-only" role="status" aria-live="polite">{{ feedback }}</p>
</template>
