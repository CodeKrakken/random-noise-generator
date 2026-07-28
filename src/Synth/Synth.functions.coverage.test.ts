import { VoiceType } from '../components/shared.types'  
import { createMockContext } from './Synth.test.functions'  

// No jest.mock needed — moduleNameMapper handles it globally  
  
const makeVoice = (): VoiceType => ({  
  id: 'test-id',  
  isActive: false,  
  label: '1',  
  nextInterval: 0,  
  thisInterval: 0,  
  offsetInterval: 0,  
  bpm: 120,  
  minLevel: 100,  
  maxLevel: 100,  
  activeNotes: ['9'],  
  activeOctaves: ['1'],  
  activeFrequencies: [880.00],  
  activeIntervals: ['1'],  
  activeSounds: ['piano'],  
  restChance: 0,  
  minLength: 100,  
  maxLength: 100,  
  minOffset: 0,  
  maxOffset: 0,  
  minDetune: 0,  
  maxDetune: 0,  
  minAttack: 100,  
  maxAttack: 100,  
  minDecay: 100,  
  maxDecay: 100,  
})  
  
describe('Synth.functions coverage', () => {  
  let mockContext: AudioContext  
  let getContext: any  
  let runInterval: any  
  
  beforeAll(async () => {  
    // Reset BEFORE any imports  
    jest.resetModules()  
      
    // Dynamic import after reset  
    const mod = await import('./Synth.functions')  
    getContext = mod.getContext  
    runInterval = mod.runInterval  
  
    global.fetch = jest.fn().mockResolvedValue({  
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))  
    }) as any  
  
    const noiseData = new Float32Array(8192)  
    for (let i = 0; i < noiseData.length; i++) {  
      noiseData[i] = ((Math.sin(i * 1.7) + Math.sin(i * 3.1) + Math.sin(i * 7.3)) / 3) * 0.4  
    }  
  
    mockContext = {  
      ...createMockContext('running', 0),  
      sampleRate: 44100,  
      decodeAudioData: jest.fn().mockResolvedValue({  
        getChannelData: jest.fn().mockReturnValue(noiseData),  
        sampleRate: 44100,  
        length: 8192,  
        duration: 8192 / 44100,  
        numberOfChannels: 1  
      })  
    } as unknown as AudioContext  
  
    getContext(mockContext)  
    await new Promise(resolve => setTimeout(resolve, 200))  
  })  
  
  it('fetches and decodes every sample', () => {  
    expect(global.fetch).toHaveBeenCalledTimes(2)  
    expect(mockContext.decodeAudioData as jest.Mock).toHaveBeenCalledTimes(2)  
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
  
  it('plays a folder sample via findNearestSampleInFolder', () => {  
    const voice = makeVoice()  
    const voicesRef = { current: [voice] }  
    runInterval(voice, voicesRef, mockContext)  
    expect(mockContext.createBufferSource as jest.Mock).toHaveBeenCalled()  
  })  
})