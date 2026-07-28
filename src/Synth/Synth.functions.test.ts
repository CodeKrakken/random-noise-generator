import { detectPitch, getContext, parseNoteFromKey, runInterval }  from './Synth.functions';  
import { VoiceType }                from '../components/shared.types';  
import { runOneInterval }           from './Synth.test.functions';  
import { allFrequencies } from '../content/data';
  
  
jest.mock('../content/data', () => ({  
  allFrequencies: [  
    [  
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88,  
      523.25, 587.33, 659.25, 698.46, 783.99, 880.00  
    ],  
  ],  
  extrema:      ['min', 'max'],  
  oneMinute:    60,  
  samples:      { snare: 'snare.wav' },  
  sampleFolders: {},  
  waveforms:    ['sine', 'square', 'sawtooth', 'triangle']  
}))  
    
global.Audio = jest.fn().mockImplementation(() => ({ play: jest.fn() })) as typeof Audio  
  
const makeVoice = (): VoiceType => ({  
  id:               'test-id',  
  isActive:         false,  
  label:            '1',  
  nextInterval:     0,  
  thisInterval:     0,  
  offsetInterval:   0,  
  bpm:              120,  
  minLevel:         100,  
  maxLevel:         100,  
  activeNotes:      ['1','3','5','6','8','10','12','13'],  
  activeOctaves:    ['4'],  
  activeFrequencies:[261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],  
  activeIntervals:  ['1'],  
  activeSounds:     ['sine'],  
  restChance:       0,  
  minLength:        100,  
  maxLength:        100,  
  minOffset:        0,  
  maxOffset:        0,  
  minDetune:        0,  
  maxDetune:        0,  
  minAttack:        100,  
  maxAttack:        100,  
  minDecay:         100,  
  maxDecay:         100,  
})  

const makeBuffer = (samples: number[]): AudioBuffer =>
  ({
    getChannelData: jest.fn().mockReturnValue(Float32Array.from(samples)),
  } as unknown as AudioBuffer);

