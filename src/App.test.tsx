import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import Node from './components/node/Node'

describe('header', () => {

  beforeEach(() => {
    const setValueAtTime = jest.fn()

    const mockGain = {
      gain: {
        setValueAtTime,
        linearRampToValueAtTime: jest.fn()
      },
      connect: jest.fn()
    }

    const mockOscillator = {
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      frequency: { value: 0 },
      type: 'sine'
    }

    global.AudioContext = jest.fn(() => ({
      createGain: () => mockGain,
      createOscillator: () => mockOscillator,
      createMediaElementSource: () => ({ connect: jest.fn() }),
      destination: {},
      currentTime: 0,
      resume: jest.fn()
    })) as any

    // expose for assertions
    ;(global as any).__setValueAtTime = setValueAtTime
  })

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  test('adds a node', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    expect(document.querySelector('.node')).toBeInTheDocument()
  })

  test('shows Start button after adding node', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  test('starts audio when Start clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.click(screen.getByText('Start'))

    // we can't easily inspect internals, but we can assert Stop appears
    expect(screen.getByText('Stop')).toBeInTheDocument()
  })

  test('stops audio when Stop clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.click(screen.getByText('Start'))
    fireEvent.click(screen.getByText('Stop'))

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  test('new node copies previous node settings', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.change(screen.getByTitle('BPM'), { target: { value: '200' } })

    fireEvent.click(screen.getByText('Add Node'))

    const inputs = document.querySelectorAll('[title="BPM"]')

    expect((inputs[1] as HTMLInputElement).value).toBe('200')
  })

  test('schedules interval loop', () => {
    jest.useFakeTimers()
    jest.spyOn(globalThis, 'setTimeout')

    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.click(screen.getByText('Start'))

    expect(globalThis.setTimeout).toHaveBeenCalled()
  })

  test('sets gain to 0 during rest', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.change(screen.getByTitle('Rest %'), {
      target: { value: '100' }
    })
    fireEvent.click(screen.getByText('Start'))

    const setValueAtTime = (global as any).__setValueAtTime

    expect(setValueAtTime).toHaveBeenCalledWith(0, 0)
  })

  test('covers recursive setTimeout scheduling branch', () => {
    jest.useFakeTimers()

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    // force a future nextInterval so we hit the ELSE branch
    const bpmInput = screen.getByTitle('BPM')
    fireEvent.change(bpmInput, { target: { value: '1' } }) // huge interval

    fireEvent.click(screen.getByText('Start'))

    // force timers to execute
    jest.runOnlyPendingTimers()

    expect(setTimeoutSpy).toHaveBeenCalled()
  })

  test('sets gain to 0 after noteLength timeout', () => {
    jest.useFakeTimers()

    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    fireEvent.change(screen.getByTitle('Rest %'), {
      target: { value: '0' }
    })

    fireEvent.change(screen.getByTitle('min length'), {
      target: { value: '10' }
    })
    fireEvent.change(screen.getByTitle('max length'), {
      target: { value: '10' }
    })

    fireEvent.click(screen.getByText('Start'))

    // advance just enough time to trigger the inner timeout
    jest.advanceTimersByTime(200)

    const setValueAtTime = (global as any).__setValueAtTime

    expect(setValueAtTime).toHaveBeenCalledWith(0, 0)
  })

  test('handles oscillator error and logs it', () => {
    jest.useFakeTimers()

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // force frequency assignment to throw
    const mockOscillator = {
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      type: 'sine',
      frequency: {}
    }

    Object.defineProperty(mockOscillator.frequency, 'value', {
      set: () => {
        throw new Error('frequency error')
      }
    })

    const mockGain = {
      gain: {
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn()
      },
      connect: jest.fn()
    }

    global.AudioContext = jest.fn(() => ({
      createGain: () => mockGain,
      createOscillator: () => mockOscillator,
      createMediaElementSource: () => ({ connect: jest.fn() }),
      destination: {},
      currentTime: 0,
      resume: jest.fn()
    })) as any

    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    // ensure it doesn't rest
    fireEvent.change(screen.getByTitle('Rest %'), {
      target: { value: '0' }
    })

    fireEvent.click(screen.getByText('Start'))

    jest.advanceTimersByTime(200)

    expect(errorSpy).toHaveBeenCalled()
  })

  test('handles sample playback error and logs it', () => {
    jest.useFakeTimers()

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // mock Audio to throw
    const playMock = jest.fn(() => {
      throw new Error('play failed')
    })

    global.Audio = jest.fn(() => ({
      play: playMock
    })) as any

    global.AudioContext = jest.fn(() => ({
      createGain: () => ({
        gain: {
          setValueAtTime: jest.fn(),
          linearRampToValueAtTime: jest.fn()
        },
        connect: jest.fn()
      }),
      createOscillator: () => ({
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        frequency: { value: 0 },
        type: 'sine'
      }),
      createMediaElementSource: () => ({ connect: jest.fn() }),
      destination: {},
      currentTime: 0,
      resume: jest.fn()
    })) as any

    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    fireEvent.change(screen.getByTitle('Rest %'), {
      target: { value: '0' }
    })

    // find the 'snare' checkbox specifically
    const snareCheckbox = [...document.querySelectorAll('.wave0')]
      .find(el => (el as HTMLInputElement).value === 'snare') as HTMLInputElement

    // uncheck others first (important)
    const allWaveCheckboxes = document.querySelectorAll('.wave0')
    allWaveCheckboxes.forEach(el => {
      if ((el as HTMLInputElement).checked) {
        fireEvent.click(el)
      }
    })

    fireEvent.click(snareCheckbox)

    fireEvent.click(screen.getByText('Start'))

    jest.advanceTimersByTime(200)

    expect(playMock).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
  })

  test('handleDelete sets node inactive via state update', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))
    fireEvent.click(screen.getByText('X'))

    // node should no longer be active in render tree
    expect(screen.queryByText('X')).not.toBeInTheDocument()
  })
})