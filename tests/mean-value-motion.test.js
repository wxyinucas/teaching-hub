import { describe, expect, it } from 'vitest'
import {
  MINUTES_PER_HOUR,
  MOTION_DURATION_MINUTES,
  MOTION_DISTANCE_KM,
  MOTION_MIN_SPEED_KMH,
  MOTION_PEAK_SPEED_KMH,
  positionAt,
  minuteSlopeAt,
  speedAt,
  averageSpeed,
  meanValueTimes,
  lowSpeedTimes,
} from '../src/lib/meanValueMotion.js'

describe('mean-value motion model', () => {
  it('covers twenty kilometres in twelve minutes with sixty km/h at both ends', () => {
    expect(MINUTES_PER_HOUR).toBe(60)
    expect(MOTION_DURATION_MINUTES).toBe(12)
    expect(MOTION_DISTANCE_KM).toBe(20)
    expect(positionAt(0)).toBe(0)
    expect(positionAt(MOTION_DURATION_MINUTES)).toBe(MOTION_DISTANCE_KM)
    expect(speedAt(0)).toBe(60)
    expect(speedAt(MOTION_DURATION_MINUTES)).toBe(60)
    expect(averageSpeed()).toBe(100)
  })

  it('matches the derivative of position and converts minute slopes into km/h', () => {
    const stepMinutes = 1e-4
    for (const timeMinutes of [0.5, 2, 6, 10, 11.5]) {
      const numericalMinuteSlope = (positionAt(timeMinutes + stepMinutes)
        - positionAt(timeMinutes - stepMinutes)) / (2 * stepMinutes)

      expect(minuteSlopeAt(timeMinutes)).toBeCloseTo(numericalMinuteSlope, 6)
      expect(speedAt(timeMinutes)).toBeCloseTo(60 * numericalMinuteSlope, 5)
    }
  })

  it('preserves endpoint tangents without sampling outside the observed trip', () => {
    const stepMinutes = 1e-4
    const departureSlope = (positionAt(stepMinutes) - positionAt(0)) / stepMinutes
    const arrivalSlope = (positionAt(12) - positionAt(12 - stepMinutes)) / stepMinutes

    expect(minuteSlopeAt(0)).toBe(1)
    expect(minuteSlopeAt(12)).toBe(1)
    expect(departureSlope).toBeCloseTo(minuteSlopeAt(0), 4)
    expect(arrivalSlope).toBeCloseTo(minuteSlopeAt(12), 4)
    expect(() => positionAt(-stepMinutes)).toThrow(RangeError)
    expect(() => positionAt(12 + stepMinutes)).toThrow(RangeError)
  })

  it('keeps the route moving forwards between a low of 29.75 and a peak of 240 km/h', () => {
    expect(MOTION_MIN_SPEED_KMH).toBe(29.75)
    expect(MOTION_PEAK_SPEED_KMH).toBe(240)
    expect(positionAt(6)).toBe(10)
    expect(speedAt(6)).toBe(MOTION_PEAK_SPEED_KMH)

    const lowTimes = lowSpeedTimes()
    expect(lowTimes).toHaveLength(2)
    expect(lowTimes[0]).toBeGreaterThan(0)
    expect(lowTimes[0]).toBeLessThan(6)
    expect(lowTimes[1]).toBeGreaterThan(6)
    expect(lowTimes[1]).toBeLessThan(12)
    expect(lowTimes[0] + lowTimes[1]).toBeCloseTo(12, 12)
    for (const timeMinutes of lowTimes) {
      expect(speedAt(timeMinutes)).toBeCloseTo(MOTION_MIN_SPEED_KMH, 12)
      expect(speedAt(timeMinutes)).toBeGreaterThan(0)
    }

    let previousPosition = positionAt(0)
    for (let index = 1; index <= 120; index += 1) {
      const timeMinutes = index / 10
      expect(positionAt(timeMinutes)).toBeGreaterThan(previousPosition)
      expect(speedAt(timeMinutes)).toBeGreaterThanOrEqual(MOTION_MIN_SPEED_KMH - 1e-10)
      expect(speedAt(timeMinutes)).toBeLessThanOrEqual(MOTION_PEAK_SPEED_KMH + 1e-10)
      previousPosition = positionAt(timeMinutes)
    }
  })

  it('makes the curved route visibly distinct from its whole-trip secant', () => {
    const secantPositionAtThreeMinutes = MOTION_DISTANCE_KM * 3 / MOTION_DURATION_MINUTES
    const deviation = secantPositionAtThreeMinutes - positionAt(3)

    expect(deviation).toBeCloseTo(9 / Math.PI, 12)
    expect(deviation).toBeGreaterThan(2.5)
    expect(positionAt(9) - MOTION_DISTANCE_KM * 9 / MOTION_DURATION_MINUTES)
      .toBeCloseTo(deviation, 12)
  })

  it('distinguishes the time average from the average of the two endpoint readings', () => {
    // Integrate speed over minutes, then convert the time unit back to hours.
    const intervalCount = 120
    const stepMinutes = MOTION_DURATION_MINUTES / intervalCount
    let weightedSpeed = speedAt(0) + speedAt(MOTION_DURATION_MINUTES)
    for (let index = 1; index < intervalCount; index += 1) {
      weightedSpeed += (index % 2 === 0 ? 2 : 4) * speedAt(index * stepMinutes)
    }
    const speedIntegral = weightedSpeed * stepMinutes / 3

    expect(speedIntegral / MOTION_DURATION_MINUTES).toBeCloseTo(averageSpeed(), 10)
    expect(speedIntegral / MINUTES_PER_HOUR).toBeCloseTo(MOTION_DISTANCE_KM, 10)
    expect((speedAt(0) + speedAt(12)) / 2).toBe(60)
    expect(averageSpeed(3, 9)).toBeCloseTo(100 + 180 / Math.PI, 10)
  })

  it('locates two interior instants whose tangent slope equals the whole-trip secant slope', () => {
    const times = meanValueTimes()
    const secantSlopePerMinute = (positionAt(12) - positionAt(0)) / 12
    const firstMeanTime = 12 / Math.PI * Math.asin(Math.sqrt((11 + Math.sqrt(281)) / 40))

    expect(times).toHaveLength(2)
    expect(times[0]).toBeCloseTo(firstMeanTime, 12)
    expect(times[1]).toBeCloseTo(12 - firstMeanTime, 12)
    expect(times[0]).toBeGreaterThan(0)
    expect(times[1]).toBeLessThan(12)
    expect(times[0] + times[1]).toBeCloseTo(12, 12)
    for (const timeMinutes of times) {
      expect(minuteSlopeAt(timeMinutes)).toBeCloseTo(secantSlopePerMinute, 12)
      expect(speedAt(timeMinutes)).toBeCloseTo(averageSpeed(), 12)
    }

    times[0] = -1
    expect(meanValueTimes()[0]).toBeGreaterThan(0)
  })

  it('gives the same tangent rise whether the horizontal increment uses minutes or hours', () => {
    const timeMinutes = 4
    const incrementMinutes = 0.5
    const incrementHours = incrementMinutes / MINUTES_PER_HOUR
    const riseUsingMinutes = minuteSlopeAt(timeMinutes) * incrementMinutes
    const riseUsingHours = speedAt(timeMinutes) * incrementHours

    expect(riseUsingMinutes).toBeCloseTo(riseUsingHours, 12)
    expect(speedAt(timeMinutes)).toBeCloseTo(60 * minuteSlopeAt(timeMinutes), 12)
  })

  it('rejects invalid times and does not invent an average for a zero-length interval', () => {
    for (const invalidTime of [-1, 12.1, NaN, Infinity, -Infinity, '6']) {
      expect(() => positionAt(invalidTime)).toThrow(RangeError)
      expect(() => minuteSlopeAt(invalidTime)).toThrow(RangeError)
      expect(() => speedAt(invalidTime)).toThrow(RangeError)
    }

    expect(() => averageSpeed(-1, 12)).toThrow(RangeError)
    expect(() => averageSpeed(0, 13)).toThrow(RangeError)
    expect(() => averageSpeed(6, 6)).toThrow(RangeError)
    expect(() => averageSpeed(9, 3)).toThrow(RangeError)
  })
})
