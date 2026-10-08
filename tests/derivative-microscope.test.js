import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DerivativeMicroscopeDemo from '../src/components/demos/DerivativeMicroscopeDemo.vue'
import MathFormula from '../src/components/MathFormula.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

function buttonWithText(text) {
  return wrapper.findAll('button').find((button) => button.text() === text)
}

function formulaSources() {
  return wrapper.findAllComponents(MathFormula).map((formula) => formula.props('tex'))
}

describe('derivative microscope demo', () => {
  it('reveals increment, quotient, and limit without changing the underlying picture', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)

    expect(wrapper.findAll('.derivative-observation')).not.toHaveLength(0)
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(2)
    expect(buttonWithText('从左')).toBeUndefined()
    expect(formulaSources().some((tex) => tex.includes('\\Delta x=0.75') && tex.includes('\\Delta y=2.063'))).toBe(true)
    expect(wrapper.find('.derivative-tangent').exists()).toBe(false)
    expect(wrapper.find('.derivative-map-card').exists()).toBe(false)

    await buttonWithText('2 · 看比值').trigger('click')
    expect(formulaSources().some((tex) => tex.startsWith('\\frac{\\Delta y}{\\Delta x}') && tex.endsWith('=2.75'))).toBe(true)
    expect(wrapper.find('.derivative-tangent').exists()).toBe(false)

    await wrapper.find('#derivative-delta-x-range').setValue('5')
    expect(formulaSources().some((tex) => tex.startsWith('\\frac{\\Delta y}{\\Delta x}') && tex.endsWith('=1.9'))).toBe(true)
    await wrapper.find('#derivative-delta-x-range').setValue('12')
    expect(formulaSources().some((tex) => tex.startsWith('\\frac{\\Delta y}{\\Delta x}') && tex.endsWith('=2.1'))).toBe(true)
    await wrapper.find('#derivative-delta-x-range').setValue('17')
    expect(formulaSources().some((tex) => tex.startsWith('\\frac{\\Delta y}{\\Delta x}') && tex.endsWith('=3.5'))).toBe(true)

    await buttonWithText('3 · 看极限').trigger('click')
    expect(wrapper.find('.derivative-tangent').exists()).toBe(true)
    expect(wrapper.find('.derivative-map-card').exists()).toBe(true)
    expect(wrapper.find('.map-current-point').exists()).toBe(true)
    expect(formulaSources().some((tex) => tex === "f'(1)=2\\cdot1=2")).toBe(true)
  })

  it('keeps the two one-sided slopes separate for absolute value at the origin', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)

    await buttonWithText('|x|').trigger('click')
    await buttonWithText('x₀ = 0').trigger('click')
    await buttonWithText('3 · 看极限').trigger('click')

    expect(wrapper.findAll('.derivative-secant')).toHaveLength(2)
    expect(wrapper.find('.derivative-tangent').exists()).toBe(false)
    expect(wrapper.findAll('.approach-callouts text')).toHaveLength(2)
    expect(wrapper.findAll('.map-open-point')).toHaveLength(2)
    expect(wrapper.find('.map-current-point').exists()).toBe(false)
    expect(wrapper.find('.derivative-warning').text()).toContain('左右结果不同')
    expect(formulaSources()).toContain("f'_-(0)=-1,\\qquad f'_+(0)=1")
  })
})
