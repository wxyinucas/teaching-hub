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

function xAxisTickLabels() {
  return wrapper.findAll('.axis-labels .tick-mark').map((tick) => tick.element.nextElementSibling.textContent)
}

describe('derivative microscope demo', () => {
  it('starts with a positive-half-axis view without changing the signed increment range', () => {
    wrapper = mount(DerivativeMicroscopeDemo)

    expect(wrapper.find('.derivative-function-curve').attributes('d')).toMatch(/^M 74\.00 450\.00 /)
    expect(xAxisTickLabels()).toEqual(['0', '0.5', '1', '1.5', '2', '2.5'])
    expect(wrapper.find('#derivative-base-point').attributes()).toMatchObject({ min: '0', max: '1.5', step: '0.1' })
    expect(wrapper.find('#derivative-delta-x-range').attributes()).toMatchObject({ min: '0', max: '17' })
    expect(wrapper.find('.range-ends').text()).toContain('−1.5')
    expect(buttonWithText('显示负半轴').attributes('aria-pressed')).toBe('false')
    expect(buttonWithText('x₀ = -1')).toBeUndefined()
    expect(buttonWithText('x₀ = 0.5')).toBeDefined()
  })

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
    await buttonWithText('显示负半轴').trigger('click')

    expect(wrapper.findAll('.derivative-secant')).toHaveLength(2)
    expect(wrapper.find('.derivative-tangent').exists()).toBe(false)
    expect(wrapper.findAll('.approach-callouts text')).toHaveLength(2)
    expect(wrapper.findAll('.map-open-point')).toHaveLength(2)
    expect(wrapper.find('.map-current-point').exists()).toBe(false)
    expect(wrapper.find('.derivative-warning').text()).toContain('左右结果不同')
    expect(formulaSources()).toContain("f'_-(0)=-1,\\qquad f'_+(0)=1")
  })

  it('adds a differential layer within the existing controls and graph', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)

    await buttonWithText('4 · 看微分').trigger('click')

    expect(wrapper.findAll('input[type="range"]')).toHaveLength(2)
    expect(wrapper.find('#derivative-base-point').attributes()).toMatchObject({ min: '0', max: '1.5', step: '0.1' })
    expect(wrapper.findAll('.derivative-secant')).toHaveLength(0)
    expect(wrapper.find('.derivative-tangent').exists()).toBe(true)
    expect(wrapper.find('.derivative-map-card').exists()).toBe(false)
    expect(wrapper.find('.derivative-prediction').exists()).toBe(true)
    expect(wrapper.find('.derivative-differential').exists()).toBe(true)
    expect(wrapper.find('.derivative-remainder').exists()).toBe(true)
    expect(formulaSources()).toContain("dy=f'(x_0)dx=1.5")
    expect(formulaSources()).toContain('R=\\Delta y-dy=0.5625')
    expect(formulaSources()).toContain('\\frac{R}{\\Delta x}=0.75')
    expect(formulaSources().some((tex) => tex.includes('f(x_0)+dy&=2.5') && tex.includes('f(x_0+\\Delta x)&=3.0625'))).toBe(true)

    await buttonWithText('2 · 看比值').trigger('click')
    expect(wrapper.find('.derivative-prediction').exists()).toBe(false)
    expect(wrapper.find('.differential-readout').exists()).toBe(false)
    expect(wrapper.findAll('.derivative-secant')).toHaveLength(1)
  })

  it('keeps the remainders for small positive and negative increments visible without rounding them to zero', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('4 · 看微分').trigger('click')
    await wrapper.find('#derivative-delta-x-range').setValue('9')

    expect(formulaSources()).toContain('\\Delta x=0.01,\\quad \\Delta y=0.0201')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=0.02")
    expect(formulaSources()).toContain('R=\\Delta y-dy=0.0001')
    expect(formulaSources()).toContain('\\frac{R}{\\Delta x}=0.01')
    expect(wrapper.find('.derivative-q-label').exists()).toBe(false)

    await wrapper.find('#derivative-delta-x-range').setValue('8')
    expect(formulaSources()).toContain('\\Delta x=-0.01,\\quad \\Delta y=-0.0199')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=-0.02")
    expect(formulaSources()).toContain('R=\\Delta y-dy=0.0001')
    expect(formulaSources()).toContain('\\frac{R}{\\Delta x}=-0.01')
    expect(wrapper.findAll('.katex-error')).toHaveLength(0)
  })

  it('shows a zero differential but nonzero true change at a horizontal tangent', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('4 · 看微分').trigger('click')
    await buttonWithText('x₀ = 0').trigger('click')
    await wrapper.find('#derivative-delta-x-range').setValue('9')

    expect(formulaSources()).toContain('\\Delta x=0.01,\\quad \\Delta y=0.0001')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=0")
    expect(formulaSources()).toContain('R=\\Delta y-dy=0.0001')
    expect(wrapper.find('#derivative-result').text()).toContain('dy = 0')
    expect(wrapper.find('.derivative-remainder').attributes('y1')).not.toBe(wrapper.find('.derivative-remainder').attributes('y2'))
    expect(formulaSources().every((tex) => !tex.includes('\\Delta y}{dy}'))).toBe(true)
  })

  it('does not invent a differential at the absolute-value corner', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('4 · 看微分').trigger('click')
    await buttonWithText('|x|').trigger('click')
    await buttonWithText('x₀ = 0').trigger('click')

    expect(wrapper.find('.derivative-tangent').exists()).toBe(false)
    expect(wrapper.find('.derivative-prediction').exists()).toBe(false)
    expect(wrapper.find('.derivative-remainder').exists()).toBe(false)
    expect(wrapper.find('.differential-readout').text()).toContain('原点不可导，也不可微')
    expect(formulaSources().some((tex) => tex.startsWith('dy='))).toBe(false)
    expect(wrapper.html()).not.toMatch(/NaN|Infinity|katex-error/)

    await buttonWithText('x₀ = 1').trigger('click')
    await wrapper.find('#derivative-delta-x-range').setValue('8')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=-0.01")
    expect(formulaSources()).toContain('R=\\Delta y-dy=0')
    expect(wrapper.find('.derivative-prediction').exists()).toBe(true)

    await wrapper.find('#derivative-delta-x-range').setValue('0')
    expect(formulaSources()).toContain('R=\\Delta y-dy=1')
    expect(wrapper.find('.derivative-warning').text()).toContain('跨过了尖点')
  })

  it('keeps a negative increment visible when its endpoint remains on the positive half-axis', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('4 · 看微分').trigger('click')
    await wrapper.find('#derivative-delta-x-range').setValue('5')

    expect(buttonWithText('显示负半轴').attributes('aria-pressed')).toBe('false')
    expect(formulaSources()).toContain('\\Delta x=-0.1,\\quad \\Delta y=-0.19')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=-0.2")
    expect(formulaSources()).toContain('R=\\Delta y-dy=0.01')
    expect(wrapper.find('.derivative-q').exists()).toBe(true)
    expect(wrapper.find('.derivative-prediction').exists()).toBe(true)
    expect(Number(wrapper.find('.derivative-q').attributes('cx'))).toBeGreaterThan(74)
    expect(Number(wrapper.find('.derivative-q').attributes('cx'))).toBeLessThan(918)
    expect(wrapper.findAll('.microscope-view-note')).toHaveLength(0)
  })

  it('hides offscreen Q and T without clamping their coordinates or discarding their values', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('4 · 看微分').trigger('click')
    await wrapper.find('#derivative-delta-x-range').setValue('0')

    expect(wrapper.find('.derivative-q').exists()).toBe(false)
    expect(wrapper.find('.derivative-q-label').exists()).toBe(false)
    expect(wrapper.find('.derivative-prediction').exists()).toBe(false)
    expect(wrapper.find('.derivative-prediction-label').exists()).toBe(false)
    expect(wrapper.find('.differential-geometry').exists()).toBe(false)
    expect(formulaSources()).toContain('\\Delta x=-1.5,\\quad \\Delta y=-0.75')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=-3")
    expect(formulaSources()).toContain('R=\\Delta y-dy=2.25')
    expect(formulaSources().some((tex) => tex.includes('f(x_0)+dy&=-2') && tex.includes('f(x_0+\\Delta x)&=0.25'))).toBe(true)
    expect(wrapper.find('.microscope-view-note').text()).toContain('Q 在当前视野之外')
    expect(wrapper.find('.derivative-function-curve').element.parentElement.getAttribute('clip-path')).toBe('url(#derivative-microscope-clip)')

    await wrapper.find('#derivative-base-point').setValue('1.5')
    await wrapper.find('#derivative-delta-x-range').setValue('17')
    expect(wrapper.find('.derivative-q').exists()).toBe(false)
    expect(wrapper.find('.derivative-prediction').exists()).toBe(false)
    expect(formulaSources()).toContain('\\Delta x=1.5,\\quad \\Delta y=6.75')
    expect(formulaSources().some((tex) => tex.includes('f(x_0+\\Delta x)&=9'))).toBe(true)
  })

  it('checks the vertical bounds of the prediction independently of the real point', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('4 · 看微分').trigger('click')
    await wrapper.find('#derivative-delta-x-range').setValue('1')

    expect(wrapper.find('.derivative-q').exists()).toBe(true)
    expect(Number(wrapper.find('.derivative-q').attributes('cx'))).toBe(74)
    expect(wrapper.find('.derivative-prediction').exists()).toBe(false)
    expect(wrapper.find('.derivative-prediction-label').exists()).toBe(false)
    expect(wrapper.find('.microscope-view-note').text()).toContain('切线预测点 T 在当前视野之外')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=-2")
    expect(formulaSources()).toContain('R=\\Delta y-dy=1')
    expect(formulaSources().some((tex) => tex.includes('f(x_0)+dy&=-1') && tex.includes('f(x_0+\\Delta x)&=0'))).toBe(true)
  })

  it('restores negative base points in the full view and announces resetting a negative base when closing it', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('4 · 看微分').trigger('click')
    await buttonWithText('显示负半轴').trigger('click')

    expect(buttonWithText('显示负半轴').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('#derivative-base-point').attributes('min')).toBe('-1.5')
    expect(xAxisTickLabels()).toEqual(['-2', '-1', '0', '1', '2'])
    expect(buttonWithText('x₀ = 0.5')).toBeUndefined()
    await buttonWithText('x₀ = -1').trigger('click')
    expect(wrapper.find('#derivative-base-point').element.value).toBe('-1')
    expect(formulaSources()).toContain("f'(-1)=2\\cdot-1=-2")
    expect(wrapper.find('.derivative-q').exists()).toBe(true)

    await buttonWithText('显示负半轴').trigger('click')
    expect(wrapper.find('#derivative-base-point').attributes('min')).toBe('0')
    expect(wrapper.find('#derivative-base-point').element.value).toBe('0')
    expect(buttonWithText('x₀ = -1')).toBeUndefined()
    expect(wrapper.find('[role="status"]').text()).toContain('基点已回到 x₀ = 0')
    expect(formulaSources()).toContain("dy=f'(x_0)dx=0")
    expect(formulaSources()).toContain('\\Delta x=0.75,\\quad \\Delta y=0.5625')
  })

  it('keeps both one-sided slopes in the readout and reveals both points on request', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('|x|').trigger('click')
    await buttonWithText('x₀ = 0').trigger('click')
    await buttonWithText('3 · 看极限').trigger('click')

    expect(wrapper.findAll('.derivative-q')).toHaveLength(1)
    expect(wrapper.findAll('.observation-values')).toHaveLength(2)
    expect(formulaSources()).toContain('\\frac{\\Delta y}{\\Delta x}=-1')
    expect(formulaSources()).toContain('\\frac{\\Delta y}{\\Delta x}=1')
    expect(wrapper.find('.microscope-view-note').text()).toContain('左侧点在正半轴视野之外')
    expect(wrapper.findAll('.approach-callouts text')).toHaveLength(0)

    await buttonWithText('显示负半轴').trigger('click')
    expect(wrapper.findAll('.derivative-q')).toHaveLength(2)
    expect(wrapper.findAll('.approach-callouts text')).toHaveLength(2)
    expect(wrapper.find('.microscope-view-note').exists()).toBe(false)
    expect(wrapper.find('.derivative-tangent').exists()).toBe(false)
  })

  it('matches the derivative-map view to the main-graph view for both functions', async () => {
    wrapper = mount(DerivativeMicroscopeDemo)
    await buttonWithText('3 · 看极限').trigger('click')

    const positiveMapPath = wrapper.find('.map-curve').attributes('d').split(' ')
    expect(positiveMapPath.slice(0, 2)).toEqual(['M', '38'])
    expect(Number(positiveMapPath[2])).toBeCloseTo(Number(wrapper.findAll('.map-axis')[0].attributes('y1')))
    expect(wrapper.findAll('.map-axis')[1].attributes('x1')).toBe('38')
    expect(Number(wrapper.find('.map-current-point').attributes('cx'))).toBeCloseTo(226.75)

    await buttonWithText('显示负半轴').trigger('click')
    expect(wrapper.findAll('.map-axis')[1].attributes('x1')).toBe('189')
    expect(Number(wrapper.find('.map-current-point').attributes('cx'))).toBeCloseTo(283.375)
    const fullMapPath = wrapper.find('.map-curve').attributes('d').split(' ')
    expect(Number(fullMapPath[2])).not.toBeCloseTo(Number(wrapper.findAll('.map-axis')[0].attributes('y1')))

    await buttonWithText('|x|').trigger('click')
    expect(wrapper.findAll('.map-curve')).toHaveLength(2)
    expect(wrapper.findAll('.map-open-point')).toHaveLength(2)
    await buttonWithText('显示负半轴').trigger('click')
    expect(wrapper.findAll('.map-curve')).toHaveLength(1)
    expect(wrapper.findAll('.map-open-point')).toHaveLength(1)
    expect(wrapper.find('.map-open-point').attributes('cx')).toBe('38')
  })
})
