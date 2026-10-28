export const TAYLOR_FUNCTIONS = [
  {
    id: 'sin',
    label: '正弦函数',
    tex: '\\sin x',
    defaultBase: 0,
    baseMin: -2,
    baseMax: 2,
    baseStep: 0.1,
    domainMin: -Infinity,
  },
  {
    id: 'exp',
    label: '指数函数',
    tex: 'e^x',
    defaultBase: 0,
    baseMin: -1,
    baseMax: 2,
    baseStep: 0.1,
    domainMin: -Infinity,
  },
  {
    id: 'log',
    label: '对数函数',
    tex: '\\ln(1+x)',
    defaultBase: 0,
    baseMin: -0.5,
    baseMax: 2,
    baseStep: 0.1,
    domainMin: -1,
  },
]

export function getTaylorFunction(id) {
  const definition = TAYLOR_FUNCTIONS.find((candidate) => candidate.id === id)
  if (!definition) throw new RangeError('未知的泰勒演示函数：' + id)
  return definition
}

function validateDegree(degree) {
  if (!Number.isInteger(degree) || degree < 0 || degree > 12) {
    throw new RangeError('展开阶数必须是 0 到 12 之间的整数。')
  }
}

function isDefinedAt(definition, value) {
  return Number.isFinite(value) && value > definition.domainMin
}

function finiteOrNull(value) {
  return Number.isFinite(value) ? value : null
}

function factorial(n) {
  let value = 1
  for (let k = 2; k <= n; k += 1) value *= k
  return value
}

function sineDerivative(base, order) {
  // Cycle derivatives of the same base value rather than adding kπ/2.
  // In particular, all even Maclaurin coefficients remain exactly zero.
  switch (order % 4) {
    case 0: return Math.sin(base)
    case 1: return Math.cos(base)
    case 2: return -Math.sin(base)
    default: return -Math.cos(base)
  }
}

export function originalValue(id, x) {
  const definition = getTaylorFunction(id)
  if (!isDefinedAt(definition, x)) return null
  if (id === 'sin') return Math.sin(x)
  if (id === 'exp') return finiteOrNull(Math.exp(x))
  return Math.log1p(x)
}

export function taylorCoefficients(id, base, degree) {
  validateDegree(degree)
  const constant = originalValue(id, base)
  if (constant === null) return null

  const coefficients = [constant]
  let divisor = 1
  for (let k = 1; k <= degree; k += 1) {
    divisor *= k
    const coefficient = id === 'sin'
      ? sineDerivative(base, k) / divisor
      : id === 'exp'
        ? constant / divisor
        : (k % 2 ? 1 : -1) / (k * (1 + base) ** k)
    if (!Number.isFinite(coefficient)) return null
    coefficients.push(coefficient === 0 ? 0 : coefficient)
  }
  return coefficients
}

function evaluateCoefficients(coefficients, increment) {
  let value = 0
  for (let k = coefficients.length - 1; k >= 0; k -= 1) {
    value = value * increment + coefficients[k]
  }
  return finiteOrNull(value)
}

export function taylorValue(id, base, degree, x) {
  const definition = getTaylorFunction(id)
  validateDegree(degree)
  if (!isDefinedAt(definition, x)) return null
  const coefficients = taylorCoefficients(id, base, degree)
  if (coefficients === null) return null
  return evaluateCoefficients(coefficients, x - base)
}

export function lagrangeBound(id, base, degree, x) {
  const definition = getTaylorFunction(id)
  validateDegree(degree)
  if (!isDefinedAt(definition, base) || !isDefinedAt(definition, x)) return null
  const distance = Math.abs(x - base)
  if (distance === 0) return originalValue(id, base) === null ? null : 0

  // Each M bounds |f^(n+1)| throughout the entire base-to-target interval.
  // For log, cancel n! analytically before computing the numerical bound.
  if (id === 'log') {
    const nearestDomainEdge = 1 + Math.min(base, x)
    return finiteOrNull((distance / nearestDomainEdge) ** (degree + 1) / (degree + 1))
  }
  const maximumDerivative = id === 'sin' ? 1 : Math.exp(Math.max(base, x))
  return finiteOrNull(maximumDerivative * distance ** (degree + 1) / factorial(degree + 1))
}

function smallRemainder(id, base, degree, increment) {
  // Subtracting two nearly identical function values can overwhelm a tiny
  // remainder. In a small interval, evaluate that remainder's rapidly
  // converging tail directly; do not clamp a visible residual to zero.
  const ratio = id === 'log' ? increment / (1 + base) : increment
  const stableRadius = id === 'log' ? 0.5 : 1
  if (Math.abs(ratio) > stableRadius) return null

  let sum = 0
  let power = ratio ** (degree + 1)
  let divisor = factorial(degree + 1)
  const exponentialBase = id === 'exp' ? Math.exp(base) : 1
  for (let k = degree + 1; k <= degree + 80; k += 1) {
    const term = id === 'log'
      ? (k % 2 ? 1 : -1) * power / k
      : (id === 'sin' ? sineDerivative(base, k) : exponentialBase) * power / divisor
    sum += term
    power *= ratio
    divisor *= k + 1
  }
  return finiteOrNull(sum)
}

export function taylorObservation(id, base, degree, x) {
  const original = originalValue(id, x)
  const polynomial = taylorValue(id, base, degree, x)
  const bound = lagrangeBound(id, base, degree, x)
  if (original === null || polynomial === null || bound === null) return null
  const increment = x - base
  const remainder = increment === 0
    ? 0
    : smallRemainder(id, base, degree, increment) ?? finiteOrNull(original - polynomial)
  if (remainder === null) return null
  return {
    original,
    polynomial,
    remainder,
    absoluteError: Math.abs(remainder),
    bound,
  }
}
