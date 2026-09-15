export function resolveRunbookNavigation(items, viewportHeight, readingLine, boundaryRange = 96) {
  if (!items.length) return { currentId: '', visibleIds: [] }

  const hasMeasuredLayout = items.some(({ top, bottom }) => top !== 0 || bottom !== 0)
  if (!hasMeasuredLayout) return { currentId: items[0].id, visibleIds: [items[0].id] }

  const line = readingLine ?? Math.max(88, Math.min(180, viewportHeight * 0.28))
  const firstBelow = items.findIndex(({ top }) => top > line)
  const currentIndex = firstBelow < 0 ? items.length - 1 : Math.max(0, firstBelow - 1)
  const current = items[currentIndex]
  let visibleIds = [current.id]

  const nearestBoundary = items.slice(1).map((item, index) => ({
    index,
    distance: Math.abs(item.top - line),
  })).sort((left, right) => left.distance - right.distance)[0]

  if (nearestBoundary && nearestBoundary.distance <= boundaryRange) {
    visibleIds = [items[nearestBoundary.index].id, items[nearestBoundary.index + 1].id]
  }

  return { currentId: current.id, visibleIds }
}
