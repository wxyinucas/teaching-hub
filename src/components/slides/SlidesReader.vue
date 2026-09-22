<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const FONT_SCALE_STORAGE_KEY = 'teaching-hub:slide-font-scale'
const DEFAULT_FONT_SCALE = 100
const MIN_FONT_SCALE = 90
const MAX_FONT_SCALE = 140
const FONT_SCALE_STEP = 5

function normalizeFontScale(value) {
  if (value === null || value === '') return DEFAULT_FONT_SCALE
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return DEFAULT_FONT_SCALE
  const stepped = Math.round(numeric / FONT_SCALE_STEP) * FONT_SCALE_STEP
  return Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, stepped))
}

function readStoredFontScale() {
  try {
    return normalizeFontScale(window.localStorage.getItem(FONT_SCALE_STORAGE_KEY))
  } catch {
    return DEFAULT_FONT_SCALE
  }
}

function storeFontScale(value) {
  try {
    window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(value))
  } catch {
    // The slider still works when storage is unavailable (for example, in a private window).
  }
}

const props = defineProps({
  deck: { type: Object, required: true },
  page: { type: Number, required: true },
  lessons: { type: Array, default: () => [] },
  currentLessonIndex: { type: Number, default: -1 },
  variant: { type: String, default: '' },
})
const emit = defineEmits(['change', 'lesson-change'])
const feedback = ref('')
const reader = ref(null)
const slideCanvas = ref(null)
const fullscreenSupported = ref(false)
const isFullscreen = ref(false)
const fullscreenFeedback = ref('')
const fontScale = ref(readStoredFontScale())
const slideMayClip = ref(false)
let feedbackTimer

const slide = computed(() => props.deck.slides[props.page - 1])
const canPrevious = computed(() => props.page > 1)
const canNext = computed(() => props.page < props.deck.count)
const slideFontStyle = computed(() => ({ '--slide-font-scale': fontScale.value / 100 }))

function go(page) {
  emit('change', Math.min(props.deck.count, Math.max(1, page)))
}

function handleKey(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return
  const actions = {
    ArrowLeft: () => go(props.page - 1),
    PageUp: () => go(props.page - 1),
    ArrowRight: () => go(props.page + 1),
    PageDown: () => go(props.page + 1),
    Home: () => go(1),
    End: () => go(props.deck.count),
  }
  if (actions[event.key]) {
    event.preventDefault()
    actions[event.key]()
  }
}

async function copyPrompt() {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
    await navigator.clipboard.writeText(slide.value.copyText)
    feedback.value = 'Prompt 已复制'
  } catch {
    feedback.value = '浏览器未允许复制，请手动选择文字'
  }
  clearTimeout(feedbackTimer)
  feedbackTimer = setTimeout(() => { feedback.value = '' }, 2400)
}

function syncFullscreen() {
  isFullscreen.value = document.fullscreenElement === reader.value
  inspectSlideOverflow()
}

async function toggleFullscreen() {
  fullscreenFeedback.value = ''
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await reader.value.requestFullscreen()
  } catch {
    fullscreenFeedback.value = '浏览器未允许进入全屏，请使用浏览器菜单重试。'
  }
}

function changeFontScale(event) {
  const value = normalizeFontScale(event.currentTarget.value)
  fontScale.value = value
  storeFontScale(value)
}

function resetFontScale() {
  fontScale.value = DEFAULT_FONT_SCALE
  storeFontScale(DEFAULT_FONT_SCALE)
}

async function inspectSlideOverflow() {
  await nextTick()
  const element = slideCanvas.value
  if (!element) {
    slideMayClip.value = false
    return
  }
  const clipsVertically = element.clientHeight > 0 && element.scrollHeight > element.clientHeight + 1
  const clipsHorizontally = element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1
  slideMayClip.value = clipsVertically || clipsHorizontally
}

watch([fontScale, slide], inspectSlideOverflow, { flush: 'post' })

onMounted(() => {
  fullscreenSupported.value = Boolean(reader.value?.requestFullscreen && document.exitFullscreen)
  syncFullscreen()
  window.addEventListener('keydown', handleKey)
  window.addEventListener('resize', inspectSlideOverflow)
  document.addEventListener('fullscreenchange', syncFullscreen)
  inspectSlideOverflow()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
  window.removeEventListener('resize', inspectSlideOverflow)
  document.removeEventListener('fullscreenchange', syncFullscreen)
  clearTimeout(feedbackTimer)
})
</script>

