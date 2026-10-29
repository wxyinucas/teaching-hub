import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MonotonicityDemo from '../src/components/demos/MonotonicityDemo.vue'

let wrapper
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const number = (selector, attribute) => Number(wrapper.find(selector).attributes(attribute))

describe('monotonicity linked plots', () => {
  it('uses one horizontal coordinate for both graphs and moves the tangent with it', async () => {
    wrapper = mount(MonotonicityDemo)
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(1)
    const oldTangent = wrapper.find('.monotonicity-tangent').attributes()
    await wrapper.find('#monotonicity-x-range').setValue('1.5')
    expect(number('.monotonicity-function-point', 'data-x')).toBe(1.5)
    expect(number('.monotonicity-derivative-point', 'data-x')).toBe(1.5)
    expect(number('.monotonicity-function-point', 'cx')).toBe(number('.monotonicity-derivative-point', 'cx'))
    expect(wrapper.find('.monotonicity-tangent').attributes()).not.toEqual(oldTangent)
    expect(wrapper.find('#monotonicity-function-value').attributes('data-value')).toBe('1.5')
    expect(wrapper.find('#monotonicity-derivative-value').attributes('data-value')).toBe('-1.5')
    expect(wrapper.find('.monotonicity-demo').attributes('data-sign')).toBe('negative')
    expect(wrapper.find('#monotonicity-result').text()).toContain('零轴下方')
  })

  it.each([
    ['first-zero', 1, 2, '由正变负'],
    ['second-zero', 2, 1, '由负变正'],
  ])('puts %s on the derivative zero axis and makes the original tangent horizontal', async (preset, x, value, change) => {
    wrapper = mount(MonotonicityDemo)
    await wrapper.find('[data-preset="' + preset + '"]').trigger('click')
    expect(number('.monotonicity-function-point', 'data-x')).toBe(x)
    expect(Number(wrapper.find('#monotonicity-x-range').element.value)).toBe(x)
    expect(wrapper.find('#monotonicity-function-value').attributes('data-value')).toBe(String(value))
    expect(wrapper.find('#monotonicity-derivative-value').attributes('data-value')).toBe('0')
    expect(number('.monotonicity-tangent', 'y1')).toBe(number('.monotonicity-tangent', 'y2'))
    expect(number('.monotonicity-derivative-point', 'cy')).toBe(number('.monotonicity-zero-axis', 'y1'))
    expect(wrapper.find('.monotonicity-demo').attributes('data-sign')).toBe('zero')
    expect(wrapper.find('#monotonicity-result').text()).toContain(change)
  })

  it.each([
    ['left', 0.75, 'positive', 1.875],
    ['middle', 1.5, 'negative', -1.5],
    ['right', 2.25, 'positive', 1.875],
  ])('shows the derivative sign and height on the %s interval', async (preset, x, sign, slope) => {
    wrapper = mount(MonotonicityDemo)
    await wrapper.find('[data-preset="' + preset + '"]').trigger('click')
    expect(number('.monotonicity-function-point', 'data-x')).toBe(x)
    expect(wrapper.find('.monotonicity-demo').attributes('data-sign')).toBe(sign)
    expect(wrapper.find('#monotonicity-derivative-value').attributes('data-value')).toBe(String(slope))
    const zero = number('.monotonicity-zero-axis', 'y1')
    const height = number('.monotonicity-derivative-point', 'cy')
    if (slope > 0) expect(height).toBeLessThan(zero)
    else expect(height).toBeGreaterThan(zero)
  })

  it('keeps the tangent slope equal to the derivative after accounting for axis scales', async () => {
    wrapper = mount(MonotonicityDemo)
    for (const x of [0.5, 0.75, 1.25, 1.75, 2.25, 2.5]) {
      await wrapper.find('#monotonicity-x-range').setValue(String(x))
      const original = wrapper.find('.monotonicity-function-plot .monotonicity-frame')
      const width = Number(original.attributes('width'))
      const height = Number(original.attributes('height'))
      const dx = (number('.monotonicity-tangent', 'x2') - number('.monotonicity-tangent', 'x1')) / width * 2
      const dy = -(number('.monotonicity-tangent', 'y2') - number('.monotonicity-tangent', 'y1')) / height * 2
      expect(dy / dx).toBeCloseTo(6 * (x - 1) * (x - 2), 10)
      expect(wrapper.html()).not.toMatch(/NaN|Infinity/)
      expect(wrapper.findAll('.katex-error')).toHaveLength(0)
    }
  })

  it('resizes both graphs together and disconnects its observer on unmount', async () => {
    let callback
    const disconnect = vi.fn()
    const observe = vi.fn()
    vi.stubGlobal('ResizeObserver', class {
      constructor(value) { callback = value }
      observe = observe
      disconnect = disconnect
    })
    wrapper = mount(MonotonicityDemo)
    expect(observe).toHaveBeenCalledOnce()
    callback([{ contentRect: { width: 400 } }])
    await wrapper.vm.$nextTick()
    const viewBoxes = wrapper.findAll('svg').map((svg) => svg.attributes('viewBox'))
    expect(viewBoxes[0]).toBe(viewBoxes[1])
    expect(viewBoxes[0]).toMatch(/^0 0 400 /)
    expect(number('.monotonicity-function-point', 'cx')).toBe(number('.monotonicity-derivative-point', 'cx'))
    wrapper.unmount()
    wrapper = null
    expect(disconnect).toHaveBeenCalledOnce()
  })
})
