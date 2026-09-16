import MarkdownIt from 'markdown-it'
import { katex } from '@mdit/plugin-katex'

function createMarkdown() {
  return new MarkdownIt({ html: false, linkify: false, typographer: false }).use(katex, {
    delimiters: 'dollars',
    maxExpand: 1000,
    maxSize: 20,
    throwOnError: false,
    trust: false,
  })
}

const markdown = createMarkdown()
const slideMarkdown = createMarkdown()

function externalLink(tokens, index, options, env, renderer) {
  tokens[index].attrSet('target', '_blank')
  tokens[index].attrSet('rel', 'noopener noreferrer')
  return renderer.renderToken(tokens, index, options)
}

markdown.renderer.rules.link_open = externalLink
slideMarkdown.renderer.rules.link_open = externalLink

function isStandaloneEmphasis(token) {
  const children = token?.children ?? []
  if (children.length < 3 || children[0].type !== 'em_open' || children.at(-1).type !== 'em_close') return false

  let depth = 0
  return children.every((child, index) => {
    if (child.type === 'em_open') depth += 1
    if (child.type === 'em_close') depth -= 1
    return depth >= 0 && (depth > 0 || index === children.length - 1)
  }) && depth === 0
}

markdown.renderer.rules.paragraph_open = (tokens, index, options, env, renderer) => {
  const token = tokens[index]
  if (token.level === 0 && isStandaloneEmphasis(tokens[index + 1])) token.attrJoin('class', 'notes-emphasis')
  return renderer.renderToken(tokens, index, options)
}

markdown.renderer.rules.heading_open = (tokens, index, options, env, renderer) => {
  const token = tokens[index]
  if (token.tag === 'h4' && token.level === 0) {
    const id = env.headingIds?.[env.headingIndex ?? 0]
    if (id) token.attrSet('id', id)
    env.headingIndex = (env.headingIndex ?? 0) + 1
  }
  return renderer.renderToken(tokens, index, options)
}

markdown.renderer.rules.fence = (tokens, index, options, env) => {
  const token = tokens[index]
  const codeIndex = env.codes.push(token.content) - 1
  const label = markdown.utils.escapeHtml(token.info.trim().split(/\s+/)[0] || '文本')
  return `<div class="code-block"><div class="code-toolbar"><span>${label}</span><button type="button" data-copy-code="${codeIndex}" aria-label="复制这段内容">复制</button></div><pre><code>${markdown.utils.escapeHtml(token.content)}</code></pre></div>`
}

export function renderNotes(source, headingIds = []) {
  const env = { codes: [], headingIds, headingIndex: 0 }
  return { html: markdown.render(source, env), codes: env.codes }
}

export function renderSlideMarkdown(source) {
  return slideMarkdown.render(source.trim())
}
