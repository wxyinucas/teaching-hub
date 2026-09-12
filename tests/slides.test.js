import { describe, expect, it } from 'vitest'
import { parseSlides } from '../src/lib/slides.js'
import source from '../terms/2026-fall/courses/ai-agents/weeks/week-01/slides.md?raw'

describe('static slides Markdown', () => {
  it('maps W1 to the 17-page deck and its explicit layouts', () => {
    const deck = parseSlides(source)
    expect(deck.count).toBe(17)
    expect(deck.sections).toEqual([
      '第一课时：当 Agent 能够执行，人还负责什么？',
      '第二课时：把工作台搭起来',
      '第三课时：用证据完成交付',
    ])
    const counts = deck.slides.reduce((result, slide) => ({ ...result, [slide.layout]: (result[slide.layout] ?? 0) + 1 }), {})
    expect(counts).toEqual({ cover: 1, section: 3, prompt: 3, content: 3, columns: 6, question: 1 })
  })

  it('builds section agendas and preserves the complete copyable prompts', () => {
    const deck = parseSlides(source)
    expect(deck.slides[1]).toMatchObject({ layout: 'section', sectionIndex: 0 })
    expect(deck.slides[2].copyText).toContain('Chrome 无痕窗口')
    expect(deck.slides[3].html).toContain('任务完成：充分使用工具')
    expect(deck.slides[3].footerHtml).toContain('哪些反馈对我的成长真正重要')
    expect(deck.slides.slice(4, 7).every((slide) => slide.layout === 'columns' && slide.footerHtml)).toBe(true)
    expect(deck.slides[7]).toMatchObject({
      layout: 'columns',
      title: '我们这次打开哪一层？',
      footerHtml: '',
    })
    expect(deck.slides[8].footerHtml).toContain('诚实面对不可控的部分')
    expect(deck.slides[12].copyText).toContain('cat /etc/os-release')
    expect(deck.slides[15].copyText).toContain('证据不足不得宣布 READY-CODE')
  })

  it('does not split a page on table syntax or a separator inside a code fence', () => {
    const deck = parseSlides('# 表格\n\n|---:|:---|\n\n```text\n---\n```\n\n---\n# 第二页')
    expect(deck.count).toBe(2)
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
})
