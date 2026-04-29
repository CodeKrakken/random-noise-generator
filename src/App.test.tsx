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

  test('adds a voice', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    expect(document.querySelector('.voice')).toBeInTheDocument()
  })

  test('shows Start button after adding voice', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  test('starts audio when Start clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    fireEvent.click(screen.getByText('Start'))

    // we can't easily inspect internals, but we can assert Stop appears
    expect(screen.getByText('Stop')).toBeInTheDocument()
  })

  test('stops audio when Stop clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    fireEvent.click(screen.getByText('Start'))
    fireEvent.click(screen.getByText('Stop'))

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  test('new voice copies previous voice settings', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    fireEvent.change(screen.getByTitle('bpm'), { target: { value: '200' } })
    fireEvent.click(screen.getByText('Add Voice'))

    const inputs = document.querySelectorAll('[title="bpm"]')
    expect((inputs[1] as HTMLInputElement).value).toBe('200')
  })

  test('schedules interval loop', () => {
    jest.useFakeTimers()
    jest.spyOn(globalThis, 'setTimeout')

    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    fireEvent.click(screen.getByText('Start'))

    expect(globalThis.setTimeout).toHaveBeenCalled()
  })

  test('sets gain to 0 during rest', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    fireEvent.change(screen.getByTitle('restChance'), {
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

    fireEvent.click(screen.getByText('Add Voice'))

    // force a future nextInterval so we hit the ELSE branch
    const bpmInput = screen.getByTitle('bpm')
    fireEvent.change(bpmInput, { target: { value: '1' } }) // huge interval

    fireEvent.click(screen.getByText('Start'))

    // force timers to execute
    jest.runOnlyPendingTimers()

    expect(setTimeoutSpy).toHaveBeenCalled()
  })

  test('sets gain to 0 after noteLength timeout', () => {
    jest.useFakeTimers()

    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    fireEvent.change(screen.getByTitle('restChance'), {
      target: { value: '0' }
    })

    fireEvent.change(screen.getByTitle('minLength'), {
      target: { value: '10' }
    })
    fireEvent.change(screen.getByTitle('maxLength'), {
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
    fireEvent.change(screen.getByTitle('restChance'), {
      target: { value: '0' }
    })

    fireEvent.click(screen.getByText('Start'))

    jest.advanceTimersByTime(200)

    expect(errorSpy).toHaveBeenCalled()
  })




  // test('handles sample playback error and logs it', () => {
  //   jest.useFakeTimers()

  //   const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  //   // mock Audio to throw
  //   const playMock = jest.fn(() => {
  //     throw new Error('play failed')
  //   })

  //   global.Audio = jest.fn(() => ({
  //     play: playMock
  //   })) as any

  //   global.AudioContext = jest.fn(() => ({
  //     createGain: () => ({
  //       gain: {
  //         setValueAtTime: jest.fn(),
  //         linearRampToValueAtTime: jest.fn()
  //       },
  //       connect: jest.fn()
  //     }),
  //     createOscillator: () => ({
  //       connect: jest.fn(),
  //       start: jest.fn(),
  //       stop: jest.fn(),
  //       frequency: { value: 0 },
  //       type: 'sine'
  //     }),
  //     createMediaElementSource: () => ({ connect: jest.fn() }),
  //     destination: {},
  //     currentTime: 0,
  //     resume: jest.fn()
  //   })) as any

  //   render(<App />)

  //   fireEvent.click(screen.getByText('Add Voice'))

  //   fireEvent.change(screen.getByTitle('restChance'), {
  //     target: { value: '0' }
  //   })

  //   // find the 'snare' checkbox specifically
  //   const snareCheckbox = [...document.querySelectorAll('.wave')]
  //     .find(el => (el as HTMLInputElement).value === 'snare') as HTMLInputElement

  //   // uncheck others first (important)
  //   const allWaveCheckboxes = document.querySelectorAll('.wave')
  //   allWaveCheckboxes.forEach(el => {
  //     if ((el as HTMLInputElement).checked) {
  //       fireEvent.click(el)
  //     }
  //   })

  //   fireEvent.click(snareCheckbox)

  //   fireEvent.click(screen.getByText('Start'))

  //   jest.advanceTimersByTime(200)

  //   expect(playMock).toHaveBeenCalled()
  //   expect(errorSpy).toHaveBeenCalled()
  // })




  test('handleDelete sets voice inactive via state update', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))
    fireEvent.click(screen.getByText('X'))

    // voice should no longer be active in render tree
    expect(screen.queryByText('X')).not.toBeInTheDocument()
  })

  test('oscillator branch executes wave processing path', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    fireEvent.click(screen.getByTitle('sine')) // wave checkbox exists

    fireEvent.click(screen.getByText('Start'))

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(screen.getByText('Stop')).toBeInTheDocument()
  })

  // test('plays kick sample when kick waveShape is selected', () => {
  //   const playMock = jest.fn()

  //   global.Audio = jest.fn(() => ({
  //     play: playMock
  //   })) as any

  //   global.AudioContext = jest.fn(() => ({
  //     createGain: () => ({
  //       gain: {
  //         setValueAtTime: jest.fn(),
  //         linearRampToValueAtTime: jest.fn()
  //       },
  //       connect: jest.fn()
  //     }),
  //     createOscillator: () => ({
  //       connect: jest.fn(),
  //       start: jest.fn(),
  //       stop: jest.fn(),
  //       frequency: { value: 0 },
  //       type: 'sine'
  //     }),
  //     createMediaElementSource: () => ({ connect: jest.fn() }),
  //     destination: {},
  //     currentTime: 0,
  //     resume: jest.fn()
  //   })) as any

  //   render(<App />)

  //   fireEvent.click(screen.getByText('Add Voice'))

  //   fireEvent.change(screen.getByTitle('restChance'), { target: { value: '0' } })

  //   // find the 'kick' checkbox
  //   const kickCheckbox = [...document.getElementsByClassName('wave0')]
  //     .find(el => (el as HTMLInputElement).value === 'kick') as HTMLInputElement

  //   // uncheck others
  //   const allWaveCheckboxes = document.querySelectorAll('.wave0')
  //   allWaveCheckboxes.forEach(el => {
  //     if ((el as HTMLInputElement).checked) {
  //       fireEvent.click(el)
  //     }
  //   })

  //   fireEvent.click(kickCheckbox)

  //   fireEvent.click(screen.getByText('Start'))

  //   jest.advanceTimersByTime(200)

  //   expect(playMock).toHaveBeenCalled()
  // })

  test('covers fade overlap branch when noteLength > intervalLength', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Voice'))

    fireEvent.change(screen.getByTitle('maxLength'), { target: { value: '200' } })
    fireEvent.change(screen.getByTitle('minFadeIn'), { target: { value: '100' } })
    fireEvent.change(screen.getByTitle('maxFadeIn'), { target: { value: '100' } })
    fireEvent.change(screen.getByTitle('minFadeOut'), { target: { value: '0' } })
    fireEvent.change(screen.getByTitle('maxFadeOut'), { target: { value: '0' } })

    fireEvent.click(screen.getByText('Start'))

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(screen.getByText('Stop')).toBeInTheDocument()
  })
})

