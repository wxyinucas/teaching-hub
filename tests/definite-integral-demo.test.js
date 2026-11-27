import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import CircleExhaustionDemo from '../src/components/demos/CircleExhaustionDemo.vue'
import DefiniteIntegralDemo from '../src/components/demos/DefiniteIntegralDemo.vue'
import RiemannApproximationDemo from '../src/components/demos/RiemannApproximationDemo.vue'
import {
  CIRCLE_SIDE_COUNTS,
  QUARTER_CIRCLE_AREA,
  buildQuarterCircleApproximation,
  unitCircleApproximation,
} from '../src/lib/definiteIntegral.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.restoreAllMocks()
})

function number(selector) {
  return Number(wrapper.get(selector).text())
}

describe('definite integral approximation math', () => {
  it('keeps the circle between the inner and outer polygon while the gap closes', () => {
    const coarse = unitCircleApproximation(4)
    const fine = unitCircleApproximation(64)
    expect(coarse.inner).toBeLessThan(Math.PI)
    expect(coarse.outer).toBeGreaterThan(Math.PI)
    expect(fine.inner).toBeLessThan(Math.PI)
    expect(fine.outer).toBeGreaterThan(Math.PI)
    expect(fine.outer - fine.inner).toBeLessThan(coarse.outer - coarse.inner)
  })

  it('keeps every arbitrary rectangle sum between the lower and upper sums', () => {
    for (const count of [2, 4, 8, 16, 32]) {
      for (const seed of [0, 1, 4]) {
        const result = buildQuarterCircleApproximation({
          count,
          partitionSeed: seed,
          sampleSeed: seed + 2,
        })
        expect(result.lower).toBeLessThanOrEqual(result.sample)
        expect(result.sample).toBeLessThanOrEqual(result.upper)
        expect(result.maxWidth).toBeGreaterThan(0)
        expect(result.trapezoid).toBeGreaterThan(0)
        expect(result.simpson).toBeGreaterThan(0)
      }
    }
  })
})

describe('definite integral topic demo', () => {
  it('keeps the two scenes behind one route-aware entry', async () => {
    const route = reactive({ query: { scene: 'riemann', from: 'runbook' } })
    const replace = vi.fn()
    wrapper = mount(DefiniteIntegralDemo, {
      global: { provide: { [routeLocationKey]: route, [routerKey]: { replace } } },
    })
    expect(wrapper.find('.riemann-approximation-demo').exists()).toBe(true)
    await wrapper.get('[data-scene="exhaustion"]').trigger('click')
    expect(replace).toHaveBeenLastCalledWith({ query: { scene: undefined, from: 'runbook' } })
    route.query = { from: 'runbook' }
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.circle-exhaustion-demo').exists()).toBe(true)
  })

  it('shows the polygon gap shrinking as the number of sides increases', async () => {
    wrapper = mount(CircleExhaustionDemo)
    const initialGap = number('[data-circle-gap]')
    await wrapper.get('#circle-side-level').setValue(String(CIRCLE_SIDE_COUNTS.length - 1))
    expect(Number(wrapper.get('svg').attributes('data-sides'))).toBe(64)
    expect(number('[data-circle-gap]')).toBeLessThan(initialGap)
    expect(number('[data-circle-value="inner"]')).toBeLessThan(Math.PI)
    expect(number('[data-circle-value="outer"]')).toBeGreaterThan(Math.PI)
  })

  it('changes partitions, samples and local models without changing the common target', async () => {
    wrapper = mount(RiemannApproximationDemo)
    const lower = number('[data-riemann-value="lower"]')
    const sample = number('[data-riemann-value="sample"]')
    const upper = number('[data-riemann-value="upper"]')
    expect(lower).toBeLessThanOrEqual(sample)
    expect(sample).toBeLessThanOrEqual(upper)

    const firstSample = number('[data-riemann-value="current"]')
    await wrapper.get('[data-action="resample"]').trigger('click')
    expect(number('[data-riemann-value="current"]')).not.toBe(firstSample)
    await wrapper.get('[data-action="repartition"]').trigger('click')
    expect(wrapper.text()).toContain('当前：不等分')

    await wrapper.get('[data-method="trapezoid"]').trigger('click')
    expect(wrapper.get('[data-action="resample"]').element.disabled).toBe(true)
    expect(Number.isFinite(number('[data-riemann-value="current"]'))).toBe(true)
    await wrapper.get('[data-method="parabola"]').trigger('click')
    await wrapper.get('#riemann-refinement').setValue('4')
    expect(number('[data-riemann-value="current"]')).toBeCloseTo(QUARTER_CIRCLE_AREA, 3)
    expect(wrapper.html()).not.toMatch(/NaN|Infinity/)
    expect(wrapper.findAll('.katex-error')).toHaveLength(0)
  })
})
