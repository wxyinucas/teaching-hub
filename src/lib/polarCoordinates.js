export const TAU = 2 * Math.PI

export function normalizeAngle(angle) {
  const remainder = angle % TAU
  if (remainder === 0) return 0

  const normalized = remainder < 0 ? remainder + TAU : remainder
  return normalized === TAU ? 0 : normalized
}

export function polarToCartesian(r, theta) {
  if (r === 0) return { x: 0, y: 0 }

  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  }
}

export function cartesianToPolar(x, y) {
  return {
    r: Math.hypot(x, y),
    theta: x === 0 && y === 0 ? null : normalizeAngle(Math.atan2(y, x)),
  }
}

export const POLAR_CURVES = [
  {
    id: 'circle',
    label: '圆',
    tex: 'r=2',
    minParameter: 0,
    maxParameter: TAU,
    radius: () => 2,
  },
  {
    id: 'spiral',
    label: '阿基米德螺线',
    tex: 'r=\\frac{t}{\\pi}',
    minParameter: 0,
    maxParameter: 2 * TAU,
    radius: (parameter) => parameter / Math.PI,
  },
  {
    id: 'cardioid',
    label: '心形线',
    tex: 'r=\\frac{3}{2}(1+\\cos t)',
    minParameter: 0,
    maxParameter: TAU,
    radius: (parameter) => 1.5 * (1 + Math.cos(parameter)),
  },
]

export function curvePoint(curveId, parameter) {
  const curve = POLAR_CURVES.find((candidate) => candidate.id === curveId)
  if (!curve) throw new RangeError(`未知的极坐标曲线：${curveId}`)

  const r = curve.radius(parameter)
  const { x, y } = polarToCartesian(r, parameter)

  return {
    r,
    theta: r === 0 ? null : normalizeAngle(parameter),
    x,
    y,
    parameter,
  }
}
