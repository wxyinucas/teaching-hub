import { describe, expect, it } from 'vitest'
import {
  TAU,
  normalizeAngle,
  polarToCartesian,
  cartesianToPolar,
  POLAR_CURVES,
  curvePoint,
} from '../src/lib/polarCoordinates.js'

describe('polar coordinates', () => {
  it('normalizes angles to one turn without returning negative zero', () => {
    expect(normalizeAngle(0)).toBe(0)
    expect(normalizeAngle(-0)).toBe(0)
    expect(normalizeAngle(TAU)).toBe(0)
    expect(normalizeAngle(-TAU)).toBe(0)
    expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo(3 * Math.PI / 2, 12)
    expect(normalizeAngle(5 * TAU + Math.PI / 3)).toBeCloseTo(Math.PI / 3, 12)

    for (const angle of [-1e-16, -10 * TAU - 0.2, 0, 0.2, 10 * TAU + 0.2]) {
      expect(normalizeAngle(angle)).toBeGreaterThanOrEqual(0)
      expect(normalizeAngle(angle)).toBeLessThan(TAU)
      expect(Object.is(normalizeAngle(angle), -0)).toBe(false)
    }
  })

  it('round-trips points in every quadrant and on the axes', () => {
    const points = [
      { x: 3, y: 4 },
      { x: -3, y: 4 },
      { x: -3, y: -4 },
      { x: 3, y: -4 },
      { x: 0, y: 2 },
      { x: -2, y: 0 },
      { x: 0, y: -2 },
      { x: 2, y: 0 },
    ]

    for (const point of points) {
      const polar = cartesianToPolar(point.x, point.y)
      const restored = polarToCartesian(polar.r, polar.theta)
      expect(polar.theta).toBeGreaterThanOrEqual(0)
      expect(polar.theta).toBeLessThan(TAU)
      expect(restored.x).toBeCloseTo(point.x, 12)
      expect(restored.y).toBeCloseTo(point.y, 12)
    }
  })

  it('round-trips positive radii and identifies angles separated by full turns', () => {
    for (const theta of [-Math.PI / 3, Math.PI / 4, Math.PI, 3 * TAU + 0.6]) {
      const point = polarToCartesian(2.5, theta)
      const repeatedPoint = polarToCartesian(2.5, theta + TAU)
      const restored = cartesianToPolar(point.x, point.y)

      expect(repeatedPoint.x).toBeCloseTo(point.x, 12)
      expect(repeatedPoint.y).toBeCloseTo(point.y, 12)
      expect(restored.r).toBeCloseTo(2.5, 12)
      expect(restored.theta).toBeCloseTo(normalizeAngle(theta), 12)
    }
  })

  it('leaves the origin angle undetermined but preserves very small nonzero points', () => {
    expect(cartesianToPolar(0, 0)).toEqual({ r: 0, theta: null })
    expect(cartesianToPolar(-0, -0)).toEqual({ r: 0, theta: null })

    for (const theta of [0, Math.PI / 2, Math.PI, 20 * TAU]) {
      expect(polarToCartesian(0, theta)).toEqual({ x: 0, y: 0 })
    }

    const smallPoint = cartesianToPolar(0, 1e-20)
    expect(smallPoint.r).toBe(1e-20)
    expect(smallPoint.theta).toBeCloseTo(Math.PI / 2, 12)
  })
})

describe('one-parameter polar curves', () => {
  it('determines both coordinates and the radius from a single curve parameter', () => {
    expect(POLAR_CURVES.map((curve) => curve.id)).toEqual(['circle', 'spiral', 'cardioid'])

    for (const curve of POLAR_CURVES) {
      for (let step = 0; step <= 100; step += 1) {
        const parameter = curve.minParameter + (curve.maxParameter - curve.minParameter) * step / 100
        const point = curvePoint(curve.id, parameter)
        const expectedPoint = polarToCartesian(curve.radius(parameter), parameter)

        expect(point.parameter).toBe(parameter)
        expect(point.r).toBeGreaterThanOrEqual(0)
        expect(point.r).toBe(curve.radius(parameter))
        expect(point.x).toBe(expectedPoint.x)
        expect(point.y).toBe(expectedPoint.y)
        expect(Math.hypot(point.x, point.y)).toBeCloseTo(point.r, 12)
      }
    }
  })

  it('distinguishes the spiral parameter from the canonical polar angle', () => {
    const firstTurn = curvePoint('spiral', Math.PI)
    const secondTurn = curvePoint('spiral', Math.PI + TAU)

    expect(firstTurn.theta).toBeCloseTo(secondTurn.theta, 12)
    expect(firstTurn.r).toBeCloseTo(1, 12)
    expect(secondTurn.r).toBeCloseTo(3, 12)
    expect(firstTurn.parameter).not.toBe(secondTurn.parameter)
    expect(firstTurn.x).not.toBeCloseTo(secondTurn.x, 12)
    expect(curvePoint('spiral', 2 * TAU).theta).toBe(0)
    expect(curvePoint('spiral', 2 * TAU).r).toBe(4)
  })

  it('marks curve points at the origin without assigning a geometric polar angle', () => {
    expect(curvePoint('spiral', 0)).toEqual({ r: 0, theta: null, x: 0, y: 0, parameter: 0 })
    expect(curvePoint('cardioid', Math.PI)).toEqual({ r: 0, theta: null, x: 0, y: 0, parameter: Math.PI })
    expect(() => curvePoint('unknown', 0)).toThrow('未知的极坐标曲线')
  })
})
