export const MINUTES_PER_HOUR = 60
export const MOTION_DURATION_MINUTES = 12
export const MOTION_DISTANCE_KM = 20
export const MOTION_MIN_SPEED_KMH = 29.75
export const MOTION_PEAK_SPEED_KMH = 240

function assertTimeInTrip(timeMinutes) {
  if (!Number.isFinite(timeMinutes) || timeMinutes < 0 || timeMinutes > MOTION_DURATION_MINUTES) {
    throw new RangeError('时间须在 0 到 12 分钟之间')
  }
}

// The model uses minutes internally; positions are measured in kilometres.
export function positionAt(timeMinutes) {
  assertTimeInTrip(timeMinutes)
  return 5 * timeMinutes / 3
    - 9 / Math.PI * Math.sin(Math.PI * timeMinutes / 6)
    + 2.5 / Math.PI * Math.sin(Math.PI * timeMinutes / 3)
}

// Analytic derivative in km/min, including the one-sided slopes at both trip ends.
export function minuteSlopeAt(timeMinutes) {
  return speedAt(timeMinutes) / MINUTES_PER_HOUR
}

// On a graph whose horizontal axis is hours, this is also the tangent slope.
export function speedAt(timeMinutes) {
  assertTimeInTrip(timeMinutes)
  const z = Math.sin(Math.PI * timeMinutes / MOTION_DURATION_MINUTES) ** 2
  return 60 - 220 * z + 400 * z ** 2
}

export function averageSpeed(startMinutes = 0, endMinutes = MOTION_DURATION_MINUTES) {
  assertTimeInTrip(startMinutes)
  assertTimeInTrip(endMinutes)
  if (endMinutes <= startMinutes) {
    throw new RangeError('平均速度需要终点时刻大于起点时刻')
  }

  return (positionAt(endMinutes) - positionAt(startMinutes))
    / (endMinutes - startMinutes) * MINUTES_PER_HOUR
}

// The two mean-value times for the entire 0–12 minute trip, returned in minutes.
export function meanValueTimes() {
  return timesAtSinSquared((11 + Math.sqrt(281)) / 40)
}

export function lowSpeedTimes() {
  return timesAtSinSquared(11 / 40)
}

function timesAtSinSquared(value) {
  const first = MOTION_DURATION_MINUTES / Math.PI * Math.asin(Math.sqrt(value))
  return [first, MOTION_DURATION_MINUTES - first]
}
