import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({ html: false })

// Only the overview needs a little structure. Segment notes remain ordinary
// Markdown: no fixed number of slots and no mandatory detail fields.
function readCallouts(lines) {
  return lines.flatMap((line) => {
    const match = line.match(/^\s*-\s+([^：:]+)[：:]\s*(.+)$/)
    return match ? [{ label: match[1].trim(), text: match[2].trim() }] : []
  })
}

function readSegment(heading, lines, end, number) {
  const match = heading.text.match(/^(\d+)\s*[-–—]\s*(\d+)\s*[|｜]\s*(.+)$/)
  if (!match || Number(match[1]) >= Number(match[2])) {
    throw new Error(`“${heading.text}”的标题请写成“0-10 | 推进什么”，结束时间需晚于开始时间。`)
  }
  const body = lines.slice(heading.end, end)
  while (body.length && !body[0].trim()) body.shift()
  const summary = body[0]?.match(/^>\s?(.*)$/)
  if (summary) body.shift()

  return {
    id: `segment-${number}`,
    number,
    start: Number(match[1]),
    end: Number(match[2]),
    time: `${match[1]}–${match[2]}`,
    title: match[3].trim(),
    summary: summary?.[1].trim() ?? '',
    notes: body.join('\n').trim(),
  }
}

export function parseRunbook(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const tokens = markdown.parse(lines.join('\n'), {})
  const headings = tokens.flatMap((token, index) => {
    // Markdown's token map keeps headings inside code fences and quotes from
    // accidentally becoming lessons or segments.
    if (token.type !== 'heading_open' || token.level !== 0) return []
    const level = Number(token.tag.slice(1))
    if (level > 3) return []
    return [{ level, text: tokens[index + 1].content.trim(), start: token.map[0], end: token.map[1] }]
  })
  const title = headings.find((heading) => heading.level === 1)
  if (!title) throw new Error('请先用一个 # 标题写下本次课的名称。')

  const titleParts = title.text.split(/[|｜]/)
  const code = titleParts.length > 1 ? titleParts.shift().trim() : '台本'
  const name = titleParts.join('｜').trim()
  const lessonHeadings = headings.filter((heading) => heading.level === 2)
  const firstSection = lessonHeadings[0]?.start ?? lines.length
  const subtitle = lines.slice(title.end, firstSection).find((line) => /^>/.test(line))?.replace(/^>\s?/, '') ?? ''
  let overview = []
  let controls = []
  const sections = []
  let segmentNumber = 0

  lessonHeadings.forEach((heading, index) => {
    const end = lessonHeadings[index + 1]?.start ?? lines.length
    if (heading.text === '本次课') {
      overview = readCallouts(lines.slice(heading.end, end))
      return
    }
    if (heading.text === '临场取舍') {
      controls = readCallouts(lines.slice(heading.end, end))
      return
    }
    const sectionHeadings = headings.filter((item) => item.level === 3 && item.start > heading.start && item.start < end)
    const segments = sectionHeadings.map((item, itemIndex) => readSegment(
      item, lines, sectionHeadings[itemIndex + 1]?.start ?? end, ++segmentNumber,
    ))
    if (!segments.length) throw new Error(`“${heading.text}”下还没有推进段，请用 ### 添加一段。`)
    const [label, ...nameParts] = heading.text.split('·')
    sections.push({
      id: `period-${sections.length + 1}`,
      label: nameParts.length ? label.trim() : `第 ${sections.length + 1} 课时`,
      title: nameParts.length ? nameParts.join('·').trim() : label.trim(),
      duration: Math.max(...segments.map((segment) => segment.end)),
      segments,
    })
  })

  if (!sections.length) throw new Error('请用 ## 添加课时，再用 ### 添加推进段。')
  return {
    code, title: name, subtitle, overview, controls, sections,
    segmentCount: segmentNumber,
    duration: sections.reduce((total, section) => total + section.duration, 0),
  }
}
