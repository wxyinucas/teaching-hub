import { describe, expect, it } from 'vitest'
import {
  TAYLOR_FUNCTIONS,
  getTaylorFunction,
  originalValue,
  taylorCoefficients,
  taylorValue,
  lagrangeBound,
  taylorObservation,
} from '../src/lib/taylorApproximation.js'

describe('Taylor approximation model', () => {
  it('exposes the three known functions and protects the logarithm domain', () => {
    expect(TAYLOR_FUNCTIONS.map((definition) => definition.id)).toEqual(['sin', 'exp', 'log'])
    expect(getTaylorFunction('log').domainMin).toBe(-1)
    expect(originalValue('sin', Math.PI / 2)).toBeCloseTo(1, 14)
    expect(originalValue('exp', 1)).toBeCloseTo(Math.E, 14)
    expect(originalValue('log', Math.E - 1)).toBeCloseTo(1, 14)
    for (const x of [-2, -1, NaN, Infinity, -Infinity, '1']) {
      expect(originalValue('log', x)).toBeNull()
      expect(taylorObservation('log', 0, 5, x)).toBeNull()
    }
    expect(originalValue('log', -0.999)).toBeCloseTo(-6.907755278982137, 11)
    expect(originalValue('exp', 1000)).toBeNull()
    expect(() => getTaylorFunction('unknown')).toThrow(RangeError)
  })

  it('uses the exact familiar Maclaurin coefficients, including zero terms', () => {
    expect(taylorCoefficients('sin', 0, 7)).toEqual([
      0, 1, 0, -1 / 6, 0, 1 / 120, 0, -1 / 5040,
    ])
    expect(taylorCoefficients('exp', 0, 4)).toEqual([1, 1, 1 / 2, 1 / 6, 1 / 24])
    expect(taylorCoefficients('log', 0, 4)).toEqual([0, 1, -1 / 2, 1 / 3, -1 / 4])
    expect(taylorValue('sin', 0, 1, 2)).toBe(taylorValue('sin', 0, 2, 2))
  })

  it('moves the expansion base while preserving the correct local coefficients', () => {
    const exponential = taylorCoefficients('exp', 1, 2)
    expect(exponential[0]).toBe(Math.E)
    expect(exponential[1]).toBe(Math.E)
    expect(exponential[2]).toBe(Math.E / 2)

    const logarithm = taylorCoefficients('log', 1, 3)
    expect(logarithm).toEqual([Math.log(2), 1 / 2, -1 / 8, 1 / 24])
    expect(taylorValue('log', 1, 2, 1.2)).toBeCloseTo(Math.log(2) + 0.1 - 0.005, 14)

    const sine = taylorCoefficients('sin', Math.PI / 2, 2)
    expect(sine[0]).toBeCloseTo(1, 14)
    expect(sine[1]).toBeCloseTo(0, 14)
    expect(sine[2]).toBeCloseTo(-1 / 2, 14)
  })

  it('includes constant approximations and gives zero remainder at every base', () => {
    for (const id of ['sin', 'exp', 'log']) {
      expect(taylorValue(id, 0.4, 0, 0.8)).toBe(originalValue(id, 0.4))
      for (const degree of [0, 1, 2, 7, 12]) {
        const observation = taylorObservation(id, 0.4, degree, 0.4)
        expect(observation.polynomial).toBe(observation.original)
        expect(observation.remainder).toBe(0)
        expect(observation.absoluteError).toBe(0)
        expect(observation.bound).toBe(0)
      }
    }
  })

  it('makes the cubic sine approximation accurate nearby and visibly bad far away', () => {
    const nearby = taylorObservation('sin', 0, 3, 0.5)
    const distant = taylorObservation('sin', 0, 3, 5.5)
    expect(nearby.polynomial).toBeCloseTo(23 / 48, 14)
    expect(nearby.absoluteError).toBeLessThan(0.0003)
    expect(distant.absoluteError).toBeGreaterThan(20)
    expect(distant.absoluteError / nearby.absoluteError).toBeGreaterThan(80_000)
    expect(taylorObservation('sin', 0, 11, 5.5).absoluteError).toBeLessThan(distant.absoluteError)
  })

  it('does not imply that increasing degree always improves a distant approximation', () => {
    const cubic = taylorObservation('log', 0, 3, 3)
    const quintic = taylorObservation('log', 0, 5, 3)
    expect(cubic.polynomial).toBeCloseTo(7.5, 12)
    expect(quintic.absoluteError).toBeGreaterThan(cubic.absoluteError)
    expect(taylorObservation('log', 0, 5, 0.3).absoluteError)
      .toBeLessThan(taylorObservation('log', 0, 3, 0.3).absoluteError)
  })

  it('bounds actual errors on both sides of the base, including near the log boundary', () => {
    for (const id of ['sin', 'exp', 'log']) {
      for (const base of [-0.4, 0, 1.2]) {
        for (const target of [-0.9, -0.2, 0, 0.3, 1, 3, 6]) {
          for (const degree of [0, 1, 2, 3, 6, 9, 12]) {
            const observation = taylorObservation(id, base, degree, target)
            expect(observation).not.toBeNull()
            expect(observation.absoluteError).toBeLessThanOrEqual(observation.bound * (1 + 1e-12))
            for (const value of Object.values(observation)) expect(Number.isFinite(value)).toBe(true)
          }
        }
      }
    }
    // For n=0, the mean-value bound uses the largest first derivative
    // throughout the interval, rather than the derivative at its base.
    expect(lagrangeBound('exp', 0, 0, 1)).toBeCloseTo(Math.E, 14)
    expect(lagrangeBound('log', 0, 0, -0.5)).toBe(1)
    expect(lagrangeBound('log', 0, 0, 1)).toBe(1)
  })

  it('retains very small local remainders rather than showing subtraction noise', () => {
    const exponential = taylorObservation('exp', 0, 12, 0.01)
    expect(exponential.absoluteError).toBeGreaterThan(1e-37)
    expect(exponential.absoluteError).toBeLessThan(2e-36)
    expect(exponential.absoluteError).toBeLessThan(exponential.bound)
    const positive = taylorObservation('sin', 0, 3, 1e-3)
    const negative = taylorObservation('sin', 0, 3, -1e-3)
    expect(positive.remainder).toBeCloseTo(1e-15 / 120, 24)
    expect(negative.remainder).toBeCloseTo(-positive.remainder, 28)
  })

  it('keeps high-order sine errors below the bound across the former half-unit cutoff', () => {
    for (const distance of [0.499, 0.5, 0.501, 0.505, 0.506, 0.51, 0.512, 0.525, 0.75, 1]) {
      const positive = taylorObservation('sin', 0, 12, distance)
      const negative = taylorObservation('sin', 0, 12, -distance)
      // On (0,1], the true sine value lies strictly between the degree-15
      // and degree-13 Maclaurin polynomials. These independent envelopes
      // bound R12 without relying on the engine's remainder computation.
      const firstOmitted = distance ** 13 / 6_227_020_800
      const nextOmitted = distance ** 15 / 1_307_674_368_000
      expect(positive.remainder).toBeGreaterThan(firstOmitted - nextOmitted)
      expect(positive.remainder).toBeLessThan(firstOmitted)
      expect(positive.absoluteError).toBeLessThanOrEqual(positive.bound)
      expect(negative.remainder).toBeCloseTo(-positive.remainder, 25)
      expect(negative.absoluteError).toBeLessThanOrEqual(negative.bound)
    }
  })

  it('rejects invalid degrees and cannot extrapolate across the logarithm singularity', () => {
    for (const degree of [-1, 13, 1.5, NaN, '3']) {
      expect(() => taylorCoefficients('sin', 0, degree)).toThrow(RangeError)
      expect(() => taylorObservation('sin', 0, degree, 1)).toThrow(RangeError)
    }
    expect(taylorCoefficients('log', -1, 3)).toBeNull()
    expect(taylorValue('log', 0, 3, -1)).toBeNull()
    expect(lagrangeBound('log', -2, 3, 1)).toBeNull()
    expect(taylorObservation('exp', 1000, 3, 1)).toBeNull()
  })
})
