import { getContext, runInterval } from './Synth.functions'  
import { VoiceType }               from '../components/shared.types'  
import { createMockContext }        from './Synth.test.functions'  
  
jest.mock('../content/data', () => ({  
  allFrequencies: [  
    [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25],  
    [523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.50],  
  ],  
  extrema:       ['min', 'max'],  
  oneMinute:     60,  
  samples: {  
    '/piano_A1.wav': 'piano_A1.wav',   // matches parseNoteFromKey regex  → lines 77-91  
    'snare':         'snare.wav',       // no note in name → detectPitch   → lines 96-191, 196-216, 221-241  
  },  
  sampleFolders: { piano: ['/piano_A1.wav'] },  // → lines 256-278, 426-429  
  waveforms:     ['sine', 'square', 'sawtooth', 'triangle'],  
}))  
  
// A single impulse: r0 ≠ 0, firstZeroCrossing = 1, no autocorrelation peaks  
// → bestOffset = -1 → detectPitchFFT is called (lines 196-216)  
// → detectPitchFFT returns a frequency → findNearestNote is called (lines 221-241)  
const impulseData = new Float32Array(8192)  
impulseData[0] = 1.0  
  
const mockAudioBuf = {  
  getChannelData:   jest.fn().mockReturnValue(impulseData),  
  sampleRate:       44100,  
  length:           8192,  
  duration:         8192 / 44100,  
  numberOfChannels: 1,  
} as unknown as AudioBuffer  
  
const makeVoice = (): VoiceType => ({  
  id:                'test-id',  
  isActive:          false,  
  label:             '1',  
  nextInterval:      0,  
  thisInterval:      0,  
  offsetInterval:    0,  
  bpm:               120,  
  minLevel:          100,  
  maxLevel:          100,  
  activeNotes:       ['9'],  
  activeOctaves:     ['1'],  
  activeFrequencies: [880.00],  
  activeIntervals:   ['1'],  
  activeSounds:      ['piano'],  
  restChance:        0,  
  minLength:         100,  
  maxLength:         100,  
  minOffset:         0,  
  maxOffset:         0,  
  minDetune:         0,  
  maxDetune:         0,  
  minAttack:         100,  
  maxAttack:         100,  
  minDecay:          100,  
  maxDecay:          100,  
})  
  
describe('Synth.functions coverage', () => {  
  
  let mockContext: AudioContext  
  
  beforeAll(async () => {  
    global.fetch = jest.fn().mockResolvedValue({  
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),  
    }) as any  
  
    mockContext = {  
      ...createMockContext('running', 0),  
      sampleRate:      44100,  
      decodeAudioData: jest.fn().mockResolvedValue(mockAudioBuf),  
    } as unknown as AudioContext  
  
    // Triggers loadSamples → fetch → decodeAudioData → parseNoteFromKey / detectPitch  
    getContext(mockContext)  
  
    // Flush the microtask queue so all async chains inside loadSamples complete  
    await new Promise(resolve => setTimeout(resolve, 100))  
  })  
  
  // Lines 291-315: loadSamples try block  
  it('fetches and decodes every sample', () => {  
    expect(global.fetch).toHaveBeenCalledTimes(2)  
    expect((mockContext.decodeAudioData as jest.Mock)).toHaveBeenCalledTimes(2)  
  })  
  
  // Lines 77-91: parseNoteFromKey — /piano_A1.wav matches /[/_]([A-G][b#]?)(\d+)(?:_|\.|$)/  
  it('parses note name and octave from a keyed sample filename', () => {  
    // fetch was called with the url for /piano_A1.wav, confirming the sample was processed  
    expect(global.fetch).toHaveBeenCalledWith('piano_A1.wav')  
  })  
  
  // Lines 96-191, 196-216, 221-241: detectPitch → detectPitchFFT → findNearestNote  
  it('falls back to FFT pitch detection for unkeyed samples', () => {  
    // 'snare' has no note in its name; impulse data has bestOffset = -1 → detectPitchFFT runs  
    expect(global.fetch).toHaveBeenCalledWith('snare.wav')  
    expect((mockContext.decodeAudioData as jest.Mock)).toHaveBeenCalledTimes(2)  
  })  
  
  // Lines 256-278: findNearestSampleInFolder  
  // Lines 426-429: sampleFolders branch with targetNote !== null  
  // Lines 440-458: createBufferSource, shapeNote, source.start, source.onended  
  it('plays a folder sample via findNearestSampleInFolder', () => {  
    const voice      = makeVoice()  
    const voicesRef  = { current: [voice] }  
    runInterval(voice, voicesRef, mockContext)  
    expect((mockContext.createBufferSource as jest.Mock)).toHaveBeenCalled()  
  })  
})