const createMockContext = (state = 'running', currentTime = 0) => (  
  {  
    state,  
    currentTime,  
    sampleRate: 44100,  
    destination: {} as AudioDestinationNode,  
    resume: jest.fn().mockResolvedValue(undefined),  
    createOscillator: jest.fn().mockReturnValue({  
      connect: jest.fn(),  
      start: jest.fn(),  
      stop: jest.fn(),  
      disconnect: jest.fn(),  
      frequency: { value: 0 },  
      detune:    { value: 0 },  
      type: 'sine'  
    }),  
    createGain: jest.fn().mockReturnValue({  
      gain: {  
        setValueAtTime: jest.fn(),  
        linearRampToValueAtTime: jest.fn(),  
        value: 0  
      },  
      connect: jest.fn(),  
      disconnect: jest.fn()  
    }),  
    createDynamicsCompressor: jest.fn().mockReturnValue({  
      threshold: { value: 0 },  
      knee:      { value: 0 },  
      ratio:     { value: 0 },  
      attack:    { value: 0 },  
      release:   { value: 0 },  
      connect:   jest.fn()  
    }),  
    createBufferSource: jest.fn().mockReturnValue({  
      connect:    jest.fn(),  
      start:      jest.fn(),  
      disconnect: jest.fn(),  
      detune:     { value: 0 },  
      buffer:     null,  
      onended:    null  
    }),  
    createMediaElementSource: jest.fn().mockReturnValue({ connect: jest.fn() }),  
    decodeAudioData: jest.fn().mockResolvedValue({})  
  } as unknown as Partial<AudioContext>  
)  
  
  
describe('getContext', () => {  
  
  it('sets up a dynamics compressor on a new context', () => {  
    const mockContext = createMockContext() as AudioContext  
    getContext(mockContext)  
    expect(mockContext.createDynamicsCompressor).toHaveBeenCalled()  
  })  
  
  it('resumes a suspended context', () => {  
    const mockContext = createMockContext('suspended') as AudioContext  
    getContext(mockContext)  
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
  
  it('warns when sample buffer is not ready', () => {  
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})  
    const voice = { ...makeVoice(), activeSounds: ['snare'] }  
    const mockContext = createMockContext('running')  
    runOneInterval(voice, mockContext)  
    expect(consoleSpy).toHaveBeenCalledWith('Buffer not ready for:', 'snare')  
    consoleSpy.mockRestore()  
  })  
  
  it('logs errors thrown during sound creation', () => {  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})  
    const throwingContext = {  
      ...createMockContext(),  
      createOscillator: jest.fn(() => { throw new Error('oscillator failed') }),  
    }  
    const voice = { ...makeVoice(), restChance: 0, activeSounds: ['sine'] }  
    runOneInterval(voice, throwingContext)  
    expect(consoleSpy).toHaveBeenCalledWith('oscillator failed', expect.any(Error))  
    consoleSpy.mockRestore()  
  })  
  
  it('logs "Unknown error" when a non-Error is thrown inside makeSound', () => {  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})  
    const throwingContext = {  
      ...createMockContext(),  
      createOscillator: jest.fn(() => { throw 'string error' }),  
    }  
    const voice = { ...makeVoice(), restChance: 0, activeSounds: ['sine'] }  
    runOneInterval(voice, throwingContext)  
    jest.runAllTimers()  
    expect(consoleSpy).toHaveBeenCalledWith('Unknown error', 'string error')  
    consoleSpy.mockRestore()  
  })  
  
  it('schedules note end when noteLength is shorter than intervalLength', () => {  
    const voice = { ...makeVoice(), minLength: 50, maxLength: 50 }  
    const mockContext = createMockContext('running', 10) as AudioContext  
    runOneInterval(voice, mockContext)  
    const mockGain = mockContext.createGain()  
    expect(mockGain.gain.setValueAtTime).toHaveBeenCalled()  
  })  
  
  it('uses non-overlapping fade envelope when fade percentages are small', () => {  
    const mockContext = createMockContext('running') as AudioContext  
    const voice = {  
      ...makeVoice(),  
      activeOctaves: ['0'],  
      minAttack: 20,  
      maxAttack: 20,  
      minDecay:  20,  
      maxDecay:  20,  
    }  
    runOneInterval(voice, mockContext)  
    const mockGain = mockContext.createGain()  
    expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalled()  
  })  
  
  it('calls makeSound when isRest returns false', () => {  
    const voice = { ...makeVoice(), restChance: 0 }  
    const mockContext = createMockContext('running')  
    runOneInterval(voice, mockContext)  
    jest.runAllTimers()  
    expect(mockContext.createOscillator).toHaveBeenCalled()  
  })  
  
  it('uses "0.5" as fallback interval when activeIntervals is empty', () => {  
    const voice = { ...makeVoice(), activeIntervals: [], restChance: 0 }  
    const mockContext = createMockContext('running')  
    runOneInterval(voice, mockContext)  
    jest.runAllTimers()  
    expect(mockContext.createOscillator).toHaveBeenCalled()  
  })  
  
  it('skips makeSound when isRest returns true', () => {  
    const voice = { ...makeVoice(), restChance: 100 }  
    const mockContext = createMockContext('running')  
    runOneInterval(voice, mockContext)  
    jest.runAllTimers()  
    expect(mockContext.createOscillator).not.toHaveBeenCalled()  
  })  
  
  it('calls runInterval again when voice is still active', () => {  
    const calledFunctions: Function[] = []  
    jest.spyOn(global, 'setTimeout').mockImplementation((fn: Function) => {  
      calledFunctions.push(fn)  
      return 0 as unknown as NodeJS.Timeout  
    })  
    const voice = { ...makeVoice(), isActive: true }  
    const voicesRef = { current: [voice] }  
    const context = createMockContext('running', 0)  
    runInterval(voice, voicesRef, context as unknown as AudioContext)  
    calledFunctions[1]()  
    expect(calledFunctions.length).toBeGreaterThan(2)  
    jest.spyOn(global, 'setTimeout').mockRestore()  
  })  
  
  it('applies detune when cents are non-zero', () => {  
    const voice = { ...makeVoice(), minDetune: 50, maxDetune: 50 }  
    const mockContext = createMockContext('running', 10) as AudioContext  
    runOneInterval(voice, mockContext)  
    const mockOscillator = mockContext.createOscillator()  
    expect(mockOscillator.detune.value).toBe(50)  
  })  
  
  it('uses negative modifier when detune is negative', () => {  
    const voice = { ...makeVoice(), minDetune: -50, maxDetune: -50 }  
    const mockContext = createMockContext('running', 10) as AudioContext  
    runOneInterval(voice, mockContext)  
    const mockOscillator = mockContext.createOscillator()  
    expect(mockOscillator.detune.value).toBe(-50)  
  })
})

describe('parseNoteFromKey', () => {
  it('returns the parsed note information', () => {
    console.log(allFrequencies)
    expect(parseNoteFromKey('foo/C0_bar')).toEqual({
      octave: 0,
      note: 0, // C
      frequency: allFrequencies[0][0],
    });
  });

  it('returns null when the string does not contain a note', () => {
    expect(parseNoteFromKey('not-a-note')).toBeNull();
  });

  it('returns null for an unknown note name', () => {
    expect(parseNoteFromKey('foo/H4_bar')).toBeNull();
  });

  it('returns null when the octave is out of range', () => {
    expect(
      parseNoteFromKey(`foo/C${allFrequencies.length}_bar`)
    ).toBeNull();
  });
});

describe('detectPitch', () => {
  it('returns null for a silent buffer', () => {
    const samples = new Array(5000).fill(0);

    expect(detectPitch(makeBuffer(samples), 44100)).toBeNull();
  });

  it('returns null when there is no zero crossing', () => {
    const samples = new Array(5000).fill(1);

    expect(detectPitch(makeBuffer(samples), 44100)).toBeNull();
  });

  it('skips leading silence', () => {
    const samples = [
      ...new Array(100).fill(0),
      ...Array.from({ length: 5000 }, (_, i) =>
        Math.sin((2 * Math.PI * 440 * i) / 44100)
      ),
    ];

    expect(detectPitch(makeBuffer(samples), 44100)).not.toBeNull();
  });

  it('detects the pitch of a sine wave', () => {
    const samples = Array.from(
      { length: 5000 },
      (_, i) => Math.sin((2 * Math.PI * 440 * i) / 44100)
    );

    const result = detectPitch(makeBuffer(samples), 44100);

    expect(result).not.toBeNull();
  });
})