const topicTitlePattern = /^%%%\s*(.*?)\s*%%%$/
const yearPattern = /^\\section\*\{(\d{4}) 年\}$/
const questionHeaderPattern = /^\\textbf\{(?:([^{}｜]+)｜(\d+|—) · )?(\d+) 分\}$/
const structuralMarkerPattern = /^\\(?:section\*?|textbf)\b/
const mathPattern = /(\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\\])*\$)/g
const optionMarkerPattern = /(^|\n|　)[ \t]*([A-D])\.[ \t]*/gm

function outsideMath(source, transform) {
  return source
    .split(mathPattern)
    .map((part) => {
      if (!part.startsWith('$')) return transform(part)
      const delimiter = part.startsWith('$$') ? '$$' : '$'
      return `${delimiter}${part.slice(delimiter.length, -delimiter.length).trim()}${delimiter}`
    })
    .join('')
}

export function normalizeExamQuestion(source) {
  const normalized = outsideMath(source, (text) => text
    .replace(/\\underline\{\\hspace\{[^{}]+\}\}/g, '________')
    .replace(/\\quad\b/g, '　')
    .replace(/\\\\(?=[ \t]*(?:\n|$))/g, '  '))
  return normalized.replace(/[ \t]*\n(?=A\.\s)/, '\n\n')
}

export function structureExamQuestion(source) {
  const body = normalizeExamQuestion(source)
  const markers = [...body.matchAll(optionMarkerPattern)]
  if (markers.map((marker) => marker[2]).join('') !== 'ABCD') {
    return { body, stem: body, options: [], optionColumns: 0 }
  }

  const rowLengths = []
  let rowLength = 0
  markers.forEach((marker, index) => {
    const startsRow = index === 0 || marker[1] === '\n' || body[marker.index - 1] === '\n'
    if (startsRow && rowLength) {
      rowLengths.push(rowLength)
      rowLength = 0
    }
    rowLength += 1
  })
  rowLengths.push(rowLength)

  const options = markers.map((marker, index) => ({
    label: marker[2],
    source: body.slice(
      marker.index + marker[0].length,
      markers[index + 1]?.index ?? body.length,
    ).trim(),
  }))

  return {
    body,
    stem: body.slice(0, markers[0].index).trim(),
    options,
    optionColumns: Math.max(...rowLengths),
  }
}

export function parseExamCollection(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const title = lines.find((line) => topicTitlePattern.test(line.trim()))?.trim().match(topicTitlePattern)?.[1] ?? ''
  const years = []
  let yearGroup = null
  let question = null

  function finishQuestion() {
    if (!question) return
    question.source = question.lines.join('\n').trim()
    delete question.lines
    if (!question.source) throw new Error(`${question.year} 年 ${question.points} 分题缺少题干。`)
    yearGroup.questions.push(question)
    question = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const yearMatch = line.match(yearPattern)
    if (yearMatch) {
      finishQuestion()
      const year = Number(yearMatch[1])
      if (years.some((group) => group.year === year)) throw new Error(`${year} 年在真题文件中重复分组。`)
      if (years.length && year <= years.at(-1).year) throw new Error('真题年份必须按时间递增排列。')
      yearGroup = { year, questions: [] }
      years.push(yearGroup)
      continue
    }

    const headerMatch = line.match(questionHeaderPattern)
    if (headerMatch) {
      finishQuestion()
      if (!yearGroup) throw new Error('真题分值必须写在对应年份之后。')
      const paperSection = headerMatch[1]?.trim() ?? ''
      const paperNumber = headerMatch[2] && headerMatch[2] !== '—' ? Number(headerMatch[2]) : null
      const points = Number(headerMatch[3])
      if (paperNumber !== null && paperNumber <= 0) throw new Error('真题原卷题号必须为正数。')
      if (points <= 0) throw new Error('真题分值必须为正数。')
      question = {
        year: yearGroup.year,
        paperSection,
        paperNumber,
        sourceId: paperSection ? `${yearGroup.year}:${paperSection}:${paperNumber ?? 'unnumbered'}` : null,
        points,
        lines: [],
      }
      continue
    }

    if (line && structuralMarkerPattern.test(line)) {
      throw new Error(`无法识别的真题结构标记：${line}`)
    }

    if (question) {
      question.lines.push(rawLine)
      continue
    }

    if (line && !topicTitlePattern.test(line)) throw new Error(`无法识别的真题结构：${line}`)
  }

  finishQuestion()
  const questionCount = years.reduce((sum, group) => sum + group.questions.length, 0)
  const totalPoints = years.reduce((sum, group) => (
    sum + group.questions.reduce((yearSum, item) => yearSum + item.points, 0)
  ), 0)
  return { title, years, questionCount, totalPoints }
}