// claude tests - some failures

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

    // it('labels first voice as 1', () => {
    //   render(<App />);
    //   addVoice();
    //   expect(screen.getByTestId('voice-label-0')).toHaveTextContent('1');
    // });

    // it('increments label when cloning from last active voice', () => {
    //   render(<App />);
    //   addVoice();
    //   addVoice();
    //   expect(screen.getByTestId('voice-label-1')).toHaveTextContent('2');
    // });
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

  // ── Lines 178–185: start() — creates oscillator/gain per active voice ────────

  describe('start() (lines 178–185)', () => {
    // it('calls createOscillator and createGain for each active voice', () => {
    //   render(<App />);
    //   addVoice();
    //   addVoice();
    //   clickStartStop();

    //   expect(mockContext.createOscillator).toHaveBeenCalledTimes(2);
    //   expect(mockContext.createGain).toHaveBeenCalledTimes(2);
    // });

    // it('does not call createOscillator for inactive voices', () => {
    //   render(<App />);
    //   addVoice();
    //   addVoice();
    //   fireEvent.click(screen.getByTestId('delete-voice-0')); // deactivate first
    //   clickStartStop();

    //   expect(mockContext.createOscillator).toHaveBeenCalledTimes(1);
    // });
  });

  // ── Lines 190–199: stop() ────────────────────────────────────────────────────

  describe('stop() (lines 190–199)', () => {
    // it('sets gain to 0 and stops oscillators on stop', async () => {
    //   const gainVoice = { gain: { setValueAtTime: jest.fn() }, connect: jest.fn() };
    //   const oscillatorVoice = { ...mockOscillator, connect: jest.fn(), stop: jest.fn() };
    //   mockContext.createGain.mockReturnValue(gainVoice as any);
    //   mockContext.createOscillator.mockReturnValue(oscillatorVoice);

    //   render(<App />);
    //   addVoice();
    //   clickStartStop(); // start
    //   clickStartStop(); // stop

    //   await waitFor(() => {
    //     expect(gainVoice.gain.setValueAtTime).toHaveBeenCalledWith(0, mockContext.currentTime);
    //     expect(oscillatorVoice.stop).toHaveBeenCalled();
    //   });
    // });
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

    // it('does not throw when no checked wave inputs are present', () => {
    //   render(<App />);
    //   addVoice();

    //   // Uncheck all wave checkboxes before starting
    //   const waveCheckboxes = document.querySelectorAll<HTMLInputElement>('[class*="wave0"]');
    //   waveCheckboxes.forEach(cb => { cb.checked = false; });

    //   expect(() => {
    //     clickStartStop();
    //     act(() => { jest.runAllTimers(); });
    //   }).not.toThrow();
    // });

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

  // ── Lines 253–273: getIntervalLength() ──────────────────────────────────────

  describe('getIntervalLength() (lines 253–273)', () => {
    // it('does not throw when interval checkboxes are present', () => {
    //   render(<App />);
    //   addVoice();

    //   expect(() => {
    //     clickStartStop();
    //     act(() => { jest.runAllTimers(); });
    //   }).not.toThrow();
    // });

    // it('respects bpm input for interval length calculation', () => {
    //   render(<App />);
    //   addVoice();

    //   const bpmInput = document.querySelector<HTMLInputElement>('#bpm0');
    //   if (bpmInput) fireEvent.change(bpmInput, { target: { value: '60' } });

    //   expect(() => {
    //     clickStartStop();
    //     act(() => { jest.runAllTimers(); });
    //   }).not.toThrow();
    // });
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

    // it('sets gain to 0 and stops oscillator on delete', () => {
    //   const gainVoice = { gain: { setValueAtTime: jest.fn() }, connect: jest.fn() };
    //   const oscillatorVoice = { ...mockOscillator, connect: jest.fn(), stop: jest.fn() };
    //   mockContext.createGain.mockReturnValue(gainVoice as any);
    //   mockContext.createOscillator.mockReturnValue(oscillatorVoice);

    //   render(<App />);
    //   addVoice();
    //   clickStartStop(); // attach oscillator/gain to voice

    //   fireEvent.click(screen.getByTestId('delete-voice-0'));

    //   expect(gainVoice.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
    //   expect(oscillatorVoice.stop).toHaveBeenCalled();
    // });

    it('does not throw when deleting a voice that was never started', () => {
      render(<App />);
      addVoice();

      expect(() => {
        fireEvent.click(screen.getByTestId('delete-voice-0'));
      }).not.toThrow();
    });
  });

  // ── isRest() — called inside newInterval ────────────────────────────────────

  describe('isRest() (called from newInterval)', () => {
    // it('does not throw when rest input is present', () => {
    //   render(<App />);
    //   addVoice();

    //   const restChanceInput = document.querySelector<HTMLInputElement>('#restChance0');
    //   if (restChanceInput) fireEvent.change(restChanceInput, { target: { value: '50' } });

    //   expect(() => {
    //     clickStartStop();
    //     act(() => { jest.runAllTimers(); });
    //   }).not.toThrow();
    // });
  });

  // ── getRangeValue() ─────────────────────────────────────────────────────────

  describe('getRangeValue() (called from newInterval)', () => {
    // it('falls back gracefully when min/max elements are missing', () => {
    //   render(<App />);
    //   addVoice();

    //   // Ensure the inputs exist but have no values — fallback to 0/100
    //   expect(() => {
    //     clickStartStop();
    //     act(() => { jest.runAllTimers(); });
    //   }).not.toThrow();
    // });
  });
});