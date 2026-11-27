export const CIRCLE_SIDE_COUNTS = [4, 6, 8, 10, 12, 14, 16, 24, 32, 48, 64]
export const RIEMANN_PARTITION_COUNTS = [2, 4, 8, 16, 32]
export const QUARTER_CIRCLE_AREA = Math.PI / 4

function assertPositiveInteger(value, minimum, label) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new RangeError(`${label} must be an integer greater than or equal to ${minimum}`)
  }
}

export function unitCircleApproximation(sides) {
  assertPositiveInteger(sides, 3, 'sides')
  return {
    sides,
    inner: (sides / 2) * Math.sin((2 * Math.PI) / sides),
    target: Math.PI,
    outer: sides * Math.tan(Math.PI / sides),
  }
}

export function quarterCircleValue(x) {
  if (x < 0 || x > 1) return Number.NaN
  return Math.sqrt(Math.max(0, 1 - x * x))
}

function fractional(value) {
  return value - Math.floor(value)
}

function deterministicUnit(index, seed) {
  return fractional(Math.sin((index + 1) * 12.9898 + (seed + 1) * 78.233) * 43758.5453)
}

export function buildPartition(count, seed = 0) {
  assertPositiveInteger(count, 1, 'count')
  if (seed === 0) return Array.from({ length: count + 1 }, (_, index) => index / count)

  const weights = Array.from({ length: count }, (_, index) => (
    0.7 + 0.6 * deterministicUnit(index, seed)
  ))
  const total = weights.reduce((sum, value) => sum + value, 0)
  const boundaries = [0]
  let cumulative = 0
  for (const weight of weights) {
    cumulative += weight
    boundaries.push(cumulative / total)
  }
  boundaries[boundaries.length - 1] = 1
  return boundaries
}

export function quadraticInterpolant(interval, x) {
  const { start, midpoint, end, startValue, midpointValue, endValue } = interval
  const first = startValue
    * ((x - midpoint) * (x - end)) / ((start - midpoint) * (start - end))
  const second = midpointValue
    * ((x - start) * (x - end)) / ((midpoint - start) * (midpoint - end))
  const third = endValue
    * ((x - start) * (x - midpoint)) / ((end - start) * (end - midpoint))
  return first + second + third
}

export function buildQuarterCircleApproximation({ count, partitionSeed = 0, sampleSeed = 0 }) {
  const boundaries = buildPartition(count, partitionSeed)
  const intervals = []
  let lower = 0
  let sample = 0
  let upper = 0
  let trapezoid = 0
  let simpson = 0

  for (let index = 0; index < count; index += 1) {
    const start = boundaries[index]
    const end = boundaries[index + 1]
    const width = end - start
    const midpoint = (start + end) / 2
    const sampleRatio = 0.08 + 0.84 * deterministicUnit(index, sampleSeed)
    const samplePoint = start + sampleRatio * width
    const startValue = quarterCircleValue(start)
    const midpointValue = quarterCircleValue(midpoint)
    const endValue = quarterCircleValue(end)
    const sampleValue = quarterCircleValue(samplePoint)

    lower += endValue * width
    sample += sampleValue * width
    upper += startValue * width
    trapezoid += ((startValue + endValue) / 2) * width
    simpson += ((startValue + 4 * midpointValue + endValue) / 6) * width
    intervals.push({
      index,
      start,
      midpoint,
      end,
      width,
      samplePoint,
      startValue,
      midpointValue,
      endValue,
      sampleValue,
    })
  }

  return {
    boundaries,
    intervals,
    maxWidth: Math.max(...intervals.map((interval) => interval.width)),
    lower,
    sample,
    upper,
    trapezoid,
    simpson,
    target: QUARTER_CIRCLE_AREA,
  }
}
