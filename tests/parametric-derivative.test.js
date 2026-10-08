import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ParametricDerivativeDemo from '../src/components/demos/ParametricDerivativeDemo.vue'
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

describe('parametric derivative demo', () => {
  it('combines the two parameter rates into the tangent slope', async () => {
    wrapper = mount(ParametricDerivativeDemo)

    expect(wrapper.find('.parametric-point').exists()).toBe(true)
    expect(wrapper.findAll('.parameter-rate')).toHaveLength(2)
    expect(formulaSources().some((tex) => tex.includes('\\frac{dy}{dx}') && tex.endsWith('=-1'))).toBe(true)
    expect(wrapper.find('#parametric-result').text()).toContain('每单位 x')

    await buttonWithText('π/2').trigger('click')
    expect(formulaSources().some((tex) => tex.includes('\\frac{dy}{dx}') && tex.endsWith('=0'))).toBe(true)
  })

  it('treats dx/dt equal to zero as a vertical tangent instead of infinity', async () => {
    wrapper = mount(ParametricDerivativeDemo)

    await buttonWithText('0').trigger('click')

    expect(formulaSources().some((tex) => tex.includes('不能得到有限实数'))).toBe(true)
    expect(formulaSources().some((tex) => tex.includes('Infinity'))).toBe(false)
    expect(wrapper.find('#parametric-result').text()).toContain('竖直切线')
    expect(wrapper.find('.parametric-tangent').exists()).toBe(true)
  })
})
