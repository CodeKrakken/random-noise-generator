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
