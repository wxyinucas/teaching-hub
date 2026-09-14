export function halvingSequenceTerm(n) {
  return 2 ** -n
}

export function oscillatingSequenceTerm(n) {
  return 1 + ((-1) ** n) / n
}

export function minimumStrictTailN(epsilon) {
  if (!Number.isFinite(epsilon) || epsilon <= 0) {
    throw new RangeError('ε 必须是正的有限数。')
  }

  let n = 1
  while (halvingSequenceTerm(n + 1) >= epsilon) n += 1
  return n
}

export function sufficientOscillatingTailN(epsilon) {
  if (!Number.isFinite(epsilon) || epsilon <= 0) {
    throw new RangeError('ε 必须是正的有限数。')
  }

  return Math.ceil(1 / epsilon)
}
