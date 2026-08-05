import { VoiceType }                          from '../components/shared.types'
import { VoicesRef }                          from './Synth.types'
import { getContext, runInterval, playBack }  from './Synth.functions'
import { demoVoices }                         from '../content/data'

let context: AudioContext

export const Synth = {

  voices: demoVoices as VoiceType[],

  recordedHits: [],

  add: (
    voice     : VoiceType, 
    running   : boolean, 
    voicesRef : VoicesRef
  ) => {

    Synth.voices.push(voice)
    context = getContext(context)

    if (running) {
      voice.isActive = true
      runInterval(voice, voicesRef, context, Synth.recordedHits)
    }
  },

  delete: (i: number) => Synth.voices.splice(i, 1),

  update: (voice: VoiceType, i: number) => Synth.voices[i] = voice,

  start: (voicesRef: VoicesRef) => {

    Synth.resumeContext()
    
    Synth.voices.forEach(voice => {

      voice.nextInterval = context.currentTime
      voice.isActive = true

      runInterval(voice, voicesRef, context, Synth.recordedHits)
    })
  },

  stop: () => Synth.voices.forEach(voice => {
    voice.isActive = false
  }),

  replay: () => Synth.recordedHits.forEach(hit => {
    playBack(hit, context)
  }),

  resumeContext: () => context = getContext(context)
}