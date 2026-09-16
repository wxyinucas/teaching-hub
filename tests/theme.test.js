import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import App from '../src/App.vue'
import {
  THEME_STORAGE_KEY,
  getInitialTheme,
  resolveTheme,
} from '../src/lib/theme.js'
import { createTeachingRouter } from '../src/router.js'

let wrapper
let router
let localStorageDescriptor

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  localStorageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')
  const values = new Map()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      clear: () => values.clear(),
      getItem: (key) => values.get(key) ?? null,
      removeItem: (key) => values.delete(key),
      setItem: (key, value) => values.set(key, String(value)),
    },
  })
  delete document.documentElement.dataset.theme
  document.head.innerHTML = '<meta name="theme-color" content="#f7f7f8">'
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))
})

afterEach(() => {
  wrapper?.unmount()
  router?.options.history.destroy()
  wrapper = null
  router = null
  if (localStorageDescriptor) Object.defineProperty(window, 'localStorage', localStorageDescriptor)
  else delete window.localStorage
  localStorageDescriptor = null
  delete document.documentElement.dataset.theme
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('site theme', () => {
  it('prefers a valid saved theme and otherwise follows the system safely', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme('unknown', false)).toBe('light')
    expect(getInitialTheme({ root: null, storage: null, mediaQuery: null })).toBe('light')
  })

  it('switches the root theme and persists the explicit choice', async () => {
    router = createTeachingRouter(createMemoryHistory())
    await router.push('/')
    wrapper = mount(App, { attachTo: document.body, global: { plugins: [router] } })
    await router.isReady()
    await flushPromises()

    const toggle = wrapper.find('.theme-toggle')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(toggle.attributes('aria-pressed')).toBe('false')
    expect(toggle.text()).toBe('深色')

    await toggle.trigger('click')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(toggle.attributes('aria-pressed')).toBe('true')
    expect(toggle.attributes('aria-label')).toBe('切换到浅色模式')
    expect(toggle.text()).toBe('浅色')
    expect(document.querySelector('meta[name="theme-color"]').content).toBe('#17151b')
  })
})
