import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PolarCoordinatesDemo from '../src/components/demos/PolarCoordinatesDemo.vue'
import MathFormula from '../src/components/MathFormula.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

function buttonWithText(text) {
  return wrapper.findAll('button').find((button) => button.text() === text)
}

function formulas() {
  return wrapper.findAllComponents(MathFormula).map((formula) => formula.props('tex'))
}

async function useCurve(id) {
  await buttonWithText('限制在曲线上 · 一个自由度').trigger('click')
  await wrapper.find('#polar-curve-select').setValue(id)
}

describe('polar coordinates demo', () => {
  it('starts with two independent sliders and synchronizes both coordinate readouts', async () => {
    wrapper = mount(PolarCoordinatesDemo)
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(2)

    await wrapper.find('#polar-radius-range').setValue('3')
    await buttonWithText('π/2').trigger('click')

    expect(formulas()).toContain(String.raw`\left\{\begin{aligned}x&=0\\y&=3\end{aligned}\right.`)
    expect(formulas().some((tex) => tex.includes('r&=3'))).toBe(true)
    expect(wrapper.find('#polar-result').text()).toContain('两个独立的数')
  })

  it('shows a full turn as the same direction and treats the origin separately', async () => {
    wrapper = mount(PolarCoordinatesDemo)
    await buttonWithText('2π').trigger('click')
    expect(formulas().some((tex) => tex.includes(String.raw`\theta&=0`))).toBe(true)

    await wrapper.find('#polar-radius-range').setValue('0')
    expect(formulas()).toContain(String.raw`r=0,\quad\theta\text{ 任意}`)
    expect(wrapper.find('.polar-origin-note').exists()).toBe(true)
    expect(wrapper.find('.polar-angle-arc').exists()).toBe(false)
    await buttonWithText('π').trigger('click')
    expect(wrapper.find('.polar-point').attributes('cx')).toBe('320')
    expect(wrapper.find('.polar-point').attributes('cy')).toBe('320')
  })

  it('uses only one slider for a selected curve and separates cumulative turns from direction', async () => {
    wrapper = mount(PolarCoordinatesDemo)
    await useCurve('spiral')
    expect(wrapper.findAll('input[type="range"]')).toHaveLength(1)
    expect(wrapper.find('#polar-radius-range').exists()).toBe(false)
    expect(wrapper.find('.polar-whole-curve').exists()).toBe(true)
    await buttonWithText('2π').trigger('click')
    const firstPath = wrapper.find('.polar-traced-curve').attributes('d')
    expect(formulas().some((tex) => tex.includes('r&=2'))).toBe(true)
    expect(formulas().some((tex) => tex.includes(String.raw`\theta&=0`))).toBe(true)

    await buttonWithText('4π').trigger('click')
    expect(formulas().some((tex) => tex.includes('r&=4'))).toBe(true)
    expect(formulas().some((tex) => tex.includes(String.raw`\theta&=0`))).toBe(true)
    expect(wrapper.find('.polar-traced-curve').attributes('d')).not.toBe(firstPath)
    expect(wrapper.find('#polar-result').text()).toContain('只选一个 t')
    expect(wrapper.findAll('.katex-error')).toHaveLength(0)
  })

  it('retains the curve parameter when the cardioid passes through the origin', async () => {
    wrapper = mount(PolarCoordinatesDemo)
    await useCurve('cardioid')
    await buttonWithText('π').trigger('click')

    expect(formulas()).toContain(String.raw`t=3.142\ \mathrm{rad}`)
    expect(formulas()).toContain(String.raw`r=0,\quad\theta\text{ 任意}`)
    expect(wrapper.find('.polar-traced-curve').attributes('d')).not.toMatch(/NaN|Infinity/)
    expect(wrapper.findAll('.katex-error')).toHaveLength(0)
  })

  it('converts a dragged Cartesian location back into polar controls', async () => {
    wrapper = mount(PolarCoordinatesDemo)
    const svg = wrapper.find('svg')
    svg.element.getBoundingClientRect = () => ({ left: 0, top: 0, width: 640, height: 640 })
    svg.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 196, clientY: 196, button: 0, bubbles: true }))
    await nextTick()

    expect(formulas()).toContain(String.raw`\left\{\begin{aligned}x&=-2\\y&=2\end{aligned}\right.`)
    expect(Number(wrapper.find('#polar-radius-range').element.value)).toBeCloseTo(Math.sqrt(8), 2)
    expect(Number(wrapper.find('#polar-angle-range').element.value)).toBeCloseTo(3 * Math.PI / 4, 2)
    await svg.trigger('pointerup')
    svg.element.dispatchEvent(new MouseEvent('pointermove', { clientX: 320, clientY: 320, bubbles: true }))
    await nextTick()
    expect(formulas().some((tex) => tex.includes('x&=-2'))).toBe(true)
  })

  it('accounts for SVG scaling and letterboxing and ignores dragging in curve mode', async () => {
    wrapper = mount(PolarCoordinatesDemo)
    const svg = wrapper.find('svg')
    svg.element.getBoundingClientRect = () => ({ left: 20, top: 30, width: 400, height: 320 })
    // The square drawing is centered with a 40px horizontal inset, at half scale.
    svg.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 282, clientY: 190, button: 0, bubbles: true }))
    await nextTick()
    expect(formulas()).toContain(String.raw`\left\{\begin{aligned}x&=2\\y&=0\end{aligned}\right.`)

    await useCurve('circle')
    const initialPoint = wrapper.find('.polar-point').attributes()
    svg.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 220, clientY: 128, button: 0, bubbles: true }))
    await nextTick()
    expect(wrapper.find('.polar-point').attributes()).toEqual(initialPoint)
  })
})
