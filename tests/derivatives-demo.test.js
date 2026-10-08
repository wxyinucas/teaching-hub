import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DerivativesDemo from '../src/components/demos/DerivativesDemo.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

describe('derivatives topic demo', () => {
  it('keeps all T03 scenes behind one internal scene switcher', async () => {
    wrapper = mount(DerivativesDemo)

    const tabs = wrapper.findAll(':scope > .demo-scene-nav button')
    expect(tabs).toHaveLength(2)
    expect(wrapper.find('.derivative-microscope-demo').exists()).toBe(true)
    expect(wrapper.find('.parametric-derivative-demo').exists()).toBe(false)

    await tabs[1].trigger('click')
    expect(wrapper.find('.derivative-microscope-demo').exists()).toBe(false)
    expect(wrapper.find('.parametric-derivative-demo').exists()).toBe(true)

    await tabs[0].trigger('click')
    expect(wrapper.find('.derivative-microscope-demo').exists()).toBe(true)
  })
})
