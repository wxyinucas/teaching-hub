import { renderSlideMarkdown } from './markdown.js'

const directivePattern = /<!--\s*(layout|section|subsection|column|footer|lead)\s*(?::\s*([^>]*?))?\s*-->/gi
const allowedLayouts = new Set(['cover', 'question', 'columns', 'prompt', 'content'])

function splitPages(source) {
  const pages = []
  let lines = []
  let fence = null

  for (const line of source.replace(/\r\n?/g, '\n').split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)
    if (marker) {
      if (!fence) fence = marker[1][0]
      else if (marker[1][0] === fence) fence = null
    }
    if (!fence && /^\s*---\s*$/.test(line)) {
      pages.push(lines.join('\n').trim())
      lines = []
    } else {
      lines.push(line)
    }
  }
  pages.push(lines.join('\n').trim())
  return pages.filter(Boolean)
}

function directive(source, name) {
  const match = source.match(new RegExp(`<!--\\s*${name}\\s*:\\s*([^>]*?)\\s*-->`, 'i'))
  return match?.[1].trim() ?? ''
}

function stripDirectives(source) {
  return source.replace(directivePattern, '').trim()
}

function readTitle(source, level = 1) {
  const lines = source.split('\n')
  const pattern = new RegExp(`^#{${level}}\\s+(.+?)\\s*$`)
  const index = lines.findIndex((line) => pattern.test(line))
  if (index < 0) throw new Error(`课件页缺少 ${'#'.repeat(level)} 标题。`)
  const title = lines[index].match(pattern)[1]
  lines.splice(index, 1)
  return { title, body: lines.join('\n').trim() }
}

function readSubtitle(source) {
  const lines = source.split('\n')
  const index = lines.findIndex((line) => /^>\s+/.test(line))
  if (index < 0) return { subtitle: '', body: source.trim() }
  const subtitle = lines[index].replace(/^>\s+/, '').trim()
  lines.splice(index, 1)
  return { subtitle, body: lines.join('\n').trim() }
}

function readColumn(source) {
  const clean = stripDirectives(source)
  const { title, body: afterTitle } = readTitle(clean, 2)
  const lines = afterTitle.split('\n')
  const tagIndex = lines.findIndex((line) => line.trim())
  let tag = ''
  if (tagIndex >= 0) {
    const match = lines[tagIndex].trim().match(/^\*\*(.+)\*\*$/)
    if (match) {
      tag = match[1]
      lines.splice(tagIndex, 1)
    }
  }
  return { title, tag, html: renderSlideMarkdown(lines.join('\n')) }
}

function readColumns(raw) {
  const footerParts = raw.split(/<!--\s*footer\s*-->/i)
  if (footerParts.length > 2) throw new Error('一页课件只能有一个 footer。')
  const columnParts = footerParts[0].split(/<!--\s*column\s*-->/i)
  const prefix = columnParts.shift()
  if (columnParts.length < 2 || columnParts.length > 3) throw new Error('columns 布局只支持两栏或三栏。')
  const { title, body: leadSource } = readTitle(stripDirectives(prefix))
  return {
    title,
    leadHtml: renderSlideMarkdown(leadSource),
    columns: columnParts.map(readColumn),
    footerHtml: footerParts[1] ? renderSlideMarkdown(stripDirectives(footerParts[1])) : '',
  }
}

export function parseSlides(source) {
  const rawPages = splitPages(source)
  if (!rawPages.length) throw new Error('课件至少需要一页。')
  const sections = rawPages.map((page) => directive(page, 'section')).filter(Boolean)
  let sectionIndex = -1

  const slides = rawPages.map((raw, index) => {
    const section = directive(raw, 'section')
    if (section) {
      sectionIndex += 1
      if (stripDirectives(raw)) throw new Error('section 页只写 section 注释，不再填写正文。')
      return { number: index + 1, layout: 'section', section, sectionIndex, sections }
    }

    const layout = directive(raw, 'layout') || 'content'
    if (!allowedLayouts.has(layout)) throw new Error(`不支持的课件布局：${layout}`)
    if (layout === 'columns') {
      return { number: index + 1, layout, sectionIndex, ...readColumns(raw) }
    }

    const clean = stripDirectives(raw)
    const { title, body: afterTitle } = readTitle(clean)
    if (layout === 'cover' || layout === 'question') {
      const { subtitle, body } = readSubtitle(afterTitle)
      return {
        number: index + 1, layout, sectionIndex, title, subtitle,
        html: renderSlideMarkdown(body),
      }
    }
    return {
      number: index + 1, layout, sectionIndex, title,
      html: renderSlideMarkdown(afterTitle),
      copyText: layout === 'prompt' ? afterTitle.trim() : '',
    }
  })

  return { slides, sections, count: slides.length }
}
