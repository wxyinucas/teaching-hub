import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MeanValueDemo from '../src/components/demos/MeanValueDemo.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

function coordinates(selector, names) {
  const element = wrapper.find(selector)
  return Object.fromEntries(names.map((name) => [name, Number(element.attributes(name))]))
}

function point(selector) {
  return coordinates(selector, ['cx', 'cy', 'data-time-minutes'])
}

function line(selector) {
  return coordinates(selector, ['x1', 'y1', 'x2', 'y2'])
}

function slopeInKmPerHour(segment, secant) {
  // The secant spans 0.2 hours horizontally and 20 kilometres vertically.
  // Use each axis's scale, not the raw geometric slope in SVG pixels.
  const hours = (segment.x2 - segment.x1) / (secant.x2 - secant.x1) * 0.2
  const kilometres = (segment.y2 - segment.y1) / (secant.y2 - secant.y1) * 20
  return kilometres / hours
}

describe('mean-value motion demo', () => {
  it('drives both graphs and the tangent with one time slider while keeping the average fixed', async () => {
    wrapper = mount(MeanValueDemo)
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(1)

    const initialPosition = point('.mean-value-position-point')
    const initialSpeed = point('.mean-value-speed-point')
    const initialTangent = line('.mean-value-tangent')
    const fixedSecant = line('.mean-value-secant')
    const fixedAverage = line('.mean-value-average-speed')

    await wrapper.find('#mean-value-time-range').setValue('3')

    const position = point('.mean-value-position-point')
    const speed = point('.mean-value-speed-point')
    expect(position.cx).not.toBe(initialPosition.cx)
    expect(speed.cx).not.toBe(initialSpeed.cx)
    expect(position.cx).toBe(speed.cx)
    expect(position['data-time-minutes']).toBe(3)
    expect(speed['data-time-minutes']).toBe(3)
    expect(line('.mean-value-tangent')).not.toEqual(initialTangent)
    expect(line('.mean-value-secant')).toEqual(fixedSecant)
    expect(line('.mean-value-average-speed')).toEqual(fixedAverage)
  })

  it.each([
    ['entry', 0, 60],
    ['midpoint', 6, 240],
    ['exit', 12, 60],
  ])('shows the %s preset at its matching time and instantaneous speed', async (preset, minutes, speed) => {
    wrapper = mount(MeanValueDemo)
    await wrapper.find(`[data-preset="${preset}"]`).trigger('click')

    expect(wrapper.find('#mean-value-speed-value').text()).toBe(`瞬时 ${speed} km/h`)
    expect(point('.mean-value-position-point')['data-time-minutes']).toBe(minutes)
    expect(point('.mean-value-speed-point')['data-time-minutes']).toBe(minutes)
    expect(Number(wrapper.find('#mean-value-time-range').element.value)).toBe(minutes)
  })

  it('finds two distinct interior times with equal speeds and parallel tangents', async () => {
    wrapper = mount(MeanValueDemo)
    const secant = line('.mean-value-secant')
    const average = line('.mean-value-average-speed')
    const times = []

    for (const preset of ['first-mean', 'second-mean']) {
      await wrapper.find(`[data-preset="${preset}"]`).trigger('click')

      const position = point('.mean-value-position-point')
      const speed = point('.mean-value-speed-point')
      const tangent = line('.mean-value-tangent')
      const minutes = position['data-time-minutes']
      times.push(minutes)

      expect(minutes).toBeGreaterThan(0)
      expect(minutes).toBeLessThan(12)
      expect(speed['data-time-minutes']).toBe(minutes)
      expect(position.cx).toBe(speed.cx)
      expect(wrapper.find('#mean-value-result').text()).toContain('恰好等于')
      expect(speed.cy).toBeCloseTo(average.y1, 10)
      expect(slopeInKmPerHour(tangent, secant)).toBeCloseTo(100, 10)
      expect(slopeInKmPerHour(tangent, secant)).toBeCloseTo(slopeInKmPerHour(secant, secant), 10)
      expect(line('.mean-value-secant')).toEqual(secant)
      expect(line('.mean-value-average-speed')).toEqual(average)
    }

    expect(times[0]).not.toBe(times[1])
  })

  it('uses hours on both plot axes and renders finite coordinates and valid formulas throughout', async () => {
    wrapper = mount(MeanValueDemo)
    const timeAxes = wrapper.findAll('.motion-axis-title').filter((label) => label.text() === '时间 t（h）')
    expect(timeAxes).toHaveLength(2)
    expect(wrapper.find('.motion-model-note').text()).toContain('两图横轴统一用小时')

    for (const minutes of [0, 1.25, 6, 11.75, 12]) {
      await wrapper.find('#mean-value-time-range').setValue(String(minutes))
      expect(wrapper.html()).not.toMatch(/NaN|Infinity/)
      expect(wrapper.findAll('.katex-error')).toHaveLength(0)
    }
    for (const preset of ['first-mean', 'second-mean']) {
      await wrapper.find(`[data-preset="${preset}"]`).trigger('click')
      expect(wrapper.html()).not.toMatch(/NaN|Infinity/)
      expect(wrapper.findAll('.katex-error')).toHaveLength(0)
    }
  })
})
