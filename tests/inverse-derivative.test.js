import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InverseDerivativeDemo from '../src/components/demos/InverseDerivativeDemo.vue'
import MathFormula from '../src/components/MathFormula.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

function formulaSources() {
  return wrapper.findAllComponents(MathFormula).map((formula) => formula.props('tex'))
}

describe('inverse function derivative demo', () => {
  it('reveals corresponding points, the reflected curve, and reflected tangents in order', async () => {
    wrapper = mount(InverseDerivativeDemo)

    expect(wrapper.find('[data-example="exp"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('.inverse-reflected-curve').exists()).toBe(false)
    expect(wrapper.find('.inverse-reflected-point').exists()).toBe(false)
    expect(wrapper.find('.inverse-original-tangent').exists()).toBe(false)

    await wrapper.find('[data-stage="2"]').trigger('click')
    expect(wrapper.find('.inverse-reflected-curve').exists()).toBe(true)
    expect(wrapper.find('.inverse-reflected-point').exists()).toBe(true)
    expect(wrapper.find('.inverse-original-tangent').exists()).toBe(false)

    await wrapper.find('[data-stage="3"]').trigger('click')
    expect(wrapper.find('.inverse-original-tangent').exists()).toBe(true)
    expect(wrapper.find('.inverse-reflected-tangent').exists()).toBe(true)
    expect(formulaSources().some((tex) => tex.includes("f'(x_0)") && tex.includes('=1'))).toBe(true)
    expect(wrapper.find('#inverse-result').text()).toContain('斜率互为倒数')
  })

  it('turns the square function horizontal tangent into a vertical tangent at the origin', async () => {
    wrapper = mount(InverseDerivativeDemo)

    await wrapper.find('[data-example="square"]').trigger('click')
    await wrapper.find('#inverse-base-point-range').setValue('0')
    await wrapper.find('[data-stage="3"]').trigger('click')

    const reflectedTangent = wrapper.find('.inverse-reflected-tangent')
    expect(Number(reflectedTangent.attributes('x1'))).toBeCloseTo(Number(reflectedTangent.attributes('x2')), 8)
    expect(wrapper.find('#inverse-result').text()).toContain('竖直')
    expect(wrapper.find('#inverse-result').text()).toContain('没有有限右导数')
    expect(wrapper.find('.inverse-slope-warning').text()).toContain('定义域端点')
    expect(formulaSources().join(' ')).not.toMatch(/Infinity|NaN/)
  })
})
