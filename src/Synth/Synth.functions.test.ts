import { detectPitch, getContext, parseNoteFromKey, refineFundamental, runInterval, getDetectedFrequency, detectPitchFFT, findNearestNote, findNearestSampleInFolder, loadSamples, resetSampleState }  from './Synth.functions';  
import { VoiceType }                      from '../components/shared.types';  
import { runOneInterval }                 from './Synth.test.functions';  
import { allFrequencies, sampleFolders }  from '../content/data';
import { buffers }                        from './Synth.functions';
import { makeVoice }                      from '../shared.test.functions';

jest.mock('../content/data', () => ({  
  allFrequencies: [
    [  
      261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25
    ],
    [  
      523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.50
    ],
  ],
  extrema:      ['min', 'max'],  
  oneMinute:    60,  
  samples:      { 
    snare:    'snare.wav',
    piano_C0: 'piano_C0.wav'
  },  
  sampleFolders: {},  
  waveforms:    ['sine', 'square', 'sawtooth', 'triangle']  
}))  
    
global.Audio = jest.fn().mockImplementation(() => ({ play: jest.fn() })) as typeof Audio  
  
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

    const context = createMockContext() as AudioContext  

    const setup = {
      context: context,
      masterGain: undefined
    }

    getContext(setup)  
    expect(context.createDynamicsCompressor).toHaveBeenCalled()  
  })  
  
  it('resumes a suspended context', () => {  
    const context = createMockContext('suspended') as AudioContext  

    const setup = {
      context: context,
      masterGain: undefined
    }

    getContext(setup)  
    expect(context.resume).toHaveBeenCalledTimes(1)  
  })

  it('creates a new AudioContext when none is provided', () => {
    const mockContext = {} as AudioContext;
    const AudioContextMock = jest.fn(() => mockContext);

    global.AudioContext = AudioContextMock as unknown as typeof AudioContext;

    const setup = {
      context: undefined,
      masterGain: undefined
    }

    const result = getContext(setup);

    expect(AudioContextMock).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockContext);
  });
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

  it('has a rest when isRest returns true', () => {  
    const voice = { ...makeVoice(), restChance: 0, activeOctaves: [] }  
    const mockContext = createMockContext('running')  
    runOneInterval(voice, mockContext)  
    jest.runAllTimers()  
    expect(mockContext.createOscillator).not.toHaveBeenCalled()  
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
    runInterval(voice, voicesRef, context as unknown as AudioContext, [], 0, jest.fn())  
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

  it('handles a single pulse', () => {
    const samples = new Array(5000).fill(0);
    samples[0] = 1;

    expect(detectPitch(makeBuffer(samples), 44100)).toBe(21.533203125);
  });
})

describe('detectPitchFFT', () => {
  it('detects a sine wave frequency', () => {
    const sampleRate = 44100;
    const N = 4096;
    const frequency = 440;

    const slice = Float32Array.from(
      { length: N },
      (_, i) => Math.sin(2 * Math.PI * frequency * i / sampleRate)
    );

    const result = detectPitchFFT(slice, sampleRate);

    expect(result).not.toBeNull();
    expect(result!).toBeGreaterThan(430);
    expect(result!).toBeLessThan(450);
  });

  it('returns null for an empty slice', () => {
    expect(
      detectPitchFFT(new Float32Array(), 44100)
    ).toBeNull();
  });

  it('returns a frequency for a constant signal', () => {
    const slice = new Float32Array(4096).fill(1);

    expect(detectPitchFFT(slice, 44100)).not.toBeNull();
  });
})

describe('refineFundamental', () => {
  it('prefers a lower harmonic when it is a strong local peak', () => {
    const correlations = [
      1.0,   // 0
      0.0,   // 1 = firstZeroCrossing
      0.95,  // 2 = candidate (local peak)
      0.1,   // 3
      0.2,   // 4
      0.1,   // 5
      0.94,  // 6 = original bestOffset
      0.1,   // 7
    ];

    const result = refineFundamental(
      correlations,
      1,      // firstZeroCrossing
      6,      // bestOffset
      0.94    // bestCorrelation
    );

    expect(result).toEqual({
      bestOffset: 2,
      bestCorrelation: 0.95,
    });
  });

  
});

describe('getDetectedFrequency', () => {
  it('uses the FFT fallback when requested', () => {
    const slice = Float32Array.from([1, 0, -1, 0]);

    const expected = detectPitchFFT(slice, 44100);

    expect(
      getDetectedFrequency(slice, 44100, -1, 0.8)
    ).toBe(expected);
  });

  it('returns the autocorrelation frequency when no fallback is needed', () => {
    expect(
      getDetectedFrequency(
        Float32Array.from([1]),
        44100,
        100,
        0.8
      )
    ).toBe(441);
  });
});

