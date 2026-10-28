import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TaylorApproximationDemo from '../src/components/demos/TaylorApproximationDemo.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

function value(selector) {
  return Number(wrapper.get(selector).attributes('data-value'))
}

function range(selector) {
  return Number(wrapper.get(selector).element.value)
}

function expectFinitePlot() {
  expect(wrapper.html()).not.toMatch(/NaN|Infinity/)
  expect(wrapper.findAll('.katex-error')).toHaveLength(0)
  for (const element of wrapper.findAll('svg circle, svg line, svg rect')) {
    for (const name of ['cx', 'cy', 'x1', 'x2', 'y1', 'y2', 'x', 'y', 'width', 'height']) {
      const coordinate = element.attributes(name)
      if (coordinate !== undefined) expect(Number.isFinite(Number(coordinate))).toBe(true)
    }
  }
  for (const path of wrapper.findAll('svg path')) expect(path.attributes('d')).not.toMatch(/NaN|Infinity/)
}

describe('Taylor approximation demo', () => {
  it('compares the same polynomial locally and far away without squeezing the original curve', async () => {
    wrapper = mount(TaylorApproximationDemo)
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(4)
    const nearError = value('#taylor-absolute-error')
    expect(nearError).toBeGreaterThan(0)
    expect(nearError).toBeLessThan(0.001)

    await wrapper.get('[data-preset="far"]').trigger('click')
    const farError = value('#taylor-absolute-error')
    expect(farError).toBeGreaterThan(10)
    expect(farError / nearError).toBeGreaterThan(10000)
    expect(range('#taylor-degree-range')).toBe(3)
    expect(range('#taylor-radius-range')).toBe(6)
    expect(range('#taylor-delta-range')).toBe(5.5)
    expect(wrapper.find('[data-plot="local"] .taylor-original-point').exists()).toBe(false)
    expect(wrapper.find('[data-plot="wide"] .taylor-polynomial-point').exists()).toBe(false)
    expect(wrapper.find('[data-plot="wide"] .taylor-offscreen-arrow').exists()).toBe(true)
    expect(wrapper.get('.taylor-clipping-note').text()).toContain('实际数值')
    expect(value('#taylor-polynomial-value')).toBeCloseTo(5.5 - 5.5 ** 3 / 6, 10)
    const wideAxis = wrapper.get('[data-plot="wide"] .taylor-ticks').text()

    await wrapper.get('[data-preset="higher"]').trigger('click')
    expect(range('#taylor-degree-range')).toBe(11)
    expect(range('#taylor-delta-range')).toBe(5.5)
    expect(value('#taylor-absolute-error')).toBeLessThan(farError)
    expect(wrapper.get('[data-plot="wide"] .taylor-ticks').text()).toBe(wideAxis)
    expectFinitePlot()
  })

  it('recomputes at a moved base while retaining the independent input increment', async () => {
    wrapper = mount(TaylorApproximationDemo)
    const oldPolynomial = value('#taylor-polynomial-value')
    await wrapper.get('#taylor-base-range').setValue('1')
    expect(range('#taylor-delta-range')).toBe(0.5)
    expect(value('#taylor-original-value')).toBeCloseTo(Math.sin(1.5), 12)
    expect(value('#taylor-polynomial-value')).not.toBe(oldPolynomial)
    expect(Number(wrapper.get('[data-plot="wide"] .taylor-original-point').attributes('data-x'))).toBe(1.5)
    expectFinitePlot()
  })

  it('raises degree without changing a manually chosen base, target or observation radius', async () => {
    wrapper = mount(TaylorApproximationDemo)
    await wrapper.get('#taylor-radius-range').setValue('4')
    await wrapper.get('#taylor-base-range').setValue('1')
    await wrapper.get('#taylor-delta-range').setValue('2')
    const original = value('#taylor-original-value')
    const error = value('#taylor-absolute-error')

    await wrapper.get('[data-preset="higher"]').trigger('click')
    expect(range('#taylor-degree-range')).toBe(11)
    expect(range('#taylor-base-range')).toBe(1)
    expect(range('#taylor-radius-range')).toBe(4)
    expect(range('#taylor-delta-range')).toBe(2)
    expect(value('#taylor-original-value')).toBe(original)
    expect(value('#taylor-absolute-error')).toBeLessThan(error)

    await wrapper.get('[data-preset="higher"]').trigger('click')
    expect(range('#taylor-degree-range')).toBe(12)
    expect(wrapper.get('[data-preset="higher"]').element.disabled).toBe(true)
    expectFinitePlot()
  })

  it('keeps logarithm targets in their domain when changing function and base', async () => {
    wrapper = mount(TaylorApproximationDemo)
    await wrapper.get('#taylor-radius-range').setValue('6')
    await wrapper.get('#taylor-delta-range').setValue('-5')
    await wrapper.get('[data-function="log"]').trigger('click')
    expect(range('#taylor-delta-range')).toBeCloseTo(-0.98, 10)
    expect(value('#taylor-original-value')).toBeCloseTo(Math.log(0.02), 10)
    expect(wrapper.get('#taylor-domain-note').text()).toContain('x > −1')

    await wrapper.get('#taylor-base-range').setValue('-0.5')
    expect(range('#taylor-delta-range')).toBeCloseTo(-0.48, 10)
    expect(value('#taylor-original-value')).toBeCloseTo(Math.log(0.02), 10)
    expectFinitePlot()
  })

  it('shows a real counterexample to more terms always helping far from the base', async () => {
    wrapper = mount(TaylorApproximationDemo)
    await wrapper.get('[data-function="log"]').trigger('click')
    await wrapper.get('[data-preset="far"]').trigger('click')
    const thirdOrderError = value('#taylor-absolute-error')
    await wrapper.get('[data-preset="higher"]').trigger('click')
    expect(value('#taylor-absolute-error')).toBeGreaterThan(thirdOrderError)
    expect(value('#taylor-error-bound')).toBeGreaterThanOrEqual(value('#taylor-absolute-error'))
    expect(wrapper.get('#taylor-domain-note').text()).toContain('误差也可能更大')
    expectFinitePlot()
  })

  it('moves an out-of-range target into the new observation window', async () => {
    wrapper = mount(TaylorApproximationDemo)
    await wrapper.get('[data-preset="far"]').trigger('click')
    await wrapper.get('#taylor-radius-range').setValue('0.5')
    expect(range('#taylor-delta-range')).toBe(0.5)
    expect(value('#taylor-original-value')).toBeCloseTo(Math.sin(0.5), 12)
    expect(wrapper.get('[role="status"]').text()).toContain('移回范围内')
    expectFinitePlot()
  })

  it('keeps zero order, exact-base observations and control extremes finite', async () => {
    wrapper = mount(TaylorApproximationDemo)
    await wrapper.get('#taylor-degree-range').setValue('0')
    await wrapper.get('#taylor-delta-range').setValue('0')
    expect(value('#taylor-absolute-error')).toBe(0)
    expect(value('#taylor-error-bound')).toBe(0)
    expectFinitePlot()

    for (const id of ['sin', 'exp', 'log']) {
      await wrapper.get('[data-function="' + id + '"]').trigger('click')
      await wrapper.get('#taylor-degree-range').setValue('12')
      await wrapper.get('#taylor-radius-range').setValue('8')
      await wrapper.get('#taylor-delta-range').setValue('8')
      expect(value('#taylor-absolute-error')).toBeLessThanOrEqual(value('#taylor-error-bound'))
      expectFinitePlot()
      await wrapper.get('#taylor-delta-range').setValue(wrapper.get('#taylor-delta-range').attributes('min'))
      expectFinitePlot()
    }
  })
})
