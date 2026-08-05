import { VoiceType }                from '../components/shared.types'
import { VoicesRef }                from './Synth.types'
import { getContext, runInterval }  from './Synth.functions'
import { demoVoices }               from '../content/data'

let context: AudioContext

export const Synth = {

  voices: demoVoices as VoiceType[],

  add: (
    voice     : VoiceType, 
    running   : boolean, 
    voicesRef : VoicesRef
  ) => {

    Synth.voices.push(voice)
    context = getContext(context)

    if (running) {
      voice.isActive = true
      runInterval(voice, voicesRef, context)
    }
  },

  delete: (i: number) => Synth.voices.splice(i, 1),

  update: (voice: VoiceType, i: number) => Synth.voices[i] = voice,

  start: (voicesRef: VoicesRef) => {
    Synth.voices.forEach(voice => {

      voice.nextInterval = context.currentTime
      voice.isActive = true

      runInterval(voice, voicesRef, context)
    })
  },

  stop: () => Synth.voices.forEach(voice => voice.isActive = false),

  resumeContext: () => context = getContext(context)
}