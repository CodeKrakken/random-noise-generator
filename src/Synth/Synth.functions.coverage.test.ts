import { getContext, runInterval } from './Synth.functions'  
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
    // Reset module state so samplesLoading = false  
    jest.resetModules()  
      
    // Re-import after reset to get fresh module instance  
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
  
    // This triggers loadSamples, which calls fetch  
    getContext(mockContext)  
      
    // Wait for async work to complete  
    await new Promise(resolve => setTimeout(resolve, 200))  
  })  
  
  it('fetches and decodes every sample', () => {  
    expect(global.fetch).toHaveBeenCalledTimes(2)  
    expect(mockContext.decodeAudioData as jest.Mock).toHaveBeenCalledTimes(2)  
  })  
})