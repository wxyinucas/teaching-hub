import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MathFormula from '../src/components/MathFormula.vue'
import SequenceLimitDemo from '../src/components/demos/SequenceLimitDemo.vue'
import {
  halvingSequenceTerm,
  oscillatingSequenceTerm,
  minimumStrictTailN,
  sufficientOscillatingTailN,
} from '../src/lib/sequence-limit.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

describe('halving-sequence ε–N demo', () => {
  it('finds the minimum N for the strict n > N convention', () => {
    expect(minimumStrictTailN(0.3)).toBe(1)
    expect(minimumStrictTailN(0.1)).toBe(3)
    expect(minimumStrictTailN(0.02)).toBe(5)
    expect(minimumStrictTailN(0.125)).toBe(3)
    expect(minimumStrictTailN(0.13)).toBe(2)
    expect(halvingSequenceTerm(3)).toBe(0.125)
    expect(() => minimumStrictTailN(0)).toThrow('ε 必须是正的有限数')
  })

  it('moves the threshold and highlights exactly the terms with n > N', async () => {
    wrapper = mount(SequenceLimitDemo)
    expect(wrapper.find('.demo-result').text()).toContain('N = 3')
    expect(wrapper.find('[data-n="3"]').attributes('data-in-tail')).toBe('false')
    expect(wrapper.find('[data-n="4"]').attributes('data-in-tail')).toBe('true')

    await wrapper.find('#epsilon-range').setValue('0.05')
    expect(wrapper.find('.demo-result').text()).toContain('N = 4')
    expect(wrapper.find('[data-n="4"]').attributes('data-in-tail')).toBe('false')
    expect(wrapper.find('[data-n="5"]').attributes('data-in-tail')).toBe('true')
  })

  it('uses a simple sufficient N for the oscillating sequence', () => {
    expect(oscillatingSequenceTerm(1)).toBe(0)
    expect(oscillatingSequenceTerm(2)).toBe(1.5)
    expect(sufficientOscillatingTailN(0.25)).toBe(4)
    expect(sufficientOscillatingTailN(0.3)).toBe(4)
    expect(() => sufficientOscillatingTailN(Number.NaN)).toThrow('ε 必须是正的有限数')
  })

  it('reveals the quantifiers in order and resets after ε changes', async () => {
    wrapper = mount(SequenceLimitDemo)
    await wrapper.findAll('.demo-scene-nav button')[1].trigger('click')

    expect(wrapper.find('#oscillation-limit-title').text()).toBe('波动也可以收敛')
    expect(wrapper.find('.oscillation-curve').exists()).toBe(true)
    expect(wrapper.find('.threshold-line').exists()).toBe(false)

    const steps = wrapper.findAll('.quantifier-steps button')
    expect(steps[2].attributes('disabled')).toBeDefined()
    await steps[1].trigger('click')
    expect(wrapper.find('.threshold-line').exists()).toBe(true)
    expect(wrapper.find('.quantifier-result .katex').exists()).toBe(true)
    expect(wrapper.findAllComponents(MathFormula).some((formula) => formula.props('tex') === 'N=4')).toBe(true)

    await steps[2].trigger('click')
    expect(wrapper.find('[data-oscillation-n="4"]').attributes('data-in-tail')).toBe('false')
    expect(wrapper.find('[data-oscillation-n="5"]').attributes('data-in-tail')).toBe('true')
    const resultFormula = wrapper.findAllComponents(MathFormula).find((formula) => (
      formula.classes().includes('result-formula')
    ))
    expect(resultFormula.props('tex')).toContain('\\lvert a_n-1\\rvert')

    await wrapper.find('#oscillating-epsilon-range').setValue('0.2')
    expect(wrapper.find('.threshold-line').exists()).toBe(false)
    expect(wrapper.findAll('.quantifier-steps button')[2].attributes('disabled')).toBeDefined()
    expect(wrapper.findAllComponents(MathFormula).some((formula) => (
      formula.props('tex') === '\\varepsilon=0.20'
    ))).toBe(true)
  })
})
