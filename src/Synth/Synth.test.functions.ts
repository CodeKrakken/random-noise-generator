import { VoiceType } from "../components/shared.types";
import { runInterval } from "./Synth.functions";

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

const runOneInterval = (
  voice: VoiceType,
  context: Partial<AudioContext>
) => {

  const voicesRef = { current: [voice] }

  runInterval(
    voice,
    voicesRef,
    context as AudioContext,
    []
  )

  voice.isActive = false
  jest.runAllTimers()
}

export { 
  createMockContext,
  runOneInterval
}