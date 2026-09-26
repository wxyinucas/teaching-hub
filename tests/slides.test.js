import { describe, expect, it } from 'vitest'
import { parseSlides } from '../src/lib/slides.js'

const example = [
  '<!-- layout: cover -->',
  '# 示例课件',
  '> 一句副标题',
  '---',
  '<!-- section: 第一课时 -->',
  '---',
  '# 纵向内容',
  '- 第一项',
  '- 第二项',
  '<!-- footer -->',
  '一句落点',
  '---',
  '<!-- layout: columns -->',
  '# 两栏比较',
  '<!-- column -->',
  '## 左侧',
  '左侧内容',
  '<!-- column -->',
  '## 右侧',
  '右侧内容',
  '---',
  '<!-- layout: prompt -->',
  '# 可复制任务',
  '请完成指定任务。',
].join('\n')

describe('static slides Markdown parser', () => {
  it('parses sections, standard layouts, footers and copyable prompts', () => {
    const deck = parseSlides(example)
    expect(deck.sections).toEqual(['第一课时'])
    expect(deck.slides.map((slide) => slide.layout)).toEqual(['cover', 'section', 'content', 'columns', 'prompt'])
    expect(deck.slides[0]).toMatchObject({ title: '示例课件', subtitle: '一句副标题' })
    expect(deck.slides[1]).toMatchObject({ section: '第一课时', sectionIndex: 0 })
    expect(deck.slides[2].footerHtml).toContain('一句落点')
    expect(deck.slides[3].columns.map((column) => column.title)).toEqual(['左侧', '右侧'])
    expect(deck.slides[4].copyText).toBe('请完成指定任务。')
  })

  it('does not split a page on table syntax or a separator inside a code fence', () => {
    const deck = parseSlides('# 表格\n\n|---:|:---|\n\n```text\n---\n```\n\n---\n# 第二页')
    expect(deck.slides).toHaveLength(2)
    expect(deck.slides[0].html).toContain('---')
  })

  it('separates a content footer and rejects duplicate footers', () => {
    const deck = parseSlides('# 纵向列表\n\n- 第一项\n- 第二项\n\n<!-- footer -->\n一句落点')
    expect(deck.slides[0]).toMatchObject({ layout: 'content' })
    expect(deck.slides[0].html).toContain('第一项')
    expect(deck.slides[0].html).not.toContain('一句落点')
    expect(deck.slides[0].footerHtml).toContain('一句落点')
    expect(() => parseSlides('# 重复\n\n<!-- footer -->\n一次\n<!-- footer -->\n两次')).toThrow('只能有一个 footer')
  })

  it('escapes raw HTML and rejects unknown layouts or invalid column counts', () => {
    expect(parseSlides('# 页面\n\n<script>alert(1)</script>').slides[0].html).not.toContain('<script>')
    expect(() => parseSlides('<!-- layout: magic -->\n# 页面')).toThrow('不支持的课件布局')
    expect(() => parseSlides('<!-- layout: columns -->\n# 页面\n<!-- column -->\n## 只有一栏')).toThrow('两栏或三栏')
  })

  it('renders TeX in slide bodies while preserving prompt source for copying', () => {
    const deck = parseSlides('<!-- layout: prompt -->\n# 公式任务\n\n写出 $f\'(x)$，并解释：\n\n$$\n\\int_0^1 x^2\\,dx\n$$')
    expect(deck.slides[0].html).toContain('class="katex"')
    expect(deck.slides[0].html).toContain('class="katex-display"')
    expect(deck.slides[0].copyText).toContain("$f'(x)$")
    expect(deck.slides[0].copyText).toContain('$$\n\\int_0^1 x^2\\,dx\n$$')
  })

  it('parses a dedicated tree layout without changing ordinary content slides', () => {
    const deck = parseSlides('<!-- layout: tree -->\n# 目录树\n\n```text\n~/course/\n└── cli-lab/\n```')
    expect(deck.slides[0]).toMatchObject({ layout: 'tree', title: '目录树' })
    expect(deck.slides[0].html).toContain('cli-lab')
  })

  it('requires page titles and keeps section pages free of body text', () => {
    expect(() => parseSlides('plain text')).toThrow('课件页缺少 # 标题')
    expect(() => parseSlides('<!-- section: 第一课时 -->\n# 不该出现')).toThrow('section 页只写 section 注释')
  })

  it('groups lessons without adding projected pages', () => {
    const deck = parseSlides([
      '<!-- lesson: 第一次课 -->', '# 第一页',
      '---', '# 第二页',
      '---', '<!-- lesson: 第二次课 -->', '# 第三页',
    ].join('\n'))
    expect(deck.count).toBe(3)
    expect(deck.lessons).toEqual([
      { label: '第一次课', startPage: 1, endPage: 2, count: 2 },
      { label: '第二次课', startPage: 3, endPage: 3, count: 1 },
    ])
    expect(deck.slides[0].html).not.toContain('lesson')
    expect(() => parseSlides('# 第一页\n---\n<!-- lesson: 第二次课 -->\n# 第二页'))
      .toThrow('须从第一页标记 lesson')
  })

  it('parses an agenda as an ordered list without changing its page count', () => {
    const deck = parseSlides([
      '<!-- layout: agenda -->',
      '# 今天的课程',
      '',
      '1. 怎样学高数',
      '2. 直观理解“极限”',
      '3. 标记基础知识',
    ].join('\n'))
    expect(deck.count).toBe(1)
    expect(deck.slides[0]).toMatchObject({ layout: 'agenda', title: '今天的课程' })
    expect(deck.slides[0].html).toContain('<ol>')
    expect(deck.slides[0].html).toContain('直观理解“极限”')
  })
})
