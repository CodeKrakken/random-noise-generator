import { getContext, runInterval }            from './Synth.functions';
import { setUpVoice }                         from '../components/Interface/Interface.functions';
import { createMockContext, runOneInterval }  from './Synth.test.functions';


jest.mock('../content/data', () => ({

  allFrequencies: [
    [
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88,
      523.25, 587.33, 659.25, 698.46, 783.99, 880.00
    ],
  ],
  extrema: ['min', 'max'],
  oneMinute: 60,
  samples: { snare: 'snare.wav' },
  waveforms: ['sine', 'square', 'sawtooth', 'triangle']
}))

const MockAudioContext = jest.fn().mockImplementation(() => createMockContext())

global.AudioContext = MockAudioContext

global.Audio = jest.fn().mockImplementation(() => ({ play: jest.fn() })) as typeof Audio


describe('getContext', () => {

  it('creates a new AudioContext when passed null', () => {
    getContext()
    expect(MockAudioContext).toHaveBeenCalledTimes(1)
  })

  it('resumes a suspended context', () => {
    const mockContext = createMockContext('suspended')
    getContext(mockContext as AudioContext)
    expect(mockContext.resume).toHaveBeenCalledTimes(1)
  })
})


describe('runInterval', () => {

  beforeEach(() => {
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn()
    })) as unknown as typeof Audio
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('plays a sample', () => {

    const voice = { ...setUpVoice([]), activeSounds: ['snare'] }
    const mockContext = createMockContext('running')

    runOneInterval(voice, mockContext)

    expect(global.Audio).toHaveBeenCalledWith('snare.wav')
  })

  it('logs errors thrown during sound creation', () => {

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const throwingContext = {
      ...createMockContext(),
      createOscillator: jest.fn(() => { throw new Error('oscillator failed') }),
    }

    const voice = {
      ...setUpVoice([]),
      restChance: 0,
      activeSounds: ['sine']
    }

    runOneInterval(voice, throwingContext)

    expect(consoleSpy).toHaveBeenCalledWith('oscillator failed', expect.any(Error))

    consoleSpy.mockRestore()
  })

  it('logs "Unknown error" when a non-Error is thrown inside makeSound', () => {

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const throwingContext = {
      ...createMockContext(),
      createOscillator: jest.fn(() => { throw 'string error'; }),
    }

    const voice = {
      ...setUpVoice([]),
      restChance: 0,
      activeSounds: ['sine']
    };

    runOneInterval(voice, throwingContext)
    jest.runAllTimers();

    expect(consoleSpy).toHaveBeenCalledWith('Unknown error', 'string error');
  });

  it('schedules note end when noteLength is shorter than intervalLength', () => {
    const voice = { ...setUpVoice([]), minLength: 50, maxLength: 50 }
    const mockContext = createMockContext('running', 10) as AudioContext

    runOneInterval(voice, mockContext)

    const mockGain = mockContext.createGain()
    expect(mockGain.gain.setValueAtTime).toHaveBeenCalled()
  })

  it('uses non-overlapping fade envelope when fade percentages are small', () => {

    const mockContext = createMockContext('running') as AudioContext

    const voice = {
      ...setUpVoice([]),
      activeOctaves: ['0'],
      minAttack: 20,
      maxAttack: 20,
      minDecay: 20,
      maxDecay: 20,
    }

    runOneInterval(voice, mockContext)

    const mockGain = mockContext.createGain()
    expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalled()
  })


  it('calls makeSound when isRest returns false', () => {

    const voice = {
      ...setUpVoice([]),
      restChance: 0
    };

    const mockContext = createMockContext('running');

    runOneInterval(voice, mockContext)
    jest.runAllTimers();

    expect(mockContext.createOscillator).toHaveBeenCalled();
  });


  it('uses "0" as fallback interval when activeIntervals is empty', () => {

    const voice = {
      ...setUpVoice([]),
      activeIntervals: [],
      restChance: 0
    };

    const mockContext = createMockContext('running');

    runOneInterval(voice, mockContext)
    jest.runAllTimers();

    expect(mockContext.createOscillator).toHaveBeenCalled();
  });


  it('skips makeSound when isRest returns true', () => {

    const voice = {
      ...setUpVoice([]),
      restChance: 100
    };

    const mockContext = createMockContext('running')

    runOneInterval(voice, mockContext)
    jest.runAllTimers();

    expect(mockContext.createOscillator).not.toHaveBeenCalled();
  });


  it('calls runInterval again when voice is still active', () => {

    const calledFunctions: Function[] = []

    jest.spyOn(global, 'setTimeout').mockImplementation((calledFunction: Function) => {
      calledFunctions.push(calledFunction)
      return 0 as unknown as NodeJS.Timeout
    })

    const voice = {
      ...setUpVoice([]),
      isActive: true
    }

    const voicesRef = { current: [voice] }
    const context = createMockContext('running', 0)

    runInterval(
      voice,
      voicesRef,
      context as unknown as AudioContext
    )

    calledFunctions[1]()

    expect(calledFunctions.length).toBeGreaterThan(2)

    jest.spyOn(global, 'setTimeout').mockRestore()
  })

  it('applies detune when cents are non-zero', () => {

    const voice = {
      ...setUpVoice([]),
      minDetune: 50,
      maxDetune: 50
    }

    const mockContext = createMockContext('running', 10) as AudioContext

    runOneInterval(voice, mockContext)

    const mockOscillator = mockContext.createOscillator()
    const frequency = mockOscillator.frequency.value

    expect(frequency).not.toBe(261.63)
  })

  it('uses negative modifier when detune is negative', () => {

    const voice = {
      ...setUpVoice([]),
      activeOctaves: ['0'],
      activeNotes: ['2'], // 293.66, to be shifted down
      minDetune: -50,
      maxDetune: -50,
    };

    const mockContext = createMockContext('running') as AudioContext;

    runOneInterval(voice, mockContext);

    const mockOscillator = mockContext.createOscillator()
    const frequency = mockOscillator.frequency.value

    expect(frequency).toBeLessThan(293.66);
  });
});