<template>
  <section
    ref="reader"
    class="slides-reader"
    :class="variant ? `slides-reader--${variant}` : undefined"
    :style="slideFontStyle"
    aria-label="静态课堂课件"
  >
    <nav v-if="lessons.length" class="slide-lesson-tabs" aria-label="课次课件">
      <button
        v-for="(lesson, index) in lessons"
        :key="`${lesson.startPage}-${lesson.label}`"
        type="button"
        :class="{ 'is-current': index === currentLessonIndex }"
        :aria-current="index === currentLessonIndex ? 'page' : undefined"
        @click="emit('lesson-change', index)"
      >{{ lesson.label }}</button>
    </nav>
    <div class="slide-stage">
      <article v-if="slide.layout === 'cover'" ref="slideCanvas" class="slide-canvas slide-cover">
        <div class="slide-title-block">
          <span class="slide-overline">Teaching Hub</span>
          <h1>{{ slide.title }}</h1>
          <p>{{ slide.subtitle }}</p>
        </div>
        <div class="slide-cover-meta" v-html="slide.html"></div>
      </article>

      <article v-else-if="slide.layout === 'section'" ref="slideCanvas" class="slide-canvas slide-section">
        <header><span>WEEKLY ROUTE</span><h1>全局目录</h1></header>
        <ol>
          <li v-for="(section, index) in slide.sections" :key="section" :class="{ active: index === slide.sectionIndex }">
            <span>{{ String(index + 1).padStart(2, '0') }}</span><strong>{{ section }}</strong>
          </li>
        </ol>
      </article>

      <article v-else-if="slide.layout === 'question'" ref="slideCanvas" class="slide-canvas slide-question">
        <div class="slide-title-block">
          <h1>{{ slide.title }}</h1>
          <p>{{ slide.subtitle }}</p>
        </div>
      </article>

      <article v-else-if="slide.layout === 'columns'" ref="slideCanvas" class="slide-canvas slide-columns">
        <header class="slide-heading"><h1>{{ slide.title }}</h1></header>
        <div v-if="slide.leadHtml" class="slide-lead" v-html="slide.leadHtml"></div>
        <div class="slide-column-grid" :class="`has-${slide.columns.length}-columns`">
          <section v-for="column in slide.columns" :key="column.title" class="slide-column">
            <h2>{{ column.title }}</h2>
            <span v-if="column.tag" class="slide-tag">{{ column.tag }}</span>
            <div v-html="column.html"></div>
          </section>
        </div>
        <footer v-if="slide.footerHtml" class="slide-footer" v-html="slide.footerHtml"></footer>
      </article>

      <article v-else-if="slide.layout === 'agenda'" ref="slideCanvas" class="slide-canvas slide-agenda">
        <header class="slide-heading"><h1>{{ slide.title }}</h1></header>
        <div class="slide-agenda-body" v-html="slide.html"></div>
      </article>

      <article v-else-if="slide.layout === 'prompt'" ref="slideCanvas" class="slide-canvas slide-prompt">
        <header class="slide-heading prompt-heading">
          <div><span>可直接复制</span><h1>{{ slide.title }}</h1></div>
          <button type="button" @click="copyPrompt">复制 Prompt</button>
        </header>
        <div class="prompt-copy" v-html="slide.html"></div>
        <p class="copy-feedback" role="status" aria-live="polite">{{ feedback }}</p>
      </article>

      <article v-else ref="slideCanvas" class="slide-canvas slide-content" :class="{ 'has-footer': slide.footerHtml }">
        <header class="slide-heading"><h1>{{ slide.title }}</h1></header>
        <div class="slide-content-body" v-html="slide.html"></div>
        <footer v-if="slide.footerHtml" class="slide-footer" v-html="slide.footerHtml"></footer>
      </article>
    </div>

    <nav class="slide-controls" aria-label="课件翻页">
      <button class="slide-previous" type="button" :disabled="!canPrevious" @click="go(page - 1)"><span aria-hidden="true">←</span> 上一页</button>
      <span class="slide-progress"><strong>{{ page }}</strong> / {{ deck.count }}</span>
      <div class="slide-display-controls">
        <label class="slide-font-scale">
          <span>字号</span>
          <input
            type="range"
            :min="MIN_FONT_SCALE"
            :max="MAX_FONT_SCALE"
            :step="FONT_SCALE_STEP"
            :value="fontScale"
            aria-label="全局课件字号"
            @input="changeFontScale"
          >
          <output>{{ fontScale }}%</output>
        </label>
        <button class="slide-font-reset" type="button" :disabled="fontScale === DEFAULT_FONT_SCALE" @click="resetFontScale">重置</button>
        <span v-if="slideMayClip" class="slide-overflow-warning" role="status">本页可能被裁切</span>
        <button
          v-if="fullscreenSupported"
          class="slide-fullscreen"
          type="button"
          :aria-pressed="isFullscreen"
          @click="toggleFullscreen"
        >{{ isFullscreen ? '退出全屏' : '全屏' }}</button>
      </div>
      <button class="slide-next" type="button" :disabled="!canNext" @click="go(page + 1)">下一页 <span aria-hidden="true">→</span></button>
      <span class="sr-only" role="status" aria-live="polite">{{ fullscreenFeedback }}</span>
    </nav>
    <p class="slide-key-hint">方向键或 Page Up / Page Down 翻页，Home / End 跳到首尾。</p>
  </section>
</template>
