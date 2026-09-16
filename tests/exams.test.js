import { describe, expect, it } from 'vitest'
import { normalizeExamQuestion, parseExamCollection, structureExamQuestion } from '../src/lib/exams.js'
import { renderNotes } from '../src/lib/markdown.js'

const topicExamSources = import.meta.glob(
  '../terms/2026-fall/courses/calculus-i/exams/topics/*.tex',
  { eager: true, query: '?raw', import: 'default' },
)

describe('calculus exam collections', () => {
  it('parses the topic, years, scores and questions without changing their order', () => {
    const collection = parseExamCollection([
      '%%% T02｜示例专题 %%%',
      '',
      '\\section*{2020 年}',
      '',
      '\\textbf{3 分}',
      '',
      '第一题 $x^2$。',
      '',
      '\\textbf{8 分}',
      '',
      '第二题。',
      '',
      '\\section*{2021 年}',
      '',
      '\\textbf{5 分}',
      '',
      '第三题。',
    ].join('\n'))

    expect(collection.title).toBe('T02｜示例专题')
    expect(collection.years.map((group) => group.year)).toEqual([2020, 2021])
    expect(collection.years[0].questions.map((question) => question.points)).toEqual([3, 8])
    expect(collection.years[0].questions.map((question) => question.source)).toEqual(['第一题 $x^2$。', '第二题。'])
    expect(collection.questionCount).toBe(3)
    expect(collection.totalPoints).toBe(16)
  })

  it('preserves original paper sections and numbers without inventing a missing number', () => {
    const collection = parseExamCollection([
      '\\section*{2020 年}',
      '\\textbf{选择题｜4 · 3 分}',
      '选择题。',
      '\\textbf{填空题｜1 · 3 分}',
      '填空题。',
      '\\section*{2021 年}',
      '\\textbf{选择题｜1 · 3 分}',
      '下一年重新编号的选择题。',
      '\\section*{2022 年}',
      '\\textbf{应用题｜— · 9 分}',
      '原卷没有题号的单题。',
      '\\section*{2023 年}',
      '\\textbf{3 分}',
      '兼容旧题头。',
    ].join('\n'))

    expect(collection.years.flatMap((group) => group.questions).map((question) => ({
      year: question.year,
      paperSection: question.paperSection,
      paperNumber: question.paperNumber,
      sourceId: question.sourceId,
    }))).toEqual([
      { year: 2020, paperSection: '选择题', paperNumber: 4, sourceId: '2020:选择题:4' },
      { year: 2020, paperSection: '填空题', paperNumber: 1, sourceId: '2020:填空题:1' },
      { year: 2021, paperSection: '选择题', paperNumber: 1, sourceId: '2021:选择题:1' },
      { year: 2022, paperSection: '应用题', paperNumber: null, sourceId: '2022:应用题:unnumbered' },
      { year: 2023, paperSection: '', paperNumber: null, sourceId: null },
    ])
  })

  it('keeps mathematics intact while adapting TeX-only spacing for the web', () => {
    const source = '条件 $\\begin{cases}x=t^2 \\\\ y=t^3\\end{cases}$。\\\\\nA. $1$ \\quad B. $2$，填空 \\underline{\\hspace{3cm}}。'
    const normalized = normalizeExamQuestion(source)
    expect(normalized).toContain('$\\begin{cases}x=t^2 \\\\ y=t^3\\end{cases}$')
    expect(normalized).not.toContain('\\quad')
    expect(normalized).not.toContain('\\underline')
    expect(renderNotes(normalized).html).toContain('class="katex"')

    const spacedMath = normalizeExamQuestion('$\\lim_{n\\to\\infty} a_n = $ \\underline{\\hspace{3cm}}。')
    expect(spacedMath).toBe('$\\lim_{n\\to\\infty} a_n =$ ________。')
    expect(renderNotes(spacedMath).html).not.toContain('$\\lim')

    const choice = normalizeExamQuestion('题干。\\\\\nA. 选项一 \\quad B. 选项二')
    expect(choice).toBe('题干。\n\nA. 选项一 　 B. 选项二')
    expect(renderNotes(choice).html.match(/<p>/g)).toHaveLength(2)
  })

  it('turns the original option rows into aligned grid columns', () => {
    const twoByTwo = structureExamQuestion([
      '题干。\\\\',
      'A. 选项一 \\quad B. 选项二\\\\',
      'C. 选项三 \\quad D. 选项四',
    ].join('\n'))
    expect(twoByTwo.optionColumns).toBe(2)
    expect(twoByTwo.options.map((option) => option.label)).toEqual(['A', 'B', 'C', 'D'])
    expect(twoByTwo.options.map((option) => option.source)).toEqual(['选项一', '选项二', '选项三', '选项四'])

    const oneRow = structureExamQuestion('题干。\\\\\nA. 甲 \\quad B. 乙 \\quad C. 丙 \\quad D. 丁')
    expect(oneRow.optionColumns).toBe(4)
  })

  it('rejects scores outside a year and non-chronological year groups', () => {
    expect(() => parseExamCollection('\\textbf{3 分}\n\n题目。')).toThrow('对应年份')
    expect(() => parseExamCollection([
      '\\section*{2021 年}',
      '\\textbf{3 分}',
      '题目一。',
      '\\section*{2020 年}',
      '\\textbf{3 分}',
      '题目二。',
    ].join('\n'))).toThrow('时间递增')
    expect(() => parseExamCollection([
      '\\section*{2020 年}',
      '\\textbf{3 分}',
      '题目一。',
      '\\section*{2021年}',
      '\\textbf{3 分}',
      '题目二。',
    ].join('\n'))).toThrow('结构标记')
  })

  it('keeps all 2020–2025 questions uniquely assigned to one current topic', () => {
    const expectedCounts = {
      'fundamental.tex': 10,
      'topic-01-limits.tex': 8,
      'topic-02-continuity.tex': 2,
      'topic-03-derivatives-and-differentials.tex': 19,
      'topic-04-mvt-lhopital-taylor.tex': 16,
      'topic-05-derivative-applications.tex': 15,
      'topic-06-indefinite-integrals.tex': 8,
      'topic-07-definite-integrals-and-applications.tex': 20,
      'topic-08-differential-equations.tex': 2,
    }
    const seenQuestions = new Set()
    const seenSourceIds = new Set()
    const unnumberedSourceIds = []
    const annualCounts = new Map()
    const annualPoints = new Map()
    let total = 0

    for (const [path, source] of Object.entries(topicExamSources)) {
      const filename = path.split('/').at(-1)
      const collection = parseExamCollection(source)
      expect(collection.questionCount).toBe(expectedCounts[filename])
      total += collection.questionCount
      for (const group of collection.years) {
        for (const question of group.questions) {
          expect(seenQuestions.has(question.source)).toBe(false)
          seenQuestions.add(question.source)
          expect(question.paperSection).not.toBe('')
          expect(question.sourceId).not.toBeNull()
          expect(seenSourceIds.has(question.sourceId)).toBe(false)
          seenSourceIds.add(question.sourceId)
          if (question.paperNumber === null) unnumberedSourceIds.push(question.sourceId)
          else expect(question.paperNumber).toBeGreaterThan(0)
          annualCounts.set(group.year, (annualCounts.get(group.year) ?? 0) + 1)
          annualPoints.set(group.year, (annualPoints.get(group.year) ?? 0) + question.points)
          const html = renderNotes(normalizeExamQuestion(question.source)).html
          expect(html).not.toContain('katex-error')
          expect(html).not.toContain('$')
        }
      }
    }

    expect(Object.keys(topicExamSources)).toHaveLength(Object.keys(expectedCounts).length)
    expect(total).toBe(100)
    expect(seenQuestions.size).toBe(100)
    expect(seenSourceIds.size).toBe(100)
    expect(unnumberedSourceIds).toEqual(['2022:应用题:unnumbered'])
    expect(Object.fromEntries(annualCounts)).toEqual({
      2020: 19,
      2021: 17,
      2022: 17,
      2023: 19,
      2024: 14,
      2025: 14,
    })
    expect(Object.fromEntries(annualPoints)).toEqual({
      2020: 100,
      2021: 100,
      2022: 100,
      2023: 100,
      2024: 100,
      2025: 100,
    })

  })
})
