import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false })
const slideMarkdown = new MarkdownIt({ html: false, linkify: false, typographer: false })

function externalLink(tokens, index, options, env, renderer) {
  tokens[index].attrSet('target', '_blank')
  tokens[index].attrSet('rel', 'noopener noreferrer')
  return renderer.renderToken(tokens, index, options)
}

markdown.renderer.rules.link_open = externalLink
slideMarkdown.renderer.rules.link_open = externalLink

markdown.renderer.rules.fence = (tokens, index, options, env) => {
  const token = tokens[index]
  const codeIndex = env.codes.push(token.content) - 1
  const label = markdown.utils.escapeHtml(token.info.trim().split(/\s+/)[0] || '文本')
  return `<div class="code-block"><div class="code-toolbar"><span>${label}</span><button type="button" data-copy-code="${codeIndex}" aria-label="复制这段内容">复制</button></div><pre><code>${markdown.utils.escapeHtml(token.content)}</code></pre></div>`
}

export function renderNotes(source) {
  const env = { codes: [] }
  return { html: markdown.render(source, env), codes: env.codes }
}

export function renderSlideMarkdown(source) {
  return slideMarkdown.render(source.trim())
}
