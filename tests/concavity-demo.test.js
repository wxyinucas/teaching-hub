import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { routeLocationKey, routerKey } from 'vue-router'
import ConcavityDemo from '../src/components/demos/ConcavityDemo.vue'
import DerivativeApplicationsDemo from '../src/components/demos/DerivativeApplicationsDemo.vue'

let wrapper
const number = (selector, attribute) => Number(wrapper.find(selector).attributes(attribute))
afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('concavity linked plots', () => {
  it('uses one coordinate to move both points and distinguishes rising from bending', async () => {
    wrapper = mount(ConcavityDemo)
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(1)
    for (const [x, bending, second, meaning] of [[-1, 'down', -6, '向上凸'], [1, 'up', 6, '向上凹']]) {
      await wrapper.find('[data-preset="' + x + '"]').trigger('click')
      expect(number('.concavity-function-point', 'data-x')).toBe(x)
      expect(number('.concavity-derivative-point', 'data-x')).toBe(x)
      expect(number('.concavity-function-point', 'cx')).toBe(number('.concavity-derivative-point', 'cx'))
      expect(number('#concavity-slope', 'data-value')).toBe(3)
      expect(number('#concavity-second', 'data-value')).toBe(second)
      expect(wrapper.find('.concavity-demo').attributes('data-bending')).toBe(bending)
      expect(wrapper.find('#concavity-result').text()).toContain(meaning)
      expect(wrapper.find('#concavity-result').text()).toContain('增加')
    }
  })

  it('shows an inflection without an extremum for the cubic at zero', async () => {
    wrapper = mount(ConcavityDemo)
    await wrapper.find('[data-preset="0"]').trigger('click')
    expect(number('#concavity-slope', 'data-value')).toBe(0)
    expect(number('#concavity-second', 'data-value')).toBe(0)
    expect(number('.concavity-function-tangent', 'y1')).toBe(number('.concavity-function-tangent', 'y2'))
    expect(wrapper.find('#concavity-result').text()).toContain('原点是拐点')
    expect(wrapper.find('#concavity-result').text()).toContain('原点没有极值')
  })

  it('shows why a zero second derivative alone does not give an inflection', async () => {
    wrapper = mount(ConcavityDemo)
    await wrapper.find('[data-function-choice="quartic"]').trigger('click')
    for (const x of [-1, 1]) {
      await wrapper.find('#concavity-x-range').setValue(String(x))
      expect(number('#concavity-slope', 'data-value')).toBe(4 * x ** 3)
      expect(number('#concavity-second', 'data-value')).toBe(12)
      expect(wrapper.find('.concavity-demo').attributes('data-bending')).toBe('up')
    }
    await wrapper.find('[data-preset="0"]').trigger('click')
    expect(number('#concavity-second', 'data-value')).toBe(0)
    expect(wrapper.find('#concavity-result').text()).toContain('原点不是拐点')
    expect(wrapper.find('#concavity-result').text()).toContain('有极小值')
  })

  it.each(['cube', 'quartic'])('keeps both plotted tangent slopes numerically correct for %s', async (functionId) => {
    wrapper = mount(ConcavityDemo)
    await wrapper.find('[data-function-choice="' + functionId + '"]').trigger('click')
    for (const x of [-1.5, -0.75, 0, 0.75, 1.5]) {
      await wrapper.find('#concavity-x-range').setValue(String(x))
      const slopes = [functionId === 'cube' ? 3 * x ** 2 : 4 * x ** 3, functionId === 'cube' ? 6 * x : 12 * x ** 2]
      const yRanges = functionId === 'cube' ? [7.2, 7.8] : [6, 28]
      for (const [index, kind] of ['function', 'derivative'].entries()) {
        const frame = wrapper.find('.concavity-' + kind + '-plot .concavity-frame')
        const width = Number(frame.attributes('width'))
        const height = Number(frame.attributes('height'))
        const selector = '.concavity-' + kind + '-tangent'
        const dx = (number(selector, 'x2') - number(selector, 'x1')) / width * 3
        const dy = -(number(selector, 'y2') - number(selector, 'y1')) / height * yRanges[index]
        expect(dy / dx).toBeCloseTo(slopes[index], 9)
      }
      expect(wrapper.html()).not.toMatch(/NaN|Infinity/)
      expect(wrapper.findAll('.katex-error')).toHaveLength(0)
    }
  })

  it('resizes both plots together and releases its observer on unmount', async () => {
    let callback
    const disconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', class {
      constructor(value) { callback = value }
      observe() {}
      disconnect = disconnect
    })
    wrapper = mount(ConcavityDemo)
    callback([{ contentRect: { width: 768 } }])
    await wrapper.vm.$nextTick()
    const viewBoxes = wrapper.findAll('svg').map((svg) => svg.attributes('viewBox'))
    expect(viewBoxes[0]).toBe(viewBoxes[1])
    expect(viewBoxes[0]).toMatch(/^0 0 768 /)
    wrapper.unmount()
    wrapper = null
    expect(disconnect).toHaveBeenCalledOnce()
  })
})

describe('derivative application scenes', () => {
  it('defaults to the existing demo and preserves both scene positions while switching', async () => {
    wrapper = mount(DerivativeApplicationsDemo)
    await wrapper.find('#monotonicity-x-range').setValue('1.5')
    await wrapper.find('[data-scene="concavity"]').trigger('click')
    await wrapper.find('#concavity-x-range').setValue('0.5')
    await wrapper.find('[data-function-choice="quartic"]').trigger('click')
    await wrapper.find('[data-scene="monotonicity"]').trigger('click')
    expect(Number(wrapper.find('#monotonicity-x-range').element.value)).toBe(1.5)
    await wrapper.find('[data-scene="concavity"]').trigger('click')
    expect(Number(wrapper.find('#concavity-x-range').element.value)).toBe(0.5)
    expect(wrapper.find('.concavity-demo').attributes('data-function')).toBe('quartic')
  })

  it('opens a linked concavity scene, follows route changes, and preserves unrelated query fields', async () => {
    const route = reactive({ query: { scene: 'concavity', from: 'runbook' } })
    const replace = vi.fn()
    wrapper = mount(DerivativeApplicationsDemo, {
      global: { provide: { [routeLocationKey]: route, [routerKey]: { replace } } },
    })
    expect(wrapper.find('.concavity-demo').exists()).toBe(true)
    expect(wrapper.find('.monotonicity-demo').exists()).toBe(false)
    await wrapper.find('[data-scene="monotonicity"]').trigger('click')
    expect(replace).toHaveBeenLastCalledWith({ query: { scene: undefined, from: 'runbook' } })
    route.query = { from: 'runbook' }
    await wrapper.vm.$nextTick()
    route.query = { scene: 'concavity', from: 'runbook' }
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.concavity-demo').exists()).toBe(true)
    await wrapper.find('[data-scene="concavity"]').trigger('click')
    expect(replace).toHaveBeenLastCalledWith({ query: { scene: 'concavity', from: 'runbook' } })
    route.query = { scene: 'unknown' }
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.monotonicity-demo').exists()).toBe(true)
  })
})
