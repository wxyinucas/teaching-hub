import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FunctionLimitDemo from '../src/components/demos/FunctionLimitDemo.vue'
import MathFormula from '../src/components/MathFormula.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

describe('function-limit demo', () => {
  it('shows both neighborhoods while their intersection switches at epsilon 5', async () => {
    wrapper = mount(FunctionLimitDemo)

    expect(wrapper.findAll('.open-interval-markers text')).toHaveLength(2)
    expect(wrapper.findAll('.fixed-boundary')).toHaveLength(2)
    expect(wrapper.findAll('.responsive-boundary')).toHaveLength(2)
    expect(wrapper.findAll('.effective-boundary')).toHaveLength(0)

    const fixedWidth = Number(wrapper.find('.function-fixed-band').attributes('width'))
    const initialResponsiveWidth = Number(wrapper.find('.function-responsive-band').attributes('width'))
    const initialEffectiveWidth = Number(wrapper.find('.function-input-band').attributes('width'))
    expect(initialResponsiveWidth).toBeLessThan(fixedWidth)
    expect(initialEffectiveWidth).toBeCloseTo(initialResponsiveWidth)
    expect(wrapper.find('.interval-switch-status').text()).toContain('动态区间更窄')

    await wrapper.find('#function-epsilon-range').setValue('5')
    expect(Number(wrapper.find('.function-responsive-band').attributes('width'))).toBeCloseTo(fixedWidth)
    expect(Number(wrapper.find('.function-input-band').attributes('width'))).toBeCloseTo(fixedWidth)
    expect(wrapper.find('.interval-switch-status').text()).toContain('恰好重合')

    await wrapper.find('#function-epsilon-range').setValue('8')
    expect(Number(wrapper.find('.function-responsive-band').attributes('width'))).toBeGreaterThan(fixedWidth)
    expect(Number(wrapper.find('.function-input-band').attributes('width'))).toBeCloseTo(fixedWidth)
    expect(wrapper.find('.interval-switch-status').text()).toContain('固定区间更窄')

    const resultFormula = wrapper.findAllComponents(MathFormula).find((formula) => (
      formula.classes().includes('result-formula')
    ))
    expect(resultFormula.props('tex')).toContain('\\min\\left\\{1,\\frac{\\varepsilon}{5}\\right\\}')
  })

  it('switches between the squeeze and unit-circle scenes', async () => {
    wrapper = mount(FunctionLimitDemo)
    const tabs = wrapper.findAll('.demo-scene-nav button')

    await tabs[1].trigger('click')
    expect(wrapper.find('#squeeze-title').exists()).toBe(true)
    expect(wrapper.findAll('.oscillating-function.is-local')).toHaveLength(2)

    await tabs[2].trigger('click')
    expect(wrapper.find('#important-limit-title').exists()).toBe(true)
    expect(wrapper.find('.area-sector').exists()).toBe(true)
    expect(wrapper.find('.geometry-sine-segment').exists()).toBe(true)
    expect(wrapper.find('.geometry-sine-label').text()).toBe('sin x')
    expect(wrapper.findAllComponents(MathFormula).some((formula) => (
      formula.props('tex').includes('\\frac{\\sin x}{x}')
    ))).toBe(true)
  })
})
