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

  test('oscillator branch executes wave processing path', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Add Node'))

    fireEvent.click(screen.getByTitle('sine')) // wave checkbox exists

    fireEvent.click(screen.getByText('Start'))

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(screen.getByText('Stop')).toBeInTheDocument()
  })
})

// claude tests - some failures

// import { waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';

// // ─── Web Audio API mock ───────────────────────────────────────────────────────

// const mockGain = {
//   gain: {
//     value: 0,
//     setValueAtTime: jest.fn(),
//     linearRampToValueAtTime: jest.fn(),
//   },
// };

// const mockOscillator = {
//   connect: jest.fn(),
//   start: jest.fn(),
//   stop: jest.fn(),
//   frequency: { value: 440 },
//   type: 'sine' as OscillatorType,
// };

// const mockContext = {
//   currentTime: 0,
//   destination: {},
//   resume: jest.fn(),
//   createOscillator: jest.fn(() => ({ ...mockOscillator })),
//   createGain: jest.fn(() => ({
//     ...mockGain,
//     connect: jest.fn(),
//   })),
//   createMediaElementSource: jest.fn(() => ({ connect: jest.fn() })),
// };

// global.AudioContext = jest.fn(() => mockContext) as unknown as typeof AudioContext;

// // ─── HTMLMediaElement mock ────────────────────────────────────────────────────

// Object.defineProperty(HTMLMediaElement.prototype, 'play', {
//   configurable: true,
//   value: jest.fn().mockResolvedValue(undefined),
// });

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const addNode = () => fireEvent.click(screen.getByRole('button', { name: /add node/i }));
// const clickStartStop = () => fireEvent.click(screen.getByRole('button', { name: /start|stop/i }));

// // ─── Tests ────────────────────────────────────────────────────────────────────

// describe('App', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     jest.useFakeTimers();
//     // Reset currentTime to 0 before each test
//     mockContext.currentTime = 0;
//   });

//   afterEach(() => {
//     jest.useRealTimers();
//   });

//   // ── Lines 101–133: addNode / setUpNode ──────────────────────────────────────

//   describe('addNode / setUpNode (lines 101–133)', () => {
//     it('renders a node component when Add Node is clicked', () => {
//       render(<App />);
//       addNode();
//       // Node should appear — keyed by node index
//       expect(screen.getByTestId('node-0')).toBeInTheDocument();
//     });

//     it('clones settings from the last active node when a second node is added', () => {
//       render(<App />);
//       addNode();
//       addNode();
//       const secondNode = screen.getByTestId('node-1');
//       expect(secondNode).toBeInTheDocument();
//     });

//     it('labels first node as 1', () => {
//       render(<App />);
//       addNode();
//       expect(screen.getByTestId('node-label-0')).toHaveTextContent('1');
//     });

//     it('increments label when cloning from last active node', () => {
//       render(<App />);
//       addNode();
//       addNode();
//       expect(screen.getByTestId('node-label-1')).toHaveTextContent('2');
//     });
//   });

//   // ── Lines 145–152: useEffect — stop cycling when no active nodes ────────────

//   describe('useEffect: cycling stops when all nodes are deleted (lines 145–152)', () => {
//     it('hides the Start button when there are no active nodes', () => {
//       render(<App />);
//       expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument();
//     });

//     it('resets cycleButtonLabel to false when last node is deleted', async () => {
//       render(<App />);
//       addNode();
//       clickStartStop(); // start cycling

//       // Delete the only node
//       fireEvent.click(screen.getByTestId('delete-node-0'));

//       await waitFor(() => {
//         expect(screen.queryByRole('button', { name: /stop/i })).not.toBeInTheDocument();
//       });
//     });
//   });

//   // ── Line 163: handleStartStop ───────────────────────────────────────────────

//   describe('handleStartStop (line 163)', () => {
//     it('toggles the cycle button label between Start and Stop', () => {
//       render(<App />);
//       addNode();

//       clickStartStop();
//       expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();

//       clickStartStop();
//       expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
//     });
//   });

//   // ── Lines 178–185: start() — creates oscillator/gain per active node ────────

//   describe('start() (lines 178–185)', () => {
//     it('calls createOscillator and createGain for each active node', () => {
//       render(<App />);
//       addNode();
//       addNode();
//       clickStartStop();

//       expect(mockContext.createOscillator).toHaveBeenCalledTimes(2);
//       expect(mockContext.createGain).toHaveBeenCalledTimes(2);
//     });

//     it('does not call createOscillator for inactive nodes', () => {
//       render(<App />);
//       addNode();
//       addNode();
//       fireEvent.click(screen.getByTestId('delete-node-0')); // deactivate first
//       clickStartStop();

//       expect(mockContext.createOscillator).toHaveBeenCalledTimes(1);
//     });
//   });

//   // ── Lines 190–199: stop() ────────────────────────────────────────────────────

