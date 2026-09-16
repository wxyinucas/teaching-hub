export const THEME_STORAGE_KEY = 'teaching-hub:theme'

const themeColors = {
  light: '#f7f7f8',
  dark: '#17151b',
}

export function isTheme(value) {
  return value === 'light' || value === 'dark'
}

export function resolveTheme(storedTheme, prefersDark = false) {
  if (isTheme(storedTheme)) return storedTheme
  return prefersDark ? 'dark' : 'light'
}

function browserStorage() {
  try { return window.localStorage }
  catch { return null }
}

function browserMediaQuery() {
  try { return window.matchMedia?.('(prefers-color-scheme: dark)') ?? null }
  catch { return null }
}

export function readStoredTheme(storage = browserStorage()) {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

export function getInitialTheme({ root = document.documentElement, storage, mediaQuery } = {}) {
  if (isTheme(root?.dataset.theme)) return root.dataset.theme
  const query = mediaQuery ?? browserMediaQuery()
  return resolveTheme(readStoredTheme(storage), Boolean(query?.matches))
}

export function applyTheme(theme, { root = document.documentElement, meta } = {}) {
  const resolved = isTheme(theme) ? theme : 'light'
  if (root) root.dataset.theme = resolved
  const themeMeta = meta ?? document.querySelector('meta[name="theme-color"]')
  themeMeta?.setAttribute('content', themeColors[resolved])
  return resolved
}

export function storeTheme(theme, storage = browserStorage()) {
  if (!isTheme(theme)) return false
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme)
    return Boolean(storage)
  } catch {
    return false
  }
}

export function listenForSystemTheme(callback, { mediaQuery } = {}) {
  const query = mediaQuery ?? browserMediaQuery()
  if (!query) return () => {}
  const handleChange = (event) => callback(event.matches ? 'dark' : 'light')
  callback(query.matches ? 'dark' : 'light')
  if (query.addEventListener) {
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }
  query.addListener?.(handleChange)
  return () => query.removeListener?.(handleChange)
}
