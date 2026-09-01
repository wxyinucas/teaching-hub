import { describe, expect, it } from 'vitest'
import { renderNotes } from '../src/lib/markdown.js'

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

  it('does not render javascript URLs as links', () => {
    expect(renderNotes('[bad](javascript:alert(1))').html).not.toContain('href="javascript:')
  })
})
