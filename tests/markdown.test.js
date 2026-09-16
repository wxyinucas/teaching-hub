import { describe, expect, it } from 'vitest'
import { renderNotes, renderSlideMarkdown } from '../src/lib/markdown.js'

describe('teacher notes rendering', () => {
  it('keeps the exact command text available for copying', () => {
    const notes = renderNotes('```bash\ncd ~/course/w01\ncode .\n```')
    expect(notes.codes).toEqual(['cd ~/course/w01\ncode .\n'])
    expect(notes.html).toContain('data-copy-code="0"')
  })

  it('escapes code and raw HTML rather than executing it', () => {
    const notes = renderNotes('<script>alert(1)</script>\n\n```html\n<img src=x onerror=alert(1)>\n```')
    expect(notes.html).not.toContain('<script>')
    expect(notes.html).not.toContain('<img')
    expect(notes.html).toContain('&lt;script&gt;')
    expect(notes.html).toContain('&lt;img')
  })

  it('opens reference links separately without access to the notes window', () => {
    const { html } = renderNotes('[官方说明](https://learn.microsoft.com/zh-cn/windows/wsl/install)')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('turns only a standalone italic paragraph into an emphasis block', () => {
    const { html } = renderNotes([
      '*必须当堂明确这条结论。*',
      '',
      '正文中的 *普通斜体* 保持行内。',
      '',
      '*第一处* *第二处*',
      '',
      '> *引用中的斜体*',
    ].join('\n'))
    expect(html).toContain('<p class="notes-emphasis"><em>必须当堂明确这条结论。</em></p>')
    expect(html).toContain('<p>正文中的 <em>普通斜体</em> 保持行内。</p>')
    expect(html.match(/notes-emphasis/g)).toHaveLength(1)
  })

  it('assigns parser-provided IDs to H4 headings in order', () => {
    const { html } = renderNotes('> #### 引用标题\n\n#### 第一处\n\n正文\n\n#### 第二处', ['detail-1', 'detail-2'])
    expect(html).toContain('<h4>引用标题</h4>')
    expect(html).toContain('<h4 id="detail-1">第一处</h4>')
    expect(html).toContain('<h4 id="detail-2">第二处</h4>')
  })

  it('does not render javascript URLs as links', () => {
    expect(renderNotes('[bad](javascript:alert(1))').html).not.toContain('href="javascript:')
  })

  it('renders inline and display TeX in teacher notes', () => {
    const { html } = renderNotes('行内 $x^2$。\n\n$$\n\\lim_{x \\to 0}\\frac{\\sin x}{x}=1\n$$')
    expect(html).toContain('class="katex"')
    expect(html).toContain('class="katex-display"')
    expect(html).toContain('aria-hidden="true"')
  })

  it('renders TeX in slide markdown and leaves fenced source literal', () => {
    expect(renderSlideMarkdown("变化率为 $f'(x)$。")).toContain('class="katex"')
    const notes = renderNotes('~~~text\n$x^2$\n~~~')
    expect(notes.codes).toEqual(['$x^2$\n'])
    expect(notes.html).not.toContain('class="katex"')
  })

  it('leaves inline code literal', () => {
    const { html } = renderNotes('命令中的 `$HOME` 不是公式。')
    expect(html).toContain('<code>$HOME</code>')
    expect(html).not.toContain('class="katex"')
  })

  it('keeps escaped dollar signs out of math rendering', () => {
    const { html } = renderNotes('字面金额写作 \\$5。')
    expect(html).toContain('$5')
    expect(html).not.toContain('class="katex"')
  })

  it('does not allow trusted links through TeX', () => {
    const { html } = renderNotes('$\\href{javascript:alert(1)}{bad}$')
    expect(html).not.toContain('href="javascript:')
  })

  it('keeps malformed TeX visible without breaking the page', () => {
    const { html } = renderNotes('前文 $\\frac{1}$ 后文')
    expect(html).toContain('katex-error')
    expect(html).toContain('后文')
  })
})
