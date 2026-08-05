import { VoiceType }                          from '../components/shared.types'
import { Hit, VoicesRef }                          from './Synth.types'
import { getContext, runInterval, playBack }  from './Synth.functions'
import { demoVoices }                         from '../content/data'

let setup: {
  context: AudioContext | undefined
  masterGain: GainNode | undefined
} = {
  context:  undefined,
  masterGain: undefined
}

export const Synth = {

  voices: demoVoices as VoiceType[],

  recordedHits: [] as Hit[],

  add: (
    voice     : VoiceType, 
    running   : boolean, 
    voicesRef : VoicesRef
  ) => {

    Synth.voices.push(voice)

    if (running) {
      voice.isActive = true
      runInterval(voice, voicesRef, setup.context as AudioContext, Synth.recordedHits)
    }
  },

  delete: (i: number) => Synth.voices.splice(i, 1),

  update: (voice: VoiceType, i: number) => Synth.voices[i] = voice,

  start: (voicesRef: VoicesRef) => {

    const context = setup.context as AudioContext

    setup.masterGain!.gain.setValueAtTime(1, 0)

    Synth.voices.forEach(voice => {

      voice.nextInterval = context.currentTime
      voice.isActive = true

      runInterval(voice, voicesRef, context, Synth.recordedHits)
    })
  },

  stop: () => {
    setup.masterGain!.gain.setValueAtTime(0, 0)

    Synth.voices.forEach(voice => {
      voice.isActive = false;
    })
  },

  replay: async (setReplaying: React.Dispatch<React.SetStateAction<boolean>>) => { 

    Synth.recordedHits.forEach(hit => {
      setup.masterGain!.gain.setValueAtTime(1, 0)
      playBack(hit, setup.context as AudioContext)
    })
    setTimeout(() => setReplaying(false), Math.max(...Synth.recordedHits.map((hit as Hit) => hit.endTime)) * 1000)
  },

  resumeContext: () => setup = getContext(setup)
}