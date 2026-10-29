const blockSelector = 'h1,h2,h3,h4,h5,h6,p,li,table,pre,blockquote'
const normalize = (value) => (value ?? '').replace(/\s+/g, ' ').trim().slice(0, 600)
const before = (left, right) => left === right || Boolean(left.compareDocumentPosition(right) & 4)
const rectOf = (element) => element?.getBoundingClientRect?.()
const hasLayout = (rect) => rect && Number.isFinite(rect.top) && rect.height > 0

function headingsIn(segment) {
  return [...segment.querySelectorAll('.notes-content h4')]
}

function blocksIn(segment) {
  return [...segment.querySelectorAll('.notes-content')].flatMap((notes) => (
    [...notes.querySelectorAll(blockSelector)].filter((element) => {
      if (element.closest('table,pre') !== null && !element.matches('table,pre')) return false
      if (element.matches('li,blockquote') && element.querySelector(blockSelector)) return false
      return normalize(element.textContent) !== ''
    })
  ))
}

function outlineFor(element, headings) {
  return headings.filter((heading) => before(heading, element)).at(-1) ?? null
}

function outlineBlocks(segment, heading, headings = headingsIn(segment)) {
  return blocksIn(segment).filter((block) => outlineFor(block, headings) === heading)
}

function nearestVisible(elements, viewportHeight, readingLine) {
  return elements.flatMap((element) => {
    const rect = rectOf(element)
    if (!hasLayout(rect) || rect.bottom <= 0 || rect.top >= viewportHeight) return []
    const distance = Math.max(rect.top - readingLine, readingLine - rect.bottom, 0)
    return [{ element, rect, distance }]
  }).sort((left, right) => left.distance - right.distance || left.rect.height - right.rect.height)[0]
}

/** Capture content identity and its viewport offset, rather than a fragile document y-coordinate. */
export function captureRunbookPosition(root, viewportHeight = globalThis.window?.innerHeight ?? 768) {
  if (!root || !Number.isFinite(viewportHeight) || viewportHeight <= 0) return null
  const readingLine = Math.max(88, Math.min(160, viewportHeight * 0.2))
  const segments = [...root.querySelectorAll('[data-reading-segment]')].filter((element) => {
    const rect = rectOf(element)
    return hasLayout(rect) && rect.bottom > 0 && rect.top < viewportHeight
  })
  const content = segments.flatMap(blocksIn)
  const picked = nearestVisible(content, viewportHeight, readingLine)
    ?? nearestVisible([
      ...segments,
      ...root.querySelectorAll('[data-reading-section] > .period-header'),
      ...root.querySelectorAll(':scope > .lesson-heading, :scope > .topic-roadmap'),
    ], viewportHeight, readingLine)
  if (!picked) return null

  const { element, rect } = picked
  const segment = element.closest('[data-reading-segment]')
  const section = element.closest('[data-reading-section]')
  const headings = segment ? headingsIn(segment) : []
  const heading = outlineFor(element, headings)
  const title = heading ? normalize(heading.textContent) : ''
  const blocks = segment ? outlineBlocks(segment, heading, headings) : []
  const text = normalize(element.textContent)
  const tag = element.tagName.toLowerCase()
  const peers = blocks.filter((block) => block.tagName.toLowerCase() === tag && normalize(block.textContent) === text)
  const offsetOf = (node) => hasLayout(rectOf(node)) ? rectOf(node).top : null
  return {
    segmentKey: segment?.dataset.readingSegment ?? '',
    sectionKey: section?.dataset.readingSection ?? '',
    outlineTitle: title,
    outlineOccurrence: heading ? headings.filter((item) => normalize(item.textContent) === title).indexOf(heading) : -1,
    outlineIndex: heading ? headings.indexOf(heading) : -1,
    block: peers.includes(element) ? { tag, text, occurrence: peers.indexOf(element) } : null,
    offset: rect.top,
    outlineOffset: offsetOf(heading),
    segmentOffset: offsetOf(segment),
    sectionOffset: offsetOf(section),
    overview: !section && !segment ? (element.matches('.lesson-heading') ? 'heading' : 'roadmap') : '',
    scrollY: globalThis.window?.scrollY ?? 0,
  }
}

/** Resolve against the updated DOM; the caller applies rect.top - offset to scrollY. */
export function resolveRunbookPosition(root, position) {
  if (!root || !position || !Number.isFinite(position.offset)) return null
  const result = (element, offset = position.offset) => (
    element && hasLayout(rectOf(element)) && Number.isFinite(offset) ? { element, offset } : null
  )
  if (position.overview) {
    return result(root.querySelector(position.overview === 'heading' ? ':scope > .lesson-heading' : ':scope > .topic-roadmap'))
  }
  const section = [...root.querySelectorAll('[data-reading-section]')]
    .find((item) => item.dataset.readingSection === position.sectionKey)
  const segment = [...root.querySelectorAll('[data-reading-segment]')]
    .find((item) => item.dataset.readingSegment === position.segmentKey)
  if (!segment) return result(section, position.sectionOffset)
  const headings = headingsIn(segment)
  const matches = headings.filter((heading) => normalize(heading.textContent) === position.outlineTitle)
  const heading = matches[position.outlineOccurrence] ?? null
  const sameBlock = (block) => block.tagName.toLowerCase() === position.block?.tag
    && normalize(block.textContent) === position.block?.text
  if (position.block) {
    const blocks = outlineBlocks(segment, heading, headings).filter(sameBlock)
    const block = blocks[position.block.occurrence]
    const match = result(block)
    if (match) return match
    // A heading may itself have been renamed while the paragraph being read remains unchanged.
    if (!heading) {
      const globalMatches = blocksIn(segment).filter(sameBlock)
      const unique = globalMatches.length === 1 ? result(globalMatches[0]) : null
      if (unique) return unique
    }
  }
  const outline = result(heading, position.outlineOffset)
  if (outline) return outline
  if (position.outlineIndex >= 0 && headings[position.outlineIndex]) {
    const previousIndex = result(headings[position.outlineIndex], position.outlineOffset)
    if (previousIndex) return previousIndex
  }
  const bodyIsHidden = position.block && !blocksIn(segment).some((block) => hasLayout(rectOf(block)))
  return result(segment, bodyIsHidden ? position.offset : (position.segmentOffset ?? position.offset))
}
