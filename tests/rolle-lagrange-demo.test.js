import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RolleLagrangeDemo from '../src/components/demos/RolleLagrangeDemo.vue'

describe('Rolle-to-Lagrange demo', () => {
  it('starts from equal endpoints and a horizontal tangent', () => {
    const wrapper = mount(RolleLagrangeDemo)
    const left = wrapper.find('.rolle-lagrange-left-endpoint')
    const right = wrapper.find('.rolle-lagrange-right-endpoint')
    const chord = wrapper.find('.rolle-lagrange-chord')
    const tangent = wrapper.find('.rolle-lagrange-tangent')

    expect(left.attributes('cy')).toBe(right.attributes('cy'))
    expect(Number(chord.attributes('data-slope'))).toBe(0)
    expect(Number(tangent.attributes('data-slope'))).toBe(0)
    expect(wrapper.text()).toContain('水平切线')
  })

  it('keeps the secant and tangent slopes equal while flattening', async () => {
    const wrapper = mount(RolleLagrangeDemo)
    await wrapper.find('[data-stage="flatten"]').trigger('click')
    await wrapper.find('#rolle-progress-range').setValue(0.4)

    const chordSlope = Number(wrapper.find('.rolle-lagrange-chord').attributes('data-slope'))
    const tangentSlope = Number(wrapper.find('.rolle-lagrange-tangent').attributes('data-slope'))
    expect(chordSlope).toBeCloseTo(0.24)
    expect(tangentSlope).toBeCloseTo(chordSlope)
    expect(wrapper.html()).not.toMatch(/NaN|Infinity|katex-error/)

    await wrapper.find('#rolle-progress-range').setValue(1)
    expect(Number(wrapper.find('.rolle-lagrange-chord').attributes('data-slope'))).toBeCloseTo(0)
    expect(wrapper.find('.rolle-lagrange-left-endpoint').attributes('cy'))
      .toBe(wrapper.find('.rolle-lagrange-right-endpoint').attributes('cy'))
  })

  it('keeps actual SVG distances and angles under the rigid rotation', async () => {
    const wrapper = mount(RolleLagrangeDemo)
    const point = (selector) => {
      const element = wrapper.find(selector)
      return {
        x: Number(element.attributes('cx')),
        y: Number(element.attributes('cy')),
      }
    }
    const segment = (selector) => {
      const element = wrapper.find(selector)
      return {
        start: {
          x: Number(element.attributes('x1')),
          y: Number(element.attributes('y1')),
        },
        end: {
          x: Number(element.attributes('x2')),
          y: Number(element.attributes('y2')),
        },
      }
    }
    const distance = (first, second) => Math.hypot(first.x - second.x, first.y - second.y)
    const length = (line) => distance(line.start, line.end)
    const screenSlope = (line) => (
      (line.end.y - line.start.y) / (line.end.x - line.start.x)
    )
    const initialLeft = point('.rolle-lagrange-left-endpoint')
    const initialRight = point('.rolle-lagrange-right-endpoint')
    const initialMean = point('.rolle-lagrange-mean-point')
    const initialTangent = segment('.rolle-lagrange-tangent')
    const initialChordLength = distance(initialLeft, initialRight)
    const initialMeanDistance = distance(initialLeft, initialMean)

    await wrapper.find('[data-stage="rotate"]').trigger('click')
    await wrapper.find('#rolle-progress-range').setValue(1)

    const chordSlope = Number(wrapper.find('.rolle-lagrange-chord').attributes('data-slope'))
    const tangentSlope = Number(wrapper.find('.rolle-lagrange-tangent').attributes('data-slope'))
    const rotatedLeft = point('.rolle-lagrange-left-endpoint')
    const rotatedRight = point('.rolle-lagrange-right-endpoint')
    const rotatedMean = point('.rolle-lagrange-mean-point')
    const rotatedChord = segment('.rolle-lagrange-chord')
    const rotatedTangent = segment('.rolle-lagrange-tangent')

    expect(chordSlope).toBeCloseTo(0.4)
    expect(tangentSlope).toBeCloseTo(chordSlope)
    expect(rotatedLeft.x).toBeCloseTo(initialLeft.x)
    expect(rotatedLeft.y).toBeCloseTo(initialLeft.y)
    expect(distance(rotatedLeft, rotatedRight)).toBeCloseTo(initialChordLength)
    expect(distance(rotatedLeft, rotatedMean)).toBeCloseTo(initialMeanDistance)
    expect(length(rotatedTangent)).toBeCloseTo(length(initialTangent))
    expect(screenSlope(rotatedChord)).toBeCloseTo(screenSlope(rotatedTangent))
    expect(Math.atan2(
      -(rotatedRight.y - rotatedLeft.y),
      rotatedRight.x - rotatedLeft.x,
    )).toBeCloseTo(Math.atan(0.4))
    expect(wrapper.text()).toContain('不充当拉格朗日中值定理的正式证明')
  })
})
