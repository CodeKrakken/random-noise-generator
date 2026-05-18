import { SoundSource } from '../../types'

export type voice = {
  isActive        : boolean
  label           : number
  thisInterval?   : number
  nextInterval    : number
  bpm             : number
  minLevel        : number
  maxLevel        : number
  activeNotes     : string[]
  activeOctaves   : string[]
  activeSounds    : string[]
  restChance      : number
  activeIntervals : string[]
  minLength       : number
  maxLength       : number
  minOffset       : number
  maxOffset       : number
  minDetune       : number
  maxDetune       : number
  minFadeIn       : number
  maxFadeIn       : number
  minFadeOut      : number
  maxFadeOut      : number
  oscillator?     : OscillatorNode
  gain?           : GainNode
  source?         : SoundSource
  sample?         : HTMLAudioElement
  sound?          : MediaElementAudioSourceNode
}

export type VoiceProps = {
  i           : number, 
  setVoices   : Function, 
  voices      : voice[], 
  handleDelete: Function
  dataVoice?     : number,
  dataAttribute? : string
}

export type Compound = 
  'activeNotes'
| 'activeOctaves'
| 'activeIntervals'
| 'activeSounds'
