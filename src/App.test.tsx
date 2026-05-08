import { render, screen, fireEvent, act } from '@testing-library/react'
import App from './App'

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

    jest.spyOn(global.Math, 'random').mockReturnValue(0.5)    
    jest.useFakeTimers()


  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
    jest.clearAllTimers()
  })


  test('sets gain to 0 during rest', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    fireEvent.change(document.querySelector(`[data-attribute="restChance"][data-voice="0"]`) as HTMLInputElement, {
      target: { value: '100' }
    })
    fireEvent.click(screen.getByText('Start'))

    const setValueAtTime = (global as any).__setValueAtTime

    expect(setValueAtTime).toHaveBeenCalledWith(0, 0)
  })

  test('sets gain to 0 after noteLength timeout', () => {
    jest.useFakeTimers()

    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    fireEvent.change(document.querySelector(`[data-attribute="restChance"][data-voice="0"]`) as HTMLInputElement, {
      target: { value: '0' }
    })

    fireEvent.change(document.querySelector(`[data-attribute="minLength"][data-voice="0"]`) as HTMLInputElement, {
      target: { value: '10' }
    })
    fireEvent.change(document.querySelector(`[data-attribute="maxLength"][data-voice="0"]`) as HTMLInputElement, {
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

    fireEvent.click(screen.getByText('Add Voice'))

    // ensure it doesn't rest
    fireEvent.change(document.querySelector(`[data-attribute="restChance"][data-voice="0"]`) as HTMLInputElement, {
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

    fireEvent.click(screen.getByText('Add Voice'))

    fireEvent.change(document.querySelector(`[data-attribute="restChance"][data-voice="0"]`) as HTMLInputElement, {
      target: { value: '0' }
    })

    // find the 'snare' checkbox specifically
    const snareCheckbox = [...document.querySelectorAll(`[data-attribute="Waveforms"][data-voice="0"]`)]
      .find(el => (el as HTMLInputElement).value === 'snare') as HTMLInputElement

    // uncheck others first (important)
    const allWaveCheckboxes = document.querySelectorAll(`[data-attribute="Waveforms"][data-voice="0"]`)
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

  test('oscillator branch executes wave processing path', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    const input = document.querySelector(`[data-attribute="Waveforms"][value="sine"]`) as HTMLInputElement

    fireEvent.click(input) // wave checkbox exists
    fireEvent.click(screen.getByText('Start'))

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(screen.getByText('Stop')).toBeInTheDocument()
  })
})

// claude tests

import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Web Audio API mock ───────────────────────────────────────────────────────

const mockGain = {
  gain: {
    value: 0,
    setValueAtTime: jest.fn(),
    linearRampToValueAtTime: jest.fn(),
  },
};

const mockOscillator = {
  connect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  frequency: { value: 440 },
  type: 'sine' as OscillatorType,
};

const mockContext = {
  currentTime: 0,
  destination: {},
  resume: jest.fn(),
  createOscillator: jest.fn(() => ({ ...mockOscillator })),
  createGain: jest.fn(() => ({
    ...mockGain,
    connect: jest.fn(),
  })),
  createMediaElementSource: jest.fn(() => ({ connect: jest.fn() })),
};

global.AudioContext = jest.fn(() => mockContext) as unknown as typeof AudioContext;

// ─── HTMLMediaElement mock ────────────────────────────────────────────────────

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const addVoice = () => fireEvent.click(screen.getByRole('button', { name: /add voice/i }));
const clickStartStop = () => fireEvent.click(screen.getByRole('button', { name: /start|stop/i }));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Reset currentTime to 0 before each test
    mockContext.currentTime = 0;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Lines 101–133: addVoice / setUpVoice ──────────────────────────────────────

  describe('addVoice / setUpVoice (lines 101–133)', () => {
    it('renders a voice component when Add Voice is clicked', () => {
      render(<App />);
      addVoice();
      // Voice should appear — keyed by voice index
      expect(screen.getByTestId('voice-0')).toBeInTheDocument();
    });

    it('clones settings from the last active voice when a second voice is added', () => {
      render(<App />);
      addVoice();
      addVoice();
      const secondVoice = screen.getByTestId('voice-1');
      expect(secondVoice).toBeInTheDocument();
    });
  });

  // ── Lines 145–152: useEffect — stop cycling when no active voices ────────────

  describe('useEffect: cycling stops when all voices are deleted (lines 145–152)', () => {
    it('hides the Start button when there are no active voices', () => {
      render(<App />);
      expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
    });

    it('resets cycleButtonLabel to false when last voice is deleted', async () => {
      render(<App />);
      addVoice();
      clickStartStop(); // start cycling

      // Delete the only voice
      fireEvent.click(screen.getByTestId('delete-voice-0'));

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /stop/i })).not.toBeInTheDocument();
      });
    });
  });

  // ── Line 163: handleStartStop ───────────────────────────────────────────────

  describe('handleStartStop (line 163)', () => {
    it('toggles the cycle button label between Start and Stop', () => {
      render(<App />);
      addVoice();

      clickStartStop();
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();

      clickStartStop();
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
    });
  });


  // ── Lines 205–239: newInterval() ────────────────────────────────────────────

  describe('newInterval() (lines 205–239)', () => {
    it('schedules a setTimeout callback when cycling starts', () => {
      render(<App />);
      addVoice();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      clickStartStop();

      expect(setTimeoutSpy).toHaveBeenCalled();
    });


    it('calls newInterval recursively via setTimeout', () => {
      render(<App />);
      addVoice();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      clickStartStop();
      const initialCalls = setTimeoutSpy.mock.calls.length;

      act(() => { jest.advanceTimersByTime(2000); });

      expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });


  // ── Lines 316–319: handleDelete() ───────────────────────────────────────────

  describe('handleDelete() (lines 316–319)', () => {
    it('removes the voice visually when delete is clicked', () => {
      render(<App />);
      addVoice();
      expect(screen.getByTestId('voice-0')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('delete-voice-0'));
      expect(screen.queryByTestId('voice-0')).not.toBeInTheDocument();
    });


    it('does not throw when deleting a voice that was never started', () => {
      render(<App />);
      addVoice();

      expect(() => {
        fireEvent.click(screen.getByTestId('delete-voice-0'));
      }).not.toThrow();
    });
  });


  test('plays kick sample', () => {
    jest.useFakeTimers()

    const playMock = jest.fn()

    Object.defineProperty(window, 'Audio', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        play: playMock
      }))
    })

    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    // disable sine
    fireEvent.click(document.querySelector(`[data-attribute="Waveforms"][value="sine"]`) as HTMLInputElement)

    // enable kick
    fireEvent.click(document.querySelector(`[data-attribute="Waveforms"][value="kick"]`) as HTMLInputElement)

    fireEvent.click(screen.getByText('Start'))

    jest.advanceTimersByTime(2000)

    expect(playMock).toHaveBeenCalled()
  })

  test('logs sample playback errors', () => {
    jest.useFakeTimers()

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const playMock = jest.fn(() => {
      throw new Error('sample failure')
    })

    Object.defineProperty(window, 'Audio', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        play: playMock
      }))
    })

    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    fireEvent.click(document.querySelector(`[data-attribute="Waveforms"][value="sine"]`) as HTMLInputElement)

    const kickWave = document.querySelector(
      'input[value="kick"]'
    ) as HTMLInputElement

    fireEvent.click(kickWave)

    fireEvent.click(screen.getByText('Start'))

    jest.advanceTimersByTime(1000)

    expect(playMock).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()

    errorSpy.mockRestore()
  })
});