describe('findNearestNote', () => {
  it('returns an exact note match', () => {
    expect(
      findNearestNote(allFrequencies[1][0]) // C4
    ).toEqual({
      octave: 1,
      note: 0,
      frequency: allFrequencies[1][0],
    });
  });

  it('returns the nearest note for an inexact frequency', () => {
    const result = findNearestNote(445);

    expect(result).toEqual({
      octave: 0,
      note: 9, // A4
      frequency: allFrequencies[0][9],
    });
  });

  it('does not return the duplicate boundary note', () => {
    const result = findNearestNote(allFrequencies[0][12]);

    expect(result).toEqual({
      octave: 1,
      note: 0,
      frequency: allFrequencies[1][0],
    });
  });
});

describe('findNearestSampleInFolder', () => {
  beforeEach(() => {
    Object.keys(sampleFolders).forEach(k => delete sampleFolders[k]);
    Object.keys(buffers).forEach(k => delete buffers[k]);
  });

  it('returns null when the folder has no samples', () => {
    expect(findNearestSampleInFolder('drums', 4, 0)).toBeNull();
  });

  it('ignores missing buffers', () => {
    sampleFolders.drums = ['kick'];

    expect(findNearestSampleInFolder('drums', 4, 0)).toBeNull();
  });

  it('ignores buffers with a null octave', () => {
    sampleFolders.drums = ['kick'];

    buffers.kick = {
      octave: null,
      note: 0,
    } as any;

    expect(findNearestSampleInFolder('drums', 4, 0)).toBeNull();
  });

  it('ignores buffers with a null note', () => {
    sampleFolders.drums = ['kick'];

    buffers.kick = {
      octave: 4,
      note: null,
    } as any;

    expect(findNearestSampleInFolder('drums', 4, 0)).toBeNull();
  });

  it('returns the nearest sample', () => {
    sampleFolders.drums = ['far', 'near'];

    buffers.far = {
      octave: 2,
      note: 0,
    } as any;

    buffers.near = {
      octave: 4,
      note: 1,
    } as any;

    expect(findNearestSampleInFolder('drums', 4, 0)).toBe('near');
  });

  it('returns the nearest sample', () => {
    sampleFolders.drums = ['far', 'near', 'further'];

    buffers.far = {
      octave: 4,
      note: 5,
    } as any;

    buffers.near = {
      octave: 4,
      note: 1,
    } as any;

    buffers.further = {
      octave: 5,
      note: 5,
    } as any;

    expect(findNearestSampleInFolder('drums', 4, 0)).toBe('near');
  });
});

describe('loadSamples', () => {

  beforeEach(() => {
    resetSampleState();  
  })

  it('loads a sample with a note in its filename', async () => {
    const decoded = {} as AudioBuffer;

    global.fetch = jest.fn().mockResolvedValue({
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    });

    const context = {
      sampleRate: 44100,
      decodeAudioData: jest.fn().mockResolvedValue(decoded),
    } as unknown as AudioContext;

    await loadSamples(context);

    expect(context.decodeAudioData).toHaveBeenCalled();
    
    expect(parseNoteFromKey('piano_C0')).toEqual({
      octave: 0,
      note: 0,
      frequency: allFrequencies[0][0],
    });

    expect(buffers.piano_C0).toEqual({
      buffer: decoded,
      detectedFrequency: allFrequencies[0][0], // adjust to your mock
      nearestFrequency: allFrequencies[0][0],
      octave: 0,
      note: 0,
    });
  });

  it('loads a sample by detecting its pitch', async () => {
    resetSampleState();

    const samples = Array.from(
      { length: 5000 },
      (_, i) => Math.sin(2 * Math.PI * 440 * i / 44100)
    );

    const decoded = makeBuffer(samples);

    global.fetch = jest.fn().mockResolvedValue({
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    });

    const context = {
      sampleRate: 44100,
      decodeAudioData: jest.fn().mockResolvedValue(decoded),
    } as unknown as AudioContext;

    await loadSamples(context);

    expect(context.decodeAudioData).toHaveBeenCalled();

    expect(buffers.snare).toEqual({
      buffer: decoded,
      detectedFrequency: expect.any(Number),
      nearestFrequency: expect.any(Number),
      octave: expect.any(Number),
      note: expect.any(Number),
    });
  });

  it('stores null note information when no pitch is detected', async () => {
    resetSampleState();

    const decoded = {
      getChannelData: () => new Float32Array(5000),
    } as unknown as AudioBuffer;

    global.fetch = jest.fn().mockResolvedValue({
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    });

    const context = {
      sampleRate: 44100,
      decodeAudioData: jest.fn().mockResolvedValue(decoded),
    } as unknown as AudioContext;

    await loadSamples(context);

    expect(buffers.snare).toEqual({
      buffer: decoded,
      detectedFrequency: null,
      nearestFrequency: null,
      octave: null,
      note: null,
    });
  });

  it('logs an error when a sample cannot be loaded', async () => {
    resetSampleState();

    global.fetch = jest.fn().mockRejectedValue(new Error('boom'));

    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const context = {
      sampleRate: 44100,
      decodeAudioData: jest.fn(),
    } as unknown as AudioContext;

    await loadSamples(context);

    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to load sample:',
      'snare',
      expect.any(Error)
    );

    errorSpy.mockRestore();
  });
})