//   describe('stop() (lines 190–199)', () => {
//     it('sets gain to 0 and stops oscillators on stop', async () => {
//       const gainNode = { gain: { setValueAtTime: jest.fn() }, connect: jest.fn() };
//       const oscillatorNode = { ...mockOscillator, connect: jest.fn(), stop: jest.fn() };
//       mockContext.createGain.mockReturnValue(gainNode);
//       mockContext.createOscillator.mockReturnValue(oscillatorNode);

//       render(<App />);
//       addNode();
//       clickStartStop(); // start
//       clickStartStop(); // stop

//       await waitFor(() => {
//         expect(gainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, mockContext.currentTime);
//         expect(oscillatorNode.stop).toHaveBeenCalled();
//       });
//     });
//   });

//   // ── Lines 205–239: newInterval() ────────────────────────────────────────────

//   describe('newInterval() (lines 205–239)', () => {
//     it('schedules a setTimeout callback when cycling starts', () => {
//       render(<App />);
//       addNode();
//       const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

//       clickStartStop();

//       expect(setTimeoutSpy).toHaveBeenCalled();
//     });

//     it('does not throw when no checked wave inputs are present', () => {
//       render(<App />);
//       addNode();

//       // Uncheck all wave checkboxes before starting
//       const waveCheckboxes = document.querySelectorAll<HTMLInputElement>('[class*="wave0"]');
//       waveCheckboxes.forEach(cb => { cb.checked = false; });

//       expect(() => {
//         clickStartStop();
//         act(() => { jest.runAllTimers(); });
//       }).not.toThrow();
//     });

//     it('calls newInterval recursively via setTimeout', () => {
//       render(<App />);
//       addNode();
//       const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

//       clickStartStop();
//       const initialCalls = setTimeoutSpy.mock.calls.length;

//       act(() => { jest.advanceTimersByTime(2000); });

//       expect(setTimeoutSpy.mock.calls.length).toBeGreaterThan(initialCalls);
//     });
//   });

//   // ── Lines 253–273: getIntervalLength() ──────────────────────────────────────

//   describe('getIntervalLength() (lines 253–273)', () => {
//     it('does not throw when interval checkboxes are present', () => {
//       render(<App />);
//       addNode();

//       expect(() => {
//         clickStartStop();
//         act(() => { jest.runAllTimers(); });
//       }).not.toThrow();
//     });

//     it('respects bpm input for interval length calculation', () => {
//       render(<App />);
//       addNode();

//       const bpmInput = document.querySelector<HTMLInputElement>('#bpm0');
//       if (bpmInput) fireEvent.change(bpmInput, { target: { value: '60' } });

//       expect(() => {
//         clickStartStop();
//         act(() => { jest.runAllTimers(); });
//       }).not.toThrow();
//     });
//   });

//   // ── Lines 316–319: handleDelete() ───────────────────────────────────────────

//   describe('handleDelete() (lines 316–319)', () => {
//     it('removes the node visually when delete is clicked', () => {
//       render(<App />);
//       addNode();
//       expect(screen.getByTestId('node-0')).toBeInTheDocument();

//       fireEvent.click(screen.getByTestId('delete-node-0'));
//       expect(screen.queryByTestId('node-0')).not.toBeInTheDocument();
//     });

//     it('sets gain to 0 and stops oscillator on delete', () => {
//       const gainNode = { gain: { setValueAtTime: jest.fn() }, connect: jest.fn() };
//       const oscillatorNode = { ...mockOscillator, connect: jest.fn(), stop: jest.fn() };
//       mockContext.createGain.mockReturnValue(gainNode);
//       mockContext.createOscillator.mockReturnValue(oscillatorNode);

//       render(<App />);
//       addNode();
//       clickStartStop(); // attach oscillator/gain to node

//       fireEvent.click(screen.getByTestId('delete-node-0'));

//       expect(gainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
//       expect(oscillatorNode.stop).toHaveBeenCalled();
//     });

//     it('does not throw when deleting a node that was never started', () => {
//       render(<App />);
//       addNode();

//       expect(() => {
//         fireEvent.click(screen.getByTestId('delete-node-0'));
//       }).not.toThrow();
//     });
//   });

//   // ── isRest() — called inside newInterval ────────────────────────────────────

//   describe('isRest() (called from newInterval)', () => {
//     it('does not throw when rest input is present', () => {
//       render(<App />);
//       addNode();

//       const restInput = document.querySelector<HTMLInputElement>('#rest0');
//       if (restInput) fireEvent.change(restInput, { target: { value: '50' } });

//       expect(() => {
//         clickStartStop();
//         act(() => { jest.runAllTimers(); });
//       }).not.toThrow();
//     });
//   });

//   // ── getRangeValue() ─────────────────────────────────────────────────────────

//   describe('getRangeValue() (called from newInterval)', () => {
//     it('falls back gracefully when min/max elements are missing', () => {
//       render(<App />);
//       addNode();

//       // Ensure the inputs exist but have no values — fallback to 0/100
//       expect(() => {
//         clickStartStop();
//         act(() => { jest.runAllTimers(); });
//       }).not.toThrow();
//     });
//   });
// });