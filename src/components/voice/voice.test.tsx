import { render, fireEvent } from '@testing-library/react'
import Voice from './Voice'
import { voice } from '../../types/voice'

const baseVoice: voice = {
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

  activeNotes: ['1'],
  activeOctaves: ['0'],
  activeWaveforms: ['sine'],
  activeIntervals: ['1'],

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
    const setVoices = jest.fn()

    const { getByTitle } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    fireEvent.change(getByTitle('BPM'), { target: { value: '140' } })

    expect(setVoices).toHaveBeenCalled()
  })

  test('updates label when input changes', () => {
    const setVoices = jest.fn()

    const { getByTitle } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    fireEvent.change(getByTitle('Label'), {
      target: { value: '42' }
    })

    expect(setVoices).toHaveBeenCalledWith([
      expect.objectContaining({
        label: 42
      })
    ])
  })

  test('adds octave when checkbox is checked', () => {
    const setVoices = jest.fn()

    baseVoice.activeOctaves = []

    const { container } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    const octaveCheckbox = container.querySelector('.Octaves0') as HTMLInputElement

    fireEvent.click(octaveCheckbox)

    const updated = setVoices.mock.calls[0][0]
    expect(updated[0].activeOctaves).toContain('0')
  })

  test('removes octave when checkbox is unchecked', () => {
    const setVoices = jest.fn()

    baseVoice.activeOctaves = ['0']

    const { container } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}        
        handleDelete={jest.fn()}
      />
    )

    const octaveCheckbox = container.querySelector('.octave0') as HTMLInputElement

    fireEvent.click(octaveCheckbox)

    const updated = setVoices.mock.calls[0][0]

    expect(updated[0].activeOctaves).not.toContain('0')
  })

  test('adds wave shape when checkbox is checked', () => {
    const setVoices = jest.fn()

    baseVoice.activeWaveforms = []
    
    const { container } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    const waveCheckbox = container.querySelector('.wave0') as HTMLInputElement

    fireEvent.click(waveCheckbox)

    const updated = setVoices.mock.calls[0][0]

    expect(updated[0].activeWaveforms.length).toBe(1)
    expect(updated[0].activeWaveforms).toContain('sine')
  })

  test('removes wave shape when checkbox is unchecked', () => {
    const setVoices = jest.fn()

    baseVoice.activeWaveforms = ['sine']

    const { container } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    const waveCheckbox = container.querySelector('.wave0') as HTMLInputElement

    fireEvent.click(waveCheckbox)

    const updated = setVoices.mock.calls[0][0]

    expect(updated[0].activeWaveforms).not.toContain('sine')
  })

  test('adds interval when checkbox is checked', () => {
    const setVoices = jest.fn()

    baseVoice.activeIntervals = []

    const { container } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    const intervalCheckbox = container.querySelector('.interval0') as HTMLInputElement

    fireEvent.click(intervalCheckbox)

    const updated = setVoices.mock.calls[0][0]

    expect(updated[0].activeIntervals).toContain('1')
  })

  test('removes interval when checkbox is unchecked', () => {
    const setVoices = jest.fn()

    baseVoice.activeIntervals = ['1']

    const { container } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    const intervalCheckbox = container.querySelector('.interval0') as HTMLInputElement

    fireEvent.click(intervalCheckbox)

    const updated = setVoices.mock.calls[0][0]

    expect(updated[0].activeIntervals).not.toContain('1')
  })

  test('toggles note checkbox', () => {
    const setVoices = jest.fn()

    const { container } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={setVoices}
        voices={[baseVoice]}
        handleDelete={jest.fn()}
      />
    )

    const noteCheckbox = container.querySelector('.note0') as HTMLInputElement

    fireEvent.click(noteCheckbox)

    expect(setVoices).toHaveBeenCalled()
  })

  test('delete button calls handler', () => {
    const handleDelete = jest.fn()

    const { getByText } = render(
      <Voice
        voice={baseVoice}
        i={0}
        setVoices={jest.fn()}
        voices={[baseVoice]}
        handleDelete={handleDelete}
      />
    )

    fireEvent.click(getByText('X'))

    expect(handleDelete).toHaveBeenCalledWith(0, expect.anything())
  })
})