// describe('playSample', () => {
  
//   it('plays the nearest sample from a sample folder', () => {
//     sampleFolders.drums = ['near'];

//     buffers.near = {
//       buffer: {} as AudioBuffer,
//       note: 0,
//       octave: 0,
//     } as any;

//     const source = {
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       start: jest.fn(),
//       detune: { value: 0 },
//     };

//     const gain = {
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       gain: {
//         setValueAtTime: jest.fn(),
//         linearRampToValueAtTime: jest.fn()
//       },
//     };

//     const context = {
//       createBufferSource: jest.fn(() => source),
//       createGain: jest.fn(() => gain),
//     } as any;

//     const voice = {
//       activeNotes: ['1'],
//       activeOctaves: ['0'],
//       activeIntervals: ['0'],
//     } as VoiceType;

//     playSample('drums', 1, context, 0, {}, voice);

//     expect(context.createBufferSource).toHaveBeenCalled();
//     expect(source.start).toHaveBeenCalled();
//   });

//   it('plays a random sample when no target note is available', () => {
//     sampleFolders.drums = ['sample1'];

//     buffers.sample1 = {
//       buffer: {} as AudioBuffer,
//       note: 0,
//       octave: 0,
//     } as any;

//     const source = {
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       start: jest.fn(),
//       detune: { value: 0 },
//     };

//     const gain = {
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       gain: {
//         setValueAtTime: jest.fn(),
//         linearRampToValueAtTime: jest.fn()
//       },
//     };

//     const context = {
//       createBufferSource: jest.fn(() => source),
//       createGain: jest.fn(() => gain),
//     } as any;

//     const voice = {
//       activeNotes: [],
//       activeOctaves: [],
//       activeIntervals: [],
//     } as unknown as VoiceType;

//     playSample('drums', 1, context, 0, {}, voice);

//     expect(context.createBufferSource).toHaveBeenCalled();
//     expect(source.start).toHaveBeenCalled();
//   });

//   it('disconnects the source and gain when playback ends', () => {
//     const source = {
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       start: jest.fn(),
//       detune: { value: 0 },
//       onended: undefined as (() => void) | undefined,
//     };

//     const gain = {
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       gain: {
//         setValueAtTime: jest.fn(),
//         linearRampToValueAtTime: jest.fn()
//       },
//     };

//     const context = {
//       createBufferSource: jest.fn(() => source),
//       createGain: jest.fn(() => gain),
//     } as any;

//     buffers.snare = {
//       buffer: {} as AudioBuffer,
//       note: 0,
//       octave: 0,
//     } as any;

//     const voice = {
//       activeNotes: ['1'],
//       activeOctaves: ['0'],
//       activeIntervals: ['0'],
//     } as VoiceType;

//     playSample('snare', 1, context, 0, {}, voice);

//     expect(source.onended).toBeDefined();

//     source.onended!();

//     expect(source.disconnect).toHaveBeenCalledTimes(1);
//     expect(gain.disconnect).toHaveBeenCalledTimes(1);
//   });

//   it('falls back to the folder name when no nearest sample is found', () => {
//     sampleFolders.drums = ['missing'];

//     buffers.drums = {
//       buffer: {} as AudioBuffer,
//       note: 0,
//       octave: 0,
//     } as any;

//     const source = {
//       buffer: undefined as AudioBuffer | undefined,
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       start: jest.fn(),
//       detune: { value: 0 },
//     };

//     const gain = {
//       connect: jest.fn(),
//       disconnect: jest.fn(),
//       gain: {
//         setValueAtTime: jest.fn(),
//         linearRampToValueAtTime: jest.fn(),
//       },
//     };

//     const context = {
//       createBufferSource: jest.fn(() => source),
//       createGain: jest.fn(() => gain),
//     } as any;

//     const voice = {
//       activeNotes: ['1'],
//       activeOctaves: ['0'],
//       activeIntervals: ['0'],
//     } as VoiceType;

//     playSample('drums', 1, context, 0, {}, voice);

//     expect(source.buffer).toBe(buffers.drums.buffer);
//     expect(source.start).toHaveBeenCalled();
//   });
// })

describe('refineFundamental', () => {
  it('handles missing correlation values', () => {
    const correlations = new Array(20);

    const result = refineFundamental(
      correlations,
      0,
      10,
      1
    );

    expect(result).toEqual({
      bestOffset: 10,
      bestCorrelation: 1,
    });
  });
})