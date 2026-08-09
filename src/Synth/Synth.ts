import { VoiceType }                        from '../components/shared.types'
import { Hit, VoicesRef }                   from './Synth.types'
import { getContext, runInterval, playHit, removeSource } from './Synth.functions'
import { demoVoices }                       from '../content/data'
import { Dispatch, SetStateAction } from 'react'

let setup: {
  context: AudioContext | undefined
  masterGain: GainNode | undefined
} = {
  context:  undefined,
  masterGain: undefined
}

let runStartTime: number

export const Synth = {

  voices: demoVoices as VoiceType[],

  recordedHits: [] as Hit[],

  setRecordedHits: undefined as Dispatch<SetStateAction<Hit[]>> | undefined,

  resumeContext: () => setup = getContext(setup),

  add: (
    voice     : VoiceType, 
    running   : boolean, 
    voicesRef : VoicesRef
  ) => {

    Synth.voices.push(voice)

    if (running) {
      voice.isActive = true
      runInterval(voice, voicesRef, setup.context as AudioContext, Synth.recordedHits, runStartTime, Synth.setRecordedHits!)
    }
  },

  delete: (i: number) => Synth.voices.splice(i, 1),

  update: (voice: VoiceType, i: number) => Synth.voices[i] = voice,

  start: (voicesRef: VoicesRef) => {

    const context = setup.context as AudioContext

    setup.masterGain!.gain.setValueAtTime(1, 0)

    runStartTime = context.currentTime

    Synth.voices.forEach(voice => {

      voice.nextInterval = context.currentTime
      voice.isActive = true

      runInterval(voice, voicesRef, context, Synth.recordedHits, runStartTime, Synth.setRecordedHits!)
    })
  },

  stop: () => {
    setup.masterGain!.gain.setValueAtTime(0, 0)
    Synth.recordedHits.map(hit => hit.source && removeSource(hit.source))
    Synth.voices.forEach(voice => {
      voice.isActive = false;
    })
  },

  replay: (setReplaying: React.Dispatch<React.SetStateAction<boolean>>) => {

    const context = setup.context!
    const runStartTime = context.currentTime

    const finalHit = Synth.recordedHits.reduce(
      (latest, hit) =>
        (hit.endTime ?? 0) > (latest.endTime ?? 0) ? hit : latest
    )

    Synth.recordedHits.forEach(hit => {
      setup.masterGain!.gain.setValueAtTime(1, 0)

      playHit(
        hit,
        context,
        runStartTime,
        hit === finalHit
          ? () => setReplaying(false)
          : undefined
      )
    })
  },
}