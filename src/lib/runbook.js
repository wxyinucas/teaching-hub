import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({ html: false })
const PERIOD_DURATION = 50

// Only the overview needs a little structure. Segment notes remain ordinary
// Markdown: no fixed number of slots and no mandatory detail fields.
function readCallouts(lines) {
  return lines.flatMap((line) => {
    const match = line.match(/^-\s+([^：:]+)[：:]\s*(.+)$/)
    return match ? [{ label: match[1].trim(), text: match[2].trim() }] : []
  })
}

function readOverview(lines) {
  const start = lines.findIndex((line) => /^- \*\*Road map[：:]/.test(line))
  if (start < 0) return { anchors: readCallouts(lines), roadmap: null }

  const title = lines[start].match(/^- \*\*Road map[：:]\s*(.+)\*\*\s*$/)?.[1]?.trim() ?? ''
  let end = start + 1
  while (end < lines.length && (!lines[end].trim() || /^[ \t]/.test(lines[end]))) end += 1
  const source = lines.slice(start + 1, end).map((line) => line.replace(/^  /, '')).join('\n').trim()
  return {
    anchors: readCallouts([...lines.slice(0, start), ...lines.slice(end)]),
    roadmap: source ? { title, source } : null,
  }
}

function readSegment(heading, lines, end, number, detailHeadings = []) {
  const match = heading.text.match(/^(\d+)\s*[-–—]\s*(\d+)\s*[|｜]\s*(.+)$/)
  if (!match || Number(match[1]) >= Number(match[2])) {
    throw new Error(`“${heading.text}”的标题请写成“0-10 | 推进什么”，结束时间需晚于开始时间。`)
  }
  const body = lines.slice(heading.end, end)
  while (body.length && !body[0].trim()) body.shift()
  const summary = body[0]?.match(/^>\s?(.*)$/)
  if (summary) body.shift()

  const id = `segment-${number}`
  return {
    id,
    number,
    start: Number(match[1]),
    end: Number(match[2]),
    time: `${match[1]}–${match[2]}`,
    title: match[3].trim(),
    summary: summary?.[1].trim() ?? '',
    notes: body.join('\n').trim(),
    outline: detailHeadings
      .filter((item) => item.start >= heading.end && item.start < end)
      .map((item, index) => ({ id: `${id}-detail-${index + 1}`, text: item.text })),
  }
}

function validateTimeline(sectionTitle, segments) {
  if (!segments.length) return segments
  if (segments[0].start !== 0) {
    throw new Error(`“${sectionTitle}”的第一段必须从 0 分钟开始。`)
  }

  segments.slice(1).forEach((segment, index) => {
    const previous = segments[index]
    if (segment.start === previous.end) return
    const issue = segment.start > previous.end ? '存在空档' : '发生重叠'
    throw new Error(
      `“${sectionTitle}”的时间段${issue}：上一段结束于 ${previous.end} 分钟，下一段开始于 ${segment.start} 分钟。`,
    )
  })

  return segments.map((segment) => {
    const nextBoundary = (Math.floor(segment.start / PERIOD_DURATION) + 1) * PERIOD_DURATION
    if (nextBoundary < segment.end) {
      throw new Error(
        `“${sectionTitle}”的“${segment.time}”跨过了 ${nextBoundary} 分钟课时边界，请在 ${nextBoundary} 分钟处分段。`,
      )
    }
    return {
      ...segment,
      periodBoundaryBefore: segment.start > 0 && segment.start % PERIOD_DURATION === 0,
      periodNumber: Math.floor(segment.start / PERIOD_DURATION) + 1,
    }
  })
}

export function parseRunbook(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const tokens = markdown.parse(lines.join('\n'), {})
  const headings = tokens.flatMap((token, index) => {
    // Markdown's token map keeps headings inside code fences and quotes from
    // accidentally becoming lessons or segments.
    if (token.type !== 'heading_open' || token.level !== 0) return []
    const level = Number(token.tag.slice(1))
    if (level > 4) return []
    const inline = tokens[index + 1]
    const text = inline.children?.map((child) => child.content).join('').trim() || inline.content.trim()
    return [{ level, text, start: token.map[0], end: token.map[1] }]
  })
  const title = headings.find((heading) => heading.level === 1)
  if (!title) throw new Error('请先用一个 # 标题写下台本名称。')

  const titleParts = title.text.split(/[|｜]/)
  const code = titleParts.length > 1 ? titleParts.shift().trim() : '台本'
  const name = titleParts.join('｜').trim()
  const lessonHeadings = headings.filter((heading) => heading.level === 2)
  const firstSection = lessonHeadings[0]?.start ?? lines.length
  const subtitle = lines.slice(title.end, firstSection).find((line) => /^>/.test(line))?.replace(/^>\s?/, '') ?? ''
  let overview = []
  let roadmap = null
  let controls = []
  const sections = []
  let segmentNumber = 0

  lessonHeadings.forEach((heading, index) => {
    const end = lessonHeadings[index + 1]?.start ?? lines.length
    if (['本次课', '本周', '本专题', '专题概览', '知识地图'].includes(heading.text)) {
      const summary = readOverview(lines.slice(heading.end, end))
      overview = summary.anchors
      roadmap = summary.roadmap
      return
    }
    if (heading.text === '临场取舍') {
      controls = readCallouts(lines.slice(heading.end, end))
      return
    }
    const sectionHeadings = headings.filter((item) => item.level === 3 && item.start > heading.start && item.start < end)
    const detailHeadings = headings.filter((item) => item.level === 4 && item.start > heading.start && item.start < end)
    const segments = validateTimeline(heading.text, sectionHeadings.map((item, itemIndex) => readSegment(
      item, lines, sectionHeadings[itemIndex + 1]?.start ?? end, ++segmentNumber, detailHeadings,
    )))
    if (!segments.length) throw new Error(`“${heading.text}”下还没有推进段，请用 ### 添加一段。`)
    const [label, ...nameParts] = heading.text.split('·')
    sections.push({
      id: `period-${sections.length + 1}`,
      label: nameParts.length ? label.trim() : `第 ${sections.length + 1} 区段`,
      title: nameParts.length ? nameParts.join('·').trim() : label.trim(),
      duration: segments.at(-1).end,
      segments,
    })
  })

  if (!sections.length) throw new Error('请用 ## 添加教学区段，再用 ### 添加推进段。')
  return {
    code, title: name, subtitle, overview, roadmap, controls, sections,
    segmentCount: segmentNumber,
    duration: sections.reduce((total, section) => total + section.duration, 0),
  }
}
