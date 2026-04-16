import { render, fireEvent } from '@testing-library/react'
import Node from './Node'
import { node } from '../../types/node'

const baseNode: node = {
  isActive: true,
  label: 1,
  nextInterval: 0,
  thisInterval: 0,

  bpm: 120,
  minLevel: 10,
  maxLevel: 50,

  minNoteLength: 10,
  maxNoteLength: 50,

  rest: 0,

  minOffset: 0,
  maxOffset: 0,

  minDetune: 0,
  maxDetune: 0,

  minFadeIn: 0,
  maxFadeIn: 0,

  minFadeOut: 0,
  maxFadeOut: 0,

  activeNotes: [1],
  activeScales: [0],
  activeWaveShapes: ['sine'],
  activeIntervals: [1],

  // 👇 add these
  oscillator: undefined,
  gain: undefined,
}

describe('header', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('updates BPM input', () => {
    const setNodes = jest.fn()

    const { getByTitle } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    fireEvent.change(getByTitle('BPM'), { target: { value: '140' } })

    expect(setNodes).toHaveBeenCalled()
  })

  test('updates label when input changes', () => {
    const setNodes = jest.fn()

    const { getByTitle } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    fireEvent.change(getByTitle('Label'), {
      target: { value: '42' }
    })

    expect(setNodes).toHaveBeenCalledWith([
      expect.objectContaining({
        label: 42
      })
    ])
  })

  test('adds scale when checkbox is checked', () => {
    const setNodes = jest.fn()

    baseNode.activeScales = []

    const { container } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[1]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    const scaleCheckbox = container.querySelector('.scale0') as HTMLInputElement

    fireEvent.click(scaleCheckbox)

    const updated = setNodes.mock.calls[0][0]

    expect(updated[0].activeScales).toContain(1)
  })

  test('removes scale when checkbox is unchecked', () => {
    const setNodes = jest.fn()

    baseNode.activeScales = [1]

    const { container } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[1]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    const scaleCheckbox = container.querySelector('.scale0') as HTMLInputElement

    fireEvent.click(scaleCheckbox)

    const updated = setNodes.mock.calls[0][0]

    expect(updated[0].activeScales).not.toContain(1)
  })

  test('adds wave shape when checkbox is checked', () => {
    const setNodes = jest.fn()

    baseNode.activeWaveShapes = []
    
    const { container } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine', 'square']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    const waveCheckbox = container.querySelector('.wave0') as HTMLInputElement

    fireEvent.click(waveCheckbox)

    const updated = setNodes.mock.calls[0][0]

    expect(updated[0].activeWaveShapes.length).toBe(1)
    expect(updated[0].activeWaveShapes).toContain('sine')
  })

  test('removes wave shape when checkbox is unchecked', () => {
    const setNodes = jest.fn()

    baseNode.activeWaveShapes = ['sine']

    const { container } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine', 'square']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    const waveCheckbox = container.querySelector('.wave0') as HTMLInputElement

    fireEvent.click(waveCheckbox)

    const updated = setNodes.mock.calls[0][0]

    expect(updated[0].activeWaveShapes).not.toContain('sine')
  })

  test('adds interval when checkbox is checked', () => {
    const setNodes = jest.fn()

    baseNode.activeIntervals = []

    const { container } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    const intervalCheckbox = container.querySelector('.interval0') as HTMLInputElement

    fireEvent.click(intervalCheckbox)

    const updated = setNodes.mock.calls[0][0]

    expect(updated[0].activeIntervals).toContain(1)
  })

  test('removes interval when checkbox is unchecked', () => {
    const setNodes = jest.fn()

    baseNode.activeIntervals = [1]

    const { container } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    const intervalCheckbox = container.querySelector('.interval0') as HTMLInputElement

    fireEvent.click(intervalCheckbox)

    const updated = setNodes.mock.calls[0][0]

    expect(updated[0].activeIntervals).not.toContain(1)
  })

  test('toggles note checkbox', () => {
    const setNodes = jest.fn()

    const { container } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={setNodes}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={jest.fn()}
      />
    )

    const noteCheckbox = container.querySelector('.note0') as HTMLInputElement

    fireEvent.click(noteCheckbox)

    expect(setNodes).toHaveBeenCalled()
  })

  test('delete button calls handler', () => {
    const handleDelete = jest.fn()

    const { getByText } = render(
      <Node
        node={baseNode}
        i={0}
        setNodes={jest.fn()}
        nodes={[baseNode]}
        scales={[0]}
        notes={[1]}
        waveShapes={['sine']}
        intervals={[1]}
        handleDelete={handleDelete}
      />
    )

    fireEvent.click(getByText('X'))

    expect(handleDelete).toHaveBeenCalledWith(0, expect.anything())
  })
